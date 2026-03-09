import { createStore } from "@tanstack/react-store";
import { StrictMode } from "react";

export interface PresentationState {
	currentSlideIndex: number;
	totalSlides: number;
	setTotalSlides: (total: number) => void;
	nextSlide: () => void;
	prevSlide: () => void;
	goToSlide: (index: number) => void;
}

export const presentationStore = createStore<PresentationState>({
	currentSlideIndex: 0,
	totalSlides: 0,
	setTotalSlides: (total) => {
		presentationStore.setState((state) => ({ ...state, totalSlides: total }));
	},
	nextSlide: () => {
		presentationStore.setState((state) => {
			if (state.currentSlideIndex < state.totalSlides - 1) {
				return { ...state, currentSlideIndex: state.currentSlideIndex + 1 };
			}
			return state;
		});
	},
	prevSlide: () => {
		presentationStore.setState((state) => {
			if (state.currentSlideIndex > 0) {
				return { ...state, currentSlideIndex: state.currentSlideIndex - 1 };
			}
			return state;
		});
	},
	goToSlide: (index) => {
		presentationStore.setState((state) => {
			if (index >= 0 && index < state.totalSlides) {
				return { ...state, currentSlideIndex: index };
			}
			return state;
		});
	},
});
