import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import * as messages from '@cucumber/messages';
import { BrowserContext, Page, PlaywrightTestOptions, APIRequestContext } from '@playwright/test';
import { page } from './common-hooks';

export class NameService {
    private currentName: string;
    private currentNamePerDay: string;
    private featureList = [
        '*.feature',
    ];

    constructor () {
        this.createNamesByFeature();
    }

    createNamesByFeature () {
        this.featureList.forEach((index) => {
            this.currentName = `CustomName-${Date.now()}`;
            this.currentNamePerDay = `CustomName-${new Date().toDateString()}`;
        });
    }

    getCurrentName () {
        return this.currentName;
    }

    getCurrentNamePerDay () {
        return this.currentNamePerDay;
    }
}

export interface CucumberWorldConstructorParams {
    parameters: { [key: string]: string };
}

export interface ICustomWorld extends World {
    debug: boolean;
    feature?: messages.Pickle;
    context?: BrowserContext;
    page?: Page;
    nameService?: NameService;

    testName?: string;
    startTime?: Date;

    server?: APIRequestContext;

    playwrightOptions?: PlaywrightTestOptions;
}

export class CustomWorld extends World implements ICustomWorld {
    constructor (options: IWorldOptions) {
        super(options);
    }

    debug = false;
    nameService = new NameService();
    page = page;
}

setWorldConstructor(CustomWorld);
