// Calculadora de sueldo neto — Argentina (aportes del trabajador).
(function () {
  "use strict";

  var form = document.getElementById("form-sueldo");
  if (!form) return;

  var $ = function (id) { return document.getElementById(id); };
  var fmt = window.formatARS;

  var inputBruto = $("bruto");
  var checkSindicato = $("sindicato");
  var resultado = $("resultado");
  var monto = $("resultado-monto");
  var desglose = $("desglose");
  var error = $("error");
  var btnCopiar = $("copiar");
  var ultimoTexto = "";

  function calcular() {
    error.textContent = "";
    error.classList.add("hidden");

    var bruto = window.getMoneyValue(inputBruto);
    if (!isFinite(bruto) || bruto <= 0) {
      error.textContent = "Ingresá un sueldo bruto mayor a cero.";
      error.classList.remove("hidden");
      resultado.classList.add("hidden");
      btnCopiar.classList.add("hidden");
      return;
    }

    var jubilacion = bruto * 0.11;
    var pami = bruto * 0.03;
    var obraSocial = bruto * 0.03;
    var sindicato = checkSindicato.checked ? bruto * 0.02 : 0;
    var totalDescuentos = jubilacion + pami + obraSocial + sindicato;
    var neto = bruto - totalDescuentos;

    monto.textContent = fmt(neto);

    var filas = [
      ["Sueldo bruto", fmt(bruto)],
      ["Jubilación (11%)", "- " + fmt(jubilacion)],
      ["PAMI (3%)", "- " + fmt(pami)],
      ["Obra social (3%)", "- " + fmt(obraSocial)],
    ];
    if (sindicato > 0) filas.push(["Sindicato (2%)", "- " + fmt(sindicato)]);
    filas.push(["Total de descuentos", "- " + fmt(totalDescuentos)]);
    filas.push(["Sueldo neto", fmt(neto)]);

    desglose.innerHTML = filas
      .map(function (f) { return "<div><span>" + f[0] + "</span><span>" + f[1] + "</span></div>"; })
      .join("");

    resultado.classList.remove("hidden");
    btnCopiar.classList.remove("hidden");

    ultimoTexto =
      "Sueldo bruto: " + fmt(bruto) +
      " — Descuentos: " + fmt(totalDescuentos) +
      " — Sueldo neto estimado: " + fmt(neto) +
      ". Calculado en tuscuentas.com.ar";
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calcular(); });
  inputBruto.addEventListener("input", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  checkSindicato.addEventListener("change", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  btnCopiar.addEventListener("click", function () { if (ultimoTexto) window.copyText(ultimoTexto, btnCopiar); });
})();
