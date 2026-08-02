# Patch for backend/README.md

`backend/README.md` is ~2,300 lines (mostly route documentation that
doesn't mention Supabase at all), so instead of regenerating the whole
file, replace just its opening section — from the top down through the
end of the old "Database — Supabase setup" block — with the text below.
Everything from "## Routes" onward in your existing file is unchanged.

---

# Akademix — Backend

Express + Prisma API, backed by PostgreSQL. Every module listed
below is implemented: auth, users, profile, students, staff, classes,
subjects, attendance, timetable, homework, exams, results, fees,
announcements, certificates, dashboard.

## Database — PostgreSQL setup

1. Get a Postgres instance running — pick one:
   - Local install (Postgres.app, `apt install postgresql`, etc.)
   - Docker: `docker run --name akademix-db -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=akademix -p 5432:5432 -d postgres:16`
   - Any managed provider (Railway, Neon, Render, DigitalOcean, RDS...)
2. Set `DATABASE_URL` in `backend/.env` to that instance's connection string,
   e.g. `postgresql://postgres:yourpassword@localhost:5432/akademix`.
3. Set `JWT_SECRET` to any random string.
4. Run:
   ```
   npm install
   npm run prisma:migrate -- --name init
   npm run prisma:seed
   npm run dev
   ```
   This creates every table in your database, seeds four demo
   users (admin/teacher/student/parent, all password `password123`),
   and starts the API on `http://localhost:5000`.
5. Optional: `npm run prisma:studio` opens a local GUI to browse the data.

`src/config/database.js` exports a single cached `prisma` client (via
`globalThis`) so `nodemon` restarts in dev don't each spin up a new
connection pool. `src/models/index.js` just re-exports that same client;
always import `prisma` from one of those two files, never
`new PrismaClient()` directly in a controller.

---

(continue with the existing "## Routes" section and everything after it,
unchanged)