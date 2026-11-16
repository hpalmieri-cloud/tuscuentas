// Calculadora de jubilación — régimen general argentino (Ley 24.241).
(function () {
  "use strict";

  var form = document.getElementById("form-jubilacion");
  if (!form) return;

  var $ = function (id) { return document.getElementById(id); };
  var fmt = window.formatARS;

  // ---------------------------------------------------------------
  // Valores de referencia. ACTUALIZAR cuando cambien (son mensuales).
  // Vigentes a noviembre de 2026.
  // ---------------------------------------------------------------
  var PBU = 203182.22;      // Prestación Básica Universal
  var HABER_MINIMO = 444158.46;
  var HABER_MAXIMO = 2988765.82;

  var inputNacimiento = $("nacimiento");
  var selectSexo = $("sexo");
  var inputAportes = $("aportes");
  var inputPromedio = $("promedio");

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

  function pct(n) {
    return (Math.round(n * 10) / 10).toFixed(1).replace(/\.0$/, "").replace(".", ",");
  }

  // Art. 28: 1,5% por año de servicios, con tope de 35 años.
  function estimar(promedio, anios) {
    var computables = Math.min(anios, 35);
    var porcentaje = 1.5 * computables;
    var proporcional = promedio * porcentaje / 100;
    var bruto = PBU + proporcional;
    var haber = Math.min(Math.max(bruto, HABER_MINIMO), HABER_MAXIMO);
    return { computables: computables, porcentaje: porcentaje, proporcional: proporcional, bruto: bruto, haber: haber };
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

    var promedio = 0;
    if (inputPromedio && inputPromedio.value) {
      promedio = window.getMoneyValue(inputPromedio);
      if (!isFinite(promedio) || promedio < 0) return fallo("Revisá el promedio de sueldos: debe ser un monto positivo.");
    }

    var edadJub = selectSexo.value === "mujer" ? 60 : 65;
    var edad = calcularEdad(nacimiento, hoy);

    var fechaEdadJub = new Date(nacimiento.getFullYear() + edadJub, nacimiento.getMonth(), nacimiento.getDate());
    var mesesParaEdad = fechaEdadJub > hoy ? mesesHasta(hoy, fechaEdadJub) : 0;
    var aniosAportesFaltantes = Math.max(0, 30 - aportes);

    var cumpleEdad = fechaEdadJub <= hoy;
    var cumpleAportes = aniosAportesFaltantes === 0;

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

    var titulo, monto, proyeccion = null;

    if (promedio > 0 && cumpleAportes) {
      var e = estimar(promedio, aportes);

      titulo = "Haber mensual estimado";
      monto = fmt(e.haber);

      filas.push(["Prestación Básica Universal", fmt(PBU)]);
      filas.push([
        "Parte proporcional (" + pct(e.porcentaje) + "% de " + fmt(promedio) + ")",
        fmt(e.proporcional)
      ]);
      if (e.computables < aportes) {
        filas.push(["Años computados en el cálculo", "35 (tope legal)"]);
      }
      filas.push(["Subtotal", fmt(e.bruto)]);

      if (e.bruto < HABER_MINIMO) {
        filas.push(["Se completa al haber mínimo", fmt(HABER_MINIMO)]);
      } else if (e.bruto > HABER_MAXIMO) {
        filas.push(["Limitado al haber máximo", fmt(HABER_MAXIMO)]);
      } else {
        filas.push(["Ajuste por mínimo o máximo", "No corresponde"]);
      }

      filas.push(["Valores de referencia", "Noviembre de 2026"]);
    } else if (cumpleEdad && cumpleAportes) {
      titulo = "Cumplís los requisitos del régimen general";
      monto = "Sí";
    } else if (cumpleEdad && !cumpleAportes) {
      titulo = "Te faltan años de aportes";
      monto = aniosAportesFaltantes + (aniosAportesFaltantes === 1 ? " año" : " años");

      if (promedio > 0) {
        var proy = estimar(promedio, 30);
        proyeccion = fmt(proy.haber);
        filas.push(["Haber estimado al completar 30 años", proyeccion]);
        filas.push(["Cálculo orientativo con " + pct(proy.porcentaje) + "% de " + fmt(promedio), fmt(proy.proporcional) + " + PBU"]);
      }
    } else if (!cumpleEdad && cumpleAportes) {
      titulo = "Te falta edad";
      monto = textoDuracion(mesesParaEdad);
    } else {
      titulo = "Te faltan edad y aportes";
      monto = textoDuracion(mesesParaEdad);

      if (promedio > 0) {
        var proy2 = estimar(promedio, 30);
        proyeccion = fmt(proy2.haber);
        filas.push(["Haber estimado al completar 30 años", proyeccion]);
        filas.push(["Cálculo orientativo con " + pct(proy2.porcentaje) + "% de " + fmt(promedio), fmt(proy2.proporcional) + " + PBU"]);
      }
    }

    label.textContent = titulo;
    montoEl.textContent = monto;

    desglose.innerHTML = filas
      .map(function (f) { return "<div><span>" + f[0] + "</span><span>" + f[1] + "</span></div>"; })
      .join("");

    resultado.classList.remove("hidden");
    btnCopiar.classList.remove("hidden");

    ultimoTexto =
      "Jubilación: " + titulo + " — " + monto +
      (proyeccion ? " (con 30 años de aportes: " + proyeccion + ")" : "") +
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
  [inputNacimiento, inputAportes, inputPromedio].forEach(function (el) {
    if (!el) return;
    el.addEventListener("input", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  });
  selectSexo.addEventListener("change", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  btnCopiar.addEventListener("click", function () { if (ultimoTexto) window.copyText(ultimoTexto, btnCopiar); });
})();
