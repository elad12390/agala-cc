"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface CompareToastProps {
  trigger: number;
  durationMs?: number;
}

function CompareToastInstance({ durationMs }: { durationMs: number }) {
  const t = useTranslations("compare.toast");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setVisible(false), durationMs);
    return () => window.clearTimeout(id);
  }, [durationMs]);

  if (!visible) return null;

  return (
    <div
      data-testid="compare-toast"
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-24 z-50 mx-auto w-fit max-w-sm rounded-full border bg-foreground text-background px-4 py-2 text-sm shadow-lg"
    >
      {t("max")}
    </div>
  );
}

export function CompareToast({
  trigger,
  durationMs = 10000,
}: CompareToastProps) {
  if (trigger === 0) return null;
  return <CompareToastInstance key={trigger} durationMs={durationMs} />;
}
