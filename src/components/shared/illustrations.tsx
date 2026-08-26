import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function Paw({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className} {...props}>
      <ellipse cx="7" cy="8.5" rx="1.9" ry="2.6" />
      <ellipse cx="12" cy="6.3" rx="2" ry="2.8" />
      <ellipse cx="17" cy="8.5" rx="1.9" ry="2.6" />
      <path d="M12 11c3 0 5.3 2.3 5.3 4.8 0 2-1.7 3.6-3.7 3.6-.6 0-1.1-.4-1.6-.4s-1 .4-1.6.4c-2 0-3.7-1.6-3.7-3.6C6.7 13.3 9 11 12 11Z" />
    </svg>
  );
}

export function PawPattern({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <defs>
        <pattern id="paw-tile" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
          <g fill="currentColor">
            <ellipse cx="18" cy="20" rx="1.7" ry="2.3" />
            <ellipse cx="23" cy="18" rx="1.8" ry="2.5" />
            <ellipse cx="28" cy="20" rx="1.7" ry="2.3" />
            <path d="M23 23c2.8 0 5 2.2 5 4.6 0 1.9-1.6 3.4-3.5 3.4-.6 0-1-.4-1.5-.4s-.9.4-1.5.4c-1.9 0-3.5-1.5-3.5-3.4C18 25.2 20.2 23 23 23Z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#paw-tile)" />
    </svg>
  );
}
