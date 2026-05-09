# language: en
@compare @page
Feature: The /compare page renders, accepts deep links, and supports add/remove

  As a parent who has 2-4 strollers in mind,
  I want a side-by-side comparison page that is shareable by URL,
  so my partner and I can review the same view from different devices.

  Background:
    Given the app is running with the production stroller dataset

  Scenario: C1 — empty compare page shows the search-and-add empty state
    When I open "/he/compare"
    Then I see the heading "בחרו 2-4 עגלות להשוואה"
    And I see a search input with the placeholder "חפשו עגלה..."
    And I see a link "ראו את כל 151 העגלות" pointing to "/he/all"

  Scenario: C2 — two valid slugs render a side-by-side table
    When I open "/he/compare?ids=cybex-priam-5,bugaboo-fox-5-renew"
    Then I see exactly 2 stroller columns
    And the first column header is "Cybex Priam 5"
    And the second column header is "Bugaboo Fox 5 Renew"
    And the table has a sticky first column with spec labels
    And the document direction is "rtl"

  Scenario: C3 — one invalid slug is dropped with a warning
    When I open "/he/compare?ids=invalid-slug,cybex-priam-5"
    Then I see exactly 1 stroller columns
    And the visible column header is "Cybex Priam 5"
    And I see a warning notice "דגם אחד לא נמצא"

  Scenario: C4 — a 5th id is dropped with a notice
    When I open "/he/compare?ids=cybex-priam-5,bugaboo-fox-5-renew,joolz-day5,sport-line-alix-2026,bugaboo-donkey-6"
    Then I see exactly 4 stroller columns
    And the visible columns are:
      | Cybex Priam 5        |
      | Bugaboo Fox 5 Renew  |
      | Joolz Day5           |
      | Sport Line ALIX 2026 |
    And I see a notice "ניתן להשוות עד 4 עגלות"

  Scenario: C5 — search-and-add appends a new stroller column
    Given I am on "/he/compare?ids=cybex-priam-5,bugaboo-fox-5-renew"
    When I type "donkey" in the compare search input
    And I click the "Bugaboo Donkey 6" suggestion
    Then the URL becomes "/he/compare?ids=cybex-priam-5,bugaboo-fox-5-renew,bugaboo-donkey-6"
    And I see exactly 3 stroller columns
    And the third column header is "Bugaboo Donkey 6"

  Scenario: C6 — removing a column removes the slug from the URL
    Given I am on "/he/compare?ids=cybex-priam-5,bugaboo-fox-5-renew,bugaboo-donkey-6"
    When I click the remove button on the "Bugaboo Donkey 6" column
    Then the URL becomes "/he/compare?ids=cybex-priam-5,bugaboo-fox-5-renew"
    And I see exactly 2 stroller columns

  Scenario: C7 — all-invalid ids degrade to the empty state
    When I open "/he/compare?ids=invalid-1,invalid-2,invalid-3"
    Then I see the empty-state heading "בחרו 2-4 עגלות להשוואה"
    And I see a banner "אף דגם לא נמצא"
