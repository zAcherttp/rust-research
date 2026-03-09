import { createStore } from "@tanstack/react-store";

export interface PresentationState {
  currentX: number;
  currentY: number;
  grid: number[];
  setGrid: (grid: number[]) => void;
  goRight: () => void;
  goLeft: () => void;
  goDown: () => void;
  goUp: () => void;
  resetY: () => void;
}

export const presentationStore = createStore<PresentationState>({
  currentX: 0,
  currentY: 0,
  grid: [],
  setGrid: (grid) => {
    presentationStore.setState((state) => ({ ...state, grid }));
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
});
