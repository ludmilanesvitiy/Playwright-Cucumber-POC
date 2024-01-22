import { ICustomWorld } from './custom-world';

require('dotenv').config();
import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import {
    Page, Browser,
    chromium,
    ChromiumBrowser,
    firefox,
    FirefoxBrowser,
    webkit,
    WebKitBrowser,
    ConsoleMessage,
    request,
} from '@playwright/test';
import { ITestCaseHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { ensureDir } from 'fs-extra';
import path from 'path';

const tracesDir = 'traces';
const downloadAbolutePath = path.resolve(__dirname, '../../downloads');

declare global {
    var browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
}

setDefaultTimeout(process.env.PWDEBUG ? -1 : 60 * 1000);

let page: Page;
let browser: Browser;

BeforeAll(async function () {
    switch (process.env.browser) {
        case 'firefox':
            browser = await firefox.launch({headless: !!process.env.HEADLESS});
            const contextF = await browser.newContext();
            page = await contextF.newPage();

            break;
        case 'webkit':
            browser = await webkit.launch({headless: !!process.env.HEADLESS});
            const contextW = await browser.newContext();
            //await contextW.addCookies([{name: "disablePendo", value: "true", url: process.env.URL}]);
            page = await contextW.newPage();
            break;
        default:
            browser = await chromium.launch({headless: !!process.env.HEADLESS, downloadsPath: downloadAbolutePath});
            const contextC = await browser.newContext(
                {
                    ignoreHTTPSErrors: true,
                    acceptDownloads: true,
                    recordVideo: process.env.PWVIDEO ? {dir: 'screenshots'} : undefined,
                    viewport: {width: 1480, height: 1024}
                });
            page = await contextC.newPage();
    }
    //await ensureDir(tracesDir);
    return page;
});

Before({tags: '@ignore'}, async function () {
    return 'skipped' as any;
});

Before(async function (this: ICustomWorld, {pickle}: ITestCaseHookParameter) {
    this.startTime = new Date();
    this.testName = pickle.name.replace(/\W/g, '-');
    // this.page.on('console', async (msg: ConsoleMessage) => {
    //     if (msg.type() === 'log') {
    //         await this.attach(msg.text());
    //     }
    // });
    this.feature = pickle;
});

After(async function (this: ICustomWorld, {result}: ITestCaseHookParameter) {
    if (result) {
        await this.attach(`Status: ${result?.status}. Duration:${result.duration?.seconds}s`);

        if (result.status !== Status.PASSED) {
            const image = await this.page?.screenshot();
            image && (await this.attach(image, 'image/png'));
            await this.context?.tracing.stop({
                path: `${tracesDir}/${this.testName}-${
                    this.startTime?.toISOString().split('.')[0]
                }trace.zip`,
            });
        }
    }
});

AfterAll(async function () {
    await browser.close();
});

export { page, browser };