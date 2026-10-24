import { NextResponse } from "next/server";
import { bookingSchema, fieldErrors } from "@/lib/booking-schema";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Tamaño máximo del cuerpo aceptado (bytes). */
const MAX_BODY_BYTES = 32 * 1024;
/** Ventana y límite de envíos por IP. */
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 5;
/** Tiempo mínimo razonable de cumplimentación (antispam). */
const MIN_FILL_MS = 2500;

const submissions = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissions.get(ip) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  timestamps.push(now);
  submissions.set(ip, timestamps);

  // Limpieza oportunista para no crecer sin límite.
  if (submissions.size > 500) {
    for (const [key, times] of submissions) {
      if (times.every((time) => now - time >= RATE_WINDOW_MS)) submissions.delete(key);
    }
  }

  return timestamps.length > RATE_MAX;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isDeliveryConfigured(): boolean {
  return Boolean(
    process.env.CONTACT_API_KEY && process.env.CONTACT_FROM_EMAIL && process.env.CONTACT_TO_EMAIL,
  );
}

function buildEmail(data: ReturnType<typeof bookingSchema.parse>) {
  const rows: Array<[string, string]> = [
    ["Nombre", data.name],
    ["Correo", data.email],
    ["Estilo", data.style],
    ["Zona del cuerpo", data.bodyArea || "—"],
    ["Tamaño", data.size ?? "—"],
    ["Disponibilidad", data.availability || "—"],
    ["Presupuesto orientativo", data.budget || "—"],
    ["Referencias", data.references || "—"],
  ];

  const html = `
    <div style="font-family:Georgia,serif;color:#16150f;line-height:1.6">
      <h1 style="font-size:20px;font-weight:400">Nueva solicitud de cita</h1>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#57564e;vertical-align:top">${escapeHtml(
                label,
              )}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
          )
          .join("")}
      </table>
      <h2 style="font-size:16px;font-weight:400;margin-top:24px">Idea</h2>
      <p style="white-space:pre-wrap;max-width:560px">${escapeHtml(data.idea)}</p>
    </div>
  `;

  const text = [
    "Nueva solicitud de cita",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Idea:",
    data.idea,
  ].join("\n");

  return { html, text };
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { ok: false, code: "unsupported_media_type", message: "Formato de envío no válido." },
      { status: 415 },
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, code: "payload_too_large", message: "La solicitud es demasiado grande." },
      { status: 413 },
    );
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_json", message: "No se ha podido leer la solicitud." },
      { status: 400 },
    );
  }

  const parsed = bookingSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        code: "validation_error",
        message: "Revisa los campos marcados.",
        fields: fieldErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Honeypot: si llega relleno, se descarta sin dar pistas.
  if (data.company) {
    return NextResponse.json(
      { ok: false, code: "rejected", message: "Envío no válido." },
      { status: 400 },
    );
  }

  // Envío sospechosamente rápido: se mide una duración, no un reloj absoluto,
  // para no depender de la hora del cliente.
  if (typeof data.elapsedMs === "number" && data.elapsedMs < MIN_FILL_MS) {
    return NextResponse.json(
      {
        ok: false,
        code: "rejected",
        message: "El formulario se ha enviado demasiado rápido. Inténtalo de nuevo.",
      },
      { status: 400 },
    );
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "desconocida";
  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        code: "rate_limited",
        message: "Se han enviado varias solicitudes seguidas. Espera unos minutos.",
      },
      { status: 429 },
    );
  }

  if (!isDeliveryConfigured()) {
    // Sin proveedor configurado no se simula ningún envío.
    return NextResponse.json(
      {
        ok: false,
        code: "not_configured",
        message:
          "La recepción de solicitudes aún no está activada. No se ha enviado ningún mensaje.",
      },
      { status: 503 },
    );
  }

  const { html, text } = buildEmail(data);
  const subject = `Solicitud de cita — ${data.name} · ${siteConfig.name}`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CONTACT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: data.email,
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      console.error("[contacto] El proveedor de correo rechazó el envío", response.status);
      return NextResponse.json(
        {
          ok: false,
          code: "provider_error",
          message: "No se ha podido entregar la solicitud. Inténtalo de nuevo más tarde.",
        },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("[contacto] Error de red al contactar con el proveedor de correo", error);
    return NextResponse.json(
      {
        ok: false,
        code: "network_error",
        message: "No se ha podido entregar la solicitud. Inténtalo de nuevo más tarde.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, code: "sent", message: "Solicitud enviada." });
}
