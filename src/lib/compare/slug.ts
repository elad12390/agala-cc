const SUPERSCRIPT_TO_DIGIT: Record<string, string> = {
  "\u00B2": "2",
  "\u00B3": "3",
  "\u00B9": "1",
  "\u2070": "0",
  "\u2074": "4",
  "\u2075": "5",
  "\u2076": "6",
  "\u2077": "7",
  "\u2078": "8",
  "\u2079": "9",
};

function transliterateSuperscripts(input: string): string {
  return input.replace(/./g, (ch) => SUPERSCRIPT_TO_DIGIT[ch] ?? ch);
}

export function toSlug(brand: string, model: string): string {
  const raw = `${brand} ${model}`;
  return transliterateSuperscripts(raw)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
