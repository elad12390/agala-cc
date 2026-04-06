"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Building2, Home, TreePine, Car, Train, Footprints, Baby, CalendarHeart, Clock, ArrowUp, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";
import type { LocationType, TransportType, BabyAgeType, PriorityKey, UserPreferences } from "@/lib/scoring";

interface PreferencesFormProps {
  onBack: () => void;
  onSubmit: (prefs: UserPreferences) => void;
}

export function PreferencesForm({ onBack, onSubmit }: PreferencesFormProps) {
  const t = useTranslations("matcher.step2");

  const [budget, setBudget] = useState(3500);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [transport, setTransport] = useState<TransportType | null>(null);
  const [babyAge, setBabyAge] = useState<BabyAgeType | null>(null);
  const [priorities, setPriorities] = useState<PriorityKey[]>([
    "weight", "fold", "terrain", "sun", "style", "resale",
  ]);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...priorities];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setPriorities(next);
  };

  const canSubmit = location && transport && babyAge;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ budget, location, transport, babyAge, priorities });
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground">{t("subtitle")} ✨</p>
      </div>

      <BlurFade delay={0}>
        <div className="space-y-3">
          <span className="text-sm font-semibold block">💰 {t("budget.label")}</span>
          <div className="space-y-2">
            <input
              type="range"
              min={1000}
              max={7000}
              step={500}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-secondary accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₪1,000</span>
              <span className="font-semibold text-foreground text-lg">{t("budget.upTo")} ₪{budget.toLocaleString()}</span>
              <span>₪7,000</span>
            </div>
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.1}>
        <div className="space-y-3">
          <span className="text-sm font-semibold block">🏙️ {t("location.label")}</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <OptionCard
              selected={location === "city"}
              onClick={() => setLocation("city")}
              icon={<Building2 className="size-5" />}
              title={t("location.city")}
              description={t("location.cityDesc")}
            />
            <OptionCard
              selected={location === "suburb"}
              onClick={() => setLocation("suburb")}
              icon={<Home className="size-5" />}
              title={t("location.suburb")}
              description={t("location.suburbDesc")}
            />
            <OptionCard
              selected={location === "rural"}
              onClick={() => setLocation("rural")}
              icon={<TreePine className="size-5" />}
              title={t("location.rural")}
              description={t("location.ruralDesc")}
            />
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <div className="space-y-3">
          <span className="text-sm font-semibold block">🚌 {t("transport.label")}</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <OptionCard
              selected={transport === "car"}
              onClick={() => setTransport("car")}
              icon={<Car className="size-5" />}
              title={t("transport.car")}
              description={t("transport.carDesc")}
            />
            <OptionCard
              selected={transport === "publicTransit"}
              onClick={() => setTransport("publicTransit")}
              icon={<Train className="size-5" />}
              title={t("transport.publicTransit")}
              description={t("transport.publicTransitDesc")}
            />
            <OptionCard
              selected={transport === "walking"}
              onClick={() => setTransport("walking")}
              icon={<Footprints className="size-5" />}
              title={t("transport.walking")}
              description={t("transport.walkingDesc")}
            />
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.3}>
        <div className="space-y-3">
          <span className="text-sm font-semibold block">👶 {t("babyAge.label")}</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <OptionCard
              selected={babyAge === "newborn"}
              onClick={() => setBabyAge("newborn")}
              icon={<Baby className="size-5" />}
              title={t("babyAge.newborn")}
            />
            <OptionCard
              selected={babyAge === "infant"}
              onClick={() => setBabyAge("infant")}
              icon={<Clock className="size-5" />}
              title={t("babyAge.infant")}
            />
            <OptionCard
              selected={babyAge === "planning"}
              onClick={() => setBabyAge("planning")}
              icon={<CalendarHeart className="size-5" />}
              title={t("babyAge.planning")}
            />
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.4}>
        <div className="space-y-3">
          <span className="text-sm font-semibold block">📋 {t("priorities.label")}</span>
          <div className="space-y-2">
            {priorities.map((key, i) => (
              <div
                key={key}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 transition-all hover:shadow-baby"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {i + 1}
                </span>
                <GripVertical className="size-4 text-muted-foreground/50 shrink-0" />
                <span className="flex-1 text-sm font-medium">{t(`priorities.${key}`)}</span>
                {i > 0 && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => moveUp(i)}
                    aria-label="Move up"
                  >
                    <ArrowUp className="size-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </BlurFade>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} size="lg" className="h-12 rounded-full">
          {t("back")}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          size="lg"
          className="flex-1 h-12 text-base rounded-full"
        >
          {t("showResults")} ✨
        </Button>
      </div>
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all cursor-pointer",
        selected
          ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20 shadow-baby"
          : "border-border/60 hover:border-primary/20 hover:bg-secondary/30"
      )}
    >
      <div className={cn("transition-colors", selected ? "text-primary" : "text-muted-foreground")}>
        {icon}
      </div>
      <span className={cn("text-sm font-medium", selected ? "text-foreground" : "text-foreground/80")}>
        {title}
      </span>
      {description && (
        <span className="text-xs text-muted-foreground leading-snug">{description}</span>
      )}
    </button>
  );
}
