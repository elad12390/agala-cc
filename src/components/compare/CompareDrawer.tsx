"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCompareSelection } from "@/lib/compare/selection-store";
import { cn } from "@/lib/utils";
import { CompareToast } from "./CompareToast";

export function CompareDrawer() {
  const t = useTranslations("compare.drawer");
  const locale = useLocale();
  const isHe = locale === "he";
  const { count, slugs, clear, attemptedOverflow } = useCompareSelection();

  if (count === 0) return null;

  const compareDisabled = count < 2;
  const href = `/${locale}/compare?ids=${slugs.join(",")}`;
  const countLabel =
    count === 1 ? t("countOne") : t("countMany", { count });

  return (
    <>
      <CompareToast trigger={attemptedOverflow} />
      <div
        data-testid="compare-drawer"
        role="region"
        aria-label="Compare selection"
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur-sm shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            data-testid="compare-drawer-clear-button"
            onClick={() => clear()}
            aria-label={t("clearCta")}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" aria-hidden />
            <span className="hidden sm:inline">{t("clearCta")}</span>
          </button>

          <div
            data-testid="compare-drawer-count"
            className="flex-1 text-center text-sm font-medium"
          >
            {countLabel}
          </div>

          {compareDisabled ? (
            <Tooltip>
              <TooltipTrigger>
                <button
                  type="button"
                  data-testid="compare-drawer-compare-button"
                  aria-disabled="true"
                  aria-label={t("tooltipMin")}
                  onClick={(e) => e.preventDefault()}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "rounded-full px-5 h-10 gap-2 opacity-50 cursor-not-allowed",
                  )}
                >
                  <span>{t("compareCta")}</span>
                  <ArrowRight
                    className={`size-4 ${isHe ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>{t("tooltipMin")}</TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href={href}
              data-testid="compare-drawer-compare-button"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full px-5 h-10 gap-2",
              )}
            >
              <span>{t("compareCta")}</span>
              <ArrowRight
                className={`size-4 ${isHe ? "rotate-180" : ""}`}
                aria-hidden
              />
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
