"use client";

import { Presentation } from "./presentation";
import { IntroSlide } from "./slides/1_intro_slide";
import {
  HistoryCurseSlide,
  HistoryDeepDiveSlide,
} from "./slides/2_history_slide";
import { DNASlide } from "./slides/3_dna_slide";
import {
  BorrowingNLLSlide,
  MoveSemanticsSlide,
  OwnershipSlide,
  StackHeapSlide,
} from "./slides/4_ownership_slide";
import {
  MonomorphizationSlide,
  OOPvsTraitsSlide,
} from "./slides/5_oop_traits_slide";
import { FunctionalSlide } from "./slides/6_functional_slide";
import {
  ConcurrencyEcosystemSlide,
  FearlessConcurrencySlide,
} from "./slides/7_concurrency_slide";
import { LogicSlide } from "./slides/8_logic_slide";
import { GrandConclusionSlide } from "./slides/9_conclusion_slide";

export function RustDeck() {
  return (
    <Presentation showHints>
      <Presentation.Slide id="intro" label="Introduction">
        <IntroSlide />
      </Presentation.Slide>

      <Presentation.Stack id="history" label="History">
        <Presentation.Slide id="history-tradeoff" label="The Tradeoff">
          <HistoryCurseSlide />
        </Presentation.Slide>
        <Presentation.Slide id="history-deep-dive" label="Technical Reality">
          <HistoryDeepDiveSlide />
        </Presentation.Slide>
      </Presentation.Stack>

      <Presentation.Slide id="dna" label="Rust DNA">
        <DNASlide />
      </Presentation.Slide>

      <Presentation.Stack id="ownership" label="Ownership">
        <Presentation.Slide id="ownership-rules" label="Ownership Rules">
          <OwnershipSlide />
        </Presentation.Slide>
        <Presentation.Slide id="stack-vs-heap" label="Stack vs Heap">
          <StackHeapSlide />
        </Presentation.Slide>
        <Presentation.Slide id="move-semantics" label="Move Semantics">
          <MoveSemanticsSlide />
        </Presentation.Slide>
        <Presentation.Slide id="borrowing-nll" label="Borrowing & NLL">
          <BorrowingNLLSlide />
        </Presentation.Slide>
      </Presentation.Stack>

      <Presentation.Stack id="traits" label="Traits">
        <Presentation.Slide id="oop-vs-traits" label="OOP vs Traits">
          <OOPvsTraitsSlide />
        </Presentation.Slide>
        <Presentation.Slide id="monomorphization" label="Static Polymorphism">
          <MonomorphizationSlide />
        </Presentation.Slide>
      </Presentation.Stack>

      <Presentation.Slide id="functional" label="Functional Programming">
        <FunctionalSlide />
      </Presentation.Slide>

      <Presentation.Stack id="concurrency" label="Concurrency">
        <Presentation.Slide
          id="ecosystem-concurrency"
          label="Concurrency Ecosystem"
        >
          <ConcurrencyEcosystemSlide />
        </Presentation.Slide>
        <Presentation.Slide
          id="fearless-concurrency"
          label="Fearless Concurrency"
        >
          <FearlessConcurrencySlide />
        </Presentation.Slide>
      </Presentation.Stack>

      <Presentation.Slide id="logic" label="Logic">
        <LogicSlide />
      </Presentation.Slide>

      <Presentation.Slide id="conclusion" label="Conclusion">
        <GrandConclusionSlide />
      </Presentation.Slide>
    </Presentation>
  );
}
