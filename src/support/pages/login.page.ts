import { BasePage } from './base.page';
import { page } from '../common-hooks';

export class LoginPage extends BasePage {
    signInBtn = ('button[type*="submit"]');
    emailInput = ('#email');
    passwordInput = ('#password');
    logoMain = ('.auth-page-header img');
    h1 = ('h1');
    h3 = ('h3');

    async setLastAction () {
        const currentLastAction = await page.evaluate(
            `window.localStorage.getItem('lastAction');`
        );
        const fakeLastAction = Number(currentLastAction) - 60 * 60 * 1001;
        await page.evaluate(
            `window.localStorage.setItem('lastAction', ${fakeLastAction});`
        );
        await page.waitForTimeout(1000*30);
    }
}
