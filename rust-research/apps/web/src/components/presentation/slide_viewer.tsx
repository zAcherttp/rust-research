"use client";

import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { presentationStore } from "./slide_store";

interface SlideViewerProps {
  children: React.ReactNode;
}

export function SlideViewer({ children }: SlideViewerProps) {
  const currentX = useStore(presentationStore, (state) => state.currentX);
  const currentY = useStore(presentationStore, (state) => state.currentY);
  const grid = useStore(presentationStore, (state) => state.grid);

  const childrenArray = React.Children.toArray(children);

  useEffect(() => {
    const newGrid = childrenArray.map((child) => {
      if (React.isValidElement(child) && child.props.children) {
        return Math.max(0, React.Children.count(child.props.children) - 1);
      }
      return 0;
    });

    presentationStore.getState().setGrid(newGrid);
  }, [children]);

  useHotkeys(
    ["ArrowRight", "Space"],
    (e) => {
      e.preventDefault();
      presentationStore.getState().goRight();
    },
    { preventDefault: true },
  );

  useHotkeys(
    ["ArrowLeft"],
    (e) => {
      e.preventDefault();
      presentationStore.getState().goLeft();
    },
    { preventDefault: true },
  );

  useHotkeys(
    ["ArrowDown"],
    (e) => {
      e.preventDefault();
      presentationStore.getState().goDown();
    },
    { preventDefault: true },
  );

  useHotkeys(
    ["ArrowUp"],
    (e) => {
      e.preventDefault();
      presentationStore.getState().goUp();
    },
    { preventDefault: true },
  );

  useHotkeys(
    ["Escape"],
    (e) => {
      e.preventDefault();
      presentationStore.getState().resetY();
    },
    { preventDefault: true },
  );

  const maxY = grid[currentX] || 0;

  return (
    <div className="relative h-svh w-svw overflow-hidden bg-background text-foreground selection:bg-primary/30">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentX}
          initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="h-full w-full"
        >
          {childrenArray[currentX]}
        </motion.div>
      </AnimatePresence>

      {/* X Progress Indicator */}
      <div className="absolute right-0 bottom-4 left-0 flex justify-center gap-2">
        {childrenArray.map((_, i) => (
          <div
            key={`x-${i}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentX ? "w-8 bg-primary" : "w-2 bg-primary/20"
            }`}
          />
        ))}
      </div>

      {/* Y Progress Hint (Down arrow context) */}
      {maxY > 0 && currentY === 0 && (
        <div className="absolute right-0 bottom-12 left-0 flex animate-bounce justify-center opacity-50">
          <span className="font-medium text-sm">
            Press &darr; for Deep Dive
          </span>
        </div>
      )}
      {currentY > 0 && (
        <div className="absolute top-4 right-0 left-0 flex justify-center opacity-50">
          <span className="font-medium text-sm">
            Press &uarr; or ESC to return
          </span>
        </div>
      )}

      {/* Y Progress indicators on the side if deep dive exists */}
      {maxY > 0 && (
        <div className="absolute top-0 right-4 bottom-0 flex flex-col justify-center gap-2">
          {Array.from({ length: maxY + 1 }).map((_, i) => (
            <div
              key={`y-${i}`}
              className={`w-1.5 rounded-full transition-all duration-300 ${
                i === currentY ? "h-8 bg-primary" : "h-2 bg-primary/20"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
