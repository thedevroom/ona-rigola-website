import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/legal/legal-document";
import { legalNotice } from "@/content/legal";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata, buildBreadcrumbList } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Aviso legal",
  description:
    "Titularidad del sitio web, condiciones de uso, propiedad intelectual y responsabilidad.",
  pathname: "/aviso-legal",
  keywords: ["aviso legal", "propiedad intelectual"],
  noindex: false,
});

export default function Page() {
  return (
    <>
      <LegalDocumentView document={legalNotice} />
      <JsonLd
        id="ld-aviso-legal"
        data={buildBreadcrumbList([
          { name: "Inicio", pathname: "/" },
          { name: "Aviso legal", pathname: "/aviso-legal" },
        ])}
      />
    </>
  );
}
