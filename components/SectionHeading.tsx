import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crimson">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-serif text-3xl text-charcoal md:text-4xl">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-base text-charcoal/80">{description}</p>
      ) : null}
    </div>
  );
}
