"use client";

import { SlideViewer } from "@/components/presentation/slide_viewer";
import { IntroSlide } from "@/components/presentation/slides/1_intro_slide";
import { WhyRustSlide } from "@/components/presentation/slides/2_why_rust_slide";
import { SyntaxSlide } from "@/components/presentation/slides/3_syntax_slide";
import { OwnershipSlide } from "@/components/presentation/slides/4_ownership_slide";
import { BorrowingSlide } from "@/components/presentation/slides/5_borrowing_slide";
import { ConcurrencySlide } from "@/components/presentation/slides/6_concurrency_slide";
import { ConclusionSlide } from "@/components/presentation/slides/7_conclusion_slide";

export default function PresentationPage() {
	return (
		<SlideViewer>
			<IntroSlide />
			<WhyRustSlide />
			<SyntaxSlide />
			<OwnershipSlide />
			<BorrowingSlide />
			<ConcurrencySlide />
			<ConclusionSlide />
		</SlideViewer>
	);
}
