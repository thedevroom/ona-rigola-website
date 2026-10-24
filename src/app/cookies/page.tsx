import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/legal/legal-document";
import { cookiePolicy } from "@/content/legal";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata, buildBreadcrumbList } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Política de cookies",
  description:
    "Este sitio no utiliza cookies de analítica ni publicidad. Información sobre las tecnologías empleadas y cómo gestionarlas.",
  pathname: "/cookies",
  keywords: ["cookies", "almacenamiento local"],
  noindex: false,
});

export default function Page() {
  return (
    <>
      <LegalDocumentView document={cookiePolicy} />
      <JsonLd
        id="ld-cookies"
        data={buildBreadcrumbList([
          { name: "Inicio", pathname: "/" },
          { name: "Política de cookies", pathname: "/cookies" },
        ])}
      />
    </>
  );
}
