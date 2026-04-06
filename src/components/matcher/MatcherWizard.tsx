"use client";

import { useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { strollers as allStrollers, type Stroller } from "@/data/strollers";
import type { UserPreferences, ScoredStroller } from "@/lib/scoring";
import { scoreStrollers } from "@/lib/scoring";
import {
  encodeStrollers,
  decodeStrollers,
  encodePreferences,
  decodePreferences,
} from "@/lib/url-params";
import { ProgressBar } from "./ProgressBar";
import { StrollerSearch } from "./StrollerSearch";
import { PreferencesForm } from "./PreferencesForm";
import { Results } from "./Results";

function MatcherWizardInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const step = Number(searchParams.get("step") || "1");
  const selected = useMemo(
    () => decodeStrollers(searchParams.get("strollers") || "", allStrollers),
    [searchParams]
  );
  const prefs = useMemo(
    () => decodePreferences(searchParams),
    [searchParams]
  );

  const { results, discoveries } = useMemo((): {
    results: ScoredStroller[];
    discoveries: ScoredStroller[];
  } => {
    if (step !== 3 || !prefs || selected.length === 0) {
      return { results: [], discoveries: [] };
    }
    const userPicks = scoreStrollers(selected, prefs);

    const selectedModels = new Set(
      selected.map((s) => `${s.brand}-${s.model}`)
    );
    const otherStrollers = allStrollers.filter(
      (s) => !selectedModels.has(`${s.brand}-${s.model}`)
    );
    const allScored = scoreStrollers(otherStrollers, prefs);
    const bestUserScore = userPicks[0]?.totalScore ?? 0;
    const topDiscoveries = allScored
      .filter((s) => s.totalScore >= bestUserScore - 10)
      .slice(0, 5);

    return { results: userPicks, discoveries: topDiscoveries };
  }, [step, prefs, selected]);

  const buildUrl = useCallback(
    (
      newStep: number,
      strollers?: Stroller[],
      preferences?: UserPreferences | null
    ) => {
      const params = new URLSearchParams();
      params.set("step", String(newStep));
      const strollersToUse = strollers ?? selected;
      if (strollersToUse.length > 0) {
        params.set("strollers", encodeStrollers(strollersToUse));
      }
      const prefsToUse = preferences === undefined ? prefs : preferences;
      if (prefsToUse) {
        const prefParams = encodePreferences(prefsToUse);
        for (const [key, value] of Object.entries(prefParams)) {
          params.set(key, value);
        }
      }
      return `?${params.toString()}`;
    },
    [selected, prefs]
  );

  const handleSelectStrollers = useCallback(
    (newSelected: Stroller[]) => {
      const params = new URLSearchParams();
      params.set("step", "1");
      if (newSelected.length > 0) {
        params.set("strollers", encodeStrollers(newSelected));
      }
      router.replace(`?${params.toString()}`);
    },
    [router]
  );

  const handleGoToStep2 = useCallback(() => {
    router.push(buildUrl(2));
  }, [router, buildUrl]);

  const handleBackToStep1 = useCallback(() => {
    router.push(buildUrl(1));
  }, [router, buildUrl]);

  const handlePreferencesSubmit = useCallback(
    (newPrefs: UserPreferences) => {
      router.push(buildUrl(3, undefined, newPrefs));
    },
    [router, buildUrl]
  );

  const handleStartOver = useCallback(() => {
    router.push("?step=1");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [router]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <ProgressBar currentStep={step} />
      <div className="py-6">
        {step === 1 && (
          <StrollerSearch
            selected={selected}
            onSelect={handleSelectStrollers}
            onNext={handleGoToStep2}
          />
        )}
        {step === 2 && (
          <PreferencesForm
            onBack={handleBackToStep1}
            onSubmit={handlePreferencesSubmit}
          />
        )}
        {step === 3 && (
          <Results
            results={results}
            discoveries={discoveries}
            onStartOver={handleStartOver}
            prefs={prefs}
          />
        )}
      </div>
    </div>
  );
}

export function MatcherWizard() {
  return (
    <Suspense fallback={<div className="w-full max-w-3xl mx-auto px-4 py-16 text-center text-muted-foreground">...</div>}>
      <MatcherWizardInner />
    </Suspense>
  );
}
