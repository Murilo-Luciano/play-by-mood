import { MOST_POPULAR_PLATFORMS } from "@/adapters/types";
import JsonLd from "@/components/JsonLd";
import MoodPicker from "@/components/MoodPicker";
import Wordmark from "@/components/Wordmark";
import { MOOD_KEYS } from "@/lib/moods";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import {
  MINIMAL_METACRITIC_RATING,
  MINIMAL_RAWG_ADDED_COUNT,
} from "@/services/gameService";

const STEPS = [
  { title: "LOAD CARTRIDGES", text: "Pick the platforms you play on." },
  {
    title: "SELECT YOUR MOOD",
    text: `Choose how you feel from ${MOOD_KEYS.length} moods.`,
  },
  {
    title: "PLAY",
    text: "Get one top-rated game. Not feeling it? Hit CONTINUE for another.",
  },
];

// Shown on the page and mirrored in the FAQPage structured data.
const FAQ = [
  {
    question: "What is PlayByMood?",
    answer:
      "PlayByMood is a free website that recommends a video game based on how you feel. Pick a mood and the platforms you play on, and it suggests one well-reviewed game to play right now.",
  },
  {
    question: "How are the games picked?",
    answer: `Each mood maps to genres and tags on RAWG, the largest open video game database. PlayByMood keeps games with a Metacritic score of ${MINIMAL_METACRITIC_RATING} or higher that at least ${MINIMAL_RAWG_ADDED_COUNT.toLocaleString(
      "en-US"
    )} RAWG players have added to their library, then picks one at random.`,
  },
  {
    question: "Which platforms are supported?",
    answer: `${MOST_POPULAR_PLATFORMS.slice(0, -1).join(", ")} and ${
      MOST_POPULAR_PLATFORMS[MOST_POPULAR_PLATFORMS.length - 1]
    }. Select one or more before choosing your mood.`,
  },
  {
    question: "Is it free? Do I need an account?",
    answer: "Yes, it's free, and there's no sign-up or account.",
  },
  {
    question: "Can I get a different suggestion?",
    answer:
      "Yes. Press CONTINUE? NEW GAME on the result screen to draw another game for the same mood, or change your mood at any time.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
    },
    {
      "@type": "WebApplication",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      applicationCategory: "EntertainmentApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 md:px-8">
      <JsonLd data={structuredData} />

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
        <h1>
          <Wordmark />
        </h1>
        <p className="font-pixel mt-6 text-[10px] md:text-sm text-neon-yellow blink">
          INSERT MOOD TO CONTINUE
        </p>
        <p className="mt-4 text-xl md:text-2xl text-crt-soft">
          Pick a mood and get a top-rated video game to play today.
        </p>
      </header>

      <MoodPicker />

      <section aria-labelledby="how-to-play" className="mt-20">
        <h2
          id="how-to-play"
          className="font-pixel text-center text-sm md:text-lg neon-magenta mb-6 md:mb-8"
        >
          HOW TO PLAY
        </h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="bg-crt-panel p-5 shadow-[inset_0_0_0_2px_theme(colors.crt.line)]"
            >
              <p className="font-pixel text-[10px] text-crt-dim">
                STAGE {index + 1}
              </p>
              <h3 className="font-pixel mt-3 text-[11px] md:text-xs text-neon-yellow">
                {step.title}
              </h3>
              <p className="mt-2 text-xl leading-6 text-crt-body">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="faq" className="mt-20">
        <h2
          id="faq"
          className="font-pixel text-center text-sm md:text-lg neon-cyan mb-6 md:mb-8"
        >
          FAQ
        </h2>
        <dl className="mx-auto max-w-3xl flex flex-col gap-3">
          {FAQ.map(({ question, answer }) => (
            <div
              key={question}
              className="bg-crt-sunken p-5 shadow-[inset_0_0_0_2px_theme(colors.crt.line)]"
            >
              <dt className="font-pixel text-[10px] md:text-[11px] leading-5 text-neon-yellow">
                &gt; {question.toUpperCase()}
              </dt>
              <dd className="mt-3 text-xl leading-6 text-crt-body">{answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
