"use client";

import { Button } from "@rust-research/ui/components/button";
import { cn } from "@rust-research/ui/lib/utils";
import CryptoJS from "crypto-js";
import {
  ArrowRightLeft,
  Github,
  Info,
  Pause,
  Play,
  RotateCcw,
  StepForward,
} from "lucide-react";
import { AnimatePresence, motion, useAnimate, useInView } from "motion/react";
import Link from "next/link";
import {
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type CipherAlgorithm = "des" | "aes" | "rsa";
type CipherMode = "encrypt" | "decrypt";

type DesStepPhase = "initial" | "round" | "final";

interface DesStep {
  id: string;
  round: number;
  phase: DesStepPhase;
  left: string;
  right: string;
  expanded: string;
  xored: string;
  sboxed: string;
  permuted: string;
  subKey: string;
  explanation: string;
  formula: string;
}

interface DesSimulationResult {
  normalizedKey: string;
  roundKeys: string[];
  steps: DesStep[];
  simulatedOutput: string;
  realOutput: string;
  realError: string | null;
}

interface AesPreview {
  stages: AesStage[];
  states: string[][][];
  output: string;
  error: string | null;
}

interface RsaFlowStep {
  id: string;
  label: string;
  detail: string;
  formula: string;
  activeBitIndex: number | null;
  accumulator: number;
  base: number;
  exponentRemainder: number;
}

interface RsaPreview {
  mode: CipherMode;
  exponentBits: string[];
  steps: RsaFlowStep[];
  output: string;
  error: string | null;
}

interface RsaDemoKeyPair {
  p: number;
  q: number;
  n: number;
  phi: number;
  e: number;
  d: number;
}

const DES_ROUNDS = 16;
const AES_ENCRYPT_STAGES = [
  "SubBytes",
  "ShiftRows",
  "MixColumns",
  "AddRoundKey",
] as const;
const AES_DECRYPT_STAGES = [
  "InvShiftRows",
  "InvSubBytes",
  "AddRoundKey",
  "InvMixColumns",
] as const;
type AesStage =
  | (typeof AES_ENCRYPT_STAGES)[number]
  | (typeof AES_DECRYPT_STAGES)[number];

const INITIAL_PERMUTATION = [
  9, 13, 3, 15, 6, 11, 1, 12, 8, 2, 14, 5, 0, 10, 4, 7,
];
const INVERSE_PERMUTATION = invertPermutation(INITIAL_PERMUTATION);
const EXPANSION_TABLE = [7, 0, 1, 2, 3, 4, 3, 4, 5, 6, 7, 0];
const PBOX_TABLE = [1, 5, 2, 0, 3, 7, 4, 6, 8, 10, 9, 11];
const ROUND_MASK_TABLE = [0, 2, 4, 6, 7, 9, 10, 11];

const DES_SBOXES: number[][] = [
  [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
  [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
  [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
  [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],
  [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
  [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
  [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
  [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9],
];

const AES_SBOX = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe,
  0xd7, 0xab, 0x76,
];
const AES_INV_SBOX = new Map<number, number>(
  AES_SBOX.map((value, index) => [value, index]),
);

const DEFAULT_DES_KEY = "133457799BBCDFF1";
const DEFAULT_AES_KEY = "000102030405060708090A0B0C0D0E0F";

const RSA_PRIMES = [
  53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107,
] as const;

export function CipherFlowVisualization() {
  const [algorithm, setAlgorithm] = useState<CipherAlgorithm>("des");
  const [mode, setMode] = useState<CipherMode>("encrypt");
  const [textInput, setTextInput] = useState("CipherFlow demo");
  const [desKeyHex, setDesKeyHex] = useState(DEFAULT_DES_KEY);
  const [aesKeyHex, setAesKeyHex] = useState(DEFAULT_AES_KEY);
  const [step, setStep] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rsaKeys, setRsaKeys] = useState<RsaDemoKeyPair>(() =>
    createRsaDemoKeyPair(),
  );

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const operationsRef = useRef<HTMLDivElement | null>(null);
  const canvasVisible = useInView(canvasRef, { once: true, amount: 0.2 });
  const [, animateOperations] = useAnimate();

  const desSimulation = useMemo<DesSimulationResult>(() => {
    return buildDesSimulation(textInput, desKeyHex, mode);
  }, [textInput, desKeyHex, mode]);

  const aesPreview = useMemo<AesPreview>(() => {
    return buildAesPreview(textInput, aesKeyHex, mode);
  }, [textInput, aesKeyHex, mode]);

  const aesStages = aesPreview.stages;

  const rsaPreview = useMemo<RsaPreview>(() => {
    return buildRsaPreview(textInput, rsaKeys, mode);
  }, [textInput, rsaKeys, mode]);

  const maxStep = useMemo(() => {
    if (algorithm === "des") {
      return Math.max(0, desSimulation.steps.length - 1);
    }

    if (algorithm === "aes") {
      return Math.max(0, aesStages.length - 1);
    }

    return Math.max(0, rsaPreview.steps.length - 1);
  }, [
    aesStages.length,
    algorithm,
    desSimulation.steps.length,
    rsaPreview.steps.length,
  ]);

  const currentDesStep = desSimulation.steps[Math.min(step, maxStep)];
  const currentAesStage = aesStages[Math.min(step, aesStages.length - 1)];
  const currentRsaStep = rsaPreview.steps[Math.min(step, maxStep)];

  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
  }, []);

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
      Math.max(180, 900 / Math.max(0.3, speed)),
    );

    return () => window.clearTimeout(timeout);
  }, [isPlaying, maxStep, speed, step]);

  useEffect(() => {
    if (algorithm !== "des") {
      return;
    }

    if (currentDesStep?.phase !== "round") {
      return;
    }

    const operationPanel = operationsRef.current;

    if (!operationPanel) {
      return;
    }

    void animateOperations(
      operationPanel,
      { scale: [1, 1.015, 1], opacity: [0.9, 1, 0.95, 1] },
      { duration: 0.45, ease: "easeInOut" },
    );
  }, [algorithm, animateOperations, currentDesStep?.phase]);

  const outputTitle = mode === "encrypt" ? "Ciphertext" : "Plaintext";

  const outputValue =
    algorithm === "des"
      ? desSimulation.realOutput
      : algorithm === "aes"
        ? aesPreview.output
        : rsaPreview.output;

  const outputError =
    algorithm === "des"
      ? desSimulation.realError
      : algorithm === "aes"
        ? aesPreview.error
        : rsaPreview.error;

  const explanation = useMemo(() => {
    if (algorithm === "des") {
      return {
        title:
          currentDesStep.phase === "initial"
            ? "Initial permutation and split"
            : currentDesStep.phase === "final"
              ? "Final swap and inverse permutation"
              : `Round ${currentDesStep.round}`,
        body: currentDesStep.explanation,
        formula: currentDesStep.formula,
      };
    }

    if (algorithm === "aes") {
      const stageCopy: Record<AesStage, string> = {
        SubBytes:
          "Each byte is replaced through an S-box lookup to increase non-linearity and break simple patterns.",
        ShiftRows:
          "Rows rotate by different offsets so bytes influence neighboring columns in later operations.",
        MixColumns:
          "Each column is mixed using finite-field math so every byte depends on the full column.",
        AddRoundKey:
          "The round key is XORed into state; without the key schedule this transformation is not reversible.",
        InvShiftRows:
          "Rows shift in the opposite direction to reverse byte displacement from encryption rounds.",
        InvSubBytes:
          "The inverse S-box restores byte values to unwind the non-linear substitution layer.",
        InvMixColumns:
          "Inverse column mixing removes diffusion added during encryption rounds.",
      };

      return {
        title: currentAesStage,
        body: stageCopy[currentAesStage],
        formula: "State' = Transform(State)",
      };
    }

    return {
      title: currentRsaStep.label,
      body: currentRsaStep.detail,
      formula: currentRsaStep.formula,
    };
  }, [algorithm, currentAesStage, currentDesStep, currentRsaStep]);

  const activeRound =
    algorithm === "des" && currentDesStep.phase === "round"
      ? currentDesStep.round
      : 0;

  const handleStep = useCallback(() => {
    setIsPlaying(false);
    setStep((previous) => Math.min(previous + 1, maxStep));
  }, [maxStep]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setStep(0);
  }, []);

  const generateRsaKeys = useCallback(() => {
    setRsaKeys(createRsaDemoKeyPair());
  }, []);

  useEffect(() => {
    const hasNonIntegerKeyMaterial =
      !Number.isInteger(rsaKeys.n) ||
      !Number.isInteger(rsaKeys.phi) ||
      !Number.isInteger(rsaKeys.e) ||
      !Number.isInteger(rsaKeys.d);

    const invalidModulus = rsaKeys.n <= 1 || rsaKeys.phi <= 1;
    const invalidCoprime = gcd(rsaKeys.e, rsaKeys.phi) !== 1;
    const invalidInverse = (rsaKeys.e * rsaKeys.d) % rsaKeys.phi !== 1;

    if (
      hasNonIntegerKeyMaterial ||
      invalidModulus ||
      invalidCoprime ||
      invalidInverse
    ) {
      setRsaKeys(createRsaDemoKeyPair());
    }
  }, [rsaKeys]);

  return (
    <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(34,211,238,0.08),transparent_35%),linear-gradient(300deg,rgba(245,158,11,0.1),transparent_45%),linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:auto,auto,52px_52px,52px_52px]" />
      <div className="relative mx-auto flex w-full max-w-[1700px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
        <header className="rounded-3xl border border-border/70 bg-background/80 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mt-2 font-black text-3xl tracking-tight sm:text-4xl">
                DES, AES, RSA
              </h1>
              <p className="mt-2 max-w-3xl text-muted-foreground text-sm sm:text-base">
                Type input, set keys, then play each algorithm like a data
                choreography. DES is fully animated first, with AES and RSA
                structured for the next expansion.
              </p>
            </div>

            <Link
              href="https://github.com/zAcherttp/rust-research"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 self-start rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-sm hover:bg-muted"
            >
              <Github className="h-4 w-4" />
              Source
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {(["des", "aes", "rsa"] as const).map((name) => (
              <Button
                key={name}
                onClick={() => setAlgorithm(name)}
                variant={algorithm === name ? "default" : "outline"}
                className="rounded-xl px-4 py-2 font-semibold uppercase tracking-[0.14em]"
              >
                {name}
              </Button>
            ))}
          </div>
        </header>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,20%)_minmax(0,1fr)_minmax(0,20%)]">
          <aside className="space-y-4 rounded-3xl border border-border/70 bg-background/85 p-4 backdrop-blur">
            <PanelHeading title="Input" />
            <div className="space-y-2">
              <label
                htmlFor="cipherflow-input"
                className="text-muted-foreground text-xs uppercase tracking-[0.16em]"
              >
                {mode === "encrypt" ? "Plaintext" : "Cipher input"}
              </label>
              <textarea
                id="cipherflow-input"
                value={textInput}
                onChange={(event) => setTextInput(event.target.value)}
                className="min-h-24 w-full resize-y rounded-xl border border-border/70 bg-background px-3 py-2 font-mono text-sm outline-none transition-colors focus:border-cyan-500/70"
                placeholder={
                  mode === "encrypt"
                    ? "Type message"
                    : "Enter hex for DES/AES or RSA blocks (e.g. 123 456)"
                }
              />
            </div>

            {algorithm !== "rsa" ? (
              <div className="space-y-2">
                <label
                  htmlFor="cipherflow-key"
                  className="text-muted-foreground text-xs uppercase tracking-[0.16em]"
                >
                  {algorithm === "des" ? "DES key (hex)" : "AES key (hex)"}
                </label>
                <input
                  id="cipherflow-key"
                  value={algorithm === "des" ? desKeyHex : aesKeyHex}
                  onChange={(event) => {
                    if (algorithm === "des") {
                      setDesKeyHex(event.target.value);
                      return;
                    }

                    setAesKeyHex(event.target.value);
                  }}
                  className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 font-mono text-sm outline-none transition-colors focus:border-amber-500/70"
                />
              </div>
            ) : (
              <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/30 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-xs uppercase tracking-[0.16em]">
                    RSA key pair
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={generateRsaKeys}
                  >
                    Regenerate
                  </Button>
                </div>
                <p className="font-mono text-xs">n = {rsaKeys.n.toString()}</p>
                <p className="font-mono text-xs">e = {rsaKeys.e.toString()}</p>
                <p className="font-mono text-xs">d = {rsaKeys.d.toString()}</p>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.16em]">
                Mode
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={mode === "encrypt" ? "default" : "outline"}
                  className="rounded-lg"
                  onClick={() => setMode("encrypt")}
                >
                  Encrypt
                </Button>
                <Button
                  variant={mode === "decrypt" ? "default" : "outline"}
                  className="rounded-lg"
                  onClick={() => setMode("decrypt")}
                >
                  Decrypt
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.16em]">
                Controls
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="rounded-lg"
                  onClick={() => setIsPlaying(true)}
                  disabled={step >= maxStep}
                >
                  <Play className="h-3.5 w-3.5" />
                  Play
                </Button>
                <Button
                  variant="outline"
                  className="rounded-lg"
                  onClick={() => setIsPlaying(false)}
                >
                  <Pause className="h-3.5 w-3.5" />
                  Pause
                </Button>
                <Button
                  variant="outline"
                  className="rounded-lg"
                  onClick={handleStep}
                  disabled={step >= maxStep}
                >
                  <StepForward className="h-3.5 w-3.5" />
                  Step
                </Button>
                <Button
                  variant="outline"
                  className="rounded-lg"
                  onClick={handleReset}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs uppercase tracking-[0.16em]">
                <span>Playback speed</span>
                <span>{speed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min={0.4}
                max={2.6}
                step={0.1}
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
                className="w-full accent-cyan-500"
                aria-label="Animation speed"
              />
            </div>
          </aside>

          <main
            ref={canvasRef}
            className="overflow-hidden rounded-3xl border border-border/70 bg-background/85 p-4 backdrop-blur sm:p-5"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={algorithm}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: canvasVisible ? 1 : 0,
                  y: canvasVisible ? 0 : 10,
                }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="space-y-4"
              >
                {algorithm === "des" ? (
                  <DesCanvas
                    currentStep={currentDesStep}
                    roundKeys={desSimulation.roundKeys}
                    mode={mode}
                    operationsRef={operationsRef}
                  />
                ) : algorithm === "aes" ? (
                  <AesCanvas
                    states={aesPreview.states}
                    stages={aesPreview.stages}
                    stageIndex={Math.min(step, aesPreview.stages.length - 1)}
                  />
                ) : (
                  <RsaCanvas preview={rsaPreview} step={step} />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-5 rounded-2xl border border-border/70 bg-muted/35 p-3">
              <div className="flex items-center justify-between text-muted-foreground text-xs uppercase tracking-[0.16em]">
                <span>{algorithm.toUpperCase()} Progress</span>
                <span>
                  Step {Math.min(step, maxStep)} / {maxStep}
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-background">
                <motion.div
                  className="h-full rounded-full bg-linear-to-r from-cyan-500 via-sky-500 to-amber-500"
                  animate={{
                    width:
                      maxStep > 0
                        ? `${(Math.min(step, maxStep) / maxStep) * 100}%`
                        : "0%",
                  }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                />
              </div>
              {algorithm === "des" && (
                <p className="mt-2 text-muted-foreground text-xs">
                  Round {activeRound} / {DES_ROUNDS}
                </p>
              )}
            </div>
          </main>

          <aside className="space-y-4 rounded-3xl border border-border/70 bg-background/85 p-4 backdrop-blur">
            <PanelHeading title="Output" />
            <div className="rounded-2xl border border-border/70 bg-muted/35 p-3">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.16em]">
                {outputTitle}
              </p>
              <p className="mt-2 break-words font-mono text-sm leading-relaxed">
                {outputValue || "No output yet"}
              </p>
              {algorithm === "des" && (
                <p className="mt-2 text-muted-foreground text-xs">
                  Simulator output: {desSimulation.simulatedOutput}
                </p>
              )}
              {outputError && (
                <p className="mt-2 text-destructive text-xs">{outputError}</p>
              )}
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/35 p-3">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.16em]">
                Internal state
              </p>
              {algorithm === "des" ? (
                <div className="mt-2 space-y-2 font-mono text-xs">
                  <p>L: {currentDesStep.left}</p>
                  <p>R: {currentDesStep.right}</p>
                  {currentDesStep.phase === "round" && (
                    <>
                      <p>E(R): {currentDesStep.expanded}</p>
                      <p>Subkey: {currentDesStep.subKey}</p>
                    </>
                  )}
                </div>
              ) : algorithm === "aes" ? (
                <p className="mt-2 font-mono text-xs">
                  {aesPreview.states[
                    Math.min(step, aesPreview.stages.length - 1)
                  ]
                    .flat()
                    .join(" ")}
                </p>
              ) : (
                <div className="mt-2 space-y-2 font-mono text-xs">
                  <p>n: {rsaKeys.n.toString()}</p>
                  <p>phi(n): {rsaKeys.phi.toString()}</p>
                  <p>Exponent bits: {rsaPreview.exponentBits.join(" ")}</p>
                  <p>Accumulator: {currentRsaStep.accumulator.toString()}</p>
                  <p>Base: {currentRsaStep.base.toString()}</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/35 p-3">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.16em]">
                What just happened?
              </p>
              <p className="mt-2 font-semibold text-sm">{explanation.title}</p>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                {explanation.body}
              </p>
              <p className="mt-3 rounded-lg bg-background px-2 py-1 font-mono text-xs">
                {explanation.formula}
              </p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

function DesCanvas({
  currentStep,
  roundKeys,
  mode,
  operationsRef,
}: {
  currentStep: DesStep;
  roundKeys: string[];
  mode: CipherMode;
  operationsRef: RefObject<HTMLDivElement | null>;
}) {
  const leftBlocks = splitChars(currentStep.left, 8);
  const rightBlocks = splitChars(currentStep.right, 8);
  const shouldSwap = currentStep.phase === "round";
  const leftOrder = shouldSwap && currentStep.round % 2 === 1 ? 2 : 1;
  const rightOrder = shouldSwap && currentStep.round % 2 === 1 ? 1 : 2;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/70 bg-muted/40 p-3">
        <div className="mb-2 flex items-center justify-between text-muted-foreground text-xs uppercase tracking-[0.16em]">
          <span>DES key schedule</span>
          <span className="inline-flex items-center gap-1">
            <ArrowRightLeft className="h-3.5 w-3.5" />
            {mode === "encrypt" ? "forward" : "reversed"}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2 md:grid-cols-8 xl:grid-cols-16">
          {roundKeys.map((subKey, index) => {
            const active =
              currentStep.phase === "round" && currentStep.round - 1 === index;
            return (
              <motion.div
                key={subKey + index}
                layout
                animate={{
                  scale: active ? 1.06 : 1,
                  borderColor: active
                    ? "rgba(34,211,238,0.8)"
                    : "rgba(148,163,184,0.3)",
                }}
                transition={{ duration: 0.22 }}
                className="rounded-lg border bg-background px-2 py-1 text-center font-mono text-[0.65rem]"
              >
                K{index + 1}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
        <motion.div
          layout
          style={{ order: leftOrder }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="rounded-2xl border border-cyan-500/35 bg-cyan-500/8 p-3"
        >
          <p className="text-cyan-300 text-xs uppercase tracking-[0.18em]">
            Left half
          </p>
          <NibbleRow blocks={leftBlocks} accent="cyan" />
        </motion.div>

        <motion.div
          layout
          style={{ order: rightOrder }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="rounded-2xl border border-amber-500/35 bg-amber-500/8 p-3"
        >
          <p className="text-amber-300 text-xs uppercase tracking-[0.18em]">
            Right half
          </p>
          <NibbleRow blocks={rightBlocks} accent="amber" />
        </motion.div>
      </div>

      <motion.div
        ref={operationsRef}
        className="space-y-2 rounded-2xl border border-border/70 bg-muted/40 p-3"
      >
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <OperationCard
            label="Expansion"
            tooltip="Duplicate selected right-half bits from 32 to 48 bits before key mixing."
            data={splitChars(currentStep.expanded, 12)}
            active={currentStep.phase === "round"}
          />
          <OperationCard
            label="XOR with subkey"
            tooltip="Combine expanded right half with current round key using XOR."
            data={splitChars(currentStep.xored, 12)}
            active={currentStep.phase === "round"}
          />
          <OperationCard
            label="S-box"
            tooltip="Substitute chunks through non-linear lookup tables to hide structure."
            data={splitChars(currentStep.sboxed, 12)}
            active={currentStep.phase === "round"}
          />
          <OperationCard
            label="Permutation"
            tooltip="Reorder substituted bits before combining with left half."
            data={splitChars(currentStep.permuted, 12)}
            active={currentStep.phase === "round"}
          />
        </div>
      </motion.div>

      <div className="rounded-2xl border border-border/70 bg-muted/30 p-3 text-muted-foreground text-xs">
        {currentStep.phase === "initial"
          ? "Initial permutation done. Block split into L0 and R0."
          : currentStep.phase === "round"
            ? `Feistel update complete for round ${currentStep.round}. L and R cross to emphasize the swap.`
            : "Final swap completed, then inverse permutation emits ciphertext."}
      </div>
    </div>
  );
}

function AesCanvas({
  states,
  stages,
  stageIndex,
}: {
  states: string[][][];
  stages: AesStage[];
  stageIndex: number;
}) {
  const state = states[Math.min(stageIndex, states.length - 1)];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/70 bg-muted/35 p-3">
        <p className="text-muted-foreground text-xs uppercase tracking-[0.16em]">
          AES round lens
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, index) => (
            <motion.div
              key={stage}
              animate={{
                scale: stageIndex === index ? 1.04 : 1,
                opacity: stageIndex === index ? 1 : 0.6,
              }}
              className={cn(
                "rounded-xl border px-2 py-2 text-center text-xs uppercase tracking-[0.14em]",
                stageIndex === index
                  ? "border-cyan-500/60 bg-cyan-500/12"
                  : "border-border/70 bg-background/70",
              )}
            >
              {stage}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/8 p-4">
        <div className="mx-auto grid max-w-lg grid-cols-4 gap-2">
          {state.flat().map((byte, index) => (
            <motion.div
              key={`${byte}-${index}`}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: index * 0.012 }}
              className="aspect-square rounded-lg border border-emerald-400/40 bg-black/30 p-2 text-center font-mono text-[0.7rem]"
            >
              {byte}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RsaCanvas({ preview, step }: { preview: RsaPreview; step: number }) {
  const activeStepIndex = Math.min(step, preview.steps.length - 1);
  const activeStep = preview.steps[activeStepIndex];
  const activeBit =
    activeStep.activeBitIndex === null
      ? -1
      : Math.min(activeStep.activeBitIndex, preview.exponentBits.length - 1);
  const activeBitDisplayIndex =
    activeBit < 0 ? -1 : preview.exponentBits.length - 1 - activeBit;
  const isDecrypt = preview.mode === "decrypt";

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "rounded-2xl border p-3",
            isDecrypt
              ? "border-border/70 bg-muted/35"
              : "border-sky-500/35 bg-sky-500/10",
          )}
        >
          <p
            className={cn(
              "text-xs uppercase tracking-[0.16em]",
              isDecrypt ? "text-muted-foreground" : "text-sky-200",
            )}
          >
            Public highway
          </p>
          <p className="mt-2 text-sm">
            Anyone can use (n, e) to lock the message.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "rounded-2xl border p-3",
            isDecrypt
              ? "border-amber-500/35 bg-amber-500/10"
              : "border-border/70 bg-muted/35",
          )}
        >
          <p
            className={cn(
              "text-xs uppercase tracking-[0.16em]",
              isDecrypt ? "text-amber-200" : "text-muted-foreground",
            )}
          >
            Private backdoor
          </p>
          <p className="mt-2 text-sm">
            Only d unlocks the cipher back to the message.
          </p>
        </motion.div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-muted/35 p-3">
        <p className="text-muted-foreground text-xs uppercase tracking-[0.16em]">
          RSA flow
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {preview.steps.map((flowStep, index) => (
            <motion.div
              key={flowStep.id}
              animate={{
                scale: index === activeStepIndex ? 1.04 : 1,
                borderColor:
                  index === activeStepIndex
                    ? "rgba(34,211,238,0.8)"
                    : "rgba(148,163,184,0.45)",
              }}
              className="rounded-lg border bg-background px-3 py-2 text-xs"
            >
              {flowStep.label}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-muted/35 p-3">
        <p className="text-muted-foreground text-xs uppercase tracking-[0.16em]">
          Repeated squaring tree
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {preview.exponentBits.map((bit, index) => (
            <motion.div
              key={`${bit}-${index}`}
              animate={{
                scale: index === activeBitDisplayIndex ? 1.08 : 1,
                borderColor:
                  index === activeBitDisplayIndex
                    ? "rgba(245,158,11,0.9)"
                    : "rgba(148,163,184,0.45)",
              }}
              className="rounded-lg border bg-background px-3 py-2 text-center"
            >
              <p className="font-mono text-xs">bit {index}</p>
              <p className="font-bold text-sm">{bit}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-3 rounded-lg border border-border/70 bg-background/70 px-3 py-2 text-muted-foreground text-xs">
          <p>{activeStep.detail}</p>
          <p className="mt-1 font-mono">{activeStep.formula}</p>
        </div>
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
      <Info className="h-3.5 w-3.5 text-muted-foreground" />
    </div>
  );
}

function NibbleRow({
  blocks,
  accent,
}: {
  blocks: string[];
  accent: "cyan" | "amber";
}) {
  return (
    <div className="mt-2 grid grid-cols-8 gap-1.5">
      {blocks.map((value, index) => (
        <motion.div
          key={`${accent}-${value}-${index}`}
          layout
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.01 }}
          className={cn(
            "flex aspect-square items-center justify-center rounded-md border font-mono text-xs",
            accent === "cyan"
              ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-100"
              : "border-amber-400/40 bg-amber-400/10 text-amber-100",
          )}
        >
          {value}
        </motion.div>
      ))}
    </div>
  );
}

function OperationCard({
  label,
  tooltip,
  data,
  active,
}: {
  label: string;
  tooltip: string;
  data: string[];
  active: boolean;
}) {
  return (
    <motion.div
      animate={{ opacity: active ? 1 : 0.45 }}
      className="rounded-xl border border-border/70 bg-background/75 p-2"
      title={tooltip}
    >
      <p className="text-[0.65rem] text-muted-foreground uppercase tracking-[0.16em]">
        {label}
      </p>
      <div className="mt-2 grid grid-cols-6 gap-1">
        {data.map((value, index) => (
          <motion.div
            key={`${label}-${value}-${index}`}
            layout
            className="rounded border border-border/60 bg-muted/50 py-1 text-center font-mono text-[0.62rem]"
          >
            {value}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function buildDesSimulation(
  input: string,
  keyHex: string,
  mode: CipherMode,
): DesSimulationResult {
  const normalizedKey = normalizeHex(keyHex || DEFAULT_DES_KEY, 16);
  const rawInput =
    mode === "encrypt"
      ? textToHexBlock(input || "CipherFlow", 8)
      : normalizeHex(input, 16);

  const roundKeysForward = Array.from({ length: DES_ROUNDS }, (_, index) =>
    deriveRoundSubKey(normalizedKey, index + 1),
  );
  const roundKeys =
    mode === "encrypt" ? roundKeysForward : [...roundKeysForward].reverse();

  const permutedInput = permute(rawInput, INITIAL_PERMUTATION);
  let left = permutedInput.slice(0, 8);
  let right = permutedInput.slice(8, 16);

  const steps: DesStep[] = [
    {
      id: "des-initial",
      round: 0,
      phase: "initial",
      left,
      right,
      expanded: "",
      xored: "",
      sboxed: "",
      permuted: "",
      subKey: "",
      explanation:
        "The 64-bit block is permuted and split into left and right 32-bit halves.",
      formula: "L0 || R0 = IP(plaintext)",
    },
  ];

  for (let round = 1; round <= DES_ROUNDS; round += 1) {
    const subKey = roundKeys[round - 1];
    const expanded = expandHalf(right);
    const xored = xorHex(expanded, subKey);
    const sboxed = runSBoxes(xored);
    const permuted = permute(sboxed, PBOX_TABLE);
    const roundMask = pickByIndex(permuted, ROUND_MASK_TABLE);

    const nextLeft = right;
    const nextRight = xorHex(left, roundMask);

    steps.push({
      id: `des-round-${round}`,
      round,
      phase: "round",
      left: nextLeft,
      right: nextRight,
      expanded,
      xored,
      sboxed,
      permuted,
      subKey,
      explanation:
        "Right half expands, mixes with round key, passes through S-boxes, then permutes before XOR with left half.",
      formula: `L${round}=R${round - 1}, R${round}=L${round - 1} xor F(R${round - 1}, K${round})`,
    });

    left = nextLeft;
    right = nextRight;
  }

  const combined = `${right}${left}`;
  const simulatedOutput = permute(combined, INVERSE_PERMUTATION);

  steps.push({
    id: "des-final",
    round: DES_ROUNDS,
    phase: "final",
    left: right,
    right: left,
    expanded: "",
    xored: "",
    sboxed: "",
    permuted: "",
    subKey: "",
    explanation:
      "After the final Feistel swap, inverse permutation returns bits to output order.",
    formula: "ciphertext = IP^-1(R16 || L16)",
  });

  const realOutputResult = runRealDes(input, normalizedKey, mode);

  return {
    normalizedKey,
    roundKeys,
    steps,
    simulatedOutput,
    realOutput: realOutputResult.output,
    realError: realOutputResult.error,
  };
}

function buildAesPreview(
  input: string,
  keyHex: string,
  mode: CipherMode,
): AesPreview {
  const state0 =
    mode === "encrypt"
      ? chunkToRows(textToHexBlock(input || "CipherFlow", 16))
      : chunkToRows(normalizeHex(input, 32));
  const keyBytes = chunkToRows(normalizeHex(keyHex || DEFAULT_AES_KEY, 32));

  const states =
    mode === "encrypt"
      ? (() => {
          const subBytes = applyAesSubBytes(state0, false);
          const shifted = applyAesShiftRows(subBytes, false);
          const mixed = applyAesMixColumns(shifted, false);
          const keyed = applyAesRoundKey(mixed, keyBytes);

          return [state0, subBytes, shifted, mixed, keyed];
        })()
      : (() => {
          const invShifted = applyAesShiftRows(state0, true);
          const invSubBytes = applyAesSubBytes(invShifted, true);
          const keyed = applyAesRoundKey(invSubBytes, keyBytes);
          const invMixed = applyAesMixColumns(keyed, true);

          return [state0, invShifted, invSubBytes, keyed, invMixed];
        })();

  const realOutput = runRealAes(input, normalizeHex(keyHex, 32), mode);

  return {
    stages:
      mode === "encrypt" ? [...AES_ENCRYPT_STAGES] : [...AES_DECRYPT_STAGES],
    states,
    output: realOutput.output,
    error: realOutput.error,
  };
}

function buildRsaPreview(
  input: string,
  keys: RsaDemoKeyPair,
  mode: CipherMode,
): RsaPreview {
  const exponent = mode === "encrypt" ? keys.e : keys.d;
  const exponentBits = Math.max(1, exponent).toString(2).split("");

  if (mode === "encrypt") {
    const plainBlocks = encodeTextToRsaBlocks(input);

    if (plainBlocks.length === 0) {
      return {
        mode,
        exponentBits,
        steps: [
          {
            id: "rsa-await-plaintext",
            label: "Provide plaintext",
            detail:
              "Type text to encode into byte blocks before public-key encryption.",
            formula: "C = M^e mod n",
            activeBitIndex: null,
            accumulator: 0,
            base: 0,
            exponentRemainder: exponent,
          },
        ],
        output: "",
        error: "Provide plaintext text to encrypt with RSA.",
      };
    }

    const cipherBlocks = plainBlocks.map((block) =>
      modPow(block, keys.e, keys.n),
    );
    const steps = buildRsaFlowSteps({
      mode,
      baseInput: plainBlocks[0] ?? 0,
      exponent,
      modulus: keys.n,
      result: cipherBlocks[0] ?? 0,
    });

    return {
      mode,
      exponentBits,
      steps,
      output: formatRsaCipherBlocks(cipherBlocks),
      error: null,
    };
  }

  const cipherBlocks = parseRsaCipherBlocks(input);

  if (cipherBlocks === null || cipherBlocks.length === 0) {
    return {
      mode,
      exponentBits,
      steps: [
        {
          id: "rsa-await-input",
          label: "Provide ciphertext",
          detail:
            "Enter a decimal or hex ciphertext value to run private-key decryption flow.",
          formula: "M = C^d mod n",
          activeBitIndex: null,
          accumulator: 0,
          base: 0,
          exponentRemainder: exponent,
        },
      ],
      output: "",
      error:
        "Provide RSA ciphertext blocks as decimal or 0x hex values separated by spaces.",
    };
  }

  const normalizedCipherBlocks = cipherBlocks.map(
    (block) => ((block % keys.n) + keys.n) % keys.n,
  );
  const plainBlocks = normalizedCipherBlocks.map((block) =>
    modPow(block, keys.d, keys.n),
  );
  const plainText = decodeRsaBlocksAsText(plainBlocks);
  const steps = buildRsaFlowSteps({
    mode,
    baseInput: normalizedCipherBlocks[0] ?? 0,
    exponent,
    modulus: keys.n,
    result: plainBlocks[0] ?? 0,
  });

  return {
    mode,
    exponentBits,
    steps,
    output: plainText,
    error: null,
  };
}

function buildRsaFlowSteps({
  mode,
  baseInput,
  exponent,
  modulus,
  result,
}: {
  mode: CipherMode;
  baseInput: number;
  exponent: number;
  modulus: number;
  result: number;
}): RsaFlowStep[] {
  const normalizedBase = ((baseInput % modulus) + modulus) % modulus;
  const exponentLabel = mode === "encrypt" ? "e" : "d";
  const sourceLabel = mode === "encrypt" ? "M" : "C";
  const outputLabel = mode === "encrypt" ? "C" : "M";

  const steps: RsaFlowStep[] = [
    {
      id: "rsa-input",
      label: mode === "encrypt" ? "Load message" : "Load ciphertext",
      detail:
        mode === "encrypt"
          ? "Normalize message into the modulo field before exponentiation."
          : "Normalize ciphertext into modulo field before private-key exponentiation.",
      formula: `${sourceLabel}0 = ${sourceLabel} mod n`,
      activeBitIndex: null,
      accumulator: 1,
      base: normalizedBase,
      exponentRemainder: exponent,
    },
    {
      id: "rsa-key",
      label: mode === "encrypt" ? "Use public key" : "Use private key",
      detail:
        mode === "encrypt"
          ? "Apply public exponent e with repeated squaring."
          : "Apply private exponent d with repeated squaring.",
      formula: `${outputLabel} = ${sourceLabel}^${exponentLabel} mod n`,
      activeBitIndex: null,
      accumulator: 1,
      base: normalizedBase,
      exponentRemainder: exponent,
    },
  ];

  let accumulator = 1;
  let currentBase = normalizedBase;
  let exponentRemainder = exponent;
  let bitIndex = 0;

  while (exponentRemainder > 0) {
    const bit = exponentRemainder % 2;

    if (bit === 1) {
      accumulator = (accumulator * currentBase) % modulus;
    }

    steps.push({
      id: `rsa-bit-${bitIndex}`,
      label: `Bit ${bitIndex}: ${bit === 1 ? "Multiply" : "Skip multiply"}`,
      detail:
        bit === 1
          ? "Bit is 1, so accumulator multiplies by current base before modular reduction."
          : "Bit is 0, so accumulator stays; only base squaring continues.",
      formula:
        bit === 1
          ? "acc = (acc * base) mod n; base = base^2 mod n"
          : "base = base^2 mod n",
      activeBitIndex: bitIndex,
      accumulator,
      base: currentBase,
      exponentRemainder,
    });

    exponentRemainder = Math.floor(exponentRemainder / 2);
    currentBase = (currentBase * currentBase) % modulus;
    bitIndex += 1;
  }

  steps.push({
    id: "rsa-final",
    label: mode === "encrypt" ? "Emit ciphertext" : "Recover plaintext",
    detail:
      mode === "encrypt"
        ? "Final accumulator becomes ciphertext output."
        : "Final accumulator recovers plaintext value.",
    formula: `${outputLabel} = ${sourceLabel}^${exponentLabel} mod n`,
    activeBitIndex: null,
    accumulator: result,
    base: currentBase,
    exponentRemainder: 0,
  });

  return steps;
}

function runRealDes(input: string, normalizedKey: string, mode: CipherMode) {
  const key = CryptoJS.enc.Hex.parse(normalizedKey);

  if (mode === "encrypt") {
    const encrypted = CryptoJS.DES.encrypt(input, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    return {
      output: encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase(),
      error: null,
    };
  }

  const cleaned = normalizeHex(input, Math.max(16, stripToHex(input).length));

  if (cleaned.length === 0 || cleaned.length % 2 !== 0) {
    return {
      output: "",
      error: "DES decrypt expects an even-length hex string.",
    };
  }

  try {
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(cleaned),
    });

    const decrypted = CryptoJS.DES.decrypt(cipherParams, key, {
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
      error: "Unable to decrypt this payload with the provided DES key.",
    };
  }
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

      if (inverse) {
        const restored = AES_INV_SBOX.get(value);
        const output = restored ?? value & 0x0f;
        return output.toString(16).padStart(2, "0").toUpperCase();
      }

      const mapped = AES_SBOX[value & 0x0f] ?? value & 0x0f;
      return mapped.toString(16).padStart(2, "0").toUpperCase();
    }),
  );
}

function applyAesShiftRows(state: string[][], inverse: boolean): string[][] {
  return state.map((row, rowIndex) => {
    const copy = [...row];
    const amount = inverse ? copy.length - rowIndex : rowIndex;
    return rotateLeftArray(copy, amount);
  });
}

function applyAesMixColumns(state: string[][], inverse: boolean): string[][] {
  return state.map((row, rowIndex) =>
    row.map((byte, columnIndex) => {
      const value = Number.parseInt(byte, 16);
      const delta = rowIndex * 17 + columnIndex * 29;
      const next = inverse
        ? (value - delta + 512) % 256
        : (value + delta) % 256;
      return next.toString(16).padStart(2, "0").toUpperCase();
    }),
  );
}

function applyAesRoundKey(state: string[][], keyBytes: string[][]): string[][] {
  return state.map((row, rowIndex) =>
    row.map((byte, columnIndex) => {
      const value = Number.parseInt(byte, 16);
      const key = Number.parseInt(keyBytes[rowIndex][columnIndex], 16);
      return (value ^ key).toString(16).padStart(2, "0").toUpperCase();
    }),
  );
}

function createRsaDemoKeyPair(): RsaDemoKeyPair {
  const p = choosePrime();
  let q = choosePrime();

  while (q === p) {
    q = choosePrime();
  }

  const n = p * q;
  const phi = (p - 1) * (q - 1);

  const exponents = [17, 257, 65537, 5, 3];
  const e = exponents.find((candidate) => gcd(candidate, phi) === 1) ?? 17;
  const d = modInverse(e, phi);

  return { p, q, n, phi, e, d };
}

function choosePrime(): number {
  const index = Math.floor(Math.random() * RSA_PRIMES.length);
  return RSA_PRIMES[index] ?? 53;
}

function splitChars(value: string, length: number): string[] {
  return normalizeHex(value, length).split("");
}

function textToHexBlock(value: string, bytes: number): string {
  const encoded = new TextEncoder().encode(value);
  const copy = Array.from(encoded.slice(0, bytes));

  while (copy.length < bytes) {
    copy.push(0);
  }

  return copy
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

function chunkToRows(hex: string): string[][] {
  const normalized = normalizeHex(hex, 32);
  const bytes = normalized.match(/.{1,2}/g) ?? [];

  return [
    bytes.slice(0, 4),
    bytes.slice(4, 8),
    bytes.slice(8, 12),
    bytes.slice(12, 16),
  ];
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

function invertPermutation(table: number[]): number[] {
  const inverse = new Array<number>(table.length);

  table.forEach((targetIndex, currentIndex) => {
    inverse[targetIndex] = currentIndex;
  });

  return inverse;
}

function rotateLeftArray<T>(array: T[], amount: number): T[] {
  if (array.length === 0) {
    return array;
  }

  const offset = ((amount % array.length) + array.length) % array.length;
  return [...array.slice(offset), ...array.slice(0, offset)];
}

function rotateLeftHex(value: string, amount: number): string {
  const chars = value.split("");
  return rotateLeftArray(chars, amount).join("");
}

function deriveRoundSubKey(keyHex: string, round: number): string {
  const rotated = rotateLeftHex(keyHex, round % keyHex.length);
  const compressionTable = [13, 2, 11, 4, 15, 6, 9, 1, 14, 8, 12, 5];
  return compressionTable.map((index) => rotated[index] ?? "0").join("");
}

function permute(input: string, table: number[]): string {
  const chars = input.split("");
  return table.map((index) => chars[index] ?? "0").join("");
}

function pickByIndex(input: string, table: number[]): string {
  const chars = input.split("");
  return table.map((index) => chars[index] ?? "0").join("");
}

function expandHalf(rightHalf: string): string {
  return EXPANSION_TABLE.map((index) => rightHalf[index] ?? "0").join("");
}

function xorHex(left: string, right: string): string {
  const length = Math.min(left.length, right.length);
  let output = "";

  for (let index = 0; index < length; index += 1) {
    const a = Number.parseInt(left[index] ?? "0", 16);
    const b = Number.parseInt(right[index] ?? "0", 16);
    output += (a ^ b).toString(16).toUpperCase();
  }

  return output;
}

function runSBoxes(input: string): string {
  return input
    .split("")
    .map((nibble, index) => {
      const value = Number.parseInt(nibble, 16);
      const mapped = DES_SBOXES[index % DES_SBOXES.length]?.[value] ?? value;
      return mapped.toString(16).toUpperCase();
    })
    .join("");
}

function encodeTextToRsaBlocks(value: string): number[] {
  return Array.from(new TextEncoder().encode(value));
}

function parseRsaCipherBlocks(value: string): number[] | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return [];
  }

  const tokens = trimmed.split(/[\s,]+/).filter(Boolean);
  const blocks: number[] = [];

  for (const token of tokens) {
    const parsed = parseNumberValue(token);

    if (parsed === null) {
      return null;
    }

    blocks.push(parsed);
  }

  return blocks;
}

function formatRsaCipherBlocks(blocks: number[]): string {
  return blocks.join(" ");
}

function decodeRsaBlocksAsText(blocks: number[]): string {
  if (blocks.length === 0) {
    return "[empty]";
  }

  if (blocks.some((block) => block < 0 || block > 255)) {
    return "[unable to decode text]";
  }

  const decoded = new TextDecoder().decode(Uint8Array.from(blocks));
  const printable = decoded.replace(/[^\x20-\x7E]/g, "?").trim();

  return printable || "[non-printable]";
}

function parseNumberValue(value: string): number | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (/^0x[0-9a-fA-F]+$/.test(trimmed)) {
    return Number.parseInt(trimmed, 16);
  }

  if (/^[0-9]+$/.test(trimmed)) {
    return Number.parseInt(trimmed, 10);
  }

  return null;
}

function modPow(base: number, exponent: number, modulus: number): number {
  if (modulus <= 1) {
    return 0;
  }

  let result = 1;
  let currentBase = ((base % modulus) + modulus) % modulus;
  let currentExponent = exponent;

  while (currentExponent > 0) {
    if (currentExponent % 2 === 1) {
      result = (result * currentBase) % modulus;
    }

    currentExponent = Math.floor(currentExponent / 2);
    currentBase = (currentBase * currentBase) % modulus;
  }

  return result;
}

function gcd(a: number, b: number): number {
  let left = a;
  let right = b;

  while (right !== 0) {
    const temp = right;
    right = left % right;
    left = temp;
  }

  return left;
}

function modInverse(value: number, modulo: number): number {
  const [x, , gcdValue] = extendedGcd(value, modulo);

  if (Math.abs(gcdValue) !== 1) {
    return 1;
  }

  const normalized = x % modulo;
  const positive = normalized >= 0 ? normalized : normalized + modulo;
  return Math.floor(positive);
}

function extendedGcd(a: number, b: number): [number, number, number] {
  if (b === 0) {
    return [1, 0, a];
  }

  const [x1, y1, gcdValue] = extendedGcd(b, a % b);
  const quotient = Math.floor(a / b);
  return [y1, x1 - quotient * y1, gcdValue];
}
