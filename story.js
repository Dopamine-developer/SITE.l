import story from "../story.json" with { type: "json" };
export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({detail:"Method not allowed"});
  res.setHeader("Cache-Control", "no-store");
  // Never send the correct answer index to the browser.
  const safe = {...story, questions: story.questions.map(({correctIndex, ...q}) => q)};
  res.status(200).json(safe);
}
