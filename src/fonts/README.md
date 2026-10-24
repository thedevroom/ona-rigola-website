# Tipografías autoalojadas

Los archivos `.woff2` de esta carpeta se sirven localmente mediante `next/font/local`
(ver `src/lib/fonts.ts`). No hay peticiones a Google Fonts ni a CDNs externos.

| Familia                                         | Uso                                          | Origen                                                                                                            | Licencia    |
| ----------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------- |
| Instrument Serif 400 (normal e itálica)         | Titulares, logotipo, acentos editoriales     | [Instrument Serif](https://github.com/Instrument/instrument-serif) · paquete `@fontsource/instrument-serif`       | SIL OFL 1.1 |
| Newsreader variable (200–800, normal e itálica) | Cuerpo de texto, citas, párrafos             | [Newsreader](https://github.com/productiontype/Newsreader) · paquete `@fontsource-variable/newsreader`            | SIL OFL 1.1 |
| Instrument Sans variable (100–900)              | Navegación, etiquetas, metadatos y controles | [Instrument Sans](https://github.com/Instrument/instrument-sans) · paquete `@fontsource-variable/instrument-sans` | SIL OFL 1.1 |

Los textos completos de licencia están en `src/fonts/licenses/`.

## Cómo actualizar una tipografía

1. Actualiza el paquete correspondiente en `devDependencies` (los paquetes solo se
   usan como origen de los archivos; el sitio no los importa en tiempo de ejecución).
2. Copia de nuevo los `.woff2` de `latin` desde `node_modules/<paquete>/files/` a esta
   carpeta, manteniendo el nombre de archivo que espera `src/lib/fonts.ts`.
3. Los archivos `.woff` de `src/fonts/og/` se usan solo para generar la imagen Open
   Graph (Satori no admite woff2).
