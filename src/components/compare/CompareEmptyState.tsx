"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { CompareSearch } from "./CompareSearch";

interface CompareEmptyStateProps {
  hadInvalidIds: boolean;
}

export function CompareEmptyState({ hadInvalidIds }: CompareEmptyStateProps) {
  const t = useTranslations("compare.empty");
  const locale = useLocale();
  const router = useRouter();

  return (
    <main
      data-testid="compare-empty-state"
      className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 text-center gap-6"
    >
      <div className="space-y-2 max-w-xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {t("heading")}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          {t("subtitle")}
        </p>
      </div>

      {hadInvalidIds && (
        <div
          data-testid="compare-empty-state-banner"
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 text-destructive px-4 py-2 text-sm"
        >
          {t("bannerNoneFound")}
        </div>
      )}

      <div className="w-full">
        <CompareSearch
          variant="empty"
          onPick={(slug) =>
            router.push(`/${locale}/compare?ids=${slug}`)
          }
        />
      </div>

      <Link
        href={`/${locale}/all`}
        className="text-sm text-primary underline-offset-4 hover:underline"
      >
        {t("browseAll")}
      </Link>
    </main>
  );
}
