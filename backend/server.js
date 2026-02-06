const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Prisma Client
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const routeFinderRoutes = require('./routes/routeFinder');
const driverRoutes = require('./routes/driver');
const tripsRoutes = require('./routes/trips');
const complaintsRoutes = require('./routes/complaints');

app.use('/api/auth', authRoutes);
app.use('/api/routes', routeFinderRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/complaints', complaintsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ message: 'Tossal Backend API is running' });
});

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve home page at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/home/home.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
