import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, ChevronRight, FilePlus, Info, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";

interface FormData {
  fechaHecho: string;
  cursoDivision: string;
  adultoInformante: string;
  rolInformante: "docente" | "preceptor" | "edayo" | "directivo";
  descripcion: string;
  cantidadEstudiantes: number;
  estudiantesDescripcion: string;
  contexto: "aula" | "recreo" | "pasillo" | "acto_escolar" | "actividad_extracurricular" | "redes_sociales" | "otro";
  contextoDetalle: string;
  hayReincidencia: boolean;
  reincidenciaDetalle: string;
  hayMedidasPrevias: boolean;
  medidasPreviasDetalle: string;
}

const contextoLabels: Record<string, string> = {
  aula: "Aula / Clase",
  recreo: "Recreo",
  pasillo: "Pasillo / Espacios comunes",
  acto_escolar: "Acto o evento escolar",
  actividad_extracurricular: "Actividad extracurricular / Salida educativa",
  redes_sociales: "Redes sociales / Medios digitales",
  otro: "Otro contexto",
};

const rolLabels: Record<string, string> = {
  docente: "Docente",
  preceptor: "Preceptor/a",
  edayo: "Equipo de Apoyo y Orientación (EdAyO)",
  directivo: "Equipo Directivo",
};

export default function NuevaSituacion() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      fechaHecho: new Date().toISOString().split("T")[0],
      cantidadEstudiantes: 1,
      hayReincidencia: false,
      hayMedidasPrevias: false,
    },
  });

  const hayReincidencia = watch("hayReincidencia");
  const hayMedidasPrevias = watch("hayMedidasPrevias");

  const crearMutation = trpc.situaciones.crear.useMutation({
    onSuccess: (data) => {
      toast.success("Situación registrada correctamente");
      if (data.id) {
        setLocation(`/situacion/${data.id}`);
      } else {
        setLocation("/historial");
      }
    },
    onError: (error) => {
      toast.error(`Error al registrar: ${error.message}`);
    },
  });

  const onSubmit = (data: FormData) => {
    const fechaISO = new Date(data.fechaHecho + "T12:00:00.000Z").toISOString();
    crearMutation.mutate({
      ...data,
      fechaHecho: fechaISO,
      cantidadEstudiantes: Number(data.cantidadEstudiantes),
      estudiantesDescripcion: data.estudiantesDescripcion || null,
      contextoDetalle: data.contextoDetalle || null,
      reincidenciaDetalle: data.reincidenciaDetalle || null,
      medidasPreviasDetalle: data.medidasPreviasDetalle || null,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Encabezado */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span className="cursor-pointer hover:text-foreground" onClick={() => setLocation("/")}>Panel</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Registrar Situación</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Registrar Situación de Convivencia</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete todos los campos con información precisa y contextualizada para que el sistema pueda realizar un análisis adecuado.
        </p>
      </div>

      {/* Aviso de privacidad */}
      <Card className="border border-blue-200 bg-blue-50/60">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Privacidad de los estudiantes:</strong> No se registran nombres ni apellidos de los estudiantes involucrados. 
            Describa las características relevantes de manera general y contextualizada, respetando la dignidad de todas las personas.
          </p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5">

          {/* Sección 1: Datos del hecho */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">1</span>
                Datos del Hecho
              </CardTitle>
              <CardDescription className="text-xs">Información básica sobre cuándo y dónde ocurrió la situación.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fechaHecho" className="text-sm font-medium">
                    Fecha del hecho <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fechaHecho"
                    type="date"
                    {...register("fechaHecho", { required: "La fecha es obligatoria" })}
                    className="text-sm"
                  />
                  {errors.fechaHecho && <p className="text-xs text-destructive">{errors.fechaHecho.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cursoDivision" className="text-sm font-medium">
                    Curso y División <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="cursoDivision"
                    placeholder="Ej: 3° A, 5° B"
                    {...register("cursoDivision", { required: "El curso es obligatorio" })}
                    className="text-sm"
                  />
                  {errors.cursoDivision && <p className="text-xs text-destructive">{errors.cursoDivision.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="adultoInformante" className="text-sm font-medium">
                    Adulto que informa <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="adultoInformante"
                    placeholder="Nombre completo"
                    {...register("adultoInformante", { required: "El nombre del informante es obligatorio" })}
                    className="text-sm"
                  />
                  {errors.adultoInformante && <p className="text-xs text-destructive">{errors.adultoInformante.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">
                    Rol del informante <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="rolInformante"
                    control={control}
                    rules={{ required: "Seleccione el rol" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Seleccionar rol..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(rolLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.rolInformante && <p className="text-xs text-destructive">{errors.rolInformante.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">
                    Contexto del hecho <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="contexto"
                    control={control}
                    rules={{ required: "Seleccione el contexto" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Seleccionar contexto..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(contextoLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.contexto && <p className="text-xs text-destructive">{errors.contexto.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contextoDetalle" className="text-sm font-medium">
                    Detalle del contexto
                  </Label>
                  <Input
                    id="contextoDetalle"
                    placeholder="Especificaciones adicionales del contexto"
                    {...register("contextoDetalle")}
                    className="text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección 2: Descripción de la situación */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">2</span>
                Descripción de la Situación
              </CardTitle>
              <CardDescription className="text-xs">Relate la situación de manera narrativa, clara y contextualizada.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="descripcion" className="text-sm font-medium">
                  Descripción detallada <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describa la situación de manera narrativa y contextualizada. Incluya qué ocurrió, cómo se desarrolló, qué actitudes se observaron, cuál fue la reacción de los involucrados y cualquier otro dato relevante para comprender el hecho en su totalidad..."
                  rows={6}
                  {...register("descripcion", {
                    required: "La descripción es obligatoria",
                    minLength: { value: 20, message: "La descripción debe tener al menos 20 caracteres" }
                  })}
                  className="text-sm resize-none"
                />
                {errors.descripcion && <p className="text-xs text-destructive">{errors.descripcion.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Sección 3: Estudiantes involucrados */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">3</span>
                Estudiantes Involucrados
              </CardTitle>
              <CardDescription className="text-xs">Sin nombre ni apellido — solo información contextual relevante.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="cantidadEstudiantes" className="text-sm font-medium">
                  Cantidad de estudiantes involucrados <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cantidadEstudiantes"
                  type="number"
                  min={1}
                  max={50}
                  {...register("cantidadEstudiantes", {
                    required: true,
                    min: { value: 1, message: "Debe haber al menos 1 estudiante" }
                  })}
                  className="text-sm w-32"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="estudiantesDescripcion" className="text-sm font-medium">
                  Descripción de los estudiantes
                </Label>
                <Textarea
                  id="estudiantesDescripcion"
                  placeholder="Describa características relevantes sin identificar a los estudiantes por nombre. Por ejemplo: año cursado, si es la primera vez que se involucra en una situación similar, características de la dinámica grupal, etc."
                  rows={3}
                  {...register("estudiantesDescripcion")}
                  className="text-sm resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sección 4: Antecedentes */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">4</span>
                Antecedentes y Medidas Previas
              </CardTitle>
              <CardDescription className="text-xs">Información sobre reincidencias y acciones institucionales anteriores.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">¿Existe reincidencia en conductas similares?</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Conductas similares previas del mismo estudiante o grupo</p>
                  </div>
                  <Controller
                    name="hayReincidencia"
                    control={control}
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
                {hayReincidencia && (
                  <Textarea
                    placeholder="Describa las reincidencias previas: cuándo ocurrieron, qué tipo de conductas, si hubo intervención institucional..."
                    rows={3}
                    {...register("reincidenciaDetalle")}
                    className="text-sm resize-none"
                  />
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">¿Se adoptaron medidas previas?</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Intervenciones, llamados de atención, actas u otras acciones anteriores</p>
                  </div>
                  <Controller
                    name="hayMedidasPrevias"
                    control={control}
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
                {hayMedidasPrevias && (
                  <Textarea
                    placeholder="Describa las medidas adoptadas previamente: tipo de intervención, fecha aproximada, quién intervino, resultado obtenido..."
                    rows={3}
                    {...register("medidasPreviasDetalle")}
                    className="text-sm resize-none"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/")}
              className="text-sm"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={crearMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
            >
              {crearMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Registrar y Analizar
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
