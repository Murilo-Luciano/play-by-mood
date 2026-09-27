"use client";

import Credits from "@/components/Credits";
import Wordmark from "@/components/Wordmark";
import { MOODS, homeHref } from "@/lib/moods";
import { palette } from "@/lib/palette";
import { useSuggestion } from "@/lib/useSuggestion";
import { Mood } from "@/services/types";
import DOMPurify from "dompurify";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

const SCORE_SEGMENTS = 20;
const TAG_COLORS = [palette.neon.cyan, palette.neon.magenta, palette.neon.yellow];

function Result({ moodParam }: { moodParam: string }) {
  const { game, error, isLoading, isValidating, platforms, next } =
    useSuggestion(moodParam);
  const [screenshotIndex, setScreenshotIndex] = useState(0);
  const [readMore, setReadMore] = useState(false);

  const mood = MOODS[moodParam as Mood] ?? MOODS[Mood.PLAYFUL];
  const backHref = homeHref(platforms);

  useEffect(() => {
    setScreenshotIndex(0);
    setReadMore(false);
  }, [game?.id]);

  const hud = (
    <div className="border-b-2 border-crt-line bg-crt-bg/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 md:px-8 h-14 flex items-center justify-between gap-4">
        <Wordmark small />
        <div className="font-pixel hidden md:flex items-center gap-3 text-[10px]">
          <span className="text-neon-cyan">PLAYER 1</span>
          <span className="text-crt-dim">·</span>
          <span className="text-crt-muted">MOOD:</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mood.image} alt="" className="w-5 h-5" />
          <span className="text-neon-yellow">{mood.label.toUpperCase()}</span>
        </div>
        <Link
          href={backHref}
          className="font-pixel text-[9px] md:text-[10px] text-neon-magenta"
        >
          ◀ CHANGE MOOD
        </Link>
      </div>
    </div>
  );

  if (isLoading || (isValidating && !game)) {
    return (
      <>
        {hud}
        <div className="min-h-[70vh] grid place-items-center px-4 text-center">
          <div>
            <p className="font-pixel text-sm md:text-lg neon-cyan blink">
              LOADING…
            </p>
            <div className="mt-6 w-64 h-4 mx-auto border-2 border-neon-cyan p-0.5">
              <div className="h-full bg-neon-cyan animate-pulse w-2/3" />
            </div>
            <p className="font-pixel mt-6 text-[10px] text-crt-muted">
              FINDING A {mood.label.toUpperCase()} GAME
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!game || error) {
    return (
      <>
        {hud}
        <div className="min-h-[70vh] grid place-items-center px-4 text-center">
          <div>
            <p className="font-pixel text-2xl md:text-5xl neon-magenta">
              GAME OVER
            </p>
            <p className="mt-6 text-2xl text-crt-soft">
              {error
                ? "Something went wrong fetching your game."
                : "No game found for these platforms. Try loading more cartridges."}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              {error && (
                <button
                  onClick={next}
                  className="font-pixel text-[10px] bg-neon-yellow text-crt-bg px-5 py-3"
                >
                  ▶ CONTINUE?
                </button>
              )}
              <Link
                href={backHref}
                className="font-pixel text-[10px] border-2 border-neon-magenta text-neon-magenta px-5 py-3"
              >
                ◀ CHANGE MOOD
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const screenshots = game.screenshots?.length
    ? game.screenshots
    : [{ id: 0, image: game.imageUrl }];
  const screenshot =
    screenshots[Math.min(screenshotIndex, screenshots.length - 1)];
  const score = game.metacriticRating ?? 0;
  const filledSegments = Math.round((score / 100) * SCORE_SEGMENTS);

  return (
    <>
      {hud}
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-[520px] overflow-hidden pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={game.imageUrl}
            alt=""
            className="w-full h-full object-cover opacity-25 blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-crt-bg/40 via-crt-bg/70 to-crt-bg" />
        </div>

        <main className="relative mx-auto max-w-6xl px-4 md:px-8 pt-8 md:pt-12">
          <div className="font-pixel md:hidden flex items-center gap-2 text-[9px] mb-4">
            <span className="text-neon-cyan">P1</span>
            <span className="text-crt-muted">MOOD:</span>
            <span className="text-neon-yellow">{mood.label.toUpperCase()}</span>
          </div>
          <p className="font-pixel text-[10px] md:text-xs text-neon-magenta mb-3">
            <span className="blink">●</span> NOW PLAYING
          </p>
          <h1 className="font-pixel text-2xl md:text-5xl leading-tight neon-yellow break-words">
            {game.name.toUpperCase()}
          </h1>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 md:gap-8">
            <div>
              <div className="rounded-[28px] bg-gradient-to-b from-crt-line to-crt-bezel p-3 md:p-5 shadow-[0_0_0_2px_theme(colors.crt.line-strong),0_20px_60px_rgba(0,0,0,.6)]">
                <div className="relative rounded-[20px] overflow-hidden bg-black aspect-video shadow-[inset_0_0_60px_rgba(0,0,0,.9)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={screenshot.image}
                    alt={`${game.name} screenshot`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(to_bottom,rgba(0,0,0,.28)_0_2px,transparent_2px_4px),radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,.6))]" />
                  <span className="font-pixel absolute top-3 left-3 text-[9px] text-neon-cyan bg-black/60 px-2 py-1">
                    CH {String(screenshotIndex + 1).padStart(2, "0")}/
                    {String(screenshots.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 px-1">
                  <span className="font-pixel text-[8px] text-crt-subtle">
                    MOOD-TRON 2600
                  </span>
                  <span className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-neon-magenta shadow-[0_0_8px_theme(colors.neon.magenta)]" />
                    <span className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_8px_theme(colors.neon.cyan)]" />
                  </span>
                </div>
              </div>
              <div className="mt-4 flex gap-2 md:gap-3 overflow-x-auto pb-2">
                {screenshots.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setScreenshotIndex(i)}
                    aria-label={`Show screenshot ${i + 1}`}
                    className={`shrink-0 w-24 md:w-32 aspect-video overflow-hidden transition-all ${
                      i === screenshotIndex
                        ? "shadow-[0_0_0_2px_theme(colors.neon.cyan),0_0_14px_rgba(61,248,255,.6)]"
                        : "opacity-50 hover:opacity-100 shadow-[0_0_0_2px_theme(colors.crt.line)]"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <aside className="flex flex-col gap-4">
              <div className="bg-crt-panel p-5 shadow-[inset_0_0_0_2px_theme(colors.crt.line)]">
                <p className="font-pixel text-[10px] text-neon-magenta">HI-SCORE</p>
                <p className="font-pixel text-4xl md:text-5xl neon-cyan mt-3">
                  {score}
                </p>
                <p className="text-lg text-crt-muted -mt-0.5">METACRITIC</p>
                <div className="mt-3 flex gap-[3px]" aria-hidden>
                  {Array.from({ length: SCORE_SEGMENTS }).map((_, i) => (
                    <span
                      key={i}
                      className="h-4 flex-1"
                      style={{
                        background:
                          i >= filledSegments
                            ? palette.crt.track
                            : i < 10
                            ? palette.neon.cyan
                            : i < 16
                            ? palette.neon.yellow
                            : palette.neon.magenta,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="bg-crt-panel p-5 shadow-[inset_0_0_0_2px_theme(colors.crt.line)] grid grid-cols-2 lg:grid-cols-1 gap-4">
                <div>
                  <p className="font-pixel text-[9px] text-crt-muted">RELEASED</p>
                  <p className="text-2xl text-white mt-1">{game.releasedDate}</p>
                </div>
                <div>
                  <p className="font-pixel text-[9px] text-crt-muted">PLATFORMS</p>
                  <p className="text-xl leading-6 text-white mt-1">
                    {game.platforms.map((p) => p.name).join(" · ")}
                  </p>
                </div>
              </div>
              <button
                onClick={next}
                disabled={isValidating}
                className="font-pixel text-[10px] md:text-xs bg-neon-yellow text-crt-bg py-4 shadow-[0_0_24px_rgba(255,229,61,.45),inset_0_-5px_0_rgba(0,0,0,.25)] hover:-translate-y-0.5 transition-transform disabled:opacity-60"
              >
                {isValidating ? "LOADING…" : "▶ CONTINUE? NEW GAME"}
              </button>
              <Link
                href={backHref}
                className="font-pixel text-center text-[10px] md:text-xs text-neon-magenta py-4 shadow-[inset_0_0_0_2px_theme(colors.neon.magenta)] hover:bg-neon-magenta/10"
              >
                ◀ CHANGE MOOD
              </Link>
            </aside>
          </div>

          <section className="mt-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] items-start gap-6 md:gap-8">
            <div className="bg-crt-sunken p-5 md:p-6 shadow-[inset_0_0_0_2px_theme(colors.crt.line)]">
              <p className="font-pixel text-[10px] text-neon-cyan mb-4">
                &gt; README.TXT
              </p>
              <div
                className={`game-description text-xl md:text-[22px] leading-7 text-crt-body relative ${
                  readMore ? "" : "max-h-52 overflow-hidden"
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(game.description),
                  }}
                />
                {!readMore && (
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-crt-sunken to-transparent" />
                )}
              </div>
              <button
                onClick={() => setReadMore((open) => !open)}
                className="font-pixel mt-4 text-[10px] text-neon-yellow hover:underline"
              >
                {readMore ? "▲ SHOW LESS" : "▼ READ MORE"}
                {!readMore && <span className="blink">_</span>}
              </button>
            </div>
            <div>
              <p className="font-pixel text-[10px] text-crt-muted mb-3">
                POWER-UPS
              </p>
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag, i) => {
                  const color = TAG_COLORS[i % TAG_COLORS.length];

                  return (
                    <span
                      key={tag.id}
                      className="text-lg leading-none px-2.5 py-1.5 bg-crt-chip"
                      style={{ color, boxShadow: `inset 0 0 0 1px ${color}55` }}
                    >
                      {tag.name.toUpperCase()}
                    </span>
                  );
                })}
              </div>
            </div>
          </section>

          <Credits rawg />
        </main>
      </div>
    </>
  );
}

export default function Page({ params }: { params: { mood: string } }) {
  return (
    <Suspense>
      <Result moodParam={params.mood} />
    </Suspense>
  );
}
