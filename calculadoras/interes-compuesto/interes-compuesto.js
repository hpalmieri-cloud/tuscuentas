// Calculadora de interés compuesto con aportes mensuales.
(function () {
  "use strict";

  var form = document.getElementById("form-interes");
  if (!form) return;

  var $ = function (id) { return document.getElementById(id); };
  var fmt = window.formatARS;

  var inputCapital = $("capital");
  var inputAporte = $("aporte");
  var inputTasa = $("tasa");
  var inputAnios = $("anios");

  var resultado = $("resultado");
  var montoEl = $("resultado-monto");
  var desglose = $("desglose");
  var error = $("error");
  var btnCopiar = $("copiar");
  var ultimoTexto = "";

  function calcular() {
    error.textContent = "";
    error.classList.add("hidden");

    var capital = window.getMoneyValue(inputCapital) || 0;
    var aporte = window.getMoneyValue(inputAporte) || 0;
    var tasaAnual = parseFloat(inputTasa.value);
    var anios = parseInt(inputAnios.value, 10);

    if (capital < 0 || aporte < 0) return fallo("El capital y el aporte no pueden ser negativos.");
    if (capital === 0 && aporte === 0) return fallo("Ingresá un capital inicial o un aporte mensual.");
    if (!isFinite(tasaAnual) || tasaAnual < 0) return fallo("Ingresá una tasa anual válida.");
    if (!isFinite(anios) || anios < 1 || anios > 60) return fallo("El plazo debe estar entre 1 y 60 años.");

    var i = Math.pow(1 + tasaAnual / 100, 1 / 12) - 1;
    var n = anios * 12;
    var factor = Math.pow(1 + i, n);

    var fvCapital = capital * factor;
    var fvAportes = i === 0 ? aporte * n : aporte * ((factor - 1) / i);
    var total = fvCapital + fvAportes;
    var aportado = capital + aporte * n;
    var interes = total - aportado;

    montoEl.textContent = fmt(total);

    desglose.innerHTML = [
      ["Capital inicial", fmt(capital)],
      ["Aportes mensuales", fmt(aporte) + " × " + n + " meses"],
      ["Total aportado", fmt(aportado)],
      ["Interés ganado", fmt(interes)],
      ["Tasa mensual equivalente", (i * 100).toFixed(3) + "%"],
      ["Plazo", anios + (anios === 1 ? " año" : " años")]
    ]
      .map(function (f) { return "<div><span>" + f[0] + "</span><span>" + f[1] + "</span></div>"; })
      .join("");

    resultado.classList.remove("hidden");
    btnCopiar.classList.remove("hidden");

    ultimoTexto =
      "Interés compuesto: monto final " + fmt(total) +
      " (aportado " + fmt(aportado) + ", interés " + fmt(interes) +
      ") en " + anios + " años. Calculado en tuscuentas.com.ar";
  }

  function fallo(msg) {
    error.textContent = msg;
    error.classList.remove("hidden");
    resultado.classList.add("hidden");
    btnCopiar.classList.add("hidden");
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calcular(); });
  [inputCapital, inputAporte, inputTasa, inputAnios].forEach(function (el) {
    el.addEventListener("input", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  });
  btnCopiar.addEventListener("click", function () { if (ultimoTexto) window.copyText(ultimoTexto, btnCopiar); });
})();
