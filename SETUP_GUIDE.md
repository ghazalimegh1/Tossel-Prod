# Travel Assistant App - Setup Guide

## Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

## Database Setup

1. **Install PostgreSQL** (if not already installed)

2. **Create the database and user:**

```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Create database and user
CREATE DATABASE tossal_travel;
CREATE USER tossal_user WITH ENCRYPTED PASSWORD 'tossal_password';
GRANT ALL PRIVILEGES ON DATABASE tossal_travel TO tossal_user;
\q
```

## Backend Setup

1. **Navigate to backend directory:**

```bash
cd backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
# Edit .env with your database connection string
```

4. **Run Prisma migrations:**

```bash
npm run prisma:migrate
```

This will create the User and Trip tables in your database.

5. **Generate Prisma Client:**

```bash
npm run prisma:generate
```

## Running the Application

### Development Mode

From the root directory, run:

```bash
./start_app.sh
```

Or manually:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# The backend will run on http://localhost:5000
# The frontend is served from http://localhost:5000
```

### Production Mode

```bash
cd backend
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user (returns JWT token)

### Routes

- `GET /api/routes/locations` - Get all available locations
- `GET /api/routes/find?start=<location>&destination=<location>` - Find routes

### Trips (Protected - requires JWT)

- `POST /api/trips/save` - Save a trip
- `GET /api/trips` - Get all saved trips for logged-in user
- `GET /api/trips/:id` - Get specific trip
- `DELETE /api/trips/:id` - Delete a trip

## Database Management

### View database with Prisma Studio:

```bash
cd backend
npm run prisma:studio
```

This will open a browser interface at `http://localhost:5555` to view and manage your database.

### Reset database:

```bash
cd backend
npx prisma migrate reset
```

## Features

### Authentication
- JWT-based authentication
- Secure password hashing with bcrypt
- Token stored in localStorage on frontend

### Trip Management
- Save favorite routes
- View saved trips in dashboard
- Delete saved trips
- Automatic authentication checks

### Route Finding
- Multi-modal transport (metro, tram, bus, train, walking)
- Interactive map visualization with Leaflet
- Detailed step-by-step instructions
- Duration and cost estimates

## Troubleshooting

### Database Connection Issues

If you get connection errors:

1. Verify PostgreSQL is running:
```bash
sudo systemctl status postgresql
```

2. Check your DATABASE_URL in `.env` matches your PostgreSQL configuration

3. Verify database exists:
```bash
psql -U tossal_user -d tossal_travel
```

### Prisma Migration Issues

If migrations fail, try:

```bash
cd backend
npx prisma migrate reset  # WARNING: This deletes all data
npx prisma migrate dev
```

### Port Already in Use

If port 5000 is taken, change it in `backend/.env`:

```
PORT=3000
```

## Development Tips

- Use `npm run prisma:studio` to inspect database
- Backend auto-reloads with nodemon in dev mode
- Check browser console for frontend errors
- Backend logs in terminal

## Security Notes

**IMPORTANT for Production:**

1. Change `JWT_SECRET` in `.env` to a strong random string
2. Use environment-specific database credentials
3. Enable HTTPS
4. Set `NODE_ENV=production`
5. Add rate limiting to authentication endpoints
