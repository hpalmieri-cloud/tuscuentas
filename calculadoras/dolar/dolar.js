// Calculadora de conversión ARS ↔ USD — cotización manual.
(function () {
  "use strict";

  var form = document.getElementById("form-dolar");
  if (!form) return;

  var $ = function (id) { return document.getElementById(id); };
  var fmtARS = window.formatARS;

  var inputMonto = $("monto");
  var inputCotizacion = $("cotizacion");
  var selectDireccion = $("direccion");

  var resultado = $("resultado");
  var label = $("resultado-label");
  var montoEl = $("resultado-monto");
  var desglose = $("desglose");
  var error = $("error");
  var btnCopiar = $("copiar");
  var ultimoTexto = "";

  function fmtUSD(n) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2
    }).format(n);
  }

  function calcular() {
    error.textContent = "";
    error.classList.add("hidden");

    var monto = window.getMoneyValue(inputMonto);
    var cotizacion = window.getMoneyValue(inputCotizacion);

    if (!isFinite(monto) || monto <= 0) return fallo("Ingresá un monto mayor a cero.");
    if (!isFinite(cotizacion) || cotizacion <= 0) return fallo("Ingresá una cotización mayor a cero.");

    var esArsAUsd = selectDireccion.value === "ars-a-usd";
    var convertido = esArsAUsd ? monto / cotizacion : monto * cotizacion;
    var moneda = esArsAUsd ? "USD" : "ARS";

    label.textContent = esArsAUsd ? "Equivale a (USD)" : "Equivale a (ARS)";
    montoEl.textContent = esArsAUsd ? fmtUSD(convertido) : fmtARS(convertido);

    var filas = [
      ["Monto original", esArsAUsd ? fmtARS(monto) : fmtUSD(monto)],
      ["Cotización usada", fmtARS(cotizacion) + " por USD"],
      ["Tasa inversa", (1 / cotizacion).toFixed(6) + " USD por ARS"],
      ["Resultado", esArsAUsd ? fmtUSD(convertido) : fmtARS(convertido)]
    ];

    desglose.innerHTML = filas
      .map(function (f) { return "<div><span>" + f[0] + "</span><span>" + f[1] + "</span></div>"; })
      .join("");

    resultado.classList.remove("hidden");
    btnCopiar.classList.remove("hidden");

    ultimoTexto =
      "Conversión: " + (esArsAUsd ? fmtARS(monto) + " = " + fmtUSD(convertido) : fmtUSD(monto) + " = " + fmtARS(convertido)) +
      " (cotización " + fmtARS(cotizacion) + " por USD). Calculado en tuscuentas.com.ar";
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
  selectDireccion.addEventListener("change", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  btnCopiar.addEventListener("click", function () { if (ultimoTexto) window.copyText(ultimoTexto, btnCopiar); });
})();
