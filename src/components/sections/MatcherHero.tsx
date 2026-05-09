"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TextAnimate } from "@/components/ui/text-animate";
import { FloatingStars } from "@/components/ui/baby-decorations";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MatcherHero() {
  const t = useTranslations("matcher.hero");
  const locale = useLocale();
  const isHe = locale === "he";

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

        <div className="flex flex-col items-center gap-2 pt-2">
          <Link
            href={`/${locale}/all`}
            aria-label={t("browseAll")}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 gap-2 rounded-full border-2 border-primary/30 bg-background/70 px-6 text-base font-semibold backdrop-blur-sm hover:border-primary/50 hover:bg-primary/10",
            )}
          >
            <span>{t("browseAll")}</span>
            <ArrowRight
              className={cn("size-4", isHe && "rotate-180")}
              aria-hidden
            />
          </Link>
          <span className="text-xs text-muted-foreground">
            {t("browseAllHint")}
          </span>
        </div>
      </div>
    </section>
  );
}
