import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/legal/legal-document";
import { privacyPolicy } from "@/content/legal";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata, buildBreadcrumbList } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Política de privacidad",
  description:
    "Información sobre el tratamiento de datos personales del formulario de solicitud de cita: finalidad, base jurídica, conservación y derechos.",
  pathname: "/privacidad",
  keywords: ["privacidad", "protección de datos", "RGPD"],
  noindex: false,
});

export default function Page() {
  return (
    <>
      <LegalDocumentView document={privacyPolicy} />
      <JsonLd
        id="ld-privacidad"
        data={buildBreadcrumbList([
          { name: "Inicio", pathname: "/" },
          { name: "Política de privacidad", pathname: "/privacidad" },
        ])}
      />
    </>
  );
}
