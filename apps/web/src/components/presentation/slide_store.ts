import { createStore } from "@tanstack/react-store";

export interface PresentationState {
  currentX: number;
  currentY: number;
  grid: number[];
  debug: boolean;
  showHints: boolean;
  setGrid: (grid: number[]) => void;
  setDebug: (debug: boolean) => void;
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
  grid: [],
  debug: false,
  showHints: true,
  setGrid: (grid) => {
    presentationStore.setState((state) => {
      let nextX = state.currentX;
      let nextY = state.currentY;

      if (grid.length > 0) {
        nextX = Math.max(0, Math.min(nextX, grid.length - 1));
        const maxY = grid[nextX] || 0;
        nextY = Math.max(0, Math.min(nextY, maxY));
      }

      return { ...state, grid, currentX: nextX, currentY: nextY };
    });
  },
  setDebug: (debug) => {
    presentationStore.setState((state) => ({ ...state, debug }));
  },
  setShowHints: (showHints) => {
    presentationStore.setState((state) => ({ ...state, showHints }));
  },
  goRight: () => {
    presentationStore.setState((state) => {
      if (state.currentY === 0 && state.currentX < state.grid.length - 1) {
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
      const maxY = state.grid[state.currentX] || 0;
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
      if (state.grid.length === 0) {
        return { ...state, currentX: Math.max(0, x), currentY: Math.max(0, y) };
      }

      // Ensure grid bounds
      const safeX = Math.max(0, Math.min(x, state.grid.length - 1));
      const maxY = state.grid[safeX] || 0;
      const safeY = Math.max(0, Math.min(y, maxY));
      return { ...state, currentX: safeX, currentY: safeY };
    });
  },
});
