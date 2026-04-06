import { getTranslations } from "next-intl/server";
import { BlurFade } from "@/components/ui/blur-fade";
import { BabyDivider } from "@/components/ui/baby-decorations";

const tintClasses = [
  "bg-blue-50/60 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30",
  "bg-pink-50/60 border-pink-100 dark:bg-pink-950/20 dark:border-pink-900/30",
  "bg-violet-50/60 border-violet-100 dark:bg-violet-950/20 dark:border-violet-900/30",
  "bg-amber-50/60 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30",
  "bg-emerald-50/60 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30",
  "bg-rose-50/60 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30",
];

const cornerDecorations = ["✦", "♡", "☁", "⭐", "✨", "🌸"];

export async function TipsSection() {
  const t = await getTranslations("tips");

  const tips = [
    { emoji: "🏪", text: t("shilav") },
    { emoji: "🏥", text: t("leumit") },
    { emoji: "🔍", text: t("zap") },
    { emoji: "🌴", text: t("eilat") },
    { emoji: "📊", text: t("compare") },
    { emoji: "♻️", text: t("resale") },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-16 md:py-24">
      <BabyDivider />

      <h2 className="text-3xl font-bold tracking-tight text-center mb-2">
        {t("title")} 💡
      </h2>
      <p className="text-center text-muted-foreground mb-8 text-sm">✨</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tips.map((tip, i) => (
          <BlurFade key={tip.emoji} delay={0.05 * i} inView>
            <div className={`relative rounded-2xl border shadow-baby p-5 space-y-2 h-full transition-all hover:shadow-baby-hover hover:-translate-y-0.5 ${tintClasses[i % tintClasses.length]}`}>
              <span className="absolute top-2 end-3 text-xs opacity-20" aria-hidden>
                {cornerDecorations[i % cornerDecorations.length]}
              </span>
              <span className="text-2xl">{tip.emoji}</span>
              <p className="text-sm leading-relaxed">{tip.text}</p>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
