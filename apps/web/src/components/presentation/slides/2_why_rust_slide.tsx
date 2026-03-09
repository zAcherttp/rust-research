import { Box, ShieldCheck, Zap } from "lucide-react";
import { motion } from "motion/react";
import { Slide, SlideContent, SlideSubtitle, SlideTitle } from "../slide";

const features = [
	{
		title: "Performant",
		description:
			"Blazingly fast and memory-efficient: no runtime or garbage collector.",
		icon: Zap,
		color: "text-yellow-500",
		bg: "bg-yellow-500/10",
	},
	{
		title: "Reliable",
		description:
			"Rich type system and ownership model guarantee memory-safety and thread-safety.",
		icon: ShieldCheck,
		color: "text-green-500",
		bg: "bg-green-500/10",
	},
	{
		title: "Productive",
		description:
			"Great documentation, a friendly compiler with useful error messages, and top-notch tooling.",
		icon: Box,
		color: "text-blue-500",
		bg: "bg-blue-500/10",
	},
];

export function WhyRustSlide() {
	return (
		<Slide>
			<SlideTitle>Why Rust?</SlideTitle>
			<SlideSubtitle>The trifecta of modern systems programming</SlideSubtitle>
			<SlideContent className="mt-8">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					{features.map((feature, index) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
							whileHover={{ scale: 1.05 }}
							className="group relative flex flex-col items-center rounded-2xl border p-6 text-center shadow-lg transition-colors hover:border-primary/50 dark:bg-card"
						>
							<div className={`mb-4 rounded-xl p-4 ${feature.bg}`}>
								<feature.icon className={`h-8 w-8 ${feature.color}`} />
							</div>
							<h3 className="mb-2 font-bold text-xl">{feature.title}</h3>
							<p className="text-muted-foreground text-sm leading-relaxed">
								{feature.description}
							</p>
						</motion.div>
					))}
				</div>
			</SlideContent>
		</Slide>
	);
}
