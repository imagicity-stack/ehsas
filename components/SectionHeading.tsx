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
    <div className={cn("space-y-4", className)}>
      {eyebrow ? (
        <span className="inline-flex w-fit items-center rounded-full bg-crimson/10 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-crimson">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-serif text-3xl leading-tight text-charcoal md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base text-charcoal/75">{description}</p>
      ) : null}
    </div>
  );
}
