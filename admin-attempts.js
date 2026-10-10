import { db, init, json, adminOK } from "./_lib/common.js";
export default async function handler(req, res) {
  if (req.method !== "GET") return json(res,405,{detail:"Method not allowed"});
  if (!adminOK(req)) return json(res,401,{detail:"Admin token missing or incorrect."});
  try {
    const sql = db(); await init(sql);
    const attempts = await sql`SELECT score,total,answers_json,completed_at FROM attempts ORDER BY id DESC`;
    return json(res,200,{attempts});
  } catch(e) { return json(res,500,{detail:e.message || "Database error"}); }
}
