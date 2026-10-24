# ONA RIGOLA — Tattoo Artist

Sitio web oficial de **Ona Rigola**, tatuadora independiente en Barcelona. Proyecto
editorial en español construido con Next.js 16 (App Router), React 19, TypeScript
estricto y CSS Modules, a partir de la referencia de dirección de arte adjunta
(`design/reference/referencia-direccion-de-arte.png`) y de la fotografía original de la
artista (`design/reference/ona-rigola-fotografia-original.png`).

> **Estado del contenido.** El retrato de marca es la fotografía original de la artista.
> Las cuatro imágenes del portfolio son **muestras de dirección de arte** (generadas para
> este proyecto, sin atribuirse a trabajos reales): sus fichas se sirven con `noindex` y
> se sustituyen por fotografías reales con un solo paso documentado. Los documentos
> legales mantienen resaltados los datos obligatorios pendientes. Ver
> [Información pendiente](#información-pendiente-de-la-propietaria).

---

## 1. Stack y decisiones técnicas

| Pieza                                    | Versión    | Por qué                                                                                                                                                                                                                                                                    |
| ---------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `next`                                   | 16.4.3     | App Router, Server Components por defecto, `next/image`, `next/font`, API de metadatos, sitemap/robots integrados.                                                                                                                                                         |
| `react` / `react-dom`                    | 19.3.1     | Versión compatible declarada por Next 16.                                                                                                                                                                                                                                  |
| `typescript`                             | 5.9.3      | `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`.                                                                                                                                                                                                                |
| CSS Modules + custom properties          | nativo     | La referencia pide composición editorial precisa (retícula asimétrica, titulares de escala extrema, líneas de 1px). CSS Modules da control total sin capa de utilidades que reinterprete el diseño. Sin Tailwind: no aportaba nada aquí y añadía una dependencia de build. |
| `zod`                                    | 4.6.7      | Esquema único de la solicitud de cita, compartido entre cliente y servidor (validación doble, mensajes en español).                                                                                                                                                        |
| `sharp`                                  | 0.35.5     | Generación de retratos derivados, iconos y favicon (`npm run assets`); también lo usa `next/image` en producción.                                                                                                                                                          |
| `@playwright/test`                       | 1.64.1     | Pruebas E2E (rutas, navegación, formulario, metadatos, JSON-LD).                                                                                                                                                                                                           |
| ESLint (`eslint-config-next`) + Prettier | 9.38 / 3.6 | Lint y formato.                                                                                                                                                                                                                                                            |
| `@fontsource/*` (solo dev)               | 5.3.0      | Origen de los `.woff2` autoalojados en `src/fonts` (no se importan en runtime).                                                                                                                                                                                            |

**Dependencias descartadas a propósito**

- _Tailwind CSS_: innecesario para replicar la retícula editorial; el sistema de tokens
  ya vive en `globals.css` + CSS Modules.
- _Motion / Framer Motion_: las transiciones necesarias (hover, foco, menú) caben en CSS
  y respetan `prefers-reduced-motion` sin añadir JS cliente.
- _Librería de iconos_: los cinco símbolos de marca son SVG inline (`ui/icons.tsx`).
- _CMS / base de datos / sistema de reservas_: no hay necesidad real todavía; el
  contenido se edita en archivos tipados dentro de `src/content`.
- _Google Fonts / CDN_: tipografías autoalojadas, sin peticiones externas.

**Comprobaciones de compatibilidad realizadas** (versiones consultadas en el registro de
npm en el momento de la implementación): `next@16.4.3` declara como _peer_ `react@^19`;
`eslint-config-next@16.4.3` acompaña a la misma versión de Next; `zod@4` expone
`z.string()`, `z.email()` y `safeParse` con `issues`; `next/og` (Satori) sigue sin
soportar `woff2`, por eso la imagen Open Graph usa `.woff`.

---

## 2. Arquitectura

```
src/
├─ app/                       # App Router
│  ├─ layout.tsx              # shell + metadatos base + JSON-LD global
│  ├─ page.tsx                # Inicio (composición editorial de la referencia)
│  ├─ sobre-mi/               # página de artista
│  ├─ trabajos/               # portfolio
│  │  └─ [slug]/              # plantilla de ficha de trabajo
│  ├─ proceso/                # 6 pasos + FAQ resumidas
│  ├─ preguntas-frecuentes/   # FAQ + JSON-LD FAQPage
│  ├─ contacto/               # formulario real (client component acotado)
│  ├─ privacidad/ aviso-legal/ cookies/
│  ├─ api/contacto/route.ts   # validación + antispam + entrega por proveedor
│  ├─ sitemap.ts robots.ts opengraph-image.tsx
│  ├─ icon.svg favicon.ico apple-icon.png   # generados por scripts/prepare-assets.mjs
│  ├─ not-found.tsx error.tsx
│  └─ globals.css             # tokens, base tipográfica y utilidades
├─ components/
│  ├─ layout/                 # header, menú móvil, footer
│  ├─ sections/               # bloques de página (hero, portfolio, estilos, proceso…)
│  ├─ ui/                     # page-header, work-frame, notice, iconos
│  ├─ forms/                  # formulario de cita
│  ├─ legal/                  # renderizador de documentos legales
│  └─ seo/                    # JSON-LD
├─ config/site.ts             # marca, contacto, estilos, navegación (única fuente de datos)
├─ content/                   # artist, process, faq, legal, works
├─ lib/                       # fonts, metadata, seo, structured-data, booking-schema
└─ fonts/                     # woff2 autoalojados + licencias
design/reference/             # referencia visual y fotografía original (no se sirven)
public/images/retrato/        # derivados generados de la fotografía original
scripts/                      # prepare-assets.mjs, check-contrast.mjs
tests/e2e/                    # pruebas Playwright
```

**Server Components por defecto.** Solo hay tres Client Components, todos acotados a una
necesidad real:

1. `SiteHeader` — necesita la ruta activa para `aria-current`.
2. `MobileMenu` — apertura, trampa de foco, Escape y bloqueo de scroll.
3. `BookingForm` — estado del formulario y llamada al endpoint.

---

## 3. Sistema visual

Tokens en `src/app/globals.css` (custom properties) alineados con la referencia:

- **Color**: marfil cálido `#f0ede4`, marfil profundo `#e8e4db`, papel `#f5f2ea`, tinta
  `#16150f`, texto secundario `#45443c` / `#57564e`, líneas `rgba(22,21,15,.16)`.
- **Tipografía**: Instrument Serif (titulares y logotipo), Newsreader (cuerpo y citas),
  Instrument Sans (navegación, etiquetas, metadatos). Tres familias con función clara.
- **Escala fluida** con `clamp()`: `--text-display`, `--text-h1`, `--text-h2`,
  `--text-h3`, `--text-body`, `--text-lede`, `--text-label`.
- **Retícula**: `--gutter` fluido, `--max-width: 1560px`, medidas de lectura
  (`--measure`, `--measure-wide`), retícula de 12 columnas en portfolio.
- **Bordes y radios**: líneas de 1px y `--radius-pill` para botones; el resto es recto.
- **Movimiento**: transiciones de 140–240 ms con `--ease`; todo desactivado bajo
  `prefers-reduced-motion: reduce`.

Contraste verificado con `npm run a11y:contrast` (script propio que calcula ratios WCAG
sobre los pares reales). Todos los pares de texto superan 4.5:1; los elementos de
interfaz superan 3:1.

---

## 4. Requisitos

- Node.js ≥ 20.9 (probado con Node 22.22).
- npm 10+.
- Para las pruebas E2E, un navegador Chromium de Playwright
  (`npm run test:e2e:install`).

## 5. Instalación y ejecución

```bash
npm ci                 # instalación reproducible
cp .env.example .env.local   # completa al menos NEXT_PUBLIC_SITE_URL
npm run dev            # http://localhost:3000
```

Producción:

```bash
npm run build
npm start              # sirve el build en el puerto 3000
```

## 6. Comandos

| Comando                           | Qué hace                                                   |
| --------------------------------- | ---------------------------------------------------------- |
| `npm run dev`                     | Servidor de desarrollo.                                    |
| `npm run build` / `npm start`     | Build de producción y servidor.                            |
| `npm run typecheck`               | `tsc --noEmit` en modo estricto (incluye pruebas).         |
| `npm run lint`                    | ESLint con `eslint-config-next`.                           |
| `npm run format` / `format:check` | Prettier (escribe / verifica).                             |
| `npm run check`                   | typecheck + lint + formato.                                |
| `npm run assets`                  | Regenera retratos, piezas del portfolio, iconos y favicon. |
| `npm run a11y:contrast`           | Comprueba los ratios de contraste del sistema.             |
| `npm run test:e2e`                | Playwright (arranca build+start si no hay servidor).       |
| `npm run test:e2e:install`        | Instala Chromium con dependencias del sistema.             |

## 7. Variables de entorno

Ver `.env.example`. Ninguna credencial se versiona.

| Variable               | Uso                                                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Dominio público definitivo, sin barra final. Base de canónicas, sitemap, `robots.txt` y JSON-LD. Por defecto `http://localhost:3000`. |
| `CONTACT_API_KEY`      | Clave del proveedor de correo (Resend).                                                                                               |
| `CONTACT_FROM_EMAIL`   | Remitente verificado en el proveedor.                                                                                                 |
| `CONTACT_TO_EMAIL`     | Buzón que recibe las solicitudes.                                                                                                     |
| `CONTACT_PROVIDER`     | Documental; el endpoint implementa Resend.                                                                                            |

### Configurar el formulario

El formulario es real en cliente y servidor: valida con Zod en ambos lados, aplica
antispam (campo trampa + tiempo mínimo de cumplimentación + límite de 5 envíos/15 min por
IP), evita dobles envíos y muestra estados de envío, error y éxito.

**Sin proveedor configurado no se envía nada**: el endpoint responde `503` con
`code: "not_configured"` y la interfaz lo explica. No se simula ningún envío.

Para activarlo:

1. Crea una cuenta en Resend y verifica el dominio remitente.
2. Define `CONTACT_API_KEY`, `CONTACT_FROM_EMAIL` y `CONTACT_TO_EMAIL` en el entorno.
3. Reinicia el servidor y envía una solicitud de prueba.

El límite por IP es en memoria del proceso: suficiente para un sitio de una sola
instancia. Si se despliega en varias instancias/serverless conviene moverlo a un store
compartido (Redis/Upstash) o a la capa de plataforma.

---

## 8. Cómo mantener el contenido

### Añadir una pieza real al portfolio

1. Guarda la fotografía original en `design/portfolio-muestras/` (PNG o JPG de alta
   resolución) y añade su entrada en el array `WORKS` de
   `scripts/prepare-assets.mjs` (slug, archivo, punto de interés `focus` y `zoom`
   opcional).
2. Ejecuta `npm run assets`: genera `public/images/trabajos/<slug>/01.jpg` y `.webp`
   recortados en 4:5 y en monocromo, sin deformar la imagen.
3. Edita `src/content/works.ts` y sustituye la entrada de muestra:

```ts
{
  slug: "linea-fina-antebrazo",       // legible, estable, descriptivo
  title: "Flor de almendro en el antebrazo",
  style: "linea-fina",                 // linea-fina | blackwork | ornamental
  styleLabel: "Línea fina",
  bodyArea: "Antebrazo",
  year: "2026",
  status: "publicado",                 // deja de ser noindex
  summary: "Pieza botánica de trazo continuo.",
  concept: "Texto real del concepto, acordado con la clienta.",
  images: [
    { src: "/images/trabajos/linea-fina-antebrazo/01.jpg", width: 1600, height: 2000, alt: "..." },
  ],
  featured: true,                      // máximo 4 destacadas en la portada
}
```

4. Las fichas con `status: "publicado"` dejan de llevar `noindex` y pasan a ser
   indexables. Para incluirlas también en `sitemap.xml`, añádelas al array `routes` de
   `src/app/sitemap.ts`.
5. Las fichas con `status: "muestra"` se mantienen con `noindex` y se explican en la nota
   de la página de trabajos.

### Sustituir fotografías

- Retrato: reemplaza `design/reference/ona-rigola-fotografia-original.png` y ejecuta
  `npm run assets`. El script recorta (sin deformar), convierte a monocromo y escribe
  `public/images/retrato/*.jpg|webp` más los iconos.
- Portfolio: imágenes originales en `design/portfolio-muestras/` + entrada en `WORKS`
  dentro de `scripts/prepare-assets.mjs`, y `npm run assets`.
- Si cambian los encuadres, ajusta el array `CROPS` de `scripts/prepare-assets.mjs`.
- No se usan imágenes remotas: `next.config.ts` bloquea orígenes externos.

### Cambiar textos y datos de la artista

- Marca, ciudad, estilos, navegación y datos de contacto → `src/config/site.ts`.
- Presentación, filosofía e influencias → `src/content/artist.ts`.
- Pasos del proceso → `src/content/process.ts`. Preguntas frecuentes → `src/content/faq.ts`.
- Textos legales → `src/content/legal.ts` (los campos `[[ … ]]` se resaltan en pantalla).

### Metadatos y dominio

- Metadatos base y plantilla de títulos → `src/lib/metadata.ts`.
- Metadatos por página → `buildPageMetadata()` en cada `page.tsx` (`src/lib/seo.ts`).
- Dominio definitivo → `NEXT_PUBLIC_SITE_URL`. Mientras apunte a `localhost`,
  `robots.txt` bloquea todo el sitio y los metadatos llevan `noindex`.
- Imagen social → `src/app/opengraph-image.tsx` (1200×630, tipografía de marca).

### Desplegar

1. Define `NEXT_PUBLIC_SITE_URL` con el dominio real y las variables de correo.
2. `npm ci && npm run build` en la plataforma (Vercel, Netlify, Node propio).
3. Comprueba `https://<dominio>/robots.txt`, `/sitemap.xml` y `/opengraph-image`.

---

## 9. Pruebas y validaciones ejecutadas

Detalle completo en [`docs/qa-report.md`](docs/qa-report.md). Resumen:

- `npm run typecheck` — pasa.
- `npm run lint` — pasa sin errores ni avisos.
- `npm run format:check` — pasa.
- `npm run build` — build de producción correcto (16 rutas estáticas, 4 fichas SSG, 1 endpoint).
- `npm run test:e2e` — 46 pruebas en escritorio y móvil, todas correctas.
- `npm run a11y:contrast` — todos los pares cumplen.
- Inspección visual real con capturas a 360, 390, 430, 768, 1024, 1280, 1440 y 1920 px.

---

## 10. Información pendiente de la propietaria

Nada de esto se ha inventado; mientras falte, la interfaz lo indica o simplemente no
muestra el dato.

1. **Fotografías reales** de tatuajes (mínimo 4-8 piezas) con estilo, zona del cuerpo y
   concepto. Sustituyen a las cuatro imágenes de muestra del portfolio.
2. **Correo electrónico** de contacto y, si procede, teléfono e Instagram
   (`siteConfig.contact`). Mientras sean `null` no aparece ningún canal directo.
3. **Buzón y proveedor de correo** para activar el envío de solicitudes.
4. **Datos legales**: nombre/denominación, NIF, domicilio, correo de privacidad, plazos de
   conservación, proveedor de alojamiento, edad mínima y jurisdicción
   (`src/content/legal.ts`).
5. **Operativa real**: condiciones de reserva, depósito, política de cancelación, precios,
   horarios, dirección del estudio (si es un espacio con atención al público) y
   titulación/registro sanitario aplicable.
6. **Biografía verificable**: formación, trayectoria y años de actividad. El texto actual se
   escribió con lo que la artista facilitó; debe confirmarlo antes de publicar.
7. **Dominio definitivo** para `NEXT_PUBLIC_SITE_URL`.
8. **Redes sociales** confirmadas (para `siteConfig.socialProfiles` y `sameAs`).

Las muestras del portfolio se identifican con `status: "muestra"` en `src/content/works.ts`:
al pasar a `"publicado"` la ficha deja de ser `noindex`. No hay otros avisos de estado en
la interfaz.

---

## 11. SEO

- **Metadatos únicos** por página (título, descripción, canonical, Open Graph y Twitter
  Cards), generados con la API de metadatos de Next.
- **Jerarquía semántica**: un `<h1>` por página, secciones con `<h2>`/`<h3>` coherentes.
- **JSON-LD**: `Person`, `WebSite`, `ProfilePage`, `BreadcrumbList` y `FAQPage`. No se
  emite `LocalBusiness`/`ProfessionalService` porque implicaría afirmar una dirección,
  horarios y entidad jurídica no confirmados (instrucciones para añadirlo: comentario en
  `src/lib/structured-data.ts`).
- **Indexación**: `sitemap.xml` (9 URLs públicas), `robots.txt` (bloqueo total en
  local/preview, `Disallow: /api/` en producción), `noindex` en las fichas de muestra y
  `noindex` global si `NEXT_PUBLIC_SITE_URL` es local.
- **Mapa de términos por página**:

| Página                  | Objetivo principal                         | Secundarios                                                                                                 |
| ----------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `/`                     | tatuadora en Barcelona                     | tatuajes de línea fina en Barcelona, fine line tattoo Barcelona, blackwork Barcelona, tatuajes ornamentales |
| `/sobre-mi`             | artista del tatuaje Barcelona              | diseños personalizados, tatuadora independiente                                                             |
| `/trabajos`             | portfolio de tatuajes                      | línea fina, blackwork, ornamental                                                                           |
| `/trabajos/[slug]`      | pieza concreta                             | estilo + zona del cuerpo                                                                                    |
| `/proceso`              | cómo pedir cita para tatuarse en Barcelona | proceso, diseño personalizado                                                                               |
| `/contacto`             | reservar una cita de tatuaje en Barcelona  | solicitud de cita, presupuesto                                                                              |
| `/preguntas-frecuentes` | dudas antes de tatuarse                    | referencias, tamaño, cuidados                                                                               |

No se declaran volúmenes de búsqueda ni competencia: no se han obtenido datos fiables.

- **Validaciones recomendadas antes de publicar** (herramientas oficiales, no ejecutables
  desde este entorno):
  - Rich Results Test y Schema Markup Validator sobre `/`, `/sobre-mi`, `/preguntas-frecuentes`.
  - Search Console: envío de `sitemap.xml` y comprobación de cobertura.
  - PageSpeed Insights/Lighthouse en móvil y escritorio para confirmar Core Web Vitals.
  - Comprobación de la vista previa social (Open Graph) en el depurador de la red social.

---

## 12. Accesibilidad

- HTML semántico, un `h1` por página, regiones etiquetadas.
- Enlace «Saltar al contenido», foco visible siempre (nunca `outline: none` sin sustituto).
- Campos con `<label>` asociado, `aria-invalid`, `aria-describedby` y errores enlazados.
- Estados del formulario anunciados con `aria-live="polite"`.
- Menú móvil como `role="dialog" aria-modal`, trampa de foco, cierre con Escape y
  devolución del foco al botón que lo abrió.
- Objetivos táctiles ≥ 24 px (la mayoría ≥ 44 px); enlaces en línea exceptuados por WCAG.
- `prefers-reduced-motion` respetado globalmente.
- Contraste: verificado con script propio (`npm run a11y:contrast`).

---

## 13. Rendimiento

- Retrato principal con `priority` + `fetchPriority="high"` y `sizes` ajustado; el resto de
  imágenes con carga diferida por defecto de `next/image`.
- Imágenes servidas en AVIF/WebP por `next/image` (formatos habilitados en `next.config.ts`).
- Tipografías autoalojadas con `display: swap` y `preload` solo de las tres usadas
  realmente.
- JS cliente mínimo (tres islas). El resto es HTML del servidor.
- Sin animaciones de scroll, sliders ni librerías de movimiento.
- Sin layout shift: todas las imágenes declaran `width`/`height` o `aspect-ratio`.

Los umbrales de Core Web Vitals (LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1) son objetivos de
diseño; no se han medido en campo desde este entorno.

---

## 14. Limitaciones conocidas

1. **No hay fotografías reales de tatuajes** en el repositorio: el portfolio usa cuatro
   imágenes de muestra (dirección de arte) con ficha `noindex`.
2. **El envío del formulario necesita configuración** (proveedor + buzón). Sin ella el
   endpoint responde con un error genérico y no se envía nada; la interfaz no promete
   entrega.
3. **Los documentos legales son una estructura**, no un texto validado jurídicamente.
4. **Datos de contacto ausentes** por decisión: no se inventan correo, teléfono, dirección
   ni Instagram.
5. **Una sola instancia** para el límite de envíos por IP (memoria del proceso).
6. **Solo español**: el contenido está centralizado para permitir una versión catalana o
   inglesa futura, sin implementarla a medias.
