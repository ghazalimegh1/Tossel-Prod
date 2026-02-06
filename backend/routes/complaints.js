const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth'); // Optional for submission, needed for tracking

const prisma = new PrismaClient();

// POST /api/complaints - Submit a complaint
router.post('/', async (req, res) => {
    try {
        const { fullname, email, phone, complaintType, route, description, userId } = req.body;

        // Validation
        if (!fullname || !email || !complaintType || !description) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newComplaint = await prisma.complaint.create({
            data: {
                fullname,
                email,
                phone,
                type: complaintType,
                route,
                description,
                user_id: userId ? parseInt(userId) : null
            }
        });

        res.status(201).json({
            message: 'Complaint submitted successfully',
            trackingId: `C-2024-${newComplaint.id.toString().padStart(3, '0')}`,
            complaint: newComplaint
        });

    } catch (error) {
        console.error('Submit complaint error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/complaints/my-complaints - Get complaints for logged in user
// Note: This requires the frontend to send the token
router.get('/my-complaints', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware

        const complaints = await prisma.complaint.findMany({
            where: {
                user_id: userId
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        res.status(200).json(complaints);
    } catch (error) {
        console.error('Get my complaints error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
