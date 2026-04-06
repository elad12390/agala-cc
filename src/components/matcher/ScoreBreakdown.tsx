"use client";

import { useTranslations, useLocale } from "next-intl";
import type { ScoredStroller } from "@/lib/scoring";

const FACTOR_CONFIG = [
  { key: "terrain", emoji: "🛞" },
  { key: "weight", emoji: "⚖️" },
  { key: "fold", emoji: "📦" },
  { key: "sun", emoji: "☀️" },
  { key: "style", emoji: "🎨" },
  { key: "resale", emoji: "💰" },
  { key: "expert", emoji: "🔬" },
] as const;

function barColor(score: number): string {
  if (score >= 7) return "bg-primary";
  if (score >= 4) return "bg-amber-400";
  return "bg-rose-400";
}

interface ScoreBreakdownProps {
  scores: ScoredStroller["scores"];
}

export function ScoreBreakdown({ scores }: ScoreBreakdownProps) {
  const t = useTranslations("grades.breakdown");
  const locale = useLocale();
  const isHe = locale === "he";

  return (
    <div className="w-[220px] p-3 space-y-2" dir={isHe ? "rtl" : "ltr"}>
      <p className="text-[11px] font-bold opacity-90">{t("title")}</p>
      <div className="space-y-1.5">
        {FACTOR_CONFIG.map(({ key, emoji }) => {
          const entry = scores[key];
          if (!entry) return null;
          const pct = (entry.score / entry.max) * 100;

          return (
            <div key={key} className="flex items-center gap-1.5 text-[10px]">
              <span className="shrink-0 w-[14px] text-center">{emoji}</span>
              <span className="shrink-0 w-[52px] truncate opacity-80">{t(key)}</span>
              <div className="flex-1 h-[6px] rounded-full bg-white/20 overflow-hidden">
                <div
                  className={`h-full rounded-full ${barColor(entry.score)} transition-all`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="shrink-0 w-[26px] text-end tabular-nums font-semibold opacity-90" dir="ltr">
                {entry.score}/{entry.max}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
