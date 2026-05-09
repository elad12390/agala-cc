import type { Stroller } from "@/data/strollers";

export type CompareRowKey =
  | "price"
  | "weight"
  | "wheels"
  | "bassinet"
  | "terrain"
  | "fold"
  | "sun"
  | "style"
  | "grade"
  | "notes"
  | "gradeReason";

export type CompareDirection = "lower" | "higher" | "boolean" | "none";

export const ROW_DIRECTION: Record<CompareRowKey, CompareDirection> = {
  price: "lower",
  weight: "lower",
  terrain: "higher",
  fold: "higher",
  sun: "higher",
  style: "higher",
  bassinet: "boolean",
  wheels: "none",
  grade: "none",
  notes: "none",
  gradeReason: "none",
};

export function parseFirstNumber(input: string): number | null {
  if (!input) return null;
  const match = input.match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const value = Number.parseFloat(match[0]);
  return Number.isFinite(value) ? value : null;
}

export function rowValueOf(stroller: Stroller, rowKey: CompareRowKey): unknown {
  switch (rowKey) {
    case "price":
      return stroller.price;
    case "weight":
      return parseFirstNumber(stroller.weight);
    case "wheels":
      return stroller.wheels;
    case "bassinet":
      return stroller.bassinet;
    case "terrain":
      return stroller.terrainScore;
    case "fold":
      return stroller.foldScore;
    case "sun":
      return stroller.sunScore;
    case "style":
      return stroller.styleScore;
    case "grade":
      return stroller.grade;
    case "notes":
      return stroller.notes;
    case "gradeReason":
      return stroller.gradeReason;
  }
}

export function bestStrollerSlugsForRow(
  rowKey: CompareRowKey,
  strollers: Stroller[],
  slugOf: (s: Stroller) => string,
): Set<string> {
  const direction = ROW_DIRECTION[rowKey];
  if (direction === "none") return new Set();

  if (direction === "boolean") {
    const trueOnes = strollers.filter((s) => rowValueOf(s, rowKey) === true);
    if (trueOnes.length === 0) return new Set();
    return new Set(trueOnes.map(slugOf));
  }

  const numeric: { slug: string; value: number }[] = [];
  for (const s of strollers) {
    const v = rowValueOf(s, rowKey);
    if (typeof v === "number" && Number.isFinite(v)) {
      numeric.push({ slug: slugOf(s), value: v });
    }
  }
  if (numeric.length < 2) return new Set();

  const best =
    direction === "lower"
      ? Math.min(...numeric.map((n) => n.value))
      : Math.max(...numeric.map((n) => n.value));

  return new Set(numeric.filter((n) => n.value === best).map((n) => n.slug));
}
