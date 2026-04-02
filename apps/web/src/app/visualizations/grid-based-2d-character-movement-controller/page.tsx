import type { Metadata } from "next";
import { GridMovementControllerVisualization } from "@/components/visualizations/grid_movement_controller_visualization";

export const metadata: Metadata = {
  title: "Grid based 2d character movement controller visualization",
  description:
    "A visualization of queued grid movement, hold stacking, and delayed server consumption.",
};

export default function GridMovementControllerVisualizationPage() {
  return <GridMovementControllerVisualization />;
}
