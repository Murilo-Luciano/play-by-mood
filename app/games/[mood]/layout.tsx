import JsonLd from "@/components/JsonLd";
import { MOOD_KEYS, MOODS, isMood } from "@/lib/moods";
import { OPEN_GRAPH_BASE, SITE_NAME, SITE_URL, TWITTER_BASE } from "@/lib/site";
import { MINIMAL_METACRITIC_RATING } from "@/services/gameService";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

type Props = { params: { mood: string } };

export function generateMetadata({ params }: Props): Metadata {
  if (!isMood(params.mood)) return {};

  const mood = MOODS[params.mood];
  const title = `${mood.label} games to play`;
  const description = `Feeling ${mood.label.toLowerCase()}? ${mood.intro} Get one top-rated pick (Metacritic ${MINIMAL_METACRITIC_RATING}+) for PC, PlayStation, Xbox, mobile and more.`;
  // Platform filters only narrow the same suggestions, so every
  // `?platforms=` variant points at the bare mood URL.
  const url = `/games/${params.mood}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...OPEN_GRAPH_BASE,
      title: `${title} · ${SITE_NAME}`,
      description,
      url,
    },
    twitter: { ...TWITTER_BASE, title: `${title} · ${SITE_NAME}`, description },
  };
}

/**
 * Server-rendered mood copy under the (client-side, random) suggestion, so the
 * page has indexable text and links to the other moods.
 */
export default function MoodLayout({
  children,
  params,
}: Props & { children: React.ReactNode }) {
  if (!isMood(params.mood)) {
    const upper = params.mood.toUpperCase();
    if (isMood(upper)) permanentRedirect(`/games/${upper}`);
    notFound();
  }

  const mood = MOODS[params.mood];

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: `${mood.label} games`,
        item: `${SITE_URL}/games/${params.mood}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      {children}

      <section
        aria-labelledby="about-mood"
        className="relative mx-auto max-w-6xl px-4 md:px-8 mt-16"
      >
        <div className="bg-crt-sunken p-5 md:p-6 shadow-[inset_0_0_0_2px_theme(colors.crt.line)]">
          <h1
            id="about-mood"
            className="font-pixel text-[11px] md:text-xs text-neon-magenta"
          >
            ABOUT {mood.label.toUpperCase()} GAMES
          </h1>
          <p className="mt-3 text-xl md:text-[22px] leading-7 text-crt-body max-w-3xl">
            {mood.description} {mood.intro} Every suggestion has a Metacritic
            score of {MINIMAL_METACRITIC_RATING} or higher and comes from the
            RAWG video game database.
          </p>
        </div>

        <h2 className="font-pixel mt-10 mb-4 text-[10px] md:text-xs text-crt-muted">
          TRY ANOTHER MOOD
        </h2>
        <ul className="flex flex-wrap gap-2 md:gap-3">
          {MOOD_KEYS.filter((key) => key !== params.mood).map((key) => (
            <li key={key}>
              <Link
                href={`/games/${key}`}
                className="font-pixel flex items-center gap-2 text-[9px] md:text-[10px] text-crt-text bg-crt-panel px-3 py-2 shadow-[inset_0_0_0_2px_theme(colors.crt.line)] hover:text-neon-cyan hover:shadow-[inset_0_0_0_2px_theme(colors.neon.cyan)]"
              >
                <Image src={MOODS[key].image} alt="" width={20} height={20} />
                {MOODS[key].label.toUpperCase()} GAMES
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
