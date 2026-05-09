# language: en
@compare @selection
Feature: Selecting strollers to compare from /all

  As an Israeli parent browsing the catalog,
  I want to tick strollers on the grid and see a sticky drawer
  so I can quickly assemble a 2-4 stroller comparison.

  Background:
    Given the app is running with the production stroller dataset

  Scenario: S1 — single selection shows drawer with disabled compare button
    Given I am on "/he/all" with no strollers selected
    When I check the compare box on the "Cybex Priam 5" card
    Then the compare drawer is visible
    And the drawer says "נבחרה 1"
    And the "Compare" button in the drawer is disabled
    And the disabled button shows the tooltip "בחרו לפחות 2"

  Scenario: S2 — second selection enables the compare button
    Given I am on "/he/all" with the "Cybex Priam 5" card already checked
    When I check the compare box on the "Bugaboo Fox 5 Renew" card
    Then the drawer says "נבחרו 2"
    And the "Compare" button in the drawer is enabled

  Scenario: S3 — fifth selection is refused
    Given I am on "/he/all" with 4 strollers already checked
    When I attempt to check the compare box on a 5th stroller card
    Then the 5th checkbox stays unchecked
    And a toast appears with the text "מקסימום 4 עגלות להשוואה"
    And the drawer still says "נבחרו 4"

  Scenario: S4 — clicking compare navigates to the compare page with slugs in selection order
    Given I am on "/he/all"
    And I have checked the cards in this order:
      | Cybex Priam 5      |
      | Bugaboo Fox 5 Renew |
      | Sport Line ALIX 2026 |
    When I click "Compare" in the drawer
    Then the URL is "/he/compare?ids=cybex-priam-5,bugaboo-fox-5-renew,sport-line-alix-2026"

  Scenario: S5 — clear all empties everything
    Given I am on "/he/all" with 3 strollers checked
    When I click "Clear all" in the drawer
    Then no card is checked
    And the drawer is hidden
    And the URL no longer contains an "ids" query parameter
    And the localStorage key "stroller-compare-selection" is empty
