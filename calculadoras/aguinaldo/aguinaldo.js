// Calculadora de aguinaldo (SAC) — Argentina.
// Fórmula: (mejor remuneración / 2) × (días trabajados / 180).
(function () {
  "use strict";

  var form = document.getElementById("form-aguinaldo");
  if (!form) return;

  var $ = function (id) { return document.getElementById(id); };
  var fmt = window.formatARS;

  var inputSueldo = $("mejor-sueldo");
  var selectSemestre = $("semestre");
  var selectSituacion = $("situacion");
  var inputDias = $("dias-trabajados");
  var checkCompleto = $("semestre-completo");
  var checkDescuentos = $("aplicar-descuentos");

  var resultado = $("resultado");
  var resultadoLabel = $("resultado-label");
  var resultadoMonto = $("resultado-monto");
  var desglose = $("desglose");
  var notaPago = $("nota-pago");
  var error = $("error");
  var btnCopiar = $("copiar");

  var ultimoTexto = "";

  function sincronizarDias() {
    inputDias.disabled = checkCompleto.checked;
    inputDias.style.opacity = checkCompleto.checked ? ".6" : "1";
  }

  function mostrarError(msg) {
    error.textContent = msg;
    error.classList.remove("hidden");
    resultado.classList.add("hidden");
    btnCopiar.classList.add("hidden");
  }

  function limpiarError() {
    error.textContent = "";
    error.classList.add("hidden");
  }

  function calcular() {
    limpiarError();

    var situacion = selectSituacion.value;
    var mejor = parseFloat(inputSueldo.value);

    if (situacion === "monotributista") {
      resultadoLabel.textContent = "No corresponde";
      resultadoMonto.textContent = "—";
      desglose.innerHTML = "";
      notaPago.textContent =
        "Los monotributistas no cobran aguinaldo. El SAC corresponde a trabajadores en relación de dependencia y a jubilados.";
      resultado.classList.remove("hidden");
      btnCopiar.classList.add("hidden");
      ultimoTexto = "";
      return;
    }

    if (!isFinite(mejor) || mejor <= 0) {
      mostrarError("Ingresá tu mejor sueldo bruto del semestre para calcular.");
      return;
    }

    var dias = checkCompleto.checked ? 180 : parseInt(inputDias.value, 10);
    if (!isFinite(dias) || dias < 1 || dias > 180) {
      mostrarError("Los días trabajados deben estar entre 1 y 180.");
      return;
    }

    var proporcion = dias / 180;
    var total = (mejor / 2) * proporcion;
    var descuentos = checkDescuentos.checked;
    var neto = total * (1 - 0.17);

    var semestre = selectSemestre.value;
    var etiquetaPeriodo = semestre === "1" ? "1º semestre (enero–junio)" : "2º semestre (julio–diciembre)";

    resultadoLabel.textContent =
      proporcion === 1 ? "Aguinaldo bruto estimado" : "Aguinaldo proporcional estimado";
    resultadoMonto.textContent = fmt(total);

    var filas = [];
    filas.push(["Mejor sueldo del semestre", fmt(mejor)]);
    filas.push(["Período", etiquetaPeriodo]);
    filas.push(["Proporción trabajada", Math.round(proporcion * 100) + "% (" + dias + "/180 días)"]);

    if (proporcion === 1) {
      filas.push(["1ª cuota (junio)", fmt(total / 2)]);
      filas.push(["2ª cuota (diciembre)", fmt(total / 2)]);
    } else {
      filas.push(["Días trabajados", dias + " de 180"]);
    }

    if (descuentos) {
      filas.push(["Estimado en mano (descuento 17%)", fmt(neto)]);
    }

    desglose.innerHTML = filas
      .map(function (f) {
        return "<div><span>" + f[0] + "</span><span>" + f[1] + "</span></div>";
      })
      .join("");

    notaPago.textContent =
      semestre === "1"
        ? "La primera cuota se abona hasta el 30 de junio."
        : "La segunda cuota se abona hasta el 18 de diciembre (Ley 27.073).";

    resultado.classList.remove("hidden");
    btnCopiar.classList.remove("hidden");

    ultimoTexto =
      "Aguinaldo " + (proporcion === 1 ? "estimado" : "proporcional") + ": " + fmt(total) +
      " — " + etiquetaPeriodo +
      (descuentos ? " — En mano aprox.: " + fmt(neto) : "") +
      ". Calculado en tuscuentas.com.ar";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calcular();
  });

  checkCompleto.addEventListener("change", function () {
    sincronizarDias();
    if (!resultado.classList.contains("hidden")) calcular();
  });

  inputSueldo.addEventListener("input", function () {
    if (!resultado.classList.contains("hidden")) calcular();
  });
  inputDias.addEventListener("input", function () {
    if (!resultado.classList.contains("hidden")) calcular();
  });
  selectSemestre.addEventListener("change", function () {
    if (!resultado.classList.contains("hidden")) calcular();
  });
  selectSituacion.addEventListener("change", function () {
    if (!resultado.classList.contains("hidden")) calcular();
  });
  checkDescuentos.addEventListener("change", function () {
    if (!resultado.classList.contains("hidden")) calcular();
  });

  btnCopiar.addEventListener("click", function () {
    if (ultimoTexto) window.copyText(ultimoTexto, btnCopiar);
  });

  sincronizarDias();
})();
