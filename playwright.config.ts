import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Reporter to use */
    reporter: process.env.CI
        ? [['html'], ['./src/dummy-reporter/dummy-reporter.ts']]
        : [['html', { outputFolder: 'playwright-report', open: 'always' }]], // set to always open so that the report is visible after run

    /* Configure projects */
    projects: [
        {
            name: 'apiTests',
            use: {
                /* Base URL */
                baseURL: 'https://dummyjson.com',
                /* Collect trace when retrying the failed test */
                trace: 'on-first-retry',
            },
            testMatch: /.*.spec.ts/,
        },
    ],
});
