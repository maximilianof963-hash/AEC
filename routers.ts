import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createSeguimiento,
  createSituacion,
  getAllUsers,
  getEstadisticas,
  getSeguimientosBySituacion,
  getSituacionById,
  getSituacionesConReincidencia,
  listSituaciones,
  updateSituacionAnalisis,
  updateSituacionEstado,
  updateUserInstitutionalRole,
} from "./db";
import { analizarSituacionConIA } from "./aecAnalysis";

// ─── Procedimiento para directivos y admins ──────────────────────────────────
const directivoProcedure = protectedProcedure.use(({ ctx, next }) => {
  const role = ctx.user.institutionalRole;
  if (role !== "directivo" && role !== "admin" && ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Solo el equipo directivo puede realizar esta acción." });
  }
  return next({ ctx });
});

// ─── Schemas de validación ────────────────────────────────────────────────────
const situacionInputSchema = z.object({
  fechaHecho: z.string().datetime(),
  cursoDivision: z.string().min(1).max(64),
  adultoInformante: z.string().min(1).max(256),
  rolInformante: z.enum(["docente", "preceptor", "edayo", "directivo"]),
  descripcion: z.string().min(20),
  cantidadEstudiantes: z.number().int().min(1).max(50),
  estudiantesDescripcion: z.string().optional().nullable(),
  contexto: z.enum(["aula", "recreo", "pasillo", "acto_escolar", "actividad_extracurricular", "redes_sociales", "otro"]),
  contextoDetalle: z.string().optional().nullable(),
  hayReincidencia: z.boolean(),
  reincidenciaDetalle: z.string().optional().nullable(),
  hayMedidasPrevias: z.boolean(),
  medidasPreviasDetalle: z.string().optional().nullable(),
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Situaciones ───────────────────────────────────────────────────────────
  situaciones: router({
    /** Registrar una nueva situación de convivencia */
    crear: protectedProcedure
      .input(situacionInputSchema)
      .mutation(async ({ input, ctx }) => {
        await createSituacion({
          fechaHecho: new Date(input.fechaHecho),
          cursoDivision: input.cursoDivision,
          adultoInformante: input.adultoInformante,
          rolInformante: input.rolInformante,
          descripcion: input.descripcion,
          cantidadEstudiantes: input.cantidadEstudiantes,
          estudiantesDescripcion: input.estudiantesDescripcion,
          contexto: input.contexto,
          contextoDetalle: input.contextoDetalle,
          hayReincidencia: input.hayReincidencia,
          reincidenciaDetalle: input.reincidenciaDetalle,
          hayMedidasPrevias: input.hayMedidasPrevias,
          medidasPreviasDetalle: input.medidasPreviasDetalle,
          creadoPorId: ctx.user.id,
          estado: "pendiente_analisis",
        });

        // Obtener el ID de la situación recién creada
        const { items } = await listSituaciones({ creadoPorId: ctx.user.id, pageSize: 1 });
        return { id: items[0]?.id, success: true };
      }),

    /** Analizar una situación con IA */
    analizar: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        const situacion = await getSituacionById(input.id);
        if (!situacion) throw new TRPCError({ code: "NOT_FOUND", message: "Situación no encontrada." });

        const informe = await analizarSituacionConIA({
          fechaHecho: situacion.fechaHecho,
          cursoDivision: situacion.cursoDivision,
          adultoInformante: situacion.adultoInformante,
          rolInformante: situacion.rolInformante,
          descripcion: situacion.descripcion,
          cantidadEstudiantes: situacion.cantidadEstudiantes,
          estudiantesDescripcion: situacion.estudiantesDescripcion,
          contexto: situacion.contexto,
          contextoDetalle: situacion.contextoDetalle,
          hayReincidencia: situacion.hayReincidencia,
          reincidenciaDetalle: situacion.reincidenciaDetalle,
          hayMedidasPrevias: situacion.hayMedidasPrevias,
          medidasPreviasDetalle: situacion.medidasPreviasDetalle,
        });

        await updateSituacionAnalisis(input.id, informe.clasificacionSugerida, informe);
        return { informe, success: true };
      }),

    /** Obtener una situación por ID */
    obtener: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .query(async ({ input }) => {
        const situacion = await getSituacionById(input.id);
        if (!situacion) throw new TRPCError({ code: "NOT_FOUND", message: "Situación no encontrada." });
        return situacion;
      }),

    /** Listar situaciones con filtros y paginación */
    listar: protectedProcedure
      .input(
        z.object({
          fechaDesde: z.string().datetime().optional(),
          fechaHasta: z.string().datetime().optional(),
          cursoDivision: z.string().optional(),
          clasificacion: z.enum(["leve", "grave", "muy_grave"]).optional(),
          estado: z.string().optional(),
          soloMias: z.boolean().optional(),
          page: z.number().int().min(1).default(1),
          pageSize: z.number().int().min(1).max(50).default(20),
        })
      )
      .query(async ({ input, ctx }) => {
        return listSituaciones({
          fechaDesde: input.fechaDesde ? new Date(input.fechaDesde) : undefined,
          fechaHasta: input.fechaHasta ? new Date(input.fechaHasta) : undefined,
          cursoDivision: input.cursoDivision,
          clasificacion: input.clasificacion,
          estado: input.estado,
          creadoPorId: input.soloMias ? ctx.user.id : undefined,
          page: input.page,
          pageSize: input.pageSize,
        });
      }),

    /** Actualizar el estado de una situación */
    actualizarEstado: protectedProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          estado: z.enum(["pendiente_analisis", "analizado", "en_seguimiento", "resuelto", "derivado_consejo"]),
        })
      )
      .mutation(async ({ input }) => {
        await updateSituacionEstado(input.id, input.estado);
        return { success: true };
      }),

    /** Obtener situaciones con reincidencia o en seguimiento */
    conReincidencia: protectedProcedure.query(async () => {
      return getSituacionesConReincidencia();
    }),
  }),

  // ─── Seguimientos ──────────────────────────────────────────────────────────
  seguimientos: router({
    /** Registrar una acción de seguimiento */
    crear: protectedProcedure
      .input(
        z.object({
          situacionId: z.number().int().positive(),
          tipoAccion: z.enum([
            "llamado_atencion",
            "apercibimiento_oral",
            "apercibimiento_escrito",
            "amonestacion",
            "accion_reparadora",
            "acta_compromiso",
            "derivacion_consejo",
            "intervencion_familiar",
            "separacion_temporaria",
            "otro",
          ]),
          descripcion: z.string().min(1),
          fechaAccion: z.string().datetime(),
          observaciones: z.string().optional().nullable(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await createSeguimiento({
          situacionId: input.situacionId,
          tipoAccion: input.tipoAccion,
          descripcion: input.descripcion,
          fechaAccion: new Date(input.fechaAccion),
          observaciones: input.observaciones,
          registradoPorId: ctx.user.id,
        });

        // Actualizar estado de la situación a "en_seguimiento"
        await updateSituacionEstado(input.situacionId, "en_seguimiento");
        return { success: true };
      }),

    /** Obtener seguimientos de una situación */
    listarPorSituacion: protectedProcedure
      .input(z.object({ situacionId: z.number().int().positive() }))
      .query(async ({ input }) => {
        return getSeguimientosBySituacion(input.situacionId);
      }),
  }),

  // ─── Panel y estadísticas ──────────────────────────────────────────────────
  panel: router({
    estadisticas: protectedProcedure.query(async () => {
      return getEstadisticas();
    }),
  }),

  // ─── Gestión de usuarios (solo directivos/admins) ─────────────────────────
  usuarios: router({
    listar: directivoProcedure.query(async () => {
      return getAllUsers();
    }),

    actualizarRol: directivoProcedure
      .input(
        z.object({
          userId: z.number().int().positive(),
          institutionalRole: z.enum(["docente", "preceptor", "edayo", "directivo", "admin"]),
        })
      )
      .mutation(async ({ input }) => {
        await updateUserInstitutionalRole(input.userId, input.institutionalRole);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
