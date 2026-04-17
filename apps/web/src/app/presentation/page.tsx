import { Suspense } from "react";
import { RustDeck } from "@/components/presentation/rust_deck";

export default function PresentationPage() {
  return (
    <Suspense fallback={null}>
      <RustDeck />
    </Suspense>
  );
}
