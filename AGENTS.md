# Stroller Research Israel — Project Conventions

## What This Is
A production-ready stroller comparison website for Israeli parents. Hebrew/RTL-first, mobile-first, content-driven.

## Tech Stack
- **Framework**: Next.js 16 (App Router, TypeScript, RSC by default)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (functional) + MagicUI (visual polish)
- **i18n**: next-intl 4.x (default locale: `he`, supported: `he`, `en`)
- **Package Manager**: bun
- **Deployment**: Vercel (planned)

## i18n Architecture (next-intl)
- Default locale: `he` (Hebrew)
- Supported locales: `he`, `en`
- Route structure: `src/app/[locale]/` — ALL pages under locale segment
- Messages: `messages/he.json`, `messages/en.json`
- Middleware: `src/middleware.ts` — auto-detects locale, redirects `/` → `/he`
- Use `useTranslations('namespace')` in client components
- Use `getTranslations('namespace')` in server components
- NEVER hardcode Hebrew strings in components — always use translation keys
- Brand names and model names are NOT translated (always English)

## HARD RULES

### Component Rules
1. **MagicUI components for visual elements** — cards, animations, text effects, backgrounds, buttons with effects
2. **shadcn/ui for functional elements** — forms, tables, inputs, selects, dialogs, tooltips, badges
3. **NO custom components from scratch** — compose from MagicUI + shadcn only
4. **Never install new npm packages** for UI — if MagicUI or shadcn doesn't have it, find a creative composition

### MagicUI Components Available (installed)
Visual: `magic-card`, `shimmer-button`, `ripple-button`, `shine-border`, `border-beam`, `blur-fade`, `marquee`, `dot-pattern`, `scroll-progress`, `bento-grid`, `animated-circular-progress-bar`, `animated-shiny-text`, `text-animate`, `word-rotate`, `number-ticker`

### shadcn/ui Components Available (installed)
Functional: `button`, `badge`, `table`, `tooltip`, `input`, `select`, `checkbox`, `card`, `dialog`, `tabs`, `separator`, `skeleton`, `scroll-area`

### Architecture Rules
- `src/app/` — pages (App Router)
- `src/components/ui/` — shadcn + MagicUI primitives (DO NOT EDIT unless theming)
- `src/components/sections/` — page sections composed from ui/ components
- `src/components/layout/` — nav, footer, container
- `src/lib/` — utilities, data, types
- `src/data/` — stroller data (JSON/TS)
- Server Components by default. `'use client'` only when needed (interactivity, hooks)
- All images via `next/image`
- All fonts via `next/font`

### Content Rules
- Hebrew (RTL) is the primary language
- English for brand names and model names only
- Price always in ₪ (NIS)
- Every stroller needs: brand, model, price, grade, grade reason, wheels info, weight, bassinet yes/no, buy links

### File Naming
- Components: PascalCase (`StrollerCard.tsx`)
- Pages: lowercase (`page.tsx`, `layout.tsx`)
- Data files: camelCase (`strollerData.ts`)
- Types: PascalCase in dedicated file (`types.ts`)

### Hebrew/RTL
- Root `<html lang="he" dir="rtl">`
- Use `font-family: var(--font-heebo)` for Hebrew
- Use `font-family: var(--font-inter)` + `dir="ltr"` isolation for English brand names
- Test in both LTR and RTL

## Data
- 134 stroller models from 40+ brands
- Each graded A+ through D- for Israeli terrain suitability
- Categories: Israeli brands, Italian premium, European premium, budget, compact
- All buy links point to specific Israeli retailer product pages
