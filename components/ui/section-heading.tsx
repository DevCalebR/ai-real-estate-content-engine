import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("space-y-3", align === "center" && "text-center")}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="font-display text-4xl leading-none text-[var(--ink)] sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base leading-7 text-[var(--ink-soft)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
