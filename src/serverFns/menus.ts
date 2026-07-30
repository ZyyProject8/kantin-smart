import { query } from "../lib/db";

export async function listMenus(sellerId?: string) {
  if (sellerId) {
    const res = await query("SELECT * FROM menus WHERE seller_id = $1 ORDER BY created_at DESC", [sellerId]);
    return res.rows;
  }

  const res = await query("SELECT * FROM menus ORDER BY created_at DESC");
  return res.rows;
}

export async function getMenu(id: string) {
  const res = await query("SELECT * FROM menus WHERE id = $1", [id]);
  return res.rows[0] ?? null;
}

export async function createMenu(sellerId: string, title: string, description?: string) {
  const res = await query(
    `INSERT INTO menus (seller_id, title, description) VALUES ($1, $2, $3) RETURNING *`,
    [sellerId, title, description],
  );
  return res.rows[0];
}

export async function deleteMenu(id: string) {
  await query("DELETE FROM menus WHERE id = $1", [id]);
  return { ok: true };
}
