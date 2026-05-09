"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchStrollers, slugOf } from "@/lib/compare/dataset";
import { cn } from "@/lib/utils";

interface CompareSearchProps {
  excludeSlugs?: string[];
  onPick: (slug: string) => void;
  variant?: "page" | "empty";
}

export function CompareSearch({
  excludeSlugs = [],
  onPick,
  variant = "page",
}: CompareSearchProps) {
  const t = useTranslations("compare.empty");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const exclude = useMemo(() => new Set(excludeSlugs), [excludeSlugs]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchStrollers(query, 8).filter((s) => !exclude.has(slugOf(s)));
  }, [query, exclude]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search
          className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
          aria-hidden
        />
        <Input
          data-testid="compare-search-input"
          type="search"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className={cn(
            "ps-9 h-11",
            variant === "empty" && "h-12 text-base shadow-sm",
          )}
        />
      </div>

      {open && results.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-20 mt-2 w-full rounded-lg border bg-popover shadow-lg overflow-hidden"
        >
          {results.map((s) => {
            const slug = slugOf(s);
            return (
              <li key={slug}>
                <button
                  type="button"
                  data-testid={`compare-search-suggestion-${slug}`}
                  onClick={() => {
                    onPick(slug);
                    setQuery("");
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-start hover:bg-muted focus-visible:bg-muted outline-none"
                >
                  <span className="font-medium">
                    {s.brand} {s.model}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {s.flag} {s.type}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
