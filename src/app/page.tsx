import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { PortfolioPreview } from "@/components/sections/portfolio-preview";
import { StylesSection } from "@/components/sections/styles-section";
import { Manifesto } from "@/components/sections/manifesto";
import { ProcessPreview } from "@/components/sections/process-preview";
import { BookingBand } from "@/components/sections/booking-band";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Tatuadora de línea fina en Barcelona",
  description:
    "Ona Rigola, tatuadora independiente en Barcelona. Piezas de línea fina, blackwork y ornamentales dibujadas a medida. Descubre su trabajo y solicita una cita.",
  pathname: "/",
  keywords: [
    "tatuadora en Barcelona",
    "tatuajes de línea fina en Barcelona",
    "fine line tattoo Barcelona",
    "tatuajes ornamentales Barcelona",
    "blackwork Barcelona",
  ],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <PortfolioPreview />
      <StylesSection />
      <Manifesto />
      <ProcessPreview />
      <BookingBand />
    </>
  );
}
