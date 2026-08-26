import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  children,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="mx-auto mb-8 max-w-2xl text-center">
      {eyebrow ? (
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          {eyebrow}
        </span>
      ) : null}
      <Heading className={cn("mt-2 font-bold", Heading === "h1" ? "text-4xl" : "text-2xl")}>
        {title}
      </Heading>
      {children ? <p className="mt-3 text-ink-soft">{children}</p> : null}
    </div>
  );
}
