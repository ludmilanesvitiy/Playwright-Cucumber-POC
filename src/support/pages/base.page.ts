import { expect, Locator } from '@playwright/test';
import { page } from '../common-hooks';
import { getAPIUrl } from '../helpers/http.helper';

require('dotenv').config();
const fs = require('fs');

/**
 * This file contains all methods, which help to make POs simple
 * Each PO will extend this class and easily overwrite, extend all methods
 */

export class BasePage {
    /** --- ACTIONS  --- **/
    async openMainPage () {
        await page.goto(process.env.URL);
    }

    async open (url: string) {
        await page.goto(process.env.URL + url);
    }

    async reload () {
        await page.reload();
    }

    async clickOn (locator: string, index = 0) {
        await page.locator(locator).nth(index).click();
    }

    async type (elementToType: string, textToType: string, index = 0) {
        await page.locator(elementToType).nth(index).clear();
        await page.locator(elementToType).nth(index).type(textToType);
    }

    async clear (elementToType: string) {
        await page.locator(elementToType).click();
        await page.locator(elementToType).press('Shift+Home');
        await page.locator(elementToType).press('Backspace');
        await page.locator(elementToType).click();
        await page.locator(elementToType).press('Shift+Home');
        await page.locator(elementToType).press('Backspace');
    }

    async typeAdditionally (elementToType: string, textToType: string, index = 0) {
        const input = page.locator(elementToType).nth(index);
        await input.focus();
        await page.keyboard.press('End');
        await input.type(textToType);
    }

    async typeToTheEnd (elementToType: string, textToType: string, index = 0) {
        await page.locator(elementToType).nth(index).fill(textToType);
    }

    async clickByText (parentElementSelector: string, text: string, index = 0) {
        await page.locator(parentElementSelector, {hasText: text}).nth(index).click()
    }

    async safeClick (elementLocator: string, timeout = 5000) {
        await this.waitForElementClickable(elementLocator, timeout);
        await page.locator(elementLocator).click();
    }

    async pressEnter () {
        await page.keyboard.press('Enter');
    }

    async pressEsc () {
        await page.keyboard.press('Escape');
    }

    async pressCopyPaste () {
        await page.keyboard.press('Control+Insert');
        await page.keyboard.press('Shift+Insert');
    }

    async clickOutside (elementLocator: string) {
        await page.locator(elementLocator).click({position: {x: -20, y: -20}, force: true});
    }

    async rightClick (x = 0, y = 0) {
        await page.mouse.click(x, y, {button: 'right'});
    }

    async leftClick () {
        await page.mouse.click(1, 1, {button: 'left'});
    }

    async mouseMove (elementLocator: string, coordinates = { x: 0, y: 0 }, index = 0) {
        await page.locator(elementLocator).nth(index).hover({force: true});
        if(coordinates.x !== 0 || coordinates.y !== 0) {
            const box = await page.locator(elementLocator).boundingBox();
            await page.mouse.move(box.x + coordinates.x, box.y + coordinates.y);
        }
    }

    async mouseMoveCoordinates (coordinates: { x: number, y: number }) {
        const x = coordinates.x ? coordinates.x : 0;
        const y = coordinates.y ? coordinates.y : 0;
        await page.mouse.move(x, y);
    }

    async clickNow () {
        await page.mouse.down();
        await page.mouse.up();
    }

    async dragDrop (elementLocator1: string, elementLocator2: string) {
        await this.dragElement(elementLocator1);
        await this.dropElement(elementLocator2);
    }

    async dragElement (elementLocator: string, coordinates = {x: 0, y: 0}) {
        await page.locator(elementLocator).first().hover({force: true});
        if(coordinates.x !== 0 || coordinates.y !== 0) {
            const box = await page.locator(elementLocator).first().boundingBox();
            await page.mouse.move(box.x + coordinates.x, box.y + coordinates.y);
        }
        await page.mouse.down();
    }

    async focus (elementLocator: string) {
        await page.locator(elementLocator).focus();
    }

    async dropElement (elementLocator: string, coordinates = {x: 0, y: 0}) {
        await page.locator(elementLocator).first().hover({force: true});
        if(coordinates.x !== 0 || coordinates.y !== 0) {
            const box = await page.locator(elementLocator).boundingBox();
            await page.mouse.move(box.x + coordinates.x, box.y + coordinates.y);
        }
        await page.mouse.up();
    }

    async uploadFile (inputElementLocator: string, fileToUpload = './mocks/empty.txt') {
        await page.locator(inputElementLocator).setInputFiles(fileToUpload);
    }

    async uploadIframeFile (inputElementLocator: string, fileToUpload = './mocks/empty.txt', index = 0) {
        await page.frameLocator('iframe').nth(index).locator(inputElementLocator).setInputFiles(fileToUpload);
    }

    /** --- ASSERTIONS  --- **/
    async isCurrentUrlContain (expectedUrl: any, equal = true) {
        console.log(await page.url());
        if (equal) {
            await expect(await page.url()).toContain(expectedUrl);
        } else {
            await expect(await page.url()).not.toContain(expectedUrl);
        }
    }

    async isDisplayedElem (elementLocator: string, index = 0) {
        await expect(page.locator(elementLocator).nth(index)).toBeVisible();
    }

    async isDisplayedText (elementText: string, index = 0) {
        await expect(page.getByText(elementText).nth(index)).toBeVisible();
    }

    async isDisplayedIframeElem (elementLocator: string, index = 0) {
        await expect(page.frameLocator('iframe').first().locator(elementLocator).nth(index)).toBeVisible();
    }

    async isDisplayedElemEntity (element: any, index = 0) {
        await expect(element).toBeVisible();
    }

    async isPresentElem (elementLocator: string, index = 0, present = true) {
        if(present) {
            await expect(page.locator(elementLocator).nth(index)).toBeDefined();
        } else {
            await expect(page.locator(elementLocator).nth(index)).not.toBeDefined();
        }
    }

    async isPresentElemEntity (elementLocator: any) {
        await expect(elementLocator).toBeDefined();
    }

    async isNotVisible (elementLocator: string, index = 0) {
        await expect(page.locator(elementLocator).nth(index)).not.toBeVisible();
    }

    async isHiddenElem (elementLocator: string, hidden = true, index = 0) {
        if (hidden) {
            await expect(page.locator(elementLocator).nth(index)).toBeHidden();
        } else {
            await expect(page.locator(elementLocator).nth(index)).not.toBeHidden();
        }
    }

    async isHiddenElemEntity (element: any, hidden = true, index = 0) {
        if (hidden) {
            await expect(element.nth(index)).toBeHidden();
        } else {
            await expect(element.nth(index)).not.toBeHidden();
        }
    }

    async isDisabledElem (elementLocator: string, disabled = true, index = 0) {
        if (disabled) {
            await expect(page.locator(elementLocator).nth(index)).toBeDisabled();
        } else {
            await expect(page.locator(elementLocator).nth(index)).not.toBeDisabled();
        }
    }

    async isTextEqual (elementLocator: string, expectedText: string, equal = true, index = 0) {
        if (equal) {
            await expect(page.locator(elementLocator).nth(index)).toContainText(expectedText, {ignoreCase: true});
        } else {
            await expect(page.locator(elementLocator).nth(index)).not.toContainText(expectedText, {ignoreCase: true});
        }
    }

    async isTextIframeEqual (elementLocator: string, expectedText: string, equal = true, index = 0, iframeIndex = 0) {
        if (equal) {
            await expect(page.frameLocator('iframe').nth(iframeIndex).locator(elementLocator).nth(index)).toContainText(expectedText, {ignoreCase: true});
        } else {
            await expect(page.frameLocator('iframe').nth(iframeIndex).locator(elementLocator).nth(index)).not.toContainText(expectedText, {ignoreCase: true});
        }
    }

    async isTextEntityEqual (element: Locator, expectedText: string, equal = true, index = 0) {
        if (equal) {
            await expect(element.nth(index)).toContainText(expectedText, {ignoreCase: true});
        } else {
            await expect(element.nth(index)).not.toContainText(expectedText, {ignoreCase: true});
        }
    }

    async isInputValueEqual (inputLocator: string, expectedValue: string, index = 0) {
        await expect(page.locator(inputLocator).nth(index)).toHaveValue(new RegExp("^" + expectedValue + "|" + expectedValue + "$"));
    }

    async isInputValueContains (inputLocator: string, expectedValue: string, index = 0) {
        await expect(await page.locator(inputLocator).nth(index).inputValue()).toContain(expectedValue);
    }

     async isInputValueIframeEqual (inputLocator: string, expectedValue: string, index = 0) {
        await expect(page.frameLocator('iframe').first().locator(inputLocator).nth(index)).toHaveValue(new RegExp("^" + expectedValue + "|" + expectedValue + "$"));
    }

    async isLengthEqual (elementArrayLocator: string, expectedLength: number) {
        await expect(page.locator(elementArrayLocator)).toHaveCount(expectedLength);
    }

    async isLengthEntityEqual (elementArray: any, expectedLength: number) {
        await expect(elementArray).toHaveCount(expectedLength);
    }

    isStringContains (text1: string, text2: string) {
        expect(text1.trim()).toContain(text2.trim());
    }

    async isChecked (checkboxLocator: string, checked = true, index = 0) {
        if (checked) {
            await expect(page.locator(checkboxLocator).nth(index)).toBeChecked();
        } else {
            await expect(page.locator(checkboxLocator).nth(index)).not.toBeChecked();
        }
    }

    async isEnabled (elementLocator: string, enabled = true, index = 0) {
        if (enabled) {
            await expect(page.locator(elementLocator).nth(index)).toBeEnabled();
        } else {
            await expect(page.locator(elementLocator).nth(index)).not.toBeEnabled();
        }
    }

    async isLengthGreaterThan (elementArrayLocator: string, minLength: number) {
        await expect(await page.locator(elementArrayLocator).count()).toBeGreaterThan(minLength);
    }

    async isLengthIframeGreaterThan (elementArrayLocator: string, minLength: number) {
        await expect(await page.frameLocator('iframe').first().locator(elementArrayLocator).count()).toBeGreaterThan(minLength);
    }

    async isLengthLessThan (elementArrayLocator: string, minLength: number) {
        await expect(await page.locator(elementArrayLocator).count()).toBeLessThan(minLength);
    }

    async isHaveInfiniteScroll (pageLocator: string) {
        const currentLength = await page.locator(pageLocator).count();
        if(currentLength === 10) {
            await this.mouseMove(pageLocator, {x:0, y:0}, -1);
            await page.waitForTimeout(500);
            const newLength = await page.locator(pageLocator).count();
            await this.isNumberGreaterThan(newLength, currentLength);
        }
    }

    isNumberGreaterThan (num: number, minLength: number) {
        expect(num).toBeGreaterThan(minLength);
    }

    isNumberLessThan (num: number, maxLength: number) {
        expect(num).toBeLessThan(maxLength);
    }

    isNotNaN (num: number) {
        expect(num).not.toBeNaN();
    }

    isNumbersEqual (num1: number, num2: number, equal = true) {
        if (equal) {
            expect(num1).toEqual(num2);
        } else {
            expect(num1).not.toEqual(num2);
        }
    }

    isDefined (value: any, defined = true) {
        if (defined) {
            expect(value).not.toBeUndefined();
        } else {
            expect(value).toBeUndefined();
        }
    }

    isFalse (value: any) {
        expect(value).toEqual(false);
    }

    async isAttributeValueEql (element: string, attribute: string, attributeValue: string, index = 0) {
        if (await page.locator(element).nth(index).getAttribute(attribute)) {
            await expect(await page.locator(element).nth(index).getAttribute(attribute)).toContain(attributeValue);
        }
    }

    async isAttributeEntityValueEql (element, attribute: string, attributeValue: string, index = 0) {
        if (await element.nth(index).getAttribute(attribute)) {
            await expect(await element.nth(index).getAttribute(attribute)).toContain(attributeValue);
        }
    }

    async isAttributeExists (element: string, attribute: string, index = 0, exist = true) {
        if(exist) {
            await expect(await page.locator(element).nth(index).getAttribute(attribute)).not.toBeNull();
        } else {
            await expect(await page.locator(element).nth(index).getAttribute(attribute)).toBeNull();
        }
    }

    async isAttributeValueNOTEql (element: string, attribute: string, attributeValue: string, index = 0) {
        await expect(page.locator(element).nth(index)).not.toHaveAttribute(attribute, attributeValue);
    }

    async isItemsSortedByName (tableItemsLocator: string, order = 'ascending') {
        let sorted = [], unSorted = [];
        let name: any;
        if (await page.locator(tableItemsLocator).count() >= 1) {
            const files = await page.locator(tableItemsLocator);
            const count = await files.count();
            for (let i = 0; i < count; ++i) {
                name = await files.nth(i).textContent();
                if (name !== '' && name !== 'Never') {
                    unSorted[i] = name;
                }
            }
        }
        if (order === 'ascending') {
            sorted = unSorted.slice();
            sorted.sort(function (a, b) {
                a = a.toLowerCase();
                b = b.toLowerCase();
                if (a == b) return 0;
                return a < b ? -1 : 1;
            });
            expect(unSorted).toEqual(sorted);
        } else {
            sorted = unSorted.slice();
            sorted.sort(function (a, b) {
                a = a.toLowerCase();
                b = b.toLowerCase();
                if (a == b) return 0;
                return a > b ? -1 : 1;
            });
            expect(unSorted).toEqual(sorted);
        }
    }

    isTxtFileContentEqual (filename: string, content: string) {
        expect(fs.readFileSync(filename, {encoding: 'utf8'})).toEqual(content);
    }

    /** --- WAITERS  --- **/
    async waitForElement (locator: string, timeout = 5000, index = 0) {
        await page.locator(locator).nth(index).waitFor({timeout: timeout});
    }

    async waitForUrl (url: string, timeout = 5000) {
        await page.waitForURL(url);
    }

    async waitForElementClickable (elementLocator: string, timeout = 5000, index = 0) {
        await page.locator(elementLocator).nth(index).waitFor({state: 'visible', timeout: timeout});
    }

    /** --- API HELPERS  --- **/
    async loginByAPI (userEmail: string, userPass: string) {
        const resp = await page.request.post(`${getAPIUrl()}/api/auth/signin`, {
            data: {
                "username": userEmail,
                "password": userPass
            }
        })
        const response = await resp.json();
        await page.evaluate(
            `window.localStorage.setItem('authToken', JSON.stringify({token:'${response.token}', expires:'${response.expires}'}));`
        );
    }

    csvToArray (strData: string, strDelimiter = ",") {
        var objPattern = new RegExp(
            (
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
        );
        var arrData = [[]];
        var arrMatches = null;
        while (arrMatches = objPattern.exec(strData)) {
            var strMatchedDelimiter = arrMatches[1];
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
            ) {
                arrData.push([]);
            }
            var strMatchedValue;

            if (arrMatches[2]) {
                strMatchedValue = arrMatches[2].replace(
                    new RegExp("\"\"", "g"),
                    "\""
                );
            } else {
                strMatchedValue = arrMatches[3];
            }
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        return (arrData);
    }

    async headersPostLocalStorageToken () {
        const localStorage = await page.evaluate(() =>
            window.localStorage.authToken
        );
        const token = (JSON.parse(localStorage)).token;
        return {
            "accept": "*/*",
            "Content-Type": "application/json-patch+json",
            "Authorization": `Bearer ${token}`
        };
    }

    getCsvFilePath() {
        return `../support/downloads/${new Date().getDate()} Export.csv`;
    }

    getUser (tier: string): string {
        switch (tier) {
            case 'Individual Tier':
                return process.env.USER_EMAIL1;

            case 'Individual Tier New':
                return process.env.USER_EMAIL6;

            case 'Enterprise-User':
                return process.env.USER_EMAIL3;

            case 'Enterprise-Coworker':
                return process.env.USER_EMAIL5;

            case 'Business':
                return process.env.USER_EMAIL2;
        }
    }
}