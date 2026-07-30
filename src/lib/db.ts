import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL ?? "";

export const pool = new Pool({ connectionString });

export async function query<T extends import('pg').QueryResultRow = any>(text: string, params?: unknown[]) {
  return pool.query<T>(text, params);
}

export async function getClient() {
  const client = await pool.connect();
  return client;
}

// Simple helper for graceful shutdown (optional)
export async function closePool() {
  await pool.end();
}
