import { setRequestLocale } from "next-intl/server";
import { strollers } from "@/data/strollers";
import { HeroSection } from "@/components/sections/HeroSection";
import { BrandMarquee } from "@/components/sections/BrandMarquee";
import { StrollerGrid } from "@/components/sections/StrollerGrid";
import { TipsSection } from "@/components/sections/TipsSection";
import { Footer } from "@/components/sections/Footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";

export default async function AllStrollersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const uniqueBrands = [...new Set(strollers.map((s) => `${s.flag} ${s.brand}`))];

  return (
    <main className="flex flex-1 flex-col">
      <ScrollProgress />
      <HeroSection />
      <BrandMarquee brands={uniqueBrands} />
      <StrollerGrid />
      <TipsSection />
      <Footer />
    </main>
  );
}
