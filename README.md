# Playwright-Cucumber-POC

Cucumber(7) with Playwright using Typescript.

## To run tests

`npm run all` runs all tests
`npm run fit` run the single feature with @fit tag

## Browser selection

By default we will use chromium. 
Available options: chromium, firefox, webkit

## To ignore a scenario
- tag the scenario with `@ignore`

## To run a specific a scenario
- tag the scenario with `@fit`
- run command `npm run fit`

NOTE: Repository contains examples of correct configuration, setup and basic relationships between components\objects.
Before usage, need to specify required scenarios, .env file with configurations and all elements, necessary to operate.