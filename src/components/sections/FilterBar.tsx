"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortKey = "brand" | "priceAsc" | "priceDesc" | "grade" | "name" | "type" | "match";
export type Origin = "Israeli" | "Italian" | "European" | "Other";

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  bigWheels: boolean;
  onBigWheelsToggle: () => void;
  bassinet: boolean;
  onBassinetToggle: () => void;
  recommended: boolean;
  onRecommendedToggle: () => void;
  isNew: boolean;
  onNewToggle: () => void;
  onSale: boolean;
  onSaleToggle: () => void;
  origins: Origin[];
  onOriginToggle: (o: Origin) => void;
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
  count: number;
  total: number;
  hasMatchScores?: boolean;
}

const originColors: Record<Origin, string> = {
  Israeli: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800",
  Italian: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/40 dark:text-pink-300 dark:border-pink-800",
  European: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-800",
  Other: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800",
};

export function FilterBar({
  search,
  onSearchChange,
  bigWheels,
  onBigWheelsToggle,
  bassinet,
  onBassinetToggle,
  recommended,
  onRecommendedToggle,
  isNew,
  onNewToggle,
  onSale,
  onSaleToggle,
  origins,
  onOriginToggle,
  sort,
  onSortChange,
  count,
  total,
  hasMatchScores = false,
}: FilterBarProps) {
  const t = useTranslations("filters");
  const tOrigins = useTranslations("origins");

  const allOrigins: Origin[] = ["Israeli", "Italian", "European", "Other"];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("search")}
          className="ps-10 h-11 rounded-full border-border/60 bg-card"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <ToggleBadge active={bigWheels} onClick={onBigWheelsToggle}>
          🛞 {t("bigWheels")}
        </ToggleBadge>
        <ToggleBadge active={bassinet} onClick={onBassinetToggle}>
          🛏️ {t("bassinet")}
        </ToggleBadge>
        <ToggleBadge active={recommended} onClick={onRecommendedToggle}>
          ⭐ {t("recommended")}
        </ToggleBadge>
        <ToggleBadge active={isNew} onClick={onNewToggle}>
          🆕 {t("new")}
        </ToggleBadge>
        <ToggleBadge active={onSale} onClick={onSaleToggle}>
          🏷️ {t("onSale")}
        </ToggleBadge>
      </div>

      <div className="flex flex-wrap gap-2">
        {allOrigins.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onOriginToggle(o)}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-full"
          >
            <Badge
              variant="outline"
              className={`cursor-pointer text-sm px-3.5 py-1.5 h-auto rounded-full transition-all ${
                origins.includes(o)
                  ? originColors[o]
                  : "hover:bg-muted/50"
              }`}
            >
              {tOrigins(o)}
            </Badge>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {t("showing", { count, total })}
        </p>
        <Select value={sort} onValueChange={(v) => onSortChange(v as SortKey)}>
          <SelectTrigger className="h-10 text-sm w-auto min-w-[160px] rounded-full">
            <SelectValue>{t(`sortOptions.${sort}`)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {hasMatchScores && (
              <SelectItem value="match">{t("sortOptions.match")}</SelectItem>
            )}
            <SelectItem value="grade">{t("sortOptions.grade")}</SelectItem>
            <SelectItem value="priceAsc">{t("sortOptions.priceAsc")}</SelectItem>
            <SelectItem value="priceDesc">{t("sortOptions.priceDesc")}</SelectItem>
            <SelectItem value="brand">{t("sortOptions.brand")}</SelectItem>
            <SelectItem value="name">{t("sortOptions.name")}</SelectItem>
            <SelectItem value="type">{t("sortOptions.type")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function ToggleBadge({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-full">
      <Badge
        variant={active ? "default" : "outline"}
        className={`cursor-pointer text-sm px-3.5 py-1.5 h-auto rounded-full transition-all ${
          active ? "bg-primary/90 hover:bg-primary" : "hover:bg-secondary"
        }`}
      >
        {children}
      </Badge>
    </button>
  );
}
