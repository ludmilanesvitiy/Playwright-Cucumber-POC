import { BasePage } from './base.page';
import { page } from '../common-hooks';
import { getAPIUrl, headersPostGenerateToken, headersPostGenerateTokenForFile } from '../helpers/http.helper';
import * as path from 'path';
import * as fs from 'fs';
import { expect } from '@playwright/test';

export class FilesPage extends BasePage {
    h1 = ('h1');
    h2 = ('h2');
    companyFiles = ('.folders-title');
    filesItemsSelector: string = '.table-grid-cell';
    fileNamesSelector: string = '.files-table_file-name';
    foldersContainersSelector: string = '.folders-container';
    foldersSelector: string = '.folder';
    foldersContainers = (this.foldersContainersSelector);
    folderSelectedEllipsis = ('.focusable.selected .folder-actions.dropdown');

    async isFilesSortedByName (filesViewParent: string) {
        let sorted = [], unSorted = [];
        const filesItems = page.locator(filesViewParent).filter({has: page.locator(this.filesItemsSelector)});
        if (await filesItems.count() >= 1) {
            for (let i = 0; i < await page.locator(filesViewParent).filter({has: page.locator(this.fileNamesSelector)}).count(); i++) {
                unSorted[i] = (await page.locator(filesViewParent).filter({has: page.locator(this.fileNamesSelector)}).nth(i).allTextContents())[0];
            }
        }
        sorted = unSorted.slice();
        sorted.sort(function (a, b) {
            a = a.toLowerCase();
            b = b.toLowerCase();
            if (a == b) return 0;
            return a < b ? -1 : 1;
        });
        expect(sorted).toEqual(unSorted);
    }

    async addFileByAPI (folderName: string, parent: 'company' | 'my', token?: any, userEmail?: string) {
        const anotherToken = userEmail ? await headersPostGenerateToken(userEmail) : token;
        const parentFolder = parent === 'company' ? 'companies' : 'users';
        const folderID = 'test';
        const fileToUpload = '../../../mocks/test.bmp';
        const absolutePath = path.resolve(__dirname, fileToUpload);
        const stream = fs.createReadStream(absolutePath);
        const response = await page.request.post(`${getAPIUrl()}/api/${parentFolder}/my/folders/${folderID}/files`, {
            headers: token || await headersPostGenerateTokenForFile(userEmail),
            multipart:
                {
                    file: stream
                }
        });
        if (response.ok()) {
            console.log('I\'ve added file by API');
            return response;
        } else {
            console.log('I\'ve tried to add file by API, but got error ' + await response.text());
        }
    }
}
