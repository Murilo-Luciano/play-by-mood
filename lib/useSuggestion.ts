"use client";

import { SuggestedGame } from "@/services/types";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

async function fetcher(input: string): Promise<SuggestedGame> {
  const res = await fetch(input);
  const json = await res.json();

  if (!res.ok) throw new Error(`${res.status} - ${json.message}`);

  return json;
}

/**
 * Fetches a suggestion from `/api/game` for the mood and the `?platforms=`
 * in the URL. `next()` revalidates the key, which samples another game.
 * `game` is undefined when the API found nothing (it answers `{}`).
 */
export function useSuggestion(mood: string) {
  const platforms = useSearchParams().get("platforms");

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<SuggestedGame>(
      `/api/game?mood=${mood}&${
        platforms?.length ? `platforms=${platforms}` : ""
      }`,
      fetcher,
      {
        revalidateOnReconnect: false,
        revalidateOnFocus: false,
        errorRetryCount: 1,
      }
    );

  return {
    game: data && Object.keys(data).length ? data : undefined,
    error,
    isLoading,
    isValidating,
    platforms,
    next: () => mutate(undefined, { revalidate: true }),
  };
}
