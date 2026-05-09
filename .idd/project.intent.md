# Project Intent — Stroller Research Israel

## Anchor

A Hebrew/RTL-first comparison website that helps Israeli parents pick a
stroller suited to **real Israeli conditions** (broken sidewalks,
Jerusalem cobblestones, public-transit folding, hot sun, narrow apartment
elevators, frequent international travel). Editorial grading + neutral
side-by-side specs > brand marketing.

## Constraints (project-wide)

| Constraint | Source | Why it exists |
|---|---|---|
| Hebrew is the default locale, RTL is the primary layout | `AGENTS.md` | Audience is Israeli parents. |
| Brand and model names stay in English everywhere | `AGENTS.md` | Brand identity, no translation drift. |
| Single source of truth for stroller data: `src/data/strollers.ts` | Repo convention | No hidden duplicates, no second dataset to sync. |
| Components compose from shadcn/ui + MagicUI; never custom from scratch | `AGENTS.md` | Visual consistency, lower maintenance. |
| Never install new npm packages **for UI** | `AGENTS.md` | UI must compose from existing primitives. Test/build tooling is exempt. |
| All copy lives in `messages/he.json` + `messages/en.json` | next-intl | No hardcoded strings in components. |

## Modules

| Module | Path | Purpose |
|---|---|---|
| matcher | `src/components/matcher/`, `src/app/[locale]/page.tsx` | Wizard that picks 2-4 strollers and scores them against the user's preferences. Subjective: "best for me." |
| catalog | `src/data/strollers.ts`, `src/app/[locale]/all/`, `src/components/sections/StrollerGrid.tsx` | Full grid with filters, sort, search across all strollers. Read-only browse. |
| **compare** | `src/app/[locale]/compare/`, `src/components/compare/`, `src/lib/compare/` | NEW. Neutral, objective head-to-head spec comparison. Different question from matcher. |

## Verification strategy

Bulletproof: every behavior in `.idd/modules/{module}/INTENT.md` is
verified by a Gherkin scenario in `.bdd/features/{module}/`. Tests run
against a real `bun run dev` server via Playwright + playwright-bdd. No
mocks. The dataset is real, the URL routing is real, the i18n is real.
