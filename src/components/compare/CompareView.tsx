"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { Stroller } from "@/data/strollers";
import { slugOf } from "@/lib/compare/dataset";
import { CompareTable } from "./CompareTable";
import { CompareSearch } from "./CompareSearch";

interface CompareViewProps {
  strollers: Stroller[];
  missingCount: number;
  overflow: boolean;
}

export function CompareView({
  strollers,
  missingCount,
  overflow,
}: CompareViewProps) {
  const t = useTranslations("compare");
  const locale = useLocale();
  const router = useRouter();

  const slugs = strollers.map(slugOf);

  const updateIds = useCallback(
    (next: string[]) => {
      const baseUrl = `/${locale}/compare`;
      const target = next.length === 0 ? baseUrl : `${baseUrl}?ids=${next.join(",")}`;
      router.replace(target, { scroll: false });
    },
    [locale, router],
  );

  const handleRemove = (slug: string) => {
    updateIds(slugs.filter((s) => s !== slug));
  };

  const handleAdd = (slug: string) => {
    if (slugs.includes(slug)) return;
    if (slugs.length >= 4) return;
    updateIds([...slugs, slug]);
  };

  const noticeText = (() => {
    if (overflow) return t("page.noticeOverflow");
    if (missingCount === 1) return t("page.noticeMissingOne");
    if (missingCount > 1) return t("page.noticeMissingMany", { count: missingCount });
    return null;
  })();

  return (
    <main className="px-4 py-6 md:py-10 space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {t("page.title")}
        </h1>
        <div className="md:w-80">
          <CompareSearch excludeSlugs={slugs} onPick={handleAdd} />
        </div>
      </header>

      {noticeText && (
        <div
          data-testid="compare-notice"
          role="status"
          className="rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 px-4 py-2 text-sm"
        >
          {noticeText}
        </div>
      )}

      <CompareTable strollers={strollers} onRemove={handleRemove} />
    </main>
  );
}
