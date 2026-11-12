// Calculadora de monotributo — Argentina.
// Tabla oficial ARCA vigente desde el 1/8/2026.
(function () {
  "use strict";

  var form = document.getElementById("form-monotributo");
  if (!form) return;

  var $ = function (id) { return document.getElementById(id); };
  var fmt = window.formatARS;

  var CATS = [
    { cat: "A", max: 12009410.45, impServ: 5585.77,  impBienes: 5585.77,  sipa: 18246.86, os: 25694.55 },
    { cat: "B", max: 17595182.74, impServ: 10612.98, impBienes: 10612.98, sipa: 20071.55, os: 25694.55 },
    { cat: "C", max: 24670494.31, impServ: 18246.86, impBienes: 16757.32, sipa: 22078.71, os: 25694.55 },
    { cat: "D", max: 30628651.43, impServ: 29790.79, impBienes: 27742.67, sipa: 24286.58, os: 30535.56 },
    { cat: "E", max: 36028231.33, impServ: 55857.73, impBienes: 44313.79, sipa: 26715.24, os: 37238.48 },
    { cat: "F", max: 45151659.41, impServ: 78573.20, impBienes: 57719.64, sipa: 29386.76, os: 42824.25 },
    { cat: "G", max: 53995798.87, impServ: 142995.76, impBienes: 71497.87, sipa: 41141.46, os: 46175.72 },
    { cat: "H", max: 81924660.37, impServ: 409623.31, impBienes: 204811.64, sipa: 57598.04, os: 55485.33 },
    { cat: "I", max: 91699761.90, impServ: 814591.79, impBienes: 325836.71, sipa: 80637.26, os: 68518.81 },
    { cat: "J", max: 105012519.20, impServ: 977510.14, impBienes: 391004.07, sipa: 112892.16, os: 76897.46 },
    { cat: "K", max: 126610838.75, impServ: 1368514.20, impBienes: 456171.40, sipa: 158049.02, os: 87882.82 }
  ];

  var inputFacturacion = $("facturacion");
  var selectActividad = $("actividad");
  var checkJubilado = $("jubilado");

  var resultado = $("resultado");
  var label = $("resultado-label");
  var montoEl = $("resultado-monto");
  var desglose = $("desglose");
  var error = $("error");
  var btnCopiar = $("copiar");
  var ultimoTexto = "";

  function calcular() {
    error.textContent = "";
    error.classList.add("hidden");

    var facturacion = parseFloat(inputFacturacion.value);
    if (!isFinite(facturacion) || facturacion < 0) {
      return fallo("Ingresá tu facturación anual estimada.");
    }

    var esServicios = selectActividad.value === "servicios";
    var cat = null;
    for (var i = 0; i < CATS.length; i++) {
      if (facturacion <= CATS[i].max) { cat = CATS[i]; break; }
    }

    if (!cat) {
      label.textContent = "Fuera del monotributo";
      montoEl.textContent = "—";
      desglose.innerHTML = "";
      resultado.classList.remove("hidden");
      btnCopiar.classList.add("hidden");
      ultimoTexto = "";
      error.textContent = "Superás el límite de la categoría K. Corresponde evaluar el régimen general.";
      error.classList.remove("hidden");
      return;
    }

    var impuesto = esServicios ? cat.impServ : cat.impBienes;
    var obraSocial = checkJubilado.checked ? 0 : cat.os;
    var total = impuesto + cat.sipa + obraSocial;

    label.textContent = "Categoría " + cat.cat + " (" + (esServicios ? "servicios" : "venta de bienes") + ")";
    montoEl.textContent = fmt(total);

    var filas = [
      ["Facturación anual", fmt(facturacion)],
      ["Límite de la categoría", fmt(cat.max)],
      ["Impuesto integrado", fmt(impuesto)],
      ["Aportes al SIPA", fmt(cat.sipa)],
      ["Obra social", checkJubilado.checked ? "Exento" : fmt(obraSocial)],
      ["Cuota mensual", fmt(total)],
      ["Cuota anual", fmt(total * 12)]
    ];

    var idx = CATS.indexOf(cat);
    if (idx < CATS.length - 1) {
      filas.push(["Margen hasta la próxima categoría", fmt(CATS[idx].max - facturacion)]);
    }

    desglose.innerHTML = filas
      .map(function (f) { return "<div><span>" + f[0] + "</span><span>" + f[1] + "</span></div>"; })
      .join("");

    resultado.classList.remove("hidden");
    btnCopiar.classList.remove("hidden");

    ultimoTexto =
      "Monotributo categoría " + cat.cat + " — cuota mensual " + fmt(total) +
      " (" + (esServicios ? "servicios" : "venta de bienes") + "). Calculado en tuscuentas.com.ar";
  }

  function fallo(msg) {
    error.textContent = msg;
    error.classList.remove("hidden");
    resultado.classList.add("hidden");
    btnCopiar.classList.add("hidden");
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calcular(); });
  [inputFacturacion].forEach(function (el) {
    el.addEventListener("input", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  });
  selectActividad.addEventListener("change", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  checkJubilado.addEventListener("change", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  btnCopiar.addEventListener("click", function () { if (ultimoTexto) window.copyText(ultimoTexto, btnCopiar); });
})();
