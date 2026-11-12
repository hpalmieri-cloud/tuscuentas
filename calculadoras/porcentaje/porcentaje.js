// Calculadora de porcentajes — tres modos.
(function () {
  "use strict";

  var form = document.getElementById("form-porcentaje");
  if (!form) return;

  var $ = function (id) { return document.getElementById(id); };

  var selectModo = $("modo");
  var grupos = {
    de: $("grupo-de"),
    que: $("grupo-que"),
    variacion: $("grupo-variacion"),
  };

  var inputPorcentaje = $("porcentaje");
  var inputNumero = $("numero");
  var inputParte = $("parte");
  var inputTotal = $("total");
  var inputDesde = $("desde");
  var inputHasta = $("hasta");

  var resultado = $("resultado");
  var label = $("resultado-label");
  var montoEl = $("resultado-monto");
  var desglose = $("desglose");
  var error = $("error");
  var btnCopiar = $("copiar");
  var ultimoTexto = "";

  function fmtNum(n) {
    return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(n);
  }

  function cambiarModo() {
    var modo = selectModo.value;
    Object.keys(grupos).forEach(function (k) {
      grupos[k].classList.toggle("hidden", k !== modo);
    });
    error.classList.add("hidden");
    resultado.classList.add("hidden");
    btnCopiar.classList.add("hidden");
  }

  function calcular() {
    error.textContent = "";
    error.classList.add("hidden");

    var modo = selectModo.value;
    var principal, filas, texto;

    if (modo === "de") {
      var p = parseFloat(inputPorcentaje.value);
      var n = parseFloat(inputNumero.value);
      if (!isFinite(p) || !isFinite(n)) return fallo("Completá el porcentaje y el número.");
      var res = (n * p) / 100;
      principal = fmtNum(res);
      label.textContent = p + "% de " + fmtNum(n) + " es";
      filas = [["Cálculo", fmtNum(n) + " × " + p + " ÷ 100"]];
      texto = p + "% de " + fmtNum(n) + " = " + fmtNum(res);
    } else if (modo === "que") {
      var parte = parseFloat(inputParte.value);
      var total = parseFloat(inputTotal.value);
      if (!isFinite(parte) || !isFinite(total)) return fallo("Completá la parte y el total.");
      if (total === 0) return fallo("El total no puede ser cero.");
      var pct = (parte / total) * 100;
      principal = fmtNum(pct) + "%";
      label.textContent = fmtNum(parte) + " sobre " + fmtNum(total) + " es";
      filas = [["Fórmula", fmtNum(parte) + " ÷ " + fmtNum(total) + " × 100"]];
      texto = fmtNum(parte) + " es el " + fmtNum(pct) + "% de " + fmtNum(total);
    } else {
      var a = parseFloat(inputDesde.value);
      var b = parseFloat(inputHasta.value);
      if (!isFinite(a) || !isFinite(b)) return fallo("Completá el valor inicial y el final.");
      if (a === 0) return fallo("El valor inicial no puede ser cero.");
      var variacion = ((b - a) / Math.abs(a)) * 100;
      var signo = variacion > 0 ? "+" : "";
      principal = signo + fmtNum(variacion) + "%";
      label.textContent = "Variación de " + fmtNum(a) + " a " + fmtNum(b);
      filas = [["Diferencia", fmtNum(b - a)]];
      texto = "Variación de " + fmtNum(a) + " a " + fmtNum(b) + ": " + signo + fmtNum(variacion) + "%";
    }

    montoEl.textContent = principal;
    desglose.innerHTML = filas
      .map(function (f) { return "<div><span>" + f[0] + "</span><span>" + f[1] + "</span></div>"; })
      .join("");

    resultado.classList.remove("hidden");
    btnCopiar.classList.remove("hidden");
    ultimoTexto = texto + ". Calculado en tuscuentas.com.ar";
  }

  function fallo(msg) {
    error.textContent = msg;
    error.classList.remove("hidden");
    resultado.classList.add("hidden");
    btnCopiar.classList.add("hidden");
  }

  selectModo.addEventListener("change", cambiarModo);
  form.addEventListener("submit", function (e) { e.preventDefault(); calcular(); });
  [inputPorcentaje, inputNumero, inputParte, inputTotal, inputDesde, inputHasta].forEach(function (el) {
    el.addEventListener("input", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  });
  btnCopiar.addEventListener("click", function () { if (ultimoTexto) window.copyText(ultimoTexto, btnCopiar); });

  cambiarModo();
})();
