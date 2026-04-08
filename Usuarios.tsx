import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

const rolLabels: Record<string, string> = {
  docente: "Docente",
  preceptor: "Preceptor/a",
  edayo: "Equipo de Apoyo y Orientación (EdAyO)",
  directivo: "Equipo Directivo",
  admin: "Administrador del Sistema",
};

const rolColors: Record<string, string> = {
  docente: "bg-blue-100 text-blue-700",
  preceptor: "bg-green-100 text-green-700",
  edayo: "bg-purple-100 text-purple-700",
  directivo: "bg-amber-100 text-amber-700",
  admin: "bg-red-100 text-red-700",
};

export default function Usuarios() {
  const { user: currentUser } = useAuth();
  const { data: me } = trpc.auth.me.useQuery();
  const { data: usuarios, isLoading, refetch } = trpc.usuarios.listar.useQuery();
  const utils = trpc.useUtils();

  const actualizarRolMutation = trpc.usuarios.actualizarRol.useMutation({
    onSuccess: () => {
      toast.success("Rol actualizado correctamente");
      utils.usuarios.listar.invalidate();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const isAdmin = me?.institutionalRole === "admin" || me?.role === "admin";
  const isDirectivo = me?.institutionalRole === "directivo" || isAdmin;

  if (!isDirectivo) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <ShieldCheck className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground text-center">
          Solo el equipo directivo puede acceder a la gestión de usuarios.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Gestión de Usuarios</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Administre los roles institucionales del personal del Instituto Superior Colegio del Carmen.
        </p>
      </div>

      {/* Descripción de roles */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">Roles Institucionales</CardTitle>
          <CardDescription className="text-xs">
            Cada rol determina las funciones y responsabilidades dentro del sistema de convivencia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(rolLabels).map(([rol, label]) => (
              <div key={rol} className={`rounded-lg px-3 py-2 text-xs font-medium ${rolColors[rol]}`}>
                {label}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuarios */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Personal Registrado
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : !usuarios?.length ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No hay usuarios registrados aún.
            </p>
          ) : (
            <div className="space-y-2">
              {usuarios.map((usuario) => {
                const isCurrentUser = usuario.id === me?.id;
                return (
                  <div
                    key={usuario.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${isCurrentUser ? "border-primary/30 bg-primary/5" : "border-border bg-card"}`}
                  >
                    <Avatar className="h-9 w-9 border shrink-0">
                      <AvatarFallback className="text-xs font-semibold bg-primary/15 text-primary">
                        {usuario.name?.charAt(0).toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {usuario.name ?? "Sin nombre"}
                        </p>
                        {isCurrentUser && (
                          <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded font-medium">
                            Tú
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{usuario.email ?? "—"}</p>
                    </div>
                    <div className="shrink-0">
                      {isAdmin && !isCurrentUser ? (
                        <Select
                          value={usuario.institutionalRole}
                          onValueChange={(v) =>
                            actualizarRolMutation.mutate({
                              userId: usuario.id,
                              institutionalRole: v as any,
                            })
                          }
                        >
                          <SelectTrigger className="text-xs h-7 w-44">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(rolLabels).map(([v, l]) => (
                              <SelectItem key={v} value={v} className="text-xs">{l}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${rolColors[usuario.institutionalRole ?? "docente"]}`}>
                          {rolLabels[usuario.institutionalRole ?? "docente"]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nota informativa */}
      <Card className="border border-border bg-muted/30 shadow-sm">
        <CardContent className="p-4 flex items-start gap-3">
          <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Nota:</strong> Los usuarios se registran automáticamente al ingresar al sistema por primera vez. 
            El rol por defecto es "Docente". Solo el Administrador del Sistema puede modificar roles. 
            Los cambios de rol tienen efecto inmediato en los permisos del usuario.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
