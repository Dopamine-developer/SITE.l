import { db, init, json, adminOK, newToken, hash } from "./_lib/common.js";
export default async function handler(req, res) {
  if (req.method !== "POST") return json(res,405,{detail:"Method not allowed"});
  if (!adminOK(req)) return json(res,401,{detail:"Admin token missing or incorrect."});
  try {
    const token = newToken();
    const sql = db(); await init(sql);
    await sql`INSERT INTO invitations(token_hash,created_at) VALUES (${hash(token)},NOW())`;
    const origin = process.env.SITE_ORIGIN || `https://${req.headers.host}`;
    return json(res,200,{url:`${origin}/?invite=${token}`});
  } catch(e) { return json(res,500,{detail:e.message || "Database error"}); }
}
