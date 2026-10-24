/**
 * Preguntas frecuentes.
 *
 * Las respuestas son deliberadamente prudentes: explican el procedimiento sin
 * fijar precios, depósitos, plazos ni políticas clínicas que la artista no ha
 * confirmado. Editable desde este archivo.
 */

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    id: "solicitar-cita",
    question: "¿Cómo solicito una cita?",
    answer:
      "A través del formulario de contacto. Cuéntame la idea, la zona del cuerpo, el tamaño aproximado y tu disponibilidad. Con esa información puedo valorar el proyecto y responderte con los siguientes pasos.",
  },
  {
    id: "explicar-idea",
    question: "¿Cómo explico mi idea si no tengo un diseño?",
    answer:
      "No necesitas un diseño previo. Basta con describir el motivo, el concepto o la sensación que buscas, la zona del cuerpo y el tamaño que imaginas. A partir de ahí se propone una dirección y se dibuja la pieza.",
  },
  {
    id: "referencias",
    question: "¿Qué referencias conviene enviar?",
    answer:
      "Imágenes del estilo que te interesa, ejemplos de composición y fotografías de la zona del cuerpo donde iría el tatuaje. También ayuda saber qué no quieres. Las referencias sirven para entender el gusto, no para copiar una pieza ajena.",
  },
  {
    id: "tamano",
    question: "¿Cómo se define el tamaño de un diseño?",
    answer:
      "El tamaño se decide junto al dibujo: depende de la zona, de la cantidad de detalle y de cómo envejece la línea con el tiempo. Las proporciones se ajustan para que la pieza funcione sobre el cuerpo, no solo en pantalla.",
  },
  {
    id: "preparar-sesion",
    question: "¿Cómo me preparo para la sesión?",
    answer:
      "Descansa bien, come antes de venir y evita el alcohol las horas previas. Lleva ropa cómoda que permita acceder a la zona del tatuaje. Al confirmar la cita recibirás las recomendaciones concretas por escrito.",
  },
  {
    id: "antes-de-reservar",
    question: "¿Qué información debo confirmar antes de reservar?",
    answer:
      "La fecha y la duración estimada, el diseño final y las condiciones de la reserva. Todo se acuerda por escrito antes de la cita para que no haya dudas el día de la sesión.",
  },
  {
    id: "cuidados",
    question: "¿Cómo consulto los cuidados posteriores?",
    answer:
      "Las pautas se entregan al terminar la sesión y explican la limpieza, la hidratación y las señales a vigilar durante la cicatrización. Si surge cualquier duda, escríbeme directamente. Ante una reacción que te preocupe, consulta con un profesional sanitario.",
  },
  {
    id: "dudas",
    question: "¿Cómo contacto si me surge una duda?",
    answer:
      "El formulario de contacto es el canal principal para solicitudes nuevas. Para seguimiento de una cita ya confirmada, utiliza el mismo canal por el que se acordó la reserva. Los datos de contacto directos se publicarán cuando estén confirmados.",
  },
  {
    id: "precio",
    question: "¿Cuánto cuesta un tatuaje?",
    answer:
      "El presupuesto depende del tamaño, el detalle y el tiempo de sesión, por lo que se valora caso por caso. Las condiciones económicas se comunican antes de reservar, nunca después.",
  },
];
