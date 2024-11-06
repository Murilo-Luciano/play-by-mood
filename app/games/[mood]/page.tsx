"use client";

import ErrorPage from "@/components/suggestionPage/ErrorPage";
import SkeletonLoading from "@/components/suggestionPage/SkeletonLoading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Games } from "@/models/Games";
import { UpdateIcon } from "@radix-ui/react-icons";
import DOMPurify from "dompurify";
import _ from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

const TEXT_MAX_LENGTH = 400;

export default function Page({ params }: { params: { mood: string } }) {
  const [readMore, setReadMore] = useState(false);

  const searchParams = useSearchParams();
  const selectedPlatforms = searchParams.get("platforms");

  const { data, error, isLoading, mutate } = useSWR<Games>(
    `/api/game?mood=${params.mood}&${
      selectedPlatforms?.length ? `platforms=${selectedPlatforms}` : ""
    }`,
    fetcher,
    {
      revalidateOnReconnect: false,
      revalidateOnFocus: false,
      errorRetryCount: 1,
    }
  );

  if (isLoading) return <SkeletonLoading />;

  if (!data || _.isEmpty(data) || error) return <ErrorPage />;

  const sanitizedHtml = DOMPurify.sanitize(data.description);

  return (
    <main className="flex flex-col text-center p-4 xl:px-96">
      <MoodAlert
        mood={_.capitalize(params.mood)}
        moodImageUrl={`/${params.mood.toLocaleLowerCase()}.png`}
        selectedPlatforms={selectedPlatforms}
      />

      <h2 className="text-4xl text-start font-extrabold tracking-tight mb-4 mt-8">
        {data.name}
      </h2>

      <p className="text-start text-muted-foreground">Screenshots</p>
      <ScrollArea className="p-4 rounded-lg border">
        <div className="flex flex-row gap-3">
          {data.screenshots?.map((e, k) => {
            return <ScreenshotImage key={k} imageUrl={e.image} />;
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex flex-col gap-4">
        <div className="flex flex-row flex-wrap gap-8 mt-4">
          <div className="text-sm text-start">
            <p className="text-muted-foreground">Release date</p>
            <p>{data.releasedDate}</p>
          </div>

          <div className="text-sm text-start">
            <p className="text-muted-foreground">Metacritic score</p>
            <p className="text-green-500">{data.metacriticRating}</p>
          </div>

          <div className="text-sm text-start">
            <p className="text-muted-foreground">Platforms</p>
            <p>{data.platforms.map((p) => p.name).join(", ")}</p>
          </div>
        </div>

        <div className="text-start">
          <p className="text-sm text-start text-muted-foreground">
            Description
          </p>
          {readMore ? (
            <div>
              <div
                dangerouslySetInnerHTML={{
                  __html: applyClassMapping(sanitizedHtml),
                }}
              />
              <span
                className="text-purple-500"
                onClick={() => setReadMore(false)}
              >
                Show less
              </span>
            </div>
          ) : (
            <div>
              <div
                dangerouslySetInnerHTML={{
                  __html: `${sanitizedHtml.slice(0, TEXT_MAX_LENGTH)}...`,
                }}
              />
              <span
                className="text-purple-500"
                onClick={() => setReadMore(true)}
              >
                Show more
              </span>
            </div>
          )}
        </div>

        <div className="text-sm text-start">
          <p className="text-muted-foreground">Key words</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {data.tags.map((p) => (
              <Badge key={p.id} className="rounded-xl">
                {p.name}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          onClick={() => mutate(undefined, { revalidate: true })}
          className="mt-4 max-w-96"
          variant={"outline"}
        >
          <UpdateIcon className="mr-1" /> Try a new suggestion
        </Button>

        <p>
          Data provided by{" "}
          <a href="https://rawg.io/" target="_blank" className="underline">
            rawg.io
          </a>
        </p>
      </div>
    </main>
  );
}

async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);

  const json = await res.json();

  if (!res.ok) {
    throw new Error(`${res.status} - ${json.message}`);
  }

  return json;
}

function applyClassMapping(html: string): string {
  const tagClassMap: { [key: string]: string } = {
    h1: "text-4xl font-extrabold",
    h2: "text-3xl font-semibold",
    h3: "text-2xl font-semibold",
    h4: "text-xl font-semibold",
  };

  Object.keys(tagClassMap).forEach((tag) => {
    const classAttribute = `class="${tagClassMap[tag]}"`;

    const openingTagRegex = new RegExp(`<${tag}(.*?)>`, "g");
    html = html.replace(openingTagRegex, `<${tag} $1 ${classAttribute}>`);
  });

  return html;
}

function MoodAlert({
  mood,
  moodImageUrl,
  selectedPlatforms,
}: {
  mood: string;
  moodImageUrl: string;
  selectedPlatforms: string | null;
}) {
  return (
    <div className="bg-background border border-purple-500 rounded-2xl flex gap-3 text-start px-4 py-2 lg:max-w-96">
      <div>
        <Image src={moodImageUrl} alt="emoji" width={24} height={24} />
      </div>
      <div className="flex-2">
        <h5 className="font-medium">Feeling {mood} ?</h5>
        <p className="text-sm">Here's one game you might enjoy!</p>
      </div>

      <Link
        href={`/${
          selectedPlatforms?.length ? `?platforms=${selectedPlatforms}` : ""
        }`}
        className="flex-1 text-center border max-w-16 rounded-xl"
      >
        <p className="text-purple-500 text-sm">Change mood</p>
      </Link>
    </div>
  );
}

function ScreenshotImage({ imageUrl }: { imageUrl: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Image
        src={imageUrl}
        alt="Game screenshot"
        width={264}
        height={148}
        className={`rounded-2xl w-auto h-auto mb-2`}
        onLoad={() => setLoading(false)}
      />
      <Skeleton
        className={`w-[264px] h-[148px] rounded-2xl ${loading ? "" : "hidden"}`}
      />
    </>
  );
}
