import Link from "next/link";
import type { ComponentProps } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type ButtonLinkProps = ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>;

export function ButtonLink({ variant, size, className, href, ...props }: ButtonLinkProps) {
  const classes = cn(buttonVariants({ variant, size }), "no-underline", className);
  const target = typeof href === "string" ? href : "";

  if (/^https?:/.test(target)) {
    return (
      <a
        href={target}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        {...(props as ComponentProps<"a">)}
      />
    );
  }

  if (/^(tel:|mailto:)/.test(target)) {
    return <a href={target} className={classes} {...(props as ComponentProps<"a">)} />;
  }

  return <Link href={href} className={classes} {...props} />;
}
