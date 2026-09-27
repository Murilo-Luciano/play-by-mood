import { MOOD_KEYS, MOODS, isMood } from "@/lib/moods";
import { OG_SIZE, renderOgImage } from "@/lib/ogImage";
import { notFound } from "next/navigation";

export const alt = "PlayByMood: a top-rated game for your mood";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return MOOD_KEYS.map((mood) => ({ mood }));
}

export default function Image({ params }: { params: { mood: string } }) {
  if (!isMood(params.mood)) notFound();

  return renderOgImage(MOODS[params.mood]);
}
