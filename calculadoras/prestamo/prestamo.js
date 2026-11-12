// Calculadora de cuota de préstamo — sistema francés.
(function () {
  "use strict";

  var form = document.getElementById("form-prestamo");
  if (!form) return;

  var $ = function (id) { return document.getElementById(id); };
  var fmt = window.formatARS;

  var inputMonto = $("monto");
  var inputTasa = $("tasa");
  var inputMeses = $("meses");

  var resultado = $("resultado");
  var montoEl = $("resultado-monto");
  var desglose = $("desglose");
  var error = $("error");
  var btnCopiar = $("copiar");
  var ultimoTexto = "";

  function calcular() {
    error.textContent = "";
    error.classList.add("hidden");

    var monto = parseFloat(inputMonto.value);
    var tasa = parseFloat(inputTasa.value);
    var meses = parseInt(inputMeses.value, 10);

    if (!isFinite(monto) || monto <= 0) return fallo("Ingresá un monto mayor a cero.");
    if (!isFinite(tasa) || tasa < 0) return fallo("Ingresá una tasa mensual válida.");
    if (!isFinite(meses) || meses < 1 || meses > 360) return fallo("El plazo debe estar entre 1 y 360 meses.");

    var i = tasa / 100;
    var cuota = i === 0 ? monto / meses : (monto * i) / (1 - Math.pow(1 + i, -meses));
    var total = cuota * meses;
    var intereses = total - monto;

    montoEl.textContent = fmt(cuota);

    desglose.innerHTML = [
      ["Monto solicitado", fmt(monto)],
      ["Cuota mensual", fmt(cuota)],
      ["Cantidad de cuotas", meses + " meses"],
      ["Total a pagar", fmt(total)],
      ["Intereses totales", fmt(intereses)],
      ["Interés sobre el monto", ((intereses / monto) * 100).toFixed(1) + "%"],
    ]
      .map(function (f) { return "<div><span>" + f[0] + "</span><span>" + f[1] + "</span></div>"; })
      .join("");

    resultado.classList.remove("hidden");
    btnCopiar.classList.remove("hidden");

    ultimoTexto =
      "Préstamo: " + fmt(monto) + " — cuota " + fmt(cuota) +
      " × " + meses + " meses — total " + fmt(total) +
      " (intereses " + fmt(intereses) + "). Calculado en calculaargentina.com";
  }

  function fallo(msg) {
    error.textContent = msg;
    error.classList.remove("hidden");
    resultado.classList.add("hidden");
    btnCopiar.classList.add("hidden");
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calcular(); });
  [inputMonto, inputTasa, inputMeses].forEach(function (el) {
    el.addEventListener("input", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  });
  btnCopiar.addEventListener("click", function () { if (ultimoTexto) window.copyText(ultimoTexto, btnCopiar); });
})();
