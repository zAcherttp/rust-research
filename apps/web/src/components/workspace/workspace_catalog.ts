import type { Route } from "next";

export interface WorkspaceCatalogItem {
  id: string;
  title: string;
  href: Route;
  category: string;
  format: string;
  description: string;
  status: "Live" | "Draft";
  updatedAt: string;
  duration: string;
  sizeLabel: string;
  accentClassName: string;
  accentSoftClassName: string;
  previewClassName: string;
}

export const workspaceCatalog: WorkspaceCatalogItem[] = [
  {
    id: "grid-based-2d-character-movement-controller-visualization",
    title: "Grid based 2d character movement controller visualization",
    href: "/visualizations/grid-based-2d-character-movement-controller",
    category: "Input Systems",
    format: "Interactive visualization",
    description:
      "A server-driven movement queue demo showing tap input, hold stacking, and the overridable third slot.",
    status: "Live",
    updatedAt: "Apr 2, 2026",
    duration: "Open ended",
    sizeLabel: "Queue + grid",
    accentClassName: "text-sky-500",
    accentSoftClassName: "bg-sky-500/10 text-sky-500",
    previewClassName:
      "from-sky-500/18 via-zinc-950 to-cyan-400/10 text-sky-100",
  },
  {
    id: "rust-language",
    title: "Rust Language Research",
    href: "/presentation",
    category: "Programming Languages",
    format: "Interactive deck",
    description:
      "A cinematic walkthrough of Rust's ownership model, language DNA, and concurrency story.",
    status: "Live",
    updatedAt: "Apr 2, 2026",
    duration: "12 min",
    sizeLabel: "14 slides",
    accentClassName: "text-orange-500",
    accentSoftClassName: "bg-orange-500/10 text-orange-500",
    previewClassName:
      "from-orange-500/18 via-zinc-950 to-amber-500/10 text-orange-100",
  },
];
