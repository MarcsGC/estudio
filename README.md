# 📚 Mi web de estudio

Web para estudiar organizada por **curso → asignatura → tema**.

**3º curso**
- **Software y Estándares para la Web (SEW)**: 16 PDFs de teoría y seminarios, y 366 preguntas en 15 temas.
  - 60 preguntas de los controles del campus (Teoría XML, Usabilidad, Adaptabilidad y Accesibilidad).
  - 306 preguntas creadas por Claude a partir de los apuntes.
  - Todas las preguntas tienen una explicación que aparece al responder.
  - 75 preguntas cortas (de respuesta escrita) repartidas por los 15 temas, con respuesta modelo y conceptos clave.

**Funciones**
- Apuntes en PDF agrupados por tema, con un visor propio:
  - diapositivas a toda la pantalla y nítidas;
  - zoom, saltar a una página y pantalla completa;
  - recuerda en qué página te quedaste.
- Cuatro tipos de test: Campus virtual, Exámenes anteriores, Creadas por Claude y Todas.
- «Tests por tema»: cada tema tiene su acceso a cada tipo de test.
- Corrección al momento con explicación, nota sobre 10 y repaso de fallos.
- «Solo preguntas que he fallado» y «Repetir los fallos» (se guarda en tu navegador).
- **Preguntas cortas**: escribes la respuesta con tus palabras y se corrige de dos formas:
  - automáticamente, buscando los conceptos clave en tu respuesta y enseñándote la respuesta modelo;
  - opcionalmente con IA (Google Gemini, gratis), que te pone nota y te explica qué falta o qué está mal.
  - Al final valoras cada respuesta (bien, a medias, mal) y luego puedes repetir solo las que fallaste.
- Modo claro y oscuro, funciona en el móvil y no necesita instalar nada.

---

## 🚀 Subirla a GitHub Pages (sin instalar nada)

1. Entra en <https://github.com> e inicia sesión.
2. Pulsa **+ → New repository**.
3. Ponle un nombre (por ejemplo `estudio`), marca **Public** y pulsa **Create repository**.
4. En la página del repositorio vacío, pulsa el enlace **uploading an existing file**.
5. Abre la carpeta `estudio` en tu ordenador.
   - Selecciona **todo lo que hay dentro**: `index.html`, `README.md` y las carpetas `css`, `js`, `data` y `pdfs`.
   - Arrástralo a la página de GitHub. Tiene que ser lo de dentro, no la carpeta `estudio` entera.
6. Espera a que suban los archivos y pulsa **Commit changes**.
7. Ve a **Settings → Pages** (en el menú de la izquierda).
   - En *Source* elige **Deploy from a branch**.
   - Rama **main**, carpeta **/ (root)**, y pulsa **Save**.
8. Espera 1–2 minutos y recarga esa página. Arriba aparecerá el enlace a tu web:
   `https://TU_USUARIO.github.io/estudio/`

> ⚠️ **Privacidad:** con una cuenta gratuita, GitHub Pages solo funciona con repositorios **públicos**. Cualquiera con el enlace podrá ver los PDFs del campus, que son material de los profesores.
> Si no quieres eso, puedes quitar la carpeta `pdfs` del repositorio. Los tests seguirán funcionando y solo dejarán de verse los apuntes.

### Actualizarla más adelante
- Entra en el archivo en GitHub, pulsa el lápiz ✏️, edita y pulsa **Commit changes**.
- También puedes usar **Add file → Upload files** para subir versiones nuevas de los archivos.
- La web se actualiza sola en 1–2 minutos.

### Verla en tu ordenador
Abre `index.html` con doble clic. Los tests funcionan. Los PDFs se abren con el visor del navegador, porque el visor de la web solo funciona publicada (o servida con `python -m http.server`).

---

## 🤖 Activar la corrección con IA (gratis)

1. Entra en <https://aistudio.google.com/apikey> con tu cuenta de Google.
2. Pulsa **Create API key** y copia la clave (empieza por `AIza…`).
3. En la web, ve a una asignatura → **Preguntas cortas** → panel **Corrección con IA**.
4. Pega la clave y pulsa **Guardar y comprobar**. La web elige sola el modelo gratuito recomendado.

- **Dónde se guarda la clave:** solo en tu navegador, nunca en GitHub. En cada dispositivo (ordenador, móvil…) tendrás que pegarla una vez.
- **Límites:** la capa gratuita tiene un límite de correcciones al día que depende del modelo; los «flash-lite» permiten más. Si llegas al límite, la web te avisa y sigue corrigiendo con los conceptos clave.
- **Privacidad:** con la capa gratuita, Google puede usar lo que envías para mejorar sus productos, así que no escribas datos personales en las respuestas.

---

## ✏️ Añadir contenido

### Preguntas de exámenes de otros años
Abre `data/preguntas/3/sew.js` y añade líneas en el bloque «EXÁMENES DE OTROS AÑOS»:

```js
{"origen":"examen","tema":"T9 · XML Schema","fuente":"Enero 2025","pregunta":"Enunciado","opciones":["A","B","C","D"],"correcta":2,"explicacion":"Opcional"},
```

- `correcta` es la posición de la respuesta buena, empezando en 0 (0 = A, 1 = B…).
- `tema` tiene que coincidir con uno de los temas de `data/cursos.js`.

### Preguntas cortas
Están en `data/cortas/3/sew.js`. Cada una tiene el tema, la pregunta, la respuesta modelo y los conceptos clave:

```js
{ tema: "T8 · XML: DTD", pregunta: "¿Qué es un DTD?",
  respuesta: "Un conjunto de reglas que define qué elementos y atributos puede tener un documento XML…",
  claves: [
    { t: "Reglas / gramática del documento", b: ["regla", "gramatica"] },
    { t: "Define elementos y atributos", b: ["element&atribut"] }
  ] },
```

- En `b` van trozos de palabras que se buscan en tu respuesta, sin tildes ni mayúsculas. Basta con que aparezca uno.
- Con `"a&b"` tienen que aparecer los dos.

### Una asignatura nueva
1. En `data/cursos.js`, copia el bloque de plantilla que hay al final de `asignaturas`.
2. Mete sus PDFs en `pdfs/3/<id>/`.
3. Crea `data/preguntas/3/<id>.js`, copiando la cabecera de `sew.js` y cambiando `"sew"` por el nuevo id.

### Otro curso
Añade otro bloque en `window.CURSOS` con `id: "4"` y crea las carpetas `pdfs/4/` y `data/preguntas/4/`.

---

## 📁 Estructura

```
index.html                 página principal
css/styles.css             estilos
js/app.js                  lógica (no hace falta tocarlo)
js/vendor/pdfjs/           visor de PDF (PDF.js de Mozilla)
data/cursos.js             cursos, asignaturas, temas y PDFs
data/preguntas/3/sew.js    preguntas tipo test de SEW
data/cortas/3/sew.js       preguntas cortas de SEW
pdfs/3/sew/                apuntes de SEW
```
