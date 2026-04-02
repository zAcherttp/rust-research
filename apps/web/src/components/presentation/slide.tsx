"use client";

import { cn } from "@rust-research/ui/lib/utils";
import { motion } from "motion/react";
import type React from "react";
import { CodeBlock, type CodeBlockProps } from "./code_block";

const revealEase: [number, number, number, number] = [0.32, 0.72, 0, 1];

export function getRevealTransition(index = 0, delayStart = 0.18) {
  return {
    duration: 0.35,
    delay: delayStart + index * 0.1,
    ease: revealEase,
  };
}

export function getRevealProps(index = 0, y = 18) {
  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: getRevealTransition(index),
  };
}

interface SlideFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function SlideFrame({ children, className }: SlideFrameProps) {
  return (
    <main className="flex h-full w-full items-center justify-center p-8 md:p-16 lg:p-24">
      <div className={cn("mx-auto flex h-full w-full max-w-6xl flex-col", className)}>
        {children}
      </div>
    </main>
  );
}

export function SlideHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("max-w-5xl", className)}>{children}</div>;
}

export function SlideTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.h1
      {...getRevealProps(0, -18)}
      className={cn(
        "font-extrabold text-5xl tracking-tight lg:text-7xl",
        className,
      )}
    >
      {children}
    </motion.h1>
  );
}

export function SlideSubtitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.h2
      {...getRevealProps(1, -12)}
      className={cn(
        "mt-6 text-2xl text-muted-foreground lg:text-3xl",
        className,
      )}
    >
      {children}
    </motion.h2>
  );
}

export function SlideBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      {...getRevealProps(2, 18)}
      className={cn("mt-10 flex flex-1 flex-col", className)}
    >
      {children}
    </motion.div>
  );
}

export interface PlaceholderPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function PlaceholderPanel({
  children,
  className,
}: PlaceholderPanelProps) {
  return (
    <div
      className={cn(
        "flex min-h-[14rem] w-full items-center justify-center rounded-xl border border-border border-dashed bg-muted/50 p-8 text-center text-muted-foreground italic",
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface InfoPanelProps {
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  revealIndex?: number;
}

export function InfoPanel({
  title,
  eyebrow,
  children,
  className,
  revealIndex = 0,
}: InfoPanelProps) {
  return (
    <motion.div
      {...getRevealProps(revealIndex)}
      className={cn(
        "rounded-[1.5rem] border border-border/70 bg-card/80 p-6 text-card-foreground backdrop-blur",
        className,
      )}
    >
      {eyebrow ? (
        <div className="font-semibold text-muted-foreground text-xs uppercase tracking-[0.18em]">
          {eyebrow}
        </div>
      ) : null}
      {title ? (
        <h3 className="mt-2 font-semibold text-foreground text-xl">{title}</h3>
      ) : null}
      <div className={cn(title || eyebrow ? "mt-4" : "")}>{children}</div>
    </motion.div>
  );
}

export interface CompareCardProps {
  title: React.ReactNode;
  summary?: React.ReactNode;
  eyebrow?: React.ReactNode;
  media?: React.ReactNode;
  points?: React.ReactNode[];
  className?: string;
  eyebrowClassName?: string;
  revealIndex?: number;
}

export function CompareCard({
  title,
  summary,
  eyebrow,
  media,
  points,
  className,
  eyebrowClassName,
  revealIndex = 0,
}: CompareCardProps) {
  return (
    <motion.div
      {...getRevealProps(revealIndex, 24)}
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-border/70 bg-linear-to-br from-card via-card to-background p-8",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-white/15" />

      {eyebrow ? (
        <div
          className={cn(
            "inline-flex rounded-full border px-4 py-1.5 font-semibold text-xs uppercase tracking-[0.16em]",
            eyebrowClassName,
          )}
        >
          {eyebrow}
        </div>
      ) : null}

      {media ? <div className="mt-6">{media}</div> : null}

      <h3 className="mt-6 font-semibold text-foreground text-3xl leading-tight">
        {title}
      </h3>

      {summary ? (
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">
          {summary}
        </p>
      ) : null}

      {points?.length ? (
        <div className="mt-8 space-y-3">
          {points.map((point, index) => (
            <div
              key={`compare-point-${index}`}
              className="flex items-start gap-3 border-border/60 border-t pt-3 first:border-t-0 first:pt-0"
            >
              <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-current" />
              <div className="text-base text-foreground/88 leading-relaxed">{point}</div>
            </div>
          ))}
        </div>
      ) : null}
    </motion.div>
  );
}

export function CompareSplit({
  children,
  center,
  className,
  gridClassName,
}: {
  children: React.ReactNode;
  center?: React.ReactNode;
  className?: string;
  gridClassName?: string;
}) {
  const items = Array.isArray(children) ? children : [children];

  if (!center || items.length !== 2) {
    return <div className={cn(className, gridClassName)}>{children}</div>;
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "grid gap-6 lg:grid-cols-[minmax(0,1fr)_120px_minmax(0,1fr)] lg:items-center",
          gridClassName,
        )}
      >
        {items[0]}
        <motion.div
          {...getRevealProps(1, 16)}
          className="order-first flex items-center justify-center lg:order-0"
        >
          {center}
        </motion.div>
        {items[1]}
      </div>
    </div>
  );
}

export function StepList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("grid w-full gap-6", className)}>{children}</div>;
}

export interface StepItemProps {
  step: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  revealIndex?: number;
}

export function StepItem({
  step,
  children,
  className,
  revealIndex = 0,
}: StepItemProps) {
  return (
    <motion.div
      {...getRevealProps(revealIndex, 16)}
      className={cn(
        "flex items-center gap-6 rounded-xl border border-border bg-card p-6",
        className,
      )}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500/20 font-bold text-2xl text-orange-500">
        {step}
      </div>
      <div className="text-xl leading-relaxed">{children}</div>
    </motion.div>
  );
}

export interface MetricCardProps {
  title: React.ReactNode;
  children: React.ReactNode;
  accentClassName: string;
  className?: string;
  revealIndex?: number;
}

export function MetricCard({
  title,
  children,
  accentClassName,
  className,
  revealIndex = 0,
}: MetricCardProps) {
  return (
    <motion.div
      {...getRevealProps(revealIndex, 18)}
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-8 text-center shadow-lg",
        className,
      )}
    >
      <div className={cn("absolute top-0 h-1 w-full", accentClassName)} />
      <span className="mb-3 block font-bold text-2xl uppercase tracking-widest">
        {title}
      </span>
      <div className="text-lg text-muted-foreground">{children}</div>
    </motion.div>
  );
}

export interface CodeStageProps extends Omit<CodeBlockProps, "delay"> {
  narrative?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
  gridClassName?: string;
  codeColumnClassName?: string;
  asideColumnClassName?: string;
}

export function CodeStage({
  narrative,
  aside,
  className,
  gridClassName,
  codeColumnClassName,
  asideColumnClassName,
  ...codeBlockProps
}: CodeStageProps) {
  return (
    <div
      className={cn(
        "grid h-full w-full items-center gap-12",
        gridClassName,
        className,
      )}
    >
      <div
        className={cn(
          "flex h-full flex-col justify-center space-y-6",
          codeColumnClassName,
        )}
      >
        <CodeBlock {...codeBlockProps} />
        {narrative ? (
          <div className="text-sm text-muted-foreground leading-relaxed">
            {narrative}
          </div>
        ) : null}
      </div>

      {aside ? (
        <div
          className={cn(
            "flex h-full min-h-[320px] flex-col justify-center",
            asideColumnClassName,
          )}
        >
          {aside}
        </div>
      ) : null}
    </div>
  );
}

export const Slide = SlideFrame;
export const SlideContent = SlideBody;
