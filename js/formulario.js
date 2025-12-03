document.addEventListener("DOMContentLoaded", () => {
  // Helpers cortos para acceder a elementos/valores
  const $ = (id) => document.getElementById(id);
  const valueOf = (id) => ($(id)?.value ?? "").trim();

  // Elementos base
  const form = $("formulario");
  const resultado = $("resultado");
  const botonEnviar = $("botonEnviar");
  const nuevoRegistro = $("nuevoRegistro");
  const fechaConsultaInput = $("Fecha_consulta");
  const btnHoyFecha = $("btnHoyFecha");
  const cantMedInput = $("Cantidad_medicamentos");
  const polifInput = $("Polifarmacia");

  const pesoInput = $("Peso");
  const tallaInput = $("Talla");
  const imcInput = $("IMC");

  const selectTratamientoDiabetes = $("Tratamiento_diabetes");
  const bloqueTipoTratamiento = $("bloque_tipo_tratamiento_diabetes");

  const selectDiagnosticoDiabetes = $("Diagnostico_diabetes");
  const bloqueTratamientoDiabetes = $("bloque_tratamiento_diabetes");
  const bloqueHbA1c = $("bloque_hba1c");

  const selectFuma = $("Fuma_actualmente");
  const bloqueTabacoExtra = $("bloque_tabaco_extra");
  const selectFrecuenciaAlcohol = $("Frecuencia_alcohol");
  const bloqueAlcoholExtra = $("bloque_alcohol_extra");

  const selectDiagnosticoHTA = document.getElementById("Diagnostico_HTA");
  const bloqueHTAExtra = document.getElementById("bloque_hta_extra");

  // ==================== Conductas: Alcohol ====================
  function actualizarVisibilidadAlcohol() {
    const valor = valueOf("Frecuencia_alcohol");

    // Ocultar si NO eligió nada o eligió "Nunca" (1)
    if (valor === "" || valor === "1") {
      if (bloqueAlcoholExtra) bloqueAlcoholExtra.style.display = "none";
      if ($("Cantidad_alcohol")) $("Cantidad_alcohol").value = "";
      if ($("Exceso_ocasion")) $("Exceso_ocasion").value = "";
    } else {
      if (bloqueAlcoholExtra) bloqueAlcoholExtra.style.display = "block";
    }
  }

  if (selectFrecuenciaAlcohol) {
    selectFrecuenciaAlcohol.addEventListener("change", actualizarVisibilidadAlcohol);
    actualizarVisibilidadAlcohol();
  }

  // ==================== Conductas: Tabaco ====================
  function actualizarVisibilidadTabaco() {
    const v = valueOf("Fuma_actualmente");

    if (v === "1") {
      // Sí fuma → mostramos todo
      if (bloqueTabacoExtra) bloqueTabacoExtra.style.display = "block";
    } else {
      // No fuma → ocultamos y reseteamos campos
      if (bloqueTabacoExtra) bloqueTabacoExtra.style.display = "none";

      if ($("Fuma_producto")) $("Fuma_producto").value = "";
      if ($("Frecuencia_fumador")) $("Frecuencia_fumador").value = "";
      if ($("Edad_inicio_tabaco")) $("Edad_inicio_tabaco").value = "";
      if ($("Intento_dejar_tabaco")) $("Intento_dejar_tabaco").value = "";
    }
  }

  if (selectFuma) {
    selectFuma.addEventListener("change", actualizarVisibilidadTabaco);
    actualizarVisibilidadTabaco();
  }

  // ==================== Diabetes: tipo de tratamiento ====================
  function actualizarVisibilidadTipoTratamiento() {
    const valor = valueOf("Tratamiento_diabetes");

    if (valor === "1") {
      // Sí recibe tratamiento → mostrar los checkboxes
      if (bloqueTipoTratamiento) bloqueTipoTratamiento.style.display = "block";
    } else {
      // No recibe tratamiento → ocultar y resetear
      if (bloqueTipoTratamiento) bloqueTipoTratamiento.style.display = "none";

      const chkIds = ["Tto_diab_dieta", "Tto_diab_ADO", "Tto_diab_insulina", "Tto_diab_otro"];
      chkIds.forEach((id) => {
        const chk = $(id);
        if (chk) chk.checked = false;
      });
    }
  }

  function actualizarVisibilidadDiabetes() {
    const diag = valueOf("Diagnostico_diabetes");

    if (diag === "1") {
      // Tiene diagnóstico
      if (bloqueTratamientoDiabetes) bloqueTratamientoDiabetes.style.display = "block";
      if (bloqueHbA1c) bloqueHbA1c.style.display = "block";
    } else {
      // No tiene diagnóstico → ocultamos todo lo relacionado
      if (bloqueTratamientoDiabetes) bloqueTratamientoDiabetes.style.display = "none";
      if (bloqueHbA1c) bloqueHbA1c.style.display = "none";

      if (selectTratamientoDiabetes) selectTratamientoDiabetes.value = "";
      if ($("Hemoglobina_glicosilada")) $("Hemoglobina_glicosilada").value = "";

      // Y también ocultamos tipos de tratamiento
      if (bloqueTipoTratamiento) bloqueTipoTratamiento.style.display = "none";
      const chkIds = ["Tto_diab_dieta", "Tto_diab_ADO", "Tto_diab_insulina", "Tto_diab_otro"];
      chkIds.forEach((id) => {
        const chk = $(id);
        if (chk) chk.checked = false;
      });
    }

    // Actualiza también la dependencia interna
    actualizarVisibilidadTipoTratamiento();
  }

  if (selectTratamientoDiabetes) {
    selectTratamientoDiabetes.addEventListener("change", actualizarVisibilidadTipoTratamiento);
  }
  if (selectDiagnosticoDiabetes) {
    selectDiagnosticoDiabetes.addEventListener("change", actualizarVisibilidadDiabetes);
  }

  // Estado inicial coherente
  actualizarVisibilidadTipoTratamiento();
  actualizarVisibilidadDiabetes();

  // ==================== Conductas: Hipertension arterial ====================
  function actualizarVisibilidadHTA() {
  const diagHTA = document.getElementById("Diagnostico_HTA")?.value ?? "";
  const bloque = document.getElementById("bloque_hta_extra");

    if (!bloque) return;

    if (diagHTA === "1") {
      bloque.style.display = "block";
    } else {
      bloque.style.display = "none";

      document.getElementById("Tratamiento_HTA").value = "";
      document.getElementById("Adherencia_tratamiento_HTA").value = "";

      // Además, ocultamos y reseteamos tipos de tratamiento HTA
      actualizarVisibilidadTipoTratamientoHTA();
    }
  }
  
  actualizarVisibilidadHTA();

  function actualizarVisibilidadTipoTratamientoHTA() {
  const tratamientoHTA = document.getElementById("Tratamiento_HTA")?.value ?? "";
  const bloqueTipoHTA = document.getElementById("bloque_tipo_tratamiento_hta");

    if (!bloqueTipoHTA) return;

    if (tratamientoHTA === "1") {
      // Sí recibe tratamiento → mostrar checkboxes
      bloqueTipoHTA.style.display = "block";
    } else {
      // No / No sabe / vacío → ocultar y resetear todo
      bloqueTipoHTA.style.display = "none";

      const ids = [
        "Tto_hta_IECA",
        "Tto_hta_ARAII",
        "Tto_hta_BB",
        "Tto_hta_diureticos",
        "Tto_hta_otros"
      ];
      ids.forEach((id) => {
        const chk = document.getElementById(id);
        if (chk) chk.checked = false;
      });
    }
  }

  document.getElementById("Diagnostico_HTA")
    ?.addEventListener("change", actualizarVisibilidadHTA);

  document.getElementById("Tratamiento_HTA")
    ?.addEventListener("change", actualizarVisibilidadTipoTratamientoHTA);

  actualizarVisibilidadHTA();
  actualizarVisibilidadTipoTratamientoHTA();
  // ==================== IMC ====================
  function actualizarIMC() {
    const peso = parseFloat(valueOf("Peso"));
    const tallaCm = parseFloat(valueOf("Talla"));

    if (!isNaN(peso) && peso > 0 && !isNaN(tallaCm) && tallaCm > 0) {
      const tallaM = tallaCm / 100;
      const imc = peso / (tallaM * tallaM);
      if (imcInput) imcInput.value = imc.toFixed(2);
    } else {
      if (imcInput) imcInput.value = "";
    }
  }

  if (pesoInput && tallaInput && imcInput) {
    pesoInput.addEventListener("input", actualizarIMC);
    tallaInput.addEventListener("input", actualizarIMC);
  }

  // ==================== Fecha "Hoy" ====================
  if (btnHoyFecha && fechaConsultaInput) {
    btnHoyFecha.addEventListener("click", () => {
      const hoy = new Date();
      const yyyy = hoy.getFullYear();
      const mm = String(hoy.getMonth() + 1).padStart(2, "0");
      const dd = String(hoy.getDate()).padStart(2, "0");
      fechaConsultaInput.value = `${yyyy}-${mm}-${dd}`;
    });
  }

  // ==================== Submit del formulario ====================
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // ---- Validación edad inicio tabaco (máx. 2 dígitos) ----
      const fumaValor = valueOf("Fuma_actualmente");
      const edadInicioVal = valueOf("Edad_inicio_tabaco");

      if (fumaValor === "1" && edadInicioVal !== "") {
        const n = Number(edadInicioVal);
        if (!Number.isInteger(n) || n < 0 || n > 99) {
          alert("La edad en que comenzó a fumar debe ser un número entre 0 y 99.");
          $("Edad_inicio_tabaco")?.focus();
          return;
        }
      }

      // ---- Validación edad (0–150) ----
      const edadValor = valueOf("Edad");
      if (edadValor !== "") {
        const edadNum = Number(edadValor);
        if (!Number.isInteger(edadNum) || edadNum < 0 || edadNum > 150) {
          alert("Por favor, revise la edad ingresada.");
          $("Edad")?.focus();
          return;
        }
      }

      // Aseguramos que el IMC esté actualizado antes de enviar
      if (pesoInput && tallaInput && imcInput) {
        actualizarIMC();
      }

      // ✅ Tratamiento por DIABETES: variables con 1=Sí, 2=No, null=No aplica
      const diagDiabetes = valueOf("Diagnostico_diabetes");
      const rawTratamientoDiabetes = valueOf("Tratamiento_diabetes");

      const chkTtoDieta    = document.getElementById("Tto_diab_dieta");
      const chkTtoADO      = document.getElementById("Tto_diab_ADO");
      const chkTtoInsulina = document.getElementById("Tto_diab_insulina");
      const chkTtoOtro     = document.getElementById("Tto_diab_otro");

      // Valor a enviar en la variable Tratamiento_diabetes
      let Tratamiento_diabetes_env;

      // Variables por tipo de tratamiento
      let ttoDieta;
      let ttoADO;
      let ttoInsulina;
      let ttoOtro;

      if (diagDiabetes !== "1") {
        // No tiene diagnóstico de diabetes → esta pregunta no corresponde
        Tratamiento_diabetes_env = "null";
        ttoDieta    = "null";
        ttoADO      = "null";
        ttoInsulina = "null";
        ttoOtro     = "null";
      } else {
        // Tiene diagnóstico de diabetes
        if (rawTratamientoDiabetes === "1") {
          // Recibe tratamiento
          Tratamiento_diabetes_env = "1";

          // Cada tipo: 1=Sí si está tildado, 2=No si no lo está
          ttoDieta    = chkTtoDieta    && chkTtoDieta.checked    ? "1" : "2";
          ttoADO      = chkTtoADO      && chkTtoADO.checked      ? "1" : "2";
          ttoInsulina = chkTtoInsulina && chkTtoInsulina.checked ? "1" : "2";
          ttoOtro     = chkTtoOtro     && chkTtoOtro.checked     ? "1" : "2";

          // (Opcional) exigir al menos un "Sí":
          if (
            ttoDieta === "2" &&
            ttoADO === "2" &&
            ttoInsulina === "2" &&
            ttoOtro === "2"
          ) {
            alert("Por favor, seleccione al menos un tipo de tratamiento para la diabetes.");
            document.getElementById("Tipo_tratamiento_diabetes_group")
              ?.scrollIntoView({ behavior: "smooth" });
            return;
          }
        } else if (rawTratamientoDiabetes === "2") {
          // Tiene diagnóstico pero NO recibe tratamiento
          Tratamiento_diabetes_env = "2";

          // Todos los tipos = No (2)
          ttoDieta    = "2";
          ttoADO      = "2";
          ttoInsulina = "2";
          ttoOtro     = "2";
        } else {
          // Tiene diagnóstico, pero no respondió si recibe tratamiento
          Tratamiento_diabetes_env = "null";
          ttoDieta    = "null";
          ttoADO      = "null";
          ttoInsulina = "null";
          ttoOtro     = "null";
        }
      }

      // ✅ Tratamiento por HTA: 1=Sí, 2=No, null=No aplica
      const diagHTA = valueOf("Diagnostico_HTA");
      const rawTratamientoHTA = valueOf("Tratamiento_HTA");

      const chkHTA_IECA       = document.getElementById("Tto_hta_IECA");
      const chkHTA_ARAII      = document.getElementById("Tto_hta_ARAII");
      const chkHTA_BB         = document.getElementById("Tto_hta_BB");
      const chkHTA_diureticos = document.getElementById("Tto_hta_diureticos");
      const chkHTA_otros      = document.getElementById("Tto_hta_otros");

      // Valor a enviar en la variable Tratamiento_HTA
      let Tratamiento_HTA_env;

      // Variables por tipo
      let ttoHTA_IECA;
      let ttoHTA_ARAII;
      let ttoHTA_BB;
      let ttoHTA_diureticos;
      let ttoHTA_otros;

      if (diagHTA !== "1") {
        // No tiene diagnóstico de HTA → esta pregunta no corresponde
        Tratamiento_HTA_env = "null";
        ttoHTA_IECA       = "null";
        ttoHTA_ARAII      = "null";
        ttoHTA_BB         = "null";
        ttoHTA_diureticos = "null";
        ttoHTA_otros      = "null";
      } else {
        // Tiene diagnóstico de HTA
        if (rawTratamientoHTA === "1") {
          // Recibe tratamiento
          Tratamiento_HTA_env = "1";

          ttoHTA_IECA       = chkHTA_IECA       && chkHTA_IECA.checked       ? "1" : "2";
          ttoHTA_ARAII      = chkHTA_ARAII      && chkHTA_ARAII.checked      ? "1" : "2";
          ttoHTA_BB         = chkHTA_BB         && chkHTA_BB.checked         ? "1" : "2";
          ttoHTA_diureticos = chkHTA_diureticos && chkHTA_diureticos.checked ? "1" : "2";
          ttoHTA_otros      = chkHTA_otros      && chkHTA_otros.checked      ? "1" : "2";

          // (Opcional) exigir al menos un "Sí":
          if (
            ttoHTA_IECA       === "2" &&
            ttoHTA_ARAII      === "2" &&
            ttoHTA_BB         === "2" &&
            ttoHTA_diureticos === "2" &&
            ttoHTA_otros      === "2"
          ) {
            alert("Por favor, seleccione al menos un tipo de tratamiento para la hipertensión.");
            document.getElementById("Tipo_tratamiento_hta_group")
              ?.scrollIntoView({ behavior: "smooth" });
            return;
          }
        } else if (rawTratamientoHTA === "2") {
          // Tiene diagnóstico pero NO recibe tratamiento
          Tratamiento_HTA_env = "2";

          // Todos los tipos = No (2)
          ttoHTA_IECA       = "2";
          ttoHTA_ARAII      = "2";
          ttoHTA_BB         = "2";
          ttoHTA_diureticos = "2";
          ttoHTA_otros      = "2";
        } else {
          // Tiene diagnóstico, pero no respondió si recibe tratamiento
          Tratamiento_HTA_env = "null";
          ttoHTA_IECA       = "null";
          ttoHTA_ARAII      = "null";
          ttoHTA_BB         = "null";
          ttoHTA_diureticos = "null";
          ttoHTA_otros      = "null";
        }
      }

      // ---- Calcular Polifarmacia según Cantidad_medicamentos ----
      // Codificación: 1 = Sí (≥5 meds), 2 = No (<5), "" si no se completó
      let polifarmaciaValor = "";
      const cantMedValor = cantMedInput ? cantMedInput.value.trim() : "";

      if (cantMedValor !== "") {
        const cantNum = Number(cantMedValor);
        if (!Number.isNaN(cantNum) && cantNum >= 0) {
          polifarmaciaValor = cantNum >= 5 ? "1" : "2";
        }
      }

      if (polifInput) {
        polifInput.value = polifarmaciaValor; // por si querés inspeccionar desde el DOM
      }

      // ---- Armar el objeto de datos para enviar ----
      const data = {
        // Identificación
        ID_paciente: valueOf("ID_paciente"),
        Fecha_consulta: valueOf("Fecha_consulta"),

        // Vivienda
        Agua_potable: valueOf("Agua_potable"),
        Cloaca: valueOf("Cloaca"),

        // Sociodemográficos
        Edad: valueOf("Edad"),
        Sexo_registrado: valueOf("Sexo_registrado"),
        Estado_civil: valueOf("Estado_civil"),
        Nivel_educativo: valueOf("Nivel_educativo"),
        Cobertura_salud: valueOf("Cobertura_salud"),
        Situacion_laboral: valueOf("Situacion_laboral"),

        // Conductas: Tabaquismo
        Fuma_actualmente: valueOf("Fuma_actualmente"),
        Fuma_producto: valueOf("Fuma_producto"),
        Frecuencia_fumador: valueOf("Frecuencia_fumador"),
        Edad_inicio_tabaco: valueOf("Edad_inicio_tabaco"),
        Intento_dejar_tabaco: valueOf("Intento_dejar_tabaco"),

        // Conductas: Alcohol
        Frecuencia_alcohol: valueOf("Frecuencia_alcohol"),
        Cantidad_alcohol: valueOf("Cantidad_alcohol"),
        Exceso_ocasion: valueOf("Exceso_ocasion"),

        // Conductas: Actividad física
        Actividad150min: valueOf("Actividad150min"),
        Motivo_actividad: valueOf("Motivo_actividad"),

        // Biomédico
        Diagnostico_diabetes: valueOf("Diagnostico_diabetes"),
        Tratamiento_diabetes: Tratamiento_diabetes_env,
        Tto_diab_dieta: ttoDieta,
        Tto_diab_ADO: ttoADO,
        Tto_diab_insulina: ttoInsulina,
        Tto_diab_otro: ttoOtro,
        Hemoglobina_glicosilada: valueOf("Hemoglobina_glicosilada"),
        Diagnostico_dislipidemia: valueOf("Diagnostico_dislipidemia"),
        Colesterol_total: valueOf("Colesterol_total"),
        HDL: valueOf("HDL"),
        LDL: valueOf("LDL"),
        Trigliceridos: valueOf("Trigliceridos"),
        Diagnostico_HTA: valueOf("Diagnostico_HTA"),
        Tratamiento_HTA: Tratamiento_HTA_env,
        Tto_hta_IECA: ttoHTA_IECA,
        Tto_hta_ARAII: ttoHTA_ARAII,
        Tto_hta_BB: ttoHTA_BB,
        Tto_hta_diureticos: ttoHTA_diureticos,
        Tto_hta_otros: ttoHTA_otros,
        Adherencia_tratamiento_HTA: valueOf("Adherencia_tratamiento_HTA"),
        TA_sistolica: valueOf("TA_sistolica"),
        TA_diastolica: valueOf("TA_diastolica"),
        Peso: valueOf("Peso"),
        Talla: valueOf("Talla"),
        IMC: valueOf("IMC"),

        // Salud mental
        PHQ2_item1: valueOf("PHQ2_item1"),
        PHQ2_item2: valueOf("PHQ2_item2"),
        GAD2_item1: valueOf("GAD2_item1"),
        GAD2_item2: valueOf("GAD2_item2"),

        // Salud general
        Transito: valueOf("Transito"),
        Cantidad_medicamentos: cantMedValor,
        Polifarmacia: polifarmaciaValor,

        // Prevención
        Vacunacion_dobleBacteriana: valueOf("Vacunacion_dobleBacteriana"),
        Vacunacion_antigripal: valueOf("Vacunacion_antigripal"),
        Vacunacion_neumococo: valueOf("Vacunacion_neumococo"),
        Mamografia: valueOf("Mamografia"),
        Papanicolau: valueOf("Papanicolau"),
        Cribado_colorrectal: valueOf("Cribado_colorrectal"),
      };

      // 🔄 Normalizar valores vacíos a "null"
      for (const key in data) {
        if (!Object.prototype.hasOwnProperty.call(data, key)) continue;

        const v = data[key];

        if (v === "" || v === null || typeof v === "undefined") {
          data[key] = "null";   // lo que va a ver Google Sheets
        }
      }

      // Feedback visual
      if (resultado) resultado.innerText = "Datos enviados correctamente.";
      if (botonEnviar) {
        botonEnviar.innerText = "¡Enviado!";
        botonEnviar.disabled = true;
      }
      if (nuevoRegistro) nuevoRegistro.style.display = "inline-block";

      // Envío al Apps Script (mismo endpoint que antes)
      fetch(
        "https://script.google.com/macros/s/AKfycbweYu7ufTNBY8VXoeLMnGEdkoIECAfwFloMPjhBd4mFb3rv3fPlmXnlE-hardbCtU1nAg/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
    });
  }

  // ==================== Nuevo registro (reset) ====================
  if (nuevoRegistro) {
    nuevoRegistro.addEventListener("click", () => {
      form?.reset();
      if (imcInput) imcInput.value = "";
      if (resultado) resultado.innerText = "";
      if (botonEnviar) {
        botonEnviar.disabled = false;
        botonEnviar.innerText = "Enviar";
      }
      nuevoRegistro.style.display = "none";

      // Volvemos a dejar consistentes los bloques condicionales
      actualizarVisibilidadTabaco();
      actualizarVisibilidadAlcohol();
      actualizarVisibilidadDiabetes();
      actualizarVisibilidadHTA();
      actualizarVisibilidadTipoTratamientoHTA();
    });
  }
});