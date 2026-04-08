import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Eye,
  Filter,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const clasificacionLabels: Record<string, { label: string; className: string }> = {
  leve: { label: "Leve", className: "badge-leve" },
  grave: { label: "Grave", className: "badge-grave" },
  muy_grave: { label: "Muy Grave", className: "badge-muy-grave" },
};

const estadoLabels: Record<string, { label: string; className: string }> = {
  pendiente_analisis: { label: "Pendiente de Análisis", className: "badge-pendiente" },
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

export default function Historial() {
  const [, setLocation] = useLocation();
  const [page, setPage] = useState(1);
  const [filtros, setFiltros] = useState({
    cursoDivision: "",
    clasificacion: "",
    estado: "",
  });
  const [filtrosAplicados, setFiltrosAplicados] = useState(filtros);
  const [showFiltros, setShowFiltros] = useState(false);

  const { data, isLoading } = trpc.situaciones.listar.useQuery({
    page,
    pageSize: 15,
    cursoDivision: filtrosAplicados.cursoDivision || undefined,
    clasificacion: (filtrosAplicados.clasificacion as any) || undefined,
    estado: filtrosAplicados.estado || undefined,
  });

  const totalPages = data ? Math.ceil(data.total / 15) : 1;

  const aplicarFiltros = () => {
    setFiltrosAplicados(filtros);
    setPage(1);
    setShowFiltros(false);
  };

  const limpiarFiltros = () => {
    const empty = { cursoDivision: "", clasificacion: "", estado: "" };
    setFiltros(empty);
    setFiltrosAplicados(empty);
    setPage(1);
  };

  const hayFiltrosActivos = filtrosAplicados.cursoDivision || filtrosAplicados.clasificacion || filtrosAplicados.estado;

  return (
    <div className="space-y-5">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Historial de Situaciones</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data ? `${data.total} situaciones registradas` : "Cargando..."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFiltros(!showFiltros)}
            className={`text-sm ${hayFiltrosActivos ? "border-primary text-primary" : ""}`}
          >
            <Filter className="mr-2 h-3.5 w-3.5" />
            Filtros
            {hayFiltrosActivos && (
              <span className="ml-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">!</span>
            )}
          </Button>
          <Button
            size="sm"
            onClick={() => setLocation("/nueva-situacion")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
          >
            Nueva Situación
          </Button>
        </div>
      </div>

      {/* Panel de filtros */}
      {showFiltros && (
        <Card className="border border-border shadow-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Curso / División</label>
                <Input
                  placeholder="Ej: 3° A"
                  value={filtros.cursoDivision}
                  onChange={(e) => setFiltros(f => ({ ...f, cursoDivision: e.target.value }))}
                  className="text-sm h-8"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Clasificación</label>
                <Select value={filtros.clasificacion} onValueChange={(v) => setFiltros(f => ({ ...f, clasificacion: v === "todos" ? "" : v }))}>
                  <SelectTrigger className="text-sm h-8">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    <SelectItem value="leve">Leve</SelectItem>
                    <SelectItem value="grave">Grave</SelectItem>
                    <SelectItem value="muy_grave">Muy Grave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Estado</label>
                <Select value={filtros.estado} onValueChange={(v) => setFiltros(f => ({ ...f, estado: v === "todos" ? "" : v }))}>
                  <SelectTrigger className="text-sm h-8">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pendiente_analisis">Pendiente de Análisis</SelectItem>
                    <SelectItem value="analizado">Analizado</SelectItem>
                    <SelectItem value="en_seguimiento">En Seguimiento</SelectItem>
                    <SelectItem value="resuelto">Resuelto</SelectItem>
                    <SelectItem value="derivado_consejo">Derivado al Consejo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Button size="sm" onClick={aplicarFiltros} className="text-xs bg-primary text-primary-foreground">
                <Search className="mr-1.5 h-3 w-3" />
                Aplicar filtros
              </Button>
              {hayFiltrosActivos && (
                <Button size="sm" variant="ghost" onClick={limpiarFiltros} className="text-xs text-muted-foreground">
                  <X className="mr-1.5 h-3 w-3" />
                  Limpiar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de situaciones */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !data?.items.length ? (
        <Card className="border border-border shadow-sm">
          <CardContent className="p-12 flex flex-col items-center gap-3 text-center">
            <ClipboardList className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">No se encontraron situaciones</p>
            <p className="text-xs text-muted-foreground/70">
              {hayFiltrosActivos ? "Pruebe con otros filtros de búsqueda" : "Registre la primera situación de convivencia"}
            </p>
            {!hayFiltrosActivos && (
              <Button
                size="sm"
                onClick={() => setLocation("/nueva-situacion")}
                className="mt-2 bg-primary text-primary-foreground text-xs"
              >
                Registrar primera situación
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {data.items.map((situacion) => {
            const clasif = situacion.clasificacionSugerida ? clasificacionLabels[situacion.clasificacionSugerida] : null;
            const estado = estadoLabels[situacion.estado];
            return (
              <Card
                key={situacion.id}
                className="border border-border shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary/30"
                onClick={() => setLocation(`/situacion/${situacion.id}`)}
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
                      </div>
                      <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
                        {situacion.descripcion}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Informado por: <span className="font-medium">{situacion.adultoInformante}</span>
                        {situacion.hayReincidencia && (
                          <span className="ml-2 text-amber-600 font-medium">• Con reincidencia</span>
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {clasif ? (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${clasif.className}`}>
                          {clasif.label}
                        </span>
                      ) : (
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold badge-pendiente">
                          Sin analizar
                        </span>
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
          })}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Página {page} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-xs"
            >
              Siguiente
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
