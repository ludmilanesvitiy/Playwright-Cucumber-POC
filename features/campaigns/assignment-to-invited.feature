@story-6408
Feature: Campaign assignment to an invited company

  Background:
    Given that a User is currently authenticated to the platform

  Scenario: Companies in invited status are able to be selected to assign a task during Campaign creation
    When a User navigates to the "/campaigns/create" URL
    And the User clicks the link icon in the Audience field
    Then the system displays the Campaign Audience modal
    And the Individual Companies tab is displayed
    When the User searches for an Invited company in the Audience modal
    And the User clicks the Select button for a company row
    And the User clicks the Save button in the Audience Selection Modal
    Then the system closes the Campaign Audience modal
    And the system updates the Campaign's Audience to the selected Company
    And the system updates the Campaign's Assigned Companies statistic's value to "1"
    Then the "General Management" department is selected as assignment by default

  @campaign-draft
  Scenario: Companies in invited status are able to be selected to assign a task during Campaign edit
    When a User navigates to the "/campaigns" URL
    And the User is on the Campaign View Details screen
    And the User clicks the Edit Campaign button from the Campaign View
    Then the system displays the Campaign Edit screen
    When the User removes previously selected Companies
    And the User clicks the Edit Audience link
    Then the system displays the Campaign Audience modal
    And the Individual Companies tab is displayed
    When the User searches for an Invited company in the Campaign Audience modal
    And the User clicks the Select button for a company row
    And the User clicks the Save button in the Audience Selection Modal
    Then the system closes the Campaign Audience modal
    And the system updates the Campaign's Audience to the selected Company
    And the system updates the Campaign's Assigned Companies statistic's value to "1"
    Then the "General Management" department is selected as assignment by default
