"use client";

import { useTranslations } from "next-intl";
import { TextAnimate } from "@/components/ui/text-animate";
import { FloatingStars } from "@/components/ui/baby-decorations";

export function MatcherHero() {
  const t = useTranslations("matcher.hero");

  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-baby">
      <FloatingStars className="absolute inset-0" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-5">
        <div className="inline-block text-4xl mb-2" aria-hidden>🧸</div>

        <TextAnimate
          as="h1"
          animation="blurInUp"
          by="word"
          className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-tight"
        >
          {t("title")}
        </TextAnimate>

        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
          {t("subtitle")} ✨
        </p>
      </div>
    </section>
  );
}
