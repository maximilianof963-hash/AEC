import {
  boolean,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  institutionalRole: mysqlEnum("institutionalRole", [
    "docente",
    "preceptor",
    "edayo",
    "directivo",
    "admin",
  ])
    .default("docente")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const situaciones = mysqlTable("situaciones", {
  id: int("id").autoincrement().primaryKey(),
  // Datos del hecho
  fechaHecho: timestamp("fechaHecho").notNull(),
  cursoDivision: varchar("cursoDivision", { length: 32 }).notNull(),
  adultoInformante: varchar("adultoInformante", { length: 128 }).notNull(),
  rolInformante: mysqlEnum("rolInformante", [
    "docente",
    "preceptor",
    "edayo",
    "directivo",
  ]).notNull(),
  // Descripción
  descripcion: text("descripcion").notNull(),
  // Estudiantes (sin nombre/apellido)
  cantidadEstudiantes: int("cantidadEstudiantes").default(1).notNull(),
  estudiantesDescripcion: text("estudiantesDescripcion"),
  // Contexto
  contexto: mysqlEnum("contexto", [
    "aula",
    "recreo",
    "pasillo",
    "acto_escolar",
    "actividad_extracurricular",
    "redes_sociales",
    "otro",
  ]).notNull(),
  contextoDetalle: text("contextoDetalle"),
  // Antecedentes
  hayReincidencia: boolean("hayReincidencia").default(false).notNull(),
  reincidenciaDetalle: text("reincidenciaDetalle"),
  hayMedidasPrevias: boolean("hayMedidasPrevias").default(false).notNull(),
  medidasPreviasDetalle: text("medidasPreviasDetalle"),
  // Análisis IA
  clasificacionSugerida: mysqlEnum("clasificacionSugerida", [
    "leve",
    "grave",
    "muy_grave",
  ]),
  informeIA: json("informeIA"),
  // Estado del caso
  estado: mysqlEnum("estado", [
    "pendiente_analisis",
    "analizado",
    "en_seguimiento",
    "resuelto",
    "derivado_consejo",
  ])
    .default("pendiente_analisis")
    .notNull(),
  // Metadata
  creadoPorId: int("creadoPorId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Situacion = typeof situaciones.$inferSelect;
export type InsertSituacion = typeof situaciones.$inferInsert;

export const seguimientos = mysqlTable("seguimientos", {
  id: int("id").autoincrement().primaryKey(),
  situacionId: int("situacionId").notNull(),
  tipoAccion: mysqlEnum("tipoAccion", [
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
  ]).notNull(),
  descripcion: text("descripcion").notNull(),
  fechaAccion: timestamp("fechaAccion").notNull(),
  observaciones: text("observaciones"),
  registradoPorId: int("registradoPorId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Seguimiento = typeof seguimientos.$inferSelect;
export type InsertSeguimiento = typeof seguimientos.$inferInsert;
