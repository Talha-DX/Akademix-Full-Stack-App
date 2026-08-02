# Akademix — Frontend

Role-based school management UI (public site + admin/teacher/student/parent
portals). Pages are mostly scaffolded — see the module list in the root
README for what's real vs. a stub.

## Run locally

```
npm install
npm run dev
```

Set `VITE_API_URL` in `.env` once `../backend` has real endpoints; until
then every page reads from `src/data/mockData.js`.

## Structure

- `src/pages/` — one folder per role (`admin/`, `teacher/`, `student/`,
  `parent/`), plus `auth/` and `public/`. Each module/submodule is its own file.
- `src/components/common/Layout` + `Navbar` + `Sidebar` — per-role page frame.
- `src/api/` — one file per backend resource, all pointing at `VITE_API_URL`.
- `src/redux/`, `src/context/` — global state; most pages currently only
  need `context/AuthContext.jsx`.
