import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import "@rust-research/ui/globals.css";
import Script from "next/script";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "rust-research",
  description: "rust-research",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className={`${GeistSans.className} antialiased`}>
        <Providers>
          <div className="grid min-h-svh grid-rows-[auto_1fr]">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
