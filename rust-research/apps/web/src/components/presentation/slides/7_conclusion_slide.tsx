import { ExternalLink, Github } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Slide, SlideContent, SlideTitle } from "../slide";

export function ConclusionSlide() {
  return (
    <Slide className="text-center">
      <SlideTitle className="mb-12 font-extrabold text-5xl tracking-tight lg:text-7xl">
        In Conclusion
      </SlideTitle>
      <SlideContent>
        <p className="mx-auto mb-16 max-w-2xl text-muted-foreground text-xl leading-relaxed">
          Rust represents a paradigm shift in systems programming. It proves
          that you don't have to choose between high-level ergonomics and
          low-level control.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mx-auto max-w-lg overflow-hidden rounded-2xl border bg-card p-8 shadow-2xl"
        >
          <h3 className="mb-6 font-bold text-2xl">References & Reading</h3>
          <div className="flex flex-col gap-4">
            <Link
              href="https://doc.rust-lang.org/book/"
              target="_blank"
              className="group flex items-center justify-between rounded-xl border p-4 transition-colors hover:border-orange-500/50 hover:bg-orange-500/5"
            >
              <div className="flex items-center gap-3">
                <BookIcon className="h-5 w-5 text-orange-500" />
                <span className="font-medium text-foreground">
                  The Rust Programming Language
                </span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-orange-500" />
            </Link>

            <Link
              href="https://doc.rust-lang.org/rust-by-example/"
              target="_blank"
              className="group flex items-center justify-between rounded-xl border p-4 transition-colors hover:border-blue-500/50 hover:bg-blue-500/5"
            >
              <div className="flex items-center gap-3">
                <CodeIcon className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-foreground">
                  Rust by Example
                </span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-blue-500" />
            </Link>

            <Link
              href="https://github.com/rust-lang/rust"
              target="_blank"
              className="group flex items-center justify-between rounded-xl border p-4 transition-colors hover:border-zinc-500/50 hover:bg-zinc-500/5"
            >
              <div className="flex items-center gap-3">
                <Github className="h-5 w-5 text-zinc-400" />
                <span className="font-medium text-foreground">
                  Rust Compiler GitHub
                </span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-zinc-500" />
            </Link>
          </div>
        </motion.div>
      </SlideContent>
    </Slide>
  );
}

function BookIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function CodeIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
