import { motion } from "motion/react";
import type React from "react";

interface SlideProps {
  children: React.ReactNode;
  className?: string;
}

export function Slide({ children, className = "" }: SlideProps) {
  return (
    <main
      className={`flex h-full w-full flex-col items-center justify-center p-8 md:p-16 lg:p-24 ${className}`}
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
  return (
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`mb-6 font-extrabold text-5xl tracking-tight lg:text-7xl ${className}`}
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
  return (
    <motion.h2
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`mb-12 text-2xl text-muted-foreground lg:text-3xl ${className}`}
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={`prose prose-lg dark:prose-invert max-w-none ${className}`}
    >
      {children}
    </motion.div>
  );
}
