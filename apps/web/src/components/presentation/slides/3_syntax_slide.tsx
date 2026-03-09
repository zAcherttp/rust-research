import { motion } from "motion/react";
import { GeistMono } from 'geist/font/mono';
import { Slide, SlideContent, SlideSubtitle, SlideTitle } from "../slide";

export function SyntaxSlide() {
	return (
		<Slide>
			<SlideTitle>Variables & Mutability</SlideTitle>
			<SlideSubtitle>Immutability by Default</SlideSubtitle>
			<SlideContent>
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
					<div className="space-y-6">
						<p className="text-lg leading-relaxed">
							In Rust, variables are{" "}
							<strong className="text-orange-500">immutable</strong> by default.
							Once a value is bound to a name, you can't change that value.
						</p>
						<p className="text-lg text-muted-foreground leading-relaxed">
							This pushes you to write code that's easier to reason about and
							naturally safer for concurrent execution.
						</p>
					</div>

					<div className="space-y-8">
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.6 }}
							className={`overflow-hidden rounded-xl border bg-zinc-950 ${GeistMono.className} text-sm shadow-xl`}
						>
							<div className="flex border-white/10 border-b bg-zinc-900/50 px-4 py-2">
								<span className="text-xs text-zinc-400">immutable.rs</span>
							</div>
							<div className="p-4 text-zinc-300">
								<span className="text-pink-500">let</span> x ={" "}
								<span className="text-blue-400">5</span>;
								<br />
								<span className="text-zinc-500">
									// ERROR: cannot assign twice to immutable variable
								</span>
								<br />
								<del className="text-red-400/80">x = 6;</del>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.8 }}
							className={`overflow-hidden rounded-xl border border-orange-500/30 bg-zinc-950 ${GeistMono.className} text-sm shadow-xl`}
						>
							<div className="flex border-white/10 border-b bg-orange-500/10 px-4 py-2">
								<span className="text-orange-200 text-xs">mutable.rs</span>
							</div>
							<div className="p-4 text-zinc-300">
								<span className="text-pink-500">let mut</span> y ={" "}
								<span className="text-blue-400">5</span>;
								<br />
								<span className="text-zinc-500">
									// This works perfectly fine
								</span>
								<br />
								<span className="text-green-400">y = 6;</span>
							</div>
						</motion.div>
					</div>
				</div>
			</SlideContent>
		</Slide>
	);
}
