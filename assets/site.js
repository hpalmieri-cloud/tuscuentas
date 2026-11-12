// Utilidades mínimas y compartidas del sitio.
(function () {
  "use strict";

  // Año dinámico en el footer.
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  // Copiar al portapapeles con aviso simple.
  window.copyText = function (text, btn) {
    if (!text) return;
    var done = function () {
      if (!btn) return;
      var original = btn.textContent;
      btn.textContent = "¡Copiado!";
      setTimeout(function () {
        btn.textContent = original;
      }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () {
        fallbackCopy(text, done);
      });
    } else {
      fallbackCopy(text, done);
    }
  };

  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      done();
    } catch (e) {
      /* sin soporte */
    }
    document.body.removeChild(ta);
  }

  // Formato de moneda argentina.
  window.formatARS = function (n) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(n);
  };
})();
