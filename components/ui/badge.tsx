import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "warning";
  className?: string;
}) {
  const tones = {
    neutral: "bg-white/70 text-slate-700 ring-slate-200/80",
    accent: "bg-teal-50 text-teal-800 ring-teal-200",
    warning: "bg-amber-50 text-amber-800 ring-amber-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase ring-1 backdrop-blur",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
