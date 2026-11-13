// Calculadora de horas extras — Argentina (art. 201, Ley 20.744).
(function () {
  "use strict";

  var form = document.getElementById("form-horas");
  if (!form) return;

  var $ = function (id) { return document.getElementById(id); };
  var fmt = window.formatARS;

  var inputSueldo = $("sueldo");
  var inputHorasMes = $("horas-mes");
  var inputHoras50 = $("horas-50");
  var inputHoras100 = $("horas-100");

  var resultado = $("resultado");
  var montoEl = $("resultado-monto");
  var desglose = $("desglose");
  var error = $("error");
  var btnCopiar = $("copiar");
  var ultimoTexto = "";

  function calcular() {
    error.textContent = "";
    error.classList.add("hidden");

    var sueldo = parseFloat(inputSueldo.value);
    var horasMes = parseFloat(inputHorasMes.value);
    var horas50 = parseFloat(inputHoras50.value) || 0;
    var horas100 = parseFloat(inputHoras100.value) || 0;

    if (!isFinite(sueldo) || sueldo <= 0) return fallo("Ingresá tu sueldo bruto mensual.");
    if (!isFinite(horasMes) || horasMes < 1 || horasMes > 300) return fallo("Las horas mensuales deben estar entre 1 y 300.");
    if (horas50 < 0 || horas100 < 0) return fallo("Las horas extras no pueden ser negativas.");
    if (horas50 === 0 && horas100 === 0) return fallo("Ingresá al menos una hora extra.");

    var valorHora = sueldo / horasMes;
    var pago50 = valorHora * 1.5 * horas50;
    var pago100 = valorHora * 2 * horas100;
    var total = pago50 + pago100;

    montoEl.textContent = fmt(total);

    desglose.innerHTML = [
      ["Sueldo mensual", fmt(sueldo)],
      ["Valor hora", fmt(valorHora)],
      ["Horas al 50%", horas50 + " hs → " + fmt(pago50)],
      ["Horas al 100%", horas100 + " hs → " + fmt(pago100)],
      ["Total adicional", fmt(total)]
    ]
      .map(function (f) { return "<div><span>" + f[0] + "</span><span>" + f[1] + "</span></div>"; })
      .join("");

    resultado.classList.remove("hidden");
    btnCopiar.classList.remove("hidden");

    ultimoTexto =
      "Horas extras: " + fmt(total) + " brutos (" +
      horas50 + " hs al 50% y " + horas100 + " hs al 100%). Calculado en tuscuentas.com.ar";
  }

  function fallo(msg) {
    error.textContent = msg;
    error.classList.remove("hidden");
    resultado.classList.add("hidden");
    btnCopiar.classList.add("hidden");
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calcular(); });
  [inputSueldo, inputHorasMes, inputHoras50, inputHoras100].forEach(function (el) {
    el.addEventListener("input", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  });
  btnCopiar.addEventListener("click", function () { if (ultimoTexto) window.copyText(ultimoTexto, btnCopiar); });
})();
