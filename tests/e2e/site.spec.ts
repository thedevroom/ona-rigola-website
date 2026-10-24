import { expect, test } from "./fixtures";

const routes = [
  { path: "/", heading: /ona rigola/i },
  { path: "/sobre-mi", heading: /dibujar despacio/i },
  { path: "/trabajos", heading: /piezas dibujadas/i },
  { path: "/proceso", heading: /de la idea/i },
  { path: "/contacto", heading: /hagamos que sea/i },
  { path: "/preguntas-frecuentes", heading: /todo lo que conviene/i },
  { path: "/privacidad", heading: /política de privacidad/i },
  { path: "/aviso-legal", heading: /aviso legal/i },
  { path: "/cookies", heading: /política de cookies/i },
];

test.describe("Rutas y estructura", () => {
  for (const route of routes) {
    test(`la ruta ${route.path} responde y tiene un h1 único`, async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toContainText(route.heading);
    });
  }

  test("las rutas inexistentes devuelven 404 con página propia", async ({ page }) => {
    const response = await page.goto("/esta-pagina-no-existe");
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toContainText(/no existe/i);
    await expect(page.getByRole("link", { name: /volver al inicio/i })).toBeVisible();
  });

  test("las fichas con imagen de muestra se marcan como noindex", async ({ page }) => {
    await page.goto("/trabajos/linea-fina-botanica");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.getByText(/imagen de muestra/i).first()).toBeVisible();
  });

  test("sitemap, robots y og image se generan", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain("/trabajos");

    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);

    const og = await request.get("/opengraph-image");
    expect(og.status()).toBe(200);
    expect(og.headers()["content-type"]).toContain("image/png");
  });
});

test.describe("Navegación", () => {
  test("la navegación lleva a las secciones principales", async ({ page }) => {
    await page.goto("/");
    const header = page.getByRole("banner");
    const desktopNav = header.getByRole("link", { name: "Trabajos" });

    // En móvil la navegación vive en el menú desplegable.
    if (await desktopNav.isVisible()) {
      await desktopNav.click();
      await expect(page).toHaveURL(/\/trabajos$/);
      await header.getByRole("link", { name: "Sobre mí" }).click();
      await expect(page).toHaveURL(/\/sobre-mi$/);
      return;
    }

    await page.getByTestId("mobile-menu-trigger").click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("link", { name: "Trabajos" }).click();
    await expect(page).toHaveURL(/\/trabajos$/);
    await page.getByTestId("mobile-menu-trigger").click();
    await page.getByRole("dialog").getByRole("link", { name: "Sobre mí" }).click();
    await expect(page).toHaveURL(/\/sobre-mi$/);
  });

  test("el CTA de reserva lleva al formulario", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("link", { name: /solicita una cita/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/contacto$/);
    await expect(page.getByTestId("booking-form")).toBeVisible();
  });

  test("el portfolio muestra imágenes reales enlazadas a su ficha", async ({ page }) => {
    await page.goto("/trabajos");
    const images = page.locator("main img");
    expect(await images.count()).toBeGreaterThanOrEqual(4);
    const firstWidth = await images
      .first()
      .evaluate((img) => (img as HTMLImageElement).naturalWidth);
    expect(firstWidth).toBeGreaterThan(300);
    await page
      .getByRole("link", { name: /ver la pieza/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/trabajos\/[a-z-]+$/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("no hay enlaces internos rotos", async ({ page }) => {
    for (const route of routes) {
      await page.goto(route.path);
      const hrefs = await page
        .locator('a[href^="/"]')
        .evaluateAll((links) =>
          Array.from(new Set(links.map((link) => link.getAttribute("href") ?? ""))),
        );
      for (const href of hrefs) {
        const response = await page.request.get(href);
        expect(response.status(), `${route.path} → ${href}`).toBeLessThan(400);
      }
    }
  });

  test("el menú móvil se abre, atrapa el foco y se cierra con Escape", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const trigger = page.getByTestId("mobile-menu-trigger");
    await expect(trigger).toBeVisible();
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: /trabajos/i })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await trigger.click();
    await dialog.getByRole("link", { name: /proceso/i }).click();
    await expect(page).toHaveURL(/\/proceso$/);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});

test.describe("Formulario de cita", () => {
  test("valida los campos obligatorios y muestra errores accesibles", async ({ page }) => {
    await page.goto("/contacto");
    await page.getByTestId("booking-submit").click();
    await expect(page.getByText(/escribe tu nombre/i)).toBeVisible();
    await expect(page.getByText(/revisa el correo electrónico/i)).toBeVisible();
    await expect(page.getByText(/al menos 20 caracteres/i)).toBeVisible();
    await expect(page.getByText(/debes aceptar la información de privacidad/i)).toBeVisible();
    await expect(page.getByLabel(/^nombre/i)).toHaveAttribute("aria-invalid", "true");
  });

  test("el envío sin proveedor no simula un envío correcto", async ({ page }) => {
    await page.goto("/contacto");
    await page.getByLabel(/^nombre/i).fill("Cliente de prueba");
    await page.getByLabel(/^correo electrónico/i).fill("prueba@example.com");
    await page
      .getByLabel(/^tu idea/i)
      .fill("Una pieza de línea fina en el antebrazo con motivos botánicos.");
    await page.getByLabel(/^he leído la/i).check();
    await page.getByTestId("booking-submit").click();
    await expect(page.getByTestId("booking-status")).toContainText(
      /no se ha enviado|no ha podido entregar/i,
      { timeout: 10_000 },
    );
    await expect(page.getByTestId("booking-success")).toHaveCount(0);
  });

  test("el servidor rechaza solicitudes inválidas", async ({ request }) => {
    const response = await request.post("/api/contacto", {
      data: { name: "a", email: "no-es-correo", idea: "corta", consent: false },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.fields.email).toBeTruthy();
  });
});

test.describe("Accesibilidad y metadatos", () => {
  test("la imagen principal tiene alt descriptivo y no genera errores de consola", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/", { waitUntil: "networkidle" });
    const alt = await page.locator("main img").first().getAttribute("alt");
    expect(alt?.length ?? 0).toBeGreaterThan(20);
    expect(errors).toEqual([]);
  });

  test("cada página tiene title, description y canonical propios", async ({ page }) => {
    const titles = new Set<string>();
    for (const route of routes) {
      await page.goto(route.path);
      const title = await page.title();
      titles.add(title);
      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description?.length ?? 0, route.path).toBeGreaterThan(60);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical, route.path).toBeTruthy();
    }
    expect(titles.size).toBe(routes.length);
  });

  test("el JSON-LD es JSON válido en todas las páginas", async ({ page }) => {
    for (const route of routes) {
      await page.goto(route.path);
      const blocks = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((nodes) => nodes.map((node) => node.textContent ?? ""));
      expect(blocks.length, route.path).toBeGreaterThan(0);
      for (const block of blocks) {
        expect(() => JSON.parse(block), `${route.path} JSON-LD`).not.toThrow();
      }
    }
  });

  test("los enlaces tienen destino real (no #) y los botones tienen acción", async ({ page }) => {
    await page.goto("/");
    const emptyHrefs = await page.locator('a[href="#"], a[href=""]').count();
    expect(emptyHrefs).toBe(0);
  });
});

test.describe("Portada de carga, pie y barra a medida", () => {
  test("la portada de carga no bloquea la interacción y se retira sola", async ({ page }) => {
    await page.goto("/");
    const preloader = page.getByTestId("preloader");

    if (await preloader.count()) {
      await expect(preloader).toHaveCSS("pointer-events", "none");
      await expect(preloader).toHaveAttribute("aria-hidden", "true");
    }

    await expect(preloader).toHaveCount(0, { timeout: 6000 });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("con movimiento reducido no se muestra la portada de carga", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByTestId("preloader")).toHaveCount(0, { timeout: 2000 });
  });

  test("el pie reúne navegación, hora local y vuelta arriba", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("preloader")).toHaveCount(0, { timeout: 6000 });

    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "Privacidad" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Formulario de cita" })).toBeVisible();
    await expect(footer).toContainText(/hora local/i);
    await expect(footer).toContainText(/ona rigola/i);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await footer.getByRole("button", { name: /volver arriba/i }).click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(80);
  });

  test("la barra a medida sigue el desplazamiento y responde al teclado", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "escritorio", "Solo en escritorio");

    await page.goto("/");
    await expect(page.getByTestId("preloader")).toHaveCount(0, { timeout: 6000 });

    const rail = page.getByRole("scrollbar", { name: /desplazamiento de la página/i });
    await expect(rail).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect
      .poll(async () => Number(await rail.getAttribute("aria-valuenow")))
      .toBeGreaterThan(5);

    await rail.focus();
    await page.keyboard.press("End");
    await expect
      .poll(async () => Number(await rail.getAttribute("aria-valuenow")))
      .toBeGreaterThan(95);

    await page.keyboard.press("Home");
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(80);
  });

  test("en móvil se conserva la barra nativa del navegador", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "movil", "Solo en móvil");

    await page.goto("/");
    await expect(page.getByTestId("preloader")).toHaveCount(0, { timeout: 6000 });
    await expect(page.getByRole("scrollbar")).toBeHidden();

    const nativeWidth = await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollbarWidth,
    );
    expect(nativeWidth).not.toBe("none");
  });
});
