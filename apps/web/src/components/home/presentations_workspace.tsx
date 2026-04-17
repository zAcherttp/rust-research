"use client";

import { cn } from "@rust-research/ui/lib/utils";
import {
  ArrowRight,
  CirclePlay,
  FileStack,
  FolderKanban,
  Layers3,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  type WorkspaceCatalogItem,
  workspaceCatalog,
} from "@/components/workspace/workspace_catalog";

const liveProjects = workspaceCatalog.filter(
  (project) => project.status === "Live",
);

export function PresentationsWorkspace() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:64px_64px] opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.12),transparent_30%)]" />

      <main className="relative flex min-h-svh flex-col px-6 py-6 lg:px-10">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-5 border-border/60 border-b pb-5 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-muted-foreground text-xs uppercase tracking-[0.24em] backdrop-blur">
              <FolderKanban className="h-3.5 w-3.5" />
              Research Workspace
            </div>
            <h1 className="mt-4 max-w-4xl font-black text-4xl tracking-tight sm:text-5xl lg:text-6xl">
              Interactive Projects
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed sm:text-lg">
              A project-style index for decks, simulations, and future
              visualizations. Each entry behaves like a file in a design
              workspace, with its own route, runtime, and visual language.
            </p>
          </div>

          <div className="grid gap-3 text-muted-foreground text-sm sm:grid-cols-3 lg:min-w-[30rem]">
            <WorkspaceMetric
              icon={<FileStack className="h-4 w-4" />}
              label="Available"
              value={`${workspaceCatalog.length} files`}
            />
            <WorkspaceMetric
              icon={<CirclePlay className="h-4 w-4" />}
              label="Runnable"
              value={`${liveProjects.length} live`}
            />
            <WorkspaceMetric
              icon={<Layers3 className="h-4 w-4" />}
              label="Library"
              value="Ready to expand"
            />
          </div>
        </motion.header>

        <section className="grid flex-1 gap-10 pt-8 xl:grid-cols-[minmax(0,1.5fr)_22rem]">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.35 }}
              className="flex flex-col gap-3 border-border/50 border-b pb-4 sm:flex-row sm:items-end sm:justify-between"
            >
              <div>
                <p className="font-medium text-muted-foreground text-sm">
                  Library index
                </p>
                <p className="text-muted-foreground/80 text-sm">
                  Open a project to jump directly into its dedicated runtime.
                </p>
              </div>
              <p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.22em]">
                Sorted by latest
              </p>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-2">
              {workspaceCatalog.map((presentation, index) => (
                <PresentationProjectCard
                  key={presentation.id}
                  presentation={presentation}
                  index={index}
                />
              ))}
            </div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12, duration: 0.35 }}
            className="flex flex-col gap-8 border-border/60 border-l-0 pt-2 xl:border-l xl:pl-8"
          >
            <div>
              <p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.22em]">
                Workspace Notes
              </p>
              <div className="mt-4 space-y-4">
                <SidebarRow
                  label="Active format"
                  value="Presentations, then visual simulations"
                />
                <SidebarRow label="Structure" value="Metadata-driven catalog" />
                <SidebarRow
                  label="Interaction"
                  value="Dedicated routes for each interactive project"
                />
              </div>
            </div>

            <div>
              <p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.22em]">
                Current Focus
              </p>
              <div className="mt-4 rounded-[1.75rem] border border-border/70 bg-background/75 p-5 backdrop-blur">
                <p className="font-semibold text-lg">Rust deck is live</p>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                  The library now supports both decks and visualizations. New
                  entries only need metadata and a route to appear here.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-orange-500 text-xs uppercase tracking-[0.18em]">
                    Research
                  </span>
                  <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-blue-500 text-xs uppercase tracking-[0.18em]">
                    Simulation
                  </span>
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-500 text-xs uppercase tracking-[0.18em]">
                    Expandable
                  </span>
                </div>
              </div>
            </div>
          </motion.aside>
        </section>
      </main>
    </div>
  );
}

function WorkspaceMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs uppercase tracking-[0.18em]">{label}</span>
      </div>
      <p className="mt-2 font-semibold text-foreground">{value}</p>
    </div>
  );
}

function PresentationProjectCard({
  presentation,
  index,
}: {
  presentation: WorkspaceCatalogItem;
  index: number;
}) {
  const isLive = presentation.status === "Live";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + index * 0.08, duration: 0.35 }}
    >
      <Link
        href={presentation.href}
        className="group block rounded-[2rem] border border-border/70 bg-background/70 p-3 backdrop-blur transition-transform duration-300 hover:-translate-y-1"
      >
        <div
          className={cn(
            "relative aspect-[1.35/1] overflow-hidden rounded-[1.5rem] bg-linear-to-br",
            presentation.previewClassName,
          )}
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:38px_38px]" />
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0.45 }}
            animate={{ opacity: 0.8 }}
            transition={{
              duration: 3.8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <div className="absolute -top-10 right-10 h-40 w-40 rounded-full bg-orange-500/18 blur-3xl" />
            <div className="absolute bottom-4 left-6 h-28 w-28 rounded-full bg-amber-300/10 blur-3xl" />
          </motion.div>

          <div className="relative flex h-full flex-col justify-between p-5">
            <div className="flex items-start justify-between">
              <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[0.7rem] text-white/70 uppercase tracking-[0.2em]">
                {presentation.category}
              </div>
              <div
                className={cn(
                  "rounded-full px-3 py-1 font-medium text-[0.7rem] uppercase tracking-[0.18em]",
                  presentation.accentSoftClassName,
                )}
              >
                {presentation.status}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-[0.22em]">
                <span>{presentation.format}</span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span>{presentation.updatedAt}</span>
              </div>

              <div className="rounded-[1.25rem] border border-white/8 bg-black/18 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between border-white/10 border-b pb-3">
                  <div className="space-y-1">
                    <div className="h-2.5 w-24 rounded-full bg-white/80" />
                    <div className="h-2 w-16 rounded-full bg-white/35" />
                  </div>
                  <div className="h-8 w-8 rounded-full bg-orange-400/18" />
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-3">
                    <div className="h-24 rounded-2xl bg-white/8" />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-10 rounded-xl bg-white/10" />
                      <div className="h-10 rounded-xl bg-white/6" />
                      <div className="h-10 rounded-xl bg-white/6" />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-black/20 p-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-orange-400/70" />
                      <span className="h-2 w-2 rounded-full bg-white/25" />
                      <span className="h-2 w-2 rounded-full bg-white/25" />
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="h-2 w-20 rounded-full bg-orange-200/50" />
                      <div className="h-2 w-full rounded-full bg-white/15" />
                      <div className="h-2 w-5/6 rounded-full bg-white/15" />
                      <div className="h-2 w-3/4 rounded-full bg-white/15" />
                      <div className="h-2 w-2/3 rounded-full bg-orange-200/25" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4 px-2 pt-4 pb-2">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-xl tracking-tight">
                {presentation.title}
              </h2>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 font-medium text-[0.7rem] uppercase tracking-[0.18em]",
                  presentation.accentSoftClassName,
                )}
              >
                {presentation.sizeLabel}
              </span>
            </div>
            <p className="mt-2 max-w-xl text-muted-foreground text-sm leading-relaxed">
              {presentation.description}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 pt-1 font-medium text-sm">
            <span className={cn(presentation.accentClassName)}>
              {isLive ? "Open" : "Preview"}
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>

        <div className="mx-2 mt-1 flex items-center justify-between border-border/50 border-t pt-3 text-muted-foreground text-xs uppercase tracking-[0.18em]">
          <span>{presentation.duration}</span>
          <span>{presentation.format}</span>
        </div>
      </Link>
    </motion.div>
  );
}

function SidebarRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border/60 border-b pb-4 last:border-b-0 last:pb-0">
      <p className="text-muted-foreground/70 text-xs uppercase tracking-[0.18em]">
        {label}
      </p>
      <p className="mt-2 text-foreground/88 text-sm leading-relaxed">{value}</p>
    </div>
  );
}
