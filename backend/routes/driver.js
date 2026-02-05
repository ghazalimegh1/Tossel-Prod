const express = require('express');
const router = express.Router();

// Mock State (In-memory)
let driverState = {
    isOnDuty: true,
    status: "On Time", // On Time, Delayed, Running Early, Technical Issue
    stops: [
        { rank: 1, name: "Central Station", status: "Completed", time: "06:15 AM", count: 12 },
        { rank: 2, name: "Oak Street", status: "Completed", time: "06:28 AM", count: 8 },
        { rank: 3, name: "Park Avenue", status: "Current", time: "06:42 AM", count: 15 },
        { rank: 4, name: "Main Street", status: "Upcoming", time: "06:55 AM", count: 0 },
        { rank: 5, name: "Transfer Hub", status: "Upcoming", time: "07:08 AM", count: 0 },
        { rank: 6, name: "City Center", status: "Upcoming", time: "07:20 AM", count: 0 },
        { rank: 7, name: "University Campus", status: "Upcoming", time: "07:35 AM", count: 0 }
    ]
};

// GET /api/driver/dashboard
// Get full dashboard state
router.get('/dashboard', (req, res) => {
    res.json(driverState);
});

// POST /api/driver/duty
// Toggle duty status
router.post('/duty', (req, res) => {
    const { isOnDuty } = req.body;
    if (typeof isOnDuty !== 'boolean') {
        return res.status(400).json({ message: 'isOnDuty must be a boolean' });
    }
    driverState.isOnDuty = isOnDuty;
    res.json({ message: 'Duty status updated', isOnDuty: driverState.isOnDuty });
});

// POST /api/driver/status
// Update operational status
router.post('/status', (req, res) => {
    const { status } = req.body;
    const validStatuses = ["On Time", "Delayed", "Running Early", "Technical Issue"];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    driverState.status = status;
    res.json({ message: 'Status updated', status: driverState.status });
});

// POST /api/driver/stop/complete
// Mark current stop as completed and move to next
router.post('/stop/complete', (req, res) => {
    const currentStopIndex = driverState.stops.findIndex(s => s.status === "Current");

    if (currentStopIndex === -1) {
        // If no current stop, maybe all are completed or none started
        const firstUpcoming = driverState.stops.findIndex(s => s.status === "Upcoming");
        if (firstUpcoming !== -1) {
            driverState.stops[firstUpcoming].status = "Current";
            // Random count for mock
            driverState.stops[firstUpcoming].count = Math.floor(Math.random() * 16 + 5);
            return res.json({ message: 'Route started', stops: driverState.stops });
        }
        return res.status(400).json({ message: 'No current route active' });
    }

    // Complete current stop
    driverState.stops[currentStopIndex].status = "Completed";

    // Activate next stop if exists
    if (currentStopIndex + 1 < driverState.stops.length) {
        driverState.stops[currentStopIndex + 1].status = "Current";
        driverState.stops[currentStopIndex + 1].count = Math.floor(Math.random() * 16 + 5);
        res.json({ message: 'Moved to next stop', stops: driverState.stops, completed: false });
    } else {
        res.json({ message: 'Route completed', stops: driverState.stops, completed: true });
    }
});

module.exports = router;
