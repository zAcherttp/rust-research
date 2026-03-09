import { BookDashed, Handshake, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { Slide, SlideContent, SlideSubtitle, SlideTitle } from "../slide";

export function BorrowingSlide() {
	return (
		<Slide>
			<SlideTitle>References & Borrowing</SlideTitle>
			<SlideSubtitle>Accessing data without taking ownership</SlideSubtitle>
			<SlideContent>
				<div className="grid gap-12 lg:grid-cols-2">
					<div className="space-y-6">
						<div className="flex items-start gap-4">
							<div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-500">
								<BookDashed className="h-5 w-5" />
							</div>
							<div>
								<h3 className="mb-2 font-bold text-xl">
									Immutable Borrowing (&)
								</h3>
								<p className="text-muted-foreground">
									You can have{" "}
									<strong className="text-blue-400">any number</strong> of
									immutable references to a value. They can read the data, but
									cannot change it.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/20 text-orange-500">
								<Handshake className="h-5 w-5" />
							</div>
							<div>
								<h3 className="mb-2 font-bold text-xl">
									Mutable Borrowing (&mut)
								</h3>
								<p className="text-muted-foreground">
									You can have{" "}
									<strong className="text-orange-400">exactly one</strong>{" "}
									mutable reference to a particular piece of data in a
									particular scope.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/20 text-red-500">
								<ShieldAlert className="h-5 w-5" />
							</div>
							<div>
								<h3 className="mb-2 font-bold text-xl">The Golden Rule</h3>
								<p className="text-muted-foreground">
									You cannot have a mutable reference while you have an
									immutable one. Data races are prevented at compile time!
								</p>
							</div>
						</div>
					</div>

					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.3 }}
						className="flex flex-col justify-center rounded-xl border bg-zinc-950 p-6 font-mono text-sm shadow-xl"
					>
						<div className="mb-4 flex items-center gap-2 border-white/10 border-b pb-4">
							<div className="h-3 w-3 rounded-full bg-red-500" />
							<div className="h-3 w-3 rounded-full bg-yellow-500" />
							<div className="h-3 w-3 rounded-full bg-green-500" />
							<span className="ml-2 text-xs text-zinc-500">
								borrow_checker.rs
							</span>
						</div>
						<div className="space-y-2 text-zinc-300">
							<p>
								<span className="text-pink-500">let mut</span> s = String::from(
								<span className="text-green-400">"hello"</span>);
							</p>
							<br />
							<p>
								<span className="text-pink-500">let</span> r1 = &s;{" "}
								<span className="text-zinc-500">// no problem</span>
							</p>
							<p>
								<span className="text-pink-500">let</span> r2 = &s;{" "}
								<span className="text-zinc-500">// no problem</span>
							</p>
							<p className="font-bold text-red-400">
								<span className="text-pink-500">let</span> r3 = &mut s;{" "}
								<span className="text-zinc-500">// BIG PROBLEM</span>
							</p>
							<br />
							<div className="border-red-500/50 border-l-2 bg-red-500/10 p-3 text-red-300">
								<span className="font-bold text-red-400">error[E0502]:</span>{" "}
								cannot borrow `s` as mutable because it is also borrowed as
								immutable
							</div>
						</div>
					</motion.div>
				</div>
			</SlideContent>
		</Slide>
	);
}
