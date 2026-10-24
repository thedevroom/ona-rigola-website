import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * Datos estructurados.
 *
 * Solo se declara lo que la web demuestra de forma visible: una artista
 * (Person), el sitio (WebSite) y sus migas de navegación (BreadcrumbList).
 *
 * No se emite LocalBusiness ni ProfessionalService porque implicaría afirmar
 * una dirección física, horarios y una entidad jurídica que todavía no están
 * confirmados. Cuando la propietaria facilite esos datos, este archivo es el
 * único lugar a modificar (ver README).
 */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absoluteUrl("/#ona-rigola"),
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    description:
      "Tatuadora independiente en Barcelona especializada en piezas de línea fina, blackwork y diseños ornamentales dibujados a medida.",
    url: absoluteUrl("/sobre-mi"),
    image: absoluteUrl("/images/retrato/ona-rigola-retrato-editorial.jpg"),
    knowsAbout: siteConfig.styles.map((style) => style.name),
    homeLocation: {
      "@type": "Place",
      name: siteConfig.areaServed,
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.areaServed,
        addressCountry: siteConfig.countryCode,
      },
    },
    sameAs: siteConfig.socialProfiles,
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: absoluteUrl("/"),
    name: siteConfig.name,
    inLanguage: siteConfig.language,
    publisher: { "@id": absoluteUrl("/#ona-rigola") },
  };
}

export function profilePageSchema(pathname: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absoluteUrl(pathname),
    inLanguage: siteConfig.language,
    mainEntity: { "@id": absoluteUrl("/#ona-rigola") },
  };
}
