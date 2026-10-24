import { test as base, expect, chromium } from "@playwright/test";

/**
 * Fixture de navegador.
 *
 * Por defecto Playwright lanza su propio Chromium (el comportamiento normal en
 * CI o en local con `npx playwright install`). Si se define `PW_CDP_ENDPOINT`,
 * se conecta a un Chromium ya en ejecución mediante CDP: útil en entornos donde
 * no es posible descargar el navegador o faltan bibliotecas del sistema.
 */
export const test = base.extend({
  browser: async ({}, use) => {
    const endpoint = process.env.PW_CDP_ENDPOINT;
    if (!endpoint) {
      const browser = await chromium.launch();
      await use(browser);
      await browser.close();
      return;
    }

    const browser = await chromium.connectOverCDP(endpoint);
    await use(browser);
    // No se cierra: el navegador remoto pertenece al entorno de ejecución.
  },
});

export { expect };
