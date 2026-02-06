const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Load Transport Network
const networkPath = path.join(__dirname, '../data/transport_network.json');
let transportGraph = { nodes: [], nodesWithCoords: [], edges: [] };

// Initialize driverState with fallback data
let driverState = {
    isOnDuty: true,
    status: "On Time",
    stops: [
        { rank: 1, name: "Bab Ezzouar", status: "Current", time: "06:15", count: 12 },
        { rank: 2, name: "Hussein Dey", status: "Upcoming", time: "06:28", count: 0 },
        { rank: 3, name: "Tafourah - Main post office", status: "Upcoming", time: "06:42", count: 0 },
        { rank: 4, name: "Place des Martyrs", status: "Upcoming", time: "06:55", count: 0 },
        { rank: 5, name: "Les Fusillés", status: "Upcoming", time: "07:08", count: 0 },
        { rank: 6, name: "El Harrach", status: "Upcoming", time: "07:20", count: 0 },
        { rank: 7, name: "Dar El Beida", status: "Upcoming", time: "07:35", count: 0 }
    ]
};

fs.readFile(networkPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error loading transport network:', err);
    } else {
        try {
            transportGraph = JSON.parse(data);
            console.log(`Driver: Loaded ${transportGraph.nodes.length} transport locations.`);
            // Initialize with real route once data is loaded
            initializeRealRoute();
        } catch (e) {
            console.error('Error parsing transport network:', e);
        }
    }
});

// Generate realistic route from transport network
function initializeRealRoute() {
    if (!transportGraph.edges || transportGraph.edges.length === 0) return;

    const busEdges = transportGraph.edges.filter(e => e.mode === 'bus' || e.mode === 'tram');
    if (busEdges.length === 0) return;

    // Try to find a good route with at least 5 stops
    let bestRoute = [];
    const lines = [...new Set(busEdges.map(e => e.line))];

    // Try up to 10 random lines to find one with enough stops
    for (let attempt = 0; attempt < 10; attempt++) {
        const selectedLine = lines[Math.floor(Math.random() * lines.length)];
        const lineEdges = busEdges.filter(e => e.line === selectedLine);

        // Find a starting point that allows for a long path
        // For simplicity, just pick the first one and try to chain
        let route = [];
        let currentNode = lineEdges[0].from;
        route.push(currentNode);

        for (let i = 0; i < 7; i++) {
            const nextEdge = lineEdges.find(e => e.from === currentNode && !route.includes(e.to));
            if (nextEdge) {
                route.push(nextEdge.to);
                currentNode = nextEdge.to;
            } else {
                break;
            }
        }

        if (route.length >= 5) {
            bestRoute = route;
            break;
        }
    }

    // If we couldn't find a long enough route, keep the fallback data or try best effort
    if (bestRoute.length < 5) {
        console.log("Could not find a route with >= 5 stops. Using fallback.");
        return;
    }

    // Generate stops with times
    const now = new Date();
    const startTime = new Date(now.getTime() + 5 * 60000); // Start in 5 minutes

    driverState.stops = bestRoute.map((location, index) => {
        const stopTime = new Date(startTime.getTime() + index * 15 * 60000); // 15 min intervals
        const hours = stopTime.getHours().toString().padStart(2, '0');
        const minutes = stopTime.getMinutes().toString().padStart(2, '0');

        let status = 'Upcoming';
        let count = 0;

        // Start fresh: 1st stop Current, others Upcoming
        // This ensures the user definitely has buttons to press
        if (index === 0) {
            status = 'Current';
            count = Math.floor(Math.random() * 10 + 5);
        }

        return {
            rank: index + 1,
            name: location,
            status: status,
            time: `${hours}:${minutes}`,
            count: count
        };
    });

    console.log(`Initialized real route with ${bestRoute.length} stops.`);
}

// GET /api/driver/dashboard
router.get('/dashboard', (req, res) => {
    res.json(driverState);
});

// POST /api/driver/duty
router.post('/duty', (req, res) => {
    const { isOnDuty } = req.body;
    if (typeof isOnDuty !== 'boolean') {
        return res.status(400).json({ message: 'isOnDuty must be a boolean' });
    }
    driverState.isOnDuty = isOnDuty;
    res.json({ message: 'Duty status updated', isOnDuty: driverState.isOnDuty });
});

// POST /api/driver/status
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
router.post('/stop/complete', (req, res) => {
    const currentStopIndex = driverState.stops.findIndex(s => s.status === "Current");

    if (currentStopIndex === -1) {
        // If no current stop, maybe all are completed or none started
        // If none started (all upcoming), start the first one
        const firstUpcoming = driverState.stops.findIndex(s => s.status === "Upcoming");
        if (firstUpcoming !== -1) {
            driverState.stops[firstUpcoming].status = "Current";
            driverState.stops[firstUpcoming].count = Math.floor(Math.random() * 16 + 5);
            return res.json({ message: 'Route started', stops: driverState.stops });
        }

        // Check if all completed
        const allCompleted = driverState.stops.every(s => s.status === "Completed");
        if (allCompleted) {
            return res.json({ message: 'Route completed', stops: driverState.stops, completed: true });
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
