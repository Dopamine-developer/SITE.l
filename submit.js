import story from "../story.json" with { type: "json" };
import { db, hash, init, json } from "./_lib/common.js";
export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, {detail:"Method not allowed"});
  try {
    const token = String(req.body?.token || "").slice(0,300);
    const answers = req.body?.answers;
    if (!token || !Array.isArray(answers) || answers.length !== 10) return json(res, 400, {detail:"Please answer all 10 questions."});
    let score = 0; const normalized = [];
    for (let i=0;i<10;i++) {
      const selected = Number(answers[i]);
      const q = story.questions[i];
      if (!Number.isInteger(selected) || selected < 0 || selected >= q.options.length) return json(res,400,{detail:"One of the answers is invalid."});
      const correct = selected === q.correctIndex;
      score += correct ? 1 : 0;
      normalized.push({questionId:q.id,selectedIndex:selected,correct});
    }
    const sql = db(); await init(sql);
    // One SQL statement consumes the token and writes the attempt atomically.
    // Concurrent submissions cannot consume the same invitation twice.
    const saved = await sql`WITH consumed AS (
        UPDATE invitations SET used=TRUE, used_at=NOW()
        WHERE token_hash=${hash(token)} AND used=FALSE
        RETURNING id
      ), inserted AS (
        INSERT INTO attempts(invite_id, score, total, answers_json, completed_at)
        SELECT id, ${score}, 10, ${JSON.stringify(normalized)}::jsonb, NOW()
        FROM consumed
        RETURNING id
      )
      SELECT id FROM inserted`;
    if (!saved.length) return json(res, 410, {detail:"This invitation is invalid or has already been used."});
    // Do not reveal score to the invitee.
    return json(res, 200, {ok:true, message:"Thank you for being part of this little story."});
  } catch (e) { return json(res, 500, {detail:e.message || "Could not save the result."}); }
}
