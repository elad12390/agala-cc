import { setRequestLocale } from "next-intl/server";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { MatcherHero } from "@/components/sections/MatcherHero";
import { MatcherWizard } from "@/components/matcher/MatcherWizard";
import { Footer } from "@/components/sections/Footer";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex flex-1 flex-col">
      <ScrollProgress />
      <MatcherHero />
      <section className="py-8 md:py-12">
        <MatcherWizard />
      </section>
      <Footer />
    </main>
  );
}
