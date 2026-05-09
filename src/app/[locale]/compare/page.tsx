import { setRequestLocale } from "next-intl/server";
import { resolveSlugs } from "@/lib/compare/dataset";
import { COMPARE_MAX } from "@/lib/compare/constants";
import { CompareEmptyState } from "@/components/compare/CompareEmptyState";
import { CompareView } from "@/components/compare/CompareView";

export default async function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ids?: string }>;
}) {
  const { locale } = await params;
  const { ids } = await searchParams;
  setRequestLocale(locale);

  const requested = (ids ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const overflow = requested.length > COMPARE_MAX;
  const capped = requested.slice(0, COMPARE_MAX);
  const { found, missing } = resolveSlugs(capped);

  if (found.length === 0) {
    return <CompareEmptyState hadInvalidIds={requested.length > 0} />;
  }

  return (
    <CompareView
      strollers={found}
      missingCount={missing.length}
      overflow={overflow}
    />
  );
}
