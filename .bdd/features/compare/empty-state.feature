# language: en
@compare @empty-state
Feature: /compare empty state and degenerate inputs

  As a visitor who lands directly on /compare without selecting first,
  I want a helpful empty state, not a 404 or an inscrutable blank page.

  Background:
    Given the app is running with the production stroller dataset

  Scenario: E1 — bare /compare shows search-and-add
    When I open "/he/compare"
    Then I see the empty-state heading "בחרו 2-4 עגלות להשוואה"
    And I see the empty-state subtitle "השוו עד 4 דגמים זה לצד זה"
    And the page returns HTTP 200

  Scenario: E2 — /compare with empty ids query is treated as bare
    When I open "/he/compare?ids="
    Then I see the empty-state heading "בחרו 2-4 עגלות להשוואה"

  Scenario: E3 — /compare with only invalid ids shows the empty state plus a warning
    When I open "/he/compare?ids=invalid-1,invalid-2"
    Then I see the empty-state heading "בחרו 2-4 עגלות להשוואה"
    And I see a banner "אף דגם לא נמצא"

  Scenario: E4 — empty state on the English locale uses English copy
    When I open "/en/compare"
    Then I see the empty-state heading "Pick 2-4 strollers to compare"
