/**
 * Comprobación de contraste WCAG de los pares de color realmente usados en el
 * sistema visual. Se ejecuta con `node scripts/check-contrast.mjs`.
 *
 * Umbrales: 4.5:1 para texto pequeño (AA), 3:1 para texto grande y elementos
 * de interfaz. Los pares decorativos se informan pero no rompen la build.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

const css = await readFile(path.join(import.meta.dirname, "../src/app/globals.css"), "utf8");

function token(name) {
  const match = css.match(new RegExp(`--${name}:\\s*#([0-9a-fA-F]{6})`));
  if (!match) throw new Error(`Token no encontrado: --${name}`);
  return `#${match[1]}`;
}

const colors = {
  ivory: token("ivory"),
  ivoryDeep: token("ivory-deep"),
  paper: token("paper"),
  ink: token("ink"),
  ink70: token("ink-70"),
  ink55: token("ink-55"),
  ink40: token("ink-40"),
  focus: token("focus"),
  error: "#f6c9ae",
  pending: "#6d3a1c",
};

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16));
}

/** Compone un color con alfa sobre un fondo opaco. */
function composite(foregroundHex, alpha, backgroundHex) {
  const fg = hexToRgb(foregroundHex);
  const bg = hexToRgb(backgroundHex);
  const mix = fg.map((channel, index) => Math.round(channel * alpha + bg[index] * (1 - alpha)));
  return `#${mix.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(foreground, background) {
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return (light + 0.05) / (dark + 0.05);
}

const pairs = [
  ["Texto principal", colors.ink, colors.ivory, 4.5],
  ["Texto secundario (prose)", colors.ink70, colors.ivory, 4.5],
  ["Etiquetas y metadatos", colors.ink55, colors.ivory, 4.5],
  ["Texto secundario sobre marfil profundo", colors.ink70, colors.ivoryDeep, 4.5],
  ["Etiquetas sobre marfil profundo", colors.ink55, colors.ivoryDeep, 4.5],
  ["Etiquetas sobre papel", colors.ink55, colors.paper, 4.5],
  ["Texto inversionado", colors.ivory, colors.ink, 4.5],
  ["Texto atenuado sobre negro", composite(colors.ivory, 0.72, colors.ink), colors.ink, 4.5],
  ["Mensajes de error sobre negro", colors.error, colors.ink, 4.5],
  ["Campos pendientes (legal)", colors.pending, composite("#8a4b24", 0.12, colors.paper), 4.5],
  ["Anillo de foco sobre marfil", colors.focus, colors.ivory, 3],
  ["Bordes interactivos", colors.ink55, colors.ivory, 3],
  ["Texto decorativo (solo iconos)", colors.ink40, colors.ivory, 0],
];

let failures = 0;
for (const [label, foreground, background, threshold] of pairs) {
  const value = ratio(foreground, background);
  const pass = value >= threshold;
  if (!pass) failures += 1;
  console.log(
    `${pass ? "PASS" : "FAIL"}  ${value.toFixed(2).padStart(5)}:1  (mín. ${threshold || "—"})  ${label}  ${foreground} / ${background}`,
  );
}

if (failures > 0) {
  console.error(`\n${failures} par(es) de color no cumplen el umbral definido.`);
  process.exit(1);
}

console.log("\nTodos los pares de color cumplen el umbral declarado.");
