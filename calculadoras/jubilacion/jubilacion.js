// Calculadora de jubilación — régimen general argentino.
(function () {
  "use strict";

  var form = document.getElementById("form-jubilacion");
  if (!form) return;

  var $ = function (id) { return document.getElementById(id); };

  var inputNacimiento = $("nacimiento");
  var selectSexo = $("sexo");
  var inputAportes = $("aportes");

  var resultado = $("resultado");
  var label = $("resultado-label");
  var montoEl = $("resultado-monto");
  var desglose = $("desglose");
  var error = $("error");
  var btnCopiar = $("copiar");
  var ultimoTexto = "";

  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  function fechaLarga(d) {
    return MESES[d.getMonth()] + " de " + d.getFullYear();
  }

  function calcularEdad(nacimiento, hoy) {
    var anios = hoy.getFullYear() - nacimiento.getFullYear();
    var meses = hoy.getMonth() - nacimiento.getMonth();
    if (hoy.getDate() < nacimiento.getDate()) meses--;
    if (meses < 0) { anios--; meses += 12; }
    return { anios: anios, meses: meses };
  }

  function mesesHasta(desde, hasta) {
    var m = (hasta.getFullYear() - desde.getFullYear()) * 12 + (hasta.getMonth() - desde.getMonth());
    if (hasta.getDate() < desde.getDate()) m--;
    return Math.max(0, m);
  }

  function textoDuracion(totalMeses) {
    var a = Math.floor(totalMeses / 12);
    var m = totalMeses % 12;
    var partes = [];
    if (a > 0) partes.push(a + (a === 1 ? " año" : " años"));
    if (m > 0) partes.push(m + (m === 1 ? " mes" : " meses"));
    return partes.length ? partes.join(" y ") : "0 meses";
  }

  function calcular() {
    error.textContent = "";
    error.classList.add("hidden");

    if (!inputNacimiento.value) return fallo("Ingresá tu fecha de nacimiento.");

    var nacimiento = new Date(inputNacimiento.value + "T00:00:00");
    if (isNaN(nacimiento.getTime())) return fallo("La fecha de nacimiento no es válida.");

    var hoy = new Date();
    if (nacimiento > hoy) return fallo("La fecha de nacimiento no puede ser futura.");

    var aportes = parseFloat(inputAportes.value);
    if (!isFinite(aportes) || aportes < 0 || aportes > 50) return fallo("Los años de aportes deben estar entre 0 y 50.");

    var edadJub = selectSexo.value === "mujer" ? 60 : 65;
    var edad = calcularEdad(nacimiento, hoy);

    var fechaEdadJub = new Date(nacimiento.getFullYear() + edadJub, nacimiento.getMonth(), nacimiento.getDate());
    var mesesParaEdad = fechaEdadJub > hoy ? mesesHasta(hoy, fechaEdadJub) : 0;
    var aniosAportesFaltantes = Math.max(0, 30 - aportes);

    var cumpleEdad = fechaEdadJub <= hoy;
    var cumpleAportes = aniosAportesFaltantes === 0;

    var titulo, monto;
    if (cumpleEdad && cumpleAportes) {
      titulo = "Cumplís los requisitos del régimen general";
      monto = "Sí";
    } else if (cumpleEdad && !cumpleAportes) {
      titulo = "Te faltan años de aportes";
      monto = aniosAportesFaltantes + (aniosAportesFaltantes === 1 ? " año" : " años");
    } else if (!cumpleEdad && cumpleAportes) {
      titulo = "Te falta edad";
      monto = textoDuracion(mesesParaEdad);
    } else {
      titulo = "Te faltan edad y aportes";
      monto = textoDuracion(mesesParaEdad);
    }

    label.textContent = titulo;
    montoEl.textContent = monto;

    var filas = [
      ["Edad actual", edad.anios + " años" + (edad.meses ? " y " + edad.meses + " meses" : "")],
      ["Edad jubilatoria (régimen general)", edadJub + " años"],
      ["Fecha en que alcanzás esa edad", fechaLarga(fechaEdadJub)],
      ["Aportes computados", aportes + (aportes === 1 ? " año" : " años")],
      ["Aportes faltantes para 30 años", aniosAportesFaltantes + (aniosAportesFaltantes === 1 ? " año" : " años")]
    ];

    if (!cumpleEdad) {
      filas.push(["Tiempo hasta la edad jubilatoria", textoDuracion(mesesParaEdad)]);
    }

    desglose.innerHTML = filas
      .map(function (f) { return "<div><span>" + f[0] + "</span><span>" + f[1] + "</span></div>"; })
      .join("");

    resultado.classList.remove("hidden");
    btnCopiar.classList.remove("hidden");

    ultimoTexto =
      "Jubilación: " + titulo + " — " + monto +
      " (edad actual " + edad.anios + " años, aportes " + aportes +
      ", edad jubilatoria " + edadJub + "). Calculado en tuscuentas.com.ar";
  }

  function fallo(msg) {
    error.textContent = msg;
    error.classList.remove("hidden");
    resultado.classList.add("hidden");
    btnCopiar.classList.add("hidden");
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calcular(); });
  [inputNacimiento, inputAportes].forEach(function (el) {
    el.addEventListener("input", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  });
  selectSexo.addEventListener("change", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  btnCopiar.addEventListener("click", function () { if (ultimoTexto) window.copyText(ultimoTexto, btnCopiar); });
})();
