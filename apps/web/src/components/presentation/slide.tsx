import { useStore } from "@tanstack/react-store";
import { motion } from "motion/react";
import type React from "react";
import { presentationStore } from "./slide_store";

interface SlideProps {
  children: React.ReactNode;
  className?: string;
}

export function Slide({ children, className = "" }: SlideProps) {
  const debug = useStore(presentationStore, (state) => state.debug);

  return (
    <main
      className={`flex h-full w-full flex-col items-center justify-center p-8 md:p-16 lg:p-24 ${debug ? "border border-red-500" : ""} ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </main>
  );
}

export function SlideTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const debug = useStore(presentationStore, (state) => state.debug);

  return (
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={`mb-6 font-extrabold text-5xl tracking-tight lg:text-7xl ${debug ? "border border-red-500" : ""} ${className}`}
    >
      {children}
    </motion.h1>
  );
}

export function SlideSubtitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const debug = useStore(presentationStore, (state) => state.debug);

  return (
    <motion.h2
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className={`mb-12 text-2xl text-muted-foreground lg:text-3xl ${debug ? "border border-red-500" : ""} ${className}`}
    >
      {children}
    </motion.h2>
  );
}

export function SlideContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const debug = useStore(presentationStore, (state) => state.debug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={`prose prose-lg dark:prose-invert max-w-none ${debug ? "border border-red-500" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}
