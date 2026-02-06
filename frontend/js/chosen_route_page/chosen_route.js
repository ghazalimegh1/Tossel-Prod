
// chosen route and the map

// Retrieve the selected route from sessionStorage
let chosen_route = JSON.parse(sessionStorage.getItem('selectedRoute'));

// If no route was selected, use default or redirect
if (!chosen_route) {
    console.warn('No route selected, redirecting...');
    window.location.href = '../routes_page/routes_page.html';
}

const chosen_route_container = document.getElementById("chosen-route-container");
const step_by_step_switch = document.getElementById("step-by-step");
const map_switch = document.getElementById("map-switch-btn"); // Updated ID
const steps_detailed = document.getElementById("steps-detailed");

// Map variables
let map;
let routeLayer;

// Initialize Map
function initChosenRouteMap() {
    // If map container exists (it is created dynamically when switching tabs)
    if (document.getElementById('map')) {
        // If map already initialized, just invalidate size
        if (map) {
            map.invalidateSize();
            return;
        }

        map = L.map('map').setView([36.75, 3.05], 11);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // Draw the route immediately
        drawChosenRoute();
    }
}

function drawChosenRoute() {
    if (!map || !chosen_route) return;

    fetch("/api/routes/locations")
        .then(res => res.json())
        .then(data => {
            const nodes = data.knownLocations;
            const nodeMap = {};
            nodes.forEach(n => {
                if (typeof n === 'object') nodeMap[n.name] = [n.lat, n.lng];
            });

            const markers = L.layerGroup().addTo(map);
            const latlngs = [];

            chosen_route.steps.forEach((step, index) => {
                const startCoords = nodeMap[step.start_location];
                const endCoords = nodeMap[step.end_location];

                // Add markers
                if (startCoords) {
                    if (index === 0) L.marker(startCoords).addTo(markers).bindPopup(`Start: ${step.start_location}`).openPopup();
                    else L.circleMarker(startCoords, { radius: 5, color: '#3388ff', fillColor: '#3388ff', fillOpacity: 0.8 }).addTo(markers).bindPopup(step.start_location);
                }
                if (endCoords && index === chosen_route.steps.length - 1) {
                    L.marker(endCoords).addTo(markers).bindPopup(`End: ${step.end_location}`);
                }

                // Add path segment
                if (step.pathCoordinates && step.pathCoordinates.length > 0) {
                    // Coordinates from backend are [lng, lat], Leaflet needs [lat, lng]
                    const segmentCoords = step.pathCoordinates.map(coord => [coord[1], coord[0]]);

                    // Add to total path
                    latlngs.push(...segmentCoords);

                    // Draw specific segment colored by mode
                    const color = getModeColor(step.mean);
                    L.polyline(segmentCoords, { color: color, weight: 6, opacity: 0.8 }).addTo(markers).bindPopup(`${step.mean}: ${step.start_location} → ${step.end_location}`);
                } else {
                    // Fallback to straight line
                    if (startCoords && endCoords) {
                        latlngs.push(startCoords);
                        latlngs.push(endCoords);

                        // Draw straight dotted line
                        const color = getModeColor(step.mean);
                        L.polyline([startCoords, endCoords], { color: color, weight: 4, dashArray: '5, 10', opacity: 0.6 }).addTo(markers);
                    }
                }
            });

            if (latlngs.length > 0) {
                map.fitBounds(L.polyline(latlngs).getBounds(), { padding: [50, 50] });
            }
        })
        .catch(e => console.error("Map plotting error:", e));
}

function getModeColor(mode) {
    switch (mode) {
        case 'metro': return '#008236'; // Green
        case 'tram': return '#8200DB'; // Purple
        case 'train': return '#Eab308'; // Yellow/Dark Gold
        case 'bus': return '#1447E6'; // Blue
        case 'feet': return '#64748B'; // Gray
        default: return '#3388ff';
    }
}


const means_logos = {
    "feet": `<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.00015 16.6666V14.2866C4.00015 12.1666 2.97015 11.1666 3.00015 8.66663C3.03015 5.94663 4.49015 2.66663 7.50015 2.66663C9.37015 2.66663 10.0002 4.46663 10.0002 6.16663C10.0002 9.27663 8.00015 11.8266 8.00015 14.8466V16.6666C8.00015 17.1971 7.78944 17.7058 7.41437 18.0808C7.0393 18.4559 6.53059 18.6666 6.00015 18.6666C5.46972 18.6666 4.96101 18.4559 4.58594 18.0808C4.21087 17.7058 4.00015 17.1971 4.00015 16.6666Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20 20.6666V18.2866C20 16.1666 21.03 15.1666 21 12.6666C20.97 9.94663 19.51 6.66663 16.5 6.66663C14.63 6.66663 14 8.46663 14 10.1666C14 13.2766 16 15.8266 16 18.8466V20.6666C16 21.1971 16.2107 21.7058 16.5858 22.0808C16.9609 22.4559 17.4696 22.6666 18 22.6666C18.5304 22.6666 19.0391 22.4559 19.4142 22.0808C19.7893 21.7058 20 21.1971 20 20.6666Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 17.6666H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 13.6666H8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
    "bus": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 6V12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15 6V12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12H21.6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18 18H21C21 18 21.5 16.3 21.8 15.2C21.9 14.8 22 14.4 22 14C22 13.6 21.9 13.2 21.8 12.8L20.4 7.8C20.1 6.8 19.1 6 18 6H4C3.46957 6 2.96086 6.21071 2.58579 6.58579C2.21071 6.96086 2 7.46957 2 8V18H5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 20C8.10457 20 9 19.1046 9 18C9 16.8954 8.10457 16 7 16C5.89543 16 5 16.8954 5 18C5 19.1046 5.89543 20 7 20Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 18H14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 20C17.1046 20 18 19.1046 18 18C18 16.8954 17.1046 16 16 16C14.8954 16 14 16.8954 14 18C14 19.1046 14.8954 20 16 20Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
    "train": `<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 3.33325H6C4.89543 3.33325 4 4.22868 4 5.33325V17.3333C4 18.4378 4.89543 19.3333 6 19.3333H18C19.1046 19.3333 20 18.4378 20 17.3333V5.33325C20 4.22868 19.1046 3.33325 18 3.33325Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 11.3333H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 3.33325V11.3333" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 19.3333L6 22.3333" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18 22.3333L16 19.3333" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 15.3333H8.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 15.3333H16.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
    "metro": `<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 3.33325H6C4.89543 3.33325 4 4.22868 4 5.33325V17.3333C4 18.4378 4.89543 19.3333 6 19.3333H18C19.1046 19.3333 20 18.4378 20 17.3333V5.33325C20 4.22868 19.1046 3.33325 18 3.33325Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4 11.3333H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 3.33325V11.3333" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 19.3333L6 22.3333" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M18 22.3333L16 19.3333" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 15.3333H8.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 15.3333H16.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
    "tram": `<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 3.33325H6C4.89543 3.33325 4 4.22868 4 5.33325V17.3333C4 18.4378 4.89543 19.3333 6 19.3333H18C19.1046 19.3333 20 18.4378 20 17.3333V5.33325C20 4.22868 19.1046 3.33325 18 3.33325Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 11.3333H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 3.33325V11.3333" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 19.3333L6 22.3333" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18 22.3333L16 19.3333" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 15.3333H8.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 15.3333H16.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
    "transfer": `<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 8.66663L19.3333 5.33329L16 2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 10.6666V8.99996C4 8.11591 4.35119 7.26806 4.97631 6.64294C5.60143 6.01782 6.44928 5.66663 7.33333 5.66663H19.3333" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.33333 14.6666L5 17.9999L8.33333 21.3333" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19.3333 12.6666V14.3333C19.3333 15.2173 18.9821 16.0652 18.357 16.6903C17.7319 17.3154 16.884 17.6666 16 17.6666H5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`
}


chosen_route.steps.map((s) => {
    const single_step = document.createElement("div");
    single_step.className = "step-details";
    single_step.innerHTML = `
                        <div class="step-type-icon">
                            <div class="icon ${s.mean}-bg">
                                ${means_logos[s.mean]}
                            </div>
                            <svg width="2" height="81" viewBox="0 0 2 81" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <rect width="2" height="80" transform="translate(0 0.666626)" fill="#E2E8F0" />
                            </svg>

                        </div>
                        <div class="step-info">
                            <div class="step-type-mean-duration">
                                ${s.mean !== "feet" ? `<p id="not-feet-alt">${s.type}</p>` : ""} <h5>${s.mean === "feet" ? s.type : s.mean.toUpperCase()}</h5>
                                <p id="step-duration-responisve"> ${s.step_duration} min</p>
                            </div>
                            <div class="info">
                                <div>
                                    ${s.start_location} → ${s.end_location}
                                </div>
                                ${s.mean === "feet" ? `<p>Distance: ${s.distance}m</p>` : `${s.stops} stop${s.stops > 1 ? "s" : ""}`}
                                ${s.mean !== "feet" ? `<p>Depart: ${s.depart} • Arrive: ${s.arrival}</p>` : ""}
                            </div>
                            ${s.mean === "feet" ?
            `<div class="walk-instruction">
                                    ${s.step_instruction}
                                </div>` : ``}
                            
                        </div>
                    `;
    steps_detailed.appendChild(single_step);
})


step_by_step_switch.addEventListener("click", () => {
    step_by_step_switch.classList.add("switch-active");
    map_switch.classList.remove("switch-active");
    const el = document.createElement("div");
    el.className = "step-by-step-direction";
    el.id = "step-by-step-direction";
    const h4 = document.createElement("h4");
    h4.innerHTML = "Step-by-Step Directions";
    const p = document.createElement("p");
    p.innerHTML = "Detailed route instructions";
    const div = document.createElement("div");
    div.className = "steps-detailed";
    div.id = "steps-detailed";
    div.innerHTML = steps_detailed.innerHTML;
    el.appendChild(h4);
    el.appendChild(p);
    el.appendChild(div);
    chosen_route_container.removeChild(chosen_route_container.lastElementChild);
    chosen_route_container.appendChild(el);
})


map_switch.addEventListener("click", () => {
    step_by_step_switch.classList.remove("switch-active");
    map_switch.classList.add("switch-active");

    // Create Map Container
    const el = document.createElement("div");
    el.id = "map";
    el.style.width = "100%";
    el.style.height = "400px";
    el.style.borderRadius = "10px";

    chosen_route_container.removeChild(chosen_route_container.lastElementChild);
    chosen_route_container.appendChild(el);

    // Init Map
    initChosenRouteMap();
})


// live updates


const live_updates = document.getElementById("live-updates");
const vehicles_update = [
    {
        mean: "Bus",
        name: "42",
        already_arrived: false,
        time_to_arrive: 2,
        station: "Harrach",
        time_driver_check: new Date()
    },
    {
        mean: "Bus",
        name: "42",
        already_arrived: false,
        time_to_arrive: 2,
        station: "Kouba",
        time_driver_check: new Date()
    },

]

vehicles_update.map((v) => {

    const vehicle_card = document.createElement("div");
    vehicle_card.className = "vehicle-card";
    vehicle_card.innerHTML = `
        <div class="check-icon">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_64_570)">
                            <path
                                d="M14.5341 6.99991C14.8385 8.49411 14.6215 10.0475 13.9193 11.4011C13.2171 12.7547 12.072 13.8266 10.6751 14.4381C9.27816 15.0496 7.71382 15.1638 6.24293 14.7615C4.77205 14.3592 3.48353 13.4648 2.59225 12.2275C1.70097 10.9902 1.26081 9.48474 1.34518 7.96217C1.42954 6.4396 2.03332 4.99197 3.05583 3.86069C4.07835 2.72941 5.45779 1.98287 6.96411 1.74555C8.47043 1.50823 10.0126 1.79449 11.3334 2.55658"
                                stroke="#2563EB" stroke-width="1.33333" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <path d="M6 7.66654L8 9.66654L14.6667 2.99988" stroke="#2563EB" stroke-width="1.33333"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_64_570">
                                <rect width="16" height="16" fill="white" transform="translate(0 0.333252)" />
                            </clipPath>
                        </defs>
                    </svg>

                </div>
                <div class="vehicle-arrival-info">
                    <p>${v.mean} ${v.name}</p>
                    <p>${v.mean} ${v.name} arriving in ${v.time_to_arrive} minute${v.time_to_arrive > 1 ? "s" : ""}</p>
                    <p>To Station: ${v.station}</p>
                    ${!v.already_arrived ? `<p>Affirmed at: ${v.time_driver_check.toLocaleTimeString()}</p>` : ""}
                </div>
    `

    live_updates.appendChild(vehicle_card);

})
