"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Search, X } from "lucide-react";
import { strollers, type Stroller } from "@/data/strollers";
import { getGradeColor } from "@/lib/grades";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";

interface StrollerSearchProps {
  selected: Stroller[];
  onSelect: (strollers: Stroller[]) => void;
  onNext: () => void;
}

export function StrollerSearch({ selected, onSelect, onNext }: StrollerSearchProps) {
  const t = useTranslations("matcher.step1");
  const locale = useLocale();
  const isHe = locale === "he";
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return strollers
      .filter(
        (s) =>
          !selected.some((sel) => sel.brand === s.brand && sel.model === s.model) &&
          (s.brand.toLowerCase().includes(q) ||
            s.model.toLowerCase().includes(q) ||
            `${s.brand} ${s.model}`.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [query, selected]);

  const addStroller = (s: Stroller) => {
    if (selected.length < 4) {
      onSelect([...selected, s]);
    }
    setQuery("");
    setIsOpen(false);
  };

  const removeStroller = (s: Stroller) => {
    onSelect(selected.filter((sel) => !(sel.brand === s.brand && sel.model === s.model)));
  };

  const canProceed = selected.length >= 2;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("title")} 🔍</h2>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => query.trim() && setIsOpen(true)}
            placeholder={t("placeholder")}
            className="h-12 ps-10 text-base rounded-full border-border/60 bg-card"
            disabled={selected.length >= 4}
          />
        </div>

        {isOpen && filtered.length > 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-2xl border border-border/60 bg-card shadow-baby-hover overflow-hidden">
            {filtered.map((s) => (
              <button
                type="button"
                key={`${s.brand}-${s.model}`}
                onClick={() => addStroller(s)}
                className="flex w-full items-center gap-3 px-4 py-3 text-start hover:bg-secondary/50 transition-colors"
              >
                <span className="text-lg">{s.flag}</span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium" dir="ltr">{s.brand} {s.model}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className={cn("text-xs rounded-full", getGradeColor(s.grade))}>
                      {s.grade}
                    </Badge>
                    {s.price > 0 && (
                      <span className="text-xs text-muted-foreground">₪{s.price.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {t("selected")}: {selected.length}/4
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {selected.map((s, i) => (
              <BlurFade key={`${s.brand}-${s.model}`} delay={i * 0.1}>
                <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-baby">
                  <span className="text-2xl">{s.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate" dir="ltr">{s.brand} {s.model}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={cn("text-xs rounded-full", getGradeColor(s.grade))}>
                        {s.grade}
                      </Badge>
                      {s.price > 0 && (
                        <span className="text-xs text-muted-foreground">₪{s.price.toLocaleString()}</span>
                      )}
                      <span className="text-xs text-muted-foreground">{isHe ? s.wheelsHe : s.wheels}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => removeStroller(s)}
                    aria-label={t("remove")}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-2 pt-4">
        {!canProceed && selected.length > 0 && (
          <p className="text-sm text-muted-foreground">{t("min")}</p>
        )}
        <Button
          onClick={onNext}
          disabled={!canProceed}
          size="lg"
          className="w-full sm:w-auto min-w-[200px] h-12 text-base rounded-full"
        >
          {t("next")} ✨
        </Button>
      </div>
    </div>
  );
}
