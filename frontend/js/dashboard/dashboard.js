// Dashboard functionality
const API_URL = "/api/trips";

// Check authentication on page load
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        // Not authenticated, redirect to login
        window.location.href = '../login/login.html';
        return;
    }

    // Load trips
    loadTrips();
});

async function loadTrips() {
    const loadingEl = document.getElementById('trips-loading');
    const emptyEl = document.getElementById('trips-empty');
    const containerEl = document.getElementById('trips-container');

    try {
        const token = localStorage.getItem('authToken');

        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '../login/login.html';
            return;
        }

        const trips = await response.json();

        // Hide loading
        loadingEl.style.display = 'none';

        if (trips.length === 0) {
            // Show empty state
            emptyEl.style.display = 'flex';
        } else {
            // Show trips
            containerEl.style.display = 'grid';
            renderTrips(trips);
        }

    } catch (error) {
        console.error('Error loading trips:', error);
        loadingEl.style.display = 'none';
        emptyEl.innerHTML = `
            <h2 style="color: #DC2626;">Error loading trips</h2>
            <p>Please try again later</p>
        `;
        emptyEl.style.display = 'flex';
    }
}

function renderTrips(trips) {
    const containerEl = document.getElementById('trips-container');
    containerEl.innerHTML = '';

    trips.forEach(trip => {
        const tripCard = createTripCard(trip);
        containerEl.appendChild(tripCard);
    });
}

function createTripCard(trip) {
    const card = document.createElement('div');
    card.className = 'trip-card';

    // Format date
    const date = new Date(trip.created_at);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Calculate stats from route_json
    let duration = 0;
    let cost = 0;
    if (trip.route_json && trip.route_json.steps) {
        duration = trip.route_json.steps.reduce((sum, step) => sum + (step.step_duration || 0), 0);
        cost = trip.route_json.cost || 0;
    }

    card.innerHTML = `
        <div class="trip-card-header">
            <div class="trip-route">
                <div class="trip-route-locations">
                    <span class="trip-location">${trip.origin}</span>
                    <span class="trip-arrow">→</span>
                    <span class="trip-location">${trip.destination}</span>
                </div>
                <div class="trip-date">Saved on ${formattedDate}</div>
            </div>
            <button class="trip-delete" onclick="deleteTrip(${trip.id}, event)" title="Delete trip">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 5H4.16667H17.5" stroke="#DC2626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15.8333 4.99999V16.6667C15.8333 17.1087 15.6577 17.5326 15.3452 17.8452C15.0326 18.1577 14.6087 18.3333 14.1667 18.3333H5.83333C5.39131 18.3333 4.96738 18.1577 4.65482 17.8452C4.34226 17.5326 4.16667 17.1087 4.16667 16.6667V4.99999M6.66667 4.99999V3.33332C6.66667 2.8913 6.84226 2.46737 7.15482 2.15481C7.46738 1.84225 7.89131 1.66666 8.33333 1.66666H11.6667C12.1087 1.66666 12.5326 1.84225 12.8452 2.15481C13.1577 2.46737 13.3333 2.8913 13.3333 3.33332V4.99999" stroke="#DC2626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        
        <div class="trip-details">
            <div class="trip-stats">
                ${duration > 0 ? `
                <div class="trip-stat">
                    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 4V8L10.6667 9.33333" stroke="#2563EB" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 14.6666C11.6819 14.6666 14.6667 11.6819 14.6667 7.99998C14.6667 4.31808 11.6819 1.33331 8 1.33331C4.31810 1.33331 1.33333 4.31808 1.33333 7.99998C1.33333 11.6819 4.31810 14.6666 8 14.6666Z" stroke="#2563EB" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="trip-stat-label">Duration:</span>
                    <span class="trip-stat-value">${duration} min</span>
                </div>
                ` : ''}
                ${cost > 0 ? `
                <div class="trip-stat">
                    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 1.33331V14.6666" stroke="#00A63E" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M11.3333 3.66669H6.33333C5.71449 3.66669 5.121 3.91241 4.68342 4.34999C4.24583 4.78758 4 5.38107 4 6.00002C4 6.61897 4.24583 7.21246 4.68342 7.65005C5.121 8.08763 5.71449 8.33335 6.33333 8.33335H9.66667C10.2855 8.33335 10.879 8.57907 11.3166 9.01666C11.7542 9.45425 12 10.0477 12 10.6667C12 11.2856 11.7542 11.8791 11.3166 12.3167C10.879 12.7543 10.2855 13 9.66667 13H4" stroke="#00A63E" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="trip-stat-label">Cost:</span>
                    <span class="trip-stat-value">$${cost}</span>
                </div>
                ` : ''}
            </div>
        </div>
    `;

    // Make card clickable to view route
    card.addEventListener('click', (e) => {
        // Don't trigger if clicking delete button
        if (!e.target.closest('.trip-delete')) {
            viewTripRoute(trip);
        }
    });

    return card;
}

function viewTripRoute(trip) {
    // Navigate to routes page with the trip data
    const params = new URLSearchParams({
        start: trip.origin,
        destination: trip.destination
    });

    window.location.href = `../routes_page/routes_page.html?${params.toString()}`;
}

async function deleteTrip(tripId, event) {
    event.stopPropagation(); // Prevent card click

    if (!confirm('Are you sure you want to delete this trip?')) {
        return;
    }

    try {
        const token = localStorage.getItem('authToken');

        const response = await fetch(`${API_URL}/${tripId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Reload trips
            await loadTrips();
        } else {
            alert('Failed to delete trip. Please try again.');
        }
    } catch (error) {
        console.error('Error deleting trip:', error);
        alert('Failed to delete trip. Please try again.');
    }
}

// Make deleteTrip available globally
window.deleteTrip = deleteTrip;
