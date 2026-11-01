import type { ComponentProps } from "react";

// Hydrated islands (TSX) cannot import .astro components, so this is the React
// twin of icons/CheckIcon.astro with identical geometry and defaults.
export function CheckIcon({
  className = "",
  size = 16,
  strokeWidth = 2.5,
  ...props
}: ComponentProps<"svg"> & { size?: number; strokeWidth?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
