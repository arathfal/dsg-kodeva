import type { InputHTMLAttributes } from "react";

// Reusable text input (owner-requested S-036D): one shared component with one
// class contract ("input w-full" plus optional extras) instead of repeated
// input markup. Used by the checkout and lead form islands and server-rendered
// by Astro for the catalog search bar (no hydration directive, so it ships no
// client JavaScript there). Special inputs stay on raw elements on purpose:
// the checkout simulation radios (custom layout), and semantic honeypot fields
// (deliberately unstyled).
export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={["input w-full", className].filter(Boolean).join(" ")}
    />
  );
}
