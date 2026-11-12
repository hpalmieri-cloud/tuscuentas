// Calculadora de plazo fijo — Argentina (interés simple y renovaciones).
(function () {
  "use strict";

  var form = document.getElementById("form-plazo");
  if (!form) return;

  var $ = function (id) { return document.getElementById(id); };
  var fmt = window.formatARS;

  var inputCapital = $("capital");
  var inputTna = $("tna");
  var inputDias = $("dias");
  var inputRenov = $("renovaciones");

  var resultado = $("resultado");
  var monto = $("resultado-monto");
  var desglose = $("desglose");
  var error = $("error");
  var btnCopiar = $("copiar");
  var ultimoTexto = "";

  function calcular() {
    error.textContent = "";
    error.classList.add("hidden");

    var capital = parseFloat(inputCapital.value);
    var tna = parseFloat(inputTna.value);
    var dias = parseInt(inputDias.value, 10);
    var renovaciones = parseInt(inputRenov.value, 10);

    if (!isFinite(capital) || capital <= 0) return fallo("Ingresá un capital mayor a cero.");
    if (!isFinite(tna) || tna < 0) return fallo("Ingresá una TNA válida.");
    if (!isFinite(dias) || dias < 1 || dias > 730) return fallo("El plazo debe estar entre 1 y 730 días.");
    if (!isFinite(renovaciones) || renovaciones < 1 || renovaciones > 120) return fallo("Las renovaciones deben estar entre 1 y 120.");

    var tasaPeriodo = (tna / 100) * (dias / 365);
    var total = capital * Math.pow(1 + tasaPeriodo, renovaciones);
    var interes = total - capital;
    var tasaEfectivaPeriodo = (Math.pow(1 + tasaPeriodo, renovaciones) - 1) * 100;
    var tea = (Math.pow(1 + tasaPeriodo, 365 / dias) - 1) * 100;

    monto.textContent = fmt(total);

    desglose.innerHTML = [
      ["Capital inicial", fmt(capital)],
      ["Interés ganado", fmt(interes)],
      ["Tasa del período", (tasaPeriodo * 100).toFixed(2) + "%"],
      ["Rendimiento total", tasaEfectivaPeriodo.toFixed(2) + "%"],
      ["TEA estimada", tea.toFixed(2) + "%"],
      ["Renovaciones", renovaciones + " × " + dias + " días"],
    ]
      .map(function (f) { return "<div><span>" + f[0] + "</span><span>" + f[1] + "</span></div>"; })
      .join("");

    resultado.classList.remove("hidden");
    btnCopiar.classList.remove("hidden");

    ultimoTexto =
      "Plazo fijo: capital " + fmt(capital) +
      " — interés " + fmt(interes) +
      " — total " + fmt(total) +
      " (" + renovaciones + " × " + dias + " días). Calculado en tuscuentas.com.ar";
  }

  function fallo(msg) {
    error.textContent = msg;
    error.classList.remove("hidden");
    resultado.classList.add("hidden");
    btnCopiar.classList.add("hidden");
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calcular(); });
  [inputCapital, inputTna, inputDias, inputRenov].forEach(function (el) {
    el.addEventListener("input", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  });
  btnCopiar.addEventListener("click", function () { if (ultimoTexto) window.copyText(ultimoTexto, btnCopiar); });
})();
