import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Slide, SlideContent, SlideSubtitle, SlideTitle } from "../slide";

export function OwnershipSlide() {
	const [step, setStep] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setStep((s) => (s + 1) % 3);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	return (
		<Slide>
			<SlideTitle>The Ownership Model</SlideTitle>
			<SlideSubtitle>Rust's unique approach to memory management</SlideSubtitle>
			<SlideContent>
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
					<div className="space-y-4">
						<h3 className="font-semibold text-2xl">The Three Rules</h3>
						<ul className="space-y-4 text-lg text-muted-foreground">
							<li className="flex items-start">
								<span className="mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/20 font-bold text-orange-500 text-sm">
									1
								</span>
								Each value in Rust has an owner.
							</li>
							<li className="flex items-start">
								<span className="mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/20 font-bold text-orange-500 text-sm">
									2
								</span>
								There can only be one owner at a time.
							</li>
							<li className="flex items-start">
								<span className="mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/20 font-bold text-orange-500 text-sm">
									3
								</span>
								When the owner goes out of scope, the value is dropped.
							</li>
						</ul>
					</div>

					<div className="relative flex h-64 flex-col items-center justify-center rounded-2xl border bg-card p-8">
						{/* Code representation */}
						<div className="absolute top-4 left-4 font-mono text-sm text-zinc-500">
							{step === 0 && 'let s1 = String::from("hello");'}
							{step === 1 && "let s2 = s1;"}
							{step === 2 && "// s1 is no longer valid"}
						</div>

						{/* Memory representation */}
						<div className="mt-8 flex w-full items-center justify-around gap-4">
							<div className="flex flex-col items-center gap-2">
								<div
									className={`font-mono text-xl transition-colors ${step === 0 ? "text-primary" : "text-muted-foreground line-through"}`}
								>
									s1
								</div>
								<motion.div
									animate={{
										opacity: step === 0 ? 1 : 0.3,
										scale: step === 0 ? 1 : 0.9,
									}}
									className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-orange-500 bg-orange-500/10"
								>
									ptr
								</motion.div>
							</div>

							<motion.div
								animate={{
									x: step === 0 ? -100 : 100,
									opacity: step === 2 ? 0.5 : 1,
								}}
								transition={{ type: "spring", stiffness: 100, damping: 15 }}
								className="absolute z-10 flex h-20 w-40 flex-col items-center justify-center rounded-xl bg-orange-600 font-mono text-white shadow-xl"
							>
								<span className="text-xs opacity-70">Heap</span>
								"hello"
							</motion.div>

							<div className="flex flex-col items-center gap-2">
								<div
									className={`font-mono text-xl transition-colors ${step >= 1 ? "text-primary" : "text-muted-foreground/30"}`}
								>
									s2
								</div>
								<motion.div
									animate={{
										opacity: step >= 1 ? 1 : 0.1,
										scale: step >= 1 ? 1 : 0.9,
									}}
									className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-orange-500 bg-orange-500/10"
								>
									ptr
								</motion.div>
							</div>
						</div>
					</div>
				</div>
			</SlideContent>
		</Slide>
	);
}
