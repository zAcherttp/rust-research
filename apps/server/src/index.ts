import { trpcServer } from "@hono/trpc-server";
import { createContext } from "@rust-research/api/context";
import { appRouter } from "@rust-research/api/routers/index";
import { env } from "@rust-research/env/server";
import { createBunWebSocket } from "hono/bun";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

type MovementDirection = "up" | "down" | "left" | "right";

interface GridPosition {
  x: number;
  y: number;
}

interface ConsumeActionMessage {
  type: "consume_action";
  requestId: string;
  action?: MovementDirection;
  delayMs?: number;
  gridSize?: number;
  position?: GridPosition;
}

interface ActionAckMessage {
  type: "action_ack";
  requestId: string;
  position: GridPosition;
  serverTime: string;
  consumedAction: MovementDirection;
  delayMs: number;
}

interface ErrorMessage {
  type: "error";
  error: string;
  requestId?: string;
}

const DIRECTION_DELTAS: Record<MovementDirection, GridPosition> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const { upgradeWebSocket, websocket } = createBunWebSocket();
const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      return createContext({ context });
    },
  }),
);

app.get(
  "/ws/visualizations/grid-movement",
  upgradeWebSocket(() => ({
    async onMessage(event, ws) {
      const message = await parseConsumeMessage(event.data);

      if (!message.ok) {
        ws.send(
          JSON.stringify({
            type: "error",
            error: message.error,
          } satisfies ErrorMessage),
        );
        return;
      }

      const payload = message.value;
      const delta = DIRECTION_DELTAS[payload.action];
      const safeDelay = clamp(Math.round(payload.delayMs ?? 0), 0, 2000);
      const safeGridSize = clamp(Math.round(payload.gridSize), 2, 32);

      await sleep(safeDelay);

      const nextPosition = {
        x: clamp(payload.position.x + delta.x, 0, safeGridSize - 1),
        y: clamp(payload.position.y + delta.y, 0, safeGridSize - 1),
      };

      ws.send(
        JSON.stringify({
          type: "action_ack",
          requestId: payload.requestId,
          position: nextPosition,
          serverTime: new Date().toISOString(),
          consumedAction: payload.action,
          delayMs: safeDelay,
        } satisfies ActionAckMessage),
      );
    },
  })),
);

app.get("/", (c) => {
  return c.text("OK");
});

export default {
  fetch: app.fetch,
  websocket,
};

async function parseConsumeMessage(raw: string | ArrayBufferLike | Blob) {
  try {
    const text =
      typeof raw === "string"
        ? raw
        : raw instanceof Blob
          ? await raw.text()
          : Buffer.from(raw).toString("utf8");

    const parsed = JSON.parse(
      text,
    ) as Partial<ConsumeActionMessage>;

    if (
      parsed.type !== "consume_action" ||
      typeof parsed.requestId !== "string" ||
      !parsed.action ||
      !parsed.position ||
      typeof parsed.gridSize !== "number" ||
      !DIRECTION_DELTAS[parsed.action]
    ) {
      return {
        ok: false as const,
        error: "Invalid movement payload.",
      };
    }

    return {
      ok: true as const,
      value: {
        type: "consume_action" as const,
        requestId: parsed.requestId,
        action: parsed.action,
        delayMs: parsed.delayMs,
        gridSize: parsed.gridSize,
        position: parsed.position,
      } satisfies ConsumeActionMessage,
    };
  } catch {
    return {
      ok: false as const,
      error: "Malformed websocket payload.",
    };
  }
}

function sleep(delayMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
