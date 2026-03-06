import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/70 bg-[rgba(255,253,248,0.82)] p-6 shadow-[0_18px_60px_rgba(24,32,51,0.08)] backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}
