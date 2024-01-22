@story-1111
Feature: Company - Profile Menu

  Background:
    Given that a User is currently authenticated to the platform as a User from Business Company
    And a User navigates to the "/dashboard" URL

  Scenario: User opens a Profile menu
    When the User clicks on the User Profile menu link in the header toolbar
    Then the Profile dropdown menu is displayed
    And the Profile Menu design is consistent with the mockup

  Scenario: User opens a Profile menu and selects a specific company
    When the User clicks on the User Profile menu link in the header toolbar
    Then the Profile dropdown menu is displayed
    When the User clicks the approved Vendor in the profile
    Then the system logs the User in under the account associated with the selected Vendor in "Vendor Mode"
