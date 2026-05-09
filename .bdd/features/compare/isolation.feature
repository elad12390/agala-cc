# language: en
@compare @isolation
Feature: Compare selection is fully isolated from the matcher wizard

  The wizard's "pick 2-4 strollers" state and the catalog's "ticked for
  compare" state are different concerns. Mixing them creates surprising
  cross-contamination across two flows that ask different questions.

  Background:
    Given the app is running with the production stroller dataset

  Scenario: W1 — wizard picks do not pre-tick the catalog
    Given I have completed wizard step 1 with these picks:
      | Cybex Priam 5       |
      | Bugaboo Fox 5 Renew |
    When I navigate to "/he/all"
    Then no stroller card is checked for compare
    And the compare drawer is hidden

  Scenario: W2 — catalog ticks do not pre-fill the wizard
    Given I am on "/he/all" with 3 strollers checked
    When I open the matcher wizard from the home page
    Then wizard step 1 has no strollers picked
