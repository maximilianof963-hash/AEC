import { and, desc, eq, gte, like, lte, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, InsertSituacion, InsertSeguimiento, seguimientos, situaciones, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Usuarios ────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserInstitutionalRole(
  userId: number,
  institutionalRole: "docente" | "preceptor" | "edayo" | "directivo" | "admin"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ institutionalRole }).where(eq(users.id, userId));
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt));
}

// ─── Situaciones ─────────────────────────────────────────────────────────────

export async function createSituacion(data: InsertSituacion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(situaciones).values(data);
  return result;
}

export async function getSituacionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(situaciones).where(eq(situaciones.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateSituacionAnalisis(
  id: number,
  clasificacion: "leve" | "grave" | "muy_grave",
  informe: unknown
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(situaciones)
    .set({
      clasificacionSugerida: clasificacion,
      informeIA: informe,
      estado: "analizado",
    })
    .where(eq(situaciones.id, id));
}

export async function updateSituacionEstado(
  id: number,
  estado: "pendiente_analisis" | "analizado" | "en_seguimiento" | "resuelto" | "derivado_consejo"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(situaciones).set({ estado }).where(eq(situaciones.id, id));
}

export interface FiltrosSituaciones {
  fechaDesde?: Date;
  fechaHasta?: Date;
  cursoDivision?: string;
  clasificacion?: "leve" | "grave" | "muy_grave";
  estado?: string;
  creadoPorId?: number;
  page?: number;
  pageSize?: number;
}

export async function listSituaciones(filtros: FiltrosSituaciones = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };

  const { page = 1, pageSize = 20, fechaDesde, fechaHasta, cursoDivision, clasificacion, estado, creadoPorId } = filtros;
  const offset = (page - 1) * pageSize;

  const conditions = [];
  if (fechaDesde) conditions.push(gte(situaciones.fechaHecho, fechaDesde));
  if (fechaHasta) conditions.push(lte(situaciones.fechaHecho, fechaHasta));
  if (cursoDivision) conditions.push(like(situaciones.cursoDivision, `%${cursoDivision}%`));
  if (clasificacion) conditions.push(eq(situaciones.clasificacionSugerida, clasificacion));
  if (estado) conditions.push(eq(situaciones.estado, estado as any));
  if (creadoPorId) conditions.push(eq(situaciones.creadoPorId, creadoPorId));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [items, countResult] = await Promise.all([
    db
      .select()
      .from(situaciones)
      .where(where)
      .orderBy(desc(situaciones.createdAt))
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(situaciones)
      .where(where),
  ]);

  return { items, total: Number(countResult[0]?.count ?? 0) };
}

export async function getEstadisticas() {
  const db = await getDb();
  if (!db) return null;

  const [total, pendientes, leves, graves, muyGraves, enSeguimiento, resueltos] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(situaciones),
    db.select({ count: sql<number>`count(*)` }).from(situaciones).where(eq(situaciones.estado, "pendiente_analisis")),
    db.select({ count: sql<number>`count(*)` }).from(situaciones).where(eq(situaciones.clasificacionSugerida, "leve")),
    db.select({ count: sql<number>`count(*)` }).from(situaciones).where(eq(situaciones.clasificacionSugerida, "grave")),
    db.select({ count: sql<number>`count(*)` }).from(situaciones).where(eq(situaciones.clasificacionSugerida, "muy_grave")),
    db.select({ count: sql<number>`count(*)` }).from(situaciones).where(eq(situaciones.estado, "en_seguimiento")),
    db.select({ count: sql<number>`count(*)` }).from(situaciones).where(eq(situaciones.estado, "resuelto")),
  ]);

  return {
    total: Number(total[0]?.count ?? 0),
    pendientes: Number(pendientes[0]?.count ?? 0),
    leves: Number(leves[0]?.count ?? 0),
    graves: Number(graves[0]?.count ?? 0),
    muyGraves: Number(muyGraves[0]?.count ?? 0),
    enSeguimiento: Number(enSeguimiento[0]?.count ?? 0),
    resueltos: Number(resueltos[0]?.count ?? 0),
  };
}

// ─── Seguimientos ────────────────────────────────────────────────────────────

export async function createSeguimiento(data: InsertSeguimiento) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(seguimientos).values(data);
}

export async function getSeguimientosBySituacion(situacionId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(seguimientos)
    .where(eq(seguimientos.situacionId, situacionId))
    .orderBy(desc(seguimientos.fechaAccion));
}

export async function getSituacionesConReincidencia() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(situaciones)
    .where(
      or(
        eq(situaciones.hayReincidencia, true),
        eq(situaciones.estado, "en_seguimiento"),
        eq(situaciones.estado, "derivado_consejo")
      )
    )
    .orderBy(desc(situaciones.updatedAt))
    .limit(50);
}
