import { Given, Then, When } from '@cucumber/cucumber';
import { page } from '../support/common-hooks';
import { CustomWorld } from '../support/custom-world';
import { LoginPage } from '../support/pages/login.page';
import { expect } from '@playwright/test';

const loginPage = new LoginPage();
let confirmEmailLink: any;

Given(/^that a User is currently authenticated to the platform$/, async function (this: CustomWorld) {
    await loginPage.open('');
    await loginPage.loginByAPI(process.env.USER_EMAIL, process.env.USER_PASS);
});

Given(/^a User navigates to the "(.*)" URL$/, async function (pageUrl: string) {
    await loginPage.open(pageUrl);
    await page.waitForTimeout(3000);
});

Then(/^the User is presented with a screen 1A-SignIn consistent with the mockup$/, async () => {
    await loginPage.isDisplayedElem(loginPage.logoMain);
    await loginPage.isDisplayedElem(loginPage.emailInput);
    await loginPage.isDisplayedElem(loginPage.passwordInput);
    await loginPage.isDisplayedElem(loginPage.signInBtn);
    await loginPage.isTextEqual(loginPage.h1, 'Welcome back!');
    await loginPage.isTextEqual(loginPage.h3, 'Sign in to your account');
    await loginPage.isAttributeValueEql(loginPage.emailInput, 'placeholder','name@company.com');
    await loginPage.isAttributeValueEql(loginPage.passwordInput, 'placeholder', 'Password');
});

Given(/^the User tries to navigate to an application resource that requires permissions to access$/, async () => {
    await loginPage.open('/dashboard');
});

Then(/^the User is redirected to the application login screen$/, async () => {
    await loginPage.isCurrentUrlContain('/dashboard', true);
    await page.waitForTimeout(2000);
    await page.context().on('page', async page => {
        await page.waitForLoadState();
        await expect(page.url()).toContain(`/login`);
        await loginPage.isTextEqual(loginPage.h1, 'Welcome back!');
    })
});

When(/^the User successfully login with sufficient priveledges to access the requested resource$/, async () => {
    await loginPage.type(loginPage.emailInput, process.env.USER_EMAIL);
    await loginPage.type(loginPage.passwordInput, process.env.USER_PASS);
    await loginPage.clickOn(loginPage.signInBtn);
});

Then(/^the User is redirected to the resource they originally requested$/, async () => {
    await page.waitForTimeout(2000);
    await page.context().on('page', async page => {
        await page.waitForLoadState();
        await expect(page.url()).toContain(`/dashboard`);
    });
});

When(/^a 60 minute time period has elapsed with no User activity$/, async () => {
    await loginPage.setLastAction();
});

Then(/^the system de-authenticates the user and redirects them to an Automatic Logout screen$/, async () => {
    await page.waitForTimeout(1000);
    await loginPage.isTextEqual(loginPage.h1, 'Welcome back!');
});

Then(/^the User is not authenticated into the system$/, async () => {
    await loginPage.isCurrentUrlContain('login');
});

Then(/^the system displays the Forgot Password screen$/, async () => {
    await loginPage.isCurrentUrlContain('/forgotPassword');
});
