"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Stroller } from "@/data/strollers";
import { slugOf } from "@/lib/compare/dataset";
import {
  bestStrollerSlugsForRow,
  type CompareRowKey,
} from "@/lib/compare/best-in-row";
import { cn } from "@/lib/utils";

const ROW_KEYS: CompareRowKey[] = [
  "price",
  "weight",
  "wheels",
  "bassinet",
  "terrain",
  "fold",
  "sun",
  "style",
  "grade",
  "notes",
  "gradeReason",
];

interface CompareTableProps {
  strollers: Stroller[];
  onRemove: (slug: string) => void;
}

export function CompareTable({ strollers, onRemove }: CompareTableProps) {
  const t = useTranslations("compare");

  return (
    <div
      data-testid="compare-table"
      className="relative w-full overflow-x-auto rounded-xl border bg-card shadow-sm"
    >
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th
              scope="col"
              data-sticky="true"
              className="sticky start-0 z-10 bg-card border-b border-e px-4 py-3 text-start text-xs uppercase tracking-wide text-muted-foreground min-w-32"
              aria-label="spec"
            />

            {strollers.map((s) => {
              const slug = slugOf(s);
              return (
                <th
                  key={slug}
                  scope="col"
                  data-testid={`compare-column-header-${slug}`}
                  className="border-b px-4 py-3 text-start min-w-56"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="text-base font-semibold leading-tight">
                        {s.brand} {s.model}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {s.flag} {s.type}
                      </div>
                    </div>
                    <button
                      type="button"
                      data-testid={`compare-column-remove-${slug}`}
                      onClick={() => onRemove(slug)}
                      aria-label={t("page.removeColumn")}
                      className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <X className="size-4" aria-hidden />
                    </button>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {ROW_KEYS.map((rowKey) => {
            const bestSlugs = bestStrollerSlugsForRow(rowKey, strollers, slugOf);
            return (
              <tr
                key={rowKey}
                data-testid={`compare-row-${rowKey}`}
                className="border-b last:border-b-0"
              >
                <th
                  scope="row"
                  data-sticky="true"
                  className="sticky start-0 z-10 bg-card border-e px-4 py-3 text-start font-medium text-sm align-top min-w-32"
                >
                  {t(`rows.${rowKey}` as never)}
                </th>
                {strollers.map((s) => {
                  const slug = slugOf(s);
                  const isBest = bestSlugs.has(slug);
                  return (
                    <td
                      key={slug}
                      data-testid={`compare-cell-${rowKey}-${slug}`}
                      data-best={isBest ? "true" : "false"}
                      className={cn(
                        "px-4 py-3 align-top text-sm",
                        isBest &&
                          "bg-primary/10 text-foreground font-semibold",
                      )}
                    >
                      <CellValue stroller={s} rowKey={rowKey} />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CellValue({
  stroller,
  rowKey,
}: {
  stroller: Stroller;
  rowKey: CompareRowKey;
}) {
  const t = useTranslations("compare.values");

  switch (rowKey) {
    case "price": {
      const min = stroller.price;
      const max = stroller.priceMax;
      if (min === 0 && max === 0) return <>—</>;
      const maxSuffix = max && max !== min ? `-${max}` : "";
      return <>₪{min}{maxSuffix}</>;
    }
    case "weight":
      return <>{stroller.weight}</>;
    case "wheels":
      return <>{stroller.wheelsHe || stroller.wheels}</>;
    case "bassinet":
      return <>{stroller.bassinet ? t("bassinetTrue") : t("bassinetFalse")}</>;
    case "terrain":
      return <>{stroller.terrainScore} / 10</>;
    case "fold":
      return <>{stroller.foldScore} / 10</>;
    case "sun":
      return <>{stroller.sunScore} / 10</>;
    case "style":
      return <>{stroller.styleScore} / 10</>;
    case "grade":
      return <>{stroller.grade}</>;
    case "notes":
      return <>{stroller.notesHe || stroller.notes}</>;
    case "gradeReason":
      return <>{stroller.gradeReasonHe || stroller.gradeReason}</>;
  }
}

