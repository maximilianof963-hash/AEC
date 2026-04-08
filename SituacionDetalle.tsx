import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  History,
  Loader2,
  Plus,
  Printer,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { Streamdown } from "streamdown";

const clasificacionConfig: Record<string, { label: string; className: string; icon: any; color: string }> = {
  leve: { label: "Falta Leve", className: "badge-leve", icon: ShieldCheck, color: "text-amber-600" },
  grave: { label: "Falta Grave", className: "badge-grave", icon: ShieldAlert, color: "text-orange-600" },
  muy_grave: { label: "Falta Muy Grave", className: "badge-muy-grave", icon: AlertTriangle, color: "text-red-600" },
};

const estadoLabels: Record<string, string> = {
  pendiente_analisis: "Pendiente de Análisis",
  analizado: "Analizado",
  en_seguimiento: "En Seguimiento",
  resuelto: "Resuelto",
  derivado_consejo: "Derivado al Consejo",
};

const tipoAccionLabels: Record<string, string> = {
  llamado_atencion: "Llamado de atención",
  apercibimiento_oral: "Apercibimiento oral",
  apercibimiento_escrito: "Apercibimiento escrito",
  amonestacion: "Amonestación",
  accion_reparadora: "Acción reparadora",
  acta_compromiso: "Acta de compromiso",
  derivacion_consejo: "Derivación al Consejo Escolar",
  intervencion_familiar: "Intervención familiar",
  separacion_temporaria: "Separación temporaria",
  otro: "Otra acción",
};

const contextoLabels: Record<string, string> = {
  aula: "Aula / Clase",
  recreo: "Recreo",
  pasillo: "Pasillo / Espacios comunes",
  acto_escolar: "Acto o evento escolar",
  actividad_extracurricular: "Actividad extracurricular",
  redes_sociales: "Redes sociales / Medios digitales",
  otro: "Otro contexto",
};

interface SeguimientoForm {
  tipoAccion: string;
  descripcion: string;
  fechaAccion: string;
  observaciones: string;
}

export default function SituacionDetalle() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id ?? "0");
  const [, setLocation] = useLocation();
  const [showSeguimientoForm, setShowSeguimientoForm] = useState(false);
  const utils = trpc.useUtils();

  const { data: situacion, isLoading } = trpc.situaciones.obtener.useQuery({ id });
  const { data: seguimientos } = trpc.seguimientos.listarPorSituacion.useQuery({ situacionId: id });

  const analizarMutation = trpc.situaciones.analizar.useMutation({
    onSuccess: () => {
      toast.success("Análisis completado correctamente");
      utils.situaciones.obtener.invalidate({ id });
    },
    onError: (error) => {
      toast.error(`Error en el análisis: ${error.message}`);
    },
  });

  const actualizarEstadoMutation = trpc.situaciones.actualizarEstado.useMutation({
    onSuccess: () => {
      toast.success("Estado actualizado");
      utils.situaciones.obtener.invalidate({ id });
    },
  });

  const crearSeguimientoMutation = trpc.seguimientos.crear.useMutation({
    onSuccess: () => {
      toast.success("Seguimiento registrado");
      utils.seguimientos.listarPorSituacion.invalidate({ situacionId: id });
      utils.situaciones.obtener.invalidate({ id });
      setShowSeguimientoForm(false);
      reset();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<SeguimientoForm>({
    defaultValues: { fechaAccion: new Date().toISOString().split("T")[0] },
  });

  const onSubmitSeguimiento = (data: SeguimientoForm) => {
    crearSeguimientoMutation.mutate({
      situacionId: id,
      tipoAccion: data.tipoAccion as any,
      descripcion: data.descripcion,
      fechaAccion: new Date(data.fechaAccion + "T12:00:00.000Z").toISOString(),
      observaciones: data.observaciones || null,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!situacion) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Situación no encontrada.</p>
        <Button variant="link" onClick={() => setLocation("/historial")}>Volver al historial</Button>
      </div>
    );
  }

  const informe = situacion.informeIA as any;
  const clasif = situacion.clasificacionSugerida ? clasificacionConfig[situacion.clasificacionSugerida] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="cursor-pointer hover:text-foreground" onClick={() => setLocation("/")}>Panel</span>
        <ChevronRight className="h-3 w-3" />
        <span className="cursor-pointer hover:text-foreground" onClick={() => setLocation("/historial")}>Historial</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Situación #{situacion.id}</span>
      </div>

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Situación de Convivencia #{situacion.id}
          </h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
              {situacion.cursoDivision}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(situacion.fechaHecho).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}
            </span>
            {clasif && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${clasif.className}`}>
                {clasif.label}
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded font-medium badge-${situacion.estado === "resuelto" ? "resuelto" : situacion.estado === "derivado_consejo" ? "derivado" : "en-seguimiento"}`}>
              {estadoLabels[situacion.estado]}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 no-print">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="text-xs"
          >
            <Printer className="mr-1.5 h-3.5 w-3.5" />
            Imprimir
          </Button>
          {!informe && (
            <Button
              size="sm"
              onClick={() => analizarMutation.mutate({ id })}
              disabled={analizarMutation.isPending}
              className="bg-primary text-primary-foreground text-xs"
            >
              {analizarMutation.isPending ? (
                <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Analizando...</>
              ) : (
                <><Brain className="mr-1.5 h-3.5 w-3.5" />Analizar con IA</>
              )}
            </Button>
          )}
          {informe && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => analizarMutation.mutate({ id })}
              disabled={analizarMutation.isPending}
              className="text-xs"
            >
              {analizarMutation.isPending ? (
                <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Reanalizar...</>
              ) : (
                <><RefreshCw className="mr-1.5 h-3.5 w-3.5" />Reanalizar</>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Datos del hecho */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Datos del Hecho Registrado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Fecha</p>
              <p className="mt-1 font-medium">{new Date(situacion.fechaHecho).toLocaleDateString("es-AR")}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Curso</p>
              <p className="mt-1 font-medium">{situacion.cursoDivision}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Adulto informante</p>
              <p className="mt-1 font-medium">{situacion.adultoInformante}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Contexto</p>
              <p className="mt-1 font-medium">{contextoLabels[situacion.contexto]}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Descripción de la situación</p>
            <p className="text-sm text-foreground leading-relaxed bg-muted/40 rounded-lg p-3">
              {situacion.descripcion}
            </p>
          </div>

          {situacion.estudiantesDescripcion && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">
                Estudiantes involucrados ({situacion.cantidadEstudiantes})
              </p>
              <p className="text-sm text-foreground leading-relaxed bg-muted/40 rounded-lg p-3">
                {situacion.estudiantesDescripcion}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`rounded-lg p-3 ${situacion.hayReincidencia ? "bg-amber-50 border border-amber-200" : "bg-muted/30"}`}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Reincidencia</p>
              <p className={`text-sm font-medium ${situacion.hayReincidencia ? "text-amber-700" : "text-muted-foreground"}`}>
                {situacion.hayReincidencia ? "Sí — hay reincidencia" : "No se registra reincidencia"}
              </p>
              {situacion.reincidenciaDetalle && (
                <p className="text-xs text-muted-foreground mt-1">{situacion.reincidenciaDetalle}</p>
              )}
            </div>
            <div className={`rounded-lg p-3 ${situacion.hayMedidasPrevias ? "bg-blue-50 border border-blue-200" : "bg-muted/30"}`}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Medidas previas</p>
              <p className={`text-sm font-medium ${situacion.hayMedidasPrevias ? "text-blue-700" : "text-muted-foreground"}`}>
                {situacion.hayMedidasPrevias ? "Sí — se adoptaron medidas previas" : "No se adoptaron medidas previas"}
              </p>
              {situacion.medidasPreviasDetalle && (
                <p className="text-xs text-muted-foreground mt-1">{situacion.medidasPreviasDetalle}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informe IA */}
      {analizarMutation.isPending && (
        <Card className="border border-primary/30 bg-primary/5 shadow-sm">
          <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
            <Brain className="h-8 w-8 text-primary animate-pulse" />
            <p className="text-sm font-semibold text-primary">Analizando la situación...</p>
            <p className="text-xs text-muted-foreground">
              El sistema está contrastando la situación con el Acuerdo Escolar de Convivencia. Esto puede tardar unos segundos.
            </p>
          </CardContent>
        </Card>
      )}

      {informe && (
        <Card className="border border-border shadow-sm" id="informe-ia">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  Informe de Análisis Institucional
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Generado a partir del Acuerdo Escolar de Convivencia — Instituto Superior Colegio del Carmen
                </CardDescription>
              </div>
              {clasif && (
                <div className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl ${clasif.className}`}>
                  <clasif.icon className={`h-5 w-5 ${clasif.color}`} />
                  <span className="text-xs font-bold">{clasif.label}</span>
                  <span className="text-[10px] opacity-70">Clasificación sugerida</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">

            {/* Aviso pedagógico */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Clasificación orientativa:</strong> Esta evaluación es un apoyo a la toma de decisiones institucionales. 
                La clasificación final y las medidas a adoptar son responsabilidad del equipo institucional, considerando el contexto completo y el criterio pedagógico.
              </p>
            </div>

            {/* Resumen */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Resumen de la Situación</h3>
              <p className="text-sm text-foreground leading-relaxed bg-muted/30 rounded-lg p-3">
                {informe.resumenSituacion}
              </p>
            </div>

            <Separator />

            {/* Criterios evaluados */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Criterios Pedagógicos Evaluados</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: "intencionalidad", label: "Intencionalidad" },
                  { key: "danoOcasionado", label: "Daño ocasionado" },
                  { key: "riesgoParaTerceros", label: "Riesgo para terceros" },
                  { key: "reiteracion", label: "Reiteración / Reincidencia" },
                  { key: "trayectoriaEscolar", label: "Trayectoria escolar" },
                ].map(({ key, label }) => (
                  <div key={key} className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
                    <p className="text-xs text-foreground leading-relaxed">{informe.criteriosEvaluados?.[key]}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Fundamentación pedagógica */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Fundamentación Pedagógica</h3>
              <div className="text-sm text-foreground leading-relaxed bg-muted/30 rounded-lg p-4">
                <Streamdown>{informe.fundamentacionPedagogica}</Streamdown>
              </div>
            </div>

            {/* Fundamentación normativa */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Fundamentación Normativa (AEC)</h3>
              <div className="text-sm text-foreground leading-relaxed bg-muted/30 rounded-lg p-4">
                <Streamdown>{informe.fundamentacionNormativa}</Streamdown>
              </div>
            </div>

            {/* Apartados del AEC referenciados */}
            {informe.apartadosAECReferenciados?.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  Apartados del AEC Referenciados
                </h3>
                <div className="flex flex-wrap gap-2">
                  {informe.apartadosAECReferenciados.map((apartado: string, i: number) => (
                    <span key={i} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium border border-primary/20">
                      {apartado}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Medidas sugeridas */}
            {informe.medidasSugeridas?.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-1.5">
                  <ClipboardCheck className="h-3.5 w-3.5" />
                  Medidas Reparadoras Sugeridas
                </h3>
                <div className="space-y-3">
                  {informe.medidasSugeridas.map((medida: any, i: number) => (
                    <div key={i} className="border border-border rounded-lg p-3 bg-card">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{medida.descripcion}</p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{medida.fundamentacion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Consideraciones éticas */}
            {informe.consideracionesEticas && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Consideraciones Éticas
                </h3>
                <p className="text-xs text-blue-800 leading-relaxed">{informe.consideracionesEticas}</p>
              </div>
            )}

            {/* Alertas */}
            {informe.alertas?.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-red-700 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Alertas
                </h3>
                <ul className="space-y-1">
                  {informe.alertas.map((alerta: string, i: number) => (
                    <li key={i} className="text-xs text-red-800 flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      {alerta}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Gestión del estado */}
      <Card className="border border-border shadow-sm no-print">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            Estado del Caso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Select
              value={situacion.estado}
              onValueChange={(v) => actualizarEstadoMutation.mutate({ id, estado: v as any })}
            >
              <SelectTrigger className="text-sm w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendiente_analisis">Pendiente de Análisis</SelectItem>
                <SelectItem value="analizado">Analizado</SelectItem>
                <SelectItem value="en_seguimiento">En Seguimiento</SelectItem>
                <SelectItem value="resuelto">Resuelto</SelectItem>
                <SelectItem value="derivado_consejo">Derivado al Consejo Escolar</SelectItem>
              </SelectContent>
            </Select>
            {actualizarEstadoMutation.isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
        </CardContent>
      </Card>

      {/* Seguimientos */}
      <Card className="border border-border shadow-sm no-print">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-primary" />
              Registro de Seguimiento y Medidas Adoptadas
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowSeguimientoForm(!showSeguimientoForm)}
              className="text-xs"
            >
              <Plus className="mr-1.5 h-3 w-3" />
              Registrar acción
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showSeguimientoForm && (
            <form onSubmit={handleSubmit(onSubmitSeguimiento)} className="border border-border rounded-lg p-4 bg-muted/20 space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Nueva acción de seguimiento</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Tipo de acción *</Label>
                  <Controller
                    name="tipoAccion"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="text-sm h-8">
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(tipoAccionLabels).map(([v, l]) => (
                            <SelectItem key={v} value={v}>{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Fecha de la acción *</Label>
                  <Input
                    type="date"
                    {...register("fechaAccion", { required: true })}
                    className="text-sm h-8"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Descripción de la acción *</Label>
                <Textarea
                  {...register("descripcion", { required: true })}
                  placeholder="Describa la acción realizada..."
                  rows={2}
                  className="text-sm resize-none"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Observaciones adicionales</Label>
                <Textarea
                  {...register("observaciones")}
                  placeholder="Observaciones sobre el resultado o contexto de la acción..."
                  rows={2}
                  className="text-sm resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button type="submit" size="sm" disabled={crearSeguimientoMutation.isPending} className="text-xs bg-primary text-primary-foreground">
                  {crearSeguimientoMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Guardar"}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowSeguimientoForm(false)} className="text-xs">
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          {!seguimientos?.length ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No se han registrado acciones de seguimiento aún.
            </p>
          ) : (
            <div className="space-y-3">
              {seguimientos.map((seg) => (
                <div key={seg.id} className="border border-border rounded-lg p-3 bg-card">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {tipoAccionLabels[seg.tipoAccion]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(seg.fechaAccion).toLocaleDateString("es-AR")}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{seg.descripcion}</p>
                      {seg.observaciones && (
                        <p className="text-xs text-muted-foreground mt-1">{seg.observaciones}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
