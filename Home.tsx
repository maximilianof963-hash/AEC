import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FilePlus,
  History,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: stats, isLoading } = trpc.panel.estadisticas.useQuery();

  const statCards = [
    {
      title: "Total de Situaciones",
      value: stats?.total ?? 0,
      icon: ClipboardList,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Pendientes de Análisis",
      value: stats?.pendientes ?? 0,
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "En Seguimiento",
      value: stats?.enSeguimiento ?? 0,
      icon: History,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Resueltas",
      value: stats?.resueltos ?? 0,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  const clasificacionCards = [
    {
      label: "Faltas Leves",
      value: stats?.leves ?? 0,
      className: "badge-leve",
      icon: ShieldCheck,
    },
    {
      label: "Faltas Graves",
      value: stats?.graves ?? 0,
      className: "badge-grave",
      icon: ShieldAlert,
    },
    {
      label: "Faltas Muy Graves",
      value: stats?.muyGraves ?? 0,
      className: "badge-muy-grave",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Panel de Control
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sistema de Gestión de Convivencia Escolar — Instituto Superior Colegio del Carmen
          </p>
        </div>
        <Button
          onClick={() => setLocation("/nueva-situacion")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
        >
          <FilePlus className="mr-2 h-4 w-4" />
          Registrar Situación
        </Button>
      </div>

      {/* Estadísticas principales */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <Card key={card.title} className="border border-border shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {card.title}
                      </p>
                      <p className={`text-3xl font-bold mt-1 ${card.color}`}>
                        {card.value}
                      </p>
                    </div>
                    <div className={`p-2 rounded-lg ${card.bg}`}>
                      <card.icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Distribución por clasificación */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clasificacionCards.map((card) => (
              <Card key={card.label} className="border border-border shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <card.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{card.label}</span>
                    </div>
                    <span className={`text-lg font-bold px-3 py-1 rounded-full text-sm ${card.className}`}>
                      {card.value}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Accesos rápidos */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Accesos Rápidos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              icon: FilePlus,
              label: "Registrar nueva situación",
              desc: "Cargar un hecho de convivencia",
              path: "/nueva-situacion",
              primary: true,
            },
            {
              icon: ClipboardList,
              label: "Ver historial completo",
              desc: "Buscar y filtrar situaciones",
              path: "/historial",
              primary: false,
            },
            {
              icon: History,
              label: "Seguimiento de casos",
              desc: "Casos activos y reincidentes",
              path: "/seguimiento",
              primary: false,
            },
            {
              icon: BookOpen,
              label: "Acuerdo de Convivencia",
              desc: "Consultar el AEC institucional",
              path: "/aec",
              primary: false,
            },
          ].map((item) => (
            <Card
              key={item.path}
              className={`border shadow-sm cursor-pointer hover:shadow-md transition-all hover:border-primary/40 ${item.primary ? "border-primary/30 bg-primary/5" : "border-border"}`}
              onClick={() => setLocation(item.path)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${item.primary ? "bg-primary/15" : "bg-muted"}`}>
                    <item.icon className={`h-4 w-4 ${item.primary ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Aviso pedagógico */}
      <Card className="border border-blue-200 bg-blue-50/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-primary">
                Principios del Sistema
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Este sistema tiene una función de <strong>acompañamiento, orientación y apoyo</strong> a la toma de decisiones institucionales. 
                Las clasificaciones sugeridas son <strong>orientativas</strong> y no reemplazan el criterio pedagógico del equipo institucional. 
                En ningún caso el sistema aplica sanciones de manera automática.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
