import { defineConfig, devices } from "@playwright/test";

/**
 * Configuración de Playwright.
 *
 * `reuseExistingServer` permite ejecutar las pruebas contra un servidor ya
 * levantado (`npm run build && npm start`). En CI se arranca automáticamente.
 */
const PORT = Number(process.env.PORT ?? 3000);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    locale: "es-ES",
    timezoneId: "Europe/Madrid",
  },
  projects: [
    {
      name: "escritorio",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    { name: "movil", use: { ...devices["Pixel 7"] } },
  ],
  webServer: process.env.PLAYWRIGHT_SKIP_SERVER
    ? undefined
    : {
        command: "npm run build && npm start",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 180_000,
      },
});
