# language: en
@compare @persistence
Feature: Compare selection persists across reload and navigation

  As a parent who shops in multiple sessions,
  I want my compare selections to survive a refresh or a quick detour,
  so I do not have to re-tick the same strollers every time.

  Background:
    Given the app is running with the production stroller dataset

  Scenario: P1 — selection survives a page refresh
    Given I am on "/he/all" with 3 strollers checked
    When I reload the page
    Then the same 3 strollers are still checked
    And the drawer says "3 selected"

  Scenario: P2 — selection survives navigation away and back
    Given I am on "/he/all" with 2 strollers checked
    When I navigate to "/he/" and then back to "/he/all"
    Then the same 2 strollers are still checked

  Scenario: P3 — direct deep link with ids hydrates the checkboxes
    Given localStorage has no compare selection
    When I open "/he/all?ids=cybex-priam-5,bugaboo-fox-5-renew" directly
    Then the "Cybex Priam 5" card is checked
    And the "Bugaboo Fox 5 Renew" card is checked
    And the drawer says "2 selected"

  Scenario: P4 — URL wins over a stale localStorage selection
    Given localStorage compare selection is:
      | cybex-priam-5       |
      | bugaboo-fox-5-renew |
    When I open "/he/all?ids=joolz-day5" directly
    Then only the "Joolz Day5" card is checked
    And the localStorage compare selection is now:
      | joolz-day5 |
