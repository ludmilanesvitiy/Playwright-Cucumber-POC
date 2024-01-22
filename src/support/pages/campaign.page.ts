import { BasePage } from './base.page';
import { getAPIUrl, headersPostGenerateToken } from '../helpers/http.helper';
import { page } from '../common-hooks';

export class CampaignPage extends BasePage {
	mainComponent = 'campaigns-page';
	h1 = 'h1';
	description = '.campaign-edit-page_header p';
	search = '.table-search';
	searchInput = '.table-search input';

	getSortableElement(headerName: string) {
		return `.table-header-row span >> text=${headerName} >> img[alt="sort"]`;
	}

	getDropdownItem(filterName: string) {
		return `.dropdown-menu.show .dropdown-item >> text=${filterName}`;
	}

	async createCampaignByAPI(campaignName: string, workflowID: number, companyID: number, headers?: any) {
		const response = await page.request.post(
			`${getAPIUrl()}/api/UserTaskCampaigns`,
			{
				headers: headers || (await this.headersPostLocalStorageToken()),
				data: {
					name: campaignName,
					description: campaignName,
					workflowId: workflowID,
					audience: {
						assignments: [
							{
								company: {
									id: companyID,
								},
								communicationRoles: [
									{
										key: 'GeneralManagement',
										title: 'General Management',
										sortOrder: 1,
									}
									],
								userContacts: [],
							},
						],
					},
				},
			}
		);
		if (response.ok()) {
			console.log('I\'ve created a campaign by API');
			return response;
		} else {
			console.log(
				'I\'ve tried to create campaign by API, but got error ' + await response.text()
			);
		}
	}

	async getCampaignByNameByAPI(query = '') {
		const response = await page.request.get(
			`${getAPIUrl()}/api/search?by=name&order=asc&offset=0&limit=15&name=${query}`,
			{
				headers: await headersPostGenerateToken(),
			}
		);
		if (response.ok()) {
			console.log('I\'ve got a campaign name by API');
			return response;
		} else {
			console.log('I\'ve tried to get campaign by name by API, but got error ' + await response.statusText());
		}
	}

	async removeCampaignByAPI(campaignID: number) {
		const response = await page.request.delete(
			`${getAPIUrl()}/api/${campaignID}`,
			{
				headers: await this.headersPostLocalStorageToken(),
			}
		);
		if (response.ok()) {
			console.log('I\'ve removed a campaign by API');
			return response;
		} else {
			console.log(
				'I\'ve tried to remove campaign by API, but got error ' + await response.statusText());
		}
	}
}
