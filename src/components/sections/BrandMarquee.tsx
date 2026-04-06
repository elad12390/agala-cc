import { Marquee } from "@/components/ui/marquee";

interface BrandMarqueeProps {
  brands: string[];
}

export function BrandMarquee({ brands }: BrandMarqueeProps) {
  return (
    <section className="py-4 md:py-6 border-y border-border/30 bg-secondary/30">
      <Marquee pauseOnHover className="[--duration:60s] [--gap:1.5rem]">
        {brands.map((brand) => (
          <span
            key={brand}
            className="text-sm font-medium text-muted-foreground/70 whitespace-nowrap px-4"
          >
            {brand}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
