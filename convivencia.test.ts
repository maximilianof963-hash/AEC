import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

// ─── Mock de la base de datos ─────────────────────────────────────────────────
vi.mock("./db", () => ({
  createSituacion: vi.fn().mockResolvedValue([{ insertId: 42 }]),
  getSituacionById: vi.fn().mockResolvedValue({
    id: 1,
    fechaHecho: new Date("2026-04-01"),
    cursoDivision: "3° A",
    adultoInformante: "Prof. García",
    rolInformante: "docente",
    descripcion: "Un estudiante interrumpió la clase de manera reiterada.",
    cantidadEstudiantes: 1,
    estudiantesDescripcion: null,
    contexto: "aula",
    contextoDetalle: null,
    hayReincidencia: false,
    reincidenciaDetalle: null,
    hayMedidasPrevias: false,
    medidasPreviasDetalle: null,
    clasificacionSugerida: null,
    informeIA: null,
    estado: "pendiente_analisis",
    creadoPorId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  listSituaciones: vi.fn().mockResolvedValue({
    items: [{ id: 42, cursoDivision: "3° A", estado: "pendiente_analisis" }],
    total: 1,
  }),
  updateSituacionAnalisis: vi.fn().mockResolvedValue(undefined),
  updateSituacionEstado: vi.fn().mockResolvedValue(undefined),
  getSituacionesConReincidencia: vi.fn().mockResolvedValue([]),
  createSeguimiento: vi.fn().mockResolvedValue(undefined),
  getSeguimientosBySituacion: vi.fn().mockResolvedValue([]),
  getEstadisticas: vi.fn().mockResolvedValue({
    total: 5,
    pendientes: 2,
    leves: 1,
    graves: 1,
    muyGraves: 0,
    enSeguimiento: 1,
    resueltos: 1,
  }),
  getAllUsers: vi.fn().mockResolvedValue([]),
  updateUserInstitutionalRole: vi.fn().mockResolvedValue(undefined),
}));

// ─── Mock del análisis IA ─────────────────────────────────────────────────────
vi.mock("./aecAnalysis", () => ({
  analizarSituacionConIA: vi.fn().mockResolvedValue({
    clasificacionSugerida: "leve",
    nivelConfianza: "alto",
    resumenSituacion: "Situación de interrupción de clase.",
    criteriosEvaluados: {
      intencionalidad: "Baja",
      danoOcasionado: "Mínimo",
      riesgoParaTerceros: "Ninguno",
      reiteracion: "Primera vez",
      trayectoriaEscolar: "Sin antecedentes",
    },
    fundamentacionPedagogica: "Se trata de una conducta disruptiva leve.",
    fundamentacionNormativa: "Según el AEC, Sección Faltas Leves.",
    apartadosAECReferenciados: ["Faltas Leves - Interrupción de clase"],
    medidasSugeridas: [
      { descripcion: "Llamado de atención verbal", fundamentacion: "Primera intervención." },
    ],
    consideracionesEticas: "Respetar la dignidad del estudiante.",
    alertas: [],
  }),
}));

// ─── Contexto de prueba ───────────────────────────────────────────────────────
function createTestContext(overrides: Partial<User> = {}): TrpcContext {
  const user: User = {
    id: 1,
    openId: "test-user-001",
    name: "Prof. García",
    email: "garcia@colegio.edu.ar",
    loginMethod: "manus",
    role: "user",
    institutionalRole: "docente",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("situaciones.obtener", () => {
  it("devuelve la situación correctamente por ID", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.situaciones.obtener({ id: 1 });
    expect(result.id).toBe(1);
    expect(result.cursoDivision).toBe("3° A");
    expect(result.adultoInformante).toBe("Prof. García");
  });
});

describe("situaciones.listar", () => {
  it("devuelve lista paginada de situaciones", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.situaciones.listar({ page: 1, pageSize: 10 });
    expect(result.total).toBe(1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].cursoDivision).toBe("3° A");
  });
});

describe("situaciones.actualizarEstado", () => {
  it("actualiza el estado de una situación", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.situaciones.actualizarEstado({
      id: 1,
      estado: "en_seguimiento",
    });
    expect(result.success).toBe(true);
  });
});

describe("situaciones.conReincidencia", () => {
  it("devuelve lista de situaciones con reincidencia o en seguimiento", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.situaciones.conReincidencia();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("seguimientos.listarPorSituacion", () => {
  it("devuelve los seguimientos de una situación", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.seguimientos.listarPorSituacion({ situacionId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("panel.estadisticas", () => {
  it("devuelve estadísticas del panel de control", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.panel.estadisticas();
    expect(result).toBeDefined();
    expect(result?.total).toBe(5);
    expect(result?.pendientes).toBe(2);
    expect(result?.leves).toBe(1);
  });
});

describe("usuarios.listar", () => {
  it("devuelve lista de usuarios para directivos", async () => {
    const ctx = createTestContext({ institutionalRole: "directivo" });
    const caller = appRouter.createCaller(ctx);
    const result = await caller.usuarios.listar();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("auth.logout", () => {
  it("cierra la sesión correctamente", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
  });
});
