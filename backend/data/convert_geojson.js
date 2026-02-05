const fs = require('fs');
const path = require('path');

// Load GeoJSON files
const stationsPath = path.join(__dirname, 'export (4).geojson'); // Station points
const tracksPath = path.join(__dirname, 'stations.geojson'); // Railway tracks

const stationsData = JSON.parse(fs.readFileSync(stationsPath, 'utf8'));
const tracksData = JSON.parse(fs.readFileSync(tracksPath, 'utf8'));

console.log('Parsing transport network data...');
console.log(`Station points: ${stationsData.features.length}`);
console.log(`Railway tracks: ${tracksData.features.length}`);

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// Extract station nodes from points
const nodes = [];
const nodeMap = new Map();

stationsData.features.forEach(feature => {
    const props = feature.properties;
    const geom = feature.geometry;

    if (!geom || geom.type !== 'Point' || !geom.coordinates) return;

    const [lng, lat] = geom.coordinates;

    // Prioritize English and French names over Arabic
    let name = props['name:en'] || props['name:fr'] || props.name;

    if (!name) return;

    // Determine transport type
    let transportTypes = [];

    if (props.railway === 'station' || props.railway === 'halt') {
        transportTypes.push('train');
    }
    if (props.railway === 'tram_stop' || props.tram === 'yes') {
        transportTypes.push('tram');
    }
    if (props.station === 'subway' || props.subway === 'yes' || props.railway === 'subway_entrance') {
        transportTypes.push('metro');
    }
    if (props.highway === 'bus_stop' || props.bus === 'yes') {
        transportTypes.push('bus');
    }

    if (transportTypes.length === 0) return;

    const line = props.line || props.ref || props.local_ref;

    const key = `${name}_${lat.toFixed(4)}_${lng.toFixed(4)}`;

    if (!nodeMap.has(key)) {
        nodeMap.set(key, {
            name: name,
            lat: lat,
            lng: lng,
            transportTypes: transportTypes,
            lines: line ? [line] : [],
            nearbyTracks: [] // Store references to nearby railway tracks
        });
    } else {
        const existing = nodeMap.get(key);
        transportTypes.forEach(t => {
            if (!existing.transportTypes.includes(t)) {
                existing.transportTypes.push(t);
            }
        });
        if (line && !existing.lines.includes(line)) {
            existing.lines.push(line);
        }
    }
});

nodes.push(...Array.from(nodeMap.values()));
console.log(`\nExtracted ${nodes.length} unique transport stops`);

// Index railway tracks by proximity to stations
console.log('Indexing railway tracks for smooth path visualization...');
const railwayTracks = [];

tracksData.features.forEach((feature, idx) => {
    if (feature.geometry && feature.geometry.type === 'LineString') {
        railwayTracks.push({
            id: idx,
            coordinates: feature.geometry.coordinates,
            properties: feature.properties
        });
    }
});

console.log(`Indexed ${railwayTracks.length} railway track segments`);

// Create edges with path information
const edges = [];
const edgeSet = new Set();

// Group nodes by line to create connections
const lineGroups = new Map();

nodes.forEach(node => {
    node.lines.forEach(line => {
        if (!lineGroups.has(line)) {
            lineGroups.set(line, []);
        }
        lineGroups.get(line).push(node);
    });
});

// Connect nodes on the same line
lineGroups.forEach((nodesOnLine, line) => {
    if (nodesOnLine.length < 2) return;

    for (let i = 0; i < nodesOnLine.length; i++) {
        const node1 = nodesOnLine[i];

        const distances = nodesOnLine
            .map((node2, idx) => ({
                node: node2,
                idx: idx,
                dist: calculateDistance(node1.lat, node1.lng, node2.lat, node2.lng)
            }))
            .filter(d => d.idx !== i && d.dist < 5)
            .sort((a, b) => a.dist - b.dist)
            .slice(0, 3);

        distances.forEach(({ node: node2, dist }) => {
            const edgeKey1 = `${node1.name}|${node2.name}|${line}`;
            const edgeKey2 = `${node2.name}|${node1.name}|${line}`;

            if (!edgeSet.has(edgeKey1) && !edgeSet.has(edgeKey2)) {
                edgeSet.add(edgeKey1);

                let mode = 'bus';
                if (node1.transportTypes.includes('metro') && node2.transportTypes.includes('metro')) {
                    mode = 'metro';
                } else if (node1.transportTypes.includes('tram') && node2.transportTypes.includes('tram')) {
                    mode = 'tram';
                } else if (node1.transportTypes.includes('train') && node2.transportTypes.includes('train')) {
                    mode = 'train';
                }

                const timeInMinutes = Math.ceil((dist / 30) * 60);

                // Find nearby railway tracks for smooth visualization
                const pathCoords = findPathBetweenStations(node1, node2, railwayTracks);

                edges.push({
                    from: node1.name,
                    to: node2.name,
                    mode: mode,
                    distance: timeInMinutes,
                    line: line,
                    pathCoordinates: pathCoords // Store actual railway path
                });

                edges.push({
                    from: node2.name,
                    to: node1.name,
                    mode: mode,
                    distance: timeInMinutes,
                    line: line,
                    pathCoordinates: pathCoords ? pathCoords.slice().reverse() : null
                });
            }
        });
    }
});

// Function to find railway path between two stations
function findPathBetweenStations(station1, station2, tracks) {
    const maxSearchDist = 0.5; // 500m search radius

    // Find tracks near both stations
    const nearbyTracks = tracks.filter(track => {
        if (!track.coordinates || track.coordinates.length < 2) return false;

        const startCoord = track.coordinates[0];
        const endCoord = track.coordinates[track.coordinates.length - 1];

        // Check if track is near either station
        for (let coord of [startCoord, ...track.coordinates.slice(1, -1), endCoord]) {
            const distTo1 = calculateDistance(station1.lat, station1.lng, coord[1], coord[0]);
            const distTo2 = calculateDistance(station2.lat, station2.lng, coord[1], coord[0]);

            if (distTo1 < maxSearchDist || distTo2 < maxSearchDist) {
                return true;
            }
        }
        return false;
    });

    if (nearbyTracks.length > 0) {
        // Return the coordinates of the first nearby track
        // Format: [[lng, lat], [lng, lat], ...]
        return nearbyTracks[0].coordinates;
    }

    return null; // No path found, will use straight line
}

// Connect nodes without line info by transport type
const nodesWithoutLines = nodes.filter(n => n.lines.length === 0);
console.log(`\nConnecting ${nodesWithoutLines.length} nodes without line info...`);

['metro', 'train', 'tram'].forEach(transportType => {
    const nodesOfType = nodesWithoutLines.filter(n => n.transportTypes.includes(transportType));

    for (let i = 0; i < nodesOfType.length; i++) {
        const node1 = nodesOfType[i];

        const nearbyNodes = nodesOfType
            .map((node2, idx) => ({
                node: node2,
                idx: idx,
                dist: calculateDistance(node1.lat, node1.lng, node2.lat, node2.lng)
            }))
            .filter(d => d.idx !== i && d.dist < 3)
            .sort((a, b) => a.dist - b.dist)
            .slice(0, 2);

        nearbyNodes.forEach(({ node: node2, dist }) => {
            const edgeKey = `${node1.name}|${node2.name}|${transportType}`;
            const edgeKey2 = `${node2.name}|${node1.name}|${transportType}`;

            if (!edgeSet.has(edgeKey) && !edgeSet.has(edgeKey2)) {
                edgeSet.add(edgeKey);

                const timeInMinutes = Math.ceil((dist / 30) * 60);
                const lineName = transportType === 'metro' ? 'Metro' : transportType === 'train' ? 'Train' : 'Tram';

                const pathCoords = findPathBetweenStations(node1, node2, railwayTracks);

                edges.push({
                    from: node1.name,
                    to: node2.name,
                    mode: transportType,
                    distance: timeInMinutes || 1,
                    line: lineName,
                    pathCoordinates: pathCoords
                });

                edges.push({
                    from: node2.name,
                    to: node1.name,
                    mode: transportType,
                    distance: timeInMinutes || 1,
                    line: lineName,
                    pathCoordinates: pathCoords ? pathCoords.slice().reverse() : null
                });
            }
        });
    }
});

// Add walking connections
for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];
        const dist = calculateDistance(node1.lat, node1.lng, node2.lat, node2.lng);

        if (dist < 0.2) {
            const walkTime = Math.ceil((dist / 5) * 60);

            const edgeKey1 = `${node1.name}|${node2.name}|walk`;
            const edgeKey2 = `${node2.name}|${node1.name}|walk`;

            if (!edgeSet.has(edgeKey1) && !edgeSet.has(edgeKey2)) {
                edgeSet.add(edgeKey1);

                edges.push({
                    from: node1.name,
                    to: node2.name,
                    mode: 'feet',
                    distance: walkTime || 1,
                    line: 'Walk',
                    pathCoordinates: null // Walking uses straight line
                });

                edges.push({
                    from: node2.name,
                    to: node1.name,
                    mode: 'feet',
                    distance: walkTime || 1,
                    line: 'Walk',
                    pathCoordinates: null
                });
            }
        }
    }
}

console.log(`\nCreated ${edges.length} edges (connections)`);

// Create transport network structure
const transportNetwork = {
    nodes: nodes.map(n => n.name),
    nodesWithCoords: nodes.map(n => ({
        name: n.name,
        lat: n.lat,
        lng: n.lng
    })),
    edges: edges
};

// Save to file
const outputPath = path.join(__dirname, 'transport_network.json');
fs.writeFileSync(outputPath, JSON.stringify(transportNetwork, null, 2));

console.log('\n✅ Transport network generated successfully!');
console.log(`📍 Total nodes: ${transportNetwork.nodes.length}`);
console.log(`🔗 Total edges: ${transportNetwork.edges.length}`);
console.log(`🛤️  Edges with path data: ${edges.filter(e => e.pathCoordinates).length}`);
console.log(`📁 Saved to: ${outputPath}`);

console.log('\n🔍 Sample edges with paths:');
edges.filter(e => e.pathCoordinates).slice(0, 3).forEach(e => {
    console.log(`  ${e.from} → ${e.to}: ${e.pathCoordinates.length} coordinates`);
});
