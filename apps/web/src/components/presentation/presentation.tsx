"use client";

import { cn } from "@rust-research/ui/lib/utils";
import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from "motion/react";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { type ReactElement, useEffect, useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  presentationStore,
  resolveSlide,
  type DeckItem,
  type DeckSlide,
} from "./slide_store";

export interface PresentationInitialSlide {
  x: number;
  y: number;
}

export interface PresentationProps {
  children: React.ReactNode;
  showHints?: boolean;
  initialSlide?: PresentationInitialSlide;
  className?: string;
}

export interface PresentationSlideProps {
  id: string;
  label?: string;
  className?: string;
  children: React.ReactNode;
}

export interface PresentationStackProps {
  id: string;
  label?: string;
  children: React.ReactNode;
}

function PresentationSlide({
  children,
  className,
}: PresentationSlideProps) {
  return <div className={cn("h-full w-full", className)}>{children}</div>;
}

function PresentationStack({ children }: PresentationStackProps) {
  return <>{children}</>;
}

function PresentationRoot({
  children,
  showHints = true,
  initialSlide,
  className,
}: PresentationProps) {
  const currentX = useStore(presentationStore, (state) => state.currentX);
  const currentY = useStore(presentationStore, (state) => state.currentY);
  const deck = useStore(presentationStore, (state) => state.deck);
  const storeShowHints = useStore(presentationStore, (state) => state.showHints);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSlideParam = searchParams.get("slide");

  const normalizedDeck = useMemo(() => normalizeDeck(children), [children]);

  useEffect(() => {
    presentationStore.state.setDeck(normalizedDeck);
  }, [normalizedDeck]);

  useEffect(() => {
    presentationStore.state.setShowHints(showHints);
  }, [showHints]);

  useEffect(() => {
    const parsedFromUrl = parseSlideParam(currentSlideParam);
    const target = parsedFromUrl ?? initialSlide ?? { x: 0, y: 0 };

    presentationStore.state.setSlide(target.x, target.y);
  }, [currentSlideParam, initialSlide]);

  useEffect(() => {
    if (deck.length === 0) {
      return;
    }

    const nextParam = `${currentX}.${currentY}`;
    if (currentSlideParam === nextParam) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.set("slide", nextParam);

    router.replace(`${pathname}?${nextSearchParams.toString()}` as Route, {
      scroll: false,
    });
  }, [currentSlideParam, currentX, currentY, deck.length, pathname, router, searchParams]);

  useHotkeys(
    ["ArrowRight", "Space"],
    (event) => {
      event.preventDefault();
      presentationStore.state.goRight();
    },
    { preventDefault: true },
  );

  useHotkeys(
    "ArrowLeft",
    (event) => {
      event.preventDefault();
      presentationStore.state.goLeft();
    },
    { preventDefault: true },
  );

  useHotkeys(
    "ArrowDown",
    (event) => {
      event.preventDefault();
      presentationStore.state.goDown();
    },
    { preventDefault: true },
  );

  useHotkeys(
    "ArrowUp",
    (event) => {
      event.preventDefault();
      presentationStore.state.goUp();
    },
    { preventDefault: true },
  );

  useHotkeys(
    "Escape",
    (event) => {
      event.preventDefault();
      presentationStore.state.resetY();
    },
    { preventDefault: true },
  );

  const resolvedSlide = resolveSlide(deck, { x: currentX, y: currentY });
  const maxY = resolvedSlide?.maxY ?? 0;

  return (
    <div
      className={cn(
        "relative h-svh w-svw overflow-hidden bg-background text-foreground selection:bg-primary/30",
        className,
      )}
    >
      <AnimatePresence mode="wait">
        {resolvedSlide ? (
          <motion.div
            key={`${resolvedSlide.deckId}:${resolvedSlide.slideId}:${resolvedSlide.x}.${resolvedSlide.y}`}
            initial={{ opacity: 0, x: 18, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -18, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="h-full w-full"
          >
            {resolvedSlide.element}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="absolute right-0 bottom-4 left-0 flex justify-center gap-2">
        {deck.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === currentX ? "w-8 bg-primary" : "w-2 bg-primary/20",
            )}
          />
        ))}
      </div>

      {storeShowHints && maxY > 0 && currentY === 0 ? (
        <div className="absolute right-0 bottom-12 left-0 flex animate-bounce justify-center opacity-50">
          <span className="font-medium text-sm">Press ↓ for Deep Dive</span>
        </div>
      ) : null}

      {storeShowHints && currentY > 0 ? (
        <div className="absolute top-4 right-0 left-0 flex justify-center opacity-50">
          <span className="font-medium text-sm">Press ↑ or ESC to return</span>
        </div>
      ) : null}

      {maxY > 0 ? (
        <div className="absolute top-0 right-4 bottom-0 flex flex-col justify-center gap-2">
          {Array.from({ length: maxY + 1 }).map((_, index) => (
            <div
              key={`y-${index}`}
              className={cn(
                "w-1.5 rounded-full transition-all duration-300",
                index === currentY ? "h-8 bg-primary" : "h-2 bg-primary/20",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function normalizeDeck(children: React.ReactNode): DeckItem[] {
  return React.Children.toArray(children).flatMap((child, index) => {
    if (!isPresentationElement<PresentationSlideProps>(child, PresentationSlide)) {
      if (!isPresentationElement<PresentationStackProps>(child, PresentationStack)) {
        return [];
      }

      const stackSlides = React.Children.toArray(child.props.children).flatMap(
        (stackChild, stackIndex) => {
          if (!isPresentationElement<PresentationSlideProps>(stackChild, PresentationSlide)) {
            return [];
          }

          return [toDeckSlide(stackChild, `${child.props.id}-${stackIndex}`)];
        },
      );

      if (stackSlides.length === 0) {
        return [];
      }

      return [
        {
          id: child.props.id || `stack-${index}`,
          label: child.props.label,
          slides: stackSlides,
        },
      ];
    }

    return [
      {
        id: child.props.id || `slide-${index}`,
        label: child.props.label,
        slides: [toDeckSlide(child, `slide-${index}`)],
      },
    ];
  });
}

function toDeckSlide(
  element: ReactElement<PresentationSlideProps>,
  fallbackId: string,
): DeckSlide {
  return {
    id: element.props.id || fallbackId,
    label: element.props.label,
    element,
  };
}

function isPresentationElement<Props>(
  value: React.ReactNode,
  component: (props: Props) => React.ReactNode,
): value is ReactElement<Props> {
  return React.isValidElement(value) && value.type === component;
}

function parseSlideParam(slideParam: string | null): PresentationInitialSlide | null {
  if (!slideParam) {
    return null;
  }

  const [x, y] = slideParam.split(".");
  const parsedX = Number.parseInt(x ?? "", 10);
  const parsedY = Number.parseInt(y ?? "", 10);

  if (Number.isNaN(parsedX) || Number.isNaN(parsedY)) {
    return null;
  }

  return { x: parsedX, y: parsedY };
}

type PresentationComponent = ((props: PresentationProps) => React.ReactNode) & {
  Slide: typeof PresentationSlide;
  Stack: typeof PresentationStack;
};

export const Presentation = Object.assign(PresentationRoot, {
  Slide: PresentationSlide,
  Stack: PresentationStack,
}) as PresentationComponent;
