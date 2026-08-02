# Akademix — School Management System

A complete, role-based school management platform: admissions, attendance,
timetables, exams, fees, salary, communication and reporting, all in one
system, with a dedicated portal for Admins, Teachers, Students and Parents.

## Structure

```
akademix/
├── backend/    Express + Prisma API — scaffold only, see backend/README.md
├── frontend/   React + Vite app — see frontend/README.md
├── docker/     Dockerfiles + docker-compose for local/prod
├── docs/       API docs, deployment guide, user manual (stubs)
└── scripts/    backup / seed / deploy helper scripts (stubs)
```

## Status

The **frontend** is functional today against mock data in
`frontend/src/data/mockData.js` — every module in the sidebar has a real
page file, most showing a clean placeholder, a handful (dashboards, staff
list, results, fees) wired to sample data.

The **backend** is structure-only: every controller, route, service and
util is a documented stub. See `backend/README.md` for the suggested build
order.

## Run locally

```
npm run install:all
npm run dev:backend    # http://localhost:5000
npm run dev:frontend   # http://localhost:5173
```

## Two files added beyond the original structure

Everything above matches the agreed folder layout with two practical
exceptions, both necessary for the app to actually run:

- `frontend/index.html` — Vite's required entry HTML (not itemized in the
  structure, but there's no way to boot a Vite app without it).
- `frontend/postcss.config.js` — required for Tailwind's `@tailwind`
  directives in `assets/styles/tailwind.css` to compile.

`frontend/src/data/mockData.js` and
`frontend/src/components/common/ModulePlaceholder.jsx` were also added as
shared support files (sample data + a shared "not built yet" component) —
not part of the original file list, but referenced by nearly every page.