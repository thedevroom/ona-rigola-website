import { z } from "zod";
import { siteConfig } from "@/config/site";

/**
 * Esquema único de la solicitud de cita.
 *
 * Se comparte entre cliente y servidor: el cliente lo usa para dar feedback
 * inmediato y el servidor lo vuelve a validar como única fuente de verdad.
 */
export const bookingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Escribe tu nombre (2 caracteres como mínimo).")
    .max(80, "El nombre es demasiado largo."),
  email: z
    .email("Revisa el correo electrónico: parece incompleto.")
    .max(254, "El correo es demasiado largo."),
  idea: z
    .string()
    .trim()
    .min(20, "Cuéntame un poco más: al menos 20 caracteres.")
    .max(
      siteConfig.booking.maxDescriptionLength,
      `El mensaje no puede superar los ${siteConfig.booking.maxDescriptionLength} caracteres.`,
    ),
  style: z.enum(["linea-fina", "blackwork", "ornamental", "sin-definir"]).default("sin-definir"),
  bodyArea: z.string().trim().max(80, "Indica una zona más breve.").optional().default(""),
  size: z.enum(["pequeno", "mediano", "grande", "por-definir"]).optional().default("por-definir"),
  availability: z.string().trim().max(120, "Resume la disponibilidad.").optional().default(""),
  budget: z.string().trim().max(60, "El presupuesto es demasiado largo.").optional().default(""),
  references: z
    .string()
    .trim()
    .max(600, "Las referencias no pueden superar los 600 caracteres.")
    .optional()
    .default(""),
  consent: z.literal(true, {
    message: "Debes aceptar la información de privacidad para enviar la solicitud.",
  }),
  /** Campo trampa: debe llegar vacío. */
  company: z.string().max(0).optional().default(""),
  /** Tiempo transcurrido rellenando el formulario, en ms (antispam). */
  elapsedMs: z
    .number()
    .int()
    .nonnegative()
    .max(24 * 60 * 60 * 1000)
    .optional(),
});

export type BookingStyle = "linea-fina" | "blackwork" | "ornamental" | "sin-definir";
export type BookingSize = "pequeno" | "mediano" | "grande" | "por-definir";

export type BookingData = z.output<typeof bookingSchema>;

export const styleOptions = [
  { value: "sin-definir", label: "Todavía no lo sé" },
  ...siteConfig.styles.map((style) => ({ value: style.id, label: style.name })),
] as const;

export const sizeOptions = [
  { value: "por-definir", label: "Por definir" },
  { value: "pequeno", label: "Pequeño (hasta 8 cm)" },
  { value: "mediano", label: "Mediano (8–15 cm)" },
  { value: "grande", label: "Grande (más de 15 cm)" },
] as const;

/** Extrae los errores por campo en un formato apto para la interfaz. */
export function fieldErrors(error: z.ZodError<BookingData>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !result[key]) {
      result[key] = issue.message;
    }
  }
  return result;
}
