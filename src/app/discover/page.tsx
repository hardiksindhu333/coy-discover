"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart, RotateCcw, X } from "lucide-react";
import { ProfileCard } from "@/components/profile-card";
import { EmptyState } from "@/components/empty-state";
import { MatchModal } from "@/components/match-modal";
import type { ProfileDto } from "@/lib/types";

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<ProfileDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exitDirection, setExitDirection] = useState<"LEFT" | "RIGHT" | null>(null);
  const [matchedProfile, setMatchedProfile] = useState<ProfileDto | null>(null);
  const [swiping, setSwiping] = useState(false);

  useEffect(() => {
    async function loadFeed() {
      try {
        const response = await fetch("/api/feed", { cache: "no-store" });
        if (!response.ok) throw new Error("Unable to load profiles");
        setProfiles((await response.json()) as ProfileDto[]);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Unable to load profiles");
      } finally {
        setLoading(false);
      }
    }
    void loadFeed();
  }, []);

  const handleSwipe = useCallback(
    async (direction: "LIKE" | "PASS") => {
      const profile = profiles[0];
      if (!profile || swiping) return;

      setSwiping(true);
      setExitDirection(direction === "LIKE" ? "RIGHT" : "LEFT");

      try {
        const response = await fetch("/api/swipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetProfileId: profile.id,
            direction,
          }),
        });
        if (!response.ok) {
          const body = (await response.json()) as { error?: string };
          throw new Error(body.error ?? "Unable to record swipe");
        }
        const result = (await response.json()) as {
          matched: boolean;
          profile: ProfileDto | null;
        };

        window.setTimeout(() => {
          setProfiles((current) => current.slice(1));
          setExitDirection(null);
          setSwiping(false);
          if (result.matched && result.profile) setMatchedProfile(result.profile);
        }, 260);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Unable to record swipe");
        setExitDirection(null);
        setSwiping(false);
      }
    },
    [profiles, swiping],
  );

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-5 pb-28 pt-6">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e8dacc] border-t-[#6a4a39]" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-5 pb-28 pt-6">
        <section className="w-full max-w-sm rounded-3xl border border-red-100 bg-white p-7 text-center">
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
      </main>
    );
  }

  return (
    <main className="min-h-dvh px-4 pb-28 pt-5 md:px-8 md:pb-32 md:pt-8">
      <div className="mx-auto w-full max-w-md">
        {profiles.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="relative mx-auto h-[min(680px,calc(100dvh-190px))] min-h-[520px] w-full">
              {profiles[0] ? (
                <ProfileCard
                  profile={profiles[0]}
                  exitDirection={exitDirection}
                  onSwipe={(direction) => void handleSwipe(direction)}
                />
              ) : null}
            </div>
            <div className="mt-5 flex items-center justify-center gap-5">
              <button
                type="button"
                disabled={swiping}
                onClick={() => void handleSwipe("PASS")}
                aria-label="Pass"
                className="flex h-14 w-14 items-center justify-center rounded-full border border-stone-200 bg-white text-[#6a625c] shadow-md transition hover:-translate-y-1 hover:text-red-600 disabled:opacity-50"
              >
                <X size={27} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                disabled={swiping}
                onClick={() => void handleSwipe("LIKE")}
                aria-label="Like"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-[#b95f50] text-white shadow-[0_12px_28px_rgba(185,95,80,0.32)] transition hover:-translate-y-1 hover:bg-[#a95043] disabled:opacity-50"
              >
                <Heart fill="currentColor" size={29} />
              </button>
            </div>
          </>
        )}
      </div>
      <MatchModal
        profile={matchedProfile}
        onClose={() => setMatchedProfile(null)}
      />
    </main>
  );
}
