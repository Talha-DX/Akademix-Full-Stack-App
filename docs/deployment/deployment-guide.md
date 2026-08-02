# Deployment Guide — STUB

1. `docker compose -f docker/docker-compose.yml up --build`
2. Set real values in `backend/.env` and `frontend/.env`
3. Run `npm run prisma:migrate` inside the backend container
4. Point your domain at the frontend container's port 8080
