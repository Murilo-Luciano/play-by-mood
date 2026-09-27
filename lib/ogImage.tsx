import { palette } from "@/lib/palette";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

const { neon, crt } = palette;

function glow(color: string) {
  return `0 0 8px ${color}, 0 0 28px ${color}`;
}

/**
 * Share card in the Neon Arcade style. With `mood` it shows the mood's emoji
 * and "FEELING <MOOD>?"; without it, the home card with the tagline.
 */
export async function renderOgImage(mood?: {
  label: string;
  image: string;
  intro: string;
}) {
  const [font, emoji] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/PressStart2P-Regular.ttf")),
    mood && readFile(join(process.cwd(), "public", mood.image)),
  ]);

  const wordmark = (size: number) => (
    <div style={{ display: "flex", gap: size * 0.4, fontSize: size }}>
      <span style={{ color: neon.magenta, textShadow: glow(neon.magenta) }}>
        PLAY
      </span>
      <span style={{ color: neon.yellow }}>·</span>
      <span style={{ color: neon.cyan, textShadow: glow(neon.cyan) }}>BY</span>
      <span style={{ color: neon.yellow }}>·</span>
      <span style={{ color: neon.magenta, textShadow: glow(neon.magenta) }}>
        MOOD
      </span>
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          padding: 64,
          fontFamily: "PressStart2P",
          color: crt.text,
          backgroundColor: crt.bg,
          backgroundImage:
            "radial-gradient(ellipse at 50% 0%, rgba(255,0,200,0.28), transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(0,240,255,0.2), transparent 60%)",
          border: `12px solid ${crt.line}`,
        }}
      >
        {mood && emoji ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 36,
            }}
          >
            {wordmark(28)}
            <img
              src={`data:image/png;base64,${emoji.toString("base64")}`}
              width={150}
              height={150}
              alt=""
            />
            <div
              style={{
                // Fits the longest label ("FEELING ADVENTUROUS?") on one line.
                fontSize: 46,
                textAlign: "center",
                color: neon.yellow,
                textShadow: glow(neon.yellow),
              }}
            >
              {`FEELING ${mood.label.toUpperCase()}?`}
            </div>
            <div
              style={{
                fontSize: 22,
                lineHeight: 1.6,
                color: crt.soft,
                textAlign: "center",
                maxWidth: 960,
              }}
            >
              {mood.intro}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 36,
            }}
          >
            <div style={{ display: "flex", fontSize: 20, color: crt.muted }}>
              1UP 00 · HI-SCORE 098 · CREDIT ∞
            </div>
            {wordmark(68)}
            <div
              style={{
                fontSize: 32,
                color: neon.yellow,
                textShadow: glow(neon.yellow),
              }}
            >
              INSERT MOOD TO CONTINUE
            </div>
            <div style={{ fontSize: 24, color: crt.soft }}>
              Find a top-rated game for how you feel
            </div>
          </div>
        )}
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: "PressStart2P", data: font, style: "normal" }],
    }
  );
}
