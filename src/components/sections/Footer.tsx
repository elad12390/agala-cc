import { getTranslations } from "next-intl/server";
import { Separator } from "@/components/ui/separator";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="mt-auto border-t border-border/40">
      <div className="max-w-5xl mx-auto px-4 pt-12 pb-8 space-y-4 text-center">
        <p className="text-sm" aria-hidden>🧸 ✦ 👶</p>
        <p className="text-sm text-muted-foreground">{t("madeWith")}</p>
        <Separator className="opacity-40" />
        <p className="text-xs text-muted-foreground/70">{t("disclaimer")}</p>
        <p className="text-xs text-muted-foreground/70">{t("lastUpdated")}</p>
      </div>
    </footer>
  );
}
