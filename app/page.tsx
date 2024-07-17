import { Mood } from "@/services/gameService";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-slate-500 flex gap-4">
        {Object.values(Mood).map((mood, i) => {
          return (
            <button className="bg-red-700" key={i}>
              {mood}
            </button>
          );
        })}
      </div>
    </main>
  );
}
