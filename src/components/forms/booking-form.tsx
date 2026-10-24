"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import {
  bookingSchema,
  fieldErrors,
  sizeOptions,
  styleOptions,
  type BookingData,
  type BookingSize,
  type BookingStyle,
} from "@/lib/booking-schema";
import { siteConfig } from "@/config/site";
import { ArrowRight } from "@/components/ui/icons";
import styles from "./booking-form.module.css";

type Status = "idle" | "submitting" | "success" | "error";

type ServerResponse = {
  ok: boolean;
  code?: string;
  message?: string;
  fields?: Record<string, string>;
};

type FormValues = {
  name: string;
  email: string;
  idea: string;
  style: BookingStyle;
  bodyArea: string;
  size: BookingSize;
  availability: string;
  budget: string;
  references: string;
  company: string;
};

const initialValues: FormValues = {
  name: "",
  email: "",
  idea: "",
  style: "sin-definir",
  bodyArea: "",
  size: "por-definir",
  availability: "",
  budget: "",
  references: "",
  company: "",
};

type FieldName = keyof FormValues | "consent";

const fieldOrder: FieldName[] = [
  "name",
  "email",
  "idea",
  "style",
  "bodyArea",
  "size",
  "availability",
  "budget",
  "references",
  "consent",
];

export function BookingForm() {
  const uid = useId();
  const [values, setValues] = useState(initialValues);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string>("");
  const [serverCode, setServerCode] = useState<string>("");
  // Momento en que se muestra el formulario; se usa como señal antispam.
  const mountedAt = useRef<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Se registra el momento de montaje para medir cuánto tarda la persona en
  // completar el formulario (señal antispam del servidor).
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const fieldId = (name: string) => `${uid}-${name}`;
  const errorId = (name: string) => `${uid}-${name}-error`;

  function update<K extends keyof FormValues>(name: K, value: FormValues[K]) {
    setValues((previous) => ({ ...previous, [name]: value }));
    if (errors[name]) {
      setErrors((previous) => {
        const next = { ...previous };
        delete next[name];
        return next;
      });
    }
  }

  function focusFirstError(fields: Record<string, string>) {
    const first = fieldOrder.find((name) => fields[name]);
    if (!first) return;
    const element = formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldId(first))}`);
    element?.focus();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const payload = {
      ...values,
      consent,
      elapsedMs: mountedAt.current ? Date.now() - mountedAt.current : undefined,
    };

    const local = bookingSchema.safeParse(payload);
    if (!local.success) {
      const fields = fieldErrors(local.error);
      setErrors(fields);
      setStatus("error");
      setServerMessage("Revisa los campos marcados antes de enviar.");
      setServerCode("validation_error");
      focusFirstError(fields);
      return;
    }

    setErrors({});
    setStatus("submitting");
    setServerMessage("");
    setServerCode("");

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload as unknown as BookingData),
      });

      const data = (await response.json().catch(() => null)) as ServerResponse | null;

      if (response.ok && data?.ok) {
        setStatus("success");
        setServerMessage("Solicitud enviada. Recibirás respuesta en el correo que has indicado.");
        setValues(initialValues);
        setConsent(false);
        mountedAt.current = Date.now();
        return;
      }

      if (data?.fields) setErrors(data.fields);
      setStatus("error");
      setServerCode(data?.code ?? "unknown");
      setServerMessage(
        data?.message ??
          "No se ha podido enviar la solicitud. Revisa la conexión e inténtalo de nuevo.",
      );
      if (data?.fields) focusFirstError(data.fields);
    } catch {
      setStatus("error");
      setServerCode("network_error");
      setServerMessage(
        "No hay conexión con el servidor. La solicitud no se ha enviado: inténtalo de nuevo.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className={`${styles.status}`} role="status" data-testid="booking-success">
        <p className="eyebrow eyebrow--inverse">Solicitud recibida</p>
        <h3 className={styles.statusTitle}>Gracias por escribir.</h3>
        <p className={styles.statusText}>{serverMessage}</p>
        <p className={styles.hint}>
          {siteConfig.booking.responseNote} Si necesitas añadir algo, responde al correo de
          confirmación.
        </p>
        <button
          type="button"
          className="btn btn--inverse"
          onClick={() => {
            setStatus("idle");
            setServerMessage("");
          }}
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  const invalid = (name: FieldName) => Boolean(errors[name]);
  const describedBy = (name: FieldName) => (errors[name] ? errorId(name) : undefined);

  return (
    <form
      ref={formRef}
      className={styles.form}
      onSubmit={onSubmit}
      noValidate
      aria-labelledby={`${uid}-form-title`}
      data-testid="booking-form"
    >
      <h3 id={`${uid}-form-title`} className="visually-hidden">
        Formulario de solicitud de cita
      </h3>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={fieldId("name")}>
            Nombre <span aria-hidden="true">*</span>
          </label>
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            className={`${styles.control} ${invalid("name") ? styles.invalid : ""}`}
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={invalid("name") || undefined}
            aria-describedby={describedBy("name")}
            placeholder="Tu nombre"
          />
          {errors.name ? (
            <p className={styles.error} id={errorId("name")}>
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={fieldId("email")}>
            Correo electrónico <span aria-hidden="true">*</span>
          </label>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            className={`${styles.control} ${invalid("email") ? styles.invalid : ""}`}
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            autoComplete="email"
            inputMode="email"
            required
            aria-required="true"
            aria-invalid={invalid("email") || undefined}
            aria-describedby={describedBy("email")}
            placeholder="tu@email.com"
          />
          {errors.email ? (
            <p className={styles.error} id={errorId("email")}>
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className={`${styles.field} ${styles.full}`}>
          <label className={styles.label} htmlFor={fieldId("idea")}>
            Tu idea <span aria-hidden="true">*</span>
          </label>
          <textarea
            id={fieldId("idea")}
            name="idea"
            className={`${styles.textarea} ${invalid("idea") ? styles.invalid : ""}`}
            value={values.idea}
            onChange={(event) => update("idea", event.target.value)}
            rows={5}
            maxLength={siteConfig.booking.maxDescriptionLength}
            required
            aria-required="true"
            aria-invalid={invalid("idea") || undefined}
            aria-describedby={describedBy("idea")}
            placeholder="Cuéntame qué tienes en mente: el motivo, la sensación que buscas y para qué momento."
          />
          <p className={styles.hint}>
            {values.idea.length} / {siteConfig.booking.maxDescriptionLength} caracteres
          </p>
          {errors.idea ? (
            <p className={styles.error} id={errorId("idea")}>
              {errors.idea}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={fieldId("style")}>
            Estilo <span className={styles.optional}>opcional</span>
          </label>
          <select
            id={fieldId("style")}
            name="style"
            className={styles.select}
            value={values.style}
            onChange={(event) => update("style", event.target.value as BookingStyle)}
          >
            {styleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={fieldId("bodyArea")}>
            Zona del cuerpo <span className={styles.optional}>opcional</span>
          </label>
          <input
            id={fieldId("bodyArea")}
            name="bodyArea"
            type="text"
            className={styles.control}
            value={values.bodyArea}
            onChange={(event) => update("bodyArea", event.target.value)}
            placeholder="Antebrazo, costilla, espalda…"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={fieldId("size")}>
            Tamaño aproximado <span className={styles.optional}>opcional</span>
          </label>
          <select
            id={fieldId("size")}
            name="size"
            className={styles.select}
            value={values.size}
            onChange={(event) => update("size", event.target.value as BookingSize)}
          >
            {sizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={fieldId("availability")}>
            Disponibilidad <span className={styles.optional}>opcional</span>
          </label>
          <input
            id={fieldId("availability")}
            name="availability"
            type="text"
            className={styles.control}
            value={values.availability}
            onChange={(event) => update("availability", event.target.value)}
            placeholder="Tardes, fines de semana…"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={fieldId("budget")}>
            Presupuesto orientativo <span className={styles.optional}>opcional</span>
          </label>
          <input
            id={fieldId("budget")}
            name="budget"
            type="text"
            className={styles.control}
            value={values.budget}
            onChange={(event) => update("budget", event.target.value)}
            placeholder="Si tienes un rango en mente"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={fieldId("references")}>
            Referencias <span className={styles.optional}>opcional</span>
          </label>
          <input
            id={fieldId("references")}
            name="references"
            type="text"
            className={styles.control}
            value={values.references}
            onChange={(event) => update("references", event.target.value)}
            placeholder="Enlaces o descripción de referencias"
          />
        </div>

        <div className={`${styles.honeypot}`} aria-hidden="true">
          <label htmlFor={fieldId("company")}>No rellenar</label>
          <input
            id={fieldId("company")}
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.company}
            onChange={(event) => update("company", event.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.consent} htmlFor={fieldId("consent")}>
          <input
            id={fieldId("consent")}
            name="consent"
            type="checkbox"
            className={styles.checkbox}
            checked={consent}
            onChange={(event) => {
              setConsent(event.target.checked);
              if (errors.consent) {
                setErrors((previous) => {
                  const next = { ...previous };
                  delete next.consent;
                  return next;
                });
              }
            }}
            aria-invalid={invalid("consent") || undefined}
            aria-describedby={describedBy("consent")}
          />
          <span className={styles.consentText}>
            He leído la <Link href="/privacidad">información de privacidad</Link> y acepto que mis
            datos se utilicen únicamente para gestionar esta solicitud.
          </span>
        </label>
        {errors.consent ? (
          <p className={styles.error} id={errorId("consent")}>
            {errors.consent}
          </p>
        ) : null}
      </div>

      <div className={styles.actions}>
        <button
          type="submit"
          className="btn btn--inverse-solid btn--block"
          disabled={status === "submitting"}
          aria-busy={status === "submitting" || undefined}
          data-testid="booking-submit"
        >
          {status === "submitting" ? "Enviando…" : "Enviar mensaje"}
          <ArrowRight />
        </button>
        <p className={styles.required}>* Campos obligatorios</p>
      </div>

      <div aria-live="polite" aria-atomic="true" data-testid="booking-status">
        {status === "error" && serverMessage ? (
          <div className={`${styles.status} ${styles.statusError}`}>
            <p className={styles.statusTitle}>
              {serverCode === "not_configured" ? "Envío no disponible" : "No se ha enviado"}
            </p>
            <p className={styles.statusText}>{serverMessage}</p>
            {serverCode === "not_configured" ? (
              <p className={styles.hint}>
                El formulario está maquetado y validado, pero el envío automático necesita
                configurarse con un proveedor de correo y un buzón real. No se ha enviado ningún
                mensaje.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </form>
  );
}
