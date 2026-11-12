// Calculadora de vacaciones — Argentina (arts. 150 y 155, Ley 20.744).
(function () {
  "use strict";

  var form = document.getElementById("form-vacaciones");
  if (!form) return;

  var $ = function (id) { return document.getElementById(id); };
  var fmt = window.formatARS;

  var inputSueldo = $("sueldo");
  var inputAntiguedad = $("antiguedad");
  var inputDias = $("dias");

  var resultado = $("resultado");
  var monto = $("resultado-monto");
  var desglose = $("desglose");
  var error = $("error");
  var btnCopiar = $("copiar");
  var ultimoTexto = "";

  function diasPorAntiguedad(anios) {
    if (anios <= 5) return 14;
    if (anios <= 10) return 21;
    if (anios <= 20) return 28;
    return 35;
  }

  function calcular() {
    error.textContent = "";
    error.classList.add("hidden");

    var sueldo = parseFloat(inputSueldo.value);
    var antiguedad = parseInt(inputAntiguedad.value, 10);
    var dias = parseInt(inputDias.value, 10);

    if (!isFinite(sueldo) || sueldo <= 0) return fallo("Ingresá tu sueldo bruto mensual.");
    if (!isFinite(antiguedad) || antiguedad < 0) return fallo("Revisá la antigüedad en años.");
    if (!isFinite(dias) || dias < 1 || dias > 35) return fallo("Los días deben estar entre 1 y 35.");

    var valorDia = sueldo / 25;
    var pago = valorDia * dias;

    monto.textContent = fmt(pago);

    desglose.innerHTML = [
      ["Sueldo mensual", fmt(sueldo)],
      ["Valor del día (sueldo ÷ 25)", fmt(valorDia)],
      ["Días de vacaciones", dias + " días"],
      ["Pago estimado", fmt(pago)],
    ]
      .map(function (f) { return "<div><span>" + f[0] + "</span><span>" + f[1] + "</span></div>"; })
      .join("");

    resultado.classList.remove("hidden");
    btnCopiar.classList.remove("hidden");

    ultimoTexto =
      "Vacaciones: " + dias + " días — pago estimado " + fmt(pago) +
      ". Calculado en tuscuentas.com.ar";
  }

  function fallo(msg) {
    error.textContent = msg;
    error.classList.remove("hidden");
    resultado.classList.add("hidden");
    btnCopiar.classList.add("hidden");
  }

  inputAntiguedad.addEventListener("input", function () {
    var a = parseInt(inputAntiguedad.value, 10);
    if (isFinite(a) && a >= 0) inputDias.value = String(diasPorAntiguedad(a));
    if (!resultado.classList.contains("hidden")) calcular();
  });

  form.addEventListener("submit", function (e) { e.preventDefault(); calcular(); });
  [inputSueldo, inputDias].forEach(function (el) {
    el.addEventListener("input", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  });
  btnCopiar.addEventListener("click", function () { if (ultimoTexto) window.copyText(ultimoTexto, btnCopiar); });
})();
