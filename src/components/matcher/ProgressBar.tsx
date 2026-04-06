"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
}

const STEPS = [1, 2, 3] as const;
const stepEmoji = ["🔍", "⚙️", "🏆"];

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const t = useTranslations("matcher.progress");

  const labels: Record<number, string> = {
    1: t("step1"),
    2: t("step2"),
    3: t("step3"),
  };

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 py-6 px-4">
      {STEPS.map((step, i) => {
        const isCompleted = currentStep > step;
        const isCurrent = currentStep === step;

        return (
          <div key={step} className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all",
                  isCompleted && "bg-pink-200 text-pink-800 dark:bg-pink-900/60 dark:text-pink-200",
                  isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary/20 ring-offset-2 ring-offset-background",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="size-4" /> : <span>{stepEmoji[i]}</span>}
              </div>
              <span
                className={cn(
                  "text-sm hidden sm:inline transition-colors",
                  isCurrent ? "font-semibold text-foreground" : "text-muted-foreground"
                )}
              >
                {labels[step]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px w-8 md:w-16 transition-colors",
                  currentStep > step
                    ? "bg-gradient-to-r from-pink-300 to-primary/60 dark:from-pink-800 dark:to-primary/40"
                    : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
