/**
 * Proceso de reserva y trabajo.
 *
 * TODO PROPIETARIA: estos pasos describen un procedimiento estándar y
 * prudente. Políticas concretas (depósitos, cancelaciones, precios, horarios,
 * condiciones sanitarias) NO están definidas: no se inventan aquí.
 */

export type ProcessStep = {
  index: string;
  title: string;
  summary: string;
  details: string[];
};

export const processSteps: ProcessStep[] = [
  {
    index: "01",
    title: "Envías tu idea",
    summary: "Un mensaje con el motivo, la zona del cuerpo y el tamaño aproximado.",
    details: [
      "El formulario de contacto recoge la información mínima para valorar la idea.",
      "Si tienes referencias visuales, menciónalas en el mensaje.",
      "No hace falta que tengas el diseño resuelto: la idea es suficiente para empezar.",
    ],
  },
  {
    index: "02",
    title: "Revisión de referencias y viabilidad",
    summary: "Se valora el encaje del estilo, la zona y la escala antes de dibujar.",
    details: [
      "Se comentan las referencias aportadas y las posibilidades del diseño.",
      "Si la idea necesita ajustes de escala o de ubicación, se plantean antes de dibujar.",
      "La viabilidad y las condiciones concretas se confirman por escrito en la conversación.",
    ],
  },
  {
    index: "03",
    title: "Definición del diseño",
    summary: "La idea se traduce a una composición dibujada a medida.",
    details: [
      "El dibujo se plantea para la zona del cuerpo elegida.",
      "Se revisa el planteamiento antes de cerrar la cita.",
      "Los cambios de última hora pueden afectar al tiempo de sesión.",
    ],
  },
  {
    index: "04",
    title: "Preparación de la cita",
    summary: "Se acuerdan fecha, duración estimada y recomendaciones previas.",
    details: [
      "La fecha se confirma cuando el diseño y la disponibilidad encajan.",
      "Las condiciones de reserva se comunican de forma explícita antes de confirmar.",
      "Las recomendaciones previas se facilitan al confirmar la cita.",
    ],
  },
  {
    index: "05",
    title: "Sesión de tatuaje",
    summary: "La sesión se desarrolla en un entorno de trabajo cuidado y tranquilo.",
    details: [
      "Se repasa el diseño y el encaje sobre la piel antes de empezar.",
      "El ritmo de la sesión se adapta a la pieza y a las pausas necesarias.",
      "Las medidas de higiene aplicadas se explican en el estudio.",
    ],
  },
  {
    index: "06",
    title: "Cuidados posteriores",
    summary: "Se explican las pautas de cuidado y el seguimiento de la cicatrización.",
    details: [
      "Las pautas se entregan por escrito al terminar la sesión.",
      "Ante cualquier duda durante la cicatrización, lo mejor es escribir directamente.",
      "No se sustituye en ningún caso el criterio de un profesional sanitario.",
    ],
  },
];

export const bookingNote =
  "Los detalles concretos de cada cita (duración, condiciones y recomendaciones) se confirman siempre por escrito antes de la sesión.";
