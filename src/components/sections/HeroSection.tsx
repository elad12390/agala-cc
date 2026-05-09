"use client";

import { useTranslations } from "next-intl";
import { TextAnimate } from "@/components/ui/text-animate";
import { WordRotate } from "@/components/ui/word-rotate";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { FloatingStars } from "@/components/ui/baby-decorations";

export function HeroSection() {
  const t = useTranslations("hero");

  const rotatingWords = t.raw("rotating") as string[];

  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-gradient-baby">
      <FloatingStars className="absolute inset-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
        <div className="inline-block text-5xl mb-2" aria-hidden>👶</div>

        <TextAnimate
          as="h1"
          animation="blurInUp"
          by="word"
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight"
        >
          {t("title")}
        </TextAnimate>

        <div className="flex items-center justify-center gap-2 text-lg md:text-xl text-muted-foreground">
          <WordRotate
            words={rotatingWords}
            className="font-semibold text-gradient-baby"
            duration={2000}
          />
        </div>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t("subtitle")} 💕
        </p>

        <div className="flex justify-center pt-4">
          <a href="#compare">
            <ShimmerButton
              shimmerColor="#c4b5fd"
              background="oklch(75% 0.12 280 / 90%)"
              className="text-base px-8 py-3 font-semibold h-12 rounded-full"
            >
              {t("cta")} ✨
            </ShimmerButton>
          </a>
        </div>

        <div className="grid grid-cols-3 gap-8 md:gap-12 pt-12 max-w-lg mx-auto">
          <StatBlock value={149} label={t("stats.models")} />
          <StatBlock value={40} label={t("stats.brands")} prefix="+" />
          <StatBlock value={12000} label={t("stats.reviews")} prefix="+" />
        </div>
      </div>
    </section>
  );
}

function StatBlock({ value, label, prefix }: { value: number; label: string; prefix?: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold tracking-tight text-gradient-baby">
        <NumberTicker value={value} />
        {prefix && <span>{prefix}</span>}
      </div>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
