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
    if (p[4] === "cortas") return vistaCortasConfig(curso, asig, p[5] || "");
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
    html += '<a class="tarjeta test-card" data-cortas href="' + base + '/cortas">' +
      '<span class="icono" aria-hidden="true">✍️</span>' +
      '<span class="cuerpo"><span class="titulo">Preguntas cortas</span><br><span class="meta">Respondes con tus palabras y se corrige con los apuntes' + (IA.activa() ? " y con IA" : "") + '.</span></span>' +
      '<span class="num">…<small>preguntas</small></span></a>';
    html += '</div><div id="por-temas"></div></section></div>';
    pintar(html);

    Promise.all([cargarPreguntas(curso.id, asig.id), cargarCortas(curso.id, asig.id)]).then(function (r) {
      var lista = r[0], cortas = r[1];
      pintarPorTemas(curso, asig, lista, cortas);
      var cc = app.querySelector("[data-cortas]");
      if (cc) {
        cc.querySelector(".num").innerHTML = cortas.length + "<small>" + (cortas.length === 1 ? "pregunta" : "preguntas") + "</small>";
        if (!cortas.length) cc.classList.add("vacio");
      }
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

  function pintarPorTemas(curso, asig, lista, cortas) {
    var cont = document.getElementById("por-temas");
    cortas = cortas || [];
    if (!cont || (!lista.length && !cortas.length)) return;
    var base = rutaAsig(curso, asig);
    var fallos = store.get("fallos:" + curso.id + "/" + asig.id, []);
    var temas = listaTemas(asig, lista.concat(cortas)).filter(function (t) {
      return lista.some(function (q) { return q.tema === t; }) || cortas.some(function (q) { return q.tema === t; });
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
      var nC = cortas.filter(function (q) { return q.tema === t; }).length;
      html += nC
        ? '<a class="mini mini-cortas" href="' + base + "/cortas/" + encodeURIComponent(t) + '">✍️ Cortas <b>' + nC + "</b></a>"
        : '<span class="mini mini-off">✍️ Cortas <b>0</b></span>';
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

      var claveTemas = "temasExcluidos:" + curso.id + "/" + asig.id;
      var excluidos = store.get(claveTemas, []);
      var porTema = {};
      temas.forEach(function (t) { porTema[t] = lista.filter(function (q) { return q.tema === t; }); });

      html += '<div class="panel">';
      html += '<div class="campo"><div class="campo-cab"><label>Temas que entran</label>' +
        '<span class="mini-acciones"><button type="button" id="t-todos">Todos</button><button type="button" id="t-ninguno">Ninguno</button></span></div>' +
        '<div class="temas-check" id="f-temas">' +
        temas.map(function (t, k) {
          var marcado = temaInicial ? t === temaInicial : excluidos.indexOf(t) < 0;
          return '<label class="tcheck"><input type="checkbox" value="' + k + '"' + (marcado ? " checked" : "") + ">" +
            '<span class="tnom">' + esc(t) + '</span><span class="tnum" data-k="' + k + '">' + porTema[t].length + "</span></label>";
        }).join("") +
        "</div></div>";
      html += '<div class="campo" style="margin-top:22px"><label>Número de preguntas</label><div class="segmentado" id="f-num">' +
        opcionesNum.map(function (n) { return '<button type="button" data-n="' + n + '">' + n + "</button>"; }).join("") +
        '<button type="button" data-n="0">Todas</button></div></div>';
      html += '<div style="display:flex;flex-direction:column;gap:12px;margin-top:20px">' +
        '<label class="check"><input type="checkbox" id="f-mezclar"' + (cfg.mezclar ? " checked" : "") + "> Mezclar el orden de preguntas y respuestas <span class=\"meta\">(las del tipo «a, b y c son correctas» no se mueven)</span></label>" +
        '<label class="check"><input type="checkbox" id="f-fallos"> Solo preguntas que he fallado <span class="meta" id="n-fallos"></span></label>' +
        "</div>";
      html += '<div class="acciones"><button class="btn primario" id="empezar" type="button">Empezar test</button>' +
        '<a class="btn" href="' + base + '">Volver</a></div>' +
        '<p id="disponibles" style="margin-top:12px;font-size:.88rem;color:var(--texto-suave)"></p></div>';
      pintar(html);

      var checksTema = Array.prototype.slice.call(document.querySelectorAll("#f-temas input"));
      var chkFallos = document.getElementById("f-fallos");
      var chkMezclar = document.getElementById("f-mezclar");
      var botonesNum = Array.prototype.slice.call(document.querySelectorAll("#f-num button"));
      var num = cfg.num;
      if (!botonesNum.some(function (b) { return +b.dataset.n === num; })) num = 0;

      function temasMarcados() {
        return checksTema.filter(function (c) { return c.checked; }).map(function (c) { return temas[+c.value]; });
      }
      function esFallo(q) { return fallos.indexOf(q.id) >= 0; }
      function seleccion() {
        var ts = temasMarcados();
        return lista.filter(function (q) {
          return ts.indexOf(q.tema) >= 0 && (!chkFallos.checked || esFallo(q));
        });
      }
      function actualizar() {
        botonesNum.forEach(function (b) { b.setAttribute("aria-pressed", String(+b.dataset.n === num)); });
        var ts = temasMarcados();
        var nFallosSel = lista.filter(function (q) { return esFallo(q) && ts.indexOf(q.tema) >= 0; }).length;
        document.getElementById("n-fallos").textContent = "(" + nFallosSel + ")";
        chkFallos.disabled = nFallosSel === 0;
        if (nFallosSel === 0) chkFallos.checked = false;
        temas.forEach(function (t, k) {
          var n = chkFallos.checked ? porTema[t].filter(esFallo).length : porTema[t].length;
          document.querySelector('.tnum[data-k="' + k + '"]').textContent = n;
        });
        checksTema.forEach(function (c) { c.parentNode.classList.toggle("off", !c.checked); });
        var disp = seleccion().length;
        var haras = num ? Math.min(num, disp) : disp;
        document.getElementById("disponibles").textContent = !ts.length
          ? "Marca al menos un tema"
          : plural(ts.length, "tema", "temas") + " · " + plural(disp, "pregunta disponible", "preguntas disponibles") + " · harás " + haras;
        document.getElementById("empezar").disabled = disp === 0;
      }
      botonesNum.forEach(function (b) {
        b.addEventListener("click", function () { num = +b.dataset.n; actualizar(); });
      });
      checksTema.forEach(function (c) { c.addEventListener("change", actualizar); });
      document.getElementById("t-todos").addEventListener("click", function () { checksTema.forEach(function (c) { c.checked = true; }); actualizar(); });
      document.getElementById("t-ninguno").addEventListener("click", function () { checksTema.forEach(function (c) { c.checked = false; }); actualizar(); });
      chkFallos.addEventListener("change", actualizar);
      actualizar();

      document.getElementById("empezar").addEventListener("click", function () {
        store.set("cfg", { num: num, mezclar: chkMezclar.checked });
        // Recordar los temas excluidos (salvo si se entró desde el atajo de un solo tema)
        if (!temaInicial) {
          var ts = temasMarcados();
          store.set(claveTemas, temas.filter(function (t) { return ts.indexOf(t) < 0; }));
        }
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
    var pos = 0, aciertos = 0, errores = 0, navScroll = 0;

    function respondidas() { return aciertos + errores; }
    // Primera pregunta sin responder: hasta ahí se puede navegar
    function frontera() {
      for (var k = 0; k < items.length; k++) if (items[k].elegida === null) return k;
      return items.length;
    }
    function marcadorHtml() {
      return '<span class="ok">✓ ' + aciertos + '</span><span class="mal">✗ ' + errores + "</span>";
    }
    function navHtml() {
      var f = frontera();
      return items.map(function (x, k) {
        var cls = x.elegida === null ? "" : (x.elegida === x.q.correcta ? " ok" : " mal");
        if (k === pos) cls += " actual";
        var bloqueada = k > f;
        return '<button type="button" class="nav-q' + cls + '" data-k="' + k + '"' + (bloqueada ? " disabled" : "") +
          ' aria-label="Pregunta ' + (k + 1) + '">' + (k + 1) + "</button>";
      }).join("");
    }

    function pintarPregunta() {
      var it = items[pos], q = it.q;
      var html = '<div class="quiz">' +
        '<div class="quiz-top"><span>Pregunta ' + (pos + 1) + " de " + items.length + "</span>" +
        '<span class="marcador">' + marcadorHtml() + "</span></div>" +
        '<div class="progreso"><div style="width:' + (respondidas() / items.length * 100) + '%"></div></div>' +
        '<div class="nav-preguntas' + (items.length <= 40 ? " envolver" : "") + '" id="nav-q">' + navHtml() + "</div>" +
        '<div class="pregunta-meta"><span class="chip">' + esc(ORIGENES[q.origen].nombre) + '</span><span class="chip">' + esc(q.tema) + "</span>" +
        (q.fuente ? '<span class="chip">' + esc(q.fuente) + "</span>" : "") + "</div>" +
        '<div class="enunciado">' + esc(q.pregunta) + "</div>" +
        '<div class="opciones">' +
        it.orden.map(function (orig, i) {
          return '<button class="opcion" type="button" data-i="' + i + '"><span class="letra">' + LETRAS[i] +
            '</span><span class="txt">' + esc(q.opciones[orig]) + "</span></button>";
        }).join("") +
        '</div><div id="feedback"></div>' +
        '<div class="acciones quiz-acciones">' +
        '<button class="btn" type="button" id="salir">Terminar aquí</button>' +
        '<span class="quiz-nav">' +
        '<button class="btn" type="button" id="anterior"' + (pos === 0 ? " disabled" : "") + ">← Anterior</button>" +
        '<button class="btn primario" type="button" id="siguiente" hidden></button></span></div>' +
        '<p class="atajos">Atajos: <kbd>1</kbd>–<kbd>' + it.orden.length + "</kbd> o <kbd>A</kbd>–<kbd>" + LETRAS[it.orden.length - 1] +
        "</kbd> para responder · <kbd>←</kbd> <kbd>→</kbd> para moverte · <kbd>Enter</kbd> para seguir</p></div>";
      pintar(html);

      Array.prototype.forEach.call(app.querySelectorAll(".opcion"), function (b) {
        b.addEventListener("click", function () { responder(+b.dataset.i); });
      });
      document.getElementById("nav-q").addEventListener("click", function (e) {
        var b = e.target.closest(".nav-q");
        if (b && !b.disabled) irA(+b.dataset.k);
      });
      document.getElementById("anterior").addEventListener("click", function () { irA(pos - 1); });
      document.getElementById("siguiente").addEventListener("click", siguiente);
      document.getElementById("salir").addEventListener("click", function () {
        if (respondidas() === 0) { location.hash = base + "/test/" + origen; router(); return; }
        items = items.filter(function (x) { return x.elegida !== null; });
        mostrarResultado();
      });
      // La fila de números se queda donde estaba; solo se mueve lo justo si la pregunta actual queda fuera
      var nav = document.getElementById("nav-q");
      nav.scrollLeft = navScroll;
      var actualBtn = nav.querySelector(".nav-q.actual");
      if (actualBtn && !nav.classList.contains("envolver")) {
        var izq = actualBtn.offsetLeft, der = izq + actualBtn.offsetWidth;
        // Si se sale por la derecha, se «pasa página» dejándola al principio; si se sale por la izquierda, al final
        if (der > nav.scrollLeft + nav.clientWidth) nav.scrollLeft = izq - 4;
        else if (izq < nav.scrollLeft) nav.scrollLeft = der - nav.clientWidth + 4;
      }
      navScroll = nav.scrollLeft;
      nav.addEventListener("scroll", function () { navScroll = nav.scrollLeft; }, { passive: true });
      if (it.elegida !== null) mostrarCorreccion(false);
    }

    function mostrarCorreccion(recien) {
      var it = items[pos];
      var ok = it.elegida === it.q.correcta;
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
      var sig = document.getElementById("siguiente");
      var f = frontera();
      sig.textContent = pos + 1 < items.length ? "Siguiente →" : (f === items.length ? "Ver resultado" : "Ir a la pendiente →");
      sig.hidden = false;
      if (recien) {
        sig.focus({ preventScroll: true });
        document.getElementById("feedback").scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
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

      app.querySelector(".quiz-top .marcador").innerHTML = marcadorHtml();
      app.querySelector(".progreso div").style.width = (respondidas() / items.length * 100) + "%";
      var nav = document.getElementById("nav-q"), sl = nav.scrollLeft;
      nav.innerHTML = navHtml();
      nav.scrollLeft = sl;
      mostrarCorreccion(true);
    }

    function irA(k) {
      if (k < 0 || k >= items.length || k > frontera() || k === pos) return;
      pos = k;
      pintarPregunta();
    }

    function siguiente() {
      if (items[pos].elegida === null) return;
      var f = frontera();
      if (f === items.length && pos === items.length - 1) return mostrarResultado();
      if (pos + 1 < items.length) irA(pos + 1);
      else irA(f);
    }

    function teclado(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (!items[pos] || !document.querySelector(".opcion")) return;
      var k = e.key;
      if (/^[1-8]$/.test(k)) { responder(+k - 1); e.preventDefault(); }
      else if (/^[a-hA-H]$/.test(k)) { responder(LETRAS.indexOf(k.toUpperCase())); e.preventDefault(); }
      else if (k === "ArrowLeft") { irA(pos - 1); e.preventDefault(); }
      else if (k === "ArrowRight") { if (items[pos].elegida !== null) siguiente(); e.preventDefault(); }
      else if (k === "Enter" && items[pos].elegida !== null && document.activeElement.tagName !== "BUTTON") { siguiente(); e.preventDefault(); }
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

  /* =========================================================
     PREGUNTAS CORTAS (respuesta escrita, corrección por conceptos clave
     y, opcionalmente, con la IA gratuita de Google Gemini)
     ========================================================= */
  var cacheCortas = {}, cargandoCortas = {};
  window.registrarCortas = function (curso, asig, lista) {
    cacheCortas[curso + "/" + asig] = (lista || []).filter(function (q) {
      return q && q.pregunta && q.respuesta;
    }).map(function (q) {
      return {
        id: q.id || "c:" + hash(q.pregunta), tema: q.tema || "Sin tema", pregunta: q.pregunta,
        respuesta: q.respuesta, claves: q.claves || []
      };
    });
  };
  function cargarCortas(curso, asig) {
    var key = curso + "/" + asig;
    if (cacheCortas[key]) return Promise.resolve(cacheCortas[key]);
    if (cargandoCortas[key]) return cargandoCortas[key];
    cargandoCortas[key] = new Promise(function (resolve) {
      var s = document.createElement("script");
      s.src = "data/cortas/" + encodeURIComponent(curso) + "/" + encodeURIComponent(asig) + ".js";
      s.onload = function () { resolve(cacheCortas[key] || (cacheCortas[key] = [])); };
      s.onerror = function () { cacheCortas[key] = []; resolve([]); };
      document.head.appendChild(s);
    });
    return cargandoCortas[key];
  }

  function normTexto(t) {
    return " " + String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ") + " ";
  }
  // Devuelve qué conceptos clave aparecen en la respuesta
  function revisarClaves(q, texto) {
    var r = normTexto(texto);
    return q.claves.map(function (k) {
      var ok = (k.b || []).some(function (b) {
        return normTexto(b).trim().split("&").every(function (p) { return p && r.indexOf(p.trim()) >= 0; });
      });
      return { t: k.t, ok: ok };
    });
  }

  /* ---------- IA: Google Gemini (capa gratuita, clave del propio usuario) ---------- */
  var IA = {
    API: "https://generativelanguage.googleapis.com/v1beta/",
    cfg: function () { return store.get("ia", null); },
    activa: function () { var c = IA.cfg(); return !!(c && c.key && c.modelo); },
    error: function (status, j) {
      var msg = j && j.error && j.error.message ? j.error.message : "";
      if (status === 400 && /api key/i.test(msg)) return "La clave no es válida. Revisa que la has copiado entera.";
      if (status === 403) return "La clave no tiene permiso para usar Gemini. Créala desde Google AI Studio.";
      if (status === 429) return "Has llegado al límite gratuito de Gemini (por minuto o por día). Espera un poco o prueba mañana.";
      if (status === 404) return "Ese modelo ya no existe. Vuelve a comprobar la clave para elegir otro.";
      if (status >= 500) return "Los servidores de Gemini no responden ahora mismo. Inténtalo de nuevo en un rato.";
      return "Error " + status + (msg ? ": " + msg : "");
    },
    pedir: function (url, opciones, key) {
      opciones = opciones || {};
      opciones.headers = Object.assign({ "x-goog-api-key": key }, opciones.headers || {});
      return fetch(url, opciones).catch(function () {
        throw new Error("No se ha podido conectar con Gemini. Revisa tu conexión a internet.");
      }).then(function (r) {
        return r.text().then(function (t) {
          var j = null; try { j = JSON.parse(t); } catch (e) {}
          if (!r.ok) throw new Error(IA.error(r.status, j));
          return j;
        });
      });
    },
    listarModelos: function (key) {
      return IA.pedir(IA.API + "models?pageSize=200", {}, key).then(function (j) {
        return ((j && j.models) || []).filter(function (m) {
          return (m.supportedGenerationMethods || []).indexOf("generateContent") >= 0;
        }).map(function (m) { return m.name.replace(/^models\//, ""); }).filter(function (n) {
          return /gemini/i.test(n) && !/(embed|tts|image|audio|live|vision|aqa|robotic|computer|native)/i.test(n);
        });
      });
    },
    // Preferimos los «flash-lite» (más peticiones gratis al día), luego «flash»; los más nuevos primero y sin «preview»
    modeloRecomendado: function (lista) {
      function ver(n) { var m = n.match(/(\d+(?:\.\d+)?)/); return m ? parseFloat(m[1]) : 0; }
      function mejor(filtro) {
        return lista.filter(filtro).sort(function (a, b) { return ver(b) - ver(a) || a.length - b.length; })[0];
      }
      return mejor(function (n) { return /flash-lite/.test(n) && !/preview|exp/.test(n); }) ||
        mejor(function (n) { return /flash/.test(n) && !/preview|exp/.test(n); }) ||
        mejor(function (n) { return /flash/.test(n); }) || lista[0];
    },
    corregir: function (q, asigNombre, texto) {
      var c = IA.cfg();
      var sistema = "Eres profesor de la asignatura universitaria «" + asigNombre + "» y corriges respuestas cortas de un alumno. " +
        "Corrige en español, tuteando al alumno y de forma justa: valora el contenido, no la redacción ni la ortografía, y acepta sinónimos y explicaciones equivalentes. " +
        "La respuesta modelo y los conceptos clave vienen de los apuntes de la asignatura: úsalos como referencia principal. " +
        "Si el alumno dice algo incorrecto, señálalo. No inventes requisitos que no estén en la respuesta modelo. " +
        "Responde SOLO con un objeto JSON con estas claves: " +
        "\"nota\" (número de 0 a 10), \"veredicto\" (\"bien\", \"parcial\" o \"mal\"), " +
        "\"comentario\" (2 o 3 frases explicando la corrección), \"falta\" (lista de ideas importantes que faltan, puede estar vacía), " +
        "\"errores\" (lista de afirmaciones incorrectas del alumno, puede estar vacía).";
      var usuario = "PREGUNTA:\n" + q.pregunta + "\n\nRESPUESTA MODELO (apuntes):\n" + q.respuesta +
        "\n\nCONCEPTOS CLAVE:\n- " + q.claves.map(function (k) { return k.t; }).join("\n- ") +
        "\n\nRESPUESTA DEL ALUMNO:\n" + texto;
      var cuerpo = {
        system_instruction: { parts: [{ text: sistema }] },
        contents: [{ role: "user", parts: [{ text: usuario }] }],
        generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
      };
      return IA.pedir(IA.API + "models/" + encodeURIComponent(c.modelo) + ":generateContent", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cuerpo)
      }, c.key).then(function (j) {
        var cand = j && j.candidates && j.candidates[0];
        var partes = (cand && cand.content && cand.content.parts) || [];
        var txt = partes.filter(function (p) { return p.text && !p.thought; }).map(function (p) { return p.text; }).join("").trim();
        if (!txt) throw new Error("Gemini no ha devuelto ninguna corrección" + (cand && cand.finishReason ? " (" + cand.finishReason + ")" : "") + ".");
        txt = txt.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
        var ini = txt.indexOf("{"), fin = txt.lastIndexOf("}");
        try { return JSON.parse(txt.slice(ini, fin + 1)); }
        catch (e) { return { nota: null, veredicto: "", comentario: txt, falta: [], errores: [] }; }
      });
    }
  };

  function panelIaHtml() {
    var c = IA.cfg();
    return '<details class="panel ia-panel" id="ia-panel"' + (IA.activa() ? "" : " open") + ">" +
      '<summary><span class="ia-titulo">🤖 Corrección con IA (Gemini, gratis)</span>' +
      '<span class="ia-estado ' + (IA.activa() ? "on" : "off") + '" id="ia-estado">' + (IA.activa() ? "Activada · " + esc(c.modelo) : "Desactivada") + "</span></summary>" +
      '<div class="ia-cuerpo">' +
      '<p class="meta">Sin IA, la web te corrige comparando tu respuesta con los conceptos clave y te enseña la respuesta modelo. Con IA, además, Gemini te pone nota y te explica qué falta o qué está mal, aunque lo digas con otras palabras.</p>' +
      '<ol class="ia-pasos"><li>Entra en <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a> con tu cuenta de Google.</li>' +
      "<li>Pulsa <b>Create API key</b> (crear clave) y cópiala.</li><li>Pégala aquí y pulsa <b>Guardar y comprobar</b>.</li></ol>" +
      '<div class="ia-form"><input type="password" id="ia-key" autocomplete="off" spellcheck="false" placeholder="Pega aquí tu clave (empieza por AIza…)" value="' + esc(c && c.key || "") + '">' +
      '<button class="btn primario" type="button" id="ia-guardar">Guardar y comprobar</button></div>' +
      '<div class="ia-form" id="ia-modelo-fila"' + (c && c.modelo ? "" : " hidden") + '><label for="ia-modelo">Modelo</label><select id="ia-modelo">' +
      (c && c.modelo ? '<option value="' + esc(c.modelo) + '">' + esc(c.modelo) + "</option>" : "") + "</select>" +
      '<button class="btn" type="button" id="ia-quitar">Quitar clave</button></div>' +
      '<p class="ia-msg" id="ia-msg"></p>' +
      '<p class="meta ia-nota">🔒 La clave se guarda solo en este navegador, no en GitHub. Tus respuestas se envían a Google para corregirlas; con la capa gratuita Google puede usarlas para mejorar sus productos, así que no escribas datos personales. El límite gratuito es de unas pocas decenas o cientos de correcciones al día, según el modelo.</p>' +
      "</div></details>";
  }

  function activarPanelIa() {
    var msg = document.getElementById("ia-msg");
    var inKey = document.getElementById("ia-key");
    var sel = document.getElementById("ia-modelo");
    var fila = document.getElementById("ia-modelo-fila");
    function estado() {
      var el = document.getElementById("ia-estado"), c = IA.cfg();
      el.textContent = IA.activa() ? "Activada · " + c.modelo : "Desactivada";
      el.className = "ia-estado " + (IA.activa() ? "on" : "off");
    }
    document.getElementById("ia-guardar").addEventListener("click", function () {
      var key = inKey.value.trim();
      if (!key) { msg.className = "ia-msg mal"; msg.textContent = "Pega primero tu clave."; return; }
      msg.className = "ia-msg"; msg.textContent = "Comprobando la clave…";
      IA.listarModelos(key).then(function (lista) {
        if (!lista.length) throw new Error("La clave funciona, pero no hay modelos Gemini disponibles para ella.");
        var actual = (IA.cfg() || {}).modelo;
        var elegido = lista.indexOf(actual) >= 0 ? actual : IA.modeloRecomendado(lista);
        sel.innerHTML = lista.map(function (n) {
          return '<option value="' + esc(n) + '"' + (n === elegido ? " selected" : "") + ">" + esc(n) + (n === IA.modeloRecomendado(lista) ? " (recomendado)" : "") + "</option>";
        }).join("");
        store.set("ia", { key: key, modelo: elegido });
        fila.hidden = false;
        msg.className = "ia-msg ok"; msg.textContent = "✓ Clave correcta. La corrección con IA está activada.";
        estado();
      }).catch(function (e) { msg.className = "ia-msg mal"; msg.textContent = e.message; });
    });
    sel.addEventListener("change", function () {
      var c = IA.cfg(); if (!c) return;
      c.modelo = sel.value; store.set("ia", c); estado();
      msg.className = "ia-msg ok"; msg.textContent = "Modelo cambiado a " + sel.value + ".";
    });
    document.getElementById("ia-quitar").addEventListener("click", function () {
      try { localStorage.removeItem("estudio:ia"); } catch (e) {}
      inKey.value = ""; sel.innerHTML = ""; fila.hidden = true;
      msg.className = "ia-msg"; msg.textContent = "Clave borrada de este navegador.";
      estado();
    });
  }

  /* ---------- Vista: configuración de preguntas cortas ---------- */
  function vistaCortasConfig(curso, asig, temaInicial) {
    var base = rutaAsig(curso, asig);
    var m = [
      { txt: curso.nombre, href: "#/c/" + encodeURIComponent(curso.id) },
      { txt: asig.nombre, href: base },
      { txt: "Preguntas cortas", href: temaInicial ? base + "/cortas" : null }
    ];
    if (temaInicial) m.push({ txt: temaInicial });
    ponerMigas(m);
    pintar('<p style="color:var(--texto-suave)">Cargando preguntas…</p>');

    cargarCortas(curso.id, asig.id).then(function (lista) {
      var html = '<div class="cabecera"><div class="kicker">' + esc(asig.nombre) + "</div><h1>✍️ Preguntas cortas</h1>" +
        '<p class="sub">Escribe la respuesta con tus palabras y corrígela con los conceptos clave de los apuntes' + (IA.activa() ? " y con la IA" : "") + ".</p></div>";
      if (!lista.length) {
        html += '<div class="vacio-msg"><strong>Todavía no hay preguntas cortas</strong>Añádelas en <code>data/cortas/' +
          esc(curso.id) + "/" + esc(asig.id) + ".js</code>.</div>" + panelIaHtml();
        pintar(html); activarPanelIa(); return;
      }
      var temas = listaTemas(asig, lista).filter(function (t) { return lista.some(function (q) { return q.tema === t; }); });
      var porTema = {};
      temas.forEach(function (t) { porTema[t] = lista.filter(function (q) { return q.tema === t; }); });
      var claveTemas = "temasExcluidos:" + curso.id + "/" + asig.id;
      var excluidos = store.get(claveTemas, []);
      var notas = store.get("cortas:" + curso.id + "/" + asig.id, {});
      function flojas(q) { return notas[q.id] === "mal" || notas[q.id] === "parcial"; }
      var cfg = store.get("cfgCortas", { num: 5, mezclar: true });
      var opcionesNum = [5, 10, 20].filter(function (n) { return n < lista.length; });

      html += '<div class="panel"><div class="campo"><div class="campo-cab"><label>Temas que entran</label>' +
        '<span class="mini-acciones"><button type="button" id="t-todos">Todos</button><button type="button" id="t-ninguno">Ninguno</button></span></div>' +
        '<div class="temas-check" id="f-temas">' +
        temas.map(function (t, k) {
          var marcado = temaInicial ? t === temaInicial : excluidos.indexOf(t) < 0;
          return '<label class="tcheck"><input type="checkbox" value="' + k + '"' + (marcado ? " checked" : "") + ">" +
            '<span class="tnom">' + esc(t) + '</span><span class="tnum" data-k="' + k + '">' + porTema[t].length + "</span></label>";
        }).join("") + "</div></div>" +
        '<div class="campo" style="margin-top:22px"><label>Número de preguntas</label><div class="segmentado" id="f-num">' +
        opcionesNum.map(function (n) { return '<button type="button" data-n="' + n + '">' + n + "</button>"; }).join("") +
        '<button type="button" data-n="0">Todas</button></div></div>' +
        '<div style="display:flex;flex-direction:column;gap:12px;margin-top:20px">' +
        '<label class="check"><input type="checkbox" id="f-mezclar"' + (cfg.mezclar ? " checked" : "") + "> Mezclar el orden</label>" +
        '<label class="check"><input type="checkbox" id="f-flojas"> Solo las que me salieron mal o a medias <span class="meta" id="n-flojas"></span></label></div>' +
        '<div class="acciones"><button class="btn primario" id="empezar" type="button">Empezar</button>' +
        '<a class="btn" href="' + base + '">Volver</a></div>' +
        '<p id="disponibles" style="margin-top:12px;font-size:.88rem;color:var(--texto-suave)"></p></div>' +
        panelIaHtml();
      pintar(html);
      activarPanelIa();

      var checks = Array.prototype.slice.call(document.querySelectorAll("#f-temas input"));
      var chkFlojas = document.getElementById("f-flojas"), chkMezclar = document.getElementById("f-mezclar");
      var botonesNum = Array.prototype.slice.call(document.querySelectorAll("#f-num button"));
      var num = cfg.num;
      if (!botonesNum.some(function (b) { return +b.dataset.n === num; })) num = 0;
      function marcados() { return checks.filter(function (c) { return c.checked; }).map(function (c) { return temas[+c.value]; }); }
      function seleccion() {
        var ts = marcados();
        return lista.filter(function (q) { return ts.indexOf(q.tema) >= 0 && (!chkFlojas.checked || flojas(q)); });
      }
      function actualizar() {
        botonesNum.forEach(function (b) { b.setAttribute("aria-pressed", String(+b.dataset.n === num)); });
        var ts = marcados();
        var nF = lista.filter(function (q) { return flojas(q) && ts.indexOf(q.tema) >= 0; }).length;
        document.getElementById("n-flojas").textContent = "(" + nF + ")";
        chkFlojas.disabled = nF === 0; if (!nF) chkFlojas.checked = false;
        temas.forEach(function (t, k) {
          document.querySelector('.tnum[data-k="' + k + '"]').textContent = chkFlojas.checked ? porTema[t].filter(flojas).length : porTema[t].length;
        });
        checks.forEach(function (c) { c.parentNode.classList.toggle("off", !c.checked); });
        var disp = seleccion().length, haras = num ? Math.min(num, disp) : disp;
        document.getElementById("disponibles").textContent = !ts.length ? "Marca al menos un tema" :
          plural(ts.length, "tema", "temas") + " · " + plural(disp, "pregunta disponible", "preguntas disponibles") + " · harás " + haras;
        document.getElementById("empezar").disabled = disp === 0;
      }
      botonesNum.forEach(function (b) { b.addEventListener("click", function () { num = +b.dataset.n; actualizar(); }); });
      checks.forEach(function (c) { c.addEventListener("change", actualizar); });
      chkFlojas.addEventListener("change", actualizar);
      document.getElementById("t-todos").addEventListener("click", function () { checks.forEach(function (c) { c.checked = true; }); actualizar(); });
      document.getElementById("t-ninguno").addEventListener("click", function () { checks.forEach(function (c) { c.checked = false; }); actualizar(); });
      actualizar();
      document.getElementById("empezar").addEventListener("click", function () {
        store.set("cfgCortas", { num: num, mezclar: chkMezclar.checked });
        if (!temaInicial) { var ts = marcados(); store.set(claveTemas, temas.filter(function (t) { return ts.indexOf(t) < 0; })); }
        var sel = seleccion();
        if (chkMezclar.checked) sel = barajar(sel);
        if (num) sel = sel.slice(0, num);
        iniciarCortas(curso, asig, sel);
      });
    });
  }

  /* ---------- Preguntas cortas en marcha ---------- */
  var VEREDICTOS = { bien: { txt: "Bien", ico: "✓" }, parcial: { txt: "A medias", ico: "½" }, mal: { txt: "Mal", ico: "✗" } };

  function iniciarCortas(curso, asig, preguntas) {
    var base = rutaAsig(curso, asig);
    var claveNotas = "cortas:" + curso.id + "/" + asig.id;
    var items = preguntas.map(function (q) { return { q: q, texto: "", res: null }; });
    var pos = 0;

    function cuenta(v) { return items.filter(function (x) { return x.res === v; }).length; }
    function marcador() {
      return '<span class="ok">✓ ' + cuenta("bien") + '</span><span class="media">½ ' + cuenta("parcial") + '</span><span class="mal">✗ ' + cuenta("mal") + "</span>";
    }

    function pintarPregunta() {
      var it = items[pos], q = it.q;
      pintar('<div class="quiz">' +
        '<div class="quiz-top"><span>Pregunta ' + (pos + 1) + " de " + items.length + '</span><span class="marcador">' + marcador() + "</span></div>" +
        '<div class="progreso"><div style="width:' + (pos / items.length * 100) + '%"></div></div>' +
        '<div class="pregunta-meta"><span class="chip">✍️ Pregunta corta</span><span class="chip">' + esc(q.tema) + "</span></div>" +
        '<div class="enunciado">' + esc(q.pregunta) + "</div>" +
        '<textarea id="resp" class="resp-corta" rows="6" placeholder="Escribe aquí tu respuesta con tus palabras…"></textarea>' +
        '<div class="acciones" id="acc-responder"><button class="btn primario" type="button" id="corregir">Corregir</button>' +
        '<button class="btn" type="button" id="nolose">No lo sé, enséñame la respuesta</button></div>' +
        '<div id="correccion"></div>' +
        '<div class="acciones quiz-acciones"><button class="btn" type="button" id="salir">Terminar aquí</button></div>' +
        '<p class="atajos"><kbd>Ctrl</kbd>+<kbd>Enter</kbd> para corregir · después <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> para valorar</p></div>');
      var ta = document.getElementById("resp");
      ta.focus({ preventScroll: true });
      ta.addEventListener("input", function () { ta.classList.remove("vacia"); });
      document.getElementById("corregir").addEventListener("click", function () { corregir(false); });
      document.getElementById("nolose").addEventListener("click", function () { corregir(true); });
      document.getElementById("salir").addEventListener("click", function () {
        var hechas = items.filter(function (x) { return x.res; });
        if (!hechas.length) { router(); return; }
        items = hechas; mostrarResultado();
      });
    }

    function corregir(sinRespuesta) {
      var it = items[pos], q = it.q;
      var ta = document.getElementById("resp");
      it.texto = sinRespuesta ? "" : ta.value.trim();
      if (!sinRespuesta && !it.texto) { ta.focus(); ta.classList.add("vacia"); return; }
      ta.readOnly = true;
      document.getElementById("acc-responder").hidden = true;
      var claves = revisarClaves(q, it.texto);
      var nOk = claves.filter(function (c) { return c.ok; }).length;
      var ratio = claves.length ? nOk / claves.length : 0;
      var sugerido = sinRespuesta ? "mal" : ratio >= 0.75 ? "bien" : ratio >= 0.4 ? "parcial" : "mal";
      var usarIa = IA.activa() && !sinRespuesta;

      var html = "";
      if (usarIa) html += '<div class="ia-res cargando" id="ia-res"><span class="spinner"></span> Corrigiendo con IA…</div>';
      if (!sinRespuesta && claves.length) {
        html += '<div class="bloque-corr"><div class="bloque-tit">Conceptos clave <span class="meta">has mencionado ' + nOk + " de " + claves.length + "</span></div>" +
          '<ul class="claves">' + claves.map(function (c) {
            return '<li class="' + (c.ok ? "ok" : "mal") + '"><span>' + (c.ok ? "✓" : "✗") + "</span>" + esc(c.t) + "</li>";
          }).join("") + "</ul>" +
          '<p class="meta">La búsqueda de conceptos es automática y no entiende sinónimos: si lo has dicho con otras palabras, cuenta como bien.</p></div>';
      }
      html += '<div class="bloque-corr modelo"><div class="bloque-tit">Respuesta modelo</div><p>' + esc(q.respuesta) + "</p></div>" +
        '<div class="autoeval"><div class="bloque-tit">¿Cómo te ha salido?</div><div class="autoeval-btns">' +
        ["bien", "parcial", "mal"].map(function (v, k) {
          return '<button type="button" class="btn ae-' + v + (v === sugerido ? " sugerido" : "") + '" data-v="' + v + '"><kbd>' + (k + 1) + "</kbd> " +
            VEREDICTOS[v].ico + " " + VEREDICTOS[v].txt + "</button>";
        }).join("") + '</div><p class="meta" id="sugerencia">' + (sinRespuesta ? "" : "Sugerencia según los conceptos clave: <b>" + VEREDICTOS[sugerido].txt + "</b>") + "</p></div>";
      var cont = document.getElementById("correccion");
      cont.innerHTML = html;
      Array.prototype.forEach.call(cont.querySelectorAll(".autoeval-btns .btn"), function (b) {
        b.addEventListener("click", function () { valorar(b.dataset.v); });
      });
      cont.scrollIntoView({ behavior: "smooth", block: "start" });
      if (usarIa) pedirIa(it);
    }

    function pedirIa(it) {
      var caja = document.getElementById("ia-res");
      caja.className = "ia-res cargando";
      caja.innerHTML = '<span class="spinner"></span> Corrigiendo con IA…';
      var miPos = pos;
      IA.corregir(it.q, asig.nombre, it.texto).then(function (r) {
        if (miPos !== pos || !document.getElementById("ia-res")) return;
        var v = VEREDICTOS[r.veredicto] ? r.veredicto : null;
        var nota = typeof r.nota === "number" ? Math.max(0, Math.min(10, r.nota)) : null;
        caja.className = "ia-res " + (v || "");
        caja.innerHTML = '<div class="ia-cab"><span class="bloque-tit">🤖 Corrección de la IA</span>' +
          (nota !== null ? '<span class="ia-nota-num">' + String(Math.round(nota * 10) / 10).replace(".", ",") + "<small>/10</small></span>" : "") + "</div>" +
          (r.comentario ? "<p>" + esc(r.comentario) + "</p>" : "") +
          (r.errores && r.errores.length ? '<div class="ia-lista mal"><b>Errores</b><ul>' + r.errores.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" : "") +
          (r.falta && r.falta.length ? '<div class="ia-lista"><b>Te ha faltado</b><ul>' + r.falta.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" : "");
        if (v) {
          Array.prototype.forEach.call(document.querySelectorAll(".autoeval-btns .btn"), function (b) { b.classList.toggle("sugerido", b.dataset.v === v); });
          document.getElementById("sugerencia").innerHTML = "Sugerencia de la IA: <b>" + VEREDICTOS[v].txt + "</b>";
        }
      }).catch(function (e) {
        if (miPos !== pos || !document.getElementById("ia-res")) return;
        caja.className = "ia-res error";
        caja.innerHTML = "<p>⚠️ " + esc(e.message) + '</p><button class="btn" type="button" id="ia-reintentar">Reintentar</button>';
        document.getElementById("ia-reintentar").addEventListener("click", function () { pedirIa(it); });
      });
    }

    function valorar(v) {
      var it = items[pos];
      if (!document.querySelector(".autoeval-btns")) return;
      it.res = v;
      var notas = store.get(claveNotas, {});
      notas[it.q.id] = v;
      store.set(claveNotas, notas);
      pos++;
      if (pos < items.length) pintarPregunta(); else mostrarResultado();
    }

    function teclado(e) {
      if (e.altKey || e.metaKey) return;
      var ta = document.getElementById("resp");
      if (!ta) return;
      if (e.key === "Enter" && e.ctrlKey && !ta.readOnly) { corregir(false); e.preventDefault(); return; }
      if (e.ctrlKey || !ta.readOnly) return;
      var mapa = { "1": "bien", "2": "parcial", "3": "mal" };
      if (mapa[e.key] && document.querySelector(".autoeval-btns")) { valorar(mapa[e.key]); e.preventDefault(); }
    }
    document.addEventListener("keydown", teclado);
    limpiarTeclado = function () { document.removeEventListener("keydown", teclado); };

    function mostrarResultado() {
      if (limpiarTeclado) { limpiarTeclado(); limpiarTeclado = null; }
      var b = cuenta("bien"), p = cuenta("parcial"), m = cuenta("mal"), total = items.length;
      var pct = total ? Math.round((b + p * 0.5) / total * 100) : 0;
      var clase = pct >= 70 ? "ok" : pct >= 50 ? "media" : "mal";
      var repasar = items.filter(function (x) { return x.res !== "bien"; });
      var html = '<div class="quiz"><div class="resultado-cabecera">' +
        '<div class="nota-grande ' + clase + '">' + (pct / 10).toFixed(1).replace(".", ",") + "</div>" +
        "<p><strong>" + b + " bien · " + p + " a medias · " + m + " mal</strong> (las «a medias» cuentan la mitad)</p>" +
        '<div class="acciones">' +
        (repasar.length ? '<button class="btn primario" type="button" id="repetir">Repetir las ' + repasar.length + " que fallaste</button>" : "") +
        '<button class="btn" type="button" id="nuevo">Otra tanda</button><a class="btn" href="' + base + '">Volver a la asignatura</a></div></div>';
      if (repasar.length) {
        html += '<h2 style="margin-top:12px">Para repasar</h2><div class="repaso">';
        repasar.forEach(function (x) {
          html += '<div class="repaso-item"><div class="q">' + VEREDICTOS[x.res].ico + " " + esc(x.q.pregunta) + "</div>" +
            (x.texto ? '<div class="r"><div class="tuya">Tu respuesta: ' + esc(x.texto) + "</div></div>" : "") +
            '<div class="exp"><b>Respuesta modelo:</b> ' + esc(x.q.respuesta) + "</div></div>";
        });
        html += "</div>";
      }
      pintar(html + "</div>");
      var rp = document.getElementById("repetir");
      if (rp) rp.addEventListener("click", function () { iniciarCortas(curso, asig, repasar.map(function (x) { return x.q; })); });
      document.getElementById("nuevo").addEventListener("click", function () { router(); });
    }

    pintarPregunta();
  }

  window.addEventListener("hashchange", router);
  router();
})();
