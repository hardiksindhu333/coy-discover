"use client";

import { CheckCircle2 } from "lucide-react";

export function EmptyState() {
  return (
    <section className="flex h-full min-h-[520px] items-center justify-center rounded-[2rem] border border-dashed border-[#dacbbd] bg-[#fffdf9] p-8 text-center shadow-[0_18px_60px_rgba(72,52,38,0.08)]">
      <div className="max-w-xs">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#edf4e8] text-[#58704e]">
          <CheckCircle2 size={32} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-semibold text-stone-800">You’re all caught up</h1>
        <p className="mt-3 leading-6 text-stone-500">
          You’ve seen everyone available. New people will appear here in the next round.
        </p>
      </div>
    </section>
  );
}
