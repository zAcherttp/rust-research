"use client";

import { GeistMono } from "geist/font/mono";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { BundledLanguage, ThemedToken, ThemeRegistrationAny } from "shiki";

// Define our custom theme matching the presentation colors.
// Pink for keywords, Blue for numbers/constants, Orange for mutability,
// Zinc for comments, Green for success, etc.
const presentationThemeDark = {
  name: "presentation-theme-dark",
  type: "dark" as const,
  fg: "#ffffff", // text-white
  bg: "transparent",
  colors: {},
  tokenColors: [
    {
      scope: [
        "keyword",
        "keyword.control",
        "keyword.declaration.rust",
        "storage.type",
        "storage.modifier",
      ],
      settings: { fontStyle: "", foreground: "#f472b6" }, // text-pink-400
    },
    {
      scope: ["storage.modifier.mut.rust"],
      settings: { fontStyle: "", foreground: "#f97316" }, // text-orange-500
    },
    {
      scope: ["constant.numeric"],
      settings: { fontStyle: "", foreground: "#60a5fa" }, // text-blue-400
    },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { fontStyle: "italic", foreground: "#71717a" }, // text-zinc-500
    },
    {
      scope: ["string"],
      settings: { fontStyle: "", foreground: "#4ade80" }, // text-green-400
    },
    {
      scope: ["variable", "entity.name.variable"],
      settings: { fontStyle: "", foreground: "#e4e4e7" }, // text-zinc-200
    },
    {
      scope: ["entity.name.function"],
      settings: { fontStyle: "", foreground: "#fcd34d" }, // text-amber-300
    },
  ],
} satisfies ThemeRegistrationAny;

const presentationThemeLight = {
  name: "presentation-theme-light",
  type: "light" as const,
  fg: "#09090b", // text-zinc-950
  bg: "transparent",
  colors: {},
  tokenColors: [
    {
      scope: [
        "keyword",
        "keyword.control",
        "keyword.declaration.rust",
        "storage.type",
        "storage.modifier",
      ],
      settings: { fontStyle: "", foreground: "#db2777" }, // text-pink-600
    },
    {
      scope: ["storage.modifier.mut.rust"],
      settings: { fontStyle: "", foreground: "#ea580c" }, // text-orange-600
    },
    {
      scope: ["constant.numeric"],
      settings: { fontStyle: "", foreground: "#2563eb" }, // text-blue-600
    },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { fontStyle: "italic", foreground: "#52525b" }, // text-zinc-600
    },
    {
      scope: ["string"],
      settings: { fontStyle: "", foreground: "#16a34a" }, // text-green-600
    },
    {
      scope: ["variable", "entity.name.variable"],
      settings: { fontStyle: "", foreground: "#18181b" }, // text-zinc-900
    },
    {
      scope: ["entity.name.function"],
      settings: { fontStyle: "", foreground: "#d97706" }, // text-amber-600
    },
  ],
} satisfies ThemeRegistrationAny;

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  highlightedLines?: number[];
  themeConfig?: "normal" | "error" | "success";
  delay?: number;
}

export function CodeBlock({
  code,
  language = "rust",
  filename,
  highlightedLines = [],
  themeConfig = "normal",
  delay = 0,
}: CodeBlockProps) {
  const [tokens, setTokens] = useState<ThemedToken[][]>([]);
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  useEffect(() => {
    async function parseCode() {
      try {
        // We highlight to 'html' theoretically, but shiki's codeToTokens
        // is better for raw React mapping. Using codeToHtml is tricky to animate.
        // Since we need React Elements, we import the lightweight function:
        const { getSingletonHighlighter } = await import("shiki");

        const highlighter = await getSingletonHighlighter({
          themes: [presentationThemeDark, presentationThemeLight],
          langs: [language],
        });

        const selectedTheme = isLight
          ? presentationThemeLight
          : presentationThemeDark;

        const tokensResult = highlighter.codeToTokensBase(code, {
          lang: language as BundledLanguage,
          theme: selectedTheme,
        });

        setTokens(tokensResult);
      } catch (err) {
        console.error("Failed to tokenize code", err);
      }
    }

    parseCode();
  }, [code, language, isLight]);

  // Base monotone frame styles
  const wrapperStyles = isLight
    ? "border border-zinc-200 bg-white"
    : "border border-zinc-800 bg-zinc-950/20";
  const headerStyles = isLight
    ? "border-b border-zinc-200 bg-zinc-50 px-4 py-2"
    : "border-b border-white/10 bg-zinc-900/50 px-4 py-2";

  // Determine state tag (if any)
  let tag = null;
  if (themeConfig === "error") {
    tag = (
      <span
        className={`ml-auto rounded-md px-2 py-0.5 font-bold text-[0.65rem] uppercase tracking-wider ${isLight ? "bg-red-100 text-red-600" : "bg-red-500/20 text-red-400"}`}
      >
        Error
      </span>
    );
  } else if (themeConfig === "success") {
    tag = (
      <span
        className={`ml-auto rounded-md px-2 py-0.5 font-bold text-[0.65rem] uppercase tracking-wider ${isLight ? "bg-emerald-100 text-emerald-600" : "bg-emerald-500/20 text-emerald-400"}`}
      >
        Success
      </span>
    );
  } else if (themeConfig === "normal" && code.includes("mut")) {
    tag = (
      <span
        className={`ml-auto rounded-md px-2 py-0.5 font-bold text-[0.65rem] uppercase tracking-wider ${isLight ? "bg-orange-100 text-orange-600" : "bg-orange-500/20 text-orange-400"}`}
      >
        Mutable
      </span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`overflow-hidden rounded-xl ${wrapperStyles} ${GeistMono.className} text-sm`}
    >
      {filename && (
        <div className={`flex items-center ${headerStyles}`}>
          <span
            className={
              isLight ? "text-xs text-zinc-500" : "text-xs text-zinc-400"
            }
          >
            {filename}
          </span>
          {tag}
        </div>
      )}

      <div className="py-4">
        {tokens.length === 0 ? (
          <pre className="px-4 text-zinc-500">Loading code...</pre>
        ) : (
          <pre
            className="m-0 bg-transparent p-0"
            style={{ fontFamily: "inherit" }}
          >
            <code className="grid" style={{ fontFamily: "inherit" }}>
              {tokens.map((line, lineIndex) => {
                const hasHighlights = highlightedLines.length > 0;
                const isHighlighted =
                  hasHighlights && highlightedLines.includes(lineIndex + 1);

                // Determine line background and border
                let lineClass =
                  "flex w-full px-4 border-l-2 transition-colors duration-300";
                if (hasHighlights) {
                  if (isHighlighted) {
                    lineClass += isLight
                      ? " bg-blue-50 border-blue-500"
                      : " bg-blue-500/10 border-blue-500";
                  } else {
                    lineClass += " border-transparent";
                  }
                } else {
                  lineClass += " border-transparent";
                }

                return (
                  <motion.div
                    key={`line-${lineIndex}`}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: lineIndex * 0.05 }}
                    className={lineClass}
                  >
                    {/* Line Number */}
                    <span className="mr-4 w-4 shrink-0 select-none text-right opacity-40">
                      {lineIndex + 1}
                    </span>

                    {/* Line Content */}
                    <span className="flex-1">
                      {line.length === 0
                        ? "\n"
                        : line.map((token, tokenIndex) => (
                            <span
                              key={`token-${lineIndex}-${tokenIndex}`}
                              style={{ color: token.color }}
                            >
                              {token.content}
                            </span>
                          ))}
                    </span>
                  </motion.div>
                );
              })}
            </code>
          </pre>
        )}
      </div>
    </motion.div>
  );
}
