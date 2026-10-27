# 📚 Mi web de estudio

Web para estudiar organizada por **curso → asignatura → tema**.

**3º curso**
- **Software y Estándares para la Web (SEW)**: 16 PDFs de teoría y seminarios, y 366 preguntas en 15 temas.
  - 60 preguntas de los controles del campus (Teoría XML, Usabilidad, Adaptabilidad y Accesibilidad).
  - 306 preguntas creadas por Claude a partir de los apuntes.
  - Todas las preguntas tienen una explicación que aparece al responder.

**Funciones**
- Apuntes en PDF agrupados por tema, con un visor propio:
  - diapositivas a toda la pantalla y nítidas;
  - zoom, saltar a una página y pantalla completa;
  - recuerda en qué página te quedaste.
- Cuatro tipos de test: Campus virtual, Exámenes anteriores, Creadas por Claude y Todas.
- «Tests por tema»: cada tema tiene su acceso a cada tipo de test.
- Corrección al momento con explicación, nota sobre 10 y repaso de fallos.
- «Solo preguntas que he fallado» y «Repetir los fallos» (se guarda en tu navegador).
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

## ✏️ Añadir contenido

### Preguntas de exámenes de otros años
Abre `data/preguntas/3/sew.js` y añade líneas en el bloque «EXÁMENES DE OTROS AÑOS»:

```js
{"origen":"examen","tema":"T9 · XML Schema","fuente":"Enero 2025","pregunta":"Enunciado","opciones":["A","B","C","D"],"correcta":2,"explicacion":"Opcional"},
```

- `correcta` es la posición de la respuesta buena, empezando en 0 (0 = A, 1 = B…).
- `tema` tiene que coincidir con uno de los temas de `data/cursos.js`.

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
data/preguntas/3/sew.js    preguntas de SEW
pdfs/3/sew/                apuntes de SEW
```
