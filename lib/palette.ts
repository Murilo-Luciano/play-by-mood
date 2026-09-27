/**
 * Neon Arcade palette. Shared by `tailwind.config.ts` (as `neon-*` / `crt-*`
 * classes) and by components that need raw colors in inline styles.
 */
export const palette = {
  neon: {
    magenta: "#ff3df2",
    cyan: "#3df8ff",
    yellow: "#ffe53d",
  },
  crt: {
    bg: "#07060d",
    sunken: "#0b0915",
    panel: "#100c1d",
    chip: "#141024",
    bezel: "#15112a",
    track: "#1c1631",
    line: "#2a2440",
    "line-strong": "#3a3260",
    dim: "#4b4470",
    subtle: "#6c6394",
    muted: "#7d74a8",
    soft: "#9d95c9",
    body: "#cfc8f2",
    text: "#e9e4ff",
  },
} as const;
