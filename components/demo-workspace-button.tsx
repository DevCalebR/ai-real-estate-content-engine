"use client";

import { LoaderCircle, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { buttonStyles, type ButtonSize, type ButtonVariant } from "@/components/ui/button";

export function DemoWorkspaceButton({
  label = "Open sample workspace",
  variant = "secondary",
  size = "lg",
  className,
}: {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setIsPending(true);

    try {
      const response = await fetch("/api/demo/seed", {
        method: "POST",
      });

      const payload = (await response.json()) as { error?: string; id?: string } | undefined;

      if (!response.ok || !payload?.id) {
        throw new Error(payload?.error ?? "The sample workspace could not be created.");
      }

      router.push(`/results/${payload.id}`);
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The sample workspace could not be created.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={buttonStyles({ variant, size, className })}
      >
        {isPending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Opening sample workspace
          </>
        ) : (
          <>
            <Rocket className="mr-2 h-4 w-4" />
            {label}
          </>
        )}
      </button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
