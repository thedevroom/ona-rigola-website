/**
 * Textos de presentación de la artista.
 *
 * TODO PROPIETARIA: este texto es PROVISIONAL. No contiene biografía,
 * titulaciones, años de experiencia, premios ni formación porque no disponemos
 * de esos datos verificados. Puede sustituirse libremente manteniendo el tono.
 */

export type Paragraph = string;

export const intro = "Pequeños trazos. Grandes historias.";

export const homeIntro: Paragraph[] = [
  "Líneas delicadas y composiciones editoriales. Diseño cada pieza desde el dibujo, nunca desde la plantilla, para que funcione sobre el cuerpo y no solo sobre el papel.",
];

export const homeIntroSecondary: Paragraph[] = [
  "Trabajo el tatuaje como una pieza gráfica: pocos elementos, bien medidos, pensados para acompañar la forma del cuerpo. Cada diseño nace de una conversación y de un dibujo propio.",
];

export const about = {
  eyebrow: "Sobre mí",
  title: "Dibujar despacio, tatuar con intención.",
  lead: "Soy Ona Rigola, tatuadora independiente en Barcelona. Mi trabajo parte del dibujo y termina en la piel, con piezas de línea fina, blackwork y motivos ornamentales.",
  paragraphs: [
    "Trabajo desde la calma. Antes de tatuar, dedico tiempo a entender qué quieres contar y cómo traducirlo a una composición que tenga sentido sobre tu cuerpo: la escala, la dirección de la línea y el espacio libre importan tanto como el motivo.",
    "Me interesa la elegancia de lo sencillo. Prefiero una pieza con pocos elementos y muy bien resueltos que una acumulación de detalles. Por eso cada diseño se dibuja a medida, se revisa contigo y se ajusta antes de la sesión.",
    "Mi referencia estética es editorial: tipografía, fotografía en blanco y negro, papel y tinta. Esa mirada se traslada al estudio y al modo en que planteo cada tatuaje, desde la primera idea hasta el resultado final.",
  ],
  /** Texto explícitamente provisional, visible solo mientras no haya biografía real. */
  provisionalNote:
    "Texto de presentación provisional. La biografía definitiva, la formación y la trayectoria se incorporarán cuando la artista facilite la información.",
  philosophy: {
    title: "Filosofía",
    quote:
      "Un tatuaje empieza mucho antes de la aguja: empieza en una conversación y en un dibujo.",
    paragraphs: [
      "Diseñar desde cero permite que la pieza sea tuya. Escucho la idea, propongo una dirección y la trabajo hasta que encaja contigo y con la zona del cuerpo.",
      "El resultado busca ser atemporal: líneas limpias, proporciones cuidadas y una composición que siga teniendo sentido con los años.",
    ],
  },
  influences: {
    title: "Influencias",
    items: [
      "Grabado botánico y láminas antiguas",
      "Tipografía editorial y diseño de revistas",
      "Fotografía en blanco y negro",
      "Arquitectura y geometría ornamental",
    ],
    note: "Una selección de referentes que puede ampliarse con nuevas miradas.",
  },
  approach: {
    title: "Cómo trabajo tu idea",
    steps: [
      {
        title: "Escuchar",
        text: "Me cuentas la idea, el motivo y el lugar del cuerpo. Cuanta más información, mejor puedo proponer.",
      },
      {
        title: "Dibujar",
        text: "Traduzco la idea a una composición propia, ajustada a la escala y a la forma de la zona elegida.",
      },
      {
        title: "Afinar",
        text: "Revisamos juntas el dibujo y resolvemos dudas antes de reservar la sesión.",
      },
    ],
  },
} as const;
