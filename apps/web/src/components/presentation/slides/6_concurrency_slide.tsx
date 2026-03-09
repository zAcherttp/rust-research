import {
	AlertTriangle,
	CheckCircle2,
	Server,
	SplitSquareHorizontal,
} from "lucide-react";
import { motion } from "motion/react";
import { Slide, SlideContent, SlideSubtitle, SlideTitle } from "../slide";

export function ConcurrencySlide() {
	return (
		<Slide>
			<SlideTitle>Fearless Concurrency</SlideTitle>
			<SlideSubtitle>Scaling without the headaches</SlideSubtitle>
			<SlideContent>
				<div className="mx-auto mb-12 max-w-3xl text-center text-muted-foreground text-xl">
					Rust's ownership type system doesn't just prevent memory bugs—it
					entirely eliminates data races at compile time.
				</div>

				<div className="grid gap-8 md:grid-cols-2">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="relative overflow-hidden rounded-2xl border bg-red-500/5 p-8"
					>
						<div className="mb-6 flex items-center gap-3 border-red-500/20 border-b pb-4">
							<AlertTriangle className="h-6 w-6 text-red-500" />
							<h3 className="font-bold text-red-500 text-xl">
								Other Languages
							</h3>
						</div>
						<ul className="space-y-4 text-muted-foreground">
							<li className="flex gap-3">
								<SplitSquareHorizontal className="h-5 w-5 shrink-0 text-red-400" />
								<span>
									Data races are discovered at runtime (often in production).
								</span>
							</li>
							<li className="flex gap-3">
								<Server className="h-5 w-5 shrink-0 text-red-400" />
								<span>
									Race conditions are notoriously difficult to reproduce and
									debug.
								</span>
							</li>
						</ul>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="relative overflow-hidden rounded-2xl border border-orange-500/30 bg-orange-500/5 p-8 shadow-[0_0_30px_-5px_hsl(var(--orange-500)/0.2)]"
					>
						<div className="mb-6 flex items-center gap-3 border-orange-500/20 border-b pb-4">
							<CheckCircle2 className="h-6 w-6 text-orange-500" />
							<h3 className="font-bold text-orange-500 text-xl">
								The Rust Way
							</h3>
						</div>
						<ul className="space-y-4 text-muted-foreground">
							<li className="flex gap-3">
								<SplitSquareHorizontal className="h-5 w-5 shrink-0 text-orange-400" />
								<span>
									The compiler enforces thread-safety rules via the{" "}
									<code className="text-orange-300">Send</code> and{" "}
									<code className="text-orange-300">Sync</code> traits.
								</span>
							</li>
							<li className="flex gap-3">
								<Server className="h-5 w-5 shrink-0 text-orange-400" />
								<span>
									If it compiles, it is guaranteed to be free of data races.
									Refactoring concurrent code is purely mechanical.
								</span>
							</li>
						</ul>
					</motion.div>
				</div>
			</SlideContent>
		</Slide>
	);
}
