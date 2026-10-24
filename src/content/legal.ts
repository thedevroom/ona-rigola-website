/**
 * Contenido legal.
 *
 * ⚠️  Estos textos son una ESTRUCTURA de trabajo, no un documento legal
 * verificado. Los fragmentos entre dobles corchetes (`[[…]]`) son datos
 * obligatorios que solo puede aportar la titular (identidad, NIF, domicilio,
 * proveedor de correo, plazos de conservación). Se renderizan resaltados para
 * que sea imposible publicar la web sin revisarlos.
 */

export type LegalDocument = {
  title: string;
  intro: string;
  updatedAt: string;
  sections: { heading: string; paragraphs: string[] }[];
};

export const legalReviewNotice =
  "Documento pendiente de revisión legal. Los campos resaltados deben completarse y el conjunto debe validarse antes de publicar el sitio.";

export const privacyPolicy: LegalDocument = {
  title: "Política de privacidad",
  intro:
    "Esta política explica qué datos personales se recogen a través de este sitio web, con qué finalidad y cómo puedes ejercer tus derechos.",
  updatedAt: "Octubre de 2026",
  sections: [
    {
      heading: "Responsable del tratamiento",
      paragraphs: [
        "Titular: [[nombre y apellidos o denominación social de la titular]].",
        "NIF/NIE: [[NIF de la titular]].",
        "Domicilio a efectos de notificaciones: [[dirección completa]].",
        "Correo electrónico de contacto: [[correo electrónico de privacidad]].",
        "La responsable trata los datos de forma confidencial y conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD).",
      ],
    },
    {
      heading: "Qué datos se recogen",
      paragraphs: [
        "A través del formulario de solicitud de cita se recogen los siguientes datos: nombre, correo electrónico, descripción de la idea de tatuaje y, de forma opcional, estilo, zona del cuerpo, tamaño aproximado, disponibilidad, presupuesto orientativo y referencias que quieras compartir.",
        "No se solicitan datos especialmente protegidos. Te pedimos que no incluyas en el mensaje información de salud, datos identificativos innecesarios ni datos de terceros.",
        "Se registra además la fecha y hora del envío con el fin de gestionar la solicitud y prevenir envíos abusivos.",
      ],
    },
    {
      heading: "Finalidad y base jurídica",
      paragraphs: [
        "Los datos se utilizan exclusivamente para valorar tu solicitud, responder a tu mensaje y, en su caso, gestionar la reserva y el seguimiento de la cita.",
        "La base jurídica es tu consentimiento, otorgado al marcar la casilla de aceptación del formulario (artículo 6.1.a RGPD). Puedes retirarlo en cualquier momento escribiendo a la dirección indicada, sin que ello afecte a la licitud del tratamiento previo.",
      ],
    },
    {
      heading: "Conservación",
      paragraphs: [
        "Las solicitudes que no deriven en una cita se conservan durante [[plazo de conservación de solicitudes]] y después se eliminan.",
        "Los datos vinculados a una cita se conservan durante [[plazo de conservación de datos de clientes]] para atender obligaciones legales y de seguimiento.",
      ],
    },
    {
      heading: "Destinatarios y encargados",
      paragraphs: [
        "El envío del formulario se realiza a través de un proveedor de correo transaccional: [[nombre del proveedor de correo y país de alojamiento]].",
        "El sitio se aloja en [[proveedor de alojamiento y país]]. No se prevén cesiones de datos a terceros salvo obligación legal.",
        "Si en el futuro se incorporan herramientas de analítica o de terceros, se actualizará esta política y, cuando sea necesario, se solicitará el consentimiento previo.",
      ],
    },
    {
      heading: "Derechos de las personas interesadas",
      paragraphs: [
        "Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento, portabilidad y retirada del consentimiento escribiendo a [[correo electrónico de privacidad]] e indicando el derecho que deseas ejercer.",
        "Si consideras que el tratamiento no se ajusta a la normativa, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).",
      ],
    },
    {
      heading: "Seguridad",
      paragraphs: [
        "Se aplican medidas técnicas y organizativas razonables para proteger los datos frente a accesos no autorizados, pérdida o alteración, incluida la transmisión cifrada mediante HTTPS.",
      ],
    },
    {
      heading: "Menores de edad",
      paragraphs: [
        "El formulario no está dirigido a menores de edad. Si eres menor, [[condición aplicable: edad mínima y requisitos de autorización]] debe confirmarse antes de enviar cualquier solicitud.",
      ],
    },
  ],
};

export const legalNotice: LegalDocument = {
  title: "Aviso legal",
  intro: "Información sobre la titularidad de este sitio web y las condiciones generales de uso.",
  updatedAt: "Octubre de 2026",
  sections: [
    {
      heading: "Titularidad del sitio",
      paragraphs: [
        "Titular: [[nombre y apellidos o denominación social]].",
        "NIF/NIE: [[NIF de la titular]].",
        "Domicilio: [[dirección completa]].",
        "Correo electrónico: [[correo electrónico de contacto]].",
        "Actividad: tatuaje artístico. [[indicar epígrafe de actividad y número de registro sanitario si procede]].",
      ],
    },
    {
      heading: "Objeto y condiciones de uso",
      paragraphs: [
        "Este sitio web tiene carácter informativo y comercial: presenta el trabajo de la artista y permite enviar solicitudes de cita. El acceso es gratuito y no requiere registro.",
        "La persona usuaria se compromete a utilizar el sitio conforme a la ley, a la buena fe y a este aviso, y a no realizar actuaciones que puedan dañar el sitio o impedir su normal funcionamiento.",
      ],
    },
    {
      heading: "Propiedad intelectual",
      paragraphs: [
        "Los textos, fotografías, dibujos, diseños de tatuajes, logotipos y demás contenidos de este sitio están protegidos por la normativa de propiedad intelectual y pertenecen a su titular o se utilizan con autorización.",
        "No se permite su reproducción, distribución, transformación ni uso comercial sin autorización expresa y por escrito. Tampoco se autoriza la reproducción de los diseños de tatuajes para su ejecución por terceros.",
      ],
    },
    {
      heading: "Responsabilidad",
      paragraphs: [
        "La información publicada tiene carácter general y no constituye asesoramiento profesional sanitario. Las condiciones concretas de cada cita se acuerdan de forma individual.",
        "La titular no se responsabiliza de las interrupciones del servicio ajenas a su control ni del contenido de sitios de terceros enlazados desde esta web.",
      ],
    },
    {
      heading: "Legislación aplicable",
      paragraphs: [
        "La relación entre la titular y la persona usuaria se rige por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales de [[ciudad de jurisdicción]], salvo que la normativa de consumo establezca otro fuero.",
      ],
    },
  ],
};

export const cookiePolicy: LegalDocument = {
  title: "Política de cookies",
  intro:
    "Este sitio no utiliza cookies de analítica, publicidad ni seguimiento. Únicamente puede emplear almacenamiento técnico imprescindible para su funcionamiento.",
  updatedAt: "Octubre de 2026",
  sections: [
    {
      heading: "Qué son las cookies",
      paragraphs: [
        "Las cookies son pequeños archivos que un sitio web puede guardar en tu navegador para recordar información. También existen tecnologías similares, como el almacenamiento local, con finalidades comparables.",
      ],
    },
    {
      heading: "Cookies utilizadas actualmente",
      paragraphs: [
        "El sitio no instala cookies de analítica, publicidad, redes sociales ni perfilado. Por ese motivo no se muestra un banner de consentimiento: no hay tecnologías no esenciales que autorizar.",
        "El formulario de contacto no utiliza cookies. La protección antispam se basa en un campo oculto y en un límite de envíos por dirección IP, sin rastrear la navegación.",
        "Si en el futuro se incorpora una herramienta que requiera consentimiento, se implementará un mecanismo que lo solicite antes de activarla, permita retirarlo y conserve la elección.",
      ],
    },
    {
      heading: "Cómo gestionarlas",
      paragraphs: [
        "Puedes configurar tu navegador para bloquear o eliminar cookies y el almacenamiento local. Al no utilizarse cookies no esenciales, el bloqueo no afecta a la navegación por este sitio.",
        "Encontrarás instrucciones en la ayuda de Chrome, Safari, Firefox y Edge.",
      ],
    },
    {
      heading: "Actualizaciones",
      paragraphs: [
        "Esta política se revisará si cambian las tecnologías utilizadas. Responsable del sitio: [[nombre y apellidos o denominación social]] · [[correo electrónico de contacto]].",
      ],
    },
  ],
};
