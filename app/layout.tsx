import { palette } from "@/lib/palette";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import Head from "next/head";
import "./globals.css";

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});
const terminal = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-terminal",
});

export const metadata: Metadata = {
  title: "PlayByMood",
  description: "Insert mood to continue. Find a top-rated game for how you feel.",
  openGraph: {
    title: "PlayByMood",
    description: "Insert mood to continue. Find a top-rated game for how you feel.",
  },
};

export const viewport: Viewport = {
  themeColor: palette.crt.bg,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pixel.variable} ${terminal.variable}`}>
      <body>
        <Analytics />
        <Head>
          <meta property="og:image" content="/logo.jpg" />
        </Head>
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
