import { RustDeck } from "@/components/presentation/rust_deck";
import { Suspense } from "react";

export default function PresentationPage() {
  return (
    <Suspense fallback={null}>
      <RustDeck />
    </Suspense>
  );
}
