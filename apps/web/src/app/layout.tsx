import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import "@rust-research/ui/globals.css";
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
      <body className={`${GeistSans.className} antialiased`}>
        <Providers>
          <div className="grid h-svh grid-rows-[auto_1fr]">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
