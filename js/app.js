/* =========================================================
   Web de estudio — lógica principal
   No hace falta tocar este archivo para añadir contenido:
   - Cursos, asignaturas y PDFs  → data/cursos.js
   - Preguntas de cada asignatura → data/preguntas/<curso>/<asignatura>.js
   ========================================================= */
(function () {
  "use strict";

  var ORIGENES = {
    campus: { nombre: "Campus virtual", icono: "🏫", desc: "Preguntas que suben los profesores para repasar." },
    examen: { nombre: "Exámenes anteriores", icono: "📝", desc: "Preguntas de exámenes de otros años." },
    ia:     { nombre: "Creadas por Claude", icono: "✨", desc: "Preguntas nuevas hechas a partir de los apuntes." },
    todas:  { nombre: "Todas las preguntas", icono: "🎯", desc: "Mezcla de todas las fuentes." }
  };
  var ORDEN_ORIGENES = ["campus", "examen", "ia", "todas"];
  var LETRAS = "ABCDEFGH";

  var CURSOS = window.CURSOS || [];
  var SITIO = window.SITIO || {};
  var app = document.getElementById("app");
  var migas = document.getElementById("migas");
  var limpiarTeclado = null;

  /* ---------- Utilidades ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function barajar(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) { h = ((h << 5) - h + str.charCodeAt(i)) | 0; }
    return (h >>> 0).toString(36);
  }
  function plural(n, uno, varios) { return n + " " + (n === 1 ? uno : varios); }

  var store = {
    get: function (k, def) {
      try { var v = localStorage.getItem("estudio:" + k); return v ? JSON.parse(v) : def; }
      catch (e) { return def; }
    },
    set: function (k, v) {
      try { localStorage.setItem("estudio:" + k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ }
    }
  };

  /* ---------- Tema claro / oscuro ---------- */
  (function () {
    var guardado = store.get("tema", null);
    if (guardado) document.documentElement.setAttribute("data-theme", guardado);
    document.getElementById("tema-btn").addEventListener("click", function () {
      var actual = document.documentElement.getAttribute("data-theme");
      if (!actual) actual = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      var nuevo = actual === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", nuevo);
      store.set("tema", nuevo);
    });
  })();

  if (SITIO.titulo) {
    document.getElementById("titulo-sitio").textContent = SITIO.titulo;
    document.title = SITIO.titulo;
  }

  /* ---------- Carga de preguntas ---------- */
  var cachePreguntas = {};
  var cargando = {};

  // Los archivos de preguntas llaman a esta función
  window.registrarPreguntas = function (curso, asig, lista) {
    cachePreguntas[curso + "/" + asig] = normalizar(lista || []);
  };

  function normalizar(lista) {
    var vistos = {};
    return lista.filter(function (q) {
      return q && q.pregunta && Array.isArray(q.opciones) && q.opciones.length >= 2;
    }).map(function (q) {
      var id = q.id || (q.origen || "x") + ":" + hash(q.pregunta);
      while (vistos[id]) id += "_";
      vistos[id] = true;
      var correcta = typeof q.correcta === "string" ? LETRAS.indexOf(q.correcta.toUpperCase()) : q.correcta;
      // Si alguna respuesta se refiere a otras ("a, b y c", "las anteriores"…), no se mezclan
      var fijo = q.fijo === true || q.opciones.some(function (o) {
        return /respuestas?\s+[a-h]\b|\b[a-h]\s*,\s*[a-h]\s*y\s*[a-h]\b|anteriores|ninguna de las|todas las respuestas/i.test(String(o));
      });
      return {
        id: id,
        fijo: fijo,
        origen: ORIGENES[q.origen] && q.origen !== "todas" ? q.origen : "campus",
        tema: q.tema || "Sin tema",
        fuente: q.fuente || "",
        pregunta: q.pregunta,
        opciones: q.opciones,
        correcta: correcta,
        explicacion: q.explicacion || ""
      };
    });
  }

  function cargarPreguntas(curso, asig) {
    var key = curso + "/" + asig;
    if (cachePreguntas[key]) return Promise.resolve(cachePreguntas[key]);
    if (cargando[key]) return cargando[key];
    cargando[key] = new Promise(function (resolve) {
      var s = document.createElement("script");
      s.src = "data/preguntas/" + encodeURIComponent(curso) + "/" + encodeURIComponent(asig) + ".js";
      s.onload = function () { resolve(cachePreguntas[key] || (cachePreguntas[key] = [])); };
      s.onerror = function () { cachePreguntas[key] = []; resolve([]); };
      document.head.appendChild(s);
    });
    return cargando[key];
  }

  function filtrarOrigen(lista, origen) {
    return origen === "todas" ? lista : lista.filter(function (q) { return q.origen === origen; });
  }

  /* ---------- Búsqueda de datos ---------- */
  function buscarCurso(id) { return CURSOS.filter(function (c) { return String(c.id) === id; })[0]; }
  function buscarAsig(curso, id) {
    return (curso.asignaturas || []).filter(function (a) { return a.id === id; })[0];
  }

  /* ---------- Migas de pan ---------- */
  function ponerMigas(items) {
    if (!items.length) { migas.innerHTML = ""; return; }
    var html = '<a href="#/">Inicio</a>';
    items.forEach(function (it) {
      html += '<span class="sep">›</span>';
      html += it.href ? '<a href="' + it.href + '">' + esc(it.txt) + "</a>" : "<span>" + esc(it.txt) + "</span>";
    });
    migas.innerHTML = html;
  }

  /* ---------- Router ---------- */
  function router() {
    if (limpiarTeclado) { limpiarTeclado(); limpiarTeclado = null; }
    document.body.classList.remove("modo-visor");
    var p = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);

    if (p.length === 0) return vistaInicio();
    if (p[0] !== "c") return noEncontrado();
    var curso = buscarCurso(p[1]);
    if (!curso) return noEncontrado();
    if (p.length === 2) return vistaCurso(curso);
    if (p[2] !== "a") return noEncontrado();
    var asig = buscarAsig(curso, p[3]);
    if (!asig) return noEncontrado();
    if (p.length === 4) return vistaAsignatura(curso, asig);
    if (p[4] === "pdf") return vistaPdf(curso, asig, parseInt(p[5], 10));
    if (p[4] === "test" && ORIGENES[p[5]]) return vistaTestConfig(curso, asig, p[5], p[6] || "");
    return noEncontrado();
  }

  function pintar(html) {
    app.innerHTML = html;
    window.scrollTo(0, 0);
  }

  function noEncontrado() {
    ponerMigas([{ txt: "No encontrado" }]);
    pintar('<div class="vacio-msg"><strong>Esta página no existe</strong>Vuelve al <a href="#/">inicio</a>.</div>');
  }

  /* ---------- Vista: inicio ---------- */
  function vistaInicio() {
    ponerMigas([]);
    var html = '<div class="cabecera"><div class="kicker">Inicio</div>' +
      "<h1>" + esc(SITIO.titulo || "Mi web de estudio") + "</h1>" +
      '<p class="sub">' + esc(SITIO.subtitulo || "Elige un curso para ver sus asignaturas, apuntes y tests.") + "</p></div>";

    if (!CURSOS.length) {
      html += '<div class="vacio-msg"><strong>Aún no hay cursos</strong>Añádelos en <code>data/cursos.js</code>.</div>';
    } else {
      html += '<div class="rejilla">';
      CURSOS.forEach(function (c) {
        var asigs = c.asignaturas || [];
        html += '<a class="tarjeta" href="#/c/' + encodeURIComponent(c.id) + '">' +
          '<div class="curso-num">' + esc(c.corto || c.id + "º") + "</div>" +
          "<h2>" + esc(c.nombre) + "</h2>" +
          '<div class="meta">' + plural(asigs.length, "asignatura", "asignaturas") + "</div></a>";
      });
      html += "</div>";
    }
    pintar(html);
  }

  /* ---------- Vista: curso ---------- */
  function vistaCurso(curso) {
    ponerMigas([{ txt: curso.nombre }]);
    var asigs = curso.asignaturas || [];
    var html = '<div class="cabecera"><div class="kicker">Curso</div><h1>' + esc(curso.nombre) + "</h1>" +
      (curso.descripcion ? '<p class="sub">' + esc(curso.descripcion) + "</p>" : "") + "</div>";

    if (!asigs.length) {
      html += '<div class="vacio-msg"><strong>Este curso aún no tiene asignaturas</strong>Añádelas en <code>data/cursos.js</code>.</div>';
      return pintar(html);
    }
    html += '<div class="rejilla">';
    asigs.forEach(function (a) {
      var nPdf = (a.pdfs || []).length;
      html += '<a class="tarjeta" style="--color-asig:' + esc(a.color || "") + '" href="#/c/' +
        encodeURIComponent(curso.id) + "/a/" + encodeURIComponent(a.id) + '">' +
        '<span class="franja"></span>' +
        "<h2>" + esc(a.nombre) + "</h2>" +
        (a.descripcion ? '<div class="meta">' + esc(a.descripcion) + "</div>" : "") +
        '<div class="chips"><span class="chip">' + plural(nPdf, "PDF", "PDFs") + "</span>" +
        '<span class="chip" data-contar="' + esc(a.id) + '">… preguntas</span></div></a>';
    });
    html += "</div>";
    pintar(html);

    asigs.forEach(function (a) {
      cargarPreguntas(curso.id, a.id).then(function (lista) {
        var el = app.querySelector('[data-contar="' + a.id + '"]');
        if (el) el.textContent = plural(lista.length, "pregunta", "preguntas");
      });
    });
  }

  /* ---------- Vista: asignatura ---------- */
  function rutaAsig(curso, asig) {
    return "#/c/" + encodeURIComponent(curso.id) + "/a/" + encodeURIComponent(asig.id);
  }

  function vistaAsignatura(curso, asig) {
    var base = rutaAsig(curso, asig);
    ponerMigas([{ txt: curso.nombre, href: "#/c/" + encodeURIComponent(curso.id) }, { txt: asig.nombre }]);
    var pdfs = asig.pdfs || [];

    var html = '<div class="cabecera"><div class="kicker">' + esc(curso.nombre) + "</div><h1>" + esc(asig.nombre) + "</h1>" +
      (asig.descripcion ? '<p class="sub">' + esc(asig.descripcion) + "</p>" : "") + "</div>";

    html += '<div class="dos-col">';

    // Apuntes
    html += '<section><div class="seccion-titulo"><h2>Apuntes</h2><span class="meta">' +
      plural(pdfs.length, "PDF", "PDFs") + "</span></div>";
    if (!pdfs.length) {
      html += '<div class="vacio-msg"><strong>Sin apuntes todavía</strong>Sube los PDFs a <code>pdfs/' +
        esc(curso.id) + "/" + esc(asig.id) + "/</code> y añádelos en <code>data/cursos.js</code>.</div>";
    } else {
      var grupos = [], porTema = {};
      pdfs.forEach(function (pdf, i) {
        var t = pdf.tema || "Documentos";
        if (!porTema[t]) { porTema[t] = []; grupos.push(t); }
        porTema[t].push({ pdf: pdf, i: i });
      });
      html += '<div class="lista-pdfs">';
      grupos.forEach(function (t) {
        html += '<div class="grupo-tema">' + (grupos.length > 1 || t !== "Documentos" ? "<h3>" + esc(t) + "</h3>" : "");
        porTema[t].forEach(function (it) {
          html += '<a class="pdf-item" href="' + base + "/pdf/" + it.i + '">' +
            '<span class="pdf-icono">PDF</span><span><span class="titulo">' + esc(it.pdf.titulo || it.pdf.archivo) + "</span>" +
            (it.pdf.nota ? '<br><span class="meta">' + esc(it.pdf.nota) + "</span>" : "") + "</span></a>";
        });
        html += "</div>";
      });
      html += "</div>";
    }
    html += "</section>";

    // Tests
    html += '<section><div class="seccion-titulo"><h2>Tests</h2><span class="meta" id="total-preg">Cargando…</span></div><div class="tests">';
    ORDEN_ORIGENES.forEach(function (o) {
      var info = ORIGENES[o];
      html += '<a class="tarjeta test-card" data-origen="' + o + '" href="' + base + "/test/" + o + '">' +
        '<span class="icono" aria-hidden="true">' + info.icono + "</span>" +
        '<span class="cuerpo"><span class="titulo">' + info.nombre + '</span><br><span class="meta">' + info.desc + "</span></span>" +
        '<span class="num">…<small>preguntas</small></span></a>';
    });
    html += '</div><div id="por-temas"></div></section></div>';
    pintar(html);

    cargarPreguntas(curso.id, asig.id).then(function (lista) {
      pintarPorTemas(curso, asig, lista);
      var tot = document.getElementById("total-preg");
      if (tot) tot.textContent = plural(lista.length, "pregunta", "preguntas");
      ORDEN_ORIGENES.forEach(function (o) {
        var card = app.querySelector('[data-origen="' + o + '"]');
        if (!card) return;
        var n = filtrarOrigen(lista, o).length;
        var mejor = store.get("mejor:" + curso.id + "/" + asig.id + "/" + o, null);
        card.querySelector(".num").innerHTML = n + "<small>" + (mejor != null ? "mejor " + mejor + "%" : (n === 1 ? "pregunta" : "preguntas")) + "</small>";
        if (!n) card.classList.add("vacio");
      });
    });
  }

  /* ---------- Temas ---------- */
  // Orden: el de "temas" en data/cursos.js si existe; después, el resto en orden natural
  function listaTemas(asig, preguntas) {
    var orden = (asig.temas || []).slice();
    var extra = [];
    preguntas.forEach(function (q) {
      if (orden.indexOf(q.tema) < 0 && extra.indexOf(q.tema) < 0) extra.push(q.tema);
    });
    extra.sort(function (a, b) {
      if (a === "Sin tema") return 1;
      if (b === "Sin tema") return -1;
      return a.localeCompare(b, "es", { numeric: true });
    });
    return orden.concat(extra);
  }

  function pintarPorTemas(curso, asig, lista) {
    var cont = document.getElementById("por-temas");
    if (!cont || !lista.length) return;
    var base = rutaAsig(curso, asig);
    var fallos = store.get("fallos:" + curso.id + "/" + asig.id, []);
    var temas = listaTemas(asig, lista).filter(function (t) {
      return lista.some(function (q) { return q.tema === t; });
    });
    var html = '<div class="seccion-titulo" style="margin-top:28px"><h2>Tests por tema</h2>' +
      '<span class="meta">' + plural(temas.length, "tema", "temas") + '</span></div><div class="temas">';
    temas.forEach(function (t) {
      var delTema = lista.filter(function (q) { return q.tema === t; });
      var nFallos = delTema.filter(function (q) { return fallos.indexOf(q.id) >= 0; }).length;
      html += '<div class="tema-bloque"><div class="tema-cab"><span class="tema-nombre">' + esc(t) + "</span>" +
        '<span class="meta">' + plural(delTema.length, "pregunta", "preguntas") +
        (nFallos ? ' · <span class="mal-txt">' + nFallos + " por repasar</span>" : "") + "</span></div>" +
        '<div class="tema-botones">';
      ORDEN_ORIGENES.forEach(function (o) {
        var n = filtrarOrigen(delTema, o).length;
        var etiqueta = o === "todas" ? "Todas" : o === "campus" ? "Campus" : o === "examen" ? "Exámenes" : "Claude";
        html += n
          ? '<a class="mini' + (o === "todas" ? " mini-todas" : "") + '" href="' + base + "/test/" + o + "/" + encodeURIComponent(t) + '">' +
            ORIGENES[o].icono + " " + etiqueta + " <b>" + n + "</b></a>"
          : '<span class="mini mini-off">' + ORIGENES[o].icono + " " + etiqueta + " <b>0</b></span>";
      });
      html += "</div></div>";
    });
    html += "</div>";
    cont.innerHTML = html;
  }

  /* ---------- Vista: visor PDF ---------- */
  function vistaPdf(curso, asig, i) {
    var pdf = (asig.pdfs || [])[i];
    if (!pdf) return noEncontrado();
    var base = rutaAsig(curso, asig);
    ponerMigas([
      { txt: curso.nombre, href: "#/c/" + encodeURIComponent(curso.id) },
      { txt: asig.nombre, href: base },
      { txt: pdf.titulo || "PDF" }
    ]);
    document.body.classList.add("modo-visor");
    var url = encodeURI(pdf.archivo);
    var titulo = pdf.titulo || pdf.archivo;
    var pdfs = asig.pdfs || [];
    var puedeFull = !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen);

    pintar(
      '<div class="visor-wrap" id="pv-wrap">' +
        '<div class="pv-barra">' +
          '<div class="pv-izq">' +
            '<a class="pv-btn" href="' + base + '" aria-label="Volver a la asignatura" title="Volver">' + ICO.atras + "</a>" +
            '<div class="pv-titulo"><small>' + esc(pdf.tema || asig.nombre) + "</small><strong>" + esc(titulo) + "</strong></div>" +
          "</div>" +
          '<div class="pv-grupo pv-pag">' +
            '<button class="pv-btn" id="pv-prev" type="button" aria-label="Página anterior" title="Anterior (←)">' + ICO.izq + "</button>" +
            '<input id="pv-num" type="number" min="1" value="1" aria-label="Página actual"><span id="pv-total">/ …</span>' +
            '<button class="pv-btn" id="pv-next" type="button" aria-label="Página siguiente" title="Siguiente (→)">' + ICO.der + "</button>" +
          "</div>" +
          '<div class="pv-grupo">' +
            '<button class="pv-btn" id="pv-menos" type="button" aria-label="Alejar" title="Alejar (−)">' + ICO.menos + "</button>" +
            '<button class="pv-btn pv-zoom" id="pv-zoom" type="button" title="Ajustar a la pantalla (0)">Ajustar</button>' +
            '<button class="pv-btn" id="pv-mas" type="button" aria-label="Acercar" title="Acercar (+)">' + ICO.mas + "</button>" +
            (puedeFull ? '<button class="pv-btn pv-solo-grande" id="pv-full" type="button" aria-label="Pantalla completa" title="Pantalla completa (F)">' + ICO.full + "</button>" : "") +
            '<a class="pv-btn pv-solo-grande" href="' + url + '" download aria-label="Descargar" title="Descargar">' + ICO.bajar + "</a>" +
            '<a class="pv-btn" href="' + url + '" target="_blank" rel="noopener" aria-label="Abrir en pestaña nueva" title="Abrir en pestaña nueva">' + ICO.fuera + "</a>" +
          "</div>" +
        "</div>" +
        '<div class="pv-paginas" id="pv-paginas" tabindex="0"><div class="pv-lista" id="pv-lista">' +
          '<div class="pv-estado" id="pv-estado">Cargando PDF…</div>' +
        "</div></div>" +
      "</div>"
    );

    var wrap = document.getElementById("pv-wrap");
    var cont = document.getElementById("pv-paginas");
    var lista = document.getElementById("pv-lista");
    var inNum = document.getElementById("pv-num");
    var btnZoom = document.getElementById("pv-zoom");
    var clave = "pag:" + pdf.archivo;
    var doc = null, total = 0, ratios = [], paginas = [], ancho = 0, zoom = 1;
    var actual = 1, saltando = 0, gen = 0, vivo = true, obs = null, rafScroll = 0, timerResize = 0, tareas = {};
    var NIVELES = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3];

    function anchoBase() {
      var pad = window.innerWidth < 640 ? 16 : 28;
      var w = cont.clientWidth - pad, h = cont.clientHeight - pad;
      var r = ratios[1] || 0.5625;
      // Diapositivas horizontales: que se vea la página entera. Verticales: ajustar al ancho.
      return Math.max(200, Math.floor(r <= 1 ? Math.min(w, h / r) : Math.min(w, 900)));
    }

    function maquetar(mantener) {
      var pag = mantener || actual;
      gen++;
      Object.keys(tareas).forEach(function (k) { try { tareas[k].cancel(); } catch (e) {} });
      tareas = {};
      ancho = Math.round(anchoBase() * zoom);
      btnZoom.textContent = zoom === 1 ? "Ajustar" : Math.round(zoom * 100) + "%";
      paginas.forEach(function (el, k) {
        if (!el) return;
        el.style.width = ancho + "px";
        el.style.height = Math.round(ancho * (ratios[k] || ratios[1] || 0.5625)) + "px";
        vaciar(el);
      });
      if (obs) { obs.disconnect(); paginas.forEach(function (el) { if (el) obs.observe(el); }); }
      irA(pag, true);
    }

    function vaciar(el) {
      var c = el.querySelector("canvas");
      if (c) { c.width = 0; c.height = 0; el.removeChild(c); }
      el.classList.remove("lista");
      el.dataset.gen = "";
      el._tok = null;
      var k = +el.dataset.n;
      if (tareas[k]) { try { tareas[k].cancel(); } catch (e) {} delete tareas[k]; }
    }

    function pintarPagina(k) {
      var el = paginas[k];
      if (!el || el.dataset.gen === String(gen)) return;
      el.dataset.gen = String(gen);
      var miGen = gen, tok = {};
      el._tok = tok;
      doc.getPage(k).then(function (page) {
        if (!vivo || miGen !== gen || el._tok !== tok) return;
        var vp1 = page.getViewport({ scale: 1 });
        var r = vp1.height / vp1.width;
        if (Math.abs(r - (ratios[k] || 0)) > 0.001) { ratios[k] = r; el.style.height = Math.round(ancho * r) + "px"; }
        var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
        var vp = page.getViewport({ scale: (ancho * dpr) / vp1.width });
        var canvas = document.createElement("canvas");
        canvas.width = Math.floor(vp.width);
        canvas.height = Math.floor(vp.height);
        var tarea = page.render({ canvasContext: canvas.getContext("2d"), viewport: vp });
        tareas[k] = tarea;
        return tarea.promise.then(function () {
          if (tareas[k] === tarea) delete tareas[k];
          if (!vivo || miGen !== gen || el._tok !== tok) { canvas.width = 0; canvas.height = 0; return; }
          var vieja = el.querySelector("canvas");
          if (vieja) el.removeChild(vieja);
          el.appendChild(canvas);
          el.classList.add("lista");
        });
      }).catch(function () { if (el._tok === tok) { el.dataset.gen = ""; el._tok = null; } });
    }

    function paginaVisible() {
      var y = cont.scrollTop + cont.clientHeight * 0.35;
      var lo = 1, hi = total, res = 1;
      while (lo <= hi) {
        var mid = (lo + hi) >> 1;
        if (paginas[mid].offsetTop <= y) { res = mid; lo = mid + 1; } else hi = mid - 1;
      }
      return res;
    }

    function actualizarActual() {
      rafScroll = 0;
      if (!total) return;
      var n = paginaVisible();
      // Mientras dura un salto programado, la página «actual» es el destino, no la que pasa por pantalla
      if (Date.now() < saltando && n !== actual) n = actual;
      else saltando = 0;
      if (n !== actual) { actual = n; store.set(clave, n); }
      if (document.activeElement !== inNum) inNum.value = actual;
      document.getElementById("pv-prev").disabled = actual <= 1;
      document.getElementById("pv-next").disabled = actual >= total;
    }

    function irA(n, instantaneo) {
      if (!total) return;
      n = Math.max(1, Math.min(total, n | 0));
      if (Math.abs(n - actual) > 2) instantaneo = true;
      actual = n;
      saltando = instantaneo ? 0 : Date.now() + 600;
      var el = paginas[n];
      cont.scrollTo({ top: Math.max(0, el.offsetTop - (window.innerWidth < 640 ? 8 : 14)), behavior: instantaneo ? "auto" : "smooth" });
      inNum.value = n;
      store.set(clave, n);
      actualizarActual();
    }

    function cambiarZoom(dir) {
      var i = NIVELES.indexOf(zoom);
      if (dir === 0) zoom = 1;
      else zoom = NIVELES[Math.max(0, Math.min(NIVELES.length - 1, i + dir))];
      maquetar(actual);
    }

    function pantallaCompleta() {
      var activo = document.fullscreenElement || document.webkitFullscreenElement;
      if (activo) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else (wrap.requestFullscreen || wrap.webkitRequestFullscreen).call(wrap);
    }

    function onKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey || e.target === inNum) return;
      var k = e.key;
      if (k === "ArrowRight" || k === "PageDown") { irA(actual + 1); e.preventDefault(); }
      else if (k === "ArrowLeft" || k === "PageUp") { irA(actual - 1); e.preventDefault(); }
      else if (k === "Home") { irA(1); e.preventDefault(); }
      else if (k === "End") { irA(total); e.preventDefault(); }
      else if (k === "+" || k === "=") { cambiarZoom(1); e.preventDefault(); }
      else if (k === "-") { cambiarZoom(-1); e.preventDefault(); }
      else if (k === "0") { cambiarZoom(0); e.preventDefault(); }
      else if ((k === "f" || k === "F") && puedeFull) { pantallaCompleta(); e.preventDefault(); }
    }
    function onScroll() { if (!rafScroll) rafScroll = requestAnimationFrame(actualizarActual); }
    function onResize() {
      clearTimeout(timerResize);
      timerResize = setTimeout(function () { if (total && Math.abs(Math.round(anchoBase() * zoom) - ancho) > 2) maquetar(actual); }, 150);
    }

    document.getElementById("pv-prev").addEventListener("click", function () { irA(actual - 1); });
    document.getElementById("pv-next").addEventListener("click", function () { irA(actual + 1); });
    document.getElementById("pv-menos").addEventListener("click", function () { cambiarZoom(-1); });
    document.getElementById("pv-mas").addEventListener("click", function () { cambiarZoom(1); });
    btnZoom.addEventListener("click", function () { cambiarZoom(0); });
    if (puedeFull) document.getElementById("pv-full").addEventListener("click", pantallaCompleta);
    inNum.addEventListener("change", function () { irA(parseInt(inNum.value, 10) || 1); inNum.blur(); });
    inNum.addEventListener("keydown", function (e) { if (e.key === "Enter") { irA(parseInt(inNum.value, 10) || 1); inNum.blur(); } });
    cont.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("keydown", onKey);

    limpiarTeclado = function () {
      vivo = false;
      if (obs) obs.disconnect();
      Object.keys(tareas).forEach(function (k) { try { tareas[k].cancel(); } catch (e) {} });
      window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKey);
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
      if (doc) doc.destroy();
    };

    function alternativa() {
      if (!vivo) return;
      lista.innerHTML =
        '<div class="pv-estado"><p>Este navegador no ha podido abrir el visor de la web.</p>' +
        '<p class="meta">Suele pasar al abrir la web con doble clic desde el ordenador; publicada en GitHub funciona bien.</p>' +
        '<div class="acciones" style="justify-content:center"><a class="btn primario" href="' + url + '" target="_blank" rel="noopener">Abrir el PDF</a>' +
        '<a class="btn" href="' + url + '" download>Descargar</a></div></div>' +
        '<iframe class="pv-iframe" src="' + url + '" title="' + esc(titulo) + '"></iframe>';
    }

    cargarPdfJs().then(function (pdfjsLib) {
      if (!vivo) return;
      var tarea = pdfjsLib.getDocument({ url: pdf.archivo });
      tarea.onProgress = function (p) {
        if (p.total && vivo) document.getElementById("pv-estado").textContent = "Cargando PDF… " + Math.min(100, Math.round(p.loaded / p.total * 100)) + "%";
      };
      return tarea.promise.then(function (d) {
        if (!vivo) { d.destroy(); return; }
        doc = d; total = d.numPages;
        document.getElementById("pv-total").textContent = "/ " + total;
        inNum.max = total;
        return d.getPage(1).then(function (p1) {
          var vp = p1.getViewport({ scale: 1 });
          ratios[1] = vp.height / vp.width;
          var html = "";
          for (var k = 1; k <= total; k++) html += '<div class="pv-pagina" data-n="' + k + '" aria-label="Página ' + k + '"></div>';
          var sig = pdfs[i + 1], ant = pdfs[i - 1];
          html += '<div class="pv-fin"><strong>Fin de «' + esc(titulo) + '»</strong><div class="acciones">' +
            (pdf.tema ? '<a class="btn primario" href="' + base + "/test/todas/" + encodeURIComponent(pdf.tema) + '">Hacer test de este tema</a>' : "") +
            (ant ? '<a class="btn" href="' + base + "/pdf/" + (i - 1) + '">← ' + esc(ant.titulo) + "</a>" : "") +
            (sig ? '<a class="btn" href="' + base + "/pdf/" + (i + 1) + '">' + esc(sig.titulo) + " →</a>" : "") +
            "</div></div>";
          lista.innerHTML = html;
          paginas = [null].concat(Array.prototype.slice.call(lista.querySelectorAll(".pv-pagina")));
          obs = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (en) {
              var k = +en.target.dataset.n;
              if (en.isIntersecting) pintarPagina(k);
              else if (en.target.dataset.gen) { vaciar(en.target); }
            });
          }, { root: cont, rootMargin: "1200px 0px" });
          var guardada = store.get(clave, 1);
          maquetar(guardada > 1 && guardada <= total ? guardada : 1);
          cont.focus({ preventScroll: true });
        });
      });
    }).catch(alternativa);
  }

  var pdfjsPromesa = null;
  function cargarPdfJs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (pdfjsPromesa) return pdfjsPromesa;
    pdfjsPromesa = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "js/vendor/pdfjs/pdf.min.js";
      s.onload = function () {
        if (!window.pdfjsLib) return reject(new Error("pdfjs"));
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "js/vendor/pdfjs/pdf.worker.min.js";
        resolve(window.pdfjsLib);
      };
      s.onerror = function () { pdfjsPromesa = null; reject(new Error("pdfjs")); };
      document.head.appendChild(s);
    });
    return pdfjsPromesa;
  }

  var ICO = (function () {
    function svg(d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>"; }
    return {
      atras: svg('<path d="M19 12H5M12 19l-7-7 7-7"/>'),
      izq: svg('<path d="M15 18l-6-6 6-6"/>'),
      der: svg('<path d="M9 18l6-6-6-6"/>'),
      menos: svg('<path d="M5 12h14"/>'),
      mas: svg('<path d="M12 5v14M5 12h14"/>'),
      full: svg('<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>'),
      bajar: svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>'),
      fuera: svg('<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>')
    };
  })();

  /* ---------- Vista: configuración del test ---------- */
  function vistaTestConfig(curso, asig, origen, temaInicial) {
    var base = rutaAsig(curso, asig);
    var info = ORIGENES[origen];
    var m = [
      { txt: curso.nombre, href: "#/c/" + encodeURIComponent(curso.id) },
      { txt: asig.nombre, href: base },
      { txt: info.nombre, href: temaInicial ? base + "/test/" + origen : null }
    ];
    if (temaInicial) m.push({ txt: temaInicial });
    ponerMigas(m);
    pintar('<p style="color:var(--texto-suave)">Cargando preguntas…</p>');

    cargarPreguntas(curso.id, asig.id).then(function (todas) {
      var lista = filtrarOrigen(todas, origen);
      var claveFallos = "fallos:" + curso.id + "/" + asig.id;
      var fallos = store.get(claveFallos, []);
      var html = '<div class="cabecera"><div class="kicker">' + esc(asig.nombre) + "</div><h1>" +
        info.icono + " " + info.nombre + '</h1><p class="sub">' + info.desc + "</p></div>";

      if (!lista.length) {
        var ayuda = origen === "ia"
          ? "Pásale a Claude los PDFs de la asignatura y te preparará preguntas con <code>origen: \"ia\"</code>."
          : "Añade preguntas en <code>data/preguntas/" + esc(curso.id) + "/" + esc(asig.id) + ".js</code>" +
            (origen !== "todas" ? " con <code>origen: \"" + origen + "\"</code>." : ".");
        html += '<div class="vacio-msg"><strong>Todavía no hay preguntas aquí</strong>' + ayuda + "</div>" +
          '<div class="acciones"><a class="btn" href="' + base + '">← Volver a la asignatura</a></div>';
        return pintar(html);
      }

      var temas = listaTemas(asig, lista).filter(function (t) {
        return lista.some(function (q) { return q.tema === t; });
      });

      var opcionesNum = [10, 20, 30].filter(function (n) { return n < lista.length; });
      var cfg = store.get("cfg", { num: 10, mezclar: true });

      html += '<div class="panel"><div class="form-rejilla">';
      html += '<div class="campo"><label for="f-tema">Tema</label><select id="f-tema"><option value="">Todos los temas</option>' +
        temas.map(function (t) { return '<option value="' + esc(t) + '">' + esc(t) + "</option>"; }).join("") + "</select></div>";
      html += '<div class="campo"><label>Número de preguntas</label><div class="segmentado" id="f-num">' +
        opcionesNum.map(function (n) { return '<button type="button" data-n="' + n + '">' + n + "</button>"; }).join("") +
        '<button type="button" data-n="0">Todas</button></div></div>';
      html += "</div>";
      html += '<div style="display:flex;flex-direction:column;gap:12px;margin-top:20px">' +
        '<label class="check"><input type="checkbox" id="f-mezclar"' + (cfg.mezclar ? " checked" : "") + "> Mezclar el orden de preguntas y respuestas <span class=\"meta\">(las del tipo «a, b y c son correctas» no se mueven)</span></label>" +
        '<label class="check"><input type="checkbox" id="f-fallos"> Solo preguntas que he fallado <span class="meta" id="n-fallos"></span></label>' +
        "</div>";
      html += '<div class="acciones"><button class="btn primario" id="empezar" type="button">Empezar test</button>' +
        '<a class="btn" href="' + base + '">Volver</a></div>' +
        '<p id="disponibles" style="margin-top:12px;font-size:.88rem;color:var(--texto-suave)"></p></div>';
      pintar(html);

      var selTema = document.getElementById("f-tema");
      if (temaInicial && temas.indexOf(temaInicial) >= 0) selTema.value = temaInicial;
      var chkFallos = document.getElementById("f-fallos");
      var chkMezclar = document.getElementById("f-mezclar");
      var botonesNum = Array.prototype.slice.call(document.querySelectorAll("#f-num button"));
      var num = cfg.num;
      if (!botonesNum.some(function (b) { return +b.dataset.n === num; })) num = 0;

      function seleccion() {
        var t = selTema.value;
        return lista.filter(function (q) {
          return (!t || q.tema === t) && (!chkFallos.checked || fallos.indexOf(q.id) >= 0);
        });
      }
      function actualizar() {
        botonesNum.forEach(function (b) { b.setAttribute("aria-pressed", String(+b.dataset.n === num)); });
        var nFallosTema = lista.filter(function (q) {
          return fallos.indexOf(q.id) >= 0 && (!selTema.value || q.tema === selTema.value);
        }).length;
        document.getElementById("n-fallos").textContent = "(" + nFallosTema + ")";
        chkFallos.disabled = nFallosTema === 0;
        if (nFallosTema === 0) chkFallos.checked = false;
        var disp = seleccion().length;
        var haras = num ? Math.min(num, disp) : disp;
        document.getElementById("disponibles").textContent = plural(disp, "pregunta disponible", "preguntas disponibles") +
          " · harás " + haras;
        document.getElementById("empezar").disabled = disp === 0;
      }
      botonesNum.forEach(function (b) {
        b.addEventListener("click", function () { num = +b.dataset.n; actualizar(); });
      });
      selTema.addEventListener("change", actualizar);
      chkFallos.addEventListener("change", actualizar);
      actualizar();

      document.getElementById("empezar").addEventListener("click", function () {
        store.set("cfg", { num: num, mezclar: chkMezclar.checked });
        var sel = seleccion();
        if (chkMezclar.checked) sel = barajar(sel);
        if (num) sel = sel.slice(0, num);
        iniciarTest(curso, asig, origen, sel, chkMezclar.checked);
      });
    });
  }

  /* ---------- Test en marcha ---------- */
  function iniciarTest(curso, asig, origen, preguntas, mezclar) {
    var base = rutaAsig(curso, asig);
    var claveFallos = "fallos:" + curso.id + "/" + asig.id;
    var items = preguntas.map(function (q) {
      var orden = q.opciones.map(function (_, i) { return i; });
      return { q: q, orden: mezclar && !q.fijo ? barajar(orden) : orden, elegida: null };
    });
    var pos = 0, aciertos = 0, errores = 0;

    function pintarPregunta() {
      var it = items[pos], q = it.q;
      var html = '<div class="quiz">' +
        '<div class="quiz-top"><span>Pregunta ' + (pos + 1) + " de " + items.length + "</span>" +
        '<span class="marcador"><span class="ok">✓ ' + aciertos + '</span><span class="mal">✗ ' + errores + "</span></span></div>" +
        '<div class="progreso"><div style="width:' + (pos / items.length * 100) + '%"></div></div>' +
        '<div class="pregunta-meta"><span class="chip">' + esc(ORIGENES[q.origen].nombre) + '</span><span class="chip">' + esc(q.tema) + "</span>" +
        (q.fuente ? '<span class="chip">' + esc(q.fuente) + "</span>" : "") + "</div>" +
        '<div class="enunciado">' + esc(q.pregunta) + "</div>" +
        '<div class="opciones">' +
        it.orden.map(function (orig, i) {
          return '<button class="opcion" type="button" data-i="' + i + '"><span class="letra">' + LETRAS[i] +
            '</span><span class="txt">' + esc(q.opciones[orig]) + "</span></button>";
        }).join("") +
        '</div><div id="feedback"></div>' +
        '<div class="acciones" style="justify-content:space-between">' +
        '<button class="btn" type="button" id="salir">Terminar aquí</button>' +
        '<button class="btn primario" type="button" id="siguiente" hidden>' + (pos + 1 < items.length ? "Siguiente →" : "Ver resultado") + "</button></div>" +
        '<p class="atajos">Atajos: <kbd>1</kbd>–<kbd>' + it.orden.length + "</kbd> o <kbd>A</kbd>–<kbd>" + LETRAS[it.orden.length - 1] +
        "</kbd> para responder · <kbd>Enter</kbd> para seguir</p></div>";
      pintar(html);

      Array.prototype.forEach.call(app.querySelectorAll(".opcion"), function (b) {
        b.addEventListener("click", function () { responder(+b.dataset.i); });
      });
      document.getElementById("siguiente").addEventListener("click", siguiente);
      document.getElementById("salir").addEventListener("click", function () {
        if (aciertos + errores === 0) { location.hash = base + "/test/" + origen; router(); return; }
        items = items.filter(function (x) { return x.elegida !== null; });
        mostrarResultado();
      });
    }

    function responder(i) {
      var it = items[pos];
      if (it.elegida !== null || i >= it.orden.length) return;
      it.elegida = it.orden[i];
      var ok = it.elegida === it.q.correcta;
      if (ok) aciertos++; else errores++;

      var fallos = store.get(claveFallos, []);
      var idx = fallos.indexOf(it.q.id);
      if (ok && idx >= 0) fallos.splice(idx, 1);
      if (!ok && idx < 0) fallos.push(it.q.id);
      store.set(claveFallos, fallos);

      Array.prototype.forEach.call(app.querySelectorAll(".opcion"), function (b) {
        var orig = it.orden[+b.dataset.i];
        b.disabled = true;
        if (orig === it.q.correcta) b.classList.add("correcta");
        else if (orig === it.elegida) b.classList.add("incorrecta");
      });
      var letraBuena = LETRAS[it.orden.indexOf(it.q.correcta)];
      document.getElementById("feedback").innerHTML = '<div class="explicacion ' + (ok ? "ok" : "mal") + '">' +
        '<div class="veredicto ' + (ok ? "ok" : "mal") + '">' + (ok ? "¡Correcto!" : "Incorrecto · la buena era la " + letraBuena) + "</div>" +
        (it.q.explicacion ? "<div>" + esc(it.q.explicacion) + "</div>" : "") + "</div>";
      app.querySelector(".quiz-top .marcador").innerHTML = '<span class="ok">✓ ' + aciertos + '</span><span class="mal">✗ ' + errores + "</span>";
      app.querySelector(".progreso div").style.width = ((pos + 1) / items.length * 100) + "%";
      var sig = document.getElementById("siguiente");
      sig.hidden = false;
      sig.focus({ preventScroll: true });
      document.getElementById("feedback").scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function siguiente() {
      if (items[pos].elegida === null) return;
      pos++;
      if (pos < items.length) pintarPregunta(); else mostrarResultado();
    }

    function teclado(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (!items[pos] || !document.querySelector(".opcion")) return;
      var k = e.key;
      if (/^[1-8]$/.test(k)) { responder(+k - 1); e.preventDefault(); }
      else if (/^[a-hA-H]$/.test(k)) { responder(LETRAS.indexOf(k.toUpperCase())); e.preventDefault(); }
      else if (k === "Enter" && items[pos].elegida !== null && document.activeElement.id !== "siguiente") { siguiente(); e.preventDefault(); }
    }
    document.addEventListener("keydown", teclado);
    limpiarTeclado = function () { document.removeEventListener("keydown", teclado); };

    function mostrarResultado() {
      if (limpiarTeclado) { limpiarTeclado(); limpiarTeclado = null; }
      var total = items.length;
      var pct = total ? Math.round(aciertos / total * 100) : 0;
      var claveMejor = "mejor:" + curso.id + "/" + asig.id + "/" + origen;
      var mejor = store.get(claveMejor, null);
      var nuevoRecord = total >= 5 && (mejor == null || pct > mejor);
      if (nuevoRecord) store.set(claveMejor, pct);

      var clase = pct >= 70 ? "ok" : pct >= 50 ? "media" : "mal";
      var mensaje = pct === 100 ? "¡Perfecto! 🎉" : pct >= 70 ? "¡Muy bien!" : pct >= 50 ? "Aprobado, pero repasa los fallos." : "Toca repasar un poco más.";
      var falladas = items.filter(function (x) { return x.elegida !== x.q.correcta; });

      var html = '<div class="quiz"><div class="resultado-cabecera">' +
        '<div class="nota-grande ' + clase + '">' + (Math.round(aciertos / (total || 1) * 100) / 10).toFixed(1).replace(".", ",") + "</div>" +
        "<p><strong>" + mensaje + "</strong> " + aciertos + " de " + total + " correctas (" + pct + "%)" +
        (nuevoRecord && mejor != null ? " · ¡nuevo récord!" : "") + "</p>" +
        '<div class="acciones">' +
        (falladas.length ? '<button class="btn primario" type="button" id="repetir-fallos">' + (falladas.length === 1 ? "Repetir el fallo" : "Repetir los " + falladas.length + " fallos") + "</button>" : "") +
        '<button class="btn" type="button" id="nuevo">Nuevo test</button>' +
        '<a class="btn" href="' + base + '">Volver a la asignatura</a></div></div>';

      if (falladas.length) {
        html += '<h2 style="margin-top:12px">Repaso de fallos</h2><div class="repaso">';
        falladas.forEach(function (x) {
          html += '<div class="repaso-item"><div class="q">' + esc(x.q.pregunta) + '</div><div class="r">' +
            '<div class="tuya">✗ Tu respuesta: ' + esc(x.q.opciones[x.elegida]) + "</div>" +
            '<div class="buena">✓ Correcta: ' + esc(x.q.opciones[x.q.correcta]) + "</div></div>" +
            (x.q.explicacion ? '<div class="exp">' + esc(x.q.explicacion) + "</div>" : "") + "</div>";
        });
        html += "</div>";
      }
      html += "</div>";
      pintar(html);

      var rf = document.getElementById("repetir-fallos");
      if (rf) rf.addEventListener("click", function () {
        iniciarTest(curso, asig, origen, falladas.map(function (x) { return x.q; }), mezclar);
      });
      document.getElementById("nuevo").addEventListener("click", function () { router(); });
    }

    pintarPregunta();
  }

  window.addEventListener("hashchange", router);
  router();
})();
