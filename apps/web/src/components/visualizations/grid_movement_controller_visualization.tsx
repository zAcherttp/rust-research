"use client";

import { env } from "@rust-research/env/web";
import { cn } from "@rust-research/ui/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Circle,
  CornerDownRight,
  LoaderCircle,
  Server,
} from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";

type MovementDirection = "up" | "down" | "left" | "right";
type ActionSource = "tap" | "hold";
type SocketStatus = "connecting" | "open" | "closed" | "error";

interface GridPosition {
  x: number;
  y: number;
}

interface MovementAction {
  id: string;
  direction: MovementDirection;
  source: ActionSource;
  createdAt: number;
}

interface ServerInFlightAction {
  action: MovementAction;
  from: GridPosition;
  predicted: GridPosition;
  requestStartedAt: number;
}

interface ConsumeActionMessage {
  type: "consume_action";
  requestId: string;
  action: MovementDirection;
  delayMs: number;
  gridSize: number;
  position: GridPosition;
}

interface ActionAckMessage {
  type: "action_ack";
  requestId: string;
  position: GridPosition;
  serverTime: string;
  consumedAction: MovementDirection;
  delayMs: number;
}

interface SocketErrorMessage {
  type: "error";
  error: string;
  requestId?: string;
}

const GRID_SIZE = 9;
const QUEUE_CAPACITY = 1;
const HOLD_STACK_LIMIT = 1;
const DEFAULT_DELAY = 420;
const MOVE_STEP_MS = 180;
const HOLD_ACTIVATION_MS = 90;
const HOLD_TOP_UP_MS = 150;
const OBSTACLE_COORDS: GridPosition[] = [
  { x: 2, y: 1 },
  { x: 5, y: 1 },
  { x: 1, y: 3 },
  { x: 3, y: 3 },
  { x: 5, y: 3 },
  { x: 7, y: 3 },
  { x: 2, y: 5 },
  { x: 6, y: 5 },
  { x: 3, y: 7 },
  { x: 5, y: 7 },
];
const OBSTACLE_KEYS = new Set(
  OBSTACLE_COORDS.map((position) => createPositionKey(position)),
);

const KEY_TO_DIRECTION: Record<string, MovementDirection> = {
  w: "up",
  a: "left",
  s: "down",
  d: "right",
};

const DIRECTION_META: Record<
  MovementDirection,
  {
    keyLabel: string;
    label: string;
    icon: typeof ArrowUp;
    delta: GridPosition;
    chipClassName: string;
  }
> = {
  up: {
    keyLabel: "W",
    label: "Up",
    icon: ArrowUp,
    delta: { x: 0, y: -1 },
    chipClassName: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  },
  down: {
    keyLabel: "S",
    label: "Down",
    icon: ArrowUp,
    delta: { x: 0, y: 1 },
    chipClassName: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
  left: {
    keyLabel: "A",
    label: "Left",
    icon: ArrowLeft,
    delta: { x: -1, y: 0 },
    chipClassName: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  },
  right: {
    keyLabel: "D",
    label: "Right",
    icon: ArrowRight,
    delta: { x: 1, y: 0 },
    chipClassName: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  },
};

export function GridMovementControllerVisualization() {
  const center = { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) };
  const socketUrl = useMemo(() => {
    return createWebSocketUrl(
      env.NEXT_PUBLIC_SERVER_URL,
      "/ws/visualizations/grid-movement",
    );
  }, []);

  const [queue, setQueue] = useState<MovementAction[]>([]);
  const [serverBacklog, setServerBacklog] = useState<MovementAction[]>([]);
  const [clientPosition, setClientPosition] = useState<GridPosition>(center);
  const [serverPosition, setServerPosition] = useState<GridPosition>(center);
  const [serverInFlight, setServerInFlight] =
    useState<ServerInFlightAction | null>(null);
  const [serverDelayMs, setServerDelayMs] = useState(DEFAULT_DELAY);
  const [statusMessage, setStatusMessage] = useState(
    "Press or hold W A S D to enqueue movement.",
  );
  const [lastServerAckAt, setLastServerAckAt] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [activeKeys, setActiveKeys] = useState<MovementDirection[]>([]);
  const [socketStatus, setSocketStatus] = useState<SocketStatus>("connecting");
  const [showClientState, setShowClientState] = useState(true);
  const [showServerState, setShowServerState] = useState(true);

  const queueRef = useRef(queue);
  const serverBacklogRef = useRef(serverBacklog);
  const clientPositionRef = useRef(clientPosition);
  const serverPositionRef = useRef(serverPosition);
  const serverInFlightRef = useRef(serverInFlight);
  const motorTimerRef = useRef<number | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    serverBacklogRef.current = serverBacklog;
  }, [serverBacklog]);

  useEffect(() => {
    clientPositionRef.current = clientPosition;
  }, [clientPosition]);

  useEffect(() => {
    serverPositionRef.current = serverPosition;
  }, [serverPosition]);

  useEffect(() => {
    serverInFlightRef.current = serverInFlight;
  }, [serverInFlight]);

  const holdBufferedCount = queue.filter(
    (action) => action.source === "hold",
  ).length;
  const serverPendingCount = serverBacklog.length + (serverInFlight ? 1 : 0);

  const enqueueMovement = useEffectEvent(
    (
      direction: MovementDirection,
      source: ActionSource,
      options?: { silent?: boolean },
    ) => {
      setQueue((currentQueue) => {
        const result = resolveQueueUpdate(currentQueue, direction, source);

        if (!options?.silent && result.statusMessage) {
          setStatusMessage(result.statusMessage);
        }

        return result.nextQueue;
      });
    },
  );

  const stepClientMotor = useEffectEvent(() => {
    const currentQueue = queueRef.current;

    if (currentQueue.length === 0) {
      motorTimerRef.current = null;
      return;
    }

    const [nextAction, ...rest] = currentQueue;
    queueRef.current = rest;
    setQueue(rest);

    const nextPosition = applyMovement(
      clientPositionRef.current,
      nextAction.direction,
    );
    const isBlocked = positionsEqual(nextPosition, clientPositionRef.current);

    clientPositionRef.current = nextPosition;
    setClientPosition(nextPosition);
    setServerBacklog((currentBacklog) => [...currentBacklog, nextAction]);

    const nextDirection = rest[0]?.direction;
    const message = isBlocked
      ? `${DIRECTION_META[nextAction.direction].label} blocked by obstacle.`
      : nextDirection === nextAction.direction
        ? `Continuing ${DIRECTION_META[nextAction.direction].label} at constant speed.`
        : `Moved ${DIRECTION_META[nextAction.direction].label}.`;
    setStatusMessage(message);

    motorTimerRef.current = window.setTimeout(stepClientMotor, MOVE_STEP_MS);
  });

  useEffect(() => {
    if (queue.length === 0 || motorTimerRef.current !== null) {
      return;
    }

    stepClientMotor();
  }, [queue.length]);

  const restoreInFlightAction = useEffectEvent(() => {
    const currentInFlight = serverInFlightRef.current;

    if (!currentInFlight) {
      return;
    }

    serverInFlightRef.current = null;
    setServerInFlight(null);
    setServerBacklog((currentBacklog) => {
      const nextBacklog = [currentInFlight.action, ...currentBacklog];
      serverBacklogRef.current = nextBacklog;
      return nextBacklog;
    });
  });

  const flushServerBacklog = useEffectEvent(() => {
    const socket = socketRef.current;
    if (
      !socket ||
      socket.readyState !== WebSocket.OPEN ||
      serverInFlightRef.current ||
      serverBacklogRef.current.length === 0
    ) {
      return;
    }

    const [nextAction, ...rest] = serverBacklogRef.current;
    serverBacklogRef.current = rest;
    setServerBacklog(rest);

    const from = serverPositionRef.current;
    const predicted = applyMovement(from, nextAction.direction);
    const nextInFlight = {
      action: nextAction,
      from,
      predicted,
      requestStartedAt: performance.now(),
    } satisfies ServerInFlightAction;

    serverInFlightRef.current = nextInFlight;
    setServerInFlight(nextInFlight);
    setServerError(null);

    const message = {
      type: "consume_action",
      requestId: nextAction.id,
      action: nextAction.direction,
      delayMs: serverDelayMs,
      gridSize: GRID_SIZE,
      position: from,
    } satisfies ConsumeActionMessage;

    try {
      socket.send(JSON.stringify(message));
    } catch {
      restoreInFlightAction();
      setServerError("Failed to send action over websocket.");
    }
  });

  useEffect(() => {
    flushServerBacklog();
  }, []);

  const onSocketMessage = useEffectEvent((event: MessageEvent<string>) => {
    let payload: ActionAckMessage | SocketErrorMessage;

    try {
      payload = JSON.parse(event.data) as ActionAckMessage | SocketErrorMessage;
    } catch {
      setServerError("Received malformed websocket response.");
      return;
    }

    if (payload.type === "error") {
      setServerError(payload.error);
      setServerInFlight(null);
      serverInFlightRef.current = null;
      return;
    }

    const currentInFlight = serverInFlightRef.current;
    if (!currentInFlight || currentInFlight.action.id !== payload.requestId) {
      return;
    }

    serverPositionRef.current = payload.position;
    setServerPosition(payload.position);
    setLastServerAckAt(payload.serverTime);
    setServerInFlight(null);
    serverInFlightRef.current = null;
    setServerError(null);
    flushServerBacklog();
  });

  useEffect(() => {
    let reconnectTimeoutId: number | null = null;
    let disposed = false;

    const connect = () => {
      if (disposed) {
        return;
      }

      setSocketStatus("connecting");

      const socket = new WebSocket(socketUrl);
      socketRef.current = socket;

      socket.addEventListener("open", () => {
        if (disposed || socketRef.current !== socket) {
          return;
        }

        setSocketStatus("open");
        setServerError(null);
        flushServerBacklog();
      });

      socket.addEventListener("message", (event) => {
        if (disposed || socketRef.current !== socket) {
          return;
        }

        onSocketMessage(event as MessageEvent<string>);
      });

      socket.addEventListener("error", () => {
        if (disposed || socketRef.current !== socket) {
          return;
        }

        setSocketStatus("error");
        setServerError("Websocket transport error.");
      });

      socket.addEventListener("close", () => {
        if (socketRef.current === socket) {
          socketRef.current = null;
        }

        if (disposed) {
          return;
        }

        restoreInFlightAction();
        setSocketStatus("closed");
        setServerError("Websocket disconnected. Reconnecting...");
        reconnectTimeoutId = window.setTimeout(connect, 700);
      });
    };

    connect();

    return () => {
      disposed = true;
      if (reconnectTimeoutId !== null) {
        window.clearTimeout(reconnectTimeoutId);
      }
      const socket = socketRef.current;
      socketRef.current = null;

      if (!socket) {
        return;
      }

      if (socket.readyState === WebSocket.CONNECTING) {
        socket.addEventListener(
          "open",
          () => {
            socket.close();
          },
          { once: true },
        );
        return;
      }

      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [socketUrl]);

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const direction = KEY_TO_DIRECTION[event.key.toLowerCase()];
    if (!direction) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
      return;
    }

    event.preventDefault();

    if (event.repeat) {
      return;
    }

    setActiveKeys((current) => {
      if (current.includes(direction)) {
        return current;
      }

      return [...current, direction];
    });

    enqueueMovement(direction, "tap");
  });

  const onKeyUp = useEffectEvent((event: KeyboardEvent) => {
    const direction = KEY_TO_DIRECTION[event.key.toLowerCase()];
    if (!direction) {
      return;
    }

    setActiveKeys((current) => current.filter((key) => key !== direction));
  });

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    if (activeKeys.length !== 1) {
      return;
    }

    const heldDirection = activeKeys[0];
    let intervalId: number | null = null;

    const timeoutId = window.setTimeout(() => {
      enqueueMovement(heldDirection, "hold", { silent: true });

      intervalId = window.setInterval(() => {
        enqueueMovement(heldDirection, "hold", { silent: true });
      }, HOLD_TOP_UP_MS);
    }, HOLD_ACTIVATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
    };
  }, [activeKeys]);

  useEffect(() => {
    return () => {
      if (motorTimerRef.current !== null) {
        window.clearTimeout(motorTimerRef.current);
      }
    };
  }, []);

  const resetSimulation = () => {
    if (motorTimerRef.current !== null) {
      window.clearTimeout(motorTimerRef.current);
      motorTimerRef.current = null;
    }

    queueRef.current = [];
    serverBacklogRef.current = [];
    clientPositionRef.current = center;
    serverPositionRef.current = center;
    serverInFlightRef.current = null;

    setQueue([]);
    setServerBacklog([]);
    setClientPosition(center);
    setServerPosition(center);
    setServerInFlight(null);
    setServerError(null);
    setLastServerAckAt(null);
    setActiveKeys([]);
    setStatusMessage("Simulation reset.");
  };

  const queueSlots = useMemo(() => {
    return Array.from({ length: QUEUE_CAPACITY }, (_, index) => ({
      slot: index + 1,
      action: queue[index] ?? null,
    }));
  }, [queue]);

  return (
    <div className="relative min-h-svh overflow-x-hidden bg-background text-foreground">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:52px_52px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.12),transparent_32%)]" />

      <main className="relative mx-auto flex min-h-svh w-full max-w-[1600px] flex-col px-6 py-6 lg:px-10">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-6 border-border/60 border-b pb-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-4xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-muted-foreground text-xs uppercase tracking-[0.22em] backdrop-blur transition-colors hover:text-foreground"
            >
              <CornerDownRight className="h-3.5 w-3.5" />
              Back to library
            </Link>
            <h1 className="mt-4 max-w-5xl font-black text-4xl tracking-tight sm:text-5xl lg:text-6xl">
              Grid based 2d character movement controller visualization
            </h1>
            <p className="mt-4 max-w-3xl text-base text-muted-foreground leading-relaxed sm:text-lg">
              The client motor runs at a constant tile cadence. The server
              confirms actions later with its own configurable delay, while
              straight-line inputs keep flowing until the queued signal changes.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-4 lg:min-w-[44rem]">
            <MetricTile
              label="Queue"
              value={`${queue.length}/${QUEUE_CAPACITY}`}
            />
            <MetricTile
              label="Hold stack"
              value={`${holdBufferedCount}/${HOLD_STACK_LIMIT}`}
            />
            <MetricTile
              label="Server pending"
              value={`${serverPendingCount}`}
            />
            <MetricTile label="Socket" value={socketStatus.toUpperCase()} />
          </div>
        </motion.header>

        <section className="grid flex-1 gap-8 pt-8 xl:grid-cols-[minmax(0,1.25fr)_28rem]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.35 }}
            className="rounded-[2rem] border border-border/70 bg-background/70 p-5 backdrop-blur"
          >
            <div className="flex flex-col gap-5 border-border/50 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-medium text-muted-foreground text-sm">
                  Character plane
                </p>
                <p className="mt-1 text-muted-foreground/80 text-sm">
                  Toggle the client ball and server outline independently to
                  inspect local prediction versus delayed server authority.
                </p>
              </div>
              <button
                type="button"
                onClick={resetSimulation}
                className="inline-flex h-11 items-center justify-center rounded-full border border-border/70 px-5 font-medium text-sm transition-colors hover:bg-muted"
              >
                Reset simulation
              </button>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_15rem]">
              <LayoutGroup>
                <div className="rounded-[1.75rem] border border-border/70 bg-zinc-950/45 p-4">
                  <div className="max-h-[70svh] overflow-auto overscroll-contain rounded-[1.25rem]">
                    <div className="grid aspect-square min-h-[32rem] min-w-[32rem] grid-cols-9 gap-2 sm:min-h-[36rem] sm:min-w-[36rem]">
                      {Array.from(
                        { length: GRID_SIZE * GRID_SIZE },
                        (_, index) => {
                          const x = index % GRID_SIZE;
                          const y = Math.floor(index / GRID_SIZE);
                          const isObstacle = isBlockedPosition({ x, y });
                          const isClientCell =
                            clientPosition.x === x && clientPosition.y === y;
                          const isServerCell =
                            serverPosition.x === x && serverPosition.y === y;

                          return (
                            <div
                              key={`${x}-${y}`}
                              className={cn(
                                "relative rounded-xl border border-white/6 bg-white/[0.03]",
                                isObstacle &&
                                  "border-rose-400/15 bg-linear-to-br from-rose-500/20 via-red-500/12 to-stone-950/70",
                              )}
                            >
                              <span className="absolute top-2 left-2 select-none text-[0.55rem] text-white/18">
                                {x},{y}
                              </span>

                              {isObstacle ? (
                                <div className="absolute inset-0 rounded-xl bg-[linear-gradient(135deg,transparent_0_42%,rgba(251,113,133,0.28)_42%_49%,transparent_49%_51%,rgba(251,113,133,0.28)_51%_58%,transparent_58%_100%)] opacity-90" />
                              ) : null}

                              {isClientCell && showClientState ? (
                                <motion.div
                                  layoutId="client-player"
                                  transition={{
                                    duration: MOVE_STEP_MS / 1000,
                                    ease: "linear",
                                  }}
                                  className="absolute inset-3 rounded-full bg-linear-to-br from-emerald-300 via-emerald-400 to-teal-300 shadow-[0_0_0_5px_rgba(16,185,129,0.12),0_0_28px_rgba(52,211,153,0.28)]"
                                />
                              ) : null}

                              {isServerCell && showServerState ? (
                                <motion.div
                                  layoutId="server-player"
                                  transition={{
                                    duration: MOVE_STEP_MS / 1000,
                                    ease: "linear",
                                  }}
                                  className="absolute inset-2.5 rounded-full border-[3px] border-sky-300/90 bg-transparent shadow-[0_0_0_6px_rgba(56,189,248,0.08),0_0_34px_rgba(56,189,248,0.3)]"
                                />
                              ) : null}
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <LegendPill
                      active={showClientState}
                      onClick={() => setShowClientState((current) => !current)}
                      swatchClassName="bg-linear-to-br from-emerald-300 via-emerald-400 to-teal-300"
                      label="Instant client state"
                    />
                    <LegendPill
                      active={showServerState}
                      onClick={() => setShowServerState((current) => !current)}
                      swatchClassName="border-[2px] border-sky-300/90 bg-transparent"
                      label="Server state"
                    />
                  </div>
                </div>
              </LayoutGroup>

              <div className="flex flex-col gap-4">
                <Panel title="Input legend" subtitle="Keyboard semantics">
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      ["up", "left", "down", "right"] as MovementDirection[]
                    ).map((direction) => {
                      const meta = DIRECTION_META[direction];
                      const Icon = meta.icon;
                      const isPressed = activeKeys.includes(direction);

                      return (
                        <div
                          key={direction}
                          className={cn(
                            "rounded-2xl border border-border/70 bg-muted/30 p-3 transition-colors",
                            isPressed && "border-sky-400/45 bg-sky-400/8",
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div className="rounded-full border border-border/70 p-2">
                              <Icon
                                className={cn(
                                  "h-4 w-4",
                                  direction === "down" && "rotate-180",
                                )}
                              />
                            </div>
                            <div>
                              <p className="font-semibold">{meta.keyLabel}</p>
                              <p className="text-muted-foreground text-xs">
                                {meta.label}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Tap once to enqueue one move. Holding a single key silently
                    tops the queue back up so straight movement keeps flowing.
                    There is only one buffered queue slot.
                  </p>
                </Panel>

                <Panel title="Server consumer" subtitle="Delayed confirmation">
                  <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                    <div className="flex items-center gap-3">
                      {socketStatus === "open" ? (
                        <Circle className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                      ) : socketStatus === "connecting" ? (
                        <LoaderCircle className="h-4 w-4 animate-spin text-sky-500" />
                      ) : (
                        <Circle className="h-4 w-4 fill-amber-400 text-amber-400" />
                      )}
                      <div>
                        <p className="font-medium">Persistent websocket link</p>
                        <p className="text-muted-foreground text-xs">
                          {socketStatus === "open"
                            ? "Connected to the simulation server."
                            : "Socket reconnects automatically if the server drops."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full border border-border/70 bg-background/70 p-2">
                          <Server className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">Server delay</p>
                          <p className="text-muted-foreground text-xs">
                            Websocket transport stays open. Only the simulated
                            authority delay changes.
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-lg">
                        {serverDelayMs}ms
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={1400}
                      step={20}
                      value={serverDelayMs}
                      onChange={(event) =>
                        setServerDelayMs(Number(event.target.value))
                      }
                      className="mt-4 w-full accent-sky-500"
                    />
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                    <div className="flex items-center gap-3">
                      {serverInFlight ? (
                        <LoaderCircle className="h-4 w-4 animate-spin text-sky-500" />
                      ) : (
                        <Circle className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                      )}
                      <div>
                        <p className="font-medium">
                          {serverInFlight
                            ? `Confirming ${DIRECTION_META[serverInFlight.action.direction].label}`
                            : "Idle"}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {lastServerAckAt
                            ? `Last ack: ${new Date(lastServerAckAt).toLocaleTimeString()}`
                            : "No server response yet"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Panel>
              </div>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
            className="flex flex-col gap-5"
          >
            <Panel title="Action queue" subtitle="Client-side pending actions">
              <div className="space-y-3">
                {queueSlots.map((slot) => (
                  <QueueSlot key={slot.slot} slot={slot} />
                ))}
              </div>
            </Panel>

            <Panel title="Current request" subtitle="Server confirmation">
              <div className="rounded-[1.5rem] border border-border/70 bg-muted/30 p-4">
                {serverInFlight ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <LoaderCircle className="h-4 w-4 animate-spin text-sky-500" />
                      <div>
                        <p className="font-medium">
                          {
                            DIRECTION_META[serverInFlight.action.direction]
                              .label
                          }{" "}
                          in flight
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Client already moved. Server is catching up.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <MiniStat
                        label="Server from"
                        value={`${serverInFlight.from.x}, ${serverInFlight.from.y}`}
                      />
                      <MiniStat
                        label="Server target"
                        value={`${serverInFlight.predicted.x}, ${serverInFlight.predicted.y}`}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    The server is idle. New locally executed actions will appear
                    here until they are confirmed.
                  </p>
                )}
              </div>
            </Panel>

            <Panel title="Stack rules" subtitle="What this simulation enforces">
              <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
                <RuleRow label="Tap buffer">
                  Any single press adds one move, up to 1 queued action.
                </RuleRow>
                <RuleRow label="Hold buffer">
                  A single held direction silently keeps up to 1 hold-generated
                  move buffered.
                </RuleRow>
                <RuleRow label="Straight runs">
                  Consecutive same-direction actions chain at a fixed cadence,
                  so the player does not visibly stop between tiles.
                </RuleRow>
              </div>
            </Panel>

            <Panel title="Runtime status" subtitle="Live feedback">
              <div className="rounded-[1.5rem] border border-border/70 bg-background/60 p-4">
                <p className="font-medium text-foreground">{statusMessage}</p>
                {serverError ? (
                  <p className="mt-3 text-red-400 text-sm">{serverError}</p>
                ) : null}
              </div>
            </Panel>
          </motion.aside>
        </section>
      </main>
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 backdrop-blur">
      <p className="text-muted-foreground text-xs uppercase tracking-[0.18em]">
        {label}
      </p>
      <p className="mt-2 font-semibold text-foreground">{value}</p>
    </div>
  );
}

function LegendPill({
  active,
  onClick,
  swatchClassName,
  label,
}: {
  active: boolean;
  onClick: () => void;
  swatchClassName: string;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm backdrop-blur transition-colors",
        active
          ? "border-border/70 bg-background/65 text-foreground"
          : "border-border/50 bg-background/35 text-muted-foreground/65",
      )}
    >
      <span className={cn("h-3.5 w-3.5 rounded-full", swatchClassName)} />
      <span>{label}</span>
    </button>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-border/70 bg-background/70 p-5 backdrop-blur">
      <div className="border-border/50 border-b pb-4">
        <p className="font-semibold text-lg">{title}</p>
        <p className="mt-1 text-muted-foreground text-sm">{subtitle}</p>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function QueueSlot({
  slot,
}: {
  slot: {
    slot: number;
    action: MovementAction | null;
  };
}) {
  return (
    <div className="rounded-[1.5rem] border border-border/70 bg-muted/30 p-4 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">Slot {slot.slot}</p>
          <p className="text-muted-foreground text-xs">Single queue slot</p>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.18em]",
            slot.action
              ? DIRECTION_META[slot.action.direction].chipClassName
              : "border border-border/70 bg-background/70 text-muted-foreground",
          )}
        >
          {slot.action ? slot.action.source : "empty"}
        </span>
      </div>

      <AnimatePresence mode="popLayout">
        {slot.action ? (
          <motion.div
            key={slot.action.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 flex min-h-[4.75rem] items-center justify-between rounded-2xl border border-border/60 bg-background/80 px-4 py-3"
          >
            <div>
              <p className="font-semibold">
                {DIRECTION_META[slot.action.direction].keyLabel} ·{" "}
                {DIRECTION_META[slot.action.direction].label}
              </p>
              <p className="text-muted-foreground text-xs">
                {slot.action.source === "hold"
                  ? "Generated by hold buffer"
                  : "Generated by single press"}
              </p>
            </div>
            <span className="font-mono text-muted-foreground text-sm">
              +1 unit
            </span>
          </motion.div>
        ) : (
          <motion.div
            key={`empty-${slot.slot}`}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex min-h-[4.75rem] items-center rounded-2xl border border-border/60 border-dashed px-4 py-3 text-muted-foreground text-sm"
          >
            Waiting for input
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
      <p className="text-muted-foreground text-xs uppercase tracking-[0.18em]">
        {label}
      </p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}

function RuleRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
      <p className="font-medium text-foreground">{label}</p>
      <p className="mt-2">{children}</p>
    </div>
  );
}

function resolveQueueUpdate(
  currentQueue: MovementAction[],
  direction: MovementDirection,
  source: ActionSource,
) {
  if (source === "hold") {
    const holdCount = currentQueue.filter(
      (action) => action.source === "hold" && action.direction === direction,
    ).length;

    if (holdCount >= HOLD_STACK_LIMIT) {
      return {
        nextQueue: currentQueue,
        statusMessage: null,
      };
    }
  }

  const nextAction = createMovementAction(direction, source);

  if (currentQueue.length < QUEUE_CAPACITY) {
    return {
      nextQueue: [...currentQueue, nextAction],
      statusMessage:
        source === "hold" ? null : `${DIRECTION_META[direction].label} queued.`,
    };
  }

  return {
    nextQueue: currentQueue,
    statusMessage:
      source === "hold"
        ? null
        : "Queue full. Wait for the buffered move to start.",
  };
}

function createMovementAction(
  direction: MovementDirection,
  source: ActionSource,
): MovementAction {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    direction,
    source,
    createdAt: Date.now(),
  };
}

function applyMovement(
  position: GridPosition,
  direction: MovementDirection,
): GridPosition {
  const delta = DIRECTION_META[direction].delta;
  const nextPosition = {
    x: clamp(position.x + delta.x, 0, GRID_SIZE - 1),
    y: clamp(position.y + delta.y, 0, GRID_SIZE - 1),
  };

  return isBlockedPosition(nextPosition) ? position : nextPosition;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createPositionKey(position: GridPosition) {
  return `${position.x},${position.y}`;
}

function isBlockedPosition(position: GridPosition) {
  return OBSTACLE_KEYS.has(createPositionKey(position));
}

function positionsEqual(left: GridPosition, right: GridPosition) {
  return left.x === right.x && left.y === right.y;
}

function createWebSocketUrl(baseUrl: string, pathname: string) {
  const url = new URL(pathname, baseUrl);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
}
