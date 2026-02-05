const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// POST /api/trips/save - Save a trip (requires authentication)
router.post('/save', authMiddleware, async (req, res) => {
    try {
        const { origin, destination, route_json } = req.body;
        const userId = req.user.id;

        // Validation
        if (!origin || !destination || !route_json) {
            return res.status(400).json({
                message: 'Origin, destination, and route data are required'
            });
        }

        // Create trip
        const newTrip = await prisma.trip.create({
            data: {
                user_id: userId,
                origin,
                destination,
                route_json
            }
        });

        res.status(201).json({
            message: 'Trip saved successfully',
            trip: {
                id: newTrip.id,
                origin: newTrip.origin,
                destination: newTrip.destination,
                created_at: newTrip.created_at
            }
        });
    } catch (error) {
        console.error('Save trip error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/trips - Get all trips for logged-in user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const trips = await prisma.trip.findMany({
            where: {
                user_id: userId
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        res.status(200).json(trips);
    } catch (error) {
        console.error('Get trips error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/trips/:id - Get specific trip by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const tripId = parseInt(req.params.id);
        const userId = req.user.id;

        const trip = await prisma.trip.findFirst({
            where: {
                id: tripId,
                user_id: userId // Ensure user can only access their own trips
            }
        });

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        res.status(200).json(trip);
    } catch (error) {
        console.error('Get trip error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/trips/:id - Delete a trip
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const tripId = parseInt(req.params.id);
        const userId = req.user.id;

        // Check if trip exists and belongs to user
        const trip = await prisma.trip.findFirst({
            where: {
                id: tripId,
                user_id: userId
            }
        });

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Delete trip
        await prisma.trip.delete({
            where: {
                id: tripId
            }
        });

        res.status(200).json({ message: 'Trip deleted successfully' });
    } catch (error) {
        console.error('Delete trip error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
