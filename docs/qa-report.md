# Informe de QA — Ona Rigola

Fecha de la revisión: 24 de octubre de 2026.
Entorno: contenedor Linux Debian 12, Node 22.22.3, npm 10.9.8.

## 1. Verificación técnica

| Comprobación             | Comando                                   | Resultado                                                          |
| ------------------------ | ----------------------------------------- | ------------------------------------------------------------------ |
| Tipos en modo estricto   | `npm run typecheck` (`tsc --noEmit`)      | ✅ Sin errores                                                     |
| Lint                     | `npm run lint`                            | ✅ Sin errores ni avisos                                           |
| Formato                  | `npm run format:check`                    | ✅ Todos los archivos formateados                                  |
| Build de producción      | `npm run build`                           | ✅ 21 páginas (17 rutas + 4 fichas SSG), sin avisos de compilación |
| Contraste WCAG           | `npm run a11y:contrast`                   | ✅ 13/13 pares por encima del umbral declarado                     |
| Instalación reproducible | `npm ci` (lockfile con versiones fijadas) | ✅                                                                 |

Dependencias fijadas con versión exacta (`--save-exact`) y `package-lock.json`
versionado.

## 2. Pruebas E2E (Playwright)

Comando: `npm run test:e2e` (proyectos `escritorio` 1440×900 y `movil` Pixel 7).
Resultado: **46 pruebas, 46 correctas**.

Cobertura:

1. Las 9 rutas públicas responden 200 y tienen un único `h1` con el título esperado.
2. Ruta inexistente → HTTP 404 con la página 404 de marca y enlace de vuelta.
3. La ficha de demostración sirve `meta robots noindex` y muestra el aviso de demostración.
4. `sitemap.xml`, `robots.txt` y `opengraph-image` se generan (200 y `image/png`).
5. La navegación (escritorio y menú móvil) lleva a «Trabajos» y «Sobre mí».
6. El CTA «Solicita una cita» lleva a `/contacto` y muestra el formulario.
7. Rastreo de todos los enlaces internos de todas las páginas: ninguna respuesta ≥ 400.
8. Menú móvil: se abre, atrapa el foco, se cierra con `Escape`, navega y se cierra al
   cambiar de ruta.
9. Validación del formulario: nombre, correo, idea mínima de 20 caracteres y consentimiento;
   `aria-invalid="true"` en el campo con error.
10. Envío sin proveedor configurado: no se declara éxito y se explica que no se ha enviado.
11. El endpoint rechaza payloads inválidos con `400` y errores por campo.
12. La imagen principal tiene `alt` descriptivo y no hay errores de consola ni de red.
13. Títulos, descripciones (> 60 caracteres) y canónicas únicas en las 9 páginas.
14. Todos los bloques JSON-LD se parsean como JSON válido.
15. No existen enlaces `href="#"` ni `href=""`.

### Nota sobre el entorno de ejecución de Playwright

Este entorno de trabajo no permite descargar el navegador de Playwright (el CDN no es
accesible) ni instalar paquetes del sistema. Para no renunciar a las pruebas se ejecutó un
Chromium headless precompilado ya presente en la sandbox, conectado por CDP mediante
`PW_CDP_ENDPOINT` (fixture en `tests/e2e/fixtures.ts`). En un entorno normal basta con:

```bash
npm run test:e2e:install
npm run test:e2e
```

`playwright.config.ts` arranca `build + start` automáticamente si no hay servidor
(`reuseExistingServer`), salvo que se defina `PLAYWRIGHT_SKIP_SERVER=1`.

## 3. Inspección visual real

Capturas generadas con Chromium headless a **360, 390, 430, 768, 1024, 1280, 1440 y 1920 px**
en las 11 rutas (incluida la 404) y revisadas una a una.

Comprobaciones y correcciones aplicadas tras la revisión:

| Hallazgo                                                                  | Corrección                                                                                                                     |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| En móvil, el CTA de la cabecera rompía la línea del logotipo a 360–430 px | Se oculta el CTA de cabecera por debajo de 44 rem; el acceso a la cita sigue disponible en el menú y en el cuerpo de la página |
| El titular móvil quedaba corto frente a la referencia                     | Escala móvil hasta `23.5vw` con versalitas, como en la referencia                                                              |
| El retrato móvil era excesivamente alto y empujaba el titular             | Ancho máximo de 30 rem centrado en móvil                                                                                       |
| Los metadatos del portfolio se partían mal en 360 px                      | Metadatos apilados por debajo de 30 rem y etiqueta más corta                                                                   |
| Contador del portfolio mostraba «04 / 04»                                 | Ahora «01 / 04», igual que la referencia                                                                                       |
| Enlaces de acción con altura < 24 px                                      | Todos los enlaces de acción tienen `min-height` ≥ 2.25 rem                                                                     |
| Elementos de formulario del campo trampa generaban desbordamiento lateral | Se sustituye el posicionamiento fuera de pantalla por la técnica `clip-path`                                                   |
| Imagen de detalle repetida en «Sobre mí»                                  | Se sustituye por un bloque tipográfico (cita) para no repetir el retrato                                                       |

Estado final medido por script en todas las rutas y anchos: **desbordamiento horizontal 0
en todas las combinaciones** y ningún elemento interactivo por debajo de 24 px (salvo
enlaces dentro de texto, permitidos por WCAG 2.5.8).

## 4. Accesibilidad

- Navegación por teclado verificada: el primer `Tab` enfoca «Saltar al contenido» con
  `outline: solid` visible; el segundo, el logotipo.
- Sin errores de consola ni avisos de hidratación en ninguna ruta.
- Estructura de encabezados revisada página por página (un solo `h1`, sin saltos).
- Formulario con etiquetas asociadas, `aria-describedby` para errores y región `aria-live`.
- Diálogo móvil con `aria-modal`, `aria-expanded` en el disparador y foco devuelto al cerrar.
- `prefers-reduced-motion` aplicado de forma global.
- Contraste calculado con script (`scripts/check-contrast.mjs`) sobre los pares reales.

No se ha ejecutado una auditoría automática tipo axe-core ni una prueba con lector de
pantalla real: no estaban disponibles en el entorno. Recomendado antes de publicar.

## 5. SEO técnico

- Una canónica por página, títulos y descripciones únicos (comprobado en pruebas).
- `sitemap.xml` con 9 URLs públicas; las fichas de demostración quedan fuera.
- `robots.txt`: bloqueo total cuando `NEXT_PUBLIC_SITE_URL` es local/preview; en producción
  permite todo salvo `/api/` y declara el sitemap.
- JSON-LD válido sintácticamente en todas las páginas (parseado en pruebas).
- Sin datos estructurados que afirmen datos no verificados (dirección, horarios, reseñas,
  precios, premios).

Pendiente de validación con herramientas oficiales (requieren red y dominio público):
Rich Results Test, Schema Markup Validator, Search Console y PageSpeed Insights.

## 6. Rendimiento

- Build sin librerías de animación; tres islas de cliente.
- Retrato crítico con `priority`/`fetchPriority="high"`; resto perezoso.
- Imágenes AVIF/WebP vía `next/image`, con `sizes` por punto de ruptura.
- Sin CLS esperado: dimensiones explícitas y `aspect-ratio` en todos los medios.

No se han medido LCP/INP/CLS en campo ni en laboratorio con Lighthouse (no disponible en el
entorno). Los valores objetivo del encargo quedan como criterio de diseño, no como
resultado medido.

## 7. Riesgos y tareas antes de publicar

1. Cargar fotografías reales del portfolio y cambiar `contentStatus` a `"final"`.
2. Configurar el proveedor de correo y probar un envío real de extremo a extremo.
3. Completar los datos legales y hacer revisar los textos por un profesional.
4. Publicar el dominio definitivo en `NEXT_PUBLIC_SITE_URL` y verificar `robots.txt`.
5. Ejecutar Lighthouse, axe-core y una prueba con lector de pantalla en el dominio real.
6. Decidir si se añade un `LocalBusiness` real (dirección/horarios) a los datos
   estructurados cuando exista estudio físico.
