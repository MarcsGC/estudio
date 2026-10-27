/* =========================================================
   PREGUNTAS CORTAS DE: Software y Estándares para la Web (3º)
   ---------------------------------------------------------
   Cada pregunta:
     tema:      igual que en data/cursos.js
     pregunta:  enunciado
     respuesta: respuesta modelo
     claves:    conceptos que debería tener tu respuesta. Para cada uno:
                  t:   texto que se muestra
                  b:   palabras o trozos que se buscan en tu respuesta
                       (vale con que aparezca uno; sin tildes ni mayúsculas;
                       "a&b" significa que deben aparecer los dos)
   ========================================================= */

registrarCortas("3", "sew", [

  // T1 · Lenguajes de marcado
  { tema: "T1 · Lenguajes de marcado", pregunta: "¿Qué es SGML y por qué no se adoptó directamente en la Web?",
    respuesta: "SGML (Standard Generalized Markup Language) es un estándar ISO (8879:1986) para crear formatos de documentos mediante marcado estructural; se centra solo en la estructura. Era demasiado complicado para adoptarlo en la Web, por eso se usaron subconjuntos y versiones simplificadas como HTML y XML.",
    claves: [
      { t: "Lenguaje de marcado generalizado / estándar", b: ["generalizado", "generalized", "estandar"] },
      { t: "Normalizado por ISO (8879:1986)", b: ["iso", "8879", "1986"] },
      { t: "Se centra en la estructura del documento", b: ["estructura"] },
      { t: "Demasiado complejo para la Web", b: ["complicad", "complej", "dificil"] }
    ] },
  { tema: "T1 · Lenguajes de marcado", pregunta: "¿Qué es el WHATWG y por qué se creó?",
    respuesta: "El WHATWG (Web Hypertext Application Technology Working Group) se creó en 2004 por Apple, Mozilla y Opera como respuesta a la paralización de HTML por parte del W3C, que priorizaba XHTML. Desarrolló HTML5, que el W3C adoptó en 2007, y hoy mantiene HTML como estándar vivo (Living Standard).",
    claves: [
      { t: "Creado en 2004", b: ["2004"] },
      { t: "Apple, Mozilla y Opera", b: ["apple", "mozilla", "opera"] },
      { t: "Respuesta a la paralización de HTML por el W3C (priorizaba XHTML)", b: ["paraliz", "xhtml", "parado", "abandon"] },
      { t: "Mantiene HTML / HTML5 (Living Standard)", b: ["html5", "living", "estandar vivo", "mantiene"] }
    ] },
  { tema: "T1 · Lenguajes de marcado", pregunta: "¿Qué es XHTML?",
    respuesta: "XHTML (eXtensible HyperText Markup Language) es una familia de tipos de documentos que reformula HTML 4 en XML 1.0. Tiene la misma semántica que HTML 4 y se creó para mejorar la interoperabilidad. XHTML 1.0 fue recomendación del W3C en 2000; en 2010 se cerró el grupo de XHTML2.",
    claves: [
      { t: "Reformulación de HTML (4) en XML", b: ["xml&html", "reformula"] },
      { t: "Familia de tipos de documentos", b: ["familia"] },
      { t: "Misma semántica que HTML 4", b: ["semantica", "html 4", "html4"] },
      { t: "Mejorar la interoperabilidad", b: ["interoperab"] }
    ] },
  { tema: "T1 · Lenguajes de marcado", pregunta: "¿Qué objetivos tiene XML según los apuntes?",
    respuesta: "XML es un metalenguaje (versión simplificada de SGML, creado por el W3C) cuyos objetivos son: ser un estándar de intercambio de información a través de la Web, ser un formato abierto e independiente de la plataforma, permitir vocabularios específicos de cada aplicación y que esos vocabularios se auto-describan, de modo que las aplicaciones puedan descubrir el formato de la información.",
    claves: [
      { t: "Intercambio de información en la Web", b: ["intercambi"] },
      { t: "Formato abierto e independiente de la plataforma", b: ["abierto", "independiente", "plataforma"] },
      { t: "Vocabularios específicos de la aplicación", b: ["vocabulario"] },
      { t: "Documentos auto-descritos", b: ["autodescri", "auto-descri", "auto descri", "describ"] }
    ] },
  { tema: "T1 · Lenguajes de marcado", pregunta: "¿Qué acordaron el W3C y el WHATWG en el Memorandum of Understanding de 2019?",
    respuesta: "El 28 de mayo de 2019 firmaron un acuerdo para que haya una única versión de HTML y una única especificación del DOM, ambas publicadas por el WHATWG (html.spec.whatwg.org y dom.spec.whatwg.org).",
    claves: [
      { t: "Una única versión de HTML", b: ["unica&html", "una sola&html", "version unica", "un solo html", "una version"] },
      { t: "Una única especificación del DOM", b: ["dom"] },
      { t: "Publicadas/mantenidas por el WHATWG", b: ["whatwg"] }
    ] },

  // T2 · HTML5
  { tema: "T2 · HTML5", pregunta: "¿Para qué sirve <!DOCTYPE html> y qué lo diferencia del DOCTYPE de XHTML 1.1?",
    respuesta: "Es imprescindible porque activa el modo estándar del navegador y hace que el documento se interprete como HTML moderno. A diferencia de XHTML 1.1, no hace referencia a ningún DTD externo.",
    claves: [
      { t: "Activa el modo estándar del navegador", b: ["modo estandar", "estandar", "standards"] },
      { t: "Interpreta el documento como HTML moderno", b: ["moderno", "html5", "interpret"] },
      { t: "No usa un DTD externo (XHTML sí)", b: ["dtd"] }
    ] },
  { tema: "T2 · HTML5", pregunta: "¿Cuándo usar <article> y cuándo <section>?",
    respuesta: "<section> agrupa contenido relacionado temáticamente dentro del documento. <article> agrupa contenido autocontenido que podría distribuirse o reutilizarse fuera del documento manteniendo su sentido (por ejemplo, la ficha de un destino que se puede publicar en otra página). Ambos deberían tener un encabezado h1-h6.",
    claves: [
      { t: "section: agrupación temática de contenido relacionado", b: ["tematic", "relacionad", "agrupa"] },
      { t: "article: contenido autocontenido / independiente", b: ["autocontenid", "independiente", "por si mismo", "sentido"] },
      { t: "article se puede reutilizar o distribuir fuera del documento", b: ["reutiliz", "distribu", "fuera", "otra pagina"] },
      { t: "Ambos con encabezado h1-h6", b: ["encabezado", "h1", "h2", "titulo"] }
    ] },
  { tema: "T2 · HTML5", pregunta: "¿Qué elementos deben ir siempre en el <head> de un documento HTML?",
    respuesta: "Siempre hay que indicar la codificación de caracteres con <meta charset=\"utf-8\" /> y el elemento <title> con el nombre del documento, que debe identificarlo incluso fuera de contexto (aparece en la pestaña y en el historial).",
    claves: [
      { t: "meta charset (codificación, UTF-8)", b: ["charset", "codificacion", "utf"] },
      { t: "title (nombre del documento)", b: ["title", "titulo"] }
    ] },
  { tema: "T2 · HTML5", pregunta: "¿Qué es el árbol DOM y qué tipos de nodos contiene?",
    respuesta: "El DOM (Document Object Model) es la representación en memoria del documento que construye el navegador al analizarlo (parser). Es un árbol con nodos de tipo de documento, de elementos, de texto, de comentarios y de instrucciones de procesamiento. Se puede manipular desde scripts a través de su API.",
    claves: [
      { t: "Representación en memoria del documento", b: ["memoria", "representacion"] },
      { t: "Lo construye el navegador al analizar (parsear)", b: ["navegador", "parser", "analiza"] },
      { t: "Nodos de elementos", b: ["element"] },
      { t: "Nodos de texto", b: ["texto", "text"] },
      { t: "Nodos de comentario / tipo de documento", b: ["comentario", "doctype", "tipo de documento"] }
    ] },
  { tema: "T2 · HTML5", pregunta: "¿Qué dice la especificación sobre <div> y <span>?",
    respuesta: "Son elementos genéricos sin significado semántico: <div> para bloques y <span> para contenido en línea. Deben usarse como último recurso, solo cuando ningún elemento semántico (section, article, strong, em…) sea adecuado, porque los semánticos mejoran la accesibilidad y el mantenimiento.",
    claves: [
      { t: "Genéricos, sin significado semántico", b: ["generic", "sin significado", "semantic"] },
      { t: "div para bloque, span en línea", b: ["bloque", "linea"] },
      { t: "Último recurso", b: ["ultimo recurso", "ultimo"] },
      { t: "Mejor usar elementos semánticos (accesibilidad)", b: ["accesib", "semantic", "mantenimiento"] }
    ] },
  { tema: "T2 · HTML5", pregunta: "¿Cómo se hace accesible una tabla de datos?",
    respuesta: "Usando <th> para los encabezados y <caption> para el título. En tablas sencillas se añade scope (col/row) a los <th>; en tablas complejas se identifican los <th> con id y cada <td> se relaciona con sus encabezados mediante el atributo headers. Además, se pueden usar <thead>, <tbody> y <tfoot>. Y nunca usar tablas para maquetar.",
    claves: [
      { t: "th para los encabezados", b: ["th", "encabezado"] },
      { t: "scope en tablas sencillas", b: ["scope"] },
      { t: "id + headers en tablas complejas", b: ["headers", "id"] },
      { t: "caption / thead-tbody-tfoot", b: ["caption", "thead", "tbody"] }
    ] },
  { tema: "T2 · HTML5", pregunta: "¿Qué atributos de <img> son obligatorios y para qué sirven width y height?",
    respuesta: "src (la imagen a mostrar) y alt (texto alternativo para cuando no se puede mostrar y para los lectores de pantalla) son obligatorios. width y height no sirven para redimensionar: informan al navegador del tamaño para que reserve el espacio y la página no se mueva al cargar.",
    claves: [
      { t: "src obligatorio", b: ["src"] },
      { t: "alt obligatorio (texto alternativo, lectores de pantalla)", b: ["alt"] },
      { t: "width/height informan del tamaño y reservan espacio", b: ["reserv", "espacio", "inform", "estabilidad"] },
      { t: "No se usan para redimensionar", b: ["no&redimension", "no&cambiar el tamano"] }
    ] },

  // T3 · Lenguajes de presentación
  { tema: "T3 · Lenguajes de presentación", pregunta: "¿Qué ventajas tiene separar contenido y presentación?",
    respuesta: "Facilita el mantenimiento, permite reutilizar el contenido, mejora la accesibilidad, reduce la duplicación de código y facilita la adaptación a distintos dispositivos. El contenido va en HTML y la presentación en CSS.",
    claves: [
      { t: "Facilita el mantenimiento", b: ["manten"] },
      { t: "Reutilización", b: ["reutiliz"] },
      { t: "Mejora la accesibilidad", b: ["accesib"] },
      { t: "Reduce la duplicación de código", b: ["duplic"] },
      { t: "Adaptación a distintos dispositivos", b: ["dispositivo", "adapta"] }
    ] },
  { tema: "T3 · Lenguajes de presentación", pregunta: "¿Por qué en CSS se habla de «niveles» y no de versiones? ¿Existe CSS4?",
    respuesta: "Porque cada nivel se construye sobre el anterior refinando definiciones y añadiendo características: un nivel superior es un superconjunto del inferior. CSS4 no existe como tal: desde CSS3 hay módulos independientes y algunos alcanzan el nivel 4 (por ejemplo Selectors Level 4 o Color Level 4).",
    claves: [
      { t: "Cada nivel se construye sobre el anterior (superconjunto)", b: ["superconjunto", "anterior", "construye"] },
      { t: "CSS4 no existe como tal", b: ["no existe", "no hay", "no es"] },
      { t: "Módulos independientes que llegan al nivel 4", b: ["modul"] }
    ] },
  { tema: "T3 · Lenguajes de presentación", pregunta: "En CSS3, ¿en qué nivel empieza un módulo nuevo y en cuál uno que viene de CSS 2.1?",
    respuesta: "CSS3 usa CSS 2.1 como núcleo y se construye módulo a módulo. Los módulos que no existían en CSS 2.1 empiezan en el nivel 1; los que actualizan algo de CSS 2.1 empiezan en el nivel 3 y pueden llegar al 4 o superior.",
    claves: [
      { t: "Módulos nuevos: nivel 1", b: ["nivel 1", "en el 1", "nivel uno"] },
      { t: "Módulos que vienen de CSS 2.1: nivel 3", b: ["nivel 3", "en el 3", "nivel tres"] },
      { t: "CSS 2.1 es el núcleo", b: ["2.1", "nucleo", "core"] }
    ] },
  { tema: "T3 · Lenguajes de presentación", pregunta: "Enumera algunos principios de diseño de CSS.",
    respuesta: "Separación entre contenido y presentación, compatibilidad entre navegadores, independencia de dispositivo/plataforma/agente, mantenibilidad, flexibilidad y reutilización, accesibilidad, simplicidad de uso y evolución continua mediante módulos manteniendo la compatibilidad.",
    claves: [
      { t: "Separación contenido / presentación", b: ["separ"] },
      { t: "Compatibilidad entre navegadores", b: ["navegador", "compatib"] },
      { t: "Independencia de dispositivo", b: ["independ", "dispositivo"] },
      { t: "Mantenibilidad / reutilización", b: ["manten", "reutiliz"] },
      { t: "Accesibilidad", b: ["accesib"] }
    ] },

  // T4 · CSS
  { tema: "T4 · CSS", pregunta: "¿Cuáles son las partes de una regla CSS? Pon un ejemplo.",
    respuesta: "Una regla tiene un selector (indica a qué elementos se aplica) y un bloque de declaraciones entre llaves. Cada declaración es propiedad: valor; y termina en punto y coma. Ejemplo: h2 { color: green; } → selector h2, propiedad color, valor green.",
    claves: [
      { t: "Selector", b: ["selector"] },
      { t: "Declaración (entre llaves)", b: ["declaracion", "llave"] },
      { t: "Propiedad", b: ["propiedad"] },
      { t: "Valor", b: ["valor"] }
    ] },
  { tema: "T4 · CSS", pregunta: "Explica cómo se calcula la especificidad de un selector y calcula la de «ul ol li.aviso».",
    respuesta: "Se cuenta abc: a = número de selectores de id, b = número de clases, selectores de atributo y pseudoclases, c = número de selectores de tipo y pseudoelementos. El selector universal se ignora. Se forma un número de tres cifras (no se suman). ul ol li.aviso → a=0, b=1, c=3 → 013.",
    claves: [
      { t: "a = ids", b: ["id"] },
      { t: "b = clases, atributos y pseudoclases", b: ["clase", "atributo", "pseudoclase"] },
      { t: "c = tipos y pseudoelementos", b: ["tipo", "elemento"] },
      { t: "Resultado 013", b: ["013", "0,1,3", "0 1 3", "(0,1,3)"] }
    ] },
  { tema: "T4 · CSS", pregunta: "¿Qué criterios usa la cascada para decidir qué declaración se aplica?",
    respuesta: "Ordena las declaraciones en conflicto por: 1) origen e importancia (navegador, autor, usuario, !important…), 2) especificidad del selector, 3) orden de aparición (gana la última). Si no hay ninguna declaración, se usa el valor heredado o el inicial.",
    claves: [
      { t: "Origen e importancia", b: ["origen", "importan"] },
      { t: "Especificidad", b: ["especificidad"] },
      { t: "Orden de aparición (gana la última)", b: ["orden", "ultim", "aparicion"] }
    ] },
  { tema: "T4 · CSS", pregunta: "Explica el modelo de caja de CSS.",
    respuesta: "Cada elemento se representa con una caja rectangular formada por cuatro áreas, de dentro hacia fuera: contenido (width/height), relleno o padding (entre contenido y borde), borde (border) y margen (margin, espacio exterior). El ancho total suma margen, borde y relleno de ambos lados más el contenido.",
    claves: [
      { t: "Contenido", b: ["contenido", "content"] },
      { t: "Relleno (padding)", b: ["padding", "relleno"] },
      { t: "Borde (border)", b: ["borde", "border"] },
      { t: "Margen (margin)", b: ["margen", "margin"] }
    ] },
  { tema: "T4 · CSS", pregunta: "Diferencia entre em y rem. Si html tiene 16px y body 20px, ¿cuánto mide 2rem y 1.5em en un p hijo de body?",
    respuesta: "em es relativo al tamaño de fuente del elemento padre (para font-size) y rem al del elemento raíz (html). 2rem = 2 × 16 = 32px; 1.5em en un p hijo de body = 1.5 × 20 = 30px.",
    claves: [
      { t: "em: relativo al padre / elemento", b: ["padre", "elemento"] },
      { t: "rem: relativo a la raíz (html)", b: ["raiz", "root", "html"] },
      { t: "2rem = 32px", b: ["32"] },
      { t: "1.5em = 30px", b: ["30"] }
    ] },
  { tema: "T4 · CSS", pregunta: "¿Qué tres formas hay de aplicar estilos y cuál es la recomendada?",
    respuesta: "Estilos en línea (atributo style, solo a ese elemento, poco reutilizable), hojas de estilo internas (elemento <style>, solo afectan a ese documento) y hojas externas (enlazadas con <link>). La recomendada es la externa: reutilización, mantenimiento, separación de contenido y presentación, y caché del navegador.",
    claves: [
      { t: "En línea (atributo style)", b: ["linea", "style"] },
      { t: "Interna (elemento <style>)", b: ["interna"] },
      { t: "Externa (<link>)", b: ["extern", "link"] },
      { t: "La externa es la recomendada (reutilización, mantenimiento)", b: ["reutiliz", "manten", "cache"] }
    ] },

  // T5 · CSS: posicionamiento y maquetación
  { tema: "T5 · CSS: posicionamiento y maquetación", pregunta: "Explica los valores de la propiedad position.",
    respuesta: "static: valor por defecto, flujo normal, ignora top/left… relative: mantiene su espacio y se desplaza respecto a su posición normal; sirve de referencia a los absolutos. absolute: sale del flujo y se posiciona respecto al contenedor posicionado más cercano. fixed: fijo respecto a la pantalla aunque se haga scroll. sticky: como relative hasta que, al hacer scroll, se queda fijo dentro de su contenedor.",
    claves: [
      { t: "static (por defecto, flujo normal)", b: ["static"] },
      { t: "relative (mantiene su espacio, se desplaza)", b: ["relative"] },
      { t: "absolute (sale del flujo, respecto al contenedor)", b: ["absolute"] },
      { t: "fixed (fijo respecto a la pantalla)", b: ["fixed"] },
      { t: "sticky (relative que se queda fijo al hacer scroll)", b: ["sticky"] }
    ] },
  { tema: "T5 · CSS: posicionamiento y maquetación", pregunta: "¿Cuándo usar Flexbox y cuándo Grid?",
    respuesta: "Flexbox organiza elementos en una dimensión (fila o columna) y se usa para componentes: menús, botones, tarjetas, barras… Grid trabaja en dos dimensiones (filas y columnas a la vez) y se usa para la estructura general de la página. Se combinan: Grid para las grandes regiones y Flexbox para el contenido interno.",
    claves: [
      { t: "Flexbox: una dimensión", b: ["una dimension", "unidimension", "1 dimension", "fila o columna"] },
      { t: "Grid: dos dimensiones", b: ["dos dimension", "bidimension", "2 dimension", "filas y columnas"] },
      { t: "Flexbox para componentes", b: ["component", "menu", "boton"] },
      { t: "Grid para la estructura general / se combinan", b: ["estructura", "combin", "layout"] }
    ] },
  { tema: "T5 · CSS: posicionamiento y maquetación", pregunta: "¿Qué hacen justify-content y align-items en Flexbox?",
    respuesta: "justify-content alinea los elementos sobre el eje principal (con valores como flex-start, center, flex-end, space-between, space-around o space-evenly). align-items los alinea sobre el eje transversal (flex-start, center, flex-end, stretch).",
    claves: [
      { t: "justify-content: eje principal", b: ["principal"] },
      { t: "align-items: eje transversal", b: ["transversal", "secundario", "cruzado"] },
      { t: "Algún valor (center, space-between…)", b: ["center", "space", "flex-start", "stretch"] }
    ] },
  { tema: "T5 · CSS: posicionamiento y maquetación", pregunta: "Diferencia entre auto-fill y auto-fit en grid-template-columns: repeat(…, minmax(200px, 1fr)).",
    respuesta: "Ambos crean tantas columnas como quepan con un mínimo de 200px. auto-fill mantiene las columnas vacías y reserva su espacio; auto-fit hace que las columnas vacías desaparezcan y redistribuye el espacio libre entre las que tienen contenido, por eso es el habitual en diseños de tarjetas responsive.",
    claves: [
      { t: "Ambos crean tantas columnas como quepan", b: ["tantas", "quepan", "posible"] },
      { t: "auto-fill mantiene las columnas vacías", b: ["vacia&fill", "mantiene", "reserva"] },
      { t: "auto-fit elimina las vacías y redistribuye el espacio", b: ["desaparec", "redistribu", "elimina", "colaps"] }
    ] },
  { tema: "T5 · CSS: posicionamiento y maquetación", pregunta: "¿Qué es Mobile First y cómo se aplica con media queries?",
    respuesta: "Consiste en diseñar primero para pantallas pequeñas (móvil) y después ampliar el diseño para pantallas mayores. Con media queries se escriben los estilos base para móvil y se añaden reglas con @media (min-width: 768px) {…} para adaptar a tableta o escritorio.",
    claves: [
      { t: "Diseñar primero para móvil / pantallas pequeñas", b: ["primero", "movil", "pequen"] },
      { t: "Ampliar después a pantallas mayores", b: ["ampli", "mayor", "grande", "escritorio"] },
      { t: "Media queries con min-width", b: ["min-width", "min width", "@media"] }
    ] },

  // T6 · Diseño con estándares
  { tema: "T6 · Diseño con estándares", pregunta: "¿Cuáles son las tres capas de un sitio web y qué tecnologías corresponden a cada una?",
    respuesta: "Estructura: la información y los datos, con lenguajes de marcado (HTML, XML). Presentación: la apariencia (tipografía, colores, disposición) con CSS. Comportamiento: la funcionalidad y los efectos, con ECMAScript/JavaScript en el cliente y PHP en el servidor.",
    claves: [
      { t: "Estructura (HTML/XML)", b: ["estructura"] },
      { t: "Presentación (CSS)", b: ["presentacion", "css"] },
      { t: "Comportamiento (JavaScript/ECMAScript, PHP)", b: ["comportamiento", "javascript", "ecmascript", "php"] }
    ] },
  { tema: "T6 · Diseño con estándares", pregunta: "¿Por qué usar estándares web?",
    respuesta: "Porque son abiertos (libres de patentes y licencias), garantizan la compatibilidad («no rompas la web»: lo nuevo es compatible con lo anterior), mejoran la accesibilidad y la usabilidad, la seguridad (HTTPS, evitar XSS…) y el posicionamiento en buscadores (SEO).",
    claves: [
      { t: "Abiertos (sin patentes ni licencias)", b: ["abierto", "libre", "patente"] },
      { t: "Compatibilidad («no rompas la web»)", b: ["compatib", "rompas"] },
      { t: "Accesibilidad y usabilidad", b: ["accesib", "usabil"] },
      { t: "Seguridad", b: ["segur"] },
      { t: "SEO / buscadores", b: ["seo", "buscador", "posicion"] }
    ] },
  { tema: "T6 · Diseño con estándares", pregunta: "¿Cuáles son los objetivos del W3C?",
    respuesta: "Desarrollar estándares web abiertos, la accesibilidad (pautas WCAG), proporcionar herramientas de validación (marcado y CSS), la educación y divulgación, y la internacionalización. Lo fundó Tim Berners-Lee en 1994.",
    claves: [
      { t: "Desarrollo de estándares web", b: ["estandar"] },
      { t: "Accesibilidad (WCAG)", b: ["accesib", "wcag"] },
      { t: "Herramientas de validación", b: ["valid"] },
      { t: "Educación y divulgación", b: ["educa", "divulga"] },
      { t: "Internacionalización", b: ["internacional"] }
    ] },

  // T7 · XML: introducción
  { tema: "T7 · XML: introducción", pregunta: "¿Qué diferencia hay entre un documento XML bien formado y uno válido?",
    respuesta: "Bien formado: cumple la sintaxis de XML (un único elemento raíz, etiquetas cerradas y correctamente anidadas, atributos entre comillas, sin repetir…). No se comprueba contra ningún DTD ni Schema. Válido: además de estar bien formado, su estructura cumple su DTD o XML Schema. Todo documento válido está bien formado, pero no al revés.",
    claves: [
      { t: "Bien formado: cumple la sintaxis XML", b: ["sintaxis", "reglas"] },
      { t: "Un único elemento raíz", b: ["raiz"] },
      { t: "Etiquetas correctamente anidadas / cerradas", b: ["anidad", "cerrad"] },
      { t: "Válido: cumple su DTD o XML Schema", b: ["dtd", "schema", "esquema"] }
    ] },
  { tema: "T7 · XML: introducción", pregunta: "¿Qué partes tiene un documento XML?",
    respuesta: "Prólogo: declaración XML (<?xml version…?>) y declaración del tipo de documento (DTD o Schema). Cuerpo: un elemento raíz con elementos, atributos, entidades predefinidas, instrucciones de proceso y secciones CDATA. Además puede haber comentarios en el prólogo o el cuerpo.",
    claves: [
      { t: "Prólogo", b: ["prolog"] },
      { t: "Declaración XML", b: ["declaracion", "<?xml", "version"] },
      { t: "Cuerpo / elementos y atributos", b: ["cuerpo", "element", "atribut"] },
      { t: "Comentarios / CDATA / entidades", b: ["comentario", "cdata", "entidad"] }
    ] },
  { tema: "T7 · XML: introducción", pregunta: "¿Qué es una sección CDATA y para qué sirve?",
    respuesta: "Es una construcción <![CDATA[ … ]]> que permite escribir datos con cualquier carácter, especial o no, sin que se interprete como marcado XML. Se usa para no tener que escribir entidades (&lt;, &amp;…), por ejemplo con código fuente de lenguajes de programación.",
    claves: [
      { t: "Cualquier carácter sin interpretarse como marcado", b: ["marcado", "interpret", "cualquier caracter"] },
      { t: "Evita usar entidades (&lt;, &amp;…)", b: ["entidad", "&lt", "escap"] },
      { t: "Ejemplo: código fuente", b: ["codigo"] }
    ] },
  { tema: "T7 · XML: introducción", pregunta: "¿Qué reglas siguen los nombres de los elementos XML?",
    respuesta: "Tienen uno o más caracteres sin espacios, empiezan por una letra o por «_», después pueden llevar cualquier carácter Unicode (letras, números…) y distinguen mayúsculas de minúsculas. Por ejemplo, «_Estudiante» o «Estudiante1234» son válidos; «1234», «-Estudiante» o «Estudiante 1234» no.",
    claves: [
      { t: "Sin espacios", b: ["espacio"] },
      { t: "Empiezan por letra o _", b: ["letra", "_", "guion bajo"] },
      { t: "Admiten Unicode", b: ["unicode"] },
      { t: "Sensibles a mayúsculas/minúsculas", b: ["mayuscula", "sensible", "case"] }
    ] },
  { tema: "T7 · XML: introducción", pregunta: "¿Qué es SVG y qué ventajas tiene?",
    respuesta: "SVG (Scalable Vector Graphics) es un lenguaje derivado de XML y estándar del W3C para describir gráficos vectoriales 2D (formas, imágenes y texto). Ventajas: se edita con cualquier editor de texto, se puede buscar e indexar, es escalable sin perder calidad, se imprime a cualquier resolución, es un estándar abierto y se puede incrustar en HTML.",
    claves: [
      { t: "Derivado de XML", b: ["xml"] },
      { t: "Gráficos vectoriales", b: ["vectorial"] },
      { t: "Escala sin perder calidad", b: ["escal", "calidad", "resolucion"] },
      { t: "Estándar del W3C / abierto / editable como texto", b: ["w3c", "abierto", "texto"] }
    ] },
  { tema: "T7 · XML: introducción", pregunta: "Cita ventajas e inconvenientes de XML.",
    respuesta: "Ventajas: formato estructurado definido por una gramática, con información y metainformación, legible por personas, abierto, con muchas herramientas, separa el contenido del procesamiento y la presentación, y facilita el intercambio. Inconvenientes: ocupa mucho espacio, ancho de banda y tiempo de proceso; es redundante; es malo para datos binarios; es poco eficiente para bases de datos; y está siendo sustituido por JSON.",
    claves: [
      { t: "Ventaja: estructurado / legible / abierto", b: ["estructur", "legible", "abierto"] },
      { t: "Ventaja: facilita el intercambio", b: ["intercambi"] },
      { t: "Inconveniente: ocupa mucho espacio / ancho de banda", b: ["espacio", "ancho de banda", "tamano", "ocupa"] },
      { t: "Inconveniente: malo para binarios / sustituido por JSON", b: ["binari", "json"] }
    ] },

  // T8 · XML: DTD
  { tema: "T8 · XML: DTD", pregunta: "¿Qué significan los indicadores ?, *, +, | y , en un DTD?",
    respuesta: "? = 0 o 1 vez (opcional); * = 0 o más veces; + = 1 o más veces; | = alternativa (uno u otro); , = secuencia (en ese orden).",
    claves: [
      { t: "? → 0 o 1", b: ["0 o 1", "cero o uno", "opcional"] },
      { t: "* → 0 o más", b: ["0 o mas", "cero o mas", "0 o varios", "ninguno o"] },
      { t: "+ → 1 o más", b: ["1 o mas", "uno o mas", "al menos uno"] },
      { t: "| → alternativa", b: ["alternativa", "uno u otro", "o bien", "eleccion"] },
      { t: ", → secuencia", b: ["secuencia", "orden"] }
    ] },
  { tema: "T8 · XML: DTD", pregunta: "Explica #REQUIRED, #IMPLIED y #FIXED en una declaración ATTLIST.",
    respuesta: "#REQUIRED: el atributo es obligatorio y no tiene valor por defecto. #IMPLIED: el atributo es opcional y, si se omite, no toma ningún valor por defecto. #FIXED \"valor\": el atributo tiene un valor constante.",
    claves: [
      { t: "#REQUIRED: obligatorio", b: ["obligatori", "required"] },
      { t: "#IMPLIED: opcional", b: ["opcional", "implied"] },
      { t: "#FIXED: valor constante / fijo", b: ["constante", "fijo", "fixed"] }
    ] },
  { tema: "T8 · XML: DTD", pregunta: "¿Para qué sirven los tipos de atributo ID e IDREF?",
    respuesta: "ID da a un atributo un valor único en todo el documento (sin duplicados). IDREF obliga a que el valor apunte a un ID existente. Juntos permiten crear referencias o hipervínculos dentro del documento XML (por ejemplo, un dueño que referencia el código de una persona).",
    claves: [
      { t: "ID: valor único en el documento", b: ["unic", "no repet", "sin duplic"] },
      { t: "IDREF: apunta a un ID", b: ["apunt", "referenc"] },
      { t: "Permiten enlaces / hipervínculos dentro del documento", b: ["enlace", "hipervinculo", "vincul", "relacion"] }
    ] },
  { tema: "T8 · XML: DTD", pregunta: "¿Qué problema resuelven los espacios de nombres y cómo se declaran?",
    respuesta: "Resuelven la homonimia: etiquetas con el mismo nombre y distinto significado (p. ej. <capital> de un país y de una inversión). Se asocia cada nombre a una URI única con xmlns:prefijo=\"URI\" (o xmlns=\"URI\" para el espacio por defecto) y se usan como prefijo:elemento. La URI solo sirve para que el nombre sea único; no es un enlace.",
    claves: [
      { t: "Homonimia (mismo nombre, distinto significado)", b: ["homonim", "mismo nombre", "ambig"] },
      { t: "Se asocian a una URI", b: ["uri", "url"] },
      { t: "Se declaran con xmlns", b: ["xmlns"] },
      { t: "Uso de prefijos", b: ["prefijo", "alias"] }
    ] },
  { tema: "T8 · XML: DTD", pregunta: "¿Cuáles son las tres formas de vincular un DTD a un documento XML?",
    respuesta: "1) Incrustado en el propio documento: <!DOCTYPE raiz [ … ]>. 2) En un archivo aparte (privado): <!DOCTYPE raiz SYSTEM \"archivo.dtd\">, reutilizable en varios documentos. 3) Con un identificador público: <!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"url\">.",
    claves: [
      { t: "Incrustado / interno", b: ["incrust", "interno", "dentro"] },
      { t: "Externo con SYSTEM", b: ["system", "extern", "archivo"] },
      { t: "Público con PUBLIC", b: ["public"] }
    ] },

  // T9 · XML Schema
  { tema: "T9 · XML Schema", pregunta: "¿Qué ventajas tiene XML Schema frente a los DTD?",
    respuesta: "Usa sintaxis XML (los DTD no), soporta tipos de datos predefinidos y definidos por el usuario, permite restricciones numéricas y de rangos, soporta espacios de nombres, es extensible (herencia de tipos, inclusión y redefinición de esquemas) y permite documentación. Inconveniente: es más extenso.",
    claves: [
      { t: "Sintaxis XML", b: ["sintaxis xml", "es xml", "formato xml", "xml"] },
      { t: "Tipos de datos", b: ["tipo"] },
      { t: "Restricciones / rangos", b: ["restric", "rango", "faceta"] },
      { t: "Espacios de nombres / extensibilidad / herencia", b: ["espacio de nombre", "namespace", "extensib", "herencia"] }
    ] },
  { tema: "T9 · XML Schema", pregunta: "Explica el formato de xs:duration y escribe una duración de 2 horas y 30 minutos.",
    respuesta: "Formato PnYnMnDTnHnMnS: P (período, obligatoria), nY años, nM meses, nD días, T (obligatoria si hay horas, minutos o segundos), nH horas, nM minutos, nS segundos. 2 horas y 30 minutos = PT2H30M.",
    claves: [
      { t: "Empieza por P (período, obligatoria)", b: ["periodo", "empieza por p", "p obligatoria", "la p", "p ("] },
      { t: "T antes de la parte de tiempo (horas, minutos, segundos)", b: ["la t", "t (", "seccion de tiempo", "parte de tiempo", "antes de las horas"] },
      { t: "PT2H30M", b: ["pt2h30m"] }
    ] },
  { tema: "T9 · XML Schema", pregunta: "Diferencia entre xs:sequence, xs:choice y xs:all.",
    respuesta: "xs:sequence: los elementos deben aparecer en el orden indicado. xs:choice: solo puede aparecer uno de los elementos (o-exclusiva). xs:all: aparecen todos, en cualquier orden (en un DTD habría que enumerar todas las combinaciones).",
    claves: [
      { t: "sequence: en orden", b: ["orden"] },
      { t: "choice: solo uno (alternativa)", b: ["uno de", "solo uno", "alternativ", "exclusiv"] },
      { t: "all: todos en cualquier orden", b: ["cualquier orden"] }
    ] },
  { tema: "T9 · XML Schema", pregunta: "Diferencia entre xs:key, xs:unique y xs:keyref.",
    respuesta: "xs:unique exige que el valor sea único, pero podría no existir. xs:key exige que sea único y además que exista y no sea nulo (una clave). xs:keyref obliga a que el valor haga referencia a una clave existente (como una clave externa).",
    claves: [
      { t: "unique: único pero puede no existir", b: ["no exist", "puede faltar", "opcional"] },
      { t: "key: único, debe existir y no ser nulo", b: ["exist", "nulo", "obligatori"] },
      { t: "keyref: referencia a una clave (clave externa)", b: ["referenc", "externa", "foranea"] }
    ] },
  { tema: "T9 · XML Schema", pregunta: "¿Cómo se vincula un documento XML a un XML Schema?",
    respuesta: "En el elemento raíz del XML se declara el espacio de nombres de instancia xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" y se indica el esquema con xsi:schemaLocation=\"URI-espacio archivo.xsd\" (si tiene espacio de nombres, que debe coincidir con el targetNamespace) o con xsi:noNamespaceSchemaLocation=\"archivo.xsd\" (sin espacio de nombres).",
    claves: [
      { t: "xmlns:xsi (XMLSchema-instance)", b: ["xmlns:xsi", "schema-instance", "xsi"] },
      { t: "xsi:schemaLocation (con espacio de nombres)", b: ["schemalocation"] },
      { t: "xsi:noNamespaceSchemaLocation (sin espacio de nombres)", b: ["nonamespace"] }
    ] },
  { tema: "T9 · XML Schema", pregunta: "¿Qué limitaciones tiene XML Schema?",
    respuesta: "No soporta entidades (para las macros hay que seguir usando DTDs), tiene un lenguaje de restricciones limitado (no puede comprobar, por ejemplo, que un total sea la suma de las partes), poca sensibilidad al contexto (que el contenido dependa del valor de un atributo), los archivos pueden ser muy grandes y poco legibles, y la especificación es compleja. Alternativas: Relax NG, Schematron.",
    claves: [
      { t: "No soporta entidades", b: ["entidad"] },
      { t: "Restricciones limitadas", b: ["restric", "suma"] },
      { t: "Poca sensibilidad al contexto", b: ["contexto"] },
      { t: "Archivos grandes / poco legibles / complejo", b: ["tamano", "grande", "extens", "legib", "complej"] }
    ] },

  // T10 · XPath
  { tema: "T10 · XPath", pregunta: "¿Qué es XPath y para qué se usa?",
    respuesta: "XPath (XML Path Language) es una sintaxis, no basada en XML, para acceder o referirse a porciones de un documento XML: identifica nodos del árbol DOM mediante rutas (nodo1/nodo2/…). Devuelve un conjunto de nodos o un string, número o boolean. Es un estándar del W3C y lo usan XSLT, XML Schema y bibliotecas como lxml.",
    claves: [
      { t: "Accede a partes / nodos de un documento XML", b: ["nodo", "acced", "porcion", "parte"] },
      { t: "Rutas (paths) por el árbol", b: ["ruta", "camino", "path", "arbol"] },
      { t: "No tiene sintaxis XML", b: ["no&xml", "no basad"] },
      { t: "Estándar del W3C", b: ["w3c", "estandar"] }
    ] },
  { tema: "T10 · XPath", pregunta: "Escribe una expresión XPath que seleccione el título de los libros publicados antes de 1950.",
    respuesta: "//libro[anio < 1950]/titulo (o /biblioteca/libro[number(anio) < 1950]/titulo): se filtran los libros con un predicado entre corchetes y después se baja al hijo titulo.",
    claves: [
      { t: "Selecciona libro (//libro o /biblioteca/libro)", b: ["libro"] },
      { t: "Predicado entre corchetes con < 1950", b: ["<1950", "< 1950", "&lt;1950"] },
      { t: "Termina en /titulo", b: ["/titulo"] }
    ] },
  { tema: "T10 · XPath", pregunta: "Explica qué significan /, //, ., .., @ y * en XPath.",
    respuesta: "/ separa niveles (al principio, la raíz); // busca descendientes a cualquier profundidad; . es el nodo actual; .. es el nodo padre; @ selecciona atributos (@id); * es cualquier elemento.",
    claves: [
      { t: "// descendientes a cualquier nivel", b: ["descendiente", "cualquier nivel", "cualquier profundidad", "cualquier lugar"] },
      { t: ". nodo actual", b: ["actual"] },
      { t: ".. nodo padre", b: ["padre"] },
      { t: "@ atributo", b: ["atributo"] },
      { t: "* cualquier elemento", b: ["cualquier", "todos"] }
    ] },

  // T11 · XSLT
  { tema: "T11 · XSLT", pregunta: "¿Qué es XSL y qué partes lo forman?",
    respuesta: "XSL (Extensible Stylesheet Language) es una familia de lenguajes basados en XML para transformar o formatear documentos XML para su presentación. Lo forman XSLT (transforma un XML en otro documento: XML, HTML, texto…), XSL-FO (formateo visual, sobre todo para generar PDF) y XPath (para localizar partes del documento). Las tres son recomendaciones del W3C.",
    claves: [
      { t: "XSLT: transformación", b: ["xslt"] },
      { t: "XSL-FO: formateo (PDF)", b: ["fo", "pdf", "format"] },
      { t: "XPath", b: ["xpath"] },
      { t: "Basados en XML / W3C", b: ["xml", "w3c"] }
    ] },
  { tema: "T11 · XSLT", pregunta: "¿Cómo funciona una transformación XSLT?",
    respuesta: "El procesador recorre el árbol del documento XML y, usando expresiones XPath en el atributo match de las plantillas (<xsl:template match=\"…\">), busca los nodos que encajan. Por cada coincidencia genera el resultado de la plantilla en el documento de salida (HTML, XML, texto…). Lo que no encaja con ninguna plantilla queda sin modificar.",
    claves: [
      { t: "Plantillas (xsl:template)", b: ["plantilla", "template"] },
      { t: "match con expresiones XPath", b: ["match", "xpath"] },
      { t: "Genera un documento de salida (HTML, XML…)", b: ["salida", "resultado", "html", "genera"] },
      { t: "Recorre el árbol / lo que no encaja queda igual", b: ["recorr", "arbol", "sin modific", "no encaj"] }
    ] },
  { tema: "T11 · XSLT", pregunta: "Diferencia entre <xsl:for-each> y <xsl:apply-templates>.",
    respuesta: "<xsl:for-each select=\"…\"> recorre en el momento los nodos seleccionados y aplica a cada uno su contenido, como un bucle. <xsl:apply-templates select=\"…\"> pide al procesador que busque, para esos nodos, las plantillas que encajan y las aplique, lo que permite un tratamiento recursivo y más modular.",
    claves: [
      { t: "for-each: bucle sobre los nodos", b: ["bucle", "recorr", "itera"] },
      { t: "apply-templates: aplica las plantillas que encajan", b: ["plantilla", "template"] },
      { t: "apply-templates: tratamiento recursivo", b: ["recurs"] }
    ] },
  { tema: "T11 · XSLT", pregunta: "¿Cómo se hace una condición con varias alternativas en XSLT?",
    respuesta: "Con <xsl:choose>, que contiene uno o varios <xsl:when test=\"condición\"> (los casos) y un <xsl:otherwise> como caso por defecto. <xsl:if test=\"…\"> solo sirve para una condición y no tiene else.",
    claves: [
      { t: "xsl:choose", b: ["choose"] },
      { t: "xsl:when con test", b: ["when"] },
      { t: "xsl:otherwise (por defecto)", b: ["otherwise"] },
      { t: "xsl:if no tiene else", b: ["if", "else"] }
    ] },
  { tema: "T11 · XSLT", pregunta: "¿Por qué los navegadores actuales ya no sirven para probar XSLT y qué alternativa se usa?",
    respuesta: "Por problemas de seguridad, los navegadores actuales han dejado de aplicar las transformaciones XSL de los archivos XML; solo lo hacían navegadores antiguos como Internet Explorer. Se usan procesadores XSLT incluidos en plugins de editores (por ejemplo XML Tools de Notepad++) o bibliotecas de programación.",
    claves: [
      { t: "Por seguridad", b: ["segur"] },
      { t: "Han dejado de soportarlo (solo navegadores antiguos)", b: ["dejado", "antiguo", "internet explorer", "no soport"] },
      { t: "Plugins de editores / procesadores XSLT", b: ["plugin", "notepad", "editor", "procesador"] }
    ] },

  // T12 · Procesamiento de XML
  { tema: "T12 · Procesamiento de XML", pregunta: "¿Qué es un parser XML y qué tipos hay?",
    respuesta: "Es el analizador sintáctico que procesa un documento XML y comprueba que está bien formado (y, si valida, que es válido). Es la herramienta principal de cualquier aplicación que use XML. Hay parsers sin validación (solo comprueban que esté bien formado) y con validación (además comprueban que cumpla su DTD o XML Schema).",
    claves: [
      { t: "Analizador sintáctico que procesa el XML", b: ["analiza", "procesa", "lee"] },
      { t: "Comprueba que está bien formado", b: ["bien formado"] },
      { t: "Sin validación / con validación", b: ["sin validacion", "con validacion", "valida"] },
      { t: "Con validación usa DTD o Schema", b: ["dtd", "schema", "esquema"] }
    ] },
  { tema: "T12 · Procesamiento de XML", pregunta: "Compara XmlReader, XmlDocument y LINQ to XML en C#.",
    respuesta: "XmlReader: acceso rápido, sin caché y solo hacia delante, nodo a nodo. XmlDocument: carga el documento completo como árbol DOM en memoria y permite consultarlo y modificarlo (GetElementsByTagName, AppendChild, Save…). LINQ to XML: modelo de objetos en memoria más ligero y sencillo que DOM (XDocument, XElement) con consultas integradas en el lenguaje.",
    claves: [
      { t: "XmlReader: rápido, solo hacia delante", b: ["delante", "rapido", "sin cache", "secuencial"] },
      { t: "XmlDocument: árbol DOM en memoria, modificable", b: ["dom", "memoria", "modific", "arbol"] },
      { t: "LINQ: consultas, más ligero", b: ["consulta", "ligero", "sencillo", "xelement"] }
    ] },
  { tema: "T12 · Procesamiento de XML", pregunta: "¿Cómo se recorre un XML en Python con xml.etree.ElementTree?",
    respuesta: "Se carga con arbol = ET.parse(archivo) (controlando IOError si no existe y ET.ParseError si está mal formado), se obtiene la raíz con arbol.getroot() y se recorren los elementos con raiz.findall('.//'), mostrando de cada uno su tag, su texto (text) y sus atributos (attrib).",
    claves: [
      { t: "ET.parse()", b: ["parse"] },
      { t: "getroot()", b: ["getroot", "raiz"] },
      { t: "findall('.//') / iter", b: ["findall", "iter"] },
      { t: "tag, text, attrib", b: ["tag", "attrib", "text"] }
    ] },

  // S1-2 · Usabilidad
  { tema: "S1-2 · Usabilidad", pregunta: "¿Qué es la usabilidad y qué incluye además de colores y tipos de letra?",
    respuesta: "Un sistema usable es fácil de aprender y fácil de utilizar. La usabilidad va mucho más allá de colores y tipos de letra: incluye el diseño de los diálogos, el enlace cognitivo entre usuario y sistema, la calidad de la documentación y la incorporación de metáforas.",
    claves: [
      { t: "Fácil de aprender", b: ["aprender"] },
      { t: "Fácil de utilizar", b: ["utilizar", "usar"] },
      { t: "Diseño de diálogos / enlace cognitivo", b: ["dialogo", "cognitiv"] },
      { t: "Documentación / metáforas", b: ["documentacion", "metafora"] }
    ] },
  { tema: "S1-2 · Usabilidad", pregunta: "Enuncia las tres normas de usabilidad de Steve Krug.",
    respuesta: "1) No me hagas pensar: la página debe ser obvia y evidente. 2) No importa el número de clics si cada elección es mecánica e inequívoca (tres clics sin pensar valen más que uno que exige reflexión). 3) Elimina la mitad de las palabras de cada página y luego la mitad de lo que quede.",
    claves: [
      { t: "No me hagas pensar", b: ["no me hagas pensar", "pensar"] },
      { t: "No importa el número de clics si son mecánicos e inequívocos", b: ["clic", "click"] },
      { t: "Elimina la mitad de las palabras", b: ["mitad"] }
    ] },
  { tema: "S1-2 · Usabilidad", pregunta: "Según Krug, ¿cómo usamos realmente la Web?",
    respuesta: "No leemos las páginas, las hojeamos; no tomamos decisiones óptimas, sino que hacemos clic en la primera opción razonable; y no averiguamos cómo funcionan las cosas, nos las arreglamos. Usamos la web a toda velocidad, como un cartel que se ve a más de 100 km/h.",
    claves: [
      { t: "Hojeamos, no leemos", b: ["hojea", "no leemos", "escanea", "vistazo"] },
      { t: "Elegimos la primera opción razonable (no la óptima)", b: ["primera", "razonable", "optim"] },
      { t: "Nos las arreglamos sin entender cómo funciona", b: ["arregla", "averigu", "instrucciones"] },
      { t: "Muy rápido", b: ["rapid", "velocidad", "prisa"] }
    ] },
  { tema: "S1-2 · Usabilidad", pregunta: "¿Qué elementos forman la navegación constante o global?",
    respuesta: "Es el conjunto de elementos de navegación que aparecen en todas las páginas del sitio (salvo quizá la principal y los formularios), siempre en el mismo lugar y con la misma apariencia: identificación del sitio, enlace a la página principal, secciones, búsqueda y utilidades.",
    claves: [
      { t: "Identificación del sitio (logotipo)", b: ["identificacion", "logo"] },
      { t: "Enlace a la página principal (home)", b: ["principal", "home", "inicio"] },
      { t: "Secciones", b: ["seccion"] },
      { t: "Búsqueda", b: ["busc", "busq"] },
      { t: "Utilidades", b: ["utilidad"] }
    ] },
  { tema: "S1-2 · Usabilidad", pregunta: "¿Qué preguntas debe responder la página principal de un sitio de un vistazo?",
    respuesta: "Qué es esto (qué sitio es), qué puedo hacer aquí, qué tienen aquí y por qué debería estar aquí y no en otro sitio. Debe responderlas sin ambigüedad, por ejemplo con la tagline y un aviso de bienvenida breve.",
    claves: [
      { t: "Qué es esto", b: ["que es"] },
      { t: "Qué puedo hacer aquí", b: ["hacer"] },
      { t: "Qué tienen aquí", b: ["que tienen", "que hay", "contenido"] },
      { t: "Por qué aquí y no en otro sitio", b: ["por que", "otro sitio", "otro lugar"] }
    ] },
  { tema: "S1-2 · Usabilidad", pregunta: "¿Qué son las migas de pan y qué recomendaciones hay sobre ellas?",
    respuesta: "Muestran el camino desde la página principal hasta la página actual; son útiles en sitios grandes con jerarquía profunda y permiten retroceder niveles. Recomendaciones: ponerlas arriba, en letra pequeña, separar los niveles con > , poner en negrita el último término y no usarlas en lugar del nombre de la página.",
    claves: [
      { t: "Muestran el camino desde la principal", b: ["camino", "ruta", "jerarqu"] },
      { t: "Arriba", b: ["arriba", "superior"] },
      { t: "Letra pequeña", b: ["pequen"] },
      { t: "Separador > / último en negrita", b: [">", "negrita", "separ"] }
    ] },

  // S3 · Adaptabilidad
  { tema: "S3 · Adaptabilidad", pregunta: "¿Qué es el diseño web adaptable y qué ventajas tiene?",
    respuesta: "Responsive Web Design: que una misma aplicación web se adapte automáticamente a distintos dispositivos y tamaños de pantalla, ofreciendo una buena experiencia de uso en todos. Ventajas: para el usuario, mejor experiencia, legibilidad e interacción táctil; para los desarrolladores, un único sitio para todos los dispositivos, menos mantenimiento y más alcance.",
    claves: [
      { t: "Se adapta automáticamente a cualquier pantalla/dispositivo", b: ["automatic", "dispositivo", "pantalla", "resolucion"] },
      { t: "Mejor experiencia de usuario", b: ["experiencia", "usuario"] },
      { t: "Un único sitio / menos mantenimiento", b: ["unico", "un solo", "manten", "coste"] }
    ] },
  { tema: "S3 · Adaptabilidad", pregunta: "Enumera las técnicas fundamentales del diseño adaptable.",
    respuesta: "Viewport (<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">), imágenes y contenidos flexibles (max-width: 100%), diseños fluidos con unidades relativas y Flexbox/Grid, Mobile First, breakpoints y media queries. Los frameworks (Bootstrap, Tailwind…) facilitan aplicarlas.",
    claves: [
      { t: "Viewport", b: ["viewport"] },
      { t: "Imágenes/contenido flexible", b: ["flexible", "imagen", "max-width"] },
      { t: "Diseño fluido / unidades relativas", b: ["fluid", "relativ", "%"] },
      { t: "Media queries / breakpoints", b: ["media", "breakpoint"] },
      { t: "Mobile First / Flexbox-Grid", b: ["mobile", "flex", "grid"] }
    ] },
  { tema: "S3 · Adaptabilidad", pregunta: "Diferencia entre width: 100% y max-width: 100% en una imagen de 300px dentro de un contenedor de 500px.",
    respuesta: "Con width: 100% la imagen ocupa siempre el 100% del contenedor, así que se amplía a 500px y puede deformarse o perder calidad. Con max-width: 100% la imagen nunca es más ancha que su contenedor, pero tampoco se amplía por encima de su tamaño real, así que se queda en 300px (y si el contenedor mide 250px, baja a 250px). En ambos casos se usa height: auto.",
    claves: [
      { t: "width: 100% → 500px (se amplía)", b: ["500"] },
      { t: "max-width: 100% → 300px (no se amplía)", b: ["300"] },
      { t: "max-width no supera su tamaño real", b: ["no se ampl", "tamano real", "original", "maximo"] },
      { t: "height: auto (proporciones)", b: ["auto", "proporc"] }
    ] },
  { tema: "S3 · Adaptabilidad", pregunta: "¿En qué se diferencia la usabilidad en móviles de la usabilidad web en escritorio?",
    respuesta: "Los principios son los mismos, pero hay menos espacio en pantalla, los usuarios se mueven más rápido, leen todavía menos y hay más limitaciones de interfaz. Por la falta de espacio, los sitios móviles son más largos y profundos, y la carga puede ser más lenta. Hay que hacer pruebas en distintos dispositivos, sistemas operativos y navegadores.",
    claves: [
      { t: "Mismos principios", b: ["mismos principios", "mismos"] },
      { t: "Menos espacio en pantalla", b: ["espacio", "pantalla"] },
      { t: "Más rápido / leen menos", b: ["rapid", "leen menos", "menos"] },
      { t: "Más largos y profundos / pruebas en dispositivos", b: ["profund", "larg", "prueba"] }
    ] },

  // S4 · Accesibilidad
  { tema: "S4 · Accesibilidad", pregunta: "¿Qué es el diseño universal y cuáles son sus principios?",
    respuesta: "Es diseñar productos usables por el rango más amplio de personas, en el rango más amplio de situaciones, y que sean comercialmente practicables. Sus 7 principios: uso equitativo, uso flexible, uso simple e intuitivo, información perceptible, tolerancia al error, esfuerzo físico mínimo, y tamaño y espacio adecuados para el acceso y el uso.",
    claves: [
      { t: "Usable por el mayor número de personas", b: ["amplio", "todas las personas", "mayor numero"] },
      { t: "Comercialmente practicable", b: ["comercial"] },
      { t: "Uso equitativo / flexible / simple", b: ["equitativ", "flexible", "simple", "intuitiv"] },
      { t: "Tolerancia al error / esfuerzo mínimo", b: ["error", "esfuerzo"] }
    ] },
  { tema: "S4 · Accesibilidad", pregunta: "¿Qué barreras encuentran las personas ciegas en la Web?",
    respuesta: "Imágenes sin texto alternativo, vídeos sin descripción textual o de audio, formularios mal etiquetados o sin secuencia lógica, marcos (iframe) sin alternativas ni nombres significativos, tablas usadas para maquetar, aplicaciones con JavaScript/Ajax y captchas sin alternativa. Soluciones: lectores de pantalla (JAWS), navegadores de texto o de voz y acceso total por teclado.",
    claves: [
      { t: "Imágenes sin texto alternativo", b: ["alt", "alternativo"] },
      { t: "Marcos / iframes", b: ["iframe", "marco", "frame"] },
      { t: "Tablas para maquetar", b: ["tabla"] },
      { t: "Formularios mal etiquetados / captchas / vídeo sin describir", b: ["formulario", "captcha", "video"] }
    ] },
  { tema: "S4 · Accesibilidad", pregunta: "¿Por qué no se debe transmitir información solo mediante colores? Pon un ejemplo de solución.",
    respuesta: "Porque la ceguera al color afecta al 8% de los hombres y al 0,5% de las mujeres (protanopia: rojo, deuteranopia: verde-rojo, tritanopia: azul), así que una interfaz basada solo en colores no es accesible. Hay que reforzarla con etiquetas, iconos o formas: p. ej. un semáforo con texto (Adelante/Salir), campos obligatorios con asterisco o gráficos con tramas y texto.",
    claves: [
      { t: "Daltonismo / ceguera al color (8% de los hombres)", b: ["dalton", "ceguera al color", "8%", "8 %"] },
      { t: "Reforzar con etiquetas / texto", b: ["etiqueta", "texto"] },
      { t: "Iconos / asteriscos / tramas", b: ["icono", "asterisco", "trama", "forma", "textura"] }
    ] },
  { tema: "S4 · Accesibilidad", pregunta: "Explica los niveles de conformidad A, AA y AAA de las WCAG.",
    respuesta: "En WCAG 1.0: nivel A = se cumplen todos los puntos de prioridad 1; AA = prioridades 1 y 2; AAA = prioridades 1, 2 y 3. En WCAG 2.x los criterios de éxito tienen tres niveles: A (el más bajo), AA y AAA (el más alto). En España, las administraciones y grandes empresas deben cumplir el nivel AA.",
    claves: [
      { t: "A: prioridad 1 / nivel mínimo", b: ["prioridad 1", "minimo", "mas bajo"] },
      { t: "AA: prioridades 1 y 2", b: ["1 y 2"] },
      { t: "AAA: prioridades 1, 2 y 3 / el más alto", b: ["1, 2 y 3", "mas alto", "maximo"] },
      { t: "En España se exige AA", b: ["espana&aa", "administracion", "obligatori"] }
    ] },
  { tema: "S4 · Accesibilidad", pregunta: "¿Cuáles son los cuatro principios de las WCAG 2.x?",
    respuesta: "Perceptibilidad (la información debe poder percibirse), operabilidad (la interfaz debe poder manejarse), comprensibilidad (información y manejo comprensibles) y robustez (compatible con distintas tecnologías, incluidas las de apoyo).",
    claves: [
      { t: "Perceptible", b: ["percept"] },
      { t: "Operable", b: ["operab"] },
      { t: "Comprensible", b: ["comprens"] },
      { t: "Robusto", b: ["robust"] }
    ] },
  { tema: "S4 · Accesibilidad", pregunta: "¿Qué normativa sobre accesibilidad web se aplica en España?",
    respuesta: "La norma de referencia es la UNE-EN 301549:2022 (alineada con las WCAG 2.1). El Real Decreto 1112/2018 obliga a los sitios web y apps del sector público a cumplirla, trasladando la Directiva (UE) 2016/2102 (apps accesibles desde el 23 de junio de 2021). Antes: Ley 56/2007, RD 1494/2007 y las normas UNE 139803 de AENOR.",
    claves: [
      { t: "UNE-EN 301549", b: ["301549", "301 549"] },
      { t: "Real Decreto 1112/2018", b: ["1112"] },
      { t: "Directiva (UE) 2016/2102", b: ["2016/2102", "directiva"] },
      { t: "AENOR / UNE 139803 / Ley 56/2007", b: ["aenor", "139803", "56/2007"] }
    ] },
  { tema: "S4 · Accesibilidad", pregunta: "¿Qué herramientas hay para comprobar la accesibilidad de un sitio?",
    respuesta: "Analizadores automáticos de HTML y CSS como TAW, AChecker, WAVE o el Analizador Web (Observatorio); navegadores de solo texto como Lynx y ELinks; y herramientas de contraste de color como Colour Contrast Analyser o Color Tester. Lo mejor, en cualquier caso, es que personas con discapacidad evalúen la interfaz.",
    claves: [
      { t: "Analizadores automáticos (TAW, WAVE, AChecker)", b: ["taw", "wave", "achecker"] },
      { t: "Navegadores de texto (Lynx, ELinks)", b: ["lynx", "elinks"] },
      { t: "Contraste de color", b: ["contraste", "colour", "color"] },
      { t: "Evaluación por personas con discapacidad", b: ["personas", "usuarios"] }
    ] }

]);
