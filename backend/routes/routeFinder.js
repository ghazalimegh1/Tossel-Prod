const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Load Transport Network
const networkPath = path.join(__dirname, '../data/transport_network.json');
let transportGraph = { nodes: [], nodesWithCoords: [], edges: [] };

fs.readFile(networkPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error loading transport network:', err);
    } else {
        try {
            transportGraph = JSON.parse(data);
            console.log(`Loaded ${transportGraph.nodes.length} nodes and ${transportGraph.edges.length} edges.`);
        } catch (e) {
            console.error('Error parsing transport network:', e);
        }
    }
});

// GET /api/routes/locations
// Returns the list of known locations for autocomplete
router.get('/locations', (req, res) => {
    // Return nodes with coordinates for map visualization
    res.json({ knownLocations: transportGraph.nodesWithCoords || transportGraph.nodes });
});

// Dijkstra's Algorithm Implementation
function findShortestPath(startNode, endNode, graph) {
    const distances = {};
    const previous = {};
    const pq = new PriorityQueue();

    // Initialize
    graph.nodes.forEach(node => {
        distances[node] = Infinity;
        previous[node] = null;
    });
    distances[startNode] = 0;
    pq.enqueue(startNode, 0);

    while (!pq.isEmpty()) {
        const { element: currentNode } = pq.dequeue();

        if (currentNode === endNode) break;

        // Find neighbors
        const neighbors = graph.edges.filter(edge => edge.from === currentNode);

        for (const edge of neighbors) {
            const neighbor = edge.to;
            const alt = distances[currentNode] + edge.distance; // Distance is weighted (time in minutes)

            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                previous[neighbor] = { node: currentNode, edge: edge };
                pq.enqueue(neighbor, alt);
            }
        }
    }

    // Reconstruct Path with full edge details
    const path = [];
    let current = endNode;

    if (distances[endNode] === Infinity) return null; // No path found

    while (current !== startNode) {
        const prevData = previous[current];
        if (!prevData) return null; // Should not happen if path exists

        path.unshift({
            from: prevData.node,
            to: current,
            mode: prevData.edge.mode,
            line: prevData.edge.line,
            duration: prevData.edge.distance,
            pathCoordinates: prevData.edge.pathCoordinates // Preserve path coordinates
        });
        current = prevData.node;
    }

    return path;
}

// Group consecutive steps on the same line
function groupStepsByLine(rawPath, graph) {
    if (!rawPath || rawPath.length === 0) return [];

    const groupedSteps = [];
    let currentGroup = {
        mode: rawPath[0].mode,
        line: rawPath[0].line,
        from: rawPath[0].from,
        to: rawPath[0].to,
        stops: [rawPath[0].from, rawPath[0].to],
        duration: rawPath[0].duration,
        pathCoordinates: rawPath[0].pathCoordinates ? [...rawPath[0].pathCoordinates] : []
    };

    for (let i = 1; i < rawPath.length; i++) {
        const step = rawPath[i];

        // If same line and mode, extend current group
        if (step.line === currentGroup.line && step.mode === currentGroup.mode) {
            currentGroup.to = step.to;
            currentGroup.stops.push(step.to);
            currentGroup.duration += step.duration;
            // Merge path coordinates
            if (step.pathCoordinates) {
                // If the start of new segment matches end of previous, just append
                // Otherwise checking direction might be needed, but assume they are sequential for now
                currentGroup.pathCoordinates.push(...step.pathCoordinates);
            }
        } else {
            // Different line/mode - save current group and start new one
            groupedSteps.push(currentGroup);
            currentGroup = {
                mode: step.mode,
                line: step.line,
                from: step.from,
                to: step.to,
                stops: [step.from, step.to],
                duration: step.duration,
                pathCoordinates: step.pathCoordinates ? [...step.pathCoordinates] : []
            };
        }
    }

    // Add the last group
    groupedSteps.push(currentGroup);

    return groupedSteps;
}

// Create detailed instructions from grouped steps
function createDetailedInstructions(groupedSteps) {
    const detailedSteps = [];

    for (let i = 0; i < groupedSteps.length; i++) {
        const group = groupedSteps[i];
        const stopCount = group.stops.length - 1; // Number of segments

        let instruction = '';

        if (group.mode === 'feet') {
            instruction = `Walk from ${group.from} to ${group.to}`;
        } else {
            const modeText = group.mode === 'bus' ? 'Bus' :
                group.mode === 'metro' ? 'Metro' :
                    group.mode === 'tram' ? 'Tram' :
                        group.mode === 'train' ? 'Train' : group.mode;

            if (stopCount > 1) {
                instruction = `Take ${modeText} ${group.line} from ${group.from} to ${group.to} (${stopCount} stops)`;
            } else {
                instruction = `Take ${modeText} ${group.line} from ${group.from} to ${group.to}`;
            }
        }

        detailedSteps.push({
            mean: group.mode,
            type: group.line,
            step_duration: group.duration,
            step_instruction: instruction,
            start_location: group.from,
            end_location: group.to,
            stops: group.stops,
            pathCoordinates: group.pathCoordinates // Include coordinates in output
        });

        // Add transfer instruction if there's a next step and it's a different line
        if (i < groupedSteps.length - 1) {
            const nextGroup = groupedSteps[i + 1];
            if (nextGroup.mode !== 'feet' && group.mode !== 'feet') {
                detailedSteps.push({
                    mean: 'transfer',
                    type: 'Transfer',
                    step_duration: 2, // Assume 2 min transfer time
                    step_instruction: `Transfer to ${nextGroup.line} at ${group.to}`,
                    start_location: group.to,
                    end_location: group.to
                });
            }
        }
    }

    return detailedSteps;
}

// Simple Priority Queue
class PriorityQueue {
    constructor() {
        this.items = [];
    }
    enqueue(element, priority) {
        const queueElement = { element, priority };
        let added = false;
        for (let i = 0; i < this.items.length; i++) {
            if (queueElement.priority < this.items[i].priority) {
                this.items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }
        if (!added) this.items.push(queueElement);
    }
    dequeue() {
        return this.items.shift();
    }
    isEmpty() {
        return this.items.length === 0;
    }
}


// GET /api/routes/find
// Returns REAL calculated routes based on start and destination
router.get('/find', (req, res) => {
    const { start, destination } = req.query;

    if (!start || !destination) {
        return res.status(400).json({ message: 'Start and destination are required' });
    }

    // Find matching nodes (case-insensitive, partial match)
    const startNode = transportGraph.nodes.find(n =>
        n.toLowerCase().includes(start.toLowerCase()) ||
        start.toLowerCase().includes(n.toLowerCase())
    );
    const destNode = transportGraph.nodes.find(n =>
        n.toLowerCase().includes(destination.toLowerCase()) ||
        destination.toLowerCase().includes(n.toLowerCase())
    );

    if (!startNode || !destNode) {
        return res.status(404).json({
            message: 'Location not found in network',
            availableLocations: transportGraph.nodes.slice(0, 20)
        });
    }

    // Calculate Path
    const rawPath = findShortestPath(startNode, destNode, transportGraph);

    if (!rawPath) {
        return res.json([]); // No route found
    }

    // Group steps by line
    const groupedSteps = groupStepsByLine(rawPath, transportGraph);

    // Create detailed instructions
    const detailedSteps = createDetailedInstructions(groupedSteps);

    // Format for Frontend
    const totalDuration = detailedSteps.reduce((sum, step) => sum + step.step_duration, 0);
    const totalCost = (groupedSteps.filter(g => g.mode !== 'feet').length * 20).toFixed(2); // 20 DA per transport segment

    const routeResult = {
        rank: "1st",
        title: "Best Route",
        duration: totalDuration,
        cost: totalCost,
        steps: detailedSteps
    };

    // Simulate returning multiple options (for now just one best path)
    res.json([routeResult]);
});

module.exports = router;

