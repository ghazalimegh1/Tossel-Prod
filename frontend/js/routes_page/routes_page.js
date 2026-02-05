// route component

const routes_container = document.getElementById("routes-container");
let routes = []; // Will be populated from API
let map;
let routeLayer;

// Map Initialization
function initMap() {
    if (document.getElementById('map')) {
        map = L.map('map').setView([36.75, 3.05], 11); // Center on Algiers

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);
    }
}

// Draw Route on Map with Enhanced Visibility
function drawRouteOnMap(routeSteps) {
    if (!map) return;

    // Clear previous layers
    if (routeLayer) {
        map.removeLayer(routeLayer);
    }

    const latlngs = [];
    const markers = L.layerGroup().addTo(map);

    // Fetch locations to get coordinates for start/end points
    fetch("/api/routes/locations")
        .then(res => res.json())
        .then(data => {
            const nodes = data.knownLocations;
            const nodeMap = {};
            nodes.forEach(n => {
                if (typeof n === 'object') nodeMap[n.name] = [n.lat, n.lng];
            });

            routeSteps.forEach((step, index) => {
                const startCoords = nodeMap[step.start_location];
                const endCoords = nodeMap[step.end_location];

                // Add start marker
                if (startCoords) {
                    if (index === 0) {
                        // Custom start marker with green color
                        L.marker(startCoords, {
                            icon: L.divIcon({
                                className: 'custom-marker',
                                html: '<div style="background: #00A63E; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
                                iconSize: [24, 24],
                                iconAnchor: [12, 12]
                            })
                        }).addTo(markers).bindPopup(`<strong>Start:</strong> ${step.start_location}`).openPopup();
                    } else {
                        L.circleMarker(startCoords, {
                            radius: 4,
                            color: '#fff',
                            fillColor: getModeColor(step.mean),
                            fillOpacity: 0.9,
                            weight: 2
                        }).addTo(markers).bindPopup(step.start_location);
                    }
                }

                // Add end marker
                if (endCoords && index === routeSteps.length - 1) {
                    L.marker(endCoords, {
                        icon: L.divIcon({
                            className: 'custom-marker',
                            html: '<div style="background: #E7000B; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
                            iconSize: [24, 24],
                            iconAnchor: [12, 12]
                        })
                    }).addTo(markers).bindPopup(`<strong>End:</strong> ${step.end_location}`);
                }

                // Add path segment with enhanced visibility
                if (step.pathCoordinates && step.pathCoordinates.length > 0) {
                    // Coordinates from backend are [lng, lat], Leaflet needs [lat, lng]
                    const segmentCoords = step.pathCoordinates.map(coord => [coord[1], coord[0]]);
                    latlngs.push(...segmentCoords);

                    // Draw segment with enhanced visibility
                    const color = getModeColor(step.mean);
                    L.polyline(segmentCoords, {
                        color: color,
                        weight: 8,           // Increased from 8 to 8 (thicker)
                        opacity: 0.85,       // Slightly transparent to see map underneath
                        lineJoin: 'round',   // Smooth corners
                        lineCap: 'round'     // Rounded ends
                    }).addTo(markers).bindPopup(`<strong>${step.type || step.mean}</strong><br>${step.start_location} → ${step.end_location}`);
                } else {
                    // Fallback to straight line
                    if (startCoords && endCoords) {
                        latlngs.push(startCoords, endCoords);
                        const color = getModeColor(step.mean);
                        L.polyline([startCoords, endCoords], {
                            color: color,
                            weight: 6,
                            opacity: 0.7,
                            dashArray: '10, 8',
                            lineJoin: 'round',
                            lineCap: 'round'
                        }).addTo(markers);
                    }
                }
            });

            // Auto-fit map to show entire route with padding
            if (latlngs.length > 0) {
                map.fitBounds(L.polyline(latlngs).getBounds(), {
                    padding: [60, 60],
                    maxZoom: 15  // Prevent zooming in too much
                });
                routeLayer = markers;
            }
        })
        .catch(e => console.error("Map plotting error:", e));
}

function getModeColor(mode) {
    switch (mode) {
        case 'metro': return '#008236';      // Green for metro
        case 'tram': return '#8200DB';       // Purple for tram
        case 'train': return '#F59E0B';      // Amber for train (better visibility)
        case 'bus': return '#2563EB';        // Brighter blue for bus
        case 'feet': case 'walk': return '#64748B';  // Gray for walking
        case 'transfer': return '#EC4899';   // Pink for transfers
        default: return '#4169E1';           // Royal blue default
    }
}


const means_logos = {
    "feet": `<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.00013 13.3334V11.35C4.00013 9.58335 3.1418 8.75002 3.1668 6.66669C3.1918 4.40002 4.40846 1.66669 6.9168 1.66669C8.47513 1.66669 9.00013 3.16669 9.00013 4.58335C9.00013 7.17502 7.33346 9.30002 7.33346 11.8167V13.3334C7.33346 13.7754 7.15787 14.1993 6.84531 14.5119C6.53275 14.8244 6.10882 15 5.6668 15C5.22477 15 4.80084 14.8244 4.48828 14.5119C4.17572 14.1993 4.00013 13.7754 4.00013 13.3334Z" stroke="#314158" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17.3335 16.6667V14.6833C17.3335 12.9167 18.1918 12.0833 18.1668 10C18.1418 7.73333 16.9252 5 14.4168 5C12.8585 5 12.3335 6.5 12.3335 7.91667C12.3335 10.5083 14.0002 12.6333 14.0002 15.15V16.6667C14.0002 17.1087 14.1758 17.5326 14.4883 17.8452C14.8009 18.1577 15.2248 18.3333 15.6668 18.3333C16.1089 18.3333 16.5328 18.1577 16.8453 17.8452C17.1579 17.5326 17.3335 17.1087 17.3335 16.6667Z" stroke="#314158" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 14.1667H17.3333" stroke="#314158" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 10.8333H7.33333" stroke="#314158" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            `,

    "bus": `<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.3335 5.33331V10.3333" stroke="#1447E6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.1667 5.33331V10.3333" stroke="#1447E6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2.3335 10.3333H18.6668" stroke="#1447E6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15.6668 15.3333H18.1668C18.1668 15.3333 18.5835 13.9166 18.8335 13C18.9168 12.6666 19.0002 12.3333 19.0002 12C19.0002 11.6666 18.9168 11.3333 18.8335 11L17.6668 6.83331C17.4168 5.99998 16.5835 5.33331 15.6668 5.33331H4.00016C3.55814 5.33331 3.13421 5.50891 2.82165 5.82147C2.50909 6.13403 2.3335 6.55795 2.3335 6.99998V15.3333H4.8335" stroke="#1447E6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.50016 17C7.42064 17 8.16683 16.2538 8.16683 15.3333C8.16683 14.4128 7.42064 13.6666 6.50016 13.6666C5.57969 13.6666 4.8335 14.4128 4.8335 15.3333C4.8335 16.2538 5.57969 17 6.50016 17Z" stroke="#1447E6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.16675 15.3333H12.3334" stroke="#1447E6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14.0002 17C14.9206 17 15.6668 16.2538 15.6668 15.3333C15.6668 14.4128 14.9206 13.6666 14.0002 13.6666C13.0797 13.6666 12.3335 14.4128 12.3335 15.3333C12.3335 16.2538 13.0797 17 14.0002 17Z" stroke="#1447E6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            `,

    "metro": `<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.6667 2.5H5.66667C4.74619 2.5 4 3.24619 4 4.16667V14.1667C4 15.0871 4.74619 15.8333 5.66667 15.8333H15.6667C16.5871 15.8333 17.3333 15.0871 17.3333 14.1667V4.16667C17.3333 3.24619 16.5871 2.5 15.6667 2.5Z" stroke="#008236" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 9.16669H17.3333" stroke="#008236" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.6667 2.5V9.16667" stroke="#008236" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7.33341 15.8333L5.66675 18.3333" stroke="#008236" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15.6667 18.3333L14 15.8333" stroke="#008236" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7.3335 12.5H7.34183" stroke="#008236" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 12.5H14.0083" stroke="#008236" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            `,
    "tram": `<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.6667 2.83325H5.66667C4.74619 2.83325 4 3.57944 4 4.49992V14.4999C4 15.4204 4.74619 16.1666 5.66667 16.1666H15.6667C16.5871 16.1666 17.3333 15.4204 17.3333 14.4999V4.49992C17.3333 3.57944 16.5871 2.83325 15.6667 2.83325Z" stroke="#8200DB" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 9.49991H17.3333" stroke="#8200DB" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.6667 2.83325V9.49992" stroke="#8200DB" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7.33341 16.1666L5.66675 18.6666" stroke="#8200DB" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15.6667 18.6666L14 16.1666" stroke="#8200DB" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7.3335 12.8333H7.34183" stroke="#8200DB" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 12.8333H14.0083" stroke="#8200DB" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            `,
    "train": `<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.6667 3.16663H5.66667C4.74619 3.16663 4 3.91282 4 4.83329V14.8333C4 15.7538 4.74619 16.5 5.66667 16.5H15.6667C16.5871 16.5 17.3333 15.7538 17.3333 14.8333V4.83329C17.3333 3.91282 16.5871 3.16663 15.6667 3.16663Z" stroke="#008236" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 9.83325H17.3333" stroke="#008236" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.6667 3.16663V9.83329" stroke="#008236" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7.33341 16.5L5.66675 19" stroke="#008236" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15.6667 19L14 16.5" stroke="#008236" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7.3335 13.1666H7.34183" stroke="#008236" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 13.1666H14.0083" stroke="#008236" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            `,
    "transfer": `<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 7.66663L17.3333 4.33329L14 1" stroke="#F59E0B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 9.66663V7.99996C4 7.11591 4.35119 6.26806 4.97631 5.64294C5.60143 5.01782 6.44928 4.66663 7.33333 4.66663H17.3333" stroke="#F59E0B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7.33333 13.6666L4 16.9999L7.33333 20.3333" stroke="#F59E0B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17.3333 11.6666V13.3333C17.3333 14.2173 16.9821 15.0652 16.357 15.6903C15.7319 16.3154 14.884 16.6666 14 16.6666H4" stroke="#F59E0B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            `
}


const param = new URLSearchParams(window.location.search);
const start = param.get("start");
const end = param.get("destination");

const routes_header = document.createElement("div");
routes_header.className = "routes-header";
routes_header.innerHTML = `
            <div class="routes-header-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M20 10C20 14.993 14.461 20.193 12.601 21.799C12.4277 21.9293 12.2168 21.9998 12 21.9998C11.7832 21.9998 11.5723 21.9293 11.399 21.799C9.539 20.193 4 14.993 4 10C4 7.87827 4.84285 5.84344 6.34315 4.34315C7.84344 2.84285 9.87827 2 12 2C14.1217 2 16.1566 2.84285 17.6569 4.34315C19.1571 5.84344 20 7.87827 20 10Z"
                        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path
                        d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <h3>Available Routes</h3>
            </div>
            <div class="from-to">From <span id="from-location" style="font-size: 20px;font-weight: bold;">${start}</span> to <span id="to-location" style="font-size: 20px;font-weight: bold;">${end}
            </span>
            </div>
            <div class="routes-header-subtitle">
                <p>Choose the best route for your journey</p>
            </div>
            <button id="save-trip-btn" class="save-trip-button" style="display: none;">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 17.5L10 13.75L5 17.5V4.16667C5 3.94565 5.0878 3.73369 5.24408 3.57741C5.40036 3.42113 5.61232 3.33333 5.83333 3.33333H14.1667C14.3877 3.33333 14.5996 3.42113 14.7559 3.57741C14.9122 3.73369 15 3.94565 15 4.16667V17.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Save Trip
            </button>
`;

routes_container.appendChild(routes_header);

// Initialize Map
initMap();

// Loading state
const loadingDiv = document.createElement("div");
loadingDiv.id = "routes-loading";
loadingDiv.innerHTML = "<p>Finding best routes...</p>";
loadingDiv.style.textAlign = "center";
loadingDiv.style.padding = "20px";
routes_container.appendChild(loadingDiv);

// Fetch Routes from Backend
const API_URL = "/api/routes";
fetch(`${API_URL}/find?start=${encodeURIComponent(start)}&destination=${encodeURIComponent(end)}`)
    .then(response => response.json())
    .then(data => {
        routes = data;
        loadingDiv.remove();
        renderRoutes(routes);

        // Visualize the first route by default
        if (routes.length > 0) {
            drawRouteOnMap(routes[0].steps);
        }

        // Check if user is logged in and show Save Trip button
        checkAuthAndShowSaveButton();
    })
    .catch(err => {
        console.error("Error fetching routes:", err);
        loadingDiv.innerHTML = "<p style='color:red'>Failed to load routes. Please try again.</p>";
    });


function selectRoute(rank) {
    // Find the selected route
    const selectedRoute = routes.find(r => r.rank === rank);

    if (!selectedRoute) {
        console.error('Route not found');
        return;
    }

    // Visualize Selected Route on Map (New feature)
    drawRouteOnMap(selectedRoute.steps);

    // Store the selected route in sessionStorage
    sessionStorage.setItem('selectedRoute', JSON.stringify(selectedRoute));

    // Navigate to chosen route page
    const params = new URLSearchParams(window.location.search);
    const loggedFlag = params.get("logged");

    // Added a small delay to allow seeing map update before navigation, or user can click again (UI/UX choice)
    // Actually, sticking to original flow: navigate immediately.
    // window.location.href = `../../html/chosen_route_page/chosen_route.html${loggedFlag === "true" ? "?logged=true" : ""}`; // Update with your actual page path
}


function renderRoutes(routesData) {
    routesData.map((r) => {
        const route = document.createElement("div");
        if (r.rank === "1st") {
            route.className = "route route-first-shadow";
        }
        else {
            route.className = "route route-other-shadow";
        }

        const svg_fill_color = r.rank === "1st" ? "white" : "black";


        route.innerHTML = `
            <div class="route-rank">
                    <div class="route-number-adjectif ${r.rank === "1st" ? "route-number-adjectif-first" : "route-number-adjectif-other"}">
                        <div class="rank ${r.rank === "1st" ? "rank-first" : "rank-other"}">
                            ${r.rank}
                        </div>
                        <h4>${r.title}</h4>
                        ${r.rank === "1st" ? `
                                <div class="adjectif">
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_46_327)">
                                    <path
                                        d="M5.36475 7.66327V8.47627C5.36286 8.64758 5.31699 8.81554 5.23154 8.96403C5.14608 9.11252 5.02392 9.23656 4.87675 9.32427C4.56432 9.55568 4.31017 9.85676 4.13449 10.2036C3.95881 10.5504 3.86645 10.9335 3.86475 11.3223"
                                        stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    <path
                                        d="M7.36475 7.66327V8.47627C7.36663 8.64758 7.4125 8.81554 7.49796 8.96403C7.58341 9.11252 7.70558 9.23656 7.85275 9.32427C8.16518 9.55568 8.41933 9.85676 8.595 10.2036C8.77068 10.5504 8.86304 10.9335 8.86475 11.3223"
                                        stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    <path
                                        d="M9.36475 4.83325H10.1147C10.4463 4.83325 10.7642 4.70156 10.9986 4.46714C11.2331 4.23271 11.3647 3.91477 11.3647 3.58325C11.3647 3.25173 11.2331 2.93379 10.9986 2.69937C10.7642 2.46495 10.4463 2.33325 10.1147 2.33325H9.36475"
                                        stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M2.36475 11.3333H10.3647" stroke="white" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                    <path
                                        d="M3.36475 4.83325C3.36475 5.6289 3.68082 6.39196 4.24343 6.95457C4.80603 7.51718 5.5691 7.83325 6.36475 7.83325C7.1604 7.83325 7.92346 7.51718 8.48607 6.95457C9.04868 6.39196 9.36475 5.6289 9.36475 4.83325V1.83325C9.36475 1.70064 9.31207 1.57347 9.2183 1.4797C9.12453 1.38593 8.99735 1.33325 8.86475 1.33325H3.86475C3.73214 1.33325 3.60496 1.38593 3.51119 1.4797C3.41742 1.57347 3.36475 1.70064 3.36475 1.83325V4.83325Z"
                                        stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    <path
                                        d="M3.36475 4.83325H2.61475C2.28323 4.83325 1.96528 4.70156 1.73086 4.46714C1.49644 4.23271 1.36475 3.91477 1.36475 3.58325C1.36475 3.25173 1.49644 2.93379 1.73086 2.69937C1.96528 2.46495 2.28323 2.33325 2.61475 2.33325H3.36475"
                                        stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_46_327">
                                        <rect width="12" height="12" fill="white"
                                            transform="translate(0.364746 0.333252)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            Best
                        </div>
                            `: ``
            }
                    </div>
                    <p>Complete route with all transport options</p>
                </div>
                <div class="route-duration-cost">
                    <div class="duration-cost">
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.6667 5.66663V10.6666L14.0001 12.3333" stroke="#2563EB" stroke-width="1.66667"
                                stroke-linecap="round" stroke-linejoin="round" />
                            <path
                                d="M10.6668 19C15.2692 19 19.0002 15.269 19.0002 10.6666C19.0002 6.06427 15.2692 2.33331 10.6668 2.33331C6.06446 2.33331 2.3335 6.06427 2.3335 10.6666C2.3335 15.269 6.06446 19 10.6668 19Z"
                                stroke="#2563EB" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <div class="duration-cost-details">
                            <p>Duration</p>
                            <p>${r.duration} min</p>
                        </div>
                    </div>
                    <div class="duration-cost">
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.6667 2.33331V19" stroke="#00A63E" stroke-width="1.66667" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <path
                                d="M14.8334 4.83331H8.58341C7.80987 4.83331 7.068 5.1406 6.52102 5.68759C5.97404 6.23457 5.66675 6.97643 5.66675 7.74998C5.66675 8.52353 5.97404 9.26539 6.52102 9.81237C7.068 10.3594 7.80987 10.6666 8.58341 10.6666H12.7501C13.5236 10.6666 14.2655 10.9739 14.8125 11.5209C15.3595 12.0679 15.6667 12.8098 15.6667 13.5833C15.6667 14.3569 15.3595 15.0987 14.8125 15.6457C14.2655 16.1927 13.5236 16.5 12.7501 16.5H5.66675"
                                stroke="#00A63E" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <div class="duration-cost-details">
                            <p>Cost</p>
                            <p>$${r.cost}</p>
                        </div>

                    </div>
                </div>
                <div class="route-transport-sequence">
                    <div class="route-transport-sequence-title">
                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_46_368)">
                                <path
                                    d="M2.66674 9.66665C2.54059 9.66708 2.4169 9.63171 2.31005 9.56464C2.20319 9.49757 2.11757 9.40156 2.06311 9.28776C2.00865 9.17396 1.9876 9.04704 2.00241 8.92176C2.01721 8.79647 2.06726 8.67796 2.14674 8.57999L8.74674 1.77999C8.79625 1.72284 8.86372 1.68422 8.93806 1.67048C9.01241 1.65673 9.08923 1.66866 9.1559 1.70432C9.22257 1.73998 9.27513 1.79725 9.30497 1.86673C9.3348 1.9362 9.34013 2.01375 9.32008 2.08665L8.04008 6.09999C8.00233 6.201 7.98966 6.30967 8.00314 6.41666C8.01662 6.52365 8.05585 6.62577 8.11747 6.71427C8.17909 6.80277 8.26126 6.875 8.35693 6.92476C8.45259 6.97452 8.55891 7.00034 8.66674 6.99999H13.3334C13.4596 6.99956 13.5833 7.03493 13.6901 7.102C13.797 7.16907 13.8826 7.26508 13.937 7.37888C13.9915 7.49268 14.0125 7.6196 13.9977 7.74488C13.9829 7.87017 13.9329 7.98868 13.8534 8.08665L7.25341 14.8867C7.2039 14.9438 7.13644 14.9824 7.06209 14.9962C6.98774 15.0099 6.91093 14.998 6.84426 14.9623C6.77759 14.9267 6.72502 14.8694 6.69519 14.7999C6.66535 14.7304 6.66002 14.6529 6.68008 14.58L7.96008 10.5667C7.99782 10.4656 8.0105 10.357 7.99702 10.25C7.98354 10.143 7.9443 10.0409 7.88268 9.95237C7.82106 9.86387 7.73889 9.79164 7.64323 9.74188C7.54756 9.69212 7.44125 9.6663 7.33341 9.66665H2.66674Z"
                                    stroke="#2563EB" stroke-width="1.33333" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_46_368">
                                    <rect width="16" height="16" fill="white" transform="translate(0 0.333313)" />
                                </clipPath>
                            </defs>
                        </svg>
                        Transport Sequence

                    </div>
                    <div class="sequence-steps">
                    
                        
                    </div>
                    
                </div>
                <button class="${r.rank === "1st" ? "button-first" : "button-other"}" onclick="selectRoute('${r.rank}')">
                    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_46_476)">
                            <path
                                d="M13.6459 6.66662C13.6459 9.99528 9.95325 13.4619 8.71325 14.5326C8.59773 14.6195 8.45711 14.6664 8.31258 14.6664C8.16805 14.6664 8.02743 14.6195 7.91191 14.5326C6.67191 13.4619 2.97925 9.99528 2.97925 6.66662C2.97925 5.25213 3.54115 3.89557 4.54135 2.89538C5.54154 1.89519 6.89809 1.33328 8.31258 1.33328C9.72707 1.33328 11.0836 1.89519 12.0838 2.89538C13.084 3.89557 13.6459 5.25213 13.6459 6.66662Z"
                                stroke="${svg_fill_color}" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                                d="M8.3125 8.6666C9.41707 8.6666 10.3125 7.77116 10.3125 6.6666C10.3125 5.56203 9.41707 4.6666 8.3125 4.6666C7.20793 4.6666 6.3125 5.56203 6.3125 6.6666C6.3125 7.77116 7.20793 8.6666 8.3125 8.6666Z"
                                stroke="${svg_fill_color}" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_46_476">
                                <rect width="16" height="16" fill="${svg_fill_color}" transform="translate(0.3125 -6.10352e-05)" />
                            </clipPath>
                        </defs>
                    </svg>
                    ${r.rank === "1st" ? "Start" : "Select"} This Route ${r.rank === "1st" ? "(Recommended)" : ""}

                </button>
        `;

        const sequence_steps = route.querySelector(".sequence-steps");

        if (r.steps) {
            r.steps.map((s) => {
                const step_color_class = s.mean === "feet" ? "walk-step" :
                    s.mean === "bus" ? "bus-step" :
                        s.mean === "train" || s.mean === "metro" ? "metro-train-step" :
                            s.mean === "tram" ? "tram-step" :
                                s.mean === "transfer" ? "transfer-step" : "";


                const step = document.createElement("div");
                step.className = "sequence-step";
                step.innerHTML = `
                    
                            <div class="transport-type ${step_color_class}">
                                ${means_logos[s.mean] || means_logos['bus']}
                                ${s.type}
                            </div>
                            <div class="step-duration">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_46_382)">
                                        <path d="M8 4V8L10.6667 9.33333" stroke="#64748B" stroke-width="1.33333"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                        <path
                                            d="M7.99992 14.6666C11.6818 14.6666 14.6666 11.6819 14.6666 7.99998C14.6666 4.31808 11.6818 1.33331 7.99992 1.33331C4.31802 1.33331 1.33325 4.31808 1.33325 7.99998C1.33325 11.6819 4.31802 14.6666 7.99992 14.6666Z"
                                            stroke="#64748B" stroke-width="1.33333" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_46_382">
                                            <rect width="16" height="16" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                ${s.step_duration} min

                            </div>
                            <div class="step-instruction">
                               ${s.step_instruction}
                            </div>
                        
                `;
                sequence_steps.appendChild(step)
            });
        }


        routes_container.appendChild(route);
    })
}

// Toast Notification System
function showToast(message, type = 'success') {
    // Remove any existing toasts first
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            ${type === 'success' ?
            `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>` :
            `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 6.66663V9.99996" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 13.3333H10.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`}
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Hide and remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Check authentication and show Save Trip button
function checkAuthAndShowSaveButton() {
    const token = localStorage.getItem('authToken');
    const saveTripBtn = document.getElementById('save-trip-btn');

    if (token && saveTripBtn) {
        saveTripBtn.style.display = 'flex';
        saveTripBtn.addEventListener('click', handleSaveTrip);
    }
}

// Handle Save Trip
async function handleSaveTrip() {
    const token = localStorage.getItem('authToken');

    if (!token) {
        showToast('Please login to save trips', 'error');
        setTimeout(() => {
            window.location.href = '../login/login.html';
        }, 1500);
        return;
    }

    if (routes.length === 0) {
        showToast('No route available to save', 'error');
        return;
    }

    // Save the first (best) route
    const routeToSave = routes[0];

    const saveTripBtn = document.getElementById('save-trip-btn');
    const originalText = saveTripBtn.innerHTML;
    saveTripBtn.innerHTML = '<span>Saving...</span>';
    saveTripBtn.disabled = true;

    try {
        const response = await fetch('/api/trips/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                origin: start,
                destination: end,
                route_json: routeToSave
            })
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Trip saved successfully!', 'success');
            saveTripBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Saved!
            `;

            // Reset button after 2 seconds
            setTimeout(() => {
                saveTripBtn.innerHTML = originalText;
                saveTripBtn.disabled = false;
            }, 2000);
        } else {
            throw new Error(data.message || 'Failed to save trip');
        }
    } catch (error) {
        console.error('Save trip error:', error);
        showToast(error.message || 'Failed to save trip', 'error');
        saveTripBtn.innerHTML = originalText;
        saveTripBtn.disabled = false;
    }
}
