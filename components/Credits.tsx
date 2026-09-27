export default function Credits() {
  return (
    <footer className="font-pixel mx-auto max-w-6xl px-4 md:px-8 mt-16 pb-10 flex flex-col items-center gap-3 text-[9px] md:text-[10px] leading-relaxed text-crt-muted text-center">
      <p>
        GAME DATA ©{" "}
        <a
          href="https://rawg.io/"
          target="_blank"
          className="text-neon-cyan hover:underline"
        >
          RAWG.IO
        </a>
      </p>
      <p>
        CODED BY{" "}
        <a
          href="https://github.com/Murilo-Luciano"
          target="_blank"
          className="text-neon-magenta hover:underline"
        >
          @MURILO
        </a>{" "}
        · INSPIRED BY{" "}
        <a
          href="https://mood2movie.com/"
          target="_blank"
          className="text-neon-magenta hover:underline"
        >
          MOOD2MOVIE
        </a>
      </p>
      <p className="text-crt-dim">
        © {new Date().getFullYear()} PLAY·BY·MOOD · ALL CREDITS REMAINING: ∞
      </p>
    </footer>
  );
}
