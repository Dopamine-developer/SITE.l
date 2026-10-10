# Our Little Story — React on Vercel

No long-running server process to keep open. Vercel serves the React site and runs small serverless API functions only when needed. Scores and one-time invite usage are stored in Neon Postgres.

## Memories included from the conversation
- A small fight (the exact subject wasn't provided, so Q1 is an editable placeholder)
- She said “Meethe”; you replied “Khayegi kya?”
- Friends were playing a game
- You proposed
- She asked you to wait until 22 July
- Hand-holding: you described 7 minutes 43 seconds, then about 14 minutes the next day
- The finale is a virtual hug animation, not a claim that a real hug happened

Q8/Q9 use the durations from the earlier story context. If those durations are not the exact memories you want shown, edit them in `story.json`. Q1 is deliberately a placeholder because the details of the fight were never specified.

## Deploy to Vercel
1. Upload this folder to a private GitHub repository or import it directly into Vercel.
2. In Vercel, create a Neon Postgres database/integration and copy its connection string to `DATABASE_URL`.
3. Add environment variables in Vercel Project Settings → Environment Variables:
   - `DATABASE_URL` = Neon pooled or standard Postgres connection string (SSL enabled)
   - `ADMIN_TOKEN` = a long random secret, at least 24 characters
   - `SITE_ORIGIN` = your deployed URL, e.g. `https://your-project.vercel.app`
4. Deploy. Vercel runs the API routes automatically; no PC/server needs to stay on.
5. Open `/admin`, paste your `ADMIN_TOKEN`, click “Create one-time invite”, and share that link privately.
6. The first user who submits the 10 questions consumes that invite. Backend updates are atomic, and the participant never receives their score.

## Local preview
```bash
npm install
npm run dev
```
For the API locally, Vercel CLI is recommended:
```bash
npm i -g vercel
vercel dev
```
Set `DATABASE_URL` and `ADMIN_TOKEN` in a local `.env` file before `vercel dev`.

## Important
- The ZIP is source code, not an already deployed public URL.
- `story.json` is bundled at build time. Correct answers are not exposed by `/api/story`, but the visible options can still be inspected by a technically skilled visitor. This is a sweet memory quiz, not a high-security exam.
- Keep `ADMIN_TOKEN` secret. Anyone with it can read saved answers/scores and create invitation links.
- Use HTTPS (Vercel provides it). Don't commit `.env` or tokens to a public repository.
