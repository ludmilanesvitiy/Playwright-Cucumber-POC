const config = {
  requireModule: ['ts-node/register'],
  require: ['src/**/*.ts'],
  format: [
    'json:reports/cucumber-report.json',
    'html:reports/report.html',
      'junit:reports/junit.xml',
    'summary',
    'progress-bar',
  ],
  formatOptions: { snippetInterface: 'async-await', colorsEnabled: true },
  publishQuiet: true,
};

export default config;
