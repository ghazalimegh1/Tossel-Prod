
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadUserProfile();
    loadSavedTrips();
});

function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '../../html/login/login.html';
    }
}

async function loadUserProfile() {
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch('/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('user-name').textContent = `${data.firstName} ${data.lastName}`;
            document.getElementById('user-email').textContent = data.email;
        } else {
            console.error('Failed to load user profile');
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadSavedTrips() {
    const token = localStorage.getItem('authToken');
    const container = document.getElementById('trips-container');

    try {
        const response = await fetch('/api/trips', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const trips = await response.json();

        if (trips.length === 0) {
            container.innerHTML = '<div class="loading-trips">No saved trips found.</div>';
            return;
        }

        container.innerHTML = trips.map(trip => {
            const routeData = JSON.parse(trip.route_json);
            return `
                <div class="trip-card" onclick="viewTrip('${encodeURIComponent(JSON.stringify(routeData))}')">
                    <div class="trip-header">
                        <div class="trip-route">
                            <h4>${trip.origin} → ${trip.destination}</h4>
                            <div class="trip-meta">
                                <span>Saved on ${new Date(trip.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <button class="delete-btn" onclick="event.stopPropagation(); deleteTrip(${trip.id})">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <div class="trip-stats">
                        <div class="stat">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            ${routeData.duration} min
                        </div>
                        <div class="stat">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                <path d="M16.5 7.5l-9 9"></path>
                            </svg>
                            $${routeData.cost}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error loading trips:', error);
        container.innerHTML = '<div class="loading-trips" style="color: red;">Failed to load trips.</div>';
    }
}

async function deleteTrip(tripId) {
    if (!confirm('Are you sure you want to delete this trip?')) return;

    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(`/api/trips/${tripId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            loadSavedTrips(); // Reload list
        } else {
            alert('Failed to delete trip');
        }
    } catch (error) {
        console.error('Error deleting trip:', error);
    }
}

function viewTrip(routeDataStr) {
    const routeData = JSON.parse(decodeURIComponent(routeDataStr));
    sessionStorage.setItem('selectedRoute', JSON.stringify(routeData));
    window.location.href = '../../html/chosen_route_page/chosen_route.html?logged=true';
}
