import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export default function HomeComponent() {
	return (
		<div className="flex h-full min-h-[80vh] flex-col items-center justify-center p-4 text-center">
			<div className="relative mb-8 p-4">
				<div className="absolute inset-0 animate-pulse rounded-full bg-orange-500/20 blur-3xl" />
				<h1 className="relative bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text font-black text-6xl text-transparent tracking-tighter sm:text-8xl">
					RUST
				</h1>
			</div>

			<p className="mx-auto mb-12 max-w-[600px] text-muted-foreground text-xl sm:text-2xl">
				An interactive exploration of the Rust programming paradigm, memory
				safety, and fearless concurrency.
			</p>

			<div className="flex flex-col gap-4 sm:flex-row">
				<Link
					href="/presentation"
					className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-orange-600 px-8 font-semibold text-white transition-all hover:bg-orange-500 hover:ring-4 hover:ring-orange-500/30"
				>
					<span className="relative flex items-center gap-2">
						<Play className="h-5 w-5 fill-current" />
						Start Presentation
						<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
					</span>
				</Link>
			</div>

			<p className="mt-16 text-muted-foreground/50 text-sm">
				Use <kbd className="rounded bg-muted px-2 py-1 font-mono">Space</kbd> or
				arrow keys to navigate
			</p>
		</div>
	);
}
