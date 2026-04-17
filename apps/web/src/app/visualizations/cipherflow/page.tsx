import type { Metadata } from "next";
import { CipherFlowVisualization } from "@/components/visualizations/cipherflow_visualization";

export const metadata: Metadata = {
  title: "CipherFlow cryptography visualization",
  description:
    "Interactive DES, AES, and RSA cryptography visualizer with step playback and educational overlays.",
};

export default function CipherFlowVisualizationPage() {
  return <CipherFlowVisualization />;
}
