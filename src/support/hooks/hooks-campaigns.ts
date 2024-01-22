import { After, Before} from '@cucumber/cucumber';
import { CustomWorld } from '../custom-world';
import { headersPostGenerateToken } from '../helpers/http.helper';
import { CampaignPage } from '../pages/campaign.page';

const page = new CampaignPage();
let campaignID, workflowID;

Before({tags: '@campaign'}, async function (this: CustomWorld) {
    const token = await headersPostGenerateToken();
    if ((await (await page.getCampaignByNameByAPI()).json()).data.filter(campaign => campaign.name === this.nameService.getCurrentNamePerDay()).length === 0) {
        await page.createCampaignByAPI(this.nameService.getCurrentNamePerDay(), workflowID, 111, token);
    } else {
        await console.log('Campaign for today is already created - ' + this.nameService.getCurrentNamePerDay());
    }
});

Before({tags: '@campaign-draft'}, async function (this: CustomWorld) {
    const token = await headersPostGenerateToken();
    campaignID = (await (await page.createCampaignByAPI(this.nameService.getCurrentName(), workflowID, 111, token)).json()).id;
});

After({tags: '@campaign-draft'}, async function (this: CustomWorld) {
    await page.removeCampaignByAPI(campaignID);
});