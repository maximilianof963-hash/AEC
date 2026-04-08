import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ChevronRight,
  Eye,
  History,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useLocation } from "wouter";

const clasificacionConfig: Record<string, { label: string; className: string }> = {
  leve: { label: "Leve", className: "badge-leve" },
  grave: { label: "Grave", className: "badge-grave" },
  muy_grave: { label: "Muy Grave", className: "badge-muy-grave" },
};

const estadoLabels: Record<string, { label: string; className: string }> = {
  pendiente_analisis: { label: "Pendiente", className: "badge-pendiente" },
  analizado: { label: "Analizado", className: "badge-en-seguimiento" },
  en_seguimiento: { label: "En Seguimiento", className: "badge-en-seguimiento" },
  resuelto: { label: "Resuelto", className: "badge-resuelto" },
  derivado_consejo: { label: "Derivado al Consejo", className: "badge-derivado" },
};

const contextoLabels: Record<string, string> = {
  aula: "Aula",
  recreo: "Recreo",
  pasillo: "Pasillo",
  acto_escolar: "Acto escolar",
  actividad_extracurricular: "Act. extracurricular",
  redes_sociales: "Redes sociales",
  otro: "Otro",
};

export default function Seguimiento() {
  const [, setLocation] = useLocation();
  const { data: situaciones, isLoading, refetch } = trpc.situaciones.conReincidencia.useQuery();

  const enSeguimiento = situaciones?.filter(s => s.estado === "en_seguimiento") ?? [];
  const derivados = situaciones?.filter(s => s.estado === "derivado_consejo") ?? [];
  const conReincidencia = situaciones?.filter(s => s.hayReincidencia && s.estado !== "resuelto") ?? [];

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Seguimiento de Casos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Situaciones activas, con reincidencia o derivadas al Consejo Escolar de Convivencia
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="text-xs"
        >
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Actualizar
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">

          {/* Derivados al Consejo */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <h2 className="text-sm font-semibold text-foreground">
                Derivados al Consejo Escolar de Convivencia
              </h2>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                {derivados.length}
              </span>
            </div>
            {derivados.length === 0 ? (
              <Card className="border border-dashed border-border">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">No hay situaciones derivadas al Consejo actualmente.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {derivados.map(s => <SituacionCard key={s.id} situacion={s} onView={() => setLocation(`/situacion/${s.id}`)} />)}
              </div>
            )}
          </section>

          {/* En seguimiento activo */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <h2 className="text-sm font-semibold text-foreground">
                En Seguimiento Activo
              </h2>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                {enSeguimiento.length}
              </span>
            </div>
            {enSeguimiento.length === 0 ? (
              <Card className="border border-dashed border-border">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">No hay situaciones en seguimiento activo.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {enSeguimiento.map(s => <SituacionCard key={s.id} situacion={s} onView={() => setLocation(`/situacion/${s.id}`)} />)}
              </div>
            )}
          </section>

          {/* Con reincidencia */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                Situaciones con Reincidencia Registrada
              </h2>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                {conReincidencia.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Estas situaciones requieren especial atención ya que involucran conductas reiteradas.
            </p>
            {conReincidencia.length === 0 ? (
              <Card className="border border-dashed border-border">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">No se registran situaciones con reincidencia activas.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {conReincidencia.map(s => <SituacionCard key={s.id} situacion={s} onView={() => setLocation(`/situacion/${s.id}`)} highlight />)}
              </div>
            )}
          </section>

        </div>
      )}

      {/* Información sobre el Consejo */}
      <Card className="border border-border bg-muted/30 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <History className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Consejo Escolar de Convivencia</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                El Consejo Escolar de Convivencia es el órgano institucional encargado de intervenir en la solución de conflictos, 
                elaborar estrategias con medidas reparatorias y propiciar espacios de mediación. 
                Está conformado por el Rector/a, Vicerrector/a, Secretario/a académico, integrantes del EdAyO, 
                profesores, preceptores, alumnos representantes y un padre de la comisión de Padres.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SituacionCard({
  situacion,
  onView,
  highlight = false,
}: {
  situacion: any;
  onView: () => void;
  highlight?: boolean;
}) {
  const clasif = situacion.clasificacionSugerida ? clasificacionConfig[situacion.clasificacionSugerida] : null;
  const estado = estadoLabels[situacion.estado];

  return (
    <Card
      className={`border shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary/30 ${highlight ? "border-amber-200 bg-amber-50/30" : "border-border"}`}
      onClick={onView}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                {situacion.cursoDivision}
              </span>
              <span className="text-xs text-muted-foreground">
                {contextoLabels[situacion.contexto] ?? situacion.contexto}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(situacion.fechaHecho).toLocaleDateString("es-AR")}
              </span>
              {situacion.hayReincidencia && (
                <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Reincidencia
                </span>
              )}
            </div>
            <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
              {situacion.descripcion}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Informado por: <span className="font-medium">{situacion.adultoInformante}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            {clasif ? (
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${clasif.className}`}>
                {clasif.label}
              </span>
            ) : (
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold badge-pendiente">Sin analizar</span>
            )}
            <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${estado.className}`}>
              {estado.label}
            </span>
            <Eye className="h-3.5 w-3.5 text-muted-foreground/50" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
