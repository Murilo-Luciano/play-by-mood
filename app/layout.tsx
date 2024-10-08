import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlayByMood",
  description: "Find good games based on your mood!",
  openGraph: {
    title: "PlayByMood",
    description: "Find good games based on your mood!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Analytics />
        <Head>
          <meta property="og:image" content="/logo.jpg" />
        </Head>
        <div className="text-center pt-4">
          <a
            className="text-xl md:text-2xl font-extrabold tracking-tight mb-5"
            href="/"
          >
            PlayByMood
          </a>
        </div>
        {children}
      </body>
    </html>
  );
}
