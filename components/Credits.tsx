export default function Credits({ rawg = false }: { rawg?: boolean }) {
  return (
    <footer className="font-pixel mt-16 pb-10 flex flex-col items-center gap-3 text-[9px] md:text-[10px] leading-relaxed text-crt-muted text-center">
      {rawg && (
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
      )}
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
