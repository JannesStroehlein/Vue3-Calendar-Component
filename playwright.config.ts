import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    trace: 'on-first-retry',
  },

  projects: [
    // Component testing project (using regular Playwright with custom test pages)
    {
      name: 'component-tests',
      testDir: './tests/e2e/components',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3100',
      },
    },
    // E2E testing projects
    {
      name: 'e2e-chromium',
      testDir: './tests/e2e/integration',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:3000',
      },
    },
    {
      name: 'e2e-firefox',
      testDir: './tests/e2e/integration',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'http://127.0.0.1:3000',
      },
    },
    {
      name: 'e2e-webkit',
      testDir: './tests/e2e/integration',
      use: {
        ...devices['Desktop Safari'],
        baseURL: 'http://127.0.0.1:3000',
      },
    },
  ],

  webServer: [
    // Component test server
    {
      command: 'npm run test:ct-server',
      port: 3100,
      reuseExistingServer: !process.env.CI,
    },
    // Main app server for E2E tests
    {
      command: 'npm run dev',
      url: 'http://127.0.0.1:3000',
      reuseExistingServer: !process.env.CI,
    },
  ],
})
