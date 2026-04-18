import type { Metadata } from "next";
import { CipherFlowVisualization } from "@/components/visualizations/cipherflow_visualization";

export const metadata: Metadata = {
  title: "CipherFlow AES visualization",
  description:
    "Interactive AES-128 visualization with block playback, round-state inspection, and byte-level bit overlays.",
};

export default function CipherFlowVisualizationPage() {
  return <CipherFlowVisualization />;
}
