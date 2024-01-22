import { Then, When, Given } from '@cucumber/cucumber';
import { ModalFragment } from '../support/pages/modal.fragment';
import { BasePage } from '../support/pages/base.page';
import { page } from '../support/common-hooks';

const modal: ModalFragment = new ModalFragment();
const basePage: BasePage = new BasePage();

Then(/^the dialog's text contains "(.*)"$/, async (text: string) => {
    await basePage.isTextEqual(modal.modalBody, text);
});

Then(/^the dialog's input value contains "(.*)"$/, async (text: string) => {
    await basePage.isInputValueEqual(modal.input, text);
});

Then(/^the UX of OK\/Cancel Dialog for Workflow Validation is consistent with the mockup$/, async () => {
    await basePage.isLengthEqual(modal.buttons, 2);
    await basePage.isTextEqual(modal.buttons, 'Close', true, -1);
    await basePage.isDisplayedElem(modal.buttons);
});

When(/^the User clicks the Workflow Validation Dialog's "Close" button$/, async () => {
    await basePage.clickOn(modal.buttons, -1);
});

When(/^the User clicks the Dialog's single "OK" button$/, async () => {
    if (await page.locator(modal.cancelBtn).isVisible()) {
        await basePage.clickOn(modal.cancelBtn);
    } else {
        await basePage.pressEsc();
    }
});

When(/^the User clicks the Dialog's "OK" button$/, async () => {
    await basePage.clickOn(modal.submitBtn);
});

When(/^the User clicks the Dialog's "Cancel" button$/, async () => {
    if (await page.locator(modal.cancelBtn).isVisible()) {
        await basePage.clickOn(modal.cancelBtn);
    } else {
        await basePage.pressEsc();
    }
});

When(/^the User press Esc$/, async () => {
    await basePage.pressEsc();
});

Then(/^the system hides modal OK\/Cancel Dialog$/, async () => {
    await basePage.isHiddenElem(modal.modalBody);
});

Then(/^the system displays modal with the title "(.*)"$/, async (title: string) => {
    await basePage.isDisplayedElem(modal.modalBody);
    await basePage.isTextEqual(modal.h1, title);
});

Then(/^the system displays an error modal OK\/Cancel Dialog$/, async () => {
    await basePage.isDisplayedElem(modal.errorModal);
});

Then(/^the error dialog has the title "(.*)"$/, async (title: string) => {
    await basePage.isTextEqual(modal.errorModalH1, title);
});

Then(/^the error dialog's text contains "(.*)"$/, async (text: string) => {
    await basePage.isTextEqual(modal.errorModal, text);
});

Then(/^the User is redirected to the Dashboard$/, async () => {
    await basePage.waitForUrl('**\/dashboard');
    await basePage.isCurrentUrlContain('/dashboard');
});

Then(/^the system presents the "Premium Feature" popup$/, async () => {
    await basePage.isDisplayedElem(modal.premiumPopup);
});

Then(/^the UX of the "Premium Feature" popup is consistent with mockup$/, async () => {
    await basePage.isTextEqual(modal.h2, 'Premium Feature');
    await basePage.isDisplayedElem(modal.premiumPopupContactUsBtn);
    await basePage.isTextEqual(modal.premiumPopupContactUsBtn, 'Contact Us');
    await basePage.isDisplayedElem(modal.premiumPopupNotNowBtn);
    await basePage.isTextEqual(modal.premiumPopupNotNowBtn, 'Not right now');
});

Then(/^the dialog has the sub-title "(.*)"$/, async (title: string) => {
    await basePage.isTextEqual(modal.h3, title);
});

When(/^the User reloads the current page$/, async () => {
    await basePage.reload();
});

Given(/^that a User is currently authenticated to the platform as a User from (.*) Company$/, async (tier: string) => {
    const user = basePage.getUser(tier);
    await basePage.open('');
    await basePage.loginByAPI(user, process.env.USER_PASS);
});

Then(/^the system presents the "(.*)" dialog$/, async (title: string) => {
    await basePage.isDisplayedElem(modal.modalBody);
    await basePage.isTextEqual(modal.modalBody, title);
});

Then(/^the system closes the confirmation modal$/, async () => {
    await basePage.isHiddenElem(modal.modalBody);
});

When(/^the User clicks the Cancel button on the Delete confirmation modal$/, async () => {
    await basePage.clickOn(modal.cancelBtn);
});

When(/^hits the ENTER key$/, async () => {
    await basePage.pressEnter();
    await page.waitForTimeout(500);
});

Then(/^the system closes the Create dialog$/, async () => {
    await basePage.isHiddenElem(modal.modalBody);
});
