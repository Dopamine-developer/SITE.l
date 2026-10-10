import { neon } from "@neondatabase/serverless";
import crypto from "node:crypto";

export function db() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured. Connect a Neon Postgres database in Vercel.");
  return neon(process.env.DATABASE_URL);
}
export const hash = (s) => crypto.createHash("sha256").update(String(s)).digest("hex");
export const newToken = () => crypto.randomBytes(24).toString("base64url");
export const now = () => new Date().toISOString();

export async function init(sql) {
  await sql`CREATE TABLE IF NOT EXISTS invitations (
    id BIGSERIAL PRIMARY KEY,
    token_hash TEXT UNIQUE NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    used_at TIMESTAMPTZ
  )`;
  await sql`CREATE TABLE IF NOT EXISTS attempts (
    id BIGSERIAL PRIMARY KEY,
    invite_id BIGINT UNIQUE NOT NULL REFERENCES invitations(id),
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    answers_json JSONB NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
}
export function json(res, status, data) {
  res.status(status).setHeader("Cache-Control", "no-store").json(data);
}
export function adminOK(req) {
  const expected = process.env.ADMIN_TOKEN || "";
  const actual = req.headers["x-admin-token"] || "";
  return expected.length >= 24 && actual.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}
