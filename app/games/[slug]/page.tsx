"use client";

import { Button } from "@/components/ui/button";
import { Games } from "@/models/Games";
import DOMPurify from "dompurify";
import Image from "next/image";
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

  if (isLoading) return <p>Loading...</p>;

  if (!data || error) return <p>ERRO</p>;

  const placeholder = `<h3>Three in a row</h3>\n<p>The third part of the popular series of games in the genre three in a row, Bejeweled 3 was developed by the PopCap Games studio in 2010. The game was the fifth in the series, but the third one that received a number in the name. Originally released only on PC and Mac, but later it was ported to both consoles and mobile devices running Android, iOS, Java ME and Windows Phone. The developers called the game “the biggest Bejeweled experience available to date.” The game is available for free at partner sites.</p>\n<h3>What to do?</h3>\n<p>The goal of the game has not changed compared to the previous parts: the player must match three identical in color gem, which, if all is correct, they disappear. Rows of gems are constantly moving, and the game adds the random new gems on top screen. Thus, the player can launch a chain reaction and earn many points at once.</p>\n<h3>What’s new?</h3>\n<p>In the new part of Bejeweled, four new game modes appeared as well as new sound effects and improved graphics. However, this is true not for all versions of the game: so in the Java ME version, players have only four game modes available due to hardware limitations. There is Zen mode also in the game - a new one. There, players can customize the audio and visual components of the game and create their own meditative experience. There is no plot in the game, but you can earn 65 badges to prove the ultimate player’s skill.</p>`;
  // deveria ser o data.description, mas hj o data.description está como markdown
  const sanitizedHtml = DOMPurify.sanitize(placeholder);

  return (
    <main className="flex flex-col text-center p-4">
      <h1 className="text-xl font-extrabold tracking-tight mb-5">PlayByMood</h1>
      <h2 className="text-4xl font-extrabold tracking-tight my-14">
        {data.name}
      </h2>
      <div className="flex flex-row gap-3 overflow-y-auto">
        {data.screenshots?.map((e) => (
          <Image
            src={(e as any).image}
            alt="Game screenshot"
            width={264}
            height={148}
            className="rounded-2xl"
          />
        ))}
      </div>
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
              <Button className="rounded-xl" onClick={() => setReadMore(false)}>
                Show less
              </Button>
            </div>
          ) : (
            <div>
              <div
                dangerouslySetInnerHTML={{
                  __html: `${sanitizedHtml.slice(0, TEXT_MAX_LENGTH)}...`,
                }}
              />
              <Button className="rounded-xl" onClick={() => setReadMore(true)}>
                Read more
              </Button>
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

export async function fetcher<JSON = any>(
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
