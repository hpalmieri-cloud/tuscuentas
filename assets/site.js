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

  // ---------------------------------------------------------------
  // Formato de dinero en inputs: "$ 1.234.567,89"
  // ---------------------------------------------------------------

  function formatMoneyString(raw, maxDecimals) {
    var cleaned = String(raw == null ? "" : raw).replace(/[^\d,]/g, "");
    if (!cleaned) return "";

    var parts = cleaned.split(",");
    if (parts.length > 2) parts = [parts[0], parts.slice(1).join("")];

    var intPart = parts[0].replace(/^0+(?=\d)/, "");
    if (intPart === "" && parts.length > 1) intPart = "0";
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    var out = "$ " + intPart;
    if (parts.length > 1) {
      out += "," + parts[1].slice(0, maxDecimals);
    }
    return out;
  }

  function significantCount(str) {
    return (String(str).match(/[\d,]/g) || []).length;
  }

  function positionAfterSignificant(formatted, count) {
    if (count <= 0) return 0;
    var seen = 0;
    for (var i = 0; i < formatted.length; i++) {
      if (/[\d,]/.test(formatted[i])) {
        seen++;
        if (seen >= count) return i + 1;
      }
    }
    return formatted.length;
  }

  window.setupMoneyInput = function (input, maxDecimals) {
    if (!input) return;
    var maxDec = typeof maxDecimals === "number" && isFinite(maxDecimals) ? maxDecimals : 2;

    input.setAttribute("type", "text");
    input.setAttribute("inputmode", "decimal");
    input.setAttribute("autocomplete", "off");

    input.addEventListener("input", function () {
      var old = input.value;
      var sel = input.selectionStart == null ? old.length : input.selectionStart;
      var sig = significantCount(old.slice(0, sel));
      var formatted = formatMoneyString(old, maxDec);
      input.value = formatted;
      var pos = positionAfterSignificant(formatted, sig);
      try {
        input.setSelectionRange(pos, pos);
      } catch (e) {
        /* algunos navegadores no lo permiten */
      }
    });

    input.addEventListener("blur", function () {
      input.value = formatMoneyString(input.value, maxDec);
    });

    if (input.value) {
      input.value = formatMoneyString(input.value, maxDec);
    }
  };

  window.getMoneyValue = function (input) {
    var v = String(input && input.value != null ? input.value : "")
      .replace(/\$/g, "")
      .replace(/\./g, "")
      .replace(/,/g, ".")
      .trim();
    var n = parseFloat(v);
    return isFinite(n) ? n : NaN;
  };

  function initMoneyInputs() {
    document.querySelectorAll("[data-money]").forEach(function (el) {
      var decAttr = el.getAttribute("data-money-decimals");
      var dec = decAttr === null ? 2 : parseInt(decAttr, 10);
      window.setupMoneyInput(el, isFinite(dec) ? dec : 2);
    });
  }

  initMoneyInputs();
})();
