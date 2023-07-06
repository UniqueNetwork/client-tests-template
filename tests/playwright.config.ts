import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    timeout: 180000,
    use: {
        viewport: { width: 1280, height: 720 },
        baseURL: 'localhost:8000',
        channel: 'chromium',
        video: 'off',
        actionTimeout: 30000
    }
};

export default config;
