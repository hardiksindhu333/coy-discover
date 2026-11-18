"use client";

import { motion, type PanInfo } from "framer-motion";
import Image from "next/image";
import { MapPin, GraduationCap } from "lucide-react";
import type { ProfileDto } from "@/lib/types";

interface ProfileCardProps {
  profile: ProfileDto;
  exitDirection: "LEFT" | "RIGHT" | null;
  onSwipe: (direction: "LIKE" | "PASS") => void;
}

export function ProfileCard({
  profile,
  exitDirection,
  onSwipe,
}: ProfileCardProps) {
  const exitX =
    exitDirection === "LEFT" ? -520 : exitDirection === "RIGHT" ? 520 : 0;
  const exitRotate =
    exitDirection === "LEFT" ? -18 : exitDirection === "RIGHT" ? 18 : 0;

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > 100 || info.velocity.x > 500) onSwipe("LIKE");
    if (info.offset.x < -100 || info.velocity.x < -500) onSwipe("PASS");
  }

  return (
    <motion.article
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.88}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX, rotate: exitRotate, opacity: exitDirection ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className="absolute inset-0 h-full touch-pan-y overflow-hidden rounded-[2rem] border border-white/70 bg-[#fffdf9] shadow-[0_24px_70px_rgba(72,52,38,0.18)]"
      aria-label={`${profile.name}, ${profile.age}`}
    >
      <div className="relative h-[58%] min-h-72 overflow-hidden sm:h-[62%]">
        <Image
          src={profile.photoUrl}
          alt={`${profile.name}, age ${profile.age}`}
          fill
          sizes="(max-width: 768px) 100vw, 448px"
          className="object-cover"
          draggable={false}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/5" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <h1 className="text-4xl font-semibold tracking-tight">
            {profile.name}, <span className="font-normal">{profile.age}</span>
          </h1>
        </div>
      </div>

      <div className="flex h-[42%] flex-col justify-between p-5 sm:h-[38%] sm:p-6">
        <div>
          <p className="text-[15px] leading-6 text-stone-700">{profile.bio}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-stone-600">
            <span className="flex items-center gap-1.5">
              <MapPin size={15} aria-hidden="true" />
              {profile.city}
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1.5">
              <GraduationCap size={15} aria-hidden="true" />
              {profile.college}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <span
              key={interest}
              className="rounded-full border border-[#e7d8c9] bg-[#faf4ec] px-3 py-1.5 text-xs font-semibold text-[#725240]"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
