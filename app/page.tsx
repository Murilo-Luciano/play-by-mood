"use client";

import { MOST_POPULAR_PLATFORMS, Platform } from "@/adapters/types";
import Credits from "@/components/Credits";
import Wordmark from "@/components/Wordmark";
import { MOOD_KEYS, MOODS, parsePlatforms, resultHref } from "@/lib/moods";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const PLATFORM_LABELS: Record<string, string> = {
  [Platform.PC]: "PC",
  [Platform.APPLE_MACINTOSH]: "MAC",
  [Platform.LINUX]: "LINUX",
  [Platform.WEB]: "WEB",
  [Platform.PLAYSTATION]: "PS",
  [Platform.XBOX]: "XBOX",
  [Platform.IOS]: "iOS",
  [Platform.ANDROID]: "DROID",
};

function Home() {
  const searchParams = useSearchParams();
  const [platforms, setPlatforms] = useState(
    parsePlatforms(searchParams.get("platforms"))
  );

  const togglePlatform = (platform: Platform) =>
    setPlatforms((selected) =>
      selected.includes(platform)
        ? selected.filter((p) => p !== platform)
        : [...selected, platform]
    );

  return (
    <main className="mx-auto max-w-6xl px-4 md:px-8">
      <header className="pt-10 md:pt-14 pb-8 text-center">
        <div
          aria-hidden
          className="font-pixel flex justify-between text-[9px] md:text-[11px] mb-8 md:mb-10"
        >
          <span className="text-neon-cyan">
            1UP <span className="text-white">00</span>
          </span>
          <span className="text-neon-magenta">
            HI-SCORE <span className="text-white">098</span>
          </span>
          <span className="text-neon-yellow">
            CREDIT <span className="text-white">∞</span>
          </span>
        </div>
        <Wordmark />
        <p className="font-pixel mt-6 text-[10px] md:text-sm text-neon-yellow blink">
          INSERT MOOD TO CONTINUE
        </p>
      </header>

      <section className="mb-10">
        <h2 className="font-pixel text-[10px] md:text-xs text-crt-muted mb-3 text-center">
          ── LOAD CARTRIDGES ──
        </h2>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {MOST_POPULAR_PLATFORMS.map((platform) => {
            const selected = platforms.includes(platform);

            return (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                aria-pressed={selected}
                aria-label={platform}
                className={`font-pixel text-[9px] md:text-[10px] pt-2.5 pb-2 px-3 md:px-4 transition-all [clip-path:polygon(0_0,88%_0,100%_30%,100%_100%,0_100%)] ${
                  selected
                    ? "bg-neon-cyan text-crt-bg shadow-[0_0_16px_rgba(61,248,255,.6),inset_0_-4px_0_rgba(0,0,0,.25)]"
                    : "bg-crt-chip text-crt-subtle shadow-[inset_0_0_0_2px_theme(colors.crt.line),inset_0_-4px_0_rgba(0,0,0,.4)] hover:text-crt-text"
                }`}
              >
                {selected ? "■ " : "□ "}
                {PLATFORM_LABELS[platform]}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h1 className="font-pixel text-center text-sm md:text-xl neon-cyan mb-6 md:mb-8">
          SELECT YOUR MOOD
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {MOOD_KEYS.map((key, index) => {
            const mood = MOODS[key];

            return (
              <Link
                key={key}
                href={resultHref(key, platforms)}
                className="mood-tile relative bg-crt-panel p-3 md:p-4 flex flex-col items-center text-center"
              >
                <span className="p1-marker font-pixel absolute top-2 left-2 text-[8px] bg-neon-magenta text-crt-bg px-1.5 py-1">
                  P1
                </span>
                <span className="font-pixel absolute top-2 right-2 text-[8px] text-crt-dim">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div
                  className="mt-4 mb-3 grid place-items-center w-16 h-16 md:w-20 md:h-20"
                  style={{
                    background: `radial-gradient(circle, hsla(${mood.hue},100%,60%,.35), transparent 70%)`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mood.image}
                    alt=""
                    className="w-11 h-11 md:w-14 md:h-14"
                  />
                </div>
                <span className="font-pixel text-[10px] md:text-xs text-white tracking-tight">
                  {mood.label.toUpperCase()}
                </span>
                <p className="mt-2 text-lg leading-5 text-crt-soft hidden sm:block">
                  {mood.description}
                </p>
                <div className="mt-3 w-full h-1.5 bg-crt-track">
                  <div
                    className="h-full"
                    style={{
                      width: `${40 + ((index * 37) % 60)}%`,
                      background: `hsl(${mood.hue},100%,60%)`,
                    }}
                  />
                </div>
              </Link>
            );
          })}
          <div className="hidden lg:flex bg-crt-sunken shadow-[inset_0_0_0_2px_theme(colors.crt.line)] p-4 flex-col items-center justify-center text-center">
            <span className="font-pixel text-[10px] text-crt-dim leading-5">
              MORE MOODS
              <br />
              COMING SOON
            </span>
            <span className="font-pixel mt-3 text-2xl text-crt-line">?</span>
          </div>
        </div>
        {platforms.length === 0 && (
          <p className="font-pixel mt-6 text-center text-[10px] text-neon-yellow">
            NO CARTRIDGE LOADED · ALL PLATFORMS
          </p>
        )}
      </section>

      <Credits />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}
