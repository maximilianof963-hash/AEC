import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, ChevronRight, Scale, ShieldCheck, Users } from "lucide-react";

const seccionesAEC = [
  {
    id: "fundamentacion",
    titulo: "Fundamentación y Principios",
    icon: BookOpen,
    contenido: `El Acuerdo Escolar de Convivencia (AEC) del Instituto Superior Colegio del Carmen se fundamenta en la Ley de Educación Nacional 26.206, la Resolución N° 623/13 del Ministerio de Cultura, Educación, Ciencias y Tecnología de la Provincia de Misiones y la Adhesión de la Resolución N° 018/14 del Servicio Provincial de Enseñanza Privada de Misiones (SPEPM).

La convivencia institucional se define como "la coexistencia física y práctica entre individuos o grupos que deben compartir un espacio en un clima saludable de armonía, alegría, confianza y productividad, que favorezca las condiciones básicas para las relaciones humanas de socialización y aprendizaje". Es una construcción colectiva caracterizada por la negociación, la colaboración, el consenso y la resolución pacífica de los conflictos.`,
  },
  {
    id: "valores",
    titulo: "Valores Institucionales",
    icon: ShieldCheck,
    contenido: `Los valores que el Instituto Superior Colegio del Carmen se propone vivir y enseñar son:

• Honestidad como recto proceder, implicando buen comportamiento, decencia y decoro en todo momento.
• Espíritu de servicio y solidaridad.
• Responsabilidad, asumiendo siempre el compromiso de los propios actos.
• Respeto frente a la diversidad.
• Tolerancia frente a la infinidad de pensamientos y opiniones de los demás.
• Disciplina, respetando siempre las normativas vigentes.
• Trabajo cooperativo, en donde se reflejen los valores antes mencionados.
• Empatía frente al dolor de otros.`,
  },
  {
    id: "criterios",
    titulo: "Criterios para la Aplicación de Medidas",
    icon: Scale,
    contenido: `Para la aplicación de cualquier medida disciplinaria se tendrá en cuenta:

a) Análisis de la situación y sus causales. Es fundamental conocer plenamente el hecho ocurrido, recopilando toda la información necesaria para una evaluación justa y criteriosa.

b) Escuchar a todas las partes involucradas, permitiéndoles realizar su descargo, garantizando al estudiante el derecho a ser escuchado.

c) Se utilizará el diálogo y, de ser necesario, se solicitará la mediación a través del Consejo Escolar de Convivencia.

d) Valorizar el reconocimiento del error. Se reflexionará sobre el accionar y las consecuencias de las actitudes.

e) Atender a la gradualidad de las sanciones según la gravedad de la falta.

f) Comunicación de la situación y registro escrito firmado de las medidas disciplinarias tomadas.

g) Se evaluará y determinará la gravedad de las faltas cometidas para aplicar las sanciones correspondientes.

h) Las faltas que afecten económicamente a la Institución deberán ser reparadas por el tutor responsable.`,
  },
  {
    id: "progresividad",
    titulo: "Progresividad de las Sanciones",
    icon: Scale,
    contenido: `Las medidas se aplican de manera progresiva y proporcional:

1. Llamado de atención (verbal): Primera intervención ante una conducta inapropiada.

2. Apercibimiento: Reiteración del llamado de atención verbal y registro por escrito.

3. Amonestaciones con aplicación de sanciones reparadoras: Cuando el estudiante sea sancionado con 24 amonestaciones y media, se considerará que ha llegado a "límites innegociables".

4. Acta de compromiso: Se realizarán actas acuerdo con el estudiante y sus tutores en aquellas situaciones donde las faltas sean reiterativas o graves.`,
  },
  {
    id: "leves",
    titulo: "Faltas Leves",
    icon: ShieldCheck,
    contenido: `Son aquellas que no tienen un impacto grave en el entorno educativo, pero que son consideradas inapropiadas o irregulares.

Ejemplos de faltas leves:
• Interrumpir la clase con el fin de alterar su normal desarrollo.
• Permanecer fuera del aula luego del toque de timbre sin justificativo.
• Permanecer en las aulas durante los recreos sin autorización.
• Usar un lenguaje inadecuado o gestos groseros u obscenos.
• Atentar contra el cuidado y mantenimiento de la higiene y mobiliario del establecimiento.
• Consumir alimentos y bebidas dentro del aula.
• Asistir a clases con vestimentas inapropiadas que incumplan con el uniforme establecido.`,
  },
  {
    id: "graves",
    titulo: "Faltas Graves",
    icon: ShieldCheck,
    contenido: `Estas faltas afectan significativamente el orden, la disciplina y la sana convivencia de la institución.

Ejemplos de faltas graves:
• La reiteración o reincidencia en faltas leves.
• Comportamiento disruptivo o agresivo hacia otros estudiantes, docentes o cualquier otro miembro de la comunidad (insultos, amenazas o agresiones escritas, verbales, físicas; uso de lenguaje vulgar o inapropiado).
• Incumplimiento de las normas establecidas por la institución.
• Asentar leyendas, carteles o dibujos inadecuados en paredes, puertas, pizarrones, bancos o útiles escolares.
• Dañar, destruir, romper, violentar mobiliarios o elementos de la institución o de los demás miembros.
• Ausentarse del aula sin autorización del docente.
• Incitación al desorden en las actividades dentro o fuera del establecimiento.`,
  },
  {
    id: "muy-graves",
    titulo: "Faltas Muy Graves",
    icon: ShieldCheck,
    contenido: `Son faltas que ponen en riesgo la seguridad o el bienestar de la comunidad educativa o que comprometen la integridad de la institución.

Ejemplos de faltas muy graves:
• La reiteración o reincidencia en faltas graves.
• Cualquier tipo de discriminación.
• Amenazas o actos de intimidación.
• Reaccionar de manera violenta, verbal o físicamente.
• Incitar a cometer cualquier tipo de falta.
• Tomar imágenes o realizar grabaciones sin autorización, afectando el derecho a la intimidad.
• Retirarse del establecimiento sin autorización.
• Introducir, vender o consumir tabaco, bebidas alcohólicas, estimulantes, cigarrillos electrónicos o cualquier sustancia tóxica.
• Falsificar, alterar o sustraer documentación.
• Adoptar una conducta irrespetuosa ante los símbolos patrios.
• Hurtar, robar o esconder cualquier elemento personal.
• Ingresar bajo los efectos de sustancias que alteren su estado habitual.
• Ingresar y utilizar pirotecnia o artefactos explosivos.
• Realizar compra-ventas de sustancias químicas ilegales.
• Introducir armas u objetos corto-punzantes.
• Conducta sexual fuera del marco de respeto.
• Acoso, hostigamiento o persecución hacia cualquier miembro de la comunidad educativa.
• "Límites innegociables": faltas graves repetidas que, pese a todas las instancias de intervención, muestran que el estudiante no se adecúa a las normas.`,
  },
  {
    id: "consejo",
    titulo: "Consejo Escolar de Convivencia",
    icon: Users,
    contenido: `El Consejo Escolar de Convivencia es el órgano conformado por miembros representantes de toda la comunidad educativa. Su objetivo es intervenir en la solución de conflictos, elaborando estrategias con medidas reparatorias de manera que se logre restablecer la buena convivencia escolar.

Integrantes: Rector/a, Vicerrector/a, Secretario/a académico, 2 integrantes del EdAyO, 2 profesores, 2 preceptores, 1 alumno del Ciclo Básico, 1 alumno del Ciclo Orientado y 1 padre de la comisión de Padres.

Funciones:
• Tomar conocimiento, analizar, establecer las medidas a seguir frente a cada conflicto y documentar en actas.
• Promover talleres o charlas concientizadoras.
• Propiciar siempre espacios de mediación para la resolución de situaciones conflictivas.
• Dar seguimiento al cumplimiento de las disposiciones establecidas en el Acuerdo de Convivencia.
• Proponer y viabilizar estrategias que permitan buscar siempre la resolución de conflictos.`,
  },
];

export default function AEC() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Panel</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Acuerdo Escolar de Convivencia</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Acuerdo Escolar de Convivencia
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Instituto Superior Colegio del Carmen — Nivel Secundario — Código S.P.E.P.M 0437 — Vigencia 2026
        </p>
      </div>

      {/* Presentación */}
      <Card className="border border-primary/20 bg-primary/5 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-primary mb-2">Marco Normativo Institucional</p>
              <p className="text-sm text-foreground leading-relaxed italic">
                "Nuestro Acuerdo Escolar de Convivencia tiene como finalidad propiciar un ambiente escolar armónico, 
                solidario y colaborativo siempre en pos de una educación de calidad que forme integralmente a nuestros 
                alumnos como ciudadanos activos y responsables."
              </p>
              <p className="text-xs text-muted-foreground mt-2">— Presentación del Rector, AEC 2026</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Índice */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">Índice de Secciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {seccionesAEC.map((seccion) => (
              <a
                key={seccion.id}
                href={`#${seccion.id}`}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
              >
                <ChevronRight className="h-3 w-3 shrink-0" />
                {seccion.titulo}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Secciones del AEC */}
      {seccionesAEC.map((seccion, index) => (
        <Card key={seccion.id} id={seccion.id} className="border border-border shadow-sm scroll-mt-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <seccion.icon className="h-4 w-4 text-primary" />
              {seccion.titulo}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {seccion.contenido}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Nota al pie */}
      <Card className="border border-border bg-muted/30 shadow-sm">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            El presente Acuerdo Escolar de Convivencia fue elaborado y consensuado entre los actores de la Comunidad Educativa 
            del Instituto Superior Colegio del Carmen. Una vez aprobado por el SPEPM, tendrá vigencia por cuatro años. 
            Está sujeto a revisión y actualización de acuerdo a las necesidades reales de la institución.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
