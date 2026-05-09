# language: en
@compare @highlighting
Feature: Best-in-row highlighting on the compare table

  As a parent reading a side-by-side comparison,
  I want each row to subtly indicate which stroller wins on that spec,
  so I can scan the table without doing the math myself.

  Background:
    Given the app is running with the production stroller dataset

  Scenario: H1 — lightest weight wins on a numeric "lower is better" row
    When I open "/he/compare?ids=cybex-priam-5,joolz-aer2"
    Then the "weight" row cell for "Joolz Aer²" has the "best" highlight
    And the "weight" row cell for "Cybex Priam 5" does not have the "best" highlight

  Scenario: H2 — lowest min-price wins on the price row
    When I open "/he/compare?ids=bugaboo-fox-5-renew,sport-line-cielo-xl-2025"
    Then the "price" row cell for "Sport Line Cielo XL 2025" has the "best" highlight
    And the "price" row cell for "Bugaboo Fox 5 Renew" does not have the "best" highlight

  Scenario: H3 — ties on a "higher is better" row are both highlighted
    When I open "/he/compare?ids=cybex-priam-5,bugaboo-donkey-6"
    Then the "terrain" row cell for "Cybex Priam 5" has the "best" highlight
    And the "terrain" row cell for "Bugaboo Donkey 6" has the "best" highlight

  Scenario: H4 — unparseable values are excluded from the row
    When I open "/he/compare?ids=sport-line-alix-2026,sport-line-slide-2026"
    Then the "weight" row cell for "Sport Line SLIDE 2026" shows the literal value "—"
    And no cell in the "weight" row has the "best" highlight

  Scenario: H5 — bassinet=true on both is highlighted on both
    When I open "/he/compare?ids=cybex-priam-5,bugaboo-fox-5-renew"
    Then the "bassinet" row cell for "Cybex Priam 5" shows "✓ Newborn-ready"
    And the "bassinet" row cell for "Bugaboo Fox 5 Renew" shows "✓ Newborn-ready"

  Scenario: H6 — only bassinet=true wins when the other is false
    When I open "/he/compare?ids=cybex-priam-5,baby-jogger-city-mini-gt2"
    Then the "bassinet" row cell for "Cybex Priam 5" has the "best" highlight
    And the "bassinet" row cell for "Baby Jogger City Mini GT2" does not have the "best" highlight

  Scenario: H7 — free-text rows are never highlighted
    When I open "/he/compare?ids=cybex-priam-5,bugaboo-fox-5-renew"
    Then no cell in the "notes" row has the "best" highlight
    And no cell in the "wheels" row has the "best" highlight
