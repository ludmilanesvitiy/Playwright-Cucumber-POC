export interface Token {
    "accept": string,
    "Content-Type": string,
    "Authorization": string
}

export interface CompanyData {
    publicData: {
        "websiteUrl": string,
        "productCategories": any,
        "tickerSymbol": string,
        "subIndustries": any,
        "businessType": { id: number, key: string, sortOrder: number, title: string },
        "numberOfEmployeesType": any,
        "companyType": any,
        "legalType": any,
        "annualRevenue": any,
        "yearStarted": number
    }
}
