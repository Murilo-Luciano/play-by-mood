import Link from "next/link";

export default function Wordmark({ small = false }: { small?: boolean }) {
  const size = small ? "text-sm md:text-base" : "text-2xl md:text-5xl";

  return (
    <Link
      href="/"
      aria-label="PlayByMood home"
      className={`font-pixel inline-flex items-center gap-2 select-none ${size}`}
    >
      <span className="neon-magenta">PLAY</span>
      <span className="neon-yellow">·</span>
      <span className="neon-cyan">BY</span>
      <span className="neon-yellow">·</span>
      <span className="neon-magenta">MOOD</span>
    </Link>
  );
}
