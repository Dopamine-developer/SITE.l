import { db, hash, init, json } from "./_lib/common.js";
export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, {detail:"Method not allowed"});
  try {
    const token = String(req.body?.token || "").slice(0,300);
    if (!token) return json(res, 400, {detail:"An invitation link is required."});
    const sql = db(); await init(sql);
    const rows = await sql`SELECT used FROM invitations WHERE token_hash=${hash(token)} LIMIT 1`;
    if (!rows.length) return json(res, 404, {detail:"This invitation link isn't valid."});
    if (rows[0].used) return json(res, 410, {detail:"This invitation has already been used."});
    return json(res, 200, {valid:true});
  } catch (e) { return json(res, 500, {detail:e.message || "Database error"}); }
}
