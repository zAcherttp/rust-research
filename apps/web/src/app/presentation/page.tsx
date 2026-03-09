"use client";

import { SlideColumn } from "@/components/presentation/slide_column";
import { SlideViewer } from "@/components/presentation/slide_viewer";
import { IntroSlide } from "@/components/presentation/slides/1_intro_slide";
import {
  HistoryCurseSlide,
  HistoryDeepDiveSlide,
} from "@/components/presentation/slides/2_history_slide";
import { DNASlide } from "@/components/presentation/slides/3_dna_slide";
import {
  BorrowingNLLSlide,
  MoveSemanticsSlide,
  OwnershipSlide,
  StackHeapSlide,
} from "@/components/presentation/slides/4_ownership_slide";
import {
  MonomorphizationSlide,
  OOPvsTraitsSlide,
} from "@/components/presentation/slides/5_oop_traits_slide";
import { FunctionalSlide } from "@/components/presentation/slides/6_functional_slide";
import {
  ConcurrencyEcosystemSlide,
  FearlessConcurrencySlide,
} from "@/components/presentation/slides/7_concurrency_slide";
import { LogicSlide } from "@/components/presentation/slides/8_logic_slide";
import { GrandConclusionSlide } from "@/components/presentation/slides/9_conclusion_slide";

export default function PresentationPage() {
  return (
    <SlideViewer showHints>
      {/* 1.0 */}
      <IntroSlide />

      {/* 2.0 & 2.1 */}
      <SlideColumn>
        <HistoryCurseSlide />
        <HistoryDeepDiveSlide />
      </SlideColumn>

      {/* 3.0 */}
      <DNASlide />

      {/* 4.0, 4.1, 4.2, 4.3 */}
      <SlideColumn>
        <OwnershipSlide />
        <StackHeapSlide />
        <MoveSemanticsSlide />
        <BorrowingNLLSlide />
      </SlideColumn>

      {/* 5.0, 5.1 */}
      <SlideColumn>
        <OOPvsTraitsSlide />
        <MonomorphizationSlide />
      </SlideColumn>

      {/* 6.0 */}
      <FunctionalSlide />

      {/* 7.0, 7.1 */}
      <SlideColumn>
        <ConcurrencyEcosystemSlide />
        <FearlessConcurrencySlide />
      </SlideColumn>

      {/* 8.0 */}
      <LogicSlide />

      {/* 9.0 */}
      <GrandConclusionSlide />
    </SlideViewer>
  );
}
