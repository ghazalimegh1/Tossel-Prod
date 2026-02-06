# Deployment Guide (SQLite / Option A)

This project is configured to run in a Docker container with local SQLite storage. This is the simplest way to host the app.

## Prerequisites
- A hosting provider that supports Docker (e.g., **Railway**, **Render**, or a **VPS** with Docker installed).
- A Git repository (GitHub/GitLab) containing these files.

## Local Testing
To test the production setup locally:
1. Install Docker and Docker Compose.
2. Run `docker-compose up --build`.
3. Open `http://localhost:5000`.

## Hosting on Railway (Recommended)
1. Push your code to GitHub.
2. Link your GitHub repo to **Railway**.
3. Railway will automatically detect the `Dockerfile`.
4. **IMPORTANT:** In the Railway dashboard, go to **Settings > Volumes**.
    - Add a volume.
    - Mount path: `/app/backend/prisma`
    - This ensures your `dev.db` file is not deleted when you redeploy.
5. Set the following environment variables in Railway:
    - `PORT=5000`
    - `JWT_SECRET=your_long_random_secret_here`
    - `DATABASE_URL=file:./dev.db` (The mount path handles the file location).

## Hosting on Render
1. Create a "Web Service" pointing to your repo.
2. Select "Docker" as the Environment.
3. Go to **Advanced > Add Disk**.
    - Mount Path: `/app/backend/prisma`
    - Size: 1GB is more than enough for start.
4. Add environment variables:
    - `PORT=5000`
    - `JWT_SECRET=your_secret`
5. Render will build and deploy the project.

## Hosting on a VPS (DigitalOcean/Linode/etc.)
1. SSH into your server.
2. `git clone <your-repo>`
3. `docker-compose up -d`
4. Use Nginx as a reverse proxy to point your domain to port 5000.
