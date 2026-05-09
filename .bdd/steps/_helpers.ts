import type { Page } from "@playwright/test";

export const SLUG_BY_NAME: Record<string, string> = {
  "Cybex Priam 5": "cybex-priam-5",
  "Bugaboo Fox 5 Renew": "bugaboo-fox-5-renew",
  "Sport Line ALIX 2026": "sport-line-alix-2026",
  "Sport Line SLIDE 2026": "sport-line-slide-2026",
  "Sport Line Cielo XL 2025": "sport-line-cielo-xl-2025",
  "Bugaboo Donkey 6": "bugaboo-donkey-6",
  "Joolz Aer²": "joolz-aer2",
  "Joolz Day5": "joolz-day5",
  "Baby Jogger City Mini GT2": "baby-jogger-city-mini-gt2",
};

export function slugFor(name: string): string {
  const slug = SLUG_BY_NAME[name];
  if (!slug) {
    throw new Error(
      `No slug mapping for "${name}" in .bdd/steps/_helpers.ts. Add it to SLUG_BY_NAME.`,
    );
  }
  return slug;
}

export const COMPARE_STORAGE_KEY = "stroller-compare-selection";

export const testIds = {
  strollerCard: (slug: string) => `stroller-card-${slug}`,
  compareCheckbox: (slug: string) => `compare-checkbox-${slug}`,
  compareDrawer: "compare-drawer",
  compareDrawerCount: "compare-drawer-count",
  compareDrawerCompareBtn: "compare-drawer-compare-button",
  compareDrawerClearBtn: "compare-drawer-clear-button",
  compareToast: "compare-toast",
  compareTable: "compare-table",
  compareColumnHeader: (slug: string) => `compare-column-header-${slug}`,
  compareColumnRemove: (slug: string) => `compare-column-remove-${slug}`,
  compareRow: (rowKey: string) => `compare-row-${rowKey}`,
  compareCell: (rowKey: string, slug: string) =>
    `compare-cell-${rowKey}-${slug}`,
  compareEmptyState: "compare-empty-state",
  compareEmptyStateBanner: "compare-empty-state-banner",
  compareSearchInput: "compare-search-input",
  compareSearchSuggestion: (slug: string) =>
    `compare-search-suggestion-${slug}`,
  compareNotice: "compare-notice",
};

export async function setLocalStorageSelection(
  page: Page,
  slugs: string[],
): Promise<void> {
  await page.addInitScript(
    (args: { k: string; v: string }) => {
      window.localStorage.setItem(args.k, args.v);
    },
    { k: COMPARE_STORAGE_KEY, v: JSON.stringify(slugs) },
  );
}

export async function clearLocalStorageSelection(page: Page): Promise<void> {
  await page.addInitScript((key: string) => {
    window.localStorage.removeItem(key);
  }, COMPARE_STORAGE_KEY);
}

export async function readLocalStorageSelection(
  page: Page,
): Promise<string[]> {
  const raw = await page.evaluate(
    (key) => localStorage.getItem(key),
    COMPARE_STORAGE_KEY,
  );
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
