"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import {
  COMPARE_STORAGE_KEY,
  COMPARE_MAX,
  COMPARE_QUERY_PARAM,
} from "./constants";

export { COMPARE_STORAGE_KEY, COMPARE_MAX, COMPARE_QUERY_PARAM };

function getUrlIdsParam(): string {
  if (typeof window === "undefined") return "";
  return new URL(window.location.href).searchParams.get(COMPARE_QUERY_PARAM) ?? "";
}

function subscribeToUrl(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("compare:urlchange", handler);
  window.addEventListener("popstate", handler);
  return () => {
    window.removeEventListener("compare:urlchange", handler);
    window.removeEventListener("popstate", handler);
  };
}

let overflowCount = 0;
function getOverflowSnapshot(): number {
  return overflowCount;
}
function subscribeToOverflow(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("compare:overflow", handler);
  return () => window.removeEventListener("compare:overflow", handler);
}
function bumpOverflow(): void {
  if (typeof window === "undefined") return;
  overflowCount += 1;
  window.dispatchEvent(new Event("compare:overflow"));
}

function parseStored(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x) => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

function readLocalStorageSync(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return parseStored(window.localStorage.getItem(COMPARE_STORAGE_KEY));
  } catch {
    return [];
  }
}

function writeLocalStorage(slugs: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    return;
  }
}

function parseIdsParam(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function uniqueOrdered(slugs: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of slugs) {
    if (!seen.has(s)) {
      seen.add(s);
      out.push(s);
    }
  }
  return out;
}

export interface CompareSelection {
  slugs: string[];
  count: number;
  isFull: boolean;
  isSelected: (slug: string) => boolean;
  add: (slug: string) => boolean;
  remove: (slug: string) => void;
  clear: () => void;
  attemptedOverflow: number;
  acknowledgeOverflow: () => void;
}

export function useCompareSelection(): CompareSelection {
  const idsRaw = useSyncExternalStore(
    subscribeToUrl,
    getUrlIdsParam,
    () => "",
  );

  const urlSlugs = useMemo(
    () =>
      uniqueOrdered(parseIdsParam(idsRaw)).slice(0, COMPARE_MAX),
    [idsRaw],
  );

  const slugs = urlSlugs;
  const hydrationDoneRef = useRef(false);

  const attemptedOverflow = useSyncExternalStore(
    subscribeToOverflow,
    getOverflowSnapshot,
    () => 0,
  );

  const writeUrl = useCallback(
    (next: string[]) => {
      if (typeof window === "undefined") return;
      const url = new URL(window.location.href);
      if (next.length === 0) {
        url.searchParams.delete(COMPARE_QUERY_PARAM);
      } else {
        url.searchParams.set(COMPARE_QUERY_PARAM, next.join(","));
      }
      window.history.replaceState(null, "", url.toString());
      window.dispatchEvent(new Event("compare:urlchange"));
    },
    [],
  );

  useEffect(() => {
    if (hydrationDoneRef.current) return;
    hydrationDoneRef.current = true;
    if (urlSlugs.length === 0) {
      const stored = readLocalStorageSync();
      if (stored.length > 0) {
        writeUrl(stored);
      }
    } else {
      writeLocalStorage(urlSlugs);
    }
  }, [urlSlugs, writeUrl]);

  useEffect(() => {
    if (!hydrationDoneRef.current) return;
    if (urlSlugs.length > 0) {
      writeLocalStorage(urlSlugs);
    }
  }, [urlSlugs]);

  const add = useCallback(
    (slug: string): boolean => {
      const current = slugs;
      if (current.includes(slug)) return true;
      if (current.length >= COMPARE_MAX) {
        bumpOverflow();
        return false;
      }
      const next = [...current, slug];
      writeLocalStorage(next);
      writeUrl(next);
      return true;
    },
    [slugs, writeUrl],
  );

  const remove = useCallback(
    (slug: string) => {
      const current = slugs;
      if (!current.includes(slug)) return;
      const next = current.filter((s) => s !== slug);
      writeLocalStorage(next);
      writeUrl(next);
    },
    [slugs, writeUrl],
  );

  const clear = useCallback(() => {
    writeLocalStorage([]);
    writeUrl([]);
  }, [writeUrl]);

  const acknowledgeOverflow = useCallback(() => {}, []);

  return useMemo<CompareSelection>(
    () => ({
      slugs,
      count: slugs.length,
      isFull: slugs.length >= COMPARE_MAX,
      isSelected: (slug: string) => slugs.includes(slug),
      add,
      remove,
      clear,
      attemptedOverflow,
      acknowledgeOverflow,
    }),
    [slugs, add, remove, clear, attemptedOverflow, acknowledgeOverflow],
  );
}
