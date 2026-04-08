import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import DashboardLayout from "./components/DashboardLayout";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NuevaSituacion from "./pages/NuevaSituacion";
import Historial from "./pages/Historial";
import SituacionDetalle from "./pages/SituacionDetalle";
import Seguimiento from "./pages/Seguimiento";
import Usuarios from "./pages/Usuarios";
import AEC from "./pages/AEC";

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/nueva-situacion" component={NuevaSituacion} />
        <Route path="/historial" component={Historial} />
        <Route path="/situacion/:id" component={SituacionDetalle} />
        <Route path="/seguimiento" component={Seguimiento} />
        <Route path="/usuarios" component={Usuarios} />
        <Route path="/aec" component={AEC} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster richColors position="top-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
