import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-xl space-y-4 text-center">
        <p className="eyebrow">Not Found</p>
        <h1 className="font-display text-5xl leading-none text-[var(--ink)]">
          This content plan does not exist.
        </h1>
        <p className="text-sm leading-7 text-[var(--ink-soft)]">
          The requested run could not be found in local storage. Generate a new plan or
          return to the dashboard.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/" className={buttonStyles({ variant: "secondary" })}>
            Dashboard
          </Link>
          <Link href="/generate" className={buttonStyles({ variant: "primary" })}>
            Generate content
          </Link>
        </div>
      </Card>
    </div>
  );
}
