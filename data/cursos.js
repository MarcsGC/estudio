/* =========================================================
   CURSOS, ASIGNATURAS Y APUNTES
   ---------------------------------------------------------
   Para añadir una asignatura, copia un bloque { ... } dentro de
   "asignaturas" y cambia los datos.

   - id:      nombre corto sin espacios ni tildes (se usa en las rutas
              y en el nombre del archivo de preguntas)
   - temas:   orden en que salen los temas. Usa los mismos nombres
              en los PDFs y en las preguntas.
   - pdfs:    lista de apuntes. "archivo" es la ruta dentro del repositorio.
   ========================================================= */

window.SITIO = {
  titulo: "Mi web de estudio",
  subtitulo: "Apuntes del campus y tests para repasar, organizados por curso, asignatura y tema."
};

window.CURSOS = [
  {
    id: "3",
    corto: "3º",
    nombre: "3º curso",
    descripcion: "Grado en Ingeniería Informática del Software · Universidad de Oviedo",
    asignaturas: [
      {
        id: "sew",
        nombre: "Software y Estándares para la Web",
        descripcion: "Lenguajes de marcado, CSS, tecnologías XML y seminarios de usabilidad, adaptabilidad y accesibilidad.",
        color: "#2f5d8a",
        temas: [
          "T1 · Lenguajes de marcado",
          "T2 · HTML5",
          "T3 · Lenguajes de presentación",
          "T4 · CSS",
          "T5 · CSS: posicionamiento y maquetación",
          "T6 · Diseño con estándares",
          "T7 · XML: introducción",
          "T8 · XML: DTD",
          "T9 · XML Schema",
          "T10 · XPath",
          "T11 · XSLT",
          "T12 · Procesamiento de XML",
          "S1-2 · Usabilidad",
          "S3 · Adaptabilidad",
          "S4 · Accesibilidad"
        ],
        pdfs: [
          { titulo: "Lenguajes de marcado", archivo: "pdfs/3/sew/01-lenguajes-de-marcado.pdf", tema: "T1 · Lenguajes de marcado", nota: "14 diapositivas" },
          { titulo: "HTML5", archivo: "pdfs/3/sew/02-html5.pdf", tema: "T2 · HTML5", nota: "180 diapositivas" },
          { titulo: "Lenguajes de presentación", archivo: "pdfs/3/sew/03-lenguajes-de-presentacion.pdf", tema: "T3 · Lenguajes de presentación", nota: "20 diapositivas" },
          { titulo: "CSS - Cascading Style Sheets", archivo: "pdfs/3/sew/04-css.pdf", tema: "T4 · CSS", nota: "98 diapositivas" },
          { titulo: "CSS - Técnicas de posicionamiento y maquetación", archivo: "pdfs/3/sew/05-css-posicionamiento.pdf", tema: "T5 · CSS: posicionamiento y maquetación", nota: "69 diapositivas" },
          { titulo: "Diseño con estándares", archivo: "pdfs/3/sew/06-diseno-con-estandares.pdf", tema: "T6 · Diseño con estándares", nota: "55 diapositivas" },
          { titulo: "XML: introducción", archivo: "pdfs/3/sew/07-xml-introduccion.pdf", tema: "T7 · XML: introducción", nota: "109 diapositivas" },
          { titulo: "DTD (Document Type Definition)", archivo: "pdfs/3/sew/08-xml-dtd.pdf", tema: "T8 · XML: DTD", nota: "69 diapositivas" },
          { titulo: "Esquemas XML (XML Schema)", archivo: "pdfs/3/sew/09-xml-schema.pdf", tema: "T9 · XML Schema", nota: "130 diapositivas" },
          { titulo: "XPath", archivo: "pdfs/3/sew/10-xpath.pdf", tema: "T10 · XPath", nota: "35 diapositivas" },
          { titulo: "Transformación de documentos XML (XSLT)", archivo: "pdfs/3/sew/11-xslt.pdf", tema: "T11 · XSLT", nota: "148 diapositivas" },
          { titulo: "Procesamiento y generación de XML", archivo: "pdfs/3/sew/12-procesamiento-xml.pdf", tema: "T12 · Procesamiento de XML", nota: "126 diapositivas" },
          { titulo: "Seminario 1: Usabilidad en la Web (parte 1)", archivo: "pdfs/3/sew/s1-usabilidad-parte1.pdf", tema: "S1-2 · Usabilidad", nota: "63 diapositivas" },
          { titulo: "Seminario 2: Usabilidad en la Web (parte 2)", archivo: "pdfs/3/sew/s2-usabilidad-parte2.pdf", tema: "S1-2 · Usabilidad", nota: "67 diapositivas" },
          { titulo: "Seminario 3: Adaptabilidad en la Web", archivo: "pdfs/3/sew/s3-adaptabilidad.pdf", tema: "S3 · Adaptabilidad", nota: "64 diapositivas" },
          { titulo: "Seminario 4: Accesibilidad en la Web", archivo: "pdfs/3/sew/s4-accesibilidad.pdf", tema: "S4 · Accesibilidad", nota: "142 diapositivas" }
        ]
      }

      /* Plantilla para otra asignatura (borra la barra-asterisco de esta
         línea y la del final del bloque para activarla):
      ,{
        id: "mi-asignatura",
        nombre: "Nombre de la asignatura",
        descripcion: "Profesor/a, cuatrimestre…",
        color: "#8a4b2f",
        temas: ["Tema 1", "Tema 2", "Tema 3"],
        pdfs: [
          { titulo: "Tema 1 - Introducción", archivo: "pdfs/3/mi-asignatura/tema1.pdf", tema: "Tema 1" }
        ]
      }
      */
    ]
  }

  /* Cuando pases de curso, añade otro bloque igual con id: "4" */
];
