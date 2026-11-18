import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <article
      className={`rounded-[2rem] border border-white/70 bg-[#fffdf9] shadow-[0_18px_60px_rgba(72,52,38,0.10)] ${className}`}
      {...props}
    >
      {children}
    </article>
  );
}
