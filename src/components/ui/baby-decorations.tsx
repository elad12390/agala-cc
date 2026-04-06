"use client";

export function FloatingStars({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className ?? ""}`} aria-hidden>
      <span className="absolute top-4 start-8 text-2xl opacity-20 animate-pulse">✦</span>
      <span className="absolute top-12 end-16 text-lg opacity-15 animate-pulse delay-700">♡</span>
      <span className="absolute bottom-8 start-20 text-xl opacity-20 animate-pulse delay-1000">☁</span>
      <span className="absolute top-1/3 end-8 text-2xl opacity-15 animate-pulse delay-500">✨</span>
      <span className="absolute bottom-12 end-24 text-lg opacity-20 animate-pulse delay-300">⭐</span>
    </div>
  );
}

export function BabyDivider() {
  return (
    <div className="flex items-center gap-4 py-8" aria-hidden>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent dark:via-pink-900/40" />
      <span className="text-pink-300 dark:text-pink-700 text-lg">👣 ✦ 👣</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent dark:via-blue-900/40" />
    </div>
  );
}
