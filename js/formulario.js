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
  const selectTieneHbA1c = $("Tiene_hba1c");
  const bloqueValorHbA1c = $("bloque_valor_hba1c");
  const inputHbA1c = $("Hemoglobina_glicosilada");

  const selectFuma = $("Fuma_actualmente");
  // ===== Tabaquismo (nuevo flujo) =====
  const bloqueFumoPasado = $("bloque_fumo_pasado");
  const selectFumoPasado = $("Fumo_pasado");
  const bloqueDetalleFumoPasado = $("bloque_detalle_fumo_pasado");
  const inputAniosFumoPasado = $("Anios_fumo_pasado");
  const inputCigsDiaPasado = $("Cigarrillos_dia_pasado");

  const bloqueTabacoActual = $("bloque_tabaco_actual");

  // Checkboxes producto tabaco (actual)
  const chkTabacoFab = $("Tabaco_cig_fabricado");
  const chkTabacoArm = $("Tabaco_cig_armado");
  const chkTabacoCaps = $("Tabaco_capsula");
  const chkTabacoVapeo = $("Tabaco_vapeo");
  const chkTabacoCal = $("Tabaco_calentado");
  const chkTabacoBolsa = $("Tabaco_bolsa_nicotina");
  const chkTabacoOtro = $("Tabaco_otro");

  // Frecuencia + cigarrillos/día actual
  const selectFrecuenciaFumador = $("Frecuencia_fumador");
  const bloqueCigsDiaActual = $("bloque_cigarrillos_dia_actual");
  const inputCigsDiaActual = $("Cigarrillos_dia_actual");

  const selectFrecuenciaAlcohol = $("Frecuencia_alcohol");
  const bloqueAlcoholExtra = $("bloque_alcohol_extra");

  const selectDiagnosticoHTA = document.getElementById("Diagnostico_HTA");
  const bloqueHTAExtra = document.getElementById("bloque_hta_extra");
  const selectTratamientoHTA = document.getElementById("Tratamiento_HTA");

  // Dislipemia – Tratamiento colesterol
  const selectTratamientoColesterol = $("Tratamiento_colesterol");
  const bloqueTratamientoColesterol = $("bloque_tratamiento_colesterol");
  const chkColDietaEj = $("Tto_col_dieta_ejercicio");
  const chkColEstatinas = $("Tto_col_estatinas");

  // Actividad física (nuevo)
  const selectActividad150 = $("Actividad150min");
  const bloqueMotivoNoActividad = $("bloque_motivo_no_actividad");
  const selectMotivoNoActividad = $("Motivo_no_actividad");

  const btnCopiarNarrativo = $("btnCopiarNarrativo");

  function marcarCamposPendientes(form) {
    // Quitar marcas previas
    form.querySelectorAll(".campo-pendiente").forEach((el) => {
      el.classList.remove("campo-pendiente");
    });

    const pendientes = [];

    // Seleccionamos inputs y selects relevantes
    const elementos = form.querySelectorAll("input, select, textarea");

    elementos.forEach((el) => {
      const tipo = el.type;

      // Excluir cosas que NO son preguntas "contestables"
      if (
        tipo === "hidden" ||
        tipo === "button" ||
        tipo === "submit" ||
        tipo === "checkbox" ||   // los checkboxes los manejamos por lógica propia
        tipo === "radio"
      ) {
        return;
      }

      if (el.readOnly || el.disabled) return;          // Ej: IMC
      if (el.offsetParent === null) return;            // No visibles (bloques ocultos)

      const val = (el.value || "").trim();

      if (val === "") {
        el.classList.add("campo-pendiente");
        pendientes.push(el);
      }
    });

    return pendientes;
  }

  // Quitar la marca roja en cuanto el usuario complete el campo
  if (form) {
    const elementosInteractivos = form.querySelectorAll("input, select, textarea");

    elementosInteractivos.forEach((el) => {
      const tipo = el.type;

      // Igual que antes: excluimos lo que no es "contestable"
      if (
        tipo === "hidden" ||
        tipo === "button" ||
        tipo === "submit" ||
        tipo === "checkbox" ||   // los checkboxes van por otra lógica
        tipo === "radio"
      ) {
        return;
      }

      if (el.readOnly || el.disabled) return;

      const limpiarPendiente = () => {
        const val = (el.value || "").trim();

        // Si ahora tiene algún valor, le sacamos el rojo
        if (val !== "") {
          el.classList.remove("campo-pendiente");
        }
      };

      el.addEventListener("input", limpiarPendiente);
      el.addEventListener("change", limpiarPendiente);
    });
  }

  // ==================== Conductas: Alcohol ====================
  function actualizarVisibilidadAlcohol() {
    const valor = valueOf("Frecuencia_alcohol");

    // Ocultar si NO eligió nada o eligió "Nunca" (1)
    if (valor === "" || valor === "0") {
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

  // ==================== Conductas: Actividad física ====================
  function actualizarVisibilidadActividadFisica() {
    const v = valueOf("Actividad150min");

    if (v === "2") {
      // NO → mostrar motivo
      if (bloqueMotivoNoActividad) bloqueMotivoNoActividad.style.display = "block";
    } else {
      // SÍ o vacío → ocultar y limpiar motivo
      if (bloqueMotivoNoActividad) bloqueMotivoNoActividad.style.display = "none";
      if (selectMotivoNoActividad) selectMotivoNoActividad.value = "";
    }
  }

  if (selectActividad150) {
    selectActividad150.addEventListener("change", actualizarVisibilidadActividadFisica);
    actualizarVisibilidadActividadFisica(); // estado inicial coherente
  }

  // ==================== Conductas: Tabaco ====================
  function actualizarVisibilidadTabaco() {
    const fuma = valueOf("Fuma_actualmente");

    const ocultarActual = () => {
      if (bloqueTabacoActual) bloqueTabacoActual.style.display = "none";

      // Reset checkboxes
      [
        chkTabacoFab,
        chkTabacoArm,
        chkTabacoCaps,
        chkTabacoVapeo,
        chkTabacoCal,
        chkTabacoBolsa,
        chkTabacoOtro,
      ].forEach((chk) => {
        if (chk) chk.checked = false;
      });

      // Reset frecuencia y cigarrillos/día actual
      if (selectFrecuenciaFumador) selectFrecuenciaFumador.value = "";
      if (bloqueCigsDiaActual) bloqueCigsDiaActual.style.display = "none";
      if (inputCigsDiaActual) inputCigsDiaActual.value = "";

      // Reset otros campos del fumador actual (se mantienen IDs existentes)
      const edadInicio = $("Edad_inicio_tabaco");
      const intentoDejar = $("Intento_dejar_tabaco");
      if (edadInicio) edadInicio.value = "";
      if (intentoDejar) intentoDejar.value = "";
    };

    const ocultarPasado = () => {
      if (bloqueFumoPasado) bloqueFumoPasado.style.display = "none";
      if (selectFumoPasado) selectFumoPasado.value = "";
      if (bloqueDetalleFumoPasado) bloqueDetalleFumoPasado.style.display = "none";
      if (inputAniosFumoPasado) inputAniosFumoPasado.value = "";
      if (inputCigsDiaPasado) inputCigsDiaPasado.value = "";
    };

    if (fuma === "1") {
      // Sí fuma actualmente
      ocultarPasado();
      if (bloqueTabacoActual) bloqueTabacoActual.style.display = "block";

      // Ajustar visibilidad de cigarrillos/día según frecuencia
      actualizarVisibilidadCigarrillosDiaActual();

    } else if (fuma === "2") {
      // No fuma actualmente
      ocultarActual();
      if (bloqueFumoPasado) bloqueFumoPasado.style.display = "block";

      // Detalle pasado depende de "Fumo_pasado"
      actualizarVisibilidadFumoPasado();

    } else {
      // No respondió: ocultar todo
      ocultarActual();
      ocultarPasado();
    }
  }

  function actualizarVisibilidadCigarrillosDiaActual() {
    const freq = valueOf("Frecuencia_fumador");

    if (freq === "1") {
      // Diariamente
      if (bloqueCigsDiaActual) bloqueCigsDiaActual.style.display = "block";
    } else {
      // No diariamente / vacío
      if (bloqueCigsDiaActual) bloqueCigsDiaActual.style.display = "none";
      if (inputCigsDiaActual) inputCigsDiaActual.value = "";
    }
  }

  function actualizarVisibilidadFumoPasado() {
    const v = valueOf("Fumo_pasado");

    if (v === "1") {
      // Sí fumó en el pasado
      if (bloqueDetalleFumoPasado) bloqueDetalleFumoPasado.style.display = "block";
    } else {
      // No / vacío
      if (bloqueDetalleFumoPasado) bloqueDetalleFumoPasado.style.display = "none";
      if (inputAniosFumoPasado) inputAniosFumoPasado.value = "";
      if (inputCigsDiaPasado) inputCigsDiaPasado.value = "";
    }
  }

  if (selectFuma) {
    selectFuma.addEventListener("change", actualizarVisibilidadTabaco);
    actualizarVisibilidadTabaco();
  }
  if (selectFrecuenciaFumador) {
  selectFrecuenciaFumador.addEventListener("change", actualizarVisibilidadCigarrillosDiaActual);
  }
  if (selectFumoPasado) {
  selectFumoPasado.addEventListener("change", actualizarVisibilidadFumoPasado);
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

  function actualizarVisibilidadHbA1c() {
    const tiene = valueOf("Tiene_hba1c");

    if (tiene === "1") {
      // Sí → mostrar el campo de valor
      if (bloqueValorHbA1c) bloqueValorHbA1c.style.display = "block";
    } else {
      // No / vacío → ocultar y limpiar
      if (bloqueValorHbA1c) bloqueValorHbA1c.style.display = "none";
      if (inputHbA1c) inputHbA1c.value = "";
    }
  }
  
  function actualizarVisibilidadDiabetes() {
    const diag = valueOf("Diagnostico_diabetes");

    if (diag === "1") {
      // Tiene diagnóstico
      if (bloqueTratamientoDiabetes) bloqueTratamientoDiabetes.style.display = "block";
      if (bloqueHbA1c) bloqueHbA1c.style.display = "block";
      // 👇 NUEVO: muestra/oculta el campo del valor según "Tiene_hba1c"
      actualizarVisibilidadHbA1c();
    } else {
      // No tiene diagnóstico → ocultamos todo lo relacionado
      if (bloqueTratamientoDiabetes) bloqueTratamientoDiabetes.style.display = "none";
      if (bloqueHbA1c) bloqueHbA1c.style.display = "none";

      if (selectTratamientoDiabetes) selectTratamientoDiabetes.value = "";
      // 👇 NUEVO: resetear la pregunta "Tiene_hba1c" + ocultar valor + limpiar input
      if (selectTieneHbA1c) selectTieneHbA1c.value = "";
      if (bloqueValorHbA1c) bloqueValorHbA1c.style.display = "none";
      if (inputHbA1c) inputHbA1c.value = "";

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

  // ==================== Dislipemia: tratamiento colesterol ====================
  function actualizarVisibilidadTratamientoColesterol() {
    const v = valueOf("Tratamiento_colesterol");

    if (v === "1") {
      // Sí → mostrar checkboxes
      if (bloqueTratamientoColesterol) bloqueTratamientoColesterol.style.display = "block";
    } else {
      // No / vacío → ocultar y resetear
      if (bloqueTratamientoColesterol) bloqueTratamientoColesterol.style.display = "none";
      if (chkColDietaEj) chkColDietaEj.checked = false;
      if (chkColEstatinas) chkColEstatinas.checked = false;
    }
  }

  if (selectTratamientoDiabetes) {
    selectTratamientoDiabetes.addEventListener("change", actualizarVisibilidadTipoTratamiento);
  }
  if (selectDiagnosticoDiabetes) {
    selectDiagnosticoDiabetes.addEventListener("change", actualizarVisibilidadDiabetes);
  }
  if (selectTieneHbA1c) {
  selectTieneHbA1c.addEventListener("change", actualizarVisibilidadHbA1c);
  }
  if (selectTratamientoColesterol) {
  selectTratamientoColesterol.addEventListener("change", actualizarVisibilidadTratamientoColesterol);
  }

  // Estado inicial coherente
  actualizarVisibilidadTabaco();
  actualizarVisibilidadFumoPasado();
  actualizarVisibilidadCigarrillosDiaActual();
  actualizarVisibilidadTipoTratamiento();
  actualizarVisibilidadDiabetes();
  actualizarVisibilidadHbA1c();
  actualizarVisibilidadTratamientoColesterol();
  actualizarVisibilidadActividadFisica();

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

    // ==================== AUDIT-C: cálculo de puntaje ====================
  function calcularAuditCDesdeValores(freq, cant, binge) {
    // Si no respondió nada → no calculamos
    if (freq === "") return null;

    // Si responde "Nunca" (0) → score total = 0 aunque no vea las otras
    if (freq === "0") {
      return 0;
    }

    // Para puntuar necesitamos las tres respuestas
    if (cant === "" || binge === "") return null;

    const f = Number(freq);
    const c = Number(cant);
    const b = Number(binge);

    if (Number.isNaN(f) || Number.isNaN(c) || Number.isNaN(b)) return null;

    return f + c + b; // 0–12
  }

  // ==================== FUNCIÓN: Narrativo clínico ====================

  function generarNarrativo(data) {
    const mapOrNull = (value, map) => {
      if (!value || value === "null") return null;
      return map[value] || null;
    };

    const sexoMap = {
      "1": "varón",
      "2": "mujer",
      "3": "persona de género no binario",
      "4": "persona de sexo no especificado"
    };

    const estadoCivilMap = {
      "1": "soltero/a",
      "2": "en pareja",
      "3": "separado/a o divorciado/a",
      "4": "viudo/a"
    };

    const nivelEducativoMap = {
      "1": "sin instrucción formal",
      "2": "con primaria incompleta",
      "3": "con primaria completa",
      "4": "con secundaria incompleta",
      "5": "con secundaria completa",
      "6": "con estudios terciarios/universitarios incompletos",
      "7": "con estudios terciarios/universitarios completos"
    };

    const coberturaMap = {
      "1": "con cobertura de salud",
      "2": "sin cobertura de salud",
      "3": "que desconoce su situación de cobertura"
    };

    const situacionLaboralMap = {
      "1": "actualmente trabajando",
      "2": "sin trabajo pero en búsqueda activa",
      "3": "sin trabajo y sin búsqueda activa"
    };

        const frecuenciaAlcoholMap = {
      "0": "nunca",
      "1": "1 vez al mes o menos",
      "2": "2 a 4 veces al mes",
      "3": "2 a 3 veces por semana",
      "4": "4 o más veces por semana"
    };

    const cantidadAlcoholMap = {
      "0": "1 o 2 bebidas",
      "1": "3 o 4 bebidas",
      "2": "5 a 6 bebidas",
      "3": "7 a 9 bebidas",
      "4": "10 o más bebidas"
    };

    const excesoOcasionalMap = {
      "0": "nunca",
      "1": "menos de una vez al mes",
      "2": "mensualmente",
      "3": "semanalmente",
      "4": "a diario o casi a diario"
    };

    const phqGadFrecuenciaMap = {
      "0": "nunca",
      "1": "en varios días",
      "2": "en más de la mitad de los días",
      "3": "casi todos los días"
    };

    const transitoMap = {
      "1": "accidente de tránsito como conductor",
      "2": "accidente de tránsito como pasajero",
      "3": "accidente de tránsito como peatón",
      "4": "no haber estado involucrado en accidentes de tránsito"
    };

    const vacunaDobleBactMap = {
      "1": "haber recibido al menos una dosis de vacuna doble bacteriana en los últimos 10 años",
      "2": "no haber recibido vacuna doble bacteriana en los últimos 10 años",
      "3": "desconocer si recibió vacuna doble bacteriana en los últimos 10 años"
    };

    const vacunaAntigripalMap = {
      "1": "haber recibido la vacuna antigripal en la última campaña anual",
      "2": "no haber recibido la vacuna antigripal en la última campaña anual",
      "3": "desconocer si recibió la vacuna antigripal",
      "4": "refiere que no corresponde la vacuna antigripal"
    };

    const vacunaNeumococoMap = {
      "1": "haber recibido una dosis de vacuna contra neumococo",
      "2": "haber recibido dos dosis de vacuna contra neumococo",
      "3": "haber recibido dosis única según nuevo esquema de vacuna conjugada 20",
      "4": "no haber recibido vacuna contra neumococo",
      "5": "desconocer si recibió vacuna contra neumococo",
      "6": "refiere que no corresponde la vacunación contra neumococo"
    };

    const mamografiaMap = {
      "1": "haber realizado mamografía en los últimos 2 años",
      "2": "no haber realizado mamografía en los últimos 2 años",
      "3": "refiere que no corresponde la realización de mamografía"
    };

    const papanicolauMap = {
      "1": "haber realizado Papanicolaou (PAP) en los últimos 3 años",
      "2": "no haber realizado Papanicolaou (PAP) en los últimos 3 años",
      "3": "refiere que no corresponde la realización de Papanicolaou (PAP)"
    };

    const cribadoColorrectalMap = {
      "1": "haber realizado algún estudio de detección de cáncer colorrectal",
      "2": "no haber realizado estudios de detección de cáncer colorrectal",
      "3": "refiere que no corresponde el cribado de cáncer colorrectal"
    };

    // Sufijo de género para adjetivos (varón/mujer)
    let sufGenero = "";
    if (data.Sexo_registrado === "1") {
      // varón
      sufGenero = "o";
    } else if (data.Sexo_registrado === "2") {
      // mujer
      sufGenero = "a";
    } else {
      // no binario / no especificado → formulaciones neutras
      sufGenero = "";
    }

    // -------- Encabezado / Datos generales --------
    const sexoTxt = mapOrNull(data.Sexo_registrado, sexoMap);
    const edad = data.Edad && data.Edad !== "null" ? data.Edad : null;

    // Transformar 2025-12-04 → 04/12/2025
    let fecha = null;
    if (data.Fecha_consulta && data.Fecha_consulta !== "null") {
      const partes = data.Fecha_consulta.split("-"); // [YYYY, MM, DD]
      if (partes.length === 3) {
        const [yyyy, mm, dd] = partes;
        fecha = `${dd}/${mm}/${yyyy}`;
      }
    }

    let sujeto;
    switch (data.Sexo_registrado) {
      case "1":
        sujeto = "Paciente varón";
        break;
      case "2":
        sujeto = "Paciente mujer";
        break;
      case "3":
        sujeto = "Paciente de género no binario";
        break;
      case "4":
        sujeto = "Paciente de sexo no especificado";
        break;
      default:
        sujeto = "Paciente";
        break;
    }

    let p1 = sujeto;
    if (edad) p1 += ` de ${edad} años de edad`;
    if (fecha) {
      p1 += `, que consulta el día ${fecha}. `;
    } else {
      p1 += ". ";
    }

    const estadoCivilTxt = mapOrNull(data.Estado_civil, estadoCivilMap);
    const nivelEduTxt = mapOrNull(data.Nivel_educativo, nivelEducativoMap);
    const coberturaTxt = mapOrNull(data.Cobertura_salud, coberturaMap);
    const situacionLabTxt = mapOrNull(data.Situacion_laboral, situacionLaboralMap);

    const socioDetalles = [];
    if (estadoCivilTxt) socioDetalles.push(`se encuentra ${estadoCivilTxt}`);
    if (nivelEduTxt) socioDetalles.push(nivelEduTxt);
    if (coberturaTxt) socioDetalles.push(coberturaTxt);
    if (situacionLabTxt) socioDetalles.push(situacionLabTxt);

    const aguaVal = data.Agua_potable;
    const cloacaVal = data.Cloaca;

    let viviendaTxt = "";
    if (aguaVal) {
      if (aguaVal === "1") viviendaTxt += "Cuenta con acceso a agua potable";
      else if (aguaVal === "2") viviendaTxt += "No cuenta con acceso a agua potable";
      else if (aguaVal === "3") viviendaTxt += "Desconoce si cuenta con acceso a agua potable";
    }
    if (cloacaVal) {
      if (viviendaTxt) viviendaTxt += " y ";
      if (cloacaVal === "1") viviendaTxt += "posee red de cloacas/saneamiento domiciliario";
      else if (cloacaVal === "2") viviendaTxt += "no posee red de cloacas/saneamiento domiciliario";
      else if (cloacaVal === "3") viviendaTxt += "desconoce si posee red de cloacas/saneamiento domiciliario";
    }
    if (viviendaTxt) viviendaTxt += ". ";

    if (socioDetalles.length > 0) {
      p1 += socioDetalles.join(", ") + ". ";
    }
    p1 += viviendaTxt;

    // -------- Conductas de salud (tabaco, alcohol, actividad física) --------
    let p2Partes = [];

    // Tabaquismo (nuevo flujo)
    if (data.Fuma_actualmente === "1") {
      // Fuma actualmente
      const productos = [];

      if (data.Tabaco_cig_fabricado === "1") productos.push("cigarrillo fabricado");
      if (data.Tabaco_cig_armado === "1") productos.push("cigarrillo armado");
      if (data.Tabaco_capsula === "1") productos.push("cigarrillo con cápsula");
      if (data.Tabaco_vapeo === "1") productos.push("cigarrillo electrónico o vapeo");
      if (data.Tabaco_calentado === "1") productos.push("tabaco calentado");
      if (data.Tabaco_bolsa_nicotina === "1") productos.push("bolsa de nicotina");
      if (data.Tabaco_otro === "1") productos.push("otro producto de tabaco");

      let tabaquismo = "Refiere consumo actual de productos de tabaco";

      if (productos.length > 0) {
        tabaquismo += ` (${productos.join(", ")}).`;
      } else {
        tabaquismo += ".";
      }

      // Frecuencia + cigarrillos/día si diario
      if (data.Frecuencia_fumador === "1") {
        tabaquismo += " Fuma diariamente";
        if (data.Cigarrillos_dia_actual && data.Cigarrillos_dia_actual !== "null") {
          tabaquismo += ` (promedio ${data.Cigarrillos_dia_actual} cigarrillos/día).`;
        } else {
          tabaquismo += ".";
        }
      } else if (data.Frecuencia_fumador === "2") {
        tabaquismo += " Fuma no diariamente.";
      }

      // Edad de inicio
      if (data.Edad_inicio_tabaco && data.Edad_inicio_tabaco !== "null") {
        tabaquismo += ` Inició a los ${data.Edad_inicio_tabaco} años.`;
      }

      // Intentos de cesación
      if (data.Intento_dejar_tabaco === "1") {
        tabaquismo += " Refiere intentos de cesación tabáquica en los últimos 12 meses.";
      } else if (data.Intento_dejar_tabaco === "2") {
        tabaquismo += " Niega intentos de cesación tabáquica en los últimos 12 meses.";
      }

      p2Partes.push(tabaquismo);

    } else if (data.Fuma_actualmente === "2") {
      // No fuma actualmente → mirar pasado
      if (data.Fumo_pasado === "1") {
        let tabaquismo = "No fuma actualmente y refiere haber fumado en el pasado.";

        const anios = data.Anios_fumo_pasado;
        const cigs = data.Cigarrillos_dia_pasado;

        if (anios && anios !== "null") {
          tabaquismo += ` Fumó durante ${anios} años`;
          if (cigs && cigs !== "null") {
            tabaquismo += `, con un promedio de ${cigs} cigarrillos/día.`;
          } else {
            tabaquismo += ".";
          }
        } else if (cigs && cigs !== "null") {
          tabaquismo += ` Promedio histórico: ${cigs} cigarrillos/día.`;
        }

        p2Partes.push(tabaquismo);

      } else if (data.Fumo_pasado === "2") {
        p2Partes.push("No fuma actualmente y niega antecedente de tabaquismo.");
      } else {
        p2Partes.push("No fuma actualmente.");
      }
    }

        // Alcohol
    if (data.Frecuencia_alcohol && data.Frecuencia_alcohol !== "null") {
      if (data.Frecuencia_alcohol === "0") {
        // Nunca bebe
        p2Partes.push("Refiere no consumir habitualmente bebidas alcohólicas.");
        p2Partes.push("En cuanto al consumo de alcohol, no se identifican patrones de consumo de riesgo.");
      } else {
        const freqTxt = mapOrNull(data.Frecuencia_alcohol, frecuenciaAlcoholMap);
        const cantTxt = mapOrNull(data.Cantidad_alcohol, cantidadAlcoholMap);
        const excesoTxt = mapOrNull(data.Exceso_ocasion, excesoOcasionalMap);

        let alcohol = "Refiere consumo de bebidas alcohólicas";
        if (freqTxt) alcohol += ` con una frecuencia de ${freqTxt}`;
        if (cantTxt) alcohol += `, habitualmente ${cantTxt} en un día típico de consumo`;
        if (excesoTxt) alcohol += ` y episodios de consumo excesivo (≥6 bebidas) ${excesoTxt}`;
        alcohol += ".";

        // Cálculo e interpretación del AUDIT-C
        const auditScore = calcularAuditCDesdeValores(
          data.Frecuencia_alcohol,
          data.Cantidad_alcohol,
          data.Exceso_ocasion
        );

        if (auditScore !== null) {
          const sexo = data.Sexo_registrado;
          // Varón: corte ≥4. Mujeres, NB y no especificado: corte ≥3
          const corte = (sexo === "1") ? 4 : 3;

          if (auditScore >= corte) {
            alcohol += " En cuanto al consumo de alcohol, el paciente sugiere patrón de consumo de riesgo.";
          } else {
            alcohol += " En cuanto al consumo de alcohol, no se identifican patrones de consumo de riesgo.";
          }
        }

        p2Partes.push(alcohol);
      }
    }

    // Actividad física (nuevo)
    if (data.Actividad150min === "1") {
      p2Partes.push(
        "Refiere realizar al menos 150 minutos semanales de actividad física, cumpliendo con las recomendaciones de salud."
      );
    } else if (data.Actividad150min === "2") {
      // mapeo de motivo (solo si respondió NO)
      const motivoMap = {
        "1": "falta de tiempo",
        "2": "dolor, problemas de salud o limitaciones físicas",
        "3": "cansancio o falta de energía",
        "4": "falta de interés",
        "5": "barreras ambientales, como falta de lugar, inseguridad o condiciones climáticas",
        "6": "desconocimiento sobre qué tipo de actividad realizar o cómo iniciarla"
      };

      const motivo = data.Motivo_no_actividad;

      if (motivo === "1") {
        p2Partes.push("El paciente no realiza actividad física en la cantidad recomendada, refiriendo falta de tiempo como principal barrera.");
      } else if (motivo === "2") {
        p2Partes.push("El paciente no realiza actividad física debido a dolor, problemas de salud o limitaciones físicas.");
      } else if (motivo === "3") {
        p2Partes.push("El paciente no realiza actividad física adecuada por cansancio o falta de energía.");
      } else if (motivo === "4") {
        p2Partes.push("El paciente no realiza actividad física debido a falta de interés.");
      } else if (motivo === "5") {
        p2Partes.push("El paciente no realiza actividad física debido a barreras ambientales, como falta de lugar, inseguridad o condiciones climáticas.");
      } else if (motivo === "6") {
        p2Partes.push("El paciente no realiza actividad física por desconocimiento sobre qué tipo de actividad realizar o cómo iniciarla.");
      } else {
        // si puso NO pero no eligió motivo
        p2Partes.push("El paciente no realiza actividad física en la cantidad recomendada.");
      }
    }

    const p2 = p2Partes.length > 0
      ? p2Partes.join(" ")
      : "";

    // -------- Antecedentes biomédicos y parámetros actuales --------
    let p3Partes = [];

    // Diabetes
    if (data.Diagnostico_diabetes === "1") {
      let diab = "Presenta diagnóstico previo de diabetes.";
      if (data.Tratamiento_diabetes === "1") {
        const ttos = [];
        if (data.Tto_diab_dieta === "1") ttos.push("dieta");
        if (data.Tto_diab_ADO === "1") ttos.push("antidiabéticos orales");
        if (data.Tto_diab_insulina === "1") ttos.push("insulina");
        if (data.Tto_diab_otro === "1") ttos.push("otros tratamientos");

        if (ttos.length > 0) {
          diab += ` Se encuentra en tratamiento con ${ttos.join(", ")}.`;
        } else {
          diab += " Se encuentra en tratamiento, sin especificar tipo.";
        }
      } else if (data.Tratamiento_diabetes === "2") {
        diab += " Actualmente no recibe tratamiento específico.";
      }
      // HbA1c: si respondió que NO tiene resultado
      if (data.__tiene_hba1c === "2") {
        diab += " El paciente no cuenta con un resultado de hemoglobina glicosilada para registrar.";
      }
      if (data.Hemoglobina_glicosilada && data.Hemoglobina_glicosilada !== "null") {
        diab += ` Registra como valor más reciente de hemoglobina glicosilada (HbA1c) ${data.Hemoglobina_glicosilada}%.`;
      }
      p3Partes.push(diab);
    } else if (data.Diagnostico_diabetes === "2") {
      p3Partes.push("Niega diagnóstico previo de diabetes.");
    }

    // Dislipidemia
    if (data.Diagnostico_dislipidemia === "1") {
      p3Partes.push("Presenta diagnóstico conocido de dislipidemia.");
    } else if (data.Diagnostico_dislipidemia === "2") {
      p3Partes.push("Niega diagnóstico conocido de dislipidemia.");
    }

    // Tratamiento para el colesterol
    if (data.Tratamiento_colesterol === "1") {
      const ttos = [];

      if (data.Tto_col_dieta_ejercicio === "1") {
        ttos.push("dieta y ejercicio");
      }
      if (data.Tto_col_estatinas === "1") {
        ttos.push("estatinas");
      }

      if (ttos.length > 0) {
        p3Partes.push(
          `Recibe tratamiento para el colesterol con ${ttos.join(" y ")}.`
        );
      }

    } else if (
      data.Tratamiento_colesterol === "2" &&
      data.Diagnostico_dislipidemia === "1"
    ) {
      p3Partes.push("No recibe tratamiento para el colesterol.");
    }

    // Perfil lipídico
    if (
      (data.Colesterol_total && data.Colesterol_total !== "null") ||
      (data.HDL && data.HDL !== "null") ||
      (data.LDL && data.LDL !== "null") ||
      (data.Trigliceridos && data.Trigliceridos !== "null")
    ) {
      let lipidos = "En el perfil lipídico reciente se registran: ";
      const descrip = [];
      if (data.Colesterol_total && data.Colesterol_total !== "null") {
        descrip.push(`colesterol total ${data.Colesterol_total}`);
      }
      if (data.HDL && data.HDL !== "null") {
        descrip.push(`colesterol HDL ${data.HDL}`);
      }
      if (data.LDL && data.LDL !== "null") {
        descrip.push(`colesterol LDL ${data.LDL}`);
      }
      if (data.Trigliceridos && data.Trigliceridos !== "null") {
        descrip.push(`triglicéridos ${data.Trigliceridos}`);
      }
      lipidos += descrip.join(", ") + ".";
      p3Partes.push(lipidos);
    }

    // HTA
    if (data.Diagnostico_HTA === "1") {
      let hta = "Presenta diagnóstico previo de hipertensión arterial.";
      if (data.Tratamiento_HTA === "1") {
        const htaTtos = [];
        if (data.Tto_hta_IECA === "1") htaTtos.push("IECA");
        if (data.Tto_hta_ARAII === "1") htaTtos.push("ARA II");
        if (data.Tto_hta_BB === "1") htaTtos.push("betabloqueantes");
        if (data.Tto_hta_diureticos === "1") htaTtos.push("diuréticos");
        if (data.Tto_hta_otros === "1") htaTtos.push("otros fármacos antihipertensivos");

        if (htaTtos.length > 0) {
          hta += ` En tratamiento con ${htaTtos.join(", ")}.`;
        } else {
          hta += " En tratamiento farmacológico (esquema no especificado).";
        }

      } else if (data.Tratamiento_HTA === "2") {
        hta += " Actualmente no recibe tratamiento antihipertensivo.";
      }
      p3Partes.push(hta);
    } else if (data.Diagnostico_HTA === "2") {
      p3Partes.push("Niega diagnóstico previo de hipertensión arterial.");
    }

        // TA e IMC (con interpretación de rangos de IMC)
    if (
      (data.TA_sistolica && data.TA_sistolica !== "null") ||
      (data.TA_diastolica && data.TA_diastolica !== "null") ||
      (data.Peso && data.Peso !== "null") ||
      (data.Talla && data.Talla !== "null") ||
      (data.IMC && data.IMC !== "null")
    ) {
      let bio = "En el examen actual se registra: ";
      const datos = [];

      if (
        data.TA_sistolica && data.TA_sistolica !== "null" &&
        data.TA_diastolica && data.TA_diastolica !== "null"
      ) {
        datos.push(`presión arterial ${data.TA_sistolica}/${data.TA_diastolica} mmHg`);
      }

      if (data.Peso && data.Peso !== "null") {
        datos.push(`peso ${data.Peso} kg`);
      }

      if (data.Talla && data.Talla !== "null") {
        datos.push(`talla ${data.Talla} cm`);
      }

      const tieneIMC = data.IMC && data.IMC !== "null";
      const imcNum = tieneIMC ? parseFloat(data.IMC) : NaN;

      // Si tenemos IMC numérico, usamos los rangos y frases especiales
      if (tieneIMC && !isNaN(imcNum)) {
        // Armamos la parte común (TA/peso/talla)
        if (datos.length > 0) {
          bio += datos.join(", ");
          bio += `, IMC ${data.IMC}, `;
        } else {
          bio += `IMC ${data.IMC}, `;
        }

        let fraseIMC = "";

        if (imcNum < 18.5) {
          fraseIMC = "correspondiente a bajo peso.";
        } else if (imcNum >= 18.5 && imcNum < 25) {
          fraseIMC = "valor que se encuentra dentro del rango de peso normal.";
        } else if (imcNum >= 25 && imcNum < 30) {
          fraseIMC = "compatible con sobrepeso.";
        } else if (imcNum >= 30 && imcNum <= 40) {
          fraseIMC = "correspondiente a obesidad.";
        } else if (imcNum > 40) {
          fraseIMC = "hallazgo compatible con obesidad grave.";
        } else {
          // fallback raro, por si algo sale extraño
          fraseIMC = "sin interpretación disponible.";
        }

        bio += fraseIMC;
        p3Partes.push(bio);
      } else {
        // Si no tenemos IMC bien formado, narramos sólo lo disponible
        if (tieneIMC) {
          datos.push(`IMC ${data.IMC}`);
        }

        if (datos.length > 0) {
          bio += datos.join(", ") + ".";
          p3Partes.push(bio);
        }
      }
    }

    const p3 = p3Partes.length > 0
      ? p3Partes.join(" ")
      : "";

        // -------- Salud mental --------
    let p4 = "";
    const phq1Txt = mapOrNull(data.PHQ2_item1, phqGadFrecuenciaMap);
    const phq2Txt = mapOrNull(data.PHQ2_item2, phqGadFrecuenciaMap);
    const gad1Txt = mapOrNull(data.GAD2_item1, phqGadFrecuenciaMap);
    const gad2Txt = mapOrNull(data.GAD2_item2, phqGadFrecuenciaMap);

    const partesSM = [];

    // Estado de ánimo (descriptivo, derivado de PHQ-2)
    if (phq1Txt || phq2Txt) {
      let frase = "En la evaluación del estado de ánimo, ";
      const detalles = [];

      if (phq1Txt) {
        // Ítem: poco interés o placer en hacer las cosas
        detalles.push(`refiere poco interés o placer en realizar actividades ${phq1Txt}`);
      }

      if (phq2Txt) {
        // Ítem: se ha sentido decaído/deprimido/sin esperanzas
        if (sufGenero) {
          detalles.push(`refiere sentirse decaíd${sufGenero} o con sensación de falta de esperanza ${phq2Txt}`);
        } else {
          // Formulación neutra para no binario / no especificado
          detalles.push(`refiere ánimo bajo o sensación de falta de esperanza ${phq2Txt}`);
        }
      }

      frase += detalles.join(" y ") + ".";
      partesSM.push(frase);
    }

    // Ansiedad / preocupación (descriptivo, derivado de GAD-2)
    if (gad1Txt || gad2Txt) {
      let frase = "En la evaluación de síntomas de ansiedad, ";
      const detalles = [];

      if (gad1Txt) {
        if (sufGenero) {
          detalles.push(`refiere sentirse ansios${sufGenero} o al límite ${gad1Txt}`);
        } else {
          detalles.push(`refiere malestar ansioso o sensación de estar al límite ${gad1Txt}`);
        }
      }

      if (gad2Txt) {
        detalles.push(`refiere dificultad para controlar la preocupación ${gad2Txt}`);
      }

      frase += detalles.join(" y ") + ".";
      partesSM.push(frase);
    }

    // ---- Cálculo de puntajes PHQ-2 y GAD-2 e interpretación ----
    const parsePhqGadValue = (raw) => {
      if (!raw || raw === "null") return null;
      const n = Number(raw);
      if (Number.isNaN(n)) return null;
      // Soporta codificación 0–3 o 1–4
      if (n >= 0 && n <= 3) return n;     // ya está en 0–3
      if (n >= 1 && n <= 4) return n - 1; // de 1–4 a 0–3
      return null;
    };

    // PHQ-2 (depresión): 0–6, corte ≥3
    let phqScore = null;
    const phq1Score = parsePhqGadValue(data.PHQ2_item1);
    const phq2Score = parsePhqGadValue(data.PHQ2_item2);
    if (phq1Score !== null && phq2Score !== null) {
      phqScore = phq1Score + phq2Score;
    }

    if (phqScore !== null) {
      if (phqScore >= 3) {
        partesSM.push(
          "El paciente presenta síntomas depresivos que requieren evaluación complementaria con PHQ-9."
        );
      } else {
        partesSM.push(
          "No se identifican síntomas depresivos significativos."
        );
      }
    }

    // GAD-2 (ansiedad): 0–6, corte ≥3
    let gadScore = null;
    const gad1Score = parsePhqGadValue(data.GAD2_item1);
    const gad2Score = parsePhqGadValue(data.GAD2_item2);
    if (gad1Score !== null && gad2Score !== null) {
      gadScore = gad1Score + gad2Score;
    }

    if (gadScore !== null) {
      if (gadScore >= 3) {
        partesSM.push(
          "El paciente presenta síntomas de ansiedad."
        );
      } else {
        partesSM.push(
          "El paciente no presenta síntomas de ansiedad."
        );
      }
    }

    if (partesSM.length > 0) {
      p4 = partesSM.join(" ");
    }

    // -------- Salud general y medicación / polifarmacia --------
    let p5Partes = [];

    const transitoTxt = mapOrNull(data.Transito, transitoMap);
    if (transitoTxt) {
      if (data.Transito === "4") {
        p5Partes.push("En los últimos 12 meses niega haber estado involucrado en accidentes de tránsito.");
      } else {
        p5Partes.push(`En los últimos 12 meses refiere antecedente de ${transitoTxt}.`);
      }
    }

    const cantMeds = data.Cantidad_medicamentos && data.Cantidad_medicamentos !== "null"
      ? data.Cantidad_medicamentos
      : null;
    // Polifarmacia se sigue calculando para la base, pero no se narra

    if (cantMeds) {
      const meds = `Refiere uso habitual de ${cantMeds} medicamentos.`;
      p5Partes.push(meds);
    }

    const p5 = p5Partes.length > 0
      ? p5Partes.join(" ")
      : "";

    // -------- Prevención y tamizajes --------
    let p6Partes = [];

    // Doble bacteriana (no tiene "no corresponde")
    const doblBactTxt = mapOrNull(data.Vacunacion_dobleBacteriana, vacunaDobleBactMap);
    if (doblBactTxt) {
      p6Partes.push(`Para vacuna doble bacteriana, refiere ${doblBactTxt}.`);
    }

    // Antigripal: value "4" = No corresponde → NO narrar nada
    if (data.Vacunacion_antigripal && data.Vacunacion_antigripal !== "4") {
      const antiGripTxt = mapOrNull(data.Vacunacion_antigripal, vacunaAntigripalMap);
      if (antiGripTxt) {
        p6Partes.push(`Respecto de la vacuna antigripal, refiere ${antiGripTxt}.`);
      }
    }

    // Neumococo: value "6" = No corresponde → NO narrar
    if (data.Vacunacion_neumococo && data.Vacunacion_neumococo !== "6") {
      const neumococoTxt = mapOrNull(data.Vacunacion_neumococo, vacunaNeumococoMap);
      if (neumococoTxt) {
        p6Partes.push(`En relación con la vacunación contra neumococo, refiere ${neumococoTxt}.`);
      }
    }

    // Mamografía: value "3" = No corresponde → NO narrar
    if (data.Mamografia && data.Mamografia !== "3") {
      const mamografiaTxt = mapOrNull(data.Mamografia, mamografiaMap);
      if (mamografiaTxt) {
        p6Partes.push(`En tamizaje mamográfico, refiere ${mamografiaTxt}.`);
      }
    }

    // PAP: value "3" = No corresponde → NO narrar
    if (data.Papanicolau && data.Papanicolau !== "3") {
      const papTxt = mapOrNull(data.Papanicolau, papanicolauMap);
      if (papTxt) {
        p6Partes.push(`Respecto del Papanicolaou (PAP), refiere ${papTxt}.`);
      }
    }

    // Cribado colorrectal: value "3" = No corresponde → NO narrar
    if (data.Cribado_colorrectal && data.Cribado_colorrectal !== "3") {
      const colorrectalTxt = mapOrNull(data.Cribado_colorrectal, cribadoColorrectalMap);
      if (colorrectalTxt) {
        p6Partes.push(`Para cribado de cáncer colorrectal, refiere ${colorrectalTxt}.`);
      }
    }

    const p6 = p6Partes.length > 0
      ? p6Partes.join(" ")
      : "";

    // -------- Unimos en párrafos SIN subtítulos --------
    const parrafos = [];

    if ((p1 || "").trim()) parrafos.push(p1.trim());
    if ((p2 || "").trim()) parrafos.push(p2.trim());
    if ((p3 || "").trim()) parrafos.push(p3.trim());
    if ((p4 || "").trim()) parrafos.push(p4.trim());
    if ((p5 || "").trim()) parrafos.push(p5.trim());
    if ((p6 || "").trim()) parrafos.push(p6.trim());

    return parrafos.join("\n\n");
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

      // ---- Validación de otros parámetros numéricos con límites superiores ----
      const limites = [
        { id: "Peso", max: 300, label: "el peso (kg)" },
        { id: "Talla", max: 250, label: "la talla (cm)" },
        { id: "Colesterol_total", max: 2000, label: "el colesterol total" },
        { id: "HDL", max: 500, label: "el colesterol HDL" },
        { id: "LDL", max: 1000, label: "el colesterol LDL" },
        { id: "Trigliceridos", max: 10000, label: "los triglicéridos" },
        {
          id: "Cantidad_medicamentos",
          max: 20,
          label: "la cantidad de medicamentos",
        },
      ];

      for (const campo of limites) {
        const valStr = valueOf(campo.id);
        if (valStr === "") continue;

        const n = Number(valStr);
        if (!Number.isFinite(n) || n < 0 || n > campo.max) {
          alert(
            `Por favor, revise ${campo.label}: el valor máximo permitido es ${campo.max}.`
          );
          $(campo.id)?.focus();
          return;
        }
      }

      // 🔍 Marcar campos pendientes y preguntar si desea continuar
      const pendientes = marcarCamposPendientes(form);

      if (pendientes.length > 0) {
        const continuar = window.confirm(
          "Todavía quedan preguntas sin contestar, ¿seguro que desea continuar?"
        );

        if (!continuar) {
          // Llevar al usuario al primer campo pendiente
          const primero = pendientes[0];
          primero.scrollIntoView({ behavior: "smooth", block: "center" });
          primero.focus();
          return; // NO se envía el formulario, sigue completando
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

          // No recibe tratamiento → los tipos NO aplican
          ttoDieta    = "null";
          ttoADO      = "null";
          ttoInsulina = "null";
          ttoOtro     = "null";
        } else {
          // Tiene diagnóstico, pero no respondió si recibe tratamiento
          Tratamiento_diabetes_env = "null";
          ttoDieta    = "null";
          ttoADO      = "null";
          ttoInsulina = "null";
          ttoOtro     = "null";
        }
      }

      // ==================== Colesterol: codificación para envío ====================
      const rawTratamientoColesterol = valueOf("Tratamiento_colesterol");

      let Tratamiento_colesterol_env = "null";
      let ttoColDietaEj = "null";
      let ttoColEstatinas = "null";

      if (rawTratamientoColesterol === "1") {
        // Sí recibe tratamiento
        Tratamiento_colesterol_env = "1";

        // Para cada checkbox: 1 si está tildado, 2 si no
        ttoColDietaEj = chkColDietaEj?.checked ? "1" : "2";
        ttoColEstatinas = chkColEstatinas?.checked ? "1" : "2";

        // Exigir al menos una opción
        if (ttoColDietaEj === "2" && ttoColEstatinas === "2") {
          alert("Por favor, seleccione al menos una opción de tratamiento para el colesterol.");
          $("Tipo_tratamiento_colesterol_group")?.scrollIntoView({ behavior: "smooth" });
          return;
        }

      } else if (rawTratamientoColesterol === "2") {
        // No recibe tratamiento
        Tratamiento_colesterol_env = "2";

        // Tipos NO aplican
        ttoColDietaEj = "null";
        ttoColEstatinas = "null";
      }

      // ==================== Tabaco: codificación para envío ====================
      const rawFumaActualmente = valueOf("Fuma_actualmente");
      const rawFumoPasado = valueOf("Fumo_pasado");

      // Variables nuevas (se envían al Sheet)
      let Fumo_pasado_env = "null";
      let Anios_fumo_pasado_env = "null";
      let Cigarrillos_dia_pasado_env = "null";
      let Cigarrillos_dia_actual_env = "null";

      // Producto tabaco (7 columnas binarias)
      let Tabaco_cig_fabricado_env = "null";
      let Tabaco_cig_armado_env = "null";
      let Tabaco_capsula_env = "null";
      let Tabaco_vapeo_env = "null";
      let Tabaco_calentado_env = "null";
      let Tabaco_bolsa_nicotina_env = "null";
      let Tabaco_otro_env = "null";

      // Campos existentes del flujo “fumador actual”
      let Frecuencia_fumador_env = "null";
      let Edad_inicio_tabaco_env = "null";
      let Intento_dejar_tabaco_env = "null";

      if (rawFumaActualmente === "1") {
        // Fuma actualmente
        Frecuencia_fumador_env = valueOf("Frecuencia_fumador") || "null";
        Edad_inicio_tabaco_env = valueOf("Edad_inicio_tabaco") || "null";
        Intento_dejar_tabaco_env = valueOf("Intento_dejar_tabaco") || "null";

        // Cada checkbox: 1 si tildado, 2 si no tildado (solo aplica si fuma actualmente)
        Tabaco_cig_fabricado_env = chkTabacoFab?.checked ? "1" : "2";
        Tabaco_cig_armado_env = chkTabacoArm?.checked ? "1" : "2";
        Tabaco_capsula_env = chkTabacoCaps?.checked ? "1" : "2";
        Tabaco_vapeo_env = chkTabacoVapeo?.checked ? "1" : "2";
        Tabaco_calentado_env = chkTabacoCal?.checked ? "1" : "2";
        Tabaco_bolsa_nicotina_env = chkTabacoBolsa?.checked ? "1" : "2";
        Tabaco_otro_env = chkTabacoOtro?.checked ? "1" : "2";

        // Validación: si fuma actualmente, exigir al menos un producto
        const todosNo =
          Tabaco_cig_fabricado_env === "2" &&
          Tabaco_cig_armado_env === "2" &&
          Tabaco_capsula_env === "2" &&
          Tabaco_vapeo_env === "2" &&
          Tabaco_calentado_env === "2" &&
          Tabaco_bolsa_nicotina_env === "2" &&
          Tabaco_otro_env === "2";

        if (todosNo) {
          alert("Por favor, seleccione al menos un producto de tabaco.");
          $("Tipo_tabaco_group")?.scrollIntoView({ behavior: "smooth" });
          return;
        }

        // Cigarrillos/día actual: solo si Diariamente (1)
        if (Frecuencia_fumador_env === "1") {
          Cigarrillos_dia_actual_env = valueOf("Cigarrillos_dia_actual") || "null";
        } else {
          Cigarrillos_dia_actual_env = "null";
        }

        // Flujo pasado NO aplica
        Fumo_pasado_env = "null";
        Anios_fumo_pasado_env = "null";
        Cigarrillos_dia_pasado_env = "null";

      } else if (rawFumaActualmente === "2") {
        // No fuma actualmente
        Fumo_pasado_env = rawFumoPasado || "null";

        if (rawFumoPasado === "1") {
          Anios_fumo_pasado_env = valueOf("Anios_fumo_pasado") || "null";
          Cigarrillos_dia_pasado_env = valueOf("Cigarrillos_dia_pasado") || "null";
        } else {
          Anios_fumo_pasado_env = "null";
          Cigarrillos_dia_pasado_env = "null";
        }

        // Flujo de fumador actual NO aplica
        Frecuencia_fumador_env = "null";
        Edad_inicio_tabaco_env = "null";
        Intento_dejar_tabaco_env = "null";
        Cigarrillos_dia_actual_env = "null";

        // Productos NO aplican
        Tabaco_cig_fabricado_env = "null";
        Tabaco_cig_armado_env = "null";
        Tabaco_capsula_env = "null";
        Tabaco_vapeo_env = "null";
        Tabaco_calentado_env = "null";
        Tabaco_bolsa_nicotina_env = "null";
        Tabaco_otro_env = "null";

      } else {
        // No respondió Fuma_actualmente → todo null
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

      // ---- Calcular AUDIT-C (audit-c) ----
      const freqAlc = valueOf("Frecuencia_alcohol");
      const cantAlc = valueOf("Cantidad_alcohol");
      const excesoAlc = valueOf("Exceso_ocasion");

      const auditScore = calcularAuditCDesdeValores(freqAlc, cantAlc, excesoAlc);

      // ---- Calcular PHQ-2 ----
      let phqScore = null;

      const phq1 = valueOf("PHQ2_item1"); // 0–3
      const phq2 = valueOf("PHQ2_item2"); // 0–3

      if (phq1 !== "" && phq2 !== "" && phq1 !== "null" && phq2 !== "null") {
        const s1 = Number(phq1);
        const s2 = Number(phq2);

        if (!Number.isNaN(s1) && !Number.isNaN(s2)) {
          phqScore = s1 + s2;  // 0–6
        }
      }

      // ---- Calcular GAD-2 ----
      let gadScore = null;

      const gad1Val = valueOf("GAD2_item1"); // 0–3
      const gad2Val = valueOf("GAD2_item2"); // 0–3

      if (gad1Val !== "" && gad2Val !== "" && gad1Val !== "null" && gad2Val !== "null") {
        const g1 = Number(gad1Val);
        const g2 = Number(gad2Val);

        if (!Number.isNaN(g1) && !Number.isNaN(g2)) {
          gadScore = g1 + g2;  // 0–6
        }
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
        Frecuencia_fumador: Frecuencia_fumador_env,
        Edad_inicio_tabaco: Edad_inicio_tabaco_env,
        Intento_dejar_tabaco: Intento_dejar_tabaco_env,

        Fumo_pasado: Fumo_pasado_env,
        Anios_fumo_pasado: Anios_fumo_pasado_env,
        Cigarrillos_dia_pasado: Cigarrillos_dia_pasado_env,
        Cigarrillos_dia_actual: Cigarrillos_dia_actual_env,

        Tabaco_cig_fabricado: Tabaco_cig_fabricado_env,
        Tabaco_cig_armado: Tabaco_cig_armado_env,
        Tabaco_capsula: Tabaco_capsula_env,
        Tabaco_vapeo: Tabaco_vapeo_env,
        Tabaco_calentado: Tabaco_calentado_env,
        Tabaco_bolsa_nicotina: Tabaco_bolsa_nicotina_env,
        Tabaco_otro: Tabaco_otro_env,

        // Conductas: Alcohol
        Frecuencia_alcohol: valueOf("Frecuencia_alcohol"),
        Cantidad_alcohol: valueOf("Cantidad_alcohol"),
        Exceso_ocasion: valueOf("Exceso_ocasion"),

        // Puntaje AUDIT-C
        "audit-c": auditScore !== null ? String(auditScore) : "",

        // Conductas: Actividad física
        Actividad150min: valueOf("Actividad150min"),
        Motivo_no_actividad: valueOf("Motivo_no_actividad"),

        // Biomédico
        Diagnostico_diabetes: valueOf("Diagnostico_diabetes"),
        Tratamiento_diabetes: Tratamiento_diabetes_env,
        Tto_diab_dieta: ttoDieta,
        Tto_diab_ADO: ttoADO,
        Tto_diab_insulina: ttoInsulina,
        Tto_diab_otro: ttoOtro,
        Hemoglobina_glicosilada: valueOf("Hemoglobina_glicosilada"),
        Diagnostico_dislipidemia: valueOf("Diagnostico_dislipidemia"),
        Tratamiento_colesterol: Tratamiento_colesterol_env,
        Tto_col_dieta_ejercicio: ttoColDietaEj,
        Tto_col_estatinas: ttoColEstatinas,
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
        TA_sistolica: valueOf("TA_sistolica"),
        TA_diastolica: valueOf("TA_diastolica"),
        Peso: valueOf("Peso"),
        Talla: valueOf("Talla"),
        IMC: valueOf("IMC"),

        // Salud mental
        PHQ2_item1: valueOf("PHQ2_item1"),
        PHQ2_item2: valueOf("PHQ2_item2"),
        "phq-2": phqScore !== null ? String(phqScore) : "",
        GAD2_item1: valueOf("GAD2_item1"),
        GAD2_item2: valueOf("GAD2_item2"),
        "gad-2": gadScore !== null ? String(gadScore) : "",

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

      // 🔊 Generar narrativo clínico antes de normalizar valores vacíos
      data.__tiene_hba1c = valueOf("Tiene_hba1c");

      const textoNarrativo = generarNarrativo(data);
      const narrativoEl = $("narrativo");
      if (narrativoEl) {
        narrativoEl.value = textoNarrativo;
      }

      // 🔄 Normalizar valores vacíos a "null"
      delete data.__tiene_hba1c;
      
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
        "https://script.google.com/macros/s/AKfycbytf0x4Uyv91ejfAdGsd4-e-c7yktfXpDclZNwW4-CDxnIW-amunFzagsZRmsL5EwB3vQ/exec",
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
      // Reset del formulario
      if (form) form.reset();

      // Limpiar IMC
      if (imcInput) imcInput.value = "";

      // Limpiar mensaje de resultado
      if (resultado) resultado.innerText = "";

      // Restaurar botón enviar
      if (botonEnviar) {
        botonEnviar.disabled = false;
        botonEnviar.innerText = "Enviar";
      }

      // Ocultar botón nuevo registro
      nuevoRegistro.style.display = "none";

      // Limpiar narrativo
      const narrativoEl = $("narrativo");
      if (narrativoEl) narrativoEl.value = "";

      // Eliminar TODAS las marcas rojas de campos pendientes
      document
        .querySelectorAll(".campo-pendiente")
        .forEach((el) => el.classList.remove("campo-pendiente"));

      // Restaurar visibilidad correcta de todos los bloques condicionales
      actualizarVisibilidadTabaco();
      actualizarVisibilidadCigarrillosDiaActual();
      actualizarVisibilidadFumoPasado();
      actualizarVisibilidadAlcohol();
      actualizarVisibilidadDiabetes();
      actualizarVisibilidadHTA();
      actualizarVisibilidadTipoTratamientoHTA();
      actualizarVisibilidadTratamientoColesterol();
      actualizarVisibilidadActividadFisica();

      // 🔝 Mover scroll al inicio de la página
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ==================== Copiar narrativo al portapapeles ====================
  if (btnCopiarNarrativo) {
    btnCopiarNarrativo.addEventListener("click", () => {
      const narrativoEl = $("narrativo");
      const texto = narrativoEl?.value ?? "";

      if (!texto) {
        alert("No hay narrativo generado para copiar.");
        return;
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(texto)
          .then(() => {
            alert("Narrativo copiado al portapapeles.");
          })
          .catch(() => {
            // Fallback
            narrativoEl.select();
            document.execCommand("copy");
            alert("Narrativo copiado al portapapeles.");
          });
      } else {
        // Fallback para navegadores antiguos
        narrativoEl.select();
        document.execCommand("copy");
        alert("Narrativo copiado al portapapeles.");
      }
    });
  }
});