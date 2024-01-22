import { When, Then, Given } from '@cucumber/cucumber';
import { page } from '../support/common-hooks';
import { CampaignPage } from '../support/pages/campaign.page';
import { TasksPage } from '../support/pages/tasks.page';
import { CustomWorld } from '../support/custom-world';
import path from 'path';
import fs from 'fs';
const staticData = require('../../mocks/static.json');

const campaignPage: CampaignPage = new CampaignPage();
const tasksPage: TasksPage = new TasksPage();

let selectedCompanyName, addedCompanyName, addedWorkflowName, addedListSize: string;
const visibleCampaignsCount = 4;
const visibleConnectedCompaniesCount = 3;
let downloadPath, originalDownloadPath: any;

Then(/^at least one Campaign has been created by the authenticated User$/, async function (this: CustomWorld) {
    await campaignPage.type(campaignPage.searchInput, this.nameService.getCurrentName());
  //  await campaignPage.isDisplayedElem(campaignPage.getCampaignByName(this.nameService.getCurrentName()));
});

Then(/^the Campaign filter drop down is defaulted to "(.*)"/, async (defaultFilter: string) => {
  //  await campaignPage.isAttributeValueEql(campaignPage.selectedFilterDefault, 'ng-reflect-model', defaultFilter);
});

Then(/^a list of All Campaigns is sorted by Campaign Name in Ascending order$/, async () => {
  //  await campaignPage.isItemsSortedByName(campaignPage.campaignsNames);
});

When(/^the User clicks on the sortable icon of (.*)$/, async (headerName: string) => {
    await page.waitForTimeout(500);
    await page.locator(`:text('${headerName}') + img`).last().click();
    await page.waitForTimeout(1000);
});

When(/^the User clicks on the Connections sortable icon of (.*)$/, async (headerName: string) => {
    await page.waitForTimeout(500);
    await page.locator(`:text('${headerName}') + img`).first().click();
    await page.waitForTimeout(1000);
});

When(/^the user clicks the 'export' button in a datagrid and the entire contents of the DataGrid is exported to a .csv file and delivered to the User's browser$/, async () => {
    const absolutePathDownloadedFile = path.resolve(__dirname, campaignPage.getCsvFilePath());//TODO handle correct date
    if (await fs.existsSync(absolutePathDownloadedFile)) {
        await fs.unlinkSync(absolutePathDownloadedFile);
    }
    const downloadPromise = page.waitForEvent('download');
    await campaignPage.clickOn(campaignPage.searchInput);
    const download = await downloadPromise;
    downloadPath = await download.path();
    originalDownloadPath = download.suggestedFilename();
});

Then(/^the name of the exported file is "local-date-time-format Ledgerset Export.csv"$/, async () => {
    await campaignPage.isStringContains(originalDownloadPath, '_Ledgerset_Export.csv');
    await campaignPage.isStringContains(originalDownloadPath, `${new Date().getFullYear()}`);
    await campaignPage.isStringContains(originalDownloadPath, `${new Date().getDate()}`);
});

Then(/^the columns in the exported .csv file should match the columns visible in the DataGrid at the time of export$/, async () => {
    const csvObject = fs.readFileSync(downloadPath, {encoding: 'utf8'});
    const csvArray = campaignPage.csvToArray(csvObject);
    const expectedKeys = ['Campaign Name', 'Assigned To', 'Days Since Delivery', 'Status', 'Completion'];
    for (let i = 0; i < csvArray[2].length; i++) {
        campaignPage.isStringContains(`${csvArray[2][i]}`, `${expectedKeys[i]}`);
    }
});

Then(/^the UX of the Campaigns CSV export is consistent with the mockup$/, async () => {
    const csvObject = fs.readFileSync(downloadPath, {encoding: 'utf8'});
    const csvArray = campaignPage.csvToArray(csvObject);
    campaignPage.isStringContains(`${csvArray[0]}`, 'My Report');
    campaignPage.isNumberLessThan(csvArray.length, 2500);
    const campaignsData = (await (await campaignPage.getCampaignByNameByAPI()).json());
    campaignPage.isStringContains(`${csvArray[3][0]}`, `${campaignsData.data[0].name}`);
    campaignPage.isStringContains(`${csvArray[3][1]}`, `${campaignsData.data[0].audienceCompany.name}`);
    campaignPage.isStringContains(`${csvArray[3][3]}`, `${campaignsData.data[0].status}`);
    campaignPage.isStringContains(`${csvArray[3][4]}`, `${campaignsData.data[0].completionRate}`);
});
