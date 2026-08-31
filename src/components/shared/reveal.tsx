import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function Reveal({ children, className }: Props) {
  return (
    <div className={cn(className)}>{children}</div>
  );
}
