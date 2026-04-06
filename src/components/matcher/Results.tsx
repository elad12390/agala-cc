"use client";

import { useTranslations, useLocale } from "next-intl";
import { ExternalLink, Play, Share2, RotateCcw, ArrowRight, AlertTriangle, Trophy, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ShineBorder } from "@/components/ui/shine-border";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ScoreBreakdown } from "@/components/matcher/ScoreBreakdown";
import { getGradeColor } from "@/lib/grades";
import { encodePreferences } from "@/lib/url-params";
import { cn } from "@/lib/utils";
import type { ScoredStroller, UserPreferences } from "@/lib/scoring";

interface ResultsProps {
  results: ScoredStroller[];
  discoveries: ScoredStroller[];
  onStartOver: () => void;
  prefs: UserPreferences | null;
}

export function Results({ results, discoveries, onStartOver, prefs }: ResultsProps) {
  const t = useTranslations("matcher.step3");
  const locale = useLocale();
  const router = useRouter();
  const isHe = locale === "he";

  if (results.length === 0) return null;

  const winner = results[0];
  const alternatives = results.slice(1);

  const handleShare = async () => {
    const text = `${t("shareText")}\n${winner.stroller.brand} ${winner.stroller.model} — ${winner.totalScore}% ${t("matchScore")}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: t("winnerTitle"), text, url: window.location.href });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  const handleSeeAll = () => {
    if (prefs) {
      const prefParams = new URLSearchParams(encodePreferences(prefs));
      router.push(`/${locale}/all?${prefParams.toString()}`);
    } else {
      router.push(`/${locale}/all`);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <BlurFade delay={0}>
        <div className="relative rounded-2xl border bg-card p-5 md:p-8 overflow-hidden shadow-baby">
          <ShineBorder shineColor={["#c4b5fd", "#f9a8d4"]} borderWidth={2} />

          <div className="text-center mb-4" aria-hidden>
            <span className="text-3xl">🏆</span>
          </div>

          <div className="flex items-start gap-4">
            <Tooltip>
              <TooltipTrigger>
                <div className="flex flex-col items-center gap-1 shrink-0 cursor-help">
                  <div className="relative flex items-center justify-center">
                    <svg className="size-20" viewBox="0 0 100 100" fill="none" role="img" aria-label="Score chart">
                      <title>Score</title>
                      <circle
                        cx="50" cy="50" r="42"
                        strokeWidth="6"
                        stroke="currentColor"
                        className="text-secondary"
                      />
                      <circle
                        cx="50" cy="50" r="42"
                        strokeWidth="6"
                        stroke="currentColor"
                        className="text-primary"
                        strokeLinecap="round"
                        strokeDasharray={`${(winner.totalScore / 100) * 264} 264`}
                        transform="rotate(-90 50 50)"
                        style={{ transition: "stroke-dasharray 1s ease" }}
                      />
                    </svg>
                    <span className="absolute text-lg font-bold">
                      <NumberTicker value={winner.totalScore} />%
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{t("matchScore")}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="p-0">
                <ScoreBreakdown scores={winner.scores} />
              </TooltipContent>
            </Tooltip>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Trophy className="size-5 text-amber-500 shrink-0" />
                <h2 className="text-xl md:text-2xl font-bold">{t("winnerTitle")}</h2>
              </div>
              <p className="text-lg font-semibold" dir="ltr">
                {winner.stroller.flag} {winner.stroller.brand} {winner.stroller.model}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={cn("text-xs rounded-full", getGradeColor(winner.stroller.grade))}>
                  {winner.stroller.grade}
                </Badge>
                {winner.stroller.price > 0 && (
                  <Badge variant="secondary" className="text-xs rounded-full">
                    ₪{winner.stroller.price.toLocaleString()}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {winner.wins.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                {t("winnerBecause")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {winner.wins.map((w) => (
                  <Badge key={w.text} variant="outline" className="text-xs rounded-full bg-primary/5 text-primary border-primary/20 dark:bg-primary/10">
                    {isHe ? w.textHe : w.text}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {winner.warnings.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="size-4 text-amber-500" />
                {t("tradeoffs")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {winner.warnings.map((w) => (
                  <Badge key={w.text} variant="outline" className="text-xs rounded-full bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800">
                    {isHe ? w.textHe : w.text}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-6 opacity-40" />

          <div className="flex flex-wrap gap-3">
            {winner.stroller.buyLinks && winner.stroller.buyLinks.length > 0 && (
              <div className="space-y-2 w-full">
                <h3 className="text-sm font-semibold">{t("buyLinks")}</h3>
                <div className="flex flex-wrap gap-2">
                  {winner.stroller.buyLinks.map((link) => (
                    <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                        <ExternalLink className="size-3" />
                        {link.store} — {link.price}
                      </Button>
                    </a>
                  ))}
                </div>
              </div>
            )}
            {winner.stroller.videoUrl && (
              <a href={winner.stroller.videoUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                  <Play className="size-3" />
                  {t("watchVideo")}
                </Button>
              </a>
            )}
          </div>
        </div>
      </BlurFade>

      {alternatives.length > 0 && (
        <BlurFade delay={0.2}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("alternatives")}</h3>
            <div className="space-y-3">
              {alternatives.map((alt, i) => (
                <BlurFade key={`${alt.stroller.brand}-${alt.stroller.model}`} delay={0.3 + i * 0.1}>
                  <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-baby hover:shadow-baby-hover transition-all">
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex flex-col items-center gap-0.5 shrink-0 cursor-help">
                          <span className="text-lg font-bold text-primary">{alt.totalScore}%</span>
                          <span className="text-[10px] text-muted-foreground">{t("matchScore")}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="p-0">
                        <ScoreBreakdown scores={alt.scores} />
                      </TooltipContent>
                    </Tooltip>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate" dir="ltr">
                        {alt.stroller.flag} {alt.stroller.brand} {alt.stroller.model}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="outline" className={cn("text-xs rounded-full", getGradeColor(alt.stroller.grade))}>
                          {alt.stroller.grade}
                        </Badge>
                        {alt.stroller.price > 0 && (
                          <span className="text-xs text-muted-foreground">₪{alt.stroller.price.toLocaleString()}</span>
                        )}
                      </div>
                      {alt.wins.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          <span className="text-xs text-muted-foreground">{t("altBetter")}</span>
                          {alt.wins.slice(0, 3).map((w) => (
                            <Badge key={w.text} variant="outline" className="text-[10px] h-4 rounded-full">
                              {isHe ? w.textHe : w.text}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </BlurFade>
      )}

      {discoveries.length > 0 && (
        <BlurFade delay={0.4}>
          <div className="space-y-4 rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/30 dark:border-pink-800/40 dark:bg-pink-950/10 p-5">
            <div>
              <h3 className="text-lg font-bold text-pink-800 dark:text-pink-300">💎 {t("discoveriesTitle")}</h3>
              <p className="text-sm text-pink-600 dark:text-pink-400">{t("discoveriesSubtitle")}</p>
            </div>
            <div className="space-y-3">
              {discoveries.map((disc, i) => (
                <BlurFade key={`${disc.stroller.brand}-${disc.stroller.model}`} delay={0.5 + i * 0.1}>
                  <div className="flex items-center gap-4 rounded-2xl border border-pink-200 bg-card dark:border-pink-800/40 p-4">
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex flex-col items-center gap-0.5 shrink-0 cursor-help">
                          <span className="text-lg font-bold text-primary">{disc.totalScore}%</span>
                          <span className="text-[10px] text-muted-foreground">{t("matchScore")}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="p-0">
                        <ScoreBreakdown scores={disc.scores} />
                      </TooltipContent>
                    </Tooltip>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate" dir="ltr">
                        {disc.stroller.flag} {disc.stroller.brand} {disc.stroller.model}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="outline" className={cn("text-xs rounded-full", getGradeColor(disc.stroller.grade))}>
                          {disc.stroller.grade}
                        </Badge>
                        {disc.stroller.price > 0 && (
                          <span className="text-xs text-muted-foreground">₪{disc.stroller.price.toLocaleString()}</span>
                        )}
                        {disc.totalScore > (results[0]?.totalScore ?? 0) && (
                          <Badge className="text-[10px] bg-pink-200 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200 rounded-full">{t("discoveriesBetter")}</Badge>
                        )}
                      </div>
                      {disc.wins.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {disc.wins.slice(0, 3).map((w) => (
                            <Badge key={w.text} variant="outline" className="text-[10px] h-4 rounded-full bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/30 dark:text-pink-300 dark:border-pink-800">
                              {isHe ? w.textHe : w.text}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </BlurFade>
      )}

      <BlurFade delay={0.5}>
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <ShimmerButton
            onClick={handleShare}
            shimmerColor="#c4b5fd"
            background="oklch(75% 0.12 280 / 90%)"
            className="h-12 text-sm font-semibold gap-2 flex-1 rounded-full"
          >
            <Share2 className="size-4" />
            {t("share")}
          </ShimmerButton>

          <Button variant="outline" onClick={onStartOver} size="lg" className="h-12 gap-2 rounded-full">
            <RotateCcw className="size-4" />
            {t("startOver")}
          </Button>

          <Button
            variant="ghost"
            onClick={handleSeeAll}
            size="lg"
            className="h-12 gap-2 rounded-full"
          >
            {t("seeAll")}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </BlurFade>
    </div>
  );
}
