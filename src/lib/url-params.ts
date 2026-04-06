import type { Stroller } from "@/data/strollers";
import type {
  UserPreferences,
  LocationType,
  TransportType,
  BabyAgeType,
  PriorityKey,
} from "@/lib/scoring";

const BRAND_MODEL_SEP = "__";
const STROLLER_SEP = ",";

const VALID_LOCATIONS: LocationType[] = ["city", "suburb", "rural"];
const VALID_TRANSPORTS: TransportType[] = ["car", "publicTransit", "walking"];
const VALID_BABY_AGES: BabyAgeType[] = ["newborn", "infant", "planning"];
const VALID_PRIORITIES: PriorityKey[] = [
  "weight",
  "fold",
  "terrain",
  "sun",
  "style",
  "resale",
];

export function encodeStrollers(strollers: Stroller[]): string {
  return strollers
    .map((s) => `${s.brand}${BRAND_MODEL_SEP}${s.model}`)
    .join(STROLLER_SEP);
}

export function decodeStrollers(
  param: string,
  allStrollers: Stroller[]
): Stroller[] {
  if (!param) return [];
  return param
    .split(STROLLER_SEP)
    .map((entry) => {
      const [brand, model] = entry.split(BRAND_MODEL_SEP);
      if (!brand || !model) return null;
      return allStrollers.find(
        (s) => s.brand === brand && s.model === model
      ) ?? null;
    })
    .filter((s): s is Stroller => s !== null);
}

export function encodePreferences(
  prefs: UserPreferences
): Record<string, string> {
  return {
    budget: String(prefs.budget),
    location: prefs.location,
    transport: prefs.transport,
    babyAge: prefs.babyAge,
    priorities: prefs.priorities.join(","),
  };
}

export function decodePreferences(
  params: URLSearchParams
): UserPreferences | null {
  const budget = params.get("budget");
  const location = params.get("location") as LocationType | null;
  const transport = params.get("transport") as TransportType | null;
  const babyAge = params.get("babyAge") as BabyAgeType | null;
  const prioritiesRaw = params.get("priorities");

  if (!budget || !location || !transport || !babyAge || !prioritiesRaw) {
    return null;
  }

  if (!VALID_LOCATIONS.includes(location)) return null;
  if (!VALID_TRANSPORTS.includes(transport)) return null;
  if (!VALID_BABY_AGES.includes(babyAge)) return null;

  const priorities = prioritiesRaw.split(",").filter(
    (p): p is PriorityKey => VALID_PRIORITIES.includes(p as PriorityKey)
  );

  if (priorities.length === 0) return null;

  return {
    budget: Number(budget),
    location,
    transport,
    babyAge,
    priorities,
  };
}
