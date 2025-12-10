document.addEventListener("DOMContentLoaded", () => {
  // Helper rápido para obtener elementos
  const $ = (id) => document.getElementById(id);

  const form = $("formulario");
  const botonEnviar = $("botonEnviar");
  const nuevoRegistro = $("nuevoRegistro");
  const fechaConsultaInput = $("Fecha_consulta");
  const imcInput = $("IMC");
  const pesoInput = $("Peso");
  const tallaInput = $("Talla");
  const resultado = $("resultadoIMC");
  const btnHoyFecha = $("btnHoyFecha");
  const btnCopiarNarrativo = $("btnCopiarNarrativo");

  const selectFuma = $("Fuma_actualmente");
  const bloqueTabacoExtra = $("bloque_tabaco_extra");

  const selectFrecuenciaAlcohol = $("Frecuencia_alcohol");
  const bloqueAlcoholExtra = $("bloque_alcohol_extra");

  const selectTratamientoDiabetes = $("Tratamiento_diabetes");
  const bloqueTipoTratamiento = $("bloque_tipo_tratamiento_diabetes");

  const selectDiagnosticoDiabetes = $("Diagnostico_diabetes");
  // ESTE es el div que envuelve la pregunta de tratamiento por diabetes:
  const bloqueDiabetes = $("bloque_tratamiento_diabetes");
  // Este ya estaba bien:
  const bloqueHbA1c = $("bloque_hba1c");

  const selectDiagnosticoHTA = $("Diagnostico_HTA");
  const bloqueHTA = $("bloque_hta_extra");

  const selectTratamientoHTA = $("Tratamiento_HTA");
  const bloqueTipoTratamientoHTA = $("bloque_tipo_tratamiento_hta");
  const bloqueAdherenciaHTA = $("bloque_adherencia_HTA");

  const selectPHQ1 = $("PHQ2_item1");
  const selectPHQ2 = $("PHQ2_item2");
  const bloquePHQ2 = $("bloque_PHQ2");

  const selectGAD1 = $("GAD2_item1");
  const selectGAD2 = $("GAD2_item2");
  const bloqueGAD2 = $("bloque_GAD2");

  // ==================== Cálculo de IMC ====================
  function actualizarIMC() {
    const pesoVal = parseFloat(pesoInput?.value || "");
    const tallaVal = parseFloat(tallaInput?.value || "");
    if (!isNaN(pesoVal) && !isNaN(tallaVal) && tallaVal > 0) {
      const tallaM = tallaVal / 100;
      const imc = pesoVal / (tallaM * tallaM);
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

  // ==================== FUNCIÓN: Narrativo clínico ====================

  function generarNarrativo(data) {
    const mapOrNull = (value, map) => {
      if (!value || value === "null") return null;
      return map[value] || null;
    };

    // Diccionarios de texto
    const sexoMap = {
      "1": "varón",
      "2": "mujer",
      "3": "persona de género no binario",
      "4": "persona de sexo no especificado",
    };

    const estadoCivilMap = {
      "1": "soltero/a",
      "2": "casado/a o en unión convivencial",
      "3": "separado/a o divorciado/a",
      "4": "viudo/a",
    };

    const nivelEducativoMap = {
      "1": "sin instrucción formal",
      "2": "con primaria incompleta",
      "3": "con primaria completa",
      "4": "con secundaria incompleta",
      "5": "con secundaria completa",
      "6": "con estudios terciarios/universitarios incompletos",
      "7": "con estudios terciarios/universitarios completos",
    };

    const coberturaMap = {
      "1": "con cobertura de salud",
      "2": "sin cobertura de salud",
      "3": "que desconoce su situación de cobertura",
    };

    const situacionLaboralMap = {
      "1": "actualmente trabajando",
      "2": "sin trabajo pero en búsqueda activa",
      "3": "sin trabajo y sin búsqueda activa",
    };

    const frecuenciaAlcoholMap = {
      "0": "nunca",
      "1": "1 vez al mes o menos",
      "2": "2 a 4 veces al mes",
      "3": "2 a 3 veces por semana",
      "4": "4 o más veces por semana",
    };

    const cantidadAlcoholMap = {
      "0": "1 a 2 bebidas",
      "1": "3 a 4 bebidas",
      "2": "5 a 6 bebidas",
      "3": "7 a 9 bebidas",
      "4": "10 o más bebidas",
    };

    const excesoOcasionalMap = {
      "0": "nunca",
      "1": "menos de una vez al mes",
      "2": "mensualmente",
      "3": "semanalmente",
      "4": "a diario o casi a diario",
    };

    const actividad150Map = {
      "1": "realiza al menos 150 minutos semanales de actividad física moderada o intensa",
      "2": "no alcanza los 150 minutos semanales de actividad física moderada o intensa",
    };

    const motivoActividadMap = {
      "1": "principalmente por motivos de salud",
      "2": "principalmente por motivos laborales",
      "3": "principalmente con fines recreativos",
      "4": "refiere falta de tiempo",
      "5": "refiere limitaciones físicas",
      "6": "refiere que no le interesa realizar actividad física",
    };

    const phqGadFrecuenciaMap = {
      "0": "nunca",
      "1": "en varios días",
      "2": "en más de la mitad de los días",
      "3": "casi todos los días",
    };

    const transitoMap = {
      "1": "accidente de tránsito como conductor",
      "2": "accidente de tránsito como pasajero",
      "3": "accidente de tránsito como peatón",
      "4": "no haber estado involucrado en accidentes de tránsito",
    };

    const vacunaDobleBactMap = {
      "1": "haber recibido al menos una dosis de vacuna doble bacteriana en los últimos 10 años",
      "2": "no haber recibido vacuna doble bacteriana en los últimos 10 años",
      "3": "desconocer si recibió vacuna doble bacteriana en los últimos 10 años",
    };

    const vacunaAntigripalMap = {
      "1": "haber recibido la vacuna antigripal en la última campaña anual",
      "2": "no haber recibido la vacuna antigripal en la última campaña anual",
      "3": "desconocer si recibió la vacuna antigripal",
      "4": "refiere que no corresponde la vacuna antigripal",
    };

    const vacunaNeumococoMap = {
      "1": "haber recibido una dosis de vacuna contra neumococo",
      "2": "haber recibido dos dosis de vacuna contra neumococo",
      "3": "haber recibido dosis única según nuevo esquema de vacuna conjugada 20",
      "4": "no haber recibido vacuna contra neumococo",
      "5": "desconocer si recibió vacuna contra neumococo",
      "6": "refiere que no corresponde la vacunación contra neumococo",
    };

    const mamografiaMap = {
      "1": "haber realizado mamografía en los últimos 2 años",
      "2": "no haber realizado mamografía en los últimos 2 años",
      "3": "refiere que no corresponde la realización de mamografía",
    };

    const papanicolauMap = {
      "1": "haber realizado Papanicolaou (PAP) en los últimos 3 años",
      "2": "no haber realizado Papanicolaou (PAP) en los últimos 3 años",
      "3": "refiere que no corresponde la realización de Papanicolaou (PAP)",
    };

    const cribadoColorrectalMap = {
      "1": "haber realizado algún estudio de detección de cáncer colorrectal",
      "2": "no haber realizado estudios de detección de cáncer colorrectal",
      "3": "refiere que no corresponde el cribado de cáncer colorrectal",
    };

    // Sufijo de género para adjetivos (varón/mujer)
    let sufGenero = "";
    if (data.Sexo_registrado === "1") {
      sufGenero = "o";
    } else if (data.Sexo_registrado === "2") {
      sufGenero = "a";
    } else {
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

    // Tabaquismo
    if (data.Fuma_actualmente === "1") {
      const productoMap = {
        "1": "cigarrillos fabricados",
        "2": "cigarrillos armados",
        "3": "cigarrillos con cápsula",
        "4": "cigarrillo electrónico o vapeo",
        "5": "tabaco calentado",
        "6": "bolsas de nicotina",
        "7": "otros productos de tabaco",
      };
      const productoTxt = mapOrNull(data.Fuma_producto, productoMap) || "productos de tabaco";
      const frecuenciaTxt =
        data.Frecuencia_fumador === "1"
          ? "de manera diaria"
          : data.Frecuencia_fumador === "2"
          ? "en forma ocasional"
          : "";

      let tabaquismo = `Refiere consumo actual de ${productoTxt}`;
      if (frecuenciaTxt) tabaquismo += `, ${frecuenciaTxt}`;
      if (data.Edad_inicio_tabaco && data.Edad_inicio_tabaco !== "null") {
        tabaquismo += `, con inicio del consumo regular a los ${data.Edad_inicio_tabaco} años`;
      }
      if (data.Intento_dejar_tabaco === "1") {
        tabaquismo += `. Refiere intentos de cesación tabáquica en los últimos 12 meses.`;
      } else if (data.Intento_dejar_tabaco === "2") {
        tabaquismo += `. Niega intentos de cesación tabáquica en los últimos 12 meses.`;
      } else {
        tabaquismo += ".";
      }
      p2Partes.push(tabaquismo);
    } else if (data.Fuma_actualmente === "2") {
      p2Partes.push("Niega consumo actual de tabaco.");
    }

    // Alcohol (con AUDIT-C)
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
          const corte = sexo === "1" ? 4 : 3;

          if (auditScore >= corte) {
            alcohol += " En cuanto al consumo de alcohol, el paciente sugiere patrón de consumo de riesgo.";
          } else {
            alcohol += " En cuanto al consumo de alcohol, no se identifican patrones de consumo de riesgo.";
          }
        }

        p2Partes.push(alcohol);
      }
    }

    // Actividad física
    if (data.Actividad150min && data.Actividad150min !== "null") {
      let actTxt = mapOrNull(data.Actividad150min, actividad150Map) || "";
      const motivoTxt = mapOrNull(data.Motivo_actividad, motivoActividadMap);

      if (actTxt) {
        let actividad = `En cuanto a actividad física, refiere que ${actTxt}`;
        if (motivoTxt) actividad += `, ${motivoTxt}.`;
        else actividad += ".";
        p2Partes.push(actividad);
      }
    }

    const p2 = p2Partes.length > 0 ? p2Partes.join(" ") : "";

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

        if (data.Adherencia_tratamiento_HTA === "1") {
          hta += " Refiere adherencia adecuada a la medicación según indicación médica.";
        } else if (data.Adherencia_tratamiento_HTA === "2") {
          hta += " Refiere no cumplir adecuadamente con la medicación indicada.";
        } else if (data.Adherencia_tratamiento_HTA === "3") {
          hta += " Desconoce o no precisa el grado de adherencia al tratamiento.";
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
        data.TA_sistolica &&
        data.TA_sistolica !== "null" &&
        data.TA_diastolica &&
        data.TA_diastolica !== "null"
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
        } else if (imcNum >= 18.5 && imcNum <= 24.9) {
          fraseIMC = "valor que se encuentra dentro del rango de peso normal.";
        } else if (imcNum >= 25.0 && imcNum <= 29.9) {
          fraseIMC = "compatible con sobrepeso.";
        } else if (imcNum >= 30.0 && imcNum <= 39.9) {
          fraseIMC = "correspondiente a obesidad.";
        } else if (imcNum >= 40.0) {
          fraseIMC = "hallazgo compatible con obesidad grave.";
        } else {
          fraseIMC = "sin interpretación disponible.";
        }

        bio += fraseIMC;
        p3Partes.push(bio);
      } else {
        // Sin IMC numérico válido: solo lo disponible
        if (tieneIMC) {
          datos.push(`IMC ${data.IMC}`);
        }

        if (datos.length > 0) {
          bio += datos.join(", ") + ".";
          p3Partes.push(bio);
        }
      }
    }

    const p3 = p3Partes.length > 0 ? p3Partes.join(" ") : "";

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
        detalles.push(`refiere poco interés o placer en realizar actividades ${phq1Txt}`);
      }

      if (phq2Txt) {
        if (sufGenero) {
          detalles.push(
            `refiere sentirse decaíd${sufGenero} o con sensación de falta de esperanza ${phq2Txt}`
          );
        } else {
          detalles.push(
            `refiere sentirse decaído/a o con sensación de falta de esperanza ${phq2Txt}`
          );
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
          detalles.push(
            `refiere malestar ansioso o sensación de estar al límite ${gad1Txt}`
          );
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
      if (n >= 0 && n <= 3) return n; // ya está en 0–3
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
        partesSM.push("No se identifican síntomas depresivos significativos.");
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
        partesSM.push("El paciente presenta síntomas de ansiedad.");
      } else {
        partesSM.push("El paciente no presenta síntomas de ansiedad.");
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
        p5Partes.push(
          "En los últimos 12 meses niega haber estado involucrado en accidentes de tránsito."
        );
      } else {
        p5Partes.push(
          `En los últimos 12 meses refiere antecedente de ${transitoTxt}.`
        );
      }
    }

    const cantMeds =
      data.Cantidad_medicamentos && data.Cantidad_medicamentos !== "null"
        ? data.Cantidad_medicamentos
        : null;
    // Polifarmacia: sólo se calcula para la base, no se narra
    if (cantMeds) {
      const meds = `Refiere uso habitual de ${cantMeds} medicamentos.`;
      p5Partes.push(meds);
    }

    const p5 = p5Partes.length > 0 ? p5Partes.join(" ") : "";

    // -------- Prevención y tamizajes --------
    let p6Partes = [];

    // Doble bacteriana (no tiene "no corresponde")
    const doblBactTxt = mapOrNull(
      data.Vacunacion_dobleBacteriana,
      vacunaDobleBactMap
    );
    if (doblBactTxt) {
      p6Partes.push(`Para vacuna doble bacteriana, refiere ${doblBactTxt}.`);
    }

    // Antigripal: value "4" = "no corresponde" → NO narrar nada
    if (data.Vacunacion_antigripal && data.Vacunacion_antigripal !== "4") {
      const antiGripTxt = mapOrNull(
        data.Vacunacion_antigripal,
        vacunaAntigripalMap
      );
      if (antiGripTxt) {
        p6Partes.push(
          `Respecto de la vacuna antigripal, refiere ${antiGripTxt}.`
        );
      }
    }

    // Neumococo: value "6" = "no corresponde" → NO narrar
    if (data.Vacunacion_neumococo && data.Vacunacion_neumococo !== "6") {
      const neumococoTxt = mapOrNull(
        data.Vacunacion_neumococo,
        vacunaNeumococoMap
      );
      if (neumococoTxt) {
        p6Partes.push(
          `En relación con la vacunación contra neumococo, refiere ${neumococoTxt}.`
        );
      }
    }

    // Mamografía: value "3" = "no corresponde" → NO narrar
    if (data.Mamografia && data.Mamografia !== "3") {
      const mamografiaTxt = mapOrNull(data.Mamografia, mamografiaMap);
      if (mamografiaTxt) {
        p6Partes.push(`En tamizaje mamográfico, refiere ${mamografiaTxt}.`);
      }
    }

    // PAP: value "3" = "no corresponde" → NO narrar
    if (data.Papanicolau && data.Papanicolau !== "3") {
      const papTxt = mapOrNull(data.Papanicolau, papanicolauMap);
      if (papTxt) {
        p6Partes.push(
          `Respecto del Papanicolaou (PAP), refiere ${papTxt}.`
        );
      }
    }

    // Cribado colorrectal: value "3" = "no corresponde" → NO narrar
    if (data.Cribado_colorrectal && data.Cribado_colorrectal !== "3") {
      const colorrectalTxt = mapOrNull(
        data.Cribado_colorrectal,
        cribadoColorrectalMap
      );
      if (colorrectalTxt) {
        p6Partes.push(
          `Para cribado de cáncer colorrectal, refiere ${colorrectalTxt}.`
        );
      }
    }

    const p6 = p6Partes.length > 0 ? p6Partes.join(" ") : "";

    // -------- Unimos en párrafos separados con subtítulos --------
    const parrafos = [];

    if (p1 && p1.trim().length > 0) {
      parrafos.push(p1.trim());
    }
    if (p2 && p2.trim().length > 0) {
      parrafos.push("Conductas de salud y estilo de vida\n" + p2.trim());
    }
    if (p3 && p3.trim().length > 0) {
      parrafos.push(
        "Antecedentes biomédicos y parámetros actuales\n" + p3.trim()
      );
    }
    if (p4 && p4.trim().length > 0) {
      parrafos.push("Salud mental\n" + p4.trim());
    }
    if (p5 && p5.trim().length > 0) {
      parrafos.push(
        "Salud general y tratamiento farmacológico\n" + p5.trim()
      );
    }
    if (p6 && p6.trim().length > 0) {
      parrafos.push(
        "Medidas preventivas y estudios de tamizaje\n" + p6.trim()
      );
    }

    return parrafos.join("\n\n");
  }

  // ==================== AUDIT-C: cálculo de puntaje ====================
  function calcularAuditCDesdeValores(freq, cant, binge) {
    // freq, cant, binge vienen codificados 0–4
    const map = { "0": 0, "1": 1, "2": 2, "3": 3, "4": 4 };

    // Si no respondió frecuencia, no calculamos nada
    if (freq === "" || freq === null || typeof freq === "undefined") {
      return null;
    }

    // Si responde "Nunca" (0), el puntaje total es 0 aunque no vea las otras preguntas
    if (freq === "0") {
      return 0;
    }

    // Para el resto de los casos, necesitamos las 3 respuestas
    if (
      cant === "" ||
      cant === null ||
      typeof cant === "undefined" ||
      binge === "" ||
      binge === null ||
      typeof binge === "undefined"
    ) {
      return null;
    }

    if (
      !map.hasOwnProperty(freq) ||
      !map.hasOwnProperty(cant) ||
      !map.hasOwnProperty(binge)
    ) {
      return null;
    }

    return map[freq] + map[cant] + map[binge];
  }

  // ==================== Conductas: Alcohol ====================
  function actualizarVisibilidadAlcohol() {
    const valor = (document.getElementById("Frecuencia_alcohol")?.value || "");

    // Ocultar si NO eligió nada o eligió "Nunca" (0)
    if (valor === "" || valor === "0") {
      if (bloqueAlcoholExtra) bloqueAlcoholExtra.style.display = "none";
      if ($("Cantidad_alcohol")) $("Cantidad_alcohol").value = "";
      if ($("Exceso_ocasion")) $("Exceso_ocasion").value = "";
    } else {
      if (bloqueAlcoholExtra) bloqueAlcoholExtra.style.display = "block";
    }
  }

  if (selectFrecuenciaAlcohol) {
    selectFrecuenciaAlcohol.addEventListener(
      "change",
      actualizarVisibilidadAlcohol
    );
    actualizarVisibilidadAlcohol();
  }

  // ==================== Conductas: Tabaco ====================
  function actualizarVisibilidadTabaco() {
    const v = $("Fuma_actualmente")?.value || "";

    if (v === "1") {
      if (bloqueTabacoExtra) bloqueTabacoExtra.style.display = "block";
    } else {
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

  // ==================== Diabetes: bloques condicionales ====================
  function actualizarVisibilidadDiabetes() {
    const diag = $("Diagnostico_diabetes")?.value || "";
    if (diag === "1") {
      if (bloqueDiabetes) bloqueDiabetes.style.display = "block";
    } else {
      if (bloqueDiabetes) bloqueDiabetes.style.display = "none";

      if ($("Tratamiento_diabetes")) $("Tratamiento_diabetes").value = "";
      if ($("Tto_diab_dieta")) $("Tto_diab_dieta").checked = false;
      if ($("Tto_diab_ADO")) $("Tto_diab_ADO").checked = false;
      if ($("Tto_diab_insulina")) $("Tto_diab_insulina").checked = false;
      if ($("Tto_diab_otro")) $("Tto_diab_otro").checked = false;
      if (bloqueTipoTratamiento) bloqueTipoTratamiento.style.display = "none";
      if ($("Hemoglobina_glicosilada"))
        $("Hemoglobina_glicosilada").value = "";
      if (bloqueHbA1c) bloqueHbA1c.style.display = "none";
    }
  }

  if (selectDiagnosticoDiabetes) {
    selectDiagnosticoDiabetes.addEventListener(
      "change",
      actualizarVisibilidadDiabetes
    );
    actualizarVisibilidadDiabetes();
  }

  function actualizarVisibilidadTipoTratamiento() {
    const valor = $("Tratamiento_diabetes")?.value || "";

    if (valor === "1") {
      if (bloqueTipoTratamiento) bloqueTipoTratamiento.style.display = "block";
    } else {
      if (bloqueTipoTratamiento) bloqueTipoTratamiento.style.display = "none";

      const chkIds = [
        "Tto_diab_dieta",
        "Tto_diab_ADO",
        "Tto_diab_insulina",
        "Tto_diab_otro",
      ];
      chkIds.forEach((id) => {
        const c = $(id);
        if (c) c.checked = false;
      });
    }
  }

  if (selectTratamientoDiabetes) {
    selectTratamientoDiabetes.addEventListener(
      "change",
      actualizarVisibilidadTipoTratamiento
    );
    actualizarVisibilidadTipoTratamiento();
  }

  function actualizarVisibilidadHbA1c() {
    const diag = $("Diagnostico_diabetes")?.value || "";
    if (diag === "1") {
      if (bloqueHbA1c) bloqueHbA1c.style.display = "block";
    } else {
      if (bloqueHbA1c) bloqueHbA1c.style.display = "none";
      if ($("Hemoglobina_glicosilada"))
        $("Hemoglobina_glicosilada").value = "";
    }
  }

  if (selectDiagnosticoDiabetes) {
    selectDiagnosticoDiabetes.addEventListener(
      "change",
      actualizarVisibilidadHbA1c
    );
    actualizarVisibilidadHbA1c();
  }

  // ==================== HTA: bloques condicionales ====================
  function actualizarVisibilidadHTA() {
    const diag = $("Diagnostico_HTA")?.value || "";

    if (diag === "1") {
      if (bloqueHTA) bloqueHTA.style.display = "block";
      } else {
      if (bloqueHTA) bloqueHTA.style.display = "none";

      if ($("Tratamiento_HTA")) $("Tratamiento_HTA").value = "";
      if (bloqueTipoTratamientoHTA)
        bloqueTipoTratamientoHTA.style.display = "none";
      ["Tto_hta_IECA", "Tto_hta_ARAII", "Tto_hta_BB", "Tto_hta_diureticos", "Tto_hta_otros"].forEach(
        (id) => {
          const c = $(id);
          if (c) c.checked = false;
        }
      );

      // 🔹 Ocultar y limpiar adherencia
      if (bloqueAdherenciaHTA) bloqueAdherenciaHTA.style.display = "none";
      if ($("Adherencia_tratamiento_HTA"))
        $("Adherencia_tratamiento_HTA").value = "";

      if ($("TA_sistolica")) $("TA_sistolica").value = "";
      if ($("TA_diastolica")) $("TA_diastolica").value = "";
    }
  }

  if (selectDiagnosticoHTA) {
    selectDiagnosticoHTA.addEventListener("change", () => {
      actualizarVisibilidadHTA();
      actualizarVisibilidadAdherenciaHTA();
    });
    actualizarVisibilidadHTA();
    actualizarVisibilidadAdherenciaHTA();
  }

  function actualizarVisibilidadTipoTratamientoHTA() {
    const valor = $("Tratamiento_HTA")?.value || "";

    if (valor === "1") {
      if (bloqueTipoTratamientoHTA)
        bloqueTipoTratamientoHTA.style.display = "block";
    } else {
      if (bloqueTipoTratamientoHTA)
        bloqueTipoTratamientoHTA.style.display = "none";

      ["Tto_hta_IECA", "Tto_hta_ARAII", "Tto_hta_BB", "Tto_hta_diureticos", "Tto_hta_otros"].forEach(
        (id) => {
          const c = $(id);
          if (c) c.checked = false;
        }
      );
    }
  }

  function actualizarVisibilidadAdherenciaHTA() {
    const diag = $("Diagnostico_HTA")?.value || "";
    const valorTrat = $("Tratamiento_HTA")?.value || "";

    // Solo mostramos si:
    // - Tiene diagnóstico de HTA (diag === "1")
    // - Y recibe tratamiento (Tratamiento_HTA === "1")
    if (diag === "1" && valorTrat === "1") {
      if (bloqueAdherenciaHTA) bloqueAdherenciaHTA.style.display = "block";
    } else {
      if (bloqueAdherenciaHTA) bloqueAdherenciaHTA.style.display = "none";
      if ($("Adherencia_tratamiento_HTA"))
        $("Adherencia_tratamiento_HTA").value = "";
    }
  }

  if (selectTratamientoHTA) {
    selectTratamientoHTA.addEventListener("change", () => {
      actualizarVisibilidadTipoTratamientoHTA();
      actualizarVisibilidadAdherenciaHTA();
    });

    // Estado inicial al cargar
    actualizarVisibilidadTipoTratamientoHTA();
    actualizarVisibilidadAdherenciaHTA();
  }

  // ==================== PHQ-2 y GAD-2: visibilidad de segundos ítems ====================
  function actualizarVisibilidadPHQ2() {
    const v1 = $("PHQ2_item1")?.value || "";
    const v2 = $("PHQ2_item2")?.value || "";

    if (!v1 && !v2) {
      if (bloquePHQ2) bloquePHQ2.style.display = "none";
    } else {
      if (bloquePHQ2) bloquePHQ2.style.display = "block";
    }
  }

  if (selectPHQ1) {
    selectPHQ1.addEventListener("change", actualizarVisibilidadPHQ2);
  }
  if (selectPHQ2) {
    selectPHQ2.addEventListener("change", actualizarVisibilidadPHQ2);
  }
  actualizarVisibilidadPHQ2();

  function actualizarVisibilidadGAD2() {
    const v1 = $("GAD2_item1")?.value || "";
    const v2 = $("GAD2_item2")?.value || "";

    if (!v1 && !v2) {
      if (bloqueGAD2) bloqueGAD2.style.display = "none";
    } else {
      if (bloqueGAD2) bloqueGAD2.style.display = "block";
    }
  }

  if (selectGAD1) {
    selectGAD1.addEventListener("change", actualizarVisibilidadGAD2);
  }
  if (selectGAD2) {
    selectGAD2.addEventListener("change", actualizarVisibilidadGAD2);
  }
  actualizarVisibilidadGAD2();

  // ==================== Marcado de campos pendientes ====================
  function marcarCamposPendientes(formEl) {
    const pendientes = [];

    const elementos = formEl.querySelectorAll("input, select, textarea");

    elementos.forEach((el) => {
      const tipo = el.type;

      if (
        tipo === "hidden" ||
        tipo === "button" ||
        tipo === "submit" ||
        tipo === "checkbox" ||
        tipo === "radio"
      ) {
        return;
      }

      if (el.readOnly || el.disabled) return;

      const requerido = el.hasAttribute("required");

      const valor = (el.value || "").trim();
      if (requerido && valor === "") {
        el.classList.add("campo-pendiente");
        pendientes.push(el);
      }
    });

    return pendientes;
  }

  // Quitar la marca roja en cuanto el usuario complete el campo
  if (form) {
    const elementosInteractivos = form.querySelectorAll(
      "input, select, textarea"
    );

    elementosInteractivos.forEach((el) => {
      const tipo = el.type;

      if (
        tipo === "hidden" ||
        tipo === "button" ||
        tipo === "submit" ||
        tipo === "checkbox" ||
        tipo === "radio"
      ) {
        return;
      }

      if (el.readOnly || el.disabled) return;

      const limpiarPendiente = () => {
        const val = (el.value || "").trim();

        if (val !== "") {
          el.classList.remove("campo-pendiente");
        }
      };

      el.addEventListener("input", limpiarPendiente);
      el.addEventListener("change", limpiarPendiente);
    });
  }

  // ==================== Submit del formulario ====================
  function valueOf(id) {
    const el = $(id);
    return el ? el.value : "";
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // ---- Validación edad inicio tabaco (máx. 2 dígitos) ----
      const fumaValor = valueOf("Fuma_actualmente");
      const edadInicioVal = valueOf("Edad_inicio_tabaco");

      if (fumaValor === "1" && edadInicioVal !== "") {
        const n = Number(edadInicioVal);
        if (!Number.isInteger(n) || n < 0 || n > 99) {
          alert(
            "La edad en que comenzó a fumar debe ser un número entre 0 y 99."
          );
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

      // 🔍 Marcar campos pendientes y preguntar si desea continuar
      const pendientes = marcarCamposPendientes(form);

      if (pendientes.length > 0) {
        const continuar = window.confirm(
          "Todavía quedan preguntas sin contestar, ¿seguro que desea continuar?"
        );

        if (!continuar) {
          const primero = pendientes[0];
          primero.scrollIntoView({ behavior: "smooth", block: "center" });
          primero.focus();
          return;
        }
      }

      // Aseguramos que el IMC esté actualizado antes de enviar
      if (pesoInput && tallaInput && imcInput) {
        actualizarIMC();
      }

      // Tratamiento por DIABETES: variables 1=Sí, 2=No, null=No aplica
      const diagDiabetes = valueOf("Diagnostico_diabetes");
      const rawTratamientoDiabetes = valueOf("Tratamiento_diabetes");

      const chkTtoDieta = $("Tto_diab_dieta");
      const chkTtoADO = $("Tto_diab_ADO");
      const chkTtoInsulina = $("Tto_diab_insulina");
      const chkTtoOtro = $("Tto_diab_otro");

      let Tratamiento_diabetes_env;
      let ttoDieta;
      let ttoADO;
      let ttoInsulina;
      let ttoOtro;

      if (diagDiabetes === "1") {
        if (rawTratamientoDiabetes === "1") {
          Tratamiento_diabetes_env = "1";
          ttoDieta = chkTtoDieta?.checked ? "1" : "2";
          ttoADO = chkTtoADO?.checked ? "1" : "2";
          ttoInsulina = chkTtoInsulina?.checked ? "1" : "2";
          ttoOtro = chkTtoOtro?.checked ? "1" : "2";
        } else if (rawTratamientoDiabetes === "2") {
          Tratamiento_diabetes_env = "2";
          ttoDieta = null;
          ttoADO = null;
          ttoInsulina = null;
          ttoOtro = null;
        } else {
          Tratamiento_diabetes_env = null;
          ttoDieta = null;
          ttoADO = null;
          ttoInsulina = null;
          ttoOtro = null;
        }
      } else {
        Tratamiento_diabetes_env = null;
        ttoDieta = null;
        ttoADO = null;
        ttoInsulina = null;
        ttoOtro = null;
      }

      // Tratamiento HTA: 1=Con tratamiento, 2=Sin tratamiento, 3=Desconoce
      const diagHTA = valueOf("Diagnostico_HTA");
      const rawTratamientoHTA = valueOf("Tratamiento_HTA");

      const chkHTA_IECA = $("Tto_hta_IECA");
      const chkHTA_ARAII = $("Tto_hta_ARAII");
      const chkHTA_BB = $("Tto_hta_BB");
      const chkHTA_Diur = $("Tto_hta_diureticos");
      const chkHTA_Otros = $("Tto_hta_otros");

      let Tratamiento_HTA_env;
      let ttoHTA_IECA;
      let ttoHTA_ARAII;
      let ttoHTA_BB;
      let ttoHTA_diureticos;
      let ttoHTA_otros;

      if (diagHTA === "1") {
        if (rawTratamientoHTA === "1") {
          Tratamiento_HTA_env = "1";
          ttoHTA_IECA = chkHTA_IECA?.checked ? "1" : "2";
          ttoHTA_ARAII = chkHTA_ARAII?.checked ? "1" : "2";
          ttoHTA_BB = chkHTA_BB?.checked ? "1" : "2";
          ttoHTA_diureticos = chkHTA_Diur?.checked ? "1" : "2";
          ttoHTA_otros = chkHTA_Otros?.checked ? "1" : "2";
        } else if (rawTratamientoHTA === "2") {
          Tratamiento_HTA_env = "2";
          ttoHTA_IECA = null;
          ttoHTA_ARAII = null;
          ttoHTA_BB = null;
          ttoHTA_diureticos = null;
          ttoHTA_otros = null;
        } else if (rawTratamientoHTA === "3") {
          Tratamiento_HTA_env = "3";
          ttoHTA_IECA = null;
          ttoHTA_ARAII = null;
          ttoHTA_BB = null;
          ttoHTA_diureticos = null;
          ttoHTA_otros = null;
        } else {
          Tratamiento_HTA_env = null;
          ttoHTA_IECA = null;
          ttoHTA_ARAII = null;
          ttoHTA_BB = null;
          ttoHTA_diureticos = null;
          ttoHTA_otros = null;
        }
      } else {
        Tratamiento_HTA_env = null;
        ttoHTA_IECA = null;
        ttoHTA_ARAII = null;
        ttoHTA_BB = null;
        ttoHTA_diureticos = null;
        ttoHTA_otros = null;
      }

      // Calcular AUDIT-C para enviar a la base
      const freqAlc = valueOf("Frecuencia_alcohol");
      const cantAlc = valueOf("Cantidad_alcohol");
      const excesoAlc = valueOf("Exceso_ocasion");

      const auditScore = calcularAuditCDesdeValores(
        freqAlc,
        cantAlc,
        excesoAlc
      );

      // PHQ-2 y GAD-2 ya se interpretan en el narrativo;
      // acá sólo armamos el valor 0–6 para cada uno
      const parsePhqGadValue = (raw) => {
        if (!raw || raw === "null") return null;
        const n = Number(raw);
        if (Number.isNaN(n)) return null;
        if (n >= 0 && n <= 3) return n;
        if (n >= 1 && n <= 4) return n - 1;
        return null;
      };

      let phqScore = null;
      const phq1Score = parsePhqGadValue(valueOf("PHQ2_item1"));
      const phq2Score = parsePhqGadValue(valueOf("PHQ2_item2"));
      if (phq1Score !== null && phq2Score !== null) {
        phqScore = phq1Score + phq2Score;
      }

      let gadScore = null;
      const gad1Score = parsePhqGadValue(valueOf("GAD2_item1"));
      const gad2Score = parsePhqGadValue(valueOf("GAD2_item2"));
      if (gad1Score !== null && gad2Score !== null) {
        gadScore = gad1Score + gad2Score;
      }

      // Construcción del objeto para enviar
      const data = {
        // Identificación
        ID_paciente: valueOf("ID_paciente"),
        Fecha_consulta: valueOf("Fecha_consulta"),

        // Sociodemográficos
        Edad: valueOf("Edad"),
        Sexo_registrado: valueOf("Sexo_registrado"),
        Estado_civil: valueOf("Estado_civil"),
        Nivel_educativo: valueOf("Nivel_educativo"),
        Cobertura_salud: valueOf("Cobertura_salud"),
        Situacion_laboral: valueOf("Situacion_laboral"),

        // Vivienda
        Agua_potable: valueOf("Agua_potable"),
        Cloaca: valueOf("Cloaca"),

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

        // Puntaje AUDIT-C
        "audit-c": auditScore !== null ? String(auditScore) : "",

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
        "phq-2": phqScore !== null ? String(phqScore) : "",
        GAD2_item1: valueOf("GAD2_item1"),
        GAD2_item2: valueOf("GAD2_item2"),
        "gad-2": gadScore !== null ? String(gadScore) : "",

        // Salud general / tránsito
        Transito: valueOf("Transito"),
        Cantidad_medicamentos: valueOf("Cantidad_medicamentos"),

        // Prevención y tamizajes
        Vacunacion_dobleBacteriana: valueOf("Vacunacion_dobleBacteriana"),
        Vacunacion_antigripal: valueOf("Vacunacion_antigripal"),
        Vacunacion_neumococo: valueOf("Vacunacion_neumococo"),
        Mamografia: valueOf("Mamografia"),
        Papanicolau: valueOf("Papanicolau"),
        Cribado_colorrectal: valueOf("Cribado_colorrectal"),
      };

      // Generar y mostrar narrativo
      const narrativo = generarNarrativo(data);
      const narrativoEl = $("narrativo");
      if (narrativoEl) {
        narrativoEl.value = narrativo;
      }

      // Feedback al usuario
      if (botonEnviar) {
        botonEnviar.innerText = "¡Enviado!";
        botonEnviar.disabled = true;
      }
      if (nuevoRegistro) nuevoRegistro.style.display = "inline-block";

      // Envío al Apps Script
      fetch(
        "https://script.google.com/macros/s/AKfycbzs2Cu7rsI6brbFDzlyhgrZbOgVhjPVfOl2qlu5EREHG9SN6X7fDxzR4XYc3sIg4KgT4A/exec",
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
      if (form) form.reset();

      if (imcInput) imcInput.value = "";

      if (resultado) resultado.innerText = "";

      if (botonEnviar) {
        botonEnviar.disabled = false;
        botonEnviar.innerText = "Enviar";
      }

      nuevoRegistro.style.display = "none";

      const narrativoEl = $("narrativo");
      if (narrativoEl) narrativoEl.value = "";

      document
        .querySelectorAll(".campo-pendiente")
        .forEach((el) => el.classList.remove("campo-pendiente"));

        actualizarVisibilidadTabaco();
        actualizarVisibilidadAlcohol();
        actualizarVisibilidadDiabetes();
        actualizarVisibilidadHTA();
        actualizarVisibilidadTipoTratamientoHTA();
        actualizarVisibilidadAdherenciaHTA();
        actualizarVisibilidadPHQ2();
        actualizarVisibilidadGAD2();

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
            narrativoEl.select();
            document.execCommand("copy");
            alert("Narrativo copiado al portapapeles.");
          });
      } else {
        narrativoEl.select();
        document.execCommand("copy");
        alert("Narrativo copiado al portapapeles.");
      }
    });
  }
});