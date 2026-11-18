"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, RotateCcw } from "lucide-react";
import type { MatchDto } from "@/lib/types";

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMatches() {
      try {
        const response = await fetch("/api/matches", { cache: "no-store" });
        if (!response.ok) throw new Error("Unable to load matches");
        setMatches((await response.json()) as MatchDto[]);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Unable to load matches");
      } finally {
        setLoading(false);
      }
    }
    void loadMatches();
  }, []);

  return (
    <main className="min-h-dvh px-5 pb-28 pt-8 md:mx-auto md:max-w-3xl md:px-8 md:pt-12">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#a9755e]">
          Your connections
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-stone-800">Matches</h1>
      </header>

      {loading ? (
        <div className="mt-12 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e8dacc] border-t-[#6a4a39]" />
        </div>
      ) : error ? (
        <section className="mt-8 rounded-3xl border border-red-100 bg-white p-7 text-center">
          <p className="font-semibold text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-bold text-white"
          >
            <RotateCcw size={16} />
            Try again
          </button>
        </section>
      ) : matches.length === 0 ? (
        <section className="mt-8 rounded-4xl border border-dashed border-[#dacbbd] bg-[#fffdf9] px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f2e8dc] text-[#a56c58]">
            <Heart size={26} />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-stone-800">No matches yet</h2>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-stone-500">
            Mutual likes will appear here. Until then, keep discovering.
          </p>
        </section>
      ) : (
        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {matches.map((match) => (
            <article
              key={match.id}
              className="overflow-hidden rounded-3xl border border-white bg-[#fffdf9] shadow-[0_10px_30px_rgba(72,52,38,0.10)]"
            >
              <Image
                src={match.profile.photoUrl}
                alt={match.profile.name}
                width={400}
                height={192}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold text-stone-800">
                  {match.profile.name}, {match.profile.age}
                </h2>
                <p className="mt-1 truncate text-xs text-stone-500">
                  {match.profile.city}
                </p>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
