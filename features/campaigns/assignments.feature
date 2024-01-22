@story-2910
Feature: Campaign audiences must be assigned to either departments or contacts at the respective company

  Background:
    Given that a User is currently authenticated to the platform
    And a User navigates to the "/campaigns" URL

  @prod
  Scenario: A User selects "Assign to Departments" in the Assignment Type Selection modal
    When the User clicks the Create Campaign button
    And the User has provided a Campaign Name, Campaign Description, Audience, Workflow
    And the User clicks the actions button for selected Company
    And the User clicks on "Edit Assignment" option
    Then the "Assignment Selection" dialog is displayed
    And the UX of the "Assignment Selection" dialog is consistent with mockup
    When the User clicks the dialog's "Select Departments" button
    Then the system displays the "Select Departments" modal
    And the UX of the "Select Departments" modal is consistent with the mockup
