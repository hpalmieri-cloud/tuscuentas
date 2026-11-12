// Calculadora de IVA — Argentina.
(function () {
  "use strict";

  var form = document.getElementById("form-iva");
  if (!form) return;

  var $ = function (id) { return document.getElementById(id); };
  var fmt = window.formatARS;

  var inputMonto = $("monto");
  var selectAlicuota = $("alicuota");
  var campoOtra = $("campo-otra");
  var inputOtra = $("otra");
  var selectModo = $("modo");

  var resultado = $("resultado");
  var label = $("resultado-label");
  var montoEl = $("resultado-monto");
  var desglose = $("desglose");
  var error = $("error");
  var btnCopiar = $("copiar");
  var ultimoTexto = "";

  function obtenerTasa() {
    var v = selectAlicuota.value;
    return v === "otra" ? parseFloat(inputOtra.value) : parseFloat(v);
  }

  function calcular() {
    error.textContent = "";
    error.classList.add("hidden");

    var monto = parseFloat(inputMonto.value);
    var tasaPct = obtenerTasa();

    if (!isFinite(monto) || monto <= 0) return fallo("Ingresá un monto mayor a cero.");
    if (!isFinite(tasaPct) || tasaPct < 0 || tasaPct > 100) return fallo("La alícuota debe estar entre 0 y 100.");

    var tasa = tasaPct / 100;
    var neto, iva, total, etiqueta;

    if (selectModo.value === "incluye") {
      neto = monto / (1 + tasa);
      iva = monto - neto;
      total = monto;
      etiqueta = "Monto desglosado (ya incluye IVA)";
    } else {
      neto = monto;
      iva = monto * tasa;
      total = monto + iva;
      etiqueta = "Monto con IVA agregado";
    }

    label.textContent = etiqueta;
    montoEl.textContent = fmt(total);

    desglose.innerHTML = [
      ["Monto neto", fmt(neto)],
      ["IVA (" + tasaPct + "%)", fmt(iva)],
      ["Monto total", fmt(total)],
    ]
      .map(function (f) { return "<div><span>" + f[0] + "</span><span>" + f[1] + "</span></div>"; })
      .join("");

    resultado.classList.remove("hidden");
    btnCopiar.classList.remove("hidden");

    ultimoTexto =
      "IVA " + tasaPct + "%: neto " + fmt(neto) +
      " — IVA " + fmt(iva) +
      " — total " + fmt(total) +
      ". Calculado en calculaargentina.com";
  }

  function fallo(msg) {
    error.textContent = msg;
    error.classList.remove("hidden");
    resultado.classList.add("hidden");
    btnCopiar.classList.add("hidden");
  }

  selectAlicuota.addEventListener("change", function () {
    campoOtra.classList.toggle("hidden", selectAlicuota.value !== "otra");
    if (!resultado.classList.contains("hidden")) calcular();
  });

  form.addEventListener("submit", function (e) { e.preventDefault(); calcular(); });
  [inputMonto, inputOtra].forEach(function (el) {
    el.addEventListener("input", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  });
  selectModo.addEventListener("change", function () { if (!resultado.classList.contains("hidden")) calcular(); });
  btnCopiar.addEventListener("click", function () { if (ultimoTexto) window.copyText(ultimoTexto, btnCopiar); });
})();
