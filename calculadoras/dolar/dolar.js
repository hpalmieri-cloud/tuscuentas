// Calculadora de conversión ARS ↔ USD con cotización automática.
(function () {
  "use strict";

  var form = document.getElementById("form-dolar");
  if (!form) return;

  var $ = function (id) { return document.getElementById(id); };
  var fmtARS = window.formatARS;

  var inputMonto = $("monto");
  var inputCotizacion = $("cotizacion");
  var selectTipo = $("tipo");
  var selectDireccion = $("direccion");
  var hintCotizacion = $("cotizacion-hint");

  var resultado = $("resultado");
  var label = $("resultado-label");
  var montoEl = $("resultado-monto");
  var desglose = $("desglose");
  var error = $("error");
  var btnCopiar = $("copiar");
  var ultimoTexto = "";

  // Equivalencia entre las opciones del desplegable y dolarapi.com.
  var CASAS = {
    oficial: "oficial",
    blue: "blue",
    mep: "bolsa",
    ccl: "contadoconliqui",
    tarjeta: "tarjeta"
  };
  var NOMBRES = {
    oficial: "Oficial",
    blue: "Blue",
    mep: "MEP",
    ccl: "CCL",
    tarjeta: "Tarjeta"
  };

  var cotizaciones = null; // mapa casa -> { compra, venta, fechaActualizacion }
  var estado = "cargando"; // cargando | listo | error

  function fmtUSD(n) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2
    }).format(n);
  }

  function fmtRate(n) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(n);
  }

  function fmtHora(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(d);
  }

  function esManual() {
    return selectTipo.value === "manual";
  }

  function datosActuales() {
    if (esManual() || !cotizaciones) return null;
    return cotizaciones[CASAS[selectTipo.value]] || null;
  }

  // Deja el campo de cotización en el estado que corresponde.
  function aplicarCotizacion() {
    if (esManual()) {
      inputCotizacion.readOnly = false;
      inputCotizacion.removeAttribute("aria-readonly");
      hintCotizacion.textContent = "Ingresá la cotización a mano.";
      return;
    }

    if (estado === "cargando") {
      inputCotizacion.value = "";
      inputCotizacion.readOnly = true;
      inputCotizacion.setAttribute("aria-readonly", "true");
      hintCotizacion.textContent = "Cargando la cotización…";
      return;
    }

    var datos = datosActuales();
    if (!datos) {
      inputCotizacion.readOnly = false;
      inputCotizacion.removeAttribute("aria-readonly");
      hintCotizacion.textContent = "No pudimos actualizar. Ingresá la cotización a mano.";
      return;
    }

    var valor = datos.venta;
    inputCotizacion.value = fmtRate(valor);
    inputCotizacion.readOnly = true;
    inputCotizacion.setAttribute("aria-readonly", "true");
    hintCotizacion.textContent =
      "Venta · actualizado " + fmtHora(datos.fechaActualizacion) + " · dolarapi.com";
  }

  function cargarCotizaciones() {
    if (!window.fetch) {
      estado = "error";
      aplicarCotizacion();
      return;
    }

    var control = null;
    var timer = null;
    var opciones = {};
    if (window.AbortController) {
      control = new AbortController();
      opciones.signal = control.signal;
      timer = setTimeout(function () { control.abort(); }, 8000);
    }

    fetch("https://dolarapi.com/v1/dolares", opciones)
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (lista) {
        var mapa = {};
        lista.forEach(function (d) { mapa[d.casa] = d; });
        cotizaciones = mapa;
        estado = "listo";
        aplicarCotizacion();
        if (!resultado.classList.contains("hidden")) calcular();
      })
      .catch(function () {
        estado = "error";
        aplicarCotizacion();
      })
      .then(function () {
        if (timer) clearTimeout(timer);
      });
  }

  function calcular() {
    error.textContent = "";
    error.classList.add("hidden");

    var monto = window.getMoneyValue(inputMonto);
    var cotizacion = window.getMoneyValue(inputCotizacion);

    if (!isFinite(monto) || monto <= 0) return fallo("Ingresá un monto mayor a cero.");

    if (!esManual() && estado === "cargando") {
      return fallo("Estamos cargando la cotización. Probá de nuevo en un segundo.");
    }
    if (!isFinite(cotizacion) || cotizacion <= 0) {
      return fallo(!esManual() && estado === "error"
        ? "No pudimos actualizar la cotización. Ingresala a mano."
        : "Ingresá una cotización mayor a cero.");
    }

    var esArsAUsd = selectDireccion.value === "ars-a-usd";
    var convertido = esArsAUsd ? monto / cotizacion : monto * cotizacion;

    label.textContent = esArsAUsd ? "Equivale a (USD)" : "Equivale a (ARS)";
    montoEl.textContent = esArsAUsd ? fmtUSD(convertido) : fmtARS(convertido);

    var datos = datosActuales();
    var tipo = esManual() ? null : NOMBRES[selectTipo.value];
    var filas = [["Monto original", esArsAUsd ? fmtARS(monto) : fmtUSD(monto)]];

    if (tipo) {
      filas.push(["Tipo de dólar", tipo]);
      filas.push(["Cotización usada", fmtRate(cotizacion) + " por USD"]);
      if (datos) filas.push(["Actualizado", fmtHora(datos.fechaActualizacion)]);
    } else {
      filas.push(["Cotización usada", fmtRate(cotizacion) + " por USD"]);
    }

    filas.push(["Tasa inversa", (1 / cotizacion).toFixed(6) + " USD por ARS"]);
    filas.push(["Resultado", esArsAUsd ? fmtUSD(convertido) : fmtARS(convertido)]);

    desglose.innerHTML = filas
      .map(function (f) { return "<div><span>" + f[0] + "</span><span>" + f[1] + "</span></div>"; })
      .join("");

    resultado.classList.remove("hidden");
    btnCopiar.classList.remove("hidden");

    ultimoTexto =
      "Conversión: " + (esArsAUsd ? fmtARS(monto) + " = " + fmtUSD(convertido) : fmtUSD(monto) + " = " + fmtARS(convertido)) +
      " (" + (tipo ? "dólar " + tipo + ", " : "") + fmtRate(cotizacion) + " por USD" +
      (datos ? ", actualizado " + fmtHora(datos.fechaActualizacion) : "") + "). Calculado en tuscuentas.com.ar";
  }

  function fallo(msg) {
    error.textContent = msg;
    error.classList.remove("hidden");
    resultado.classList.add("hidden");
    btnCopiar.classList.add("hidden");
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calcular(); });
  [inputMonto, inputCotizacion].forEach(function (el) {
    el.addEventListener("input", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  });
  selectDireccion.addEventListener("change", function () {
    aplicarCotizacion();
    if (!resultado.classList.contains("hidden")) calcular();
  });
  selectTipo.addEventListener("change", function () {
    aplicarCotizacion();
    if (!resultado.classList.contains("hidden")) calcular();
  });
  btnCopiar.addEventListener("click", function () { if (ultimoTexto) window.copyText(ultimoTexto, btnCopiar); });

  aplicarCotizacion();
  cargarCotizaciones();
})();
