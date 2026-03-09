"use client";

import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { presentationStore } from "./slide_store";

interface SlideViewerProps {
	children: React.ReactNode[];
}

export function SlideViewer({ children }: SlideViewerProps) {
	const currentSlideIndex = useStore(
		presentationStore,
		(state) => state.currentSlideIndex,
	);

	useEffect(() => {
		// Initialize total slides based on children count
		presentationStore.setState((state) => ({
			...state,
			totalSlides: children.length,
		}));
	}, [children.length]);

	// Global hotkeys for slide navigation
	useHotkeys(
		["ArrowRight", "Space"],
		(e) => {
			e.preventDefault();
			presentationStore.setState((state) => ({
				...state,
				currentSlideIndex: Math.min(
					state.currentSlideIndex + 1,
					state.totalSlides - 1,
				),
			}));
		},
		{ preventDefault: true },
	);

	useHotkeys(
		["ArrowLeft"],
		(e) => {
			e.preventDefault();
			presentationStore.setState((state) => ({
				...state,
				currentSlideIndex: Math.max(state.currentSlideIndex - 1, 0),
			}));
		},
		{ preventDefault: true },
	);

	return (
		<div className="relative h-svh w-svw overflow-hidden bg-background text-foreground selection:bg-primary/30">
			<AnimatePresence mode="wait">
				<motion.div
					key={currentSlideIndex}
					initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
					animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
					exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
					transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
					className="h-full w-full"
				>
					{children[currentSlideIndex]}
				</motion.div>
			</AnimatePresence>

			{/* Progress Indicator */}
			<div className="absolute right-0 bottom-4 left-0 flex justify-center gap-2">
				{children.map((_, i) => (
					<div
						key={i}
						className={`h-1.5 rounded-full transition-all duration-300 ${
							i === currentSlideIndex ? "w-8 bg-primary" : "w-2 bg-primary/20"
						}`}
					/>
				))}
			</div>
		</div>
	);
}
