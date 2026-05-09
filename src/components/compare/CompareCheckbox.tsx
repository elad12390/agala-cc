"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useCompareSelection } from "@/lib/compare/selection-store";

interface CompareCheckboxProps {
  slug: string;
}

export function CompareCheckbox({ slug }: CompareCheckboxProps) {
  const { isSelected, add, remove } = useCompareSelection();
  const checked = isSelected(slug);

  return (
    <Checkbox
      data-testid={`compare-checkbox-${slug}`}
      checked={checked}
      onCheckedChange={(value) => {
        if (value === true) {
          add(slug);
        } else {
          remove(slug);
        }
      }}
      aria-label={`Compare ${slug}`}
    />
  );
}
