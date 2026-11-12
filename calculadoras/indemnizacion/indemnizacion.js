// Calculadora de indemnización por despido sin justa causa — Argentina.
(function () {
  "use strict";

  var form = document.getElementById("form-indemnizacion");
  if (!form) return;

  var $ = function (id) { return document.getElementById(id); };
  var fmt = window.formatARS;

  var inputSueldo = $("sueldo");
  var inputAnios = $("anios");
  var inputMeses = $("meses");
  var checkPreaviso = $("incluir-preaviso");

  var resultado = $("resultado");
  var monto = $("resultado-monto");
  var desglose = $("desglose");
  var error = $("error");
  var btnCopiar = $("copiar");
  var ultimoTexto = "";

  function calcular() {
    error.textContent = "";
    error.classList.add("hidden");

    var sueldo = parseFloat(inputSueldo.value);
    var anios = parseInt(inputAnios.value, 10);
    var meses = parseInt(inputMeses.value, 10);

    if (!isFinite(sueldo) || sueldo <= 0) {
      return fallo("Ingresá el mejor sueldo bruto del último año.");
    }
    if (!isFinite(anios) || anios < 0 || !isFinite(meses) || meses < 0 || meses > 11) {
      return fallo("Revisá la antigüedad: años desde 0 y meses entre 0 y 11.");
    }

    // Art. 245: fracción mayor a 3 meses cuenta como año completo.
    var aniosComputables = anios + (meses > 3 ? 1 : 0);
    var indemnizacion = sueldo * aniosComputables;

    // Art. 231: preaviso según antigüedad real.
    var antiguedadReal = anios + meses / 12;
    var preaviso = 0;
    if (checkPreaviso.checked) {
      preaviso = sueldo * (antiguedadReal >= 5 ? 2 : 1);
    }

    var total = indemnizacion + preaviso;

    monto.textContent = fmt(total);

    var filas = [
      ["Mejor sueldo", fmt(sueldo)],
      ["Antigüedad computable", aniosComputables + (aniosComputables === 1 ? " año" : " años")],
      ["Indemnización por antigüedad", fmt(indemnizacion)],
    ];
    if (checkPreaviso.checked) {
      filas.push(["Preaviso (" + (antiguedadReal >= 5 ? "2" : "1") + " mes/es)", fmt(preaviso)]);
    }
    filas.push(["Total estimado", fmt(total)]);

    desglose.innerHTML = filas
      .map(function (f) { return "<div><span>" + f[0] + "</span><span>" + f[1] + "</span></div>"; })
      .join("");

    resultado.classList.remove("hidden");
    btnCopiar.classList.remove("hidden");

    ultimoTexto =
      "Indemnización estimada: " + fmt(total) +
      " (antigüedad: " + aniosComputables + " años" +
      (checkPreaviso.checked ? ", preaviso incluido" : "") +
      "). Calculado en tuscuentas.com.ar";
  }

  function fallo(msg) {
    error.textContent = msg;
    error.classList.remove("hidden");
    resultado.classList.add("hidden");
    btnCopiar.classList.add("hidden");
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calcular(); });
  [inputSueldo, inputAnios, inputMeses].forEach(function (el) {
    el.addEventListener("input", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  });
  checkPreaviso.addEventListener("change", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  btnCopiar.addEventListener("click", function () { if (ultimoTexto) window.copyText(ultimoTexto, btnCopiar); });
})();
