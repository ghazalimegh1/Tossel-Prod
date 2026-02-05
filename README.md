# Algeria Travel Assistant - Full Stack Application

A comprehensive travel assistant web application for traversing Algeria with multi-modal transport routing, user authentication, and trip management.

## ✨ Features

- 🗺️ **Interactive Route Planning** - Find optimal routes using metro, tram, bus, train, and walking
- 🔐 **User Authentication** - Secure JWT-based authentication with password hashing
- 💾 **Trip Management** - Save and manage favorite routes
- 📊 **Dashboard** - View all saved trips with detailed information
- 🗾 **Map Visualization** - Interactive Leaflet maps with route overlays
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.

### Fast Setup

```bash
# 1. Install dependencies
cd backend && npm install

# 2. Setup PostgreSQL database
createdb tossal_travel

# 3. Create .env file (see backend/.env.example)
cp backend/.env.example backend/.env

# 4. Run database migrations
cd backend && npm run prisma:migrate

# 5. Start the application
./start_app.sh
```

Access the app at: `http://localhost:5000`

## 🏗️ Technology Stack

### Backend
- **Node.js** + **Express** - Server framework
- **PostgreSQL** - Database
- **Prisma ORM** - Database toolkit
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **HTML/CSS/JavaScript** - Core technologies
- **Leaflet.js** - Interactive maps
- **Vanilla JS** - No frameworks, just pure performance

## 📁 Project Structure

```
tossal-january/
├── backend/
│   ├── data/              # Transport network data
│   ├── middleware/        # Auth middleware
│   ├── prisma/           # Database schema
│   ├── routes/           # API routes
│   │   ├── auth.js       # Authentication endpoints
│   │   ├── routeFinder.js # Route finding logic
│   │   └── trips.js      # Trip management
│   ├── server.js         # Express server
│   └── .env              # Environment variables
├── frontend/
│   ├── html/             # HTML pages
│   ├── js/               # JavaScript modules
│   │   ├── dashboard/    # Dashboard functionality
│   │   ├── login_page/   # Login logic
│   │   ├── routes_page/  # Route visualization
│   │   ├── utils/        # Utility functions (auth.js)
│   │   └── ...
│   └── css/              # Stylesheets
└── start_app.sh          # Startup script
```

## 🔑 Key Features Explained

### Authentication
- JWT tokens stored in localStorage
- Automatic token expiration handling
- Secure password hashing with bcrypt
- Protected API routes

### Route Finding
- Dijkstra's algorithm for optimal paths
- Multi-modal transport integration
- Step-by-step instructions
- Duration and cost calculations

### Trip Management
- One-click trip saving
- Dashboard with all saved trips
- Delete unwanted trips
- View trip details including route visualization

## 📚 API Documentation

See [SETUP_GUIDE.md](./SETUP_GUIDE.md#api-endpoints) for full API documentation.

### Example: Login

```javascript
POST /api/auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "yourpassword"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "User Name",
    "email": "user@example.com"
  }
}
```

### Example: Save Trip

```javascript
POST /api/trips/save
Authorization: Bearer <token>
Content-Type: application/json

{
  "origin": "Tafourah",
  "destination": "Belouizdad",
  "route_json": {...}  // Route data from route finder
}
```

## 🛠️ Development

### Run in Development Mode

```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Database Management

```bash
# View database
npm run prisma:studio

# Create migration
npm run prisma:migrate

# Reset database
npx prisma migrate reset
```

## 🧪 Testing

To test the application:

1. **Create an account** at `/html/sign_up/sign_up.html`
2. **Login** at `/html/login/login.html`
3. **Find a route** at `/html/route_finder/route_finder.html`
4. **Save the trip** using the "Save Trip" button
5. **View saved trips** at `/html/dashboard/dashboard.html`

### Test Route Examples

See [WORKING_LOCATIONS.md](./WORKING_LOCATIONS.md) for available locations.

Example routes:
- Tafourah → Belouizdad
- Place 1er Mai → Bachdjarah
- Khouba → Caroubier

## 🔒 Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with 24-hour expiration
- CORS enabled for development
- SQL injection protection via Prisma ORM

**Production Checklist:**
- [ ] Change JWT_SECRET to a strong random value
- [ ] Use HTTPS
- [ ] Set NODE_ENV=production
- [ ] Implement rate limiting
- [ ] Add request validation middleware

## 🤝 Contributing

This is a school project, but suggestions are welcome!

## 📝 License

This project is for educational purposes.

## 🙏 Acknowledgments

- OpenStreetMap for map tiles
- Leaflet.js for mapping library
- Prisma team for excellent ORM
- Algeria transport network data

---

**Made with ❤️ for traversing Algeria**
