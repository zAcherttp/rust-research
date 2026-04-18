"use client";

import { Button } from "@rust-research/ui/components/button";
import { cn } from "@rust-research/ui/lib/utils";
import CryptoJS from "crypto-js";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type CipherMode = "encrypt" | "decrypt";

interface AesFrame {
  id: string;
  label: string;
  eyebrow: string;
  description: string;
  formula: string;
  state: string[][];
}

interface ByteDescriptor {
  index: number;
  hex: string;
  decimal: number;
  bits: string[];
  charLabel: string;
}

interface AesPreview {
  frames: AesFrame[];
  blockHex: string;
  blockBytes: ByteDescriptor[];
  keyState: string[][];
  roundOneKeyState: string[][];
  output: string;
  error: string | null;
  blockNote: string;
  scopeNote: string;
}

const DEFAULT_AES_KEY = "000102030405060708090A0B0C0D0E0F";

const AES_SBOX = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe,
  0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4,
  0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7,
  0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3,
  0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09,
  0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3,
  0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe,
  0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85,
  0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92,
  0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c,
  0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19,
  0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14,
  0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2,
  0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5,
  0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25,
  0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86,
  0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e,
  0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42,
  0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16,
];

const AES_INV_SBOX = buildInverseSBox(AES_SBOX);
const AES_RCON = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

export function CipherFlowVisualization() {
  const [mode, setMode] = useState<CipherMode>("encrypt");
  const [textInput, setTextInput] = useState("CipherFlow demo");
  const [aesKeyHex, setAesKeyHex] = useState(DEFAULT_AES_KEY);
  const [step, setStep] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const previousBlockHexRef = useRef<string | null>(null);

  const preview = buildAesPreview(textInput, aesKeyHex, mode);
  const previousBlockHex = previousBlockHexRef.current ?? preview.blockHex;
  const previousBlockPairs = previousBlockHex.match(/.{1,2}/g) ?? [];

  const maxStep = Math.max(0, preview.frames.length - 1);
  const stageIndex = Math.min(step, maxStep);
  const currentFrame = preview.frames[stageIndex] ?? preview.frames[0];
  const previousFrame =
    preview.frames[Math.max(0, stageIndex - 1)] ?? currentFrame;

  const outputTitle = mode === "encrypt" ? "Ciphertext" : "Plaintext";
  const inputTitle = mode === "encrypt" ? "Plaintext" : "Cipher input";
  const inputPlaceholder =
    mode === "encrypt"
      ? "Type plaintext. Matrix shows the first 16 bytes."
      : "Paste ciphertext hex. Matrix uses the first 32 hex chars.";
  const inputConstraintCopy =
    mode === "encrypt"
      ? "128-bit state: only the first 16 UTF-8 bytes are shown."
      : "Needs 32 hex chars. Non-hex is removed, short input is zero-padded.";

  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
  }, [mode, textInput, aesKeyHex]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (step >= maxStep) {
      setIsPlaying(false);
      return;
    }

    const timeout = window.setTimeout(
      () => {
        setStep((previous) => Math.min(previous + 1, maxStep));
      },
      Math.max(180, 880 / Math.max(0.3, speed)),
    );

    return () => window.clearTimeout(timeout);
  }, [isPlaying, maxStep, speed, step]);

  useEffect(() => {
    previousBlockHexRef.current = preview.blockHex;
  }, [preview.blockHex]);

  return (
    <div className="h-[100svh] overflow-hidden bg-background text-foreground">
      <div className="mx-auto grid h-full w-full max-w-[1800px] grid-cols-[17rem_minmax(0,1fr)] gap-3 p-3">
        <aside className="flex min-h-0 flex-col gap-3 rounded-[1.5rem] border border-border/70 bg-background p-4">
          <div className="border-border/70 border-b pb-3">
            {/* <p className="text-[0.68rem] text-cyan-300 uppercase tracking-[0.2em]">
              CipherFlow
            </p> */}
            <h1 className="mt-2 font-semibold text-lg tracking-tight">
              AES-128
            </h1>
            {/* <p className="mt-1 text-[0.72rem] text-muted-foreground">
              AES-128 teaching lens: first block, guided round flow.
            </p>
            <p className="mt-2 text-muted-foreground text-sm leading-5">
              One block, one round, one selected byte.
            </p> */}
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <div className="space-y-2">
              <label
                htmlFor="cipherflow-input"
                className="text-muted-foreground text-xs uppercase tracking-[0.16em]"
              >
                {inputTitle}
              </label>
              <textarea
                id="cipherflow-input"
                value={textInput}
                onChange={(event) => setTextInput(event.target.value)}
                className="h-28 w-full resize-none rounded-2xl border border-border/70 bg-background px-3 py-3 font-mono text-sm outline-none transition-colors focus:border-cyan-400/60"
                placeholder={inputPlaceholder}
              />
              <p className="text-[0.72rem] text-muted-foreground leading-5">
                {inputConstraintCopy}
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="cipherflow-key"
                className="text-muted-foreground text-xs uppercase tracking-[0.16em]"
              >
                AES key (hex, 32 chars)
              </label>
              <input
                id="cipherflow-key"
                value={aesKeyHex}
                onChange={(event) => setAesKeyHex(event.target.value)}
                className="h-10 w-full rounded-2xl border border-border/70 bg-background px-3 font-mono text-sm outline-none transition-colors focus:border-cyan-400/60"
                placeholder={DEFAULT_AES_KEY}
              />
              <p className="text-[0.72rem] text-muted-foreground leading-5">
                Non-hex is removed. Missing nybbles are zero-padded.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.16em]">
                Mode
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={mode === "encrypt" ? "default" : "outline"}
                  className="rounded-xl"
                  onClick={() => setMode("encrypt")}
                >
                  Encrypt
                </Button>
                <Button
                  variant={mode === "decrypt" ? "default" : "outline"}
                  className="rounded-xl"
                  onClick={() => setMode("decrypt")}
                >
                  Decrypt
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.16em]">
                Playback
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="rounded-xl"
                  onClick={() => setIsPlaying(true)}
                  disabled={step >= maxStep}
                >
                  <Play className="h-3.5 w-3.5" />
                  Play
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setIsPlaying(false)}
                >
                  <Pause className="h-3.5 w-3.5" />
                  Pause
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    setIsPlaying(false);
                    setStep((previous) => Math.min(previous + 1, maxStep));
                  }}
                  disabled={step >= maxStep}
                >
                  <StepForward className="h-3.5 w-3.5" />
                  Step
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    setIsPlaying(false);
                    setStep(0);
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs uppercase tracking-[0.16em]">
                <span>Speed</span>
                <span>{speed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min={0.4}
                max={2.6}
                step={0.1}
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
                className="w-full accent-cyan-400"
                aria-label="Animation speed"
              />
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/30 p-3">
              <p className="text-[0.62rem] text-muted-foreground uppercase tracking-[0.18em]">
                Scope
              </p>
              <p className="mt-2 text-muted-foreground text-sm leading-5">
                {preview.blockNote}
              </p>
            </div>
          </div>
        </aside>

        <main className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-3 rounded-[1.5rem] border border-border/70 bg-background p-4">
          <section className="rounded-[1.25rem] border border-border/70 bg-muted/25 p-3">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.62rem] text-cyan-300 uppercase tracking-[0.18em]">
                  Data path
                </p>
                <p className="mt-1 text-muted-foreground text-sm">
                  Track how 16 input bytes become the AES state.
                </p>
              </div>
              <p className="font-mono text-[0.68rem] text-muted-foreground uppercase tracking-[0.16em]">
                Step {stageIndex} / {maxStep}
              </p>
            </div>

            <div className="mt-3 grid grid-cols-6 gap-2">
              {preview.frames.map((frame, index) => (
                <motion.button
                  key={frame.id}
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setStep(index);
                  }}
                  animate={{
                    scale: stageIndex === index ? 1.02 : 1,
                    opacity: stageIndex === index ? 1 : 0.55,
                  }}
                  className={cn(
                    "rounded-xl border px-2 py-2 text-left transition-colors",
                    stageIndex === index
                      ? "border-cyan-400/45 bg-cyan-400/10"
                      : "border-border/70 bg-background hover:border-border",
                  )}
                >
                  <p className="text-[0.58rem] text-muted-foreground uppercase tracking-[0.18em]">
                    {frame.eyebrow}
                  </p>
                  <p className="mt-1 font-semibold text-xs leading-4">
                    {frame.label}
                  </p>
                </motion.button>
              ))}
            </div>

            <div className="mt-3 h-1.5 rounded-full bg-background">
              <motion.div
                className="h-full rounded-full bg-cyan-400"
                animate={{
                  width:
                    maxStep > 0
                      ? `${(Math.min(stageIndex, maxStep) / maxStep) * 100}%`
                      : "0%",
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              />
            </div>
          </section>

          <section className="grid min-h-0 grid-cols-[minmax(0,1fr)_18rem] gap-3">
            <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-3 rounded-[1.25rem] border border-border/70 bg-muted/20 p-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[0.62rem] text-cyan-300 uppercase tracking-[0.18em]">
                    Current state
                  </p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    Changed cells pulse when the current step rewrites bytes.
                  </p>
                </div>
              </div>

              <div className="flex min-h-0 items-center justify-center">
                <AesStateBoard
                  currentState={currentFrame.state}
                  previousState={previousFrame.state}
                />
              </div>

              <div className="rounded-2xl border border-border/70 bg-background p-3">
                <p className="text-[0.62rem] text-muted-foreground uppercase tracking-[0.18em]">
                  Input bytes
                </p>
                <div className="mt-3 grid grid-cols-8 gap-2">
                  {preview.blockBytes.map((byte) => {
                    const changed =
                      (previousBlockPairs[byte.index] ?? "") !== byte.hex;

                    return (
                      <motion.div
                        key={byte.index}
                        animate={{ y: changed ? [-2, 0] : 0 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className={cn(
                          "rounded-md border px-2 py-2 text-left transition-colors",
                          changed
                            ? "border-amber-400/35 bg-amber-400/10"
                            : "border-border/70 bg-muted/20",
                        )}
                      >
                        <p className="text-[0.55rem] text-muted-foreground uppercase tracking-[0.16em]">
                          b{byte.index.toString().padStart(2, "0")}
                        </p>
                        <p className="mt-1 font-mono font-semibold text-sm">
                          {byte.hex}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] gap-3">
              <section className="rounded-[1.25rem] border border-border/70 bg-muted/20 p-4">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentFrame.id}
                    initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -4, filter: "blur(3px)" }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="space-y-3"
                  >
                    <div>
                      <p className="text-[0.62rem] text-cyan-300 uppercase tracking-[0.18em]">
                        {currentFrame.eyebrow}
                      </p>
                      <h2 className="mt-1 font-semibold text-lg">
                        {currentFrame.label}
                      </h2>
                    </div>
                    <p className="text-muted-foreground text-sm leading-5">
                      {currentFrame.description}
                    </p>
                    <div className="rounded-xl border border-border/70 bg-background px-3 py-2 font-mono text-foreground text-xs">
                      {currentFrame.formula}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </section>

              <div className="grid grid-cols-2 gap-3">
                <SmallStateCard
                  label="Round-0 key"
                  state={preview.keyState}
                  accentClassName="border-cyan-400/20 bg-cyan-400/8"
                />
                <SmallStateCard
                  label="Round-1 key"
                  state={preview.roundOneKeyState}
                  accentClassName="border-amber-400/20 bg-amber-400/8"
                />
              </div>

              {/* <section className="rounded-[1.25rem] border border-border/70 bg-muted/20 p-4">
                <PanelHeading title="Normalized block" />
                <p className="mt-3 break-all font-mono text-sm leading-6">
                  <AnimatedValue value={preview.blockHex} />
                </p>
                <p className="mt-2 text-muted-foreground text-xs leading-5">
                  Sanitized first block in hex (16 bytes / 32 hex chars).
                </p>
              </section> */}
              <section className="rounded-[1.25rem] border border-border/70 bg-muted/20 p-4">
                <PanelHeading title="Output" />

                <div className="mt-3 rounded-2xl border border-border/70 bg-background p-3">
                  <p className="text-muted-foreground text-xs uppercase tracking-[0.16em]">
                    {outputTitle}
                  </p>
                  <p className="mt-2 font-mono text-sm leading-6">
                    <AnimatedValue
                      value={preview.output || "No output yet"}
                      className="block max-w-full whitespace-pre-wrap break-all"
                    />
                  </p>
                  {preview.error && (
                    <p className="mt-2 text-destructive text-xs">
                      {preview.error}
                    </p>
                  )}
                </div>
              </section>
            </div>
          </section>
        </main>

        {/* <aside className="grid min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] gap-3 rounded-[1.5rem] border border-border/70 bg-background p-4"> */}
        {/* <section className="rounded-[1.25rem] border border-border/70 bg-muted/20 p-4">
            <PanelHeading title="Output" />

            <div className="mt-3 rounded-2xl border border-border/70 bg-background p-3">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.16em]">
                {outputTitle}
              </p>
              <p className="mt-2 font-mono text-sm leading-6">
                <AnimatedValue
                  value={preview.output || "No output yet"}
                  className="block max-w-full whitespace-pre-wrap break-all"
                />
              </p>
              {preview.error && (
                <p className="mt-2 text-destructive text-xs">{preview.error}</p>
              )}
            </div>
          </section> */}

        {/* <section className="rounded-[1.25rem] border border-border/70 bg-muted/20 p-4">
            <PanelHeading title="Byte inspector" />
            <p className="mt-2 text-muted-foreground text-xs leading-5">
              Shows the selected byte before/after this step and its source
              slot.
            </p>
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <InspectorStat label="Previous" value={selectedPreviousByte} />
                <InspectorStat label="Current" value={selectedCurrentByte} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <InspectorStat
                  label="Decimal"
                  value={Number.parseInt(selectedCurrentByte, 16).toString()}
                />
                <InspectorStat label="Source" value={selectedSourceByte.hex} />
              </div>
              <div className="rounded-2xl border border-border/70 bg-background p-3">
                <p className="text-[0.62rem] text-muted-foreground uppercase tracking-[0.18em]">
                  Original slot
                </p>
                <p className="mt-1 text-sm">{selectedSourceByte.charLabel}</p>
                <p className="mt-2 font-mono text-muted-foreground text-xs">
                  byte {selectedLinearIndex} | row {selectedCell.row} | col{" "}
                  {selectedCell.col}
                </p>
              </div>
            </div>
          </section> */}

        {/* <section className="rounded-[1.25rem] border border-border/70 bg-muted/20 p-4">
            <PanelHeading title="Quick notes" />
            <ul className="mt-3 space-y-2 text-muted-foreground text-sm leading-5">
              <li>Current state is the matrix output of the selected step.</li>
              <li>
                Data path buttons show how bytes move through AES transforms.
              </li>
              <li>
                Normalized block is the sanitized first 16-byte input block.
              </li>
              <li>{preview.scopeNote}</li>
            </ul>
          </section> */}
        {/* </aside> */}
      </div>
    </div>
  );
}

function AesStateBoard({
  currentState,
  previousState,
}: {
  currentState: string[][];
  previousState: string[][];
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[auto_repeat(4,minmax(0,1fr))] gap-2">
        <div />
        {[0, 1, 2, 3].map((column) => (
          <div
            key={`col-${column}`}
            className="px-2 text-center text-[0.62rem] text-muted-foreground uppercase tracking-[0.18em]"
          >
            C{column}
          </div>
        ))}

        {currentState.map((row, rowIndex) => (
          <AesMatrixRow
            key={`row-${rowIndex}`}
            row={row}
            rowIndex={rowIndex}
            previousState={previousState}
          />
        ))}
      </div>
    </div>
  );
}

function AesMatrixRow({
  row,
  rowIndex,
  previousState,
}: {
  row: string[];
  rowIndex: number;
  previousState: string[][];
}) {
  return (
    <>
      <div className="flex items-center px-2 text-[0.62rem] text-muted-foreground uppercase tracking-[0.18em]">
        R{rowIndex}
      </div>
      {row.map((byte, columnIndex) => {
        const previousByte = previousState[rowIndex]?.[columnIndex] ?? byte;
        const changed = previousByte !== byte;

        return (
          <motion.div
            key={`cell-${rowIndex}-${columnIndex}`}
            animate={{
              y: changed ? [-2, 0] : 0,
            }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={cn(
              "flex aspect-square cursor-default flex-col items-center justify-center rounded-md border px-2 text-center shadow-sm transition-colors",
              changed
                ? "border-amber-400/35 bg-amber-400/10"
                : "border-border/70 bg-background/80",
            )}
          >
            <span className="text-[0.55rem] text-muted-foreground uppercase tracking-[0.16em]">
              b{matrixIndexToByteIndex(rowIndex, columnIndex)}
            </span>
            <span className="mt-1 font-mono font-semibold text-lg leading-none">
              <AnimatedValue value={byte} />
            </span>
          </motion.div>
        );
      })}
    </>
  );
}

function SmallStateCard({
  label,
  state,
  accentClassName,
}: {
  label: string;
  state: string[][];
  accentClassName: string;
}) {
  const flatState = state.flat();
  const previousFlatRef = useRef<string[]>(flatState);
  const previousFlat = previousFlatRef.current;

  useEffect(() => {
    previousFlatRef.current = flatState;
  }, [flatState]);

  return (
    <div className={cn("rounded-2xl border p-3", accentClassName)}>
      <p className="text-[0.62rem] text-muted-foreground uppercase tracking-[0.18em]">
        {label}
      </p>
      <div className="mt-3 grid grid-cols-4 gap-1.5 font-mono text-xs">
        {flatState.map((byte, index) => {
          const changed = (previousFlat[index] ?? byte) !== byte;

          return (
            <motion.div
              key={`${label}-${index}`}
              animate={{ y: changed ? [-2, 0] : 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={cn(
                "flex aspect-square items-center justify-center rounded-md border px-2 text-center shadow-sm transition-colors",
                changed
                  ? "border-amber-400/35 bg-amber-400/10"
                  : "border-border/70 bg-background/80",
              )}
            >
              {byte}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function PanelHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between border-border/70 border-b pb-2">
      <h2 className="font-semibold text-sm uppercase tracking-[0.16em]">
        {title}
      </h2>
    </div>
  );
}

function AnimatedValue({
  value,
  className,
}: {
  value: string | number;
  className?: string;
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={String(value)}
        initial={{ opacity: 0, y: 2, filter: "blur(2px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -2, filter: "blur(2px)" }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className={cn("inline-block", className)}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}

function buildAesPreview(
  input: string,
  keyHex: string,
  mode: CipherMode,
): AesPreview {
  const normalizedKey = normalizeHex(keyHex || DEFAULT_AES_KEY, 32);
  const blockHex =
    mode === "encrypt"
      ? textToHexBlock(input || "CipherFlow demo", 16)
      : normalizeHex(input, 32);
  const blockBytes = hexToBytes(blockHex);
  const keyBytes = hexToBytes(normalizedKey);
  const roundOneKeyBytes = deriveRoundOneKey(keyBytes);
  const inputState = bytesToState(blockBytes);
  const keyState = bytesToState(keyBytes);
  const roundOneKeyState = bytesToState(roundOneKeyBytes);
  const realOutput = runRealAes(input, normalizedKey, mode);

  return {
    frames:
      mode === "encrypt"
        ? buildEncryptFrames(inputState, keyState, roundOneKeyState)
        : buildDecryptFrames(inputState, keyState, roundOneKeyState),
    blockHex,
    blockBytes: describeBlockBytes(blockBytes, mode === "encrypt" ? input : ""),
    keyState,
    roundOneKeyState,
    output: realOutput.output,
    error: realOutput.error,
    blockNote:
      mode === "encrypt"
        ? describePlaintextScope(input)
        : describeCipherScope(input),
    scopeNote:
      mode === "encrypt"
        ? "This panel shows one teaching round, not full AES-128."
        : "This panel reverses one teaching round, not full AES-128.",
  };
}

function buildEncryptFrames(
  inputState: string[][],
  roundZeroKeyState: string[][],
  roundOneKeyState: string[][],
): AesFrame[] {
  const roundZero = xorStates(inputState, roundZeroKeyState);
  const subBytes = applyAesSubBytes(roundZero, false);
  const shiftRows = applyAesShiftRows(subBytes, false);
  const mixColumns = applyAesMixColumns(shiftRows, false);
  const roundOne = xorStates(mixColumns, roundOneKeyState);

  return [
    {
      id: "input",
      label: "Input state",
      eyebrow: "Block load",
      description:
        "The first 16 bytes are mapped column-first into the 4 x 4 AES state.",
      formula: "state[r,c] = block[4c + r]",
      state: inputState,
    },
    {
      id: "round-zero-key",
      label: "AddRoundKey",
      eyebrow: "Round 0",
      description: "XOR with the original 128-bit key before nonlinear steps.",
      formula: "state = state XOR roundKey0",
      state: roundZero,
    },
    {
      id: "sub-bytes",
      label: "SubBytes",
      eyebrow: "Nonlinearity",
      description: "Each byte passes through the AES S-box.",
      formula: "state[r,c] = SBox[state[r,c]]",
      state: subBytes,
    },
    {
      id: "shift-rows",
      label: "ShiftRows",
      eyebrow: "Row offsets",
      description:
        "Rows rotate left by 0/1/2/3 to spread bytes across columns.",
      formula: "row r <- RotLeft(row r, r)",
      state: shiftRows,
    },
    {
      id: "mix-columns",
      label: "MixColumns",
      eyebrow: "Diffusion",
      description: "Columns are remixed in GF(2^8) for diffusion.",
      formula: "column' = M x column",
      state: mixColumns,
    },
    {
      id: "round-one-key",
      label: "AddRoundKey",
      eyebrow: "Round 1",
      description: "XOR with round-1 key to finish this single-round view.",
      formula: "state = state XOR roundKey1",
      state: roundOne,
    },
  ];
}

function buildDecryptFrames(
  inputState: string[][],
  roundZeroKeyState: string[][],
  roundOneKeyState: string[][],
): AesFrame[] {
  const addRoundKey = xorStates(inputState, roundOneKeyState);
  const invMixColumns = applyAesMixColumns(addRoundKey, true);
  const invShiftRows = applyAesShiftRows(invMixColumns, true);
  const invSubBytes = applyAesSubBytes(invShiftRows, true);
  const exitState = xorStates(invSubBytes, roundZeroKeyState);

  return [
    {
      id: "input",
      label: "Cipher block",
      eyebrow: "Block load",
      description:
        "The first 16 ciphertext bytes are mapped into the AES state.",
      formula: "state[r,c] = block[4c + r]",
      state: inputState,
    },
    {
      id: "round-one-key",
      label: "AddRoundKey",
      eyebrow: "Reverse round",
      description: "Start by removing round-1 key with XOR.",
      formula: "state = state XOR roundKey1",
      state: addRoundKey,
    },
    {
      id: "inv-mix-columns",
      label: "InvMixColumns",
      eyebrow: "Undo diffusion",
      description: "Inverse column mix removes column diffusion.",
      formula: "column' = M^-1 x column",
      state: invMixColumns,
    },
    {
      id: "inv-shift-rows",
      label: "InvShiftRows",
      eyebrow: "Undo offsets",
      description: "Rows rotate right by their row index.",
      formula: "row r <- RotRight(row r, r)",
      state: invShiftRows,
    },
    {
      id: "inv-sub-bytes",
      label: "InvSubBytes",
      eyebrow: "Undo S-box",
      description: "Inverse S-box restores substituted bytes.",
      formula: "state[r,c] = InvSBox[state[r,c]]",
      state: invSubBytes,
    },
    {
      id: "round-zero-key",
      label: "AddRoundKey",
      eyebrow: "Exit state",
      description: "XOR with round-0 key to finish this reverse-round view.",
      formula: "state = state XOR roundKey0",
      state: exitState,
    },
  ];
}

function runRealAes(input: string, normalizedKey: string, mode: CipherMode) {
  const key = CryptoJS.enc.Hex.parse(normalizedKey || DEFAULT_AES_KEY);

  if (mode === "encrypt") {
    const encrypted = CryptoJS.AES.encrypt(input, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    return {
      output: encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase(),
      error: null,
    };
  }

  const cleaned = normalizeHex(input, Math.max(32, stripToHex(input).length));

  if (cleaned.length === 0 || cleaned.length % 2 !== 0) {
    return {
      output: "",
      error: "AES decrypt expects an even-length hex string.",
    };
  }

  try {
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(cleaned),
    });

    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    const utf8 = decrypted.toString(CryptoJS.enc.Utf8);

    if (utf8) {
      return { output: utf8, error: null };
    }

    return {
      output: decrypted.toString(CryptoJS.enc.Hex).toUpperCase(),
      error: null,
    };
  } catch {
    return {
      output: "",
      error: "Unable to decrypt this payload with the provided AES key.",
    };
  }
}

function applyAesSubBytes(state: string[][], inverse: boolean): string[][] {
  return state.map((row) =>
    row.map((byte) => {
      const value = Number.parseInt(byte, 16);
      const mapped = inverse ? AES_INV_SBOX[value] : AES_SBOX[value];
      return formatByte(mapped ?? value);
    }),
  );
}

function applyAesShiftRows(state: string[][], inverse: boolean): string[][] {
  return state.map((row, rowIndex) => {
    const amount = inverse ? row.length - rowIndex : rowIndex;
    return rotateLeftArray(row, amount);
  });
}

function applyAesMixColumns(state: string[][], inverse: boolean): string[][] {
  const next = createEmptyState();

  for (let column = 0; column < 4; column += 1) {
    const source = [
      Number.parseInt(state[0][column] ?? "00", 16),
      Number.parseInt(state[1][column] ?? "00", 16),
      Number.parseInt(state[2][column] ?? "00", 16),
      Number.parseInt(state[3][column] ?? "00", 16),
    ];
    const mixed = inverse ? mixColumnInverse(source) : mixColumnForward(source);

    for (let row = 0; row < 4; row += 1) {
      next[row][column] = formatByte(mixed[row] ?? 0);
    }
  }

  return next;
}

function xorStates(left: string[][], right: string[][]): string[][] {
  return left.map((row, rowIndex) =>
    row.map((byte, columnIndex) => {
      const a = Number.parseInt(byte, 16);
      const b = Number.parseInt(right[rowIndex]?.[columnIndex] ?? "00", 16);
      return formatByte(a ^ b);
    }),
  );
}

function mixColumnForward(column: number[]): number[] {
  const [a0, a1, a2, a3] = column;
  return [
    gfMul(a0, 2) ^ gfMul(a1, 3) ^ a2 ^ a3,
    a0 ^ gfMul(a1, 2) ^ gfMul(a2, 3) ^ a3,
    a0 ^ a1 ^ gfMul(a2, 2) ^ gfMul(a3, 3),
    gfMul(a0, 3) ^ a1 ^ a2 ^ gfMul(a3, 2),
  ].map((value) => value & 0xff);
}

function mixColumnInverse(column: number[]): number[] {
  const [a0, a1, a2, a3] = column;
  return [
    gfMul(a0, 14) ^ gfMul(a1, 11) ^ gfMul(a2, 13) ^ gfMul(a3, 9),
    gfMul(a0, 9) ^ gfMul(a1, 14) ^ gfMul(a2, 11) ^ gfMul(a3, 13),
    gfMul(a0, 13) ^ gfMul(a1, 9) ^ gfMul(a2, 14) ^ gfMul(a3, 11),
    gfMul(a0, 11) ^ gfMul(a1, 13) ^ gfMul(a2, 9) ^ gfMul(a3, 14),
  ].map((value) => value & 0xff);
}

function deriveRoundOneKey(keyBytes: number[]): number[] {
  const bytes = [...keyBytes];

  while (bytes.length < 16) {
    bytes.push(0);
  }

  const words = [
    bytes.slice(0, 4),
    bytes.slice(4, 8),
    bytes.slice(8, 12),
    bytes.slice(12, 16),
  ];
  const transformed = subWord(rotWord(words[3] ?? [0, 0, 0, 0]));
  transformed[0] = (transformed[0] ?? 0) ^ (AES_RCON[0] ?? 0);
  const w4 = xorWord(words[0] ?? [0, 0, 0, 0], transformed);
  const w5 = xorWord(words[1] ?? [0, 0, 0, 0], w4);
  const w6 = xorWord(words[2] ?? [0, 0, 0, 0], w5);
  const w7 = xorWord(words[3] ?? [0, 0, 0, 0], w6);

  return [...w4, ...w5, ...w6, ...w7];
}

function rotWord(word: number[]): number[] {
  return [...word.slice(1), word[0] ?? 0];
}

function subWord(word: number[]): number[] {
  return word.map((value) => AES_SBOX[value] ?? value);
}

function xorWord(left: number[], right: number[]): number[] {
  return left.map((value, index) => value ^ (right[index] ?? 0));
}

function bytesToState(bytes: number[]): string[][] {
  const state = createEmptyState();

  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      const index = column * 4 + row;
      state[row][column] = formatByte(bytes[index] ?? 0);
    }
  }

  return state;
}

function createEmptyState(): string[][] {
  return Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => "00"));
}

function describeBlockBytes(
  bytes: number[],
  sourceText: string,
): ByteDescriptor[] {
  const encodedSource = Array.from(new TextEncoder().encode(sourceText)).slice(
    0,
    16,
  );

  return bytes.map((byte, index) => ({
    index,
    hex: formatByte(byte),
    decimal: byte,
    bits: hexToBits(formatByte(byte)),
    charLabel:
      sourceText.length > 0
        ? printableByteLabel(encodedSource[index] ?? null)
        : `slot ${index.toString().padStart(2, "0")}`,
  }));
}

function printableByteLabel(value: number | null): string {
  if (value === null) {
    return "padding";
  }

  if (value === 0) {
    return "NUL padding";
  }

  if (value >= 32 && value <= 126) {
    return `ASCII '${String.fromCharCode(value)}'`;
  }

  return `0x${value.toString(16).padStart(2, "0").toUpperCase()}`;
}

function describePlaintextScope(value: string): string {
  const totalBytes = Array.from(
    new TextEncoder().encode(value || "CipherFlow demo"),
  ).length;

  if (totalBytes > 16) {
    return `Showing bytes 0-15 of ${totalBytes}; the rest is outside this view.`;
  }

  if (totalBytes < 16) {
    return `Block is zero-padded with ${16 - totalBytes} byte(s).`;
  }

  return "Exactly one 128-bit block.";
}

function describeCipherScope(value: string): string {
  const cleanedLength = stripToHex(value).length;

  if (cleanedLength > 32) {
    return `Showing first 32 hex chars; ${cleanedLength - 32} chars are outside this view.`;
  }

  if (cleanedLength < 32) {
    return `Cipher block is short by ${32 - cleanedLength} hex chars, then zero-padded.`;
  }

  return "Exactly one 128-bit ciphertext block.";
}

function matrixIndexToByteIndex(row: number, col: number): number {
  return col * 4 + row;
}

function hexToBits(hex: string): string[] {
  return Array.from(
    Number.parseInt(hex || "00", 16)
      .toString(2)
      .padStart(8, "0"),
  );
}

function hexToBytes(hex: string): number[] {
  const pairs = normalizeHex(hex, 32).match(/.{1,2}/g) ?? [];
  return pairs.map((pair) => Number.parseInt(pair, 16));
}

function textToHexBlock(value: string, bytes: number): string {
  const encoded = new TextEncoder().encode(value);
  const copy = Array.from(encoded.slice(0, bytes));

  while (copy.length < bytes) {
    copy.push(0);
  }

  return copy.map(formatByte).join("");
}

function stripToHex(value: string): string {
  return value.toUpperCase().replace(/[^0-9A-F]/g, "");
}

function normalizeHex(value: string, length: number): string {
  if (length <= 0) {
    return "";
  }

  const cleaned = stripToHex(value);

  if (cleaned.length === 0) {
    return "".padEnd(length, "0");
  }

  if (cleaned.length >= length) {
    return cleaned.slice(0, length);
  }

  return cleaned.padEnd(length, "0");
}

function formatByte(value: number): string {
  return (value & 0xff).toString(16).padStart(2, "0").toUpperCase();
}

function rotateLeftArray<T>(array: T[], amount: number): T[] {
  if (array.length === 0) {
    return array;
  }

  const offset = ((amount % array.length) + array.length) % array.length;
  return [...array.slice(offset), ...array.slice(0, offset)];
}

function gfMul(value: number, factor: number): number {
  let left = value & 0xff;
  let right = factor & 0xff;
  let result = 0;

  while (right > 0) {
    if (right & 1) {
      result ^= left;
    }

    const highBit = left & 0x80;
    left = (left << 1) & 0xff;

    if (highBit) {
      left ^= 0x1b;
    }

    right >>= 1;
  }

  return result & 0xff;
}

function buildInverseSBox(sbox: number[]): number[] {
  const inverse = new Array<number>(256).fill(0);

  sbox.forEach((value, index) => {
    inverse[value] = index;
  });

  return inverse;
}
