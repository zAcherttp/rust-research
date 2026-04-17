import { createStore } from "@tanstack/react-store";
import type { ReactElement } from "react";
import type {
  PresentationInitialSlide,
  PresentationSlideProps,
} from "./presentation";

export interface DeckSlide {
  id: string;
  label?: string;
  element: ReactElement<PresentationSlideProps>;
}

export interface DeckItem {
  id: string;
  label?: string;
  slides: DeckSlide[];
}

export interface ResolvedSlide {
  deckId: string;
  deckLabel?: string;
  slideId: string;
  slideLabel?: string;
  x: number;
  y: number;
  maxY: number;
  element: ReactElement<PresentationSlideProps>;
}

export interface PresentationState {
  currentX: number;
  currentY: number;
  deck: DeckItem[];
  showHints: boolean;
  setDeck: (deck: DeckItem[]) => void;
  setShowHints: (showHints: boolean) => void;
  goRight: () => void;
  goLeft: () => void;
  goDown: () => void;
  goUp: () => void;
  resetY: () => void;
  setSlide: (x: number, y: number) => void;
}

export const presentationStore = createStore<PresentationState>({
  currentX: 0,
  currentY: 0,
  deck: [],
  showHints: true,
  setDeck: (deck) => {
    presentationStore.setState((state) => {
      if (deck.length === 0) {
        return { ...state, deck, currentX: 0, currentY: 0 };
      }

      const nextX = clamp(state.currentX, 0, deck.length - 1);
      const maxY = Math.max(0, deck[nextX]?.slides.length - 1);
      const nextY = clamp(state.currentY, 0, maxY);

      return { ...state, deck, currentX: nextX, currentY: nextY };
    });
  },
  setShowHints: (showHints) => {
    presentationStore.setState((state) => ({ ...state, showHints }));
  },
  goRight: () => {
    presentationStore.setState((state) => {
      if (state.currentY === 0 && state.currentX < state.deck.length - 1) {
        return { ...state, currentX: state.currentX + 1 };
      }

      return state;
    });
  },
  goLeft: () => {
    presentationStore.setState((state) => {
      if (state.currentY === 0 && state.currentX > 0) {
        return { ...state, currentX: state.currentX - 1 };
      }

      return state;
    });
  },
  goDown: () => {
    presentationStore.setState((state) => {
      const maxY = Math.max(
        0,
        (state.deck[state.currentX]?.slides.length ?? 1) - 1,
      );
      if (state.currentY < maxY) {
        return { ...state, currentY: state.currentY + 1 };
      }

      return state;
    });
  },
  goUp: () => {
    presentationStore.setState((state) => {
      if (state.currentY > 0) {
        return { ...state, currentY: state.currentY - 1 };
      }

      return state;
    });
  },
  resetY: () => {
    presentationStore.setState((state) => ({ ...state, currentY: 0 }));
  },
  setSlide: (x, y) => {
    presentationStore.setState((state) => {
      if (state.deck.length === 0) {
        return {
          ...state,
          currentX: Math.max(0, x),
          currentY: Math.max(0, y),
        };
      }

      const safeX = clamp(x, 0, state.deck.length - 1);
      const maxY = Math.max(0, (state.deck[safeX]?.slides.length ?? 1) - 1);
      const safeY = clamp(y, 0, maxY);

      return { ...state, currentX: safeX, currentY: safeY };
    });
  },
});

export function resolveSlide(
  deck: DeckItem[],
  slide: PresentationInitialSlide,
): ResolvedSlide | null {
  const item = deck[slide.x];
  if (!item) {
    return null;
  }

  const maxY = Math.max(0, item.slides.length - 1);
  const safeY = clamp(slide.y, 0, maxY);
  const currentSlide = item.slides[safeY];

  if (!currentSlide) {
    return null;
  }

  return {
    deckId: item.id,
    deckLabel: item.label,
    slideId: currentSlide.id,
    slideLabel: currentSlide.label,
    x: slide.x,
    y: safeY,
    maxY,
    element: currentSlide.element,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
