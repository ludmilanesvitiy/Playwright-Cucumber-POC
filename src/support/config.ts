import { LaunchOptions } from '@playwright/test';
require('dotenv').config();

const browserOptions: LaunchOptions = {
  slowMo: 0,
  args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
  firefoxUserPrefs: {
    'media.navigator.streams.fake': true,
    'media.navigator.permission.disabled': true,
  },
};

export const config = {
  browser: process.env.BROWSER || 'chromium',
  browserOptions,
  BASE_URL: process.env.URL,
  IMG_THRESHOLD: { threshold: 0.4 },
  BASE_API_URL: process.env.API_URL,
};
