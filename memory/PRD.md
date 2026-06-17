# Career Explorer AI — PRD

## Original problem statement
Production-ready career discovery web app for students and young professionals.
Flow: 9-question assessment → top-10 career rating (1-5 stars) → top-3 final results with match %, description, skills, salary, category, future outlook + AI-style explainability + per-career roadmap + comparison + auth + dashboard + admin + country support + PDF export + sharing.

## Architecture (delivered)
- Backend: FastAPI + MongoDB (`/api/*` routes via APIRouter)
- Frontend: React 19 + react-router + framer-motion + Tailwind + Phosphor icons + html2canvas + jsPDF
- Auth: JWT (HS256) + bcrypt, httpOnly cookie + Authorization Bearer header fallback
- LLM: Claude Sonnet 4.5 (claude-sonnet-4-5-20250929) via Emergent Universal LLM Key — on-demand explanation endpoint
- Persistence: MongoDB (`users`, `assessments`, `saved_careers`, `password_reset_tokens`) + localStorage on the client for in-progress assessments

## Implemented (Iteration 2 — 2026-06-17)
- Full V1: landing, 9-question assessment, top-10 rating, top-3 results (passes 18/18 tests)
- Auth: register/login/logout/me/forgot-password/reset-password, admin seeded
- MongoDB persistence of assessments & saved careers per logged-in user
- Country support: US, UK, CA, AU, IN — salary range localised per-country at request time
- Career detail pages `/career/:name` with full info: salary, education, universities, certifications, daily responsibilities, work-life balance, future outlook, roadmap
- 3-stage roadmap (Beginner / Intermediate / Advanced) component reused on detail page & results hero
- AI explanation feature: rule-based "why this matches" baked into every card + on-demand Claude Sonnet 4.5 explanation button (auth-gated)
- User dashboard `/dashboard` (past assessments + saved careers + new-assessment CTA)
- Admin dashboard `/admin` with platform stats (users / assessments / saved / top #1 careers / most-saved)
- PDF export (jsPDF) + PNG image export (html2canvas) + Web Share / clipboard fallback
- Bookmark/save individual careers from result cards and detail pages
- Country selector in header for logged-in users

## Test credentials
See `/app/memory/test_credentials.md`

## P1 backlog
- Side-by-side career comparison tool (deferred — UI scaffolded via detail pages)
- Multi-attempt assessment trend charts on dashboard (Recharts)
- Email-based password-reset delivery (currently logged to backend console)
- Shareable career-card image generator per career (currently full-page only)
- Country selector for anonymous users (currently only logged-in)
