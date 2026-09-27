import Credits from "@/components/Credits";
import { palette } from "@/lib/palette";
import {
  OPEN_GRAPH_BASE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  TWITTER_BASE,
} from "@/lib/site";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
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

// og:image / twitter:image come from the `opengraph-image.tsx` files.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    ...OPEN_GRAPH_BASE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    ...TWITTER_BASE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
        <div className="relative z-10 min-h-screen">
          {children}
          <Credits />
        </div>
      </body>
    </html>
  );
}
