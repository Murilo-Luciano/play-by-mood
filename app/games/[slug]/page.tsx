"use client";

import { buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Games } from "@/models/Games";
import DOMPurify from "dompurify";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

const TEXT_MAX_LENGTH = 400;

export default function Page({ params }: { params: { slug: string } }) {
  const [readMore, setReadMore] = useState(false);

  const { data, error, isLoading } = useSWR<Games>(
    `/api/game?mood=${params.slug}`,
    fetcher,
    { revalidateOnReconnect: false, revalidateOnFocus: false }
  );

  if (isLoading)
    return (
      <main className="flex flex-col p-4 text-center overflow-x-hidden">
        <h1 className="text-xl font-extrabold tracking-tight">PlayByMood</h1>
        <Skeleton className="w-full h-9 my-16" />
        <ScrollArea className="self-start p-4 rounded-lg border w-full">
          <div className="flex flex-row gap-3 overflow-y-auto">
            <Skeleton className="w-[264px] h-[148px] rounded-2xl" />
            <Skeleton className="w-[264px] h-[148px] rounded-2xl" />
          </div>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex gap-8">
            <div className="flex flex-col gap-1">
              <Skeleton className="w-12 h-4" />
              <Skeleton className="w-24 h-4" />
            </div>

            <div className="flex flex-col gap-1">
              <Skeleton className="w-12 h-4" />
              <Skeleton className="w-24 h-4" />
            </div>

            <div className="flex flex-col gap-1">
              <Skeleton className="w-12 h-4" />
              <Skeleton className="w-24 h-4" />
            </div>
          </div>

          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-full h-80" />
        </div>
      </main>
    );

  if (!data || error)
    return (
      <main className="flex flex-col p-4 items-center">
        <h1 className="text-xl font-extrabold tracking-tight mb-10">
          PlayByMood
        </h1>

        <div className="flex flex-col items-center gap-4">
          <TriangleAlertIcon className="h-16 w-16 text-gray-500 dark:text-gray-400" />
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Oops, something went wrong!</h1>
            <p className="text-gray-500 dark:text-gray-400">
              We're sorry, but it looks like there was an error. Please try
              again later or contact us if the issue persists.
            </p>
          </div>
          <Link
            href="/"
            prefetch={false}
            className={buttonVariants({ variant: "default" })}
          >
            Return to Homepage
          </Link>
        </div>
      </main>
    );

  const sanitizedHtml = DOMPurify.sanitize(data.description);

  return (
    <main className="flex flex-col text-center p-4">
      <h2 className="text-4xl font-extrabold tracking-tight my-14">
        {data.name}
      </h2>

      <ScrollArea className="p-4 rounded-lg border">
        <div className="flex flex-row gap-3 overflow-y-auto">
          {data.screenshots?.map((e, k) => (
            <Image
              key={k}
              src={(e as any).image}
              alt="Game screenshot"
              width={264}
              height={148}
              className="rounded-2xl w-auto h-auto mb-2"
            />
          ))}
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
          <p>{data.tags.map((p) => p.name).join(", ")}</p>
        </div>

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
  return res.json();
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

function TriangleAlertIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
