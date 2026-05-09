"use client";

import { useState, useMemo, Suspense } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { ExternalLink, Play, ChevronDown, ChevronUp } from "lucide-react";
import { strollers } from "@/data/strollers";
import { gradeToNumber, getGradeColor } from "@/lib/grades";
import { scoreStrollers, type ScoredStroller } from "@/lib/scoring";
import { decodePreferences } from "@/lib/url-params";
import { ScoreBreakdown } from "@/components/matcher/ScoreBreakdown";
import { CompareCheckbox } from "@/components/compare/CompareCheckbox";
import { CompareDrawer } from "@/components/compare/CompareDrawer";
import { slugOf } from "@/lib/compare/dataset";
import { MagicCard } from "@/components/ui/magic-card";
import { ShineBorder } from "@/components/ui/shine-border";
import { BlurFade } from "@/components/ui/blur-fade";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { FilterBar, type SortKey, type Origin } from "./FilterBar";

function StrollerGridInner() {
  const t = useTranslations();
  const locale = useLocale();
  const isHe = locale === "he";
  const searchParams = useSearchParams();

  const prefs = useMemo(() => decodePreferences(searchParams), [searchParams]);

  const matchData = useMemo(() => {
    if (!prefs) return null;
    const scored = scoreStrollers(strollers, prefs);
    const map = new Map<string, ScoredStroller>();
    for (const s of scored) {
      map.set(`${s.stroller.brand}-${s.stroller.model}`, s);
    }
    return map;
  }, [prefs]);

  const hasMatchScores = matchData !== null;

  const [search, setSearch] = useState("");
  const [bigWheels, setBigWheels] = useState(false);
  const [bassinet, setBassinet] = useState(false);
  const [recommended, setRecommended] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [origins, setOrigins] = useState<Origin[]>([]);
  const [sort, setSort] = useState<SortKey>(hasMatchScores ? "match" : "grade");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleOrigin = (o: Origin) => {
    setOrigins((prev) =>
      prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]
    );
  };

  const filtered = useMemo(() => {
    let result = [...strollers];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.brand.toLowerCase().includes(q) ||
          s.model.toLowerCase().includes(q) ||
          s.notes.toLowerCase().includes(q) ||
          s.notesHe.toLowerCase().includes(q) ||
          s.wheels.toLowerCase().includes(q) ||
          s.wheelsHe.toLowerCase().includes(q) ||
          s.gradeReason.toLowerCase().includes(q) ||
          s.gradeReasonHe.toLowerCase().includes(q) ||
          s.type.toLowerCase().includes(q)
      );
    }
    if (bigWheels) result = result.filter((s) => s.wheelsBig);
    if (bassinet) result = result.filter((s) => s.bassinet);
    if (recommended) result = result.filter((s) => s.recommended);
    if (isNew) result = result.filter((s) => s.isNew);
    if (onSale) result = result.filter((s) => s.onSale);
    if (origins.length > 0) result = result.filter((s) => origins.includes(s.origin));

    result.sort((a, b) => {
      switch (sort) {
        case "match": {
          if (!matchData) return 0;
          return (matchData.get(`${b.brand}-${b.model}`)?.totalScore ?? 0) - (matchData.get(`${a.brand}-${a.model}`)?.totalScore ?? 0);
        }
        case "priceAsc":
          return (a.price || 99999) - (b.price || 99999);
        case "priceDesc":
          return (b.price || 0) - (a.price || 0);
        case "grade":
          return gradeToNumber(a.grade) - gradeToNumber(b.grade);
        case "brand":
          return a.brand.localeCompare(b.brand);
        case "name":
          return a.model.localeCompare(b.model);
        case "type":
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return result;
  }, [search, bigWheels, bassinet, recommended, isNew, onSale, origins, sort, matchData]);

  return (
    <section id="compare" className="w-full max-w-7xl mx-auto px-4 py-16 md:py-24">
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        bigWheels={bigWheels}
        onBigWheelsToggle={() => setBigWheels((v) => !v)}
        bassinet={bassinet}
        onBassinetToggle={() => setBassinet((v) => !v)}
        recommended={recommended}
        onRecommendedToggle={() => setRecommended((v) => !v)}
        isNew={isNew}
        onNewToggle={() => setIsNew((v) => !v)}
        onSale={onSale}
        onSaleToggle={() => setOnSale((v) => !v)}
        origins={origins}
        onOriginToggle={toggleOrigin}
        sort={sort}
        onSortChange={setSort}
        count={filtered.length}
        total={strollers.length}
        hasMatchScores={hasMatchScores}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filtered.map((s, i) => {
          const id = `${s.brand}-${s.model}`;
          const isExpanded = expandedId === id;
          const match = matchData?.get(id);

          const slug = slugOf(s);

          return (
            <BlurFade key={id} delay={0.02 * Math.min(i, 20)} inView>
              <div
                className="relative h-full rounded-2xl"
                data-testid={`stroller-card-${slug}`}
              >
                {s.recommended && (
                  <ShineBorder
                    shineColor={["#c4b5fd", "#f9a8d4", "#c4b5fd"]}
                    borderWidth={2}
                    duration={10}
                  />
                )}
                <MagicCard className="h-full rounded-2xl shadow-baby hover:shadow-baby-hover transition-all duration-300 hover:-translate-y-0.5" gradientColor="oklch(92% 0.04 330)" gradientOpacity={0.12}>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <CompareCheckbox slug={slug} />
                        <p className="text-sm text-muted-foreground font-medium">
                          {s.flag} {s.brand}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {match !== undefined && (
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 cursor-help">
                                {match.totalScore}% {isHe ? "התאמה" : "match"}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="p-0">
                              <ScoreBreakdown scores={match.scores} />
                            </TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger>
                            <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border ${getGradeColor(s.grade)}`}>
                              {s.grade}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-sm text-start text-sm p-3">
                            <p>{isHe ? s.gradeReasonHe : s.gradeReason}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    <h3 className="font-bold text-xl leading-tight" dir="ltr">
                      {s.model}
                    </h3>

                    <div dir="ltr">
                      <span className="text-2xl font-bold text-primary">
                        {s.price > 0 ? `₪${s.price.toLocaleString()}` : t("common.priceNotAvailable")}
                      </span>
                      {s.price > 0 && s.priceMax > s.price && (
                        <span className="text-sm text-muted-foreground ms-2">
                          – ₪{s.priceMax.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary" className="text-xs px-2.5 py-0.5 h-auto rounded-full">
                        {t(`types.${s.type}`)}
                      </Badge>
                      {s.recommended && (
                        <Badge variant="default" className="text-xs px-2.5 py-0.5 h-auto rounded-full bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/40 dark:text-pink-300 dark:border-pink-800">
                          ⭐ {t("badges.recommended")}
                        </Badge>
                      )}
                      {s.isNew && (
                        <AnimatedShinyText className="text-xs font-semibold px-2 py-0.5" shimmerWidth={80}>
                          🆕 {t("badges.new")}
                        </AnimatedShinyText>
                      )}
                      {s.onSale && (
                        <Badge variant="destructive" className="text-xs px-2.5 py-0.5 h-auto rounded-full">
                          🏷️ {t("badges.sale")}
                        </Badge>
                      )}
                      {s.bassinet && (
                        <Badge variant="outline" className="text-xs px-2.5 py-0.5 h-auto rounded-full">
                          🛏️ {t("common.bassinetIncluded")}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">⚖️ {t("table.weight")}:</span>
                        <span dir="ltr">{s.weight}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium shrink-0">🛞 {t("table.wheels")}:</span>
                        <span>{isHe ? s.wheelsHe : s.wheels}</span>
                      </div>
                      {s.notes && (
                        <div className="flex items-start gap-2 text-muted-foreground">
                          <span className="font-medium shrink-0">📝</span>
                          <span>{isHe ? s.notesHe : s.notes}</span>
                        </div>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="space-y-3 pt-3 border-t border-border/50">
                        <div>
                          <p className="text-sm font-semibold mb-1">{t("grades.label")}:</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {isHe ? s.gradeReasonHe : s.gradeReason}
                          </p>
                        </div>
                        {!s.bassinet && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5 h-auto opacity-60 rounded-full">
                            🚫 {t("common.bassinetSeparate")}
                          </Badge>
                        )}
                        {s.buyLinks && s.buyLinks.length > 0 && (
                          <div className="space-y-1.5">
                            <p className="text-sm font-semibold">{t("common.buyLinks")}:</p>
                            {s.buyLinks.map((link) => (
                              <a
                                key={link.url}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                              >
                                <ExternalLink className="size-3.5" />
                                {link.store} — {link.price}
                              </a>
                            ))}
                          </div>
                        )}
                        {s.videoUrl && (
                          <a
                            href={s.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-red-500 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                          >
                            <Play className="size-3.5" />
                            {t("common.watchVideo")}
                          </a>
                        )}
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full h-9 text-sm rounded-full"
                      onClick={() => setExpandedId(isExpanded ? null : id)}
                    >
                      {isExpanded ? (
                        <>
                          {t("common.lessDetails")}
                          <ChevronUp className="ms-2 size-4" />
                        </>
                      ) : (
                        <>
                          {t("common.moreDetails")}
                          <ChevronDown className="ms-2 size-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </MagicCard>
              </div>
            </BlurFade>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-3xl">🔍</p>
          <p className="text-sm text-muted-foreground mt-3">{t("filters.showing", { count: 0, total: strollers.length })}</p>
        </div>
      )}

      <CompareDrawer />
    </section>
  );
}

export function StrollerGrid() {
  return (
    <Suspense fallback={<div className="w-full max-w-7xl mx-auto px-4 py-16 text-center text-muted-foreground">...</div>}>
      <StrollerGridInner />
    </Suspense>
  );
}
