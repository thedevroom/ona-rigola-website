/**
 * Genera los recursos derivados del sitio (retratos, portfolio, iconos y
 * favicon) a partir de los archivos originales depositados en `design/`.
 *
 * Uso: `npm run assets`
 *
 * Notas:
 * - Los originales se conservan intactos: nunca se sobrescriben.
 * - Las imágenes se recortan y se convierten a monocromo (tratamiento de la
 *   dirección de arte) sin deformar la composición: solo se recorta y se ajusta
 *   el contraste.
 * - Si se sustituye una fotografía, basta con reemplazar el archivo original y
 *   volver a ejecutar el script.
 */
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const ORIGINAL = path.join(ROOT, "design/reference/ona-rigola-fotografia-original.png");
const OUT_PORTRAITS = path.join(ROOT, "public/images/retrato");
const OUT_WORKS = path.join(ROOT, "public/images/trabajos");
const APP_ICONS = path.join(ROOT, "src/app");
const WORK_SOURCES = path.join(ROOT, "design/portfolio-muestras");

/** Recortes expresados en píxeles sobre la fotografía original (900 × 1600). */
const CROPS = [
  {
    name: "ona-rigola-retrato-principal",
    // 4:5 — retrato de portada (hero de la home y páginas interiores)
    left: 0,
    top: 40,
    width: 900,
    height: 1125,
  },
  {
    name: "ona-rigola-retrato-editorial",
    // 3:4 — variante algo más abierta para la página «Sobre mí»
    left: 0,
    top: 0,
    width: 900,
    height: 1200,
  },
  {
    name: "ona-rigola-retrato-detalle",
    // 1:1 — encuadre cerrado, para bloques pequeños
    left: 110,
    top: 60,
    width: 780,
    height: 780,
  },
];

/**
 * Piezas del portfolio.
 *
 * `focus` es el punto (0–1) que se conserva al recortar en 4:5. Cada pieza
 * produce una versión de tarjeta y una versión de ficha.
 */
const WORKS = [
  {
    slug: "linea-fina-botanica",
    source: "muestra-01-linea-fina-botanica.png",
    focus: { x: 0.5, y: 0.55 },
  },
  {
    slug: "linea-fina-ramita",
    source: "muestra-02-linea-fina-ramita.png",
    focus: { x: 0.42, y: 0.5 },
  },
  {
    slug: "blackwork-floral",
    source: "muestra-03-blackwork-floral.png",
    // La pieza ocupa una franja central: se recorta más cerca para que la
    // tarjeta no muestre tanto aire alrededor.
    focus: { x: 0.5, y: 0.52 },
    zoom: 1.35,
  },
  {
    slug: "ornamental-clavicula",
    source: "muestra-04-ornamental-clavicula.png",
    focus: { x: 0.5, y: 0.55 },
  },
];

const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" fill="#14140f"/>
  <path d="M32 11c1.9 9.4 5.6 14.1 15 16-9.4 1.9-13.1 6.6-15 16-1.9-9.4-5.6-14.1-15-16 9.4-1.9 13.1-6.6 15-16z" fill="#efebe1"/>
  <path d="M44.5 38.5c.9 4.4 2.6 6.6 7 7.5-4.4.9-6.1 3.1-7 7.5-.9-4.4-2.6-6.6-7-7.5 4.4-.9 6.1-3.1 7-7.5z" fill="#efebe1" opacity=".7"/>
</svg>`;

/**
 * Empaqueta varios PNG en un único `.ico` (formato PNG-in-ICO, soportado por
 * todos los navegadores actuales).
 */
function packIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const directory = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;

  images.forEach(({ size, data }, index) => {
    const entry = index * 16;
    directory.writeUInt8(size >= 256 ? 0 : size, entry + 0);
    directory.writeUInt8(size >= 256 ? 0 : size, entry + 1);
    directory.writeUInt8(0, entry + 2); // palette
    directory.writeUInt8(0, entry + 3); // reserved
    directory.writeUInt16LE(1, entry + 4); // color planes
    directory.writeUInt16LE(32, entry + 6); // bits per pixel
    directory.writeUInt32LE(data.length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });

  return Buffer.concat([header, directory, ...images.map((image) => image.data)]);
}

/** Aplica el tratamiento monocromático común a todas las imágenes del sitio. */
function monochrome(input) {
  return (
    sharp(input)
      .greyscale()
      // Negros ligeramente levantados y contraste suave, como en la referencia.
      .linear(0.98, 12)
      .modulate({ brightness: 1.02 })
  );
}

async function buildPortraits() {
  await mkdir(OUT_PORTRAITS, { recursive: true });
  const metadata = await sharp(ORIGINAL).metadata();

  for (const crop of CROPS) {
    if (crop.left + crop.width > metadata.width || crop.top + crop.height > metadata.height) {
      throw new Error(
        `El recorte «${crop.name}» excede la fotografía original (${metadata.width}×${metadata.height}).`,
      );
    }

    const base = monochrome(
      await sharp(ORIGINAL)
        .extract({ left: crop.left, top: crop.top, width: crop.width, height: crop.height })
        .toBuffer(),
    );

    const jpeg = await base.clone().jpeg({ quality: 86, mozjpeg: true }).toBuffer();
    const webp = await base.clone().resize({ width: 1200 }).webp({ quality: 82 }).toBuffer();

    await writeFile(path.join(OUT_PORTRAITS, `${crop.name}.jpg`), jpeg);
    await writeFile(path.join(OUT_PORTRAITS, `${crop.name}.webp`), webp);
    console.log(`✓ retrato ${crop.name}`);
  }
}

async function buildWorks() {
  await mkdir(OUT_WORKS, { recursive: true });

  for (const work of WORKS) {
    const sourcePath = path.join(WORK_SOURCES, work.source);
    const source = await readFile(sourcePath);
    const metadata = await sharp(source).metadata();
    const targetRatio = 4 / 5;

    // Recorte 4:5 centrado en el punto de interés, sin deformar la imagen.
    let width = Math.round(metadata.width / (work.zoom ?? 1));
    let height = Math.round(width / targetRatio);
    if (height > metadata.height) {
      height = metadata.height;
      width = Math.round(height * targetRatio);
    }
    const left = Math.round(
      Math.min(Math.max(work.focus.x * metadata.width - width / 2, 0), metadata.width - width),
    );
    const top = Math.round(
      Math.min(Math.max(work.focus.y * metadata.height - height / 2, 0), metadata.height - height),
    );

    const base = monochrome(await sharp(source).extract({ left, top, width, height }).toBuffer());

    const directory = path.join(OUT_WORKS, work.slug);
    await mkdir(directory, { recursive: true });

    const jpeg = await base
      .clone()
      .resize({ width: 1400 })
      .jpeg({ quality: 86, mozjpeg: true })
      .toBuffer();
    const webp = await base.clone().resize({ width: 1200 }).webp({ quality: 82 }).toBuffer();

    await writeFile(path.join(directory, "01.jpg"), jpeg);
    await writeFile(path.join(directory, "01.webp"), webp);

    const final = await sharp(jpeg).metadata();
    console.log(`✓ pieza ${work.slug} (${final.width}×${final.height})`);
  }
}

async function buildIcons() {
  // Se eliminan los iconos sueltos de versiones anteriores: Next sirve
  // `src/app/favicon.ico`, `src/app/icon.svg` y `src/app/apple-icon.png`.
  await mkdir(APP_ICONS, { recursive: true });
  await rm(path.join(ROOT, "public/icon-192.png"), { force: true });
  await rm(path.join(ROOT, "public/icon-512.png"), { force: true });
  const svg = Buffer.from(ICON_SVG);

  await writeFile(path.join(APP_ICONS, "icon.svg"), ICON_SVG);

  const png = (size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();

  const [apple, p32, p16, p48] = await Promise.all([png(180), png(32), png(16), png(48)]);

  await writeFile(path.join(APP_ICONS, "apple-icon.png"), apple);
  await writeFile(
    path.join(APP_ICONS, "favicon.ico"),
    packIco([
      { size: 16, data: p16 },
      { size: 32, data: p32 },
      { size: 48, data: p48 },
    ]),
  );

  console.log("✓ iconos y favicon");
}

await buildPortraits();
await buildWorks();
await buildIcons();
console.log("\nRecursos generados correctamente.");
