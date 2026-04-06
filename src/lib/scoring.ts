import type { Stroller } from "@/data/strollers";

export type LocationType = "city" | "suburb" | "rural";
export type TransportType = "car" | "publicTransit" | "walking";
export type BabyAgeType = "newborn" | "infant" | "planning";
export type PriorityKey = "weight" | "fold" | "terrain" | "sun" | "style" | "resale";

export interface UserPreferences {
  budget: number;
  location: LocationType;
  transport: TransportType;
  babyAge: BabyAgeType;
  priorities: PriorityKey[];
}

export interface ScoredStroller {
  stroller: Stroller;
  totalScore: number;
  scores: Record<string, { score: number; max: number; reason: string; reasonHe: string }>;
  warnings: { text: string; textHe: string }[];
  wins: { text: string; textHe: string }[];
}

const GRADE_SCORE_MAP: Record<string, number> = {
  "A+": 10,
  A: 9,
  "A-": 8,
  "B+": 7,
  B: 6,
  "B-": 5,
  "C+": 4,
  C: 3,
  "C-": 2,
  "D+": 1,
  D: 0,
  "D-": 0,
};

const GRADE_PENALTY_MAP: Record<string, number> = {
  "A+": 0,
  A: 0,
  "A-": 0,
  "B+": 0,
  B: 0,
  "B-": 2,
  "C+": 5,
  C: 8,
  "C-": 12,
  "D+": 18,
  D: 25,
  "D-": 35,
};

function computeBudgetModifier(price: number, budget: number): number {
  if (price <= 0) return 0;
  if (price <= budget) return 5;
  const overPercent = ((price - budget) / budget) * 100;
  if (overPercent < 20) return -5;
  if (overPercent < 50) return -10;
  return -20;
}

export function scoreStrollers(
  candidates: Stroller[],
  prefs: UserPreferences
): ScoredStroller[] {
  const priorityWeights: Record<string, number> = {};
  prefs.priorities.forEach((key, i) => {
    priorityWeights[key] = 6 - i;
  });

  const scored = candidates.map((s) => {
    const scores: ScoredStroller["scores"] = {};
    const warnings: ScoredStroller["warnings"] = [];
    const wins: ScoredStroller["wins"] = [];
    const gradeScore = GRADE_SCORE_MAP[s.grade] ?? 0;

    if (s.price > 0 && s.price > prefs.budget) {
      warnings.push({
        text: `Over budget by ₪${(s.price - prefs.budget).toLocaleString()}`,
        textHe: `חורגת מהתקציב ב-₪${(s.price - prefs.budget).toLocaleString()}`,
      });
    }
    if (s.price > 0 && s.price <= prefs.budget * 0.7) {
      wins.push({
        text: "Well within budget",
        textHe: "בתוך התקציב בקלות",
      });
    }

    const weightKg = parseFloat(s.weight) || 12;
    let weightScore = 0;
    if (weightKg <= 6) weightScore = 10;
    else if (weightKg <= 8) weightScore = 8;
    else if (weightKg <= 10) weightScore = 6;
    else if (weightKg <= 12) weightScore = 4;
    else weightScore = 2;

    if (prefs.location === "city" && weightKg > 11) {
      warnings.push({ text: "Heavy for apartment stairs", textHe: "כבדה למדרגות בבניין" });
    }
    if (prefs.transport === "publicTransit" && weightKg > 10) {
      warnings.push({ text: "Heavy for buses/trains", textHe: "כבדה לאוטובוסים/רכבות" });
    }
    if (weightKg <= 7) {
      wins.push({ text: "Ultra-lightweight", textHe: "קלת משקל במיוחד" });
    }
    scores.weight = { score: weightScore, max: 10, reason: `${weightKg}kg`, reasonHe: `${weightKg} ק"ג` };

    scores.fold = { score: s.foldScore, max: 10, reason: `${s.foldScore}/10`, reasonHe: `${s.foldScore}/10` };
    if (s.foldScore >= 8) {
      wins.push({ text: "One-hand compact fold", textHe: "קיפול קומפקטי ביד אחת" });
    }
    if (s.foldScore >= 9) {
      wins.push({ text: "Airplane cabin approved", textHe: "מאושרת לתא המטוס" });
    }

    scores.terrain = { score: s.terrainScore, max: 10, reason: s.wheels, reasonHe: s.wheelsHe || s.wheels };
    if (s.terrainScore >= 7) {
      wins.push({ text: "Handles rough Israeli sidewalks", textHe: "עוברת על מדרכות שבורות" });
    }
    if (s.terrainScore <= 3 && (prefs.location === "suburb" || prefs.location === "rural")) {
      warnings.push({ text: "Small wheels — may struggle on rough terrain", textHe: "גלגלים קטנים — עלולה להתקשות בשטח" });
    }

    scores.sun = { score: s.sunScore, max: 10, reason: s.sunScore >= 8 ? "UPF50+" : s.sunScore >= 6 ? "UPF50" : "Basic", reasonHe: s.sunScore >= 8 ? "UPF50+" : s.sunScore >= 6 ? "UPF50" : "בסיסית" };
    if (s.sunScore >= 8) {
      wins.push({ text: "Great sun protection for Israeli heat", textHe: "הגנה מצוינת מהשמש לקיץ הישראלי" });
    }

    scores.style = { score: s.styleScore, max: 10, reason: s.brand, reasonHe: s.brand };

    const premiumBrands = ["Bugaboo", "Cybex", "Stokke", "Mima", "Silver Cross", "iCandy", "Egg", "Joolz", "Emmaljunga"];
    const midBrands = ["Peg Perego", "Inglesina", "Chicco", "Nuna", "ABC Design", "Anex", "Maxi-Cosi"];
    let resaleScore = 4;
    if (s.brand === "Bugaboo") resaleScore = 10;
    else if (["Cybex", "Stokke", "UPPAbaby", "Nuna"].includes(s.brand)) resaleScore = 8;
    else if (premiumBrands.includes(s.brand)) resaleScore = 7;
    else if (midBrands.includes(s.brand)) resaleScore = 5;
    scores.resale = { score: resaleScore, max: 10, reason: `${resaleScore}/10`, reasonHe: `${resaleScore}/10` };

    scores.expert = {
      score: gradeScore,
      max: 10,
      reason: `Research grade: ${s.grade}`,
      reasonHe: `ציון המחקר: ${s.grade}`,
    };

    if (gradeScore >= 8) {
      wins.push({
        text: "Strong expert-rated stroller for Israeli conditions",
        textHe: "עגלה עם ציון מחקר גבוה לתנאי ישראל",
      });
    }

    if (gradeScore <= 3) {
      warnings.push({
        text: `Low expert grade (${s.grade}) for Israeli conditions`,
        textHe: `ציון מחקר נמוך (${s.grade}) לתנאי ישראל`,
      });
    }

    if (prefs.babyAge === "newborn" && !s.bassinet) {
      warnings.push({ text: "No bassinet — not suitable from birth", textHe: "ללא אמבטיה — לא מתאימה מלידה" });
    }
    if (s.bassinet && prefs.babyAge === "newborn") {
      wins.push({ text: "Bassinet included — ready from birth", textHe: "אמבטיה כלולה — מוכנה מלידה" });
    }

    let totalScore = 0;
    let maxPossible = 0;
    for (const key of prefs.priorities) {
      const weight = priorityWeights[key] || 1;
      const s_score = scores[key];
      if (s_score) {
        totalScore += s_score.score * weight;
        maxPossible += s_score.max * weight;
      }
    }

    const expertWeight = 4;
    totalScore += scores.expert.score * expertWeight;
    maxPossible += scores.expert.max * expertWeight;

    let normalizedScore = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;

    normalizedScore -= GRADE_PENALTY_MAP[s.grade] ?? 0;

    normalizedScore += computeBudgetModifier(s.price, prefs.budget);

    if (prefs.babyAge === "newborn" && !s.bassinet) {
      normalizedScore -= 15;
    }

    if ((prefs.location === "suburb" || prefs.location === "rural") && !s.wheelsBig) {
      normalizedScore -= 12;
    }

    if (prefs.transport === "publicTransit" && gradeScore <= 2) {
      normalizedScore -= 8;
    }

    normalizedScore = Math.max(0, Math.min(100, normalizedScore));

    return {
      stroller: s,
      totalScore: normalizedScore,
      scores,
      warnings,
      wins,
    };
  });

  scored.sort((a, b) => b.totalScore - a.totalScore);
  return scored;
}
