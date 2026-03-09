"use client";

import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { presentationStore } from "./slide_store";

export function SlideColumn({ children }: { children: React.ReactNode }) {
  const currentY = useStore(presentationStore, (state) => state.currentY);
  const childrenArray = React.Children.toArray(children);

  const childToRender = childrenArray[currentY] || childrenArray[0];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentY}
        initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -30, filter: "blur(4px)" }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="flex h-full w-full items-center justify-center"
      >
        {childToRender}
      </motion.div>
    </AnimatePresence>
  );
}
