import { strollers, type Stroller } from "@/data/strollers";
import { toSlug } from "./slug";

const slugIndex: Map<string, Stroller> = (() => {
  const map = new Map<string, Stroller>();
  for (const s of strollers) {
    const slug = toSlug(s.brand, s.model);
    if (!map.has(slug)) map.set(slug, s);
  }
  return map;
})();

export function strollerBySlug(slug: string): Stroller | undefined {
  return slugIndex.get(slug);
}

export function slugOf(stroller: Stroller): string {
  return toSlug(stroller.brand, stroller.model);
}

export function resolveSlugs(
  slugs: string[],
): { found: Stroller[]; missing: string[] } {
  const found: Stroller[] = [];
  const missing: string[] = [];
  for (const slug of slugs) {
    const s = slugIndex.get(slug);
    if (s) found.push(s);
    else missing.push(slug);
  }
  return { found, missing };
}

export function searchStrollers(query: string, limit = 8): Stroller[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return strollers
    .filter(
      (s) =>
        s.brand.toLowerCase().includes(q) ||
        s.model.toLowerCase().includes(q) ||
        `${s.brand} ${s.model}`.toLowerCase().includes(q),
    )
    .slice(0, limit);
}
