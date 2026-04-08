import { invokeLLM } from "./_core/llm";

/**
 * Texto completo del Acuerdo Escolar de Convivencia del Instituto Superior Colegio del Carmen.
 * Este texto sirve como marco normativo para el análisis de situaciones.
 */
const AEC_TEXTO = `
ACUERDO ESCOLAR DE CONVIVENCIA - INSTITUTO SUPERIOR COLEGIO DEL CARMEN
Código S.P.E.P.M 0437 - Nivel Secundario - Vigencia 2026

=== FUNDAMENTACIÓN Y PRINCIPIOS ===
El AEC se fundamenta en la Ley de Educación Nacional 26.206, la Resolución N° 623/13 del Ministerio de Cultura, Educación, Ciencias y Tecnología de la Provincia de Misiones y la Adhesión de la Resolución N° 018/14 del SPEPM.

La convivencia institucional se define como "la coexistencia física y práctica entre individuos o grupos que deben compartir un espacio en un clima saludable de armonía, alegría, confianza y productividad, que favorezca las condiciones básicas para las relaciones humanas de socialización y aprendizaje". Es una construcción colectiva caracterizada por la negociación, la colaboración, el consenso y la resolución pacífica de los conflictos.

=== VALORES INSTITUCIONALES ===
- Honestidad como recto proceder
- Espíritu de servicio y solidaridad
- Responsabilidad, asumiendo el compromiso de los propios actos
- Respeto frente a la diversidad
- Tolerancia frente a la infinidad de pensamientos y opiniones
- Disciplina, respetando las normativas vigentes
- Trabajo cooperativo
- Empatía frente al dolor de otros

=== COMPROMISOS DEL ALUMNO ===
- Tratar con respeto a todos los miembros de la comunidad educativa
- Mostrar tolerancia y respeto hacia la diversidad de opiniones, creencias y culturas
- Resolver los conflictos de manera pacífica, mediante el diálogo y la mediación
- Utilizar un lenguaje apropiado, evitando expresiones vulgares, agresivas, discriminatorias o irrespetuosas
- Cuidar las instalaciones, el mobiliario y las pertenencias propias y ajenas
- Asumir la responsabilidad por los daños causados
- Utilizar las redes sociales de manera responsable
- No ingresar a la institución con elementos peligrosos, armas, sustancias tóxicas o ilegales
- Cumplir con las normativas institucionales vigentes

=== FUNDAMENTOS DE LAS MEDIDAS DISCIPLINARIAS ===
Las sanciones en el campo educativo deben ser reparadoras y ejemplificadoras, evidenciando no solo un aprendizaje de la falta cometida, sino una formación constructiva. La indisciplina es "toda conducta que transgrede alguna norma". Las sanciones sirven para corregir conductas, favorecer el aprendizaje y deben sostener una proporcionalidad en relación a la transgresión cometida.

=== CRITERIOS PARA LA APLICACIÓN DE SANCIONES ===
a) Detectar y confirmar la conducta contraria a la normativa.
b) Priorizar el diálogo como estrategia para la resolución de conflictos.
c) Habilitar los canales necesarios para que los involucrados puedan dar su versión de los hechos.
d) Contextualizar la falta según el rol, las circunstancias, la trayectoria escolar del alumno y las reincidencias.
e) Adoptar medidas reparadoras progresivas: apercibimiento oral, apercibimiento escrito, amonestaciones, acciones reparadoras, reparación de objetos dañados, separación temporaria, separación definitiva.
f) Valorizar el contenido pedagógico y reparador de las sanciones.
g) Promover la reparación del daño o del agravio según la naturaleza de la falta.
h) Comprometer a la familia en la concientización de la falta cometida.

=== PROGRESIVIDAD DE LAS SANCIONES ===
1. Llamado de atención (verbal)
2. Apercibimiento: reiteración del llamado de atención verbal y registro escrito
3. Amonestaciones con aplicación de sanciones reparadoras (máximo 24 y media = "límite innegociable")
4. Acta de compromiso con el estudiante y sus tutores en faltas reiterativas o graves

=== CLASIFICACIÓN DE FALTAS ===

--- FALTAS LEVES ---
Son aquellas que no tienen un impacto grave en el entorno educativo, pero que son consideradas inapropiadas o irregulares.
Ejemplos:
- Interrumpir la clase con el fin de alterar su normal desarrollo
- Permanecer fuera del aula luego del toque de timbre sin justificativo
- Permanecer en las aulas durante los recreos sin autorización
- Usar un lenguaje inadecuado o gestos groseros u obscenos
- Atentar contra el cuidado y mantenimiento de la higiene y mobiliario del establecimiento
- Consumir alimentos y bebidas dentro del aula
- Asistir a clases con vestimentas inapropiadas que incumplan con el uniforme establecido

--- FALTAS GRAVES ---
Estas faltas afectan significativamente el orden, la disciplina y la sana convivencia de la institución.
Ejemplos:
- La reiteración o reincidencia en faltas leves
- Comportamiento disruptivo o agresivo hacia otros estudiantes, docentes o cualquier otro miembro de la comunidad (insultos, amenazas o agresiones escritas, verbales, físicas; uso de lenguaje vulgar o inapropiado)
- Incumplimiento de las normas establecidas por la institución
- Asentar leyendas, carteles o dibujos inadecuados en paredes, puertas, pizarrones, bancos o útiles escolares
- Dañar, destruir, romper, violentar mobiliarios o elementos de la institución o de los demás miembros
- Ausentarse del aula sin autorización del docente
- Incitación al desorden en las actividades dentro o fuera del establecimiento

--- FALTAS MUY GRAVES ---
Son faltas que ponen en riesgo la seguridad o el bienestar de la comunidad educativa o que comprometen la integridad de la institución.
Ejemplos:
- La reiteración o reincidencia en faltas graves
- Cualquier tipo de discriminación
- Amenazas o actos de intimidación
- Reaccionar de manera violenta, verbal o físicamente
- Incitar a cometer cualquier tipo de falta
- Tomar imágenes o realizar grabaciones sin autorización, afectando el derecho a la intimidad
- El no cumplimiento de las demás normativas vigentes (ej: Reglamento del Uso del Celular)
- Retirarse del establecimiento sin autorización
- Introducir, vender o consumir tabaco, bebidas alcohólicas, estimulantes, cigarrillos electrónicos o cualquier sustancia tóxica
- Falsificar, alterar o sustraer documentación
- Adoptar una conducta irrespetuosa ante los símbolos patrios
- Hurtar, robar o esconder cualquier elemento personal de los integrantes de la comunidad educativa
- Ingresar bajo los efectos de sustancias que alteren su estado habitual
- Ingresar y utilizar pirotecnia o artefactos explosivos
- Realizar compra-ventas de sustancias químicas ilegales
- Introducir armas u objetos corto-punzantes
- Conducta sexual fuera del marco de respeto
- Acoso, hostigamiento o persecución hacia cualquier miembro de la comunidad educativa
- "Límites innegociables": faltas graves repetidas que, pese a todas las instancias de intervención, muestran que el estudiante no se adecúa a las normas

=== CONSEJO ESCOLAR DE CONVIVENCIA ===
Órgano conformado por representantes de toda la comunidad educativa. Su objetivo es intervenir en la solución de conflictos, elaborando estrategias con medidas reparatorias para restablecer la buena convivencia escolar.
Integrantes: Rector/a, Vicerrector/a, Secretario/a académico, 2 integrantes del EdAyO, 2 profesores, 2 preceptores, 1 alumno del Ciclo Básico, 1 alumno del Ciclo Orientado y 1 padre de la comisión de Padres.
Funciones: tomar conocimiento y analizar conflictos, promover talleres concientizadores, propiciar espacios de mediación, dar seguimiento al cumplimiento del AEC.
`;

export interface DatosSituacion {
  fechaHecho: Date;
  cursoDivision: string;
  adultoInformante: string;
  rolInformante: string;
  descripcion: string;
  cantidadEstudiantes: number;
  estudiantesDescripcion?: string | null;
  contexto: string;
  contextoDetalle?: string | null;
  hayReincidencia: boolean;
  reincidenciaDetalle?: string | null;
  hayMedidasPrevias: boolean;
  medidasPreviasDetalle?: string | null;
}

export interface InformeIA {
  clasificacionSugerida: "leve" | "grave" | "muy_grave";
  nivelConfianza: "alto" | "medio" | "bajo";
  resumenSituacion: string;
  fundamentacionPedagogica: string;
  fundamentacionNormativa: string;
  apartadosAECReferenciados: string[];
  criteriosEvaluados: {
    intencionalidad: string;
    danoOcasionado: string;
    riesgoParaTerceros: string;
    reiteracion: string;
    trayectoriaEscolar: string;
  };
  medidasSugeridas: {
    tipo: string;
    descripcion: string;
    fundamentacion: string;
  }[];
  consideracionesEticas: string;
  alertas: string[];
}

export async function analizarSituacionConIA(datos: DatosSituacion): Promise<InformeIA> {
  const contextoMap: Record<string, string> = {
    aula: "dentro del aula durante el desarrollo de clases",
    recreo: "durante el recreo",
    pasillo: "en los pasillos del establecimiento",
    acto_escolar: "durante un acto o evento escolar",
    actividad_extracurricular: "en una actividad extracurricular o salida educativa",
    redes_sociales: "en redes sociales o medios digitales",
    otro: "en otro contexto escolar",
  };

  const rolMap: Record<string, string> = {
    docente: "docente",
    preceptor: "preceptor/a",
    edayo: "miembro del Equipo de Apoyo y Orientación (EdAyO)",
    directivo: "miembro del equipo directivo",
  };

  const situacionTexto = `
DATOS DE LA SITUACIÓN A ANALIZAR:
- Fecha del hecho: ${datos.fechaHecho.toLocaleDateString("es-AR")}
- Curso y división: ${datos.cursoDivision}
- Adulto informante: ${datos.adultoInformante} (${rolMap[datos.rolInformante] ?? datos.rolInformante})
- Descripción detallada: ${datos.descripcion}
- Cantidad de estudiantes involucrados: ${datos.cantidadEstudiantes}
${datos.estudiantesDescripcion ? `- Descripción de los estudiantes involucrados: ${datos.estudiantesDescripcion}` : ""}
- Contexto: ${contextoMap[datos.contexto] ?? datos.contexto}
${datos.contextoDetalle ? `- Detalle del contexto: ${datos.contextoDetalle}` : ""}
- ¿Hay reincidencia en conductas similares?: ${datos.hayReincidencia ? "SÍ" : "NO"}
${datos.hayReincidencia && datos.reincidenciaDetalle ? `- Detalle de reincidencias: ${datos.reincidenciaDetalle}` : ""}
- ¿Se adoptaron medidas previas?: ${datos.hayMedidasPrevias ? "SÍ" : "NO"}
${datos.hayMedidasPrevias && datos.medidasPreviasDetalle ? `- Detalle de medidas previas: ${datos.medidasPreviasDetalle}` : ""}
`;

  const systemPrompt = `Eres un sistema de apoyo pedagógico-institucional para el Instituto Superior Colegio del Carmen, especializado en convivencia escolar con enfoque educativo, preventivo y restaurativo. 

Tu función es analizar situaciones de convivencia escolar a la luz del Acuerdo Escolar de Convivencia (AEC) de la institución y generar informes orientativos para el equipo docente y directivo.

PRINCIPIOS ÉTICOS QUE DEBES RESPETAR SIEMPRE:
1. Enfoque educativo, preventivo y reparador: nunca punitivo ni automático
2. Respeto por la dignidad de los estudiantes: no estigmatización
3. Prioridad del diálogo y la mediación
4. Registro institucional responsable
5. Lenguaje claro, respetuoso y no punitivo
6. La clasificación es ORIENTATIVA, no definitiva. La decisión final corresponde al equipo institucional.
7. Siempre considerar el contexto, la trayectoria escolar y las circunstancias atenuantes

Tu respuesta debe ser un JSON estructurado con el siguiente esquema exacto. Responde ÚNICAMENTE con el JSON, sin texto adicional.`;

  const userPrompt = `${AEC_TEXTO}

${situacionTexto}

Analiza la situación descripta a la luz del Acuerdo Escolar de Convivencia del Instituto Superior Colegio del Carmen y genera un informe institucional completo. 

Responde con el siguiente JSON exacto:
{
  "clasificacionSugerida": "leve" | "grave" | "muy_grave",
  "nivelConfianza": "alto" | "medio" | "bajo",
  "resumenSituacion": "Resumen objetivo y neutral de la situación en 2-3 oraciones",
  "fundamentacionPedagogica": "Fundamentación desde la perspectiva pedagógica y educativa, considerando intencionalidad, contexto y trayectoria. Mínimo 3 oraciones.",
  "fundamentacionNormativa": "Fundamentación con referencia explícita al AEC, artículos y criterios aplicables. Mínimo 3 oraciones.",
  "apartadosAECReferenciados": ["Lista de apartados o criterios del AEC que aplican a esta situación"],
  "criteriosEvaluados": {
    "intencionalidad": "Análisis de la intencionalidad de la conducta",
    "danoOcasionado": "Análisis del daño ocasionado o potencial",
    "riesgoParaTerceros": "Análisis del riesgo para terceros o la comunidad",
    "reiteracion": "Análisis de la reiteración o reincidencia",
    "trayectoriaEscolar": "Consideraciones sobre la trayectoria escolar"
  },
  "medidasSugeridas": [
    {
      "tipo": "Tipo de medida (ej: llamado_atencion, apercibimiento_oral, etc.)",
      "descripcion": "Descripción concreta de la medida sugerida",
      "fundamentacion": "Por qué se sugiere esta medida"
    }
  ],
  "consideracionesEticas": "Consideraciones éticas importantes a tener en cuenta por el equipo institucional",
  "alertas": ["Lista de alertas o aspectos que requieren atención especial, si los hubiera"]
}`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "informe_convivencia",
        strict: true,
        schema: {
          type: "object",
          properties: {
            clasificacionSugerida: { type: "string", enum: ["leve", "grave", "muy_grave"] },
            nivelConfianza: { type: "string", enum: ["alto", "medio", "bajo"] },
            resumenSituacion: { type: "string" },
            fundamentacionPedagogica: { type: "string" },
            fundamentacionNormativa: { type: "string" },
            apartadosAECReferenciados: { type: "array", items: { type: "string" } },
            criteriosEvaluados: {
              type: "object",
              properties: {
                intencionalidad: { type: "string" },
                danoOcasionado: { type: "string" },
                riesgoParaTerceros: { type: "string" },
                reiteracion: { type: "string" },
                trayectoriaEscolar: { type: "string" },
              },
              required: ["intencionalidad", "danoOcasionado", "riesgoParaTerceros", "reiteracion", "trayectoriaEscolar"],
              additionalProperties: false,
            },
            medidasSugeridas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  tipo: { type: "string" },
                  descripcion: { type: "string" },
                  fundamentacion: { type: "string" },
                },
                required: ["tipo", "descripcion", "fundamentacion"],
                additionalProperties: false,
              },
            },
            consideracionesEticas: { type: "string" },
            alertas: { type: "array", items: { type: "string" } },
          },
          required: [
            "clasificacionSugerida",
            "nivelConfianza",
            "resumenSituacion",
            "fundamentacionPedagogica",
            "fundamentacionNormativa",
            "apartadosAECReferenciados",
            "criteriosEvaluados",
            "medidasSugeridas",
            "consideracionesEticas",
            "alertas",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No se recibió respuesta del sistema de análisis");

  const parsed: InformeIA = typeof content === "string" ? JSON.parse(content) : content;
  return parsed;
}
