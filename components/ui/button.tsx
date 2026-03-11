import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-full font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60";
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[var(--brand)] text-white shadow-[0_18px_40px_rgba(14,116,144,0.24)] hover:bg-[var(--brand-strong)]",
    secondary:
      "bg-[rgba(255,255,255,0.78)] text-[var(--ink)] ring-1 ring-[rgba(24,32,51,0.08)] hover:bg-white",
    outline:
      "bg-transparent text-[var(--ink)] ring-1 ring-[rgba(24,32,51,0.15)] hover:bg-white/60",
    ghost: "bg-transparent text-[var(--ink-soft)] hover:bg-white/50",
  };
  const sizes: Record<ButtonSize, string> = {
    sm: "h-10 px-4 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

export function Button({
  className,
  variant,
  size,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonStyles({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}
