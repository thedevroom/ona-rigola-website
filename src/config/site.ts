/**
 * Configuración central del sitio.
 *
 * Todo dato de marca, contacto o negocio modificable debe vivir aquí (o en
 * `src/content/`). Los valores marcados con `TODO PROPIETARIA` son información
 * real que solo puede aportar Ona Rigola: no se inventan en ningún punto del
 * proyecto.
 */

export type TattooStyle = {
  /** Identificador estable para filtros y datos estructurados. */
  id: "linea-fina" | "blackwork" | "ornamental";
  /** Nombre visible. */
  name: string;
  /** Descripción breve y prudente (no atribuye técnicas no confirmadas). */
  summary: string;
};

export type NavItem = {
  label: string;
  href: string;
};

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

/** URL canónica del sitio, siempre sin barra final. */
export const siteUrl = rawSiteUrl.replace(/\/+$/, "");

/** ¿Hay proveedor de correo configurado? Determina el comportamiento real del formulario. */
export const isContactDeliveryConfigured = Boolean(
  process.env.CONTACT_API_KEY && process.env.CONTACT_FROM_EMAIL && process.env.CONTACT_TO_EMAIL,
);

export const siteConfig = {
  name: "Ona Rigola",
  /** Variante tipográfica de la firma (usada en cabecera y pie). */
  wordmark: "Ona Rigola",
  /** Logotipo en versalitas espaciadas, usado en móvil y pie. */
  wordmarkUpper: "ONA RIGOLA",
  role: "Tatuadora independiente",
  roleShort: "Artista del tatuaje",
  tagline: "Pequeños trazos. Grandes historias.",
  city: "Barcelona",
  country: "España",
  countryCode: "ES",
  locale: "es-ES",
  language: "es",
  /** Año de referencia usado por el copyright. */
  copyrightYear: 2026,
  url: siteUrl,
  /**
   * Datos de contacto reales.
   * TODO PROPIETARIA: completar correo, teléfono, Instagram y estudio cuando se
   * confirmen. Mientras un valor sea `null` la interfaz NO muestra el canal
   * correspondiente (no se inventan datos de contacto).
   */
  contact: {
    email: null as string | null,
    phone: null as string | null,
    instagram: null as string | null,
    /** Dirección del estudio, solo si es un espacio con atención al público. */
    address: null as string | null,
  },
  /** Perfiles sociales verificables (vacío hasta confirmación). */
  socialProfiles: [] as string[],
  /**
   * Zona de trabajo declarada. Barcelona es el único dato geográfico
   * confirmado por la referencia de dirección de arte; no se concreta barrio,
   * dirección ni radio de servicio.
   */
  areaServed: "Barcelona",
  booking: {
    /** Duración estimada de respuesta mostrada en el formulario (editable). */
    responseNote: "Respondo personalmente a cada solicitud en un plazo de 2 a 4 días laborables.",
    /** Número máximo de caracteres de la descripción de la idea. */
    maxDescriptionLength: 1200,
  },
  styles: [
    {
      id: "linea-fina",
      name: "Línea fina",
      summary: "Trazo delicado y preciso, con composiciones ligeras que respiran sobre la piel.",
    },
    {
      id: "blackwork",
      name: "Blackwork",
      summary: "Masas de negro y contrastes rotundos, para piezas de presencia gráfica.",
    },
    {
      id: "ornamental",
      name: "Ornamental",
      summary: "Estructuras simétricas y motivos decorativos dibujados a medida.",
    },
  ] satisfies TattooStyle[],
  /**
   * Estado del contenido. `provisional` activa avisos discretos en el sitio.
   * Cambiar a `final` cuando existan fotografías y datos reales.
   */
  contentStatus: "provisional" as "provisional" | "final",
} as const;

export const mainNavigation: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Sobre mí", href: "/sobre-mi" },
  { label: "Trabajos", href: "/trabajos" },
  { label: "Proceso", href: "/proceso" },
  { label: "Preguntas", href: "/preguntas-frecuentes" },
  { label: "Contacto", href: "/contacto" },
];

export const legalNavigation: NavItem[] = [
  { label: "Privacidad", href: "/privacidad" },
  { label: "Aviso legal", href: "/aviso-legal" },
  { label: "Cookies", href: "/cookies" },
];
