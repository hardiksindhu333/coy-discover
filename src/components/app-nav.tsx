"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, House, Sparkles } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: House },
  { href: "/discover", label: "Discover", icon: Sparkles },
  { href: "/matches", label: "Matches", icon: Heart },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200/80 bg-[#fffdf9]/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:left-1/2 md:bottom-5 md:max-w-md md:-translate-x-1/2 md:rounded-full md:border md:px-3 md:py-2 md:shadow-[0_12px_40px_rgba(62,48,38,0.14)]"
    >
      <div className="mx-auto flex max-w-md items-center justify-around md:justify-between">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-20 flex-col items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold transition md:min-w-24 md:flex-row md:justify-center md:gap-2 md:text-sm ${
                active
                  ? "bg-[#5d3d2e] text-white"
                  : "text-stone-500 hover:text-[#5d3d2e]"
              }`}
            >
              <Icon aria-hidden="true" size={19} strokeWidth={active ? 2.4 : 2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
