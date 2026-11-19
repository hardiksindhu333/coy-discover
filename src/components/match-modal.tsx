"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Heart, X } from "lucide-react";
import type { ProfileDto } from "@/lib/types";

interface MatchModalProps {
  profile: ProfileDto | null;
  onClose: () => void;
}

export function MatchModal({ profile, onClose }: MatchModalProps) {
  return (
    <AnimatePresence>
      {profile ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-70 flex items-center justify-center bg-[#2e2119]/70 p-5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="match-title"
        >
          <motion.section
            initial={{ scale: 0.88, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative w-full max-w-sm rounded-4xl bg-[#fffaf3] p-7 text-center shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close match celebration"
              className="absolute right-4 top-4 rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
            >
              <X size={20} />
            </button>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -8, 8, 0] }}
              transition={{
                delay: 0.12,
                type: "tween",
                duration: 0.55,
                ease: "easeInOut",
              }}
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#b95f50] text-white"
            >
              <Heart fill="currentColor" size={30} />
            </motion.div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a9755e]">
              Coy
            </p>
            <h2 id="match-title" className="mt-2 text-3xl font-semibold text-stone-800">
              It&apos;s a match!
            </h2>
            <Image
              src={profile.photoUrl}
              alt=""
              width={112}
              height={112}
              className="mx-auto mt-5 h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg"
            />
            <p className="mt-4 text-lg font-semibold text-stone-700">
              You and {profile.name} liked each other
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-[#5d3d2e] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#4d3024]"
            >
              Keep discovering
            </button>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
