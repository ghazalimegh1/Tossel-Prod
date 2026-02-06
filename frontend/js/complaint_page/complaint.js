
// Utility to format date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = {
        month: "short",
        day: "numeric",
        year: "numeric"
    };
    return date.toLocaleDateString("en-US", options);
}

// Select Complaint Types Logic
const select_complaint_types = document.getElementById("select-complaint-type");
const complaint_types = document.getElementById("complaint-types");
const complaint_types_array = ["Service Delay", "Vehicle No-Show", "Cleanliness issue", "Staff Behavior", "Other"];
const complaint_types_placeholder = document.getElementById("select-placeholder");

let selectedComplaintType = "";

if (select_complaint_types) {
    select_complaint_types.addEventListener("click", () => {
        const displayValue = window.getComputedStyle(complaint_types).getPropertyValue("display");
        complaint_types.style.display = displayValue === "none" ? "flex" : "none";
    });

    complaint_types_array.forEach((c) => {
        const p = document.createElement("p");
        p.className = "complaint-type";
        p.textContent = c;

        p.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent closing dropdown immediately
            selectedComplaintType = c;
            complaint_types_placeholder.textContent = c;
            complaint_types_placeholder.style.color = "black";
            document.querySelectorAll(".complaint-type").forEach((el) =>
                el.classList.remove("selected-complaint")
            );
            p.classList.add("selected-complaint");
            complaint_types.style.display = "none";
            clearError(select_complaint_types);
        });

        complaint_types.appendChild(p);
    });
}

// Validation Helpers
function showError(input, message) {
    const parent = input.parentElement;
    const existingError = parent.querySelector('.error-message');
    if (existingError) existingError.remove();

    input.style.borderColor = "#EF4444";
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#EF4444';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '4px';
    errorDiv.textContent = message;
    parent.appendChild(errorDiv);
}

function clearError(input) {
    const parent = input.parentElement;
    const errorMessage = parent.querySelector('.error-message');
    if (errorMessage) errorMessage.remove();
    input.style.borderColor = "";
}

// Form Submission
const form = document.querySelector('form');
const fullnameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const routeInput = document.getElementById('route');
const descriptionInput = document.getElementById('description');

if (form) {
    // Pre-fill user data if logged in
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (fullnameInput) fullnameInput.value = `${user.firstName || ''} ${user.lastName || ''}`.trim();
            if (emailInput) emailInput.value = user.email || '';
        } catch (e) {
            console.error("Error parsing user data");
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Basic Client-side Validation
        let isValid = true;
        if (!fullnameInput.value.trim()) { showError(fullnameInput, "Name is required"); isValid = false; }
        if (!emailInput.value.trim() || !emailInput.value.includes('@')) { showError(emailInput, "Valid email is required"); isValid = false; }
        if (!selectedComplaintType) { showError(select_complaint_types, "Select a type"); isValid = false; }
        if (!descriptionInput.value.trim()) { showError(descriptionInput, "Description is required"); isValid = false; }

        if (!isValid) return;

        // Prepare Data
        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;

        const payload = {
            fullname: fullnameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            complaintType: selectedComplaintType,
            route: routeInput.value.trim(),
            description: descriptionInput.value.trim(),
            userId: user ? user.id : null
        };

        try {
            const response = await fetch('/api/complaints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                alert(`Complaint Submitted! Tracking ID: ${result.trackingId}`);
                form.reset();
                selectedComplaintType = "";
                complaint_types_placeholder.textContent = "Select Complaint Type";
                complaint_types_placeholder.style.color = "#64748B";
                loadUserComplaints(); // Refresh list if logged in
            } else {
                const err = await response.json();
                alert(`Error: ${err.message}`);
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit complaint. Please try again.');
        }
    });

    // Clear errors on input
    fullnameInput.addEventListener('input', () => clearError(fullnameInput));
    emailInput.addEventListener('input', () => clearError(emailInput));
    descriptionInput.addEventListener('input', () => clearError(descriptionInput));
}


// Load Previous Complaints
const your_complaints = document.getElementById("your-complaints");
async function loadUserComplaints() {
    const token = localStorage.getItem('authToken');
    if (!token || !your_complaints) {
        if (your_complaints) your_complaints.style.display = 'none'; // Hide if not logged in
        return;
    }

    try {
        const response = await fetch('/api/complaints/my-complaints', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const complaints = await response.json();

            // Clear existing except title
            const title = your_complaints.querySelector('h5');
            const subtitle = your_complaints.querySelector('.track-complaint');
            your_complaints.innerHTML = '';
            if (title) your_complaints.appendChild(title);
            if (subtitle) your_complaints.appendChild(subtitle);

            if (complaints.length > 0) {
                complaints.forEach(c => {
                    const singleComplaint = document.createElement("div");
                    singleComplaint.className = "client-single-complaint";

                    // Simple status mapping logic
                    let statusClass = "Pending";
                    if (c.status === "Resolved") statusClass = "Resolved";
                    else if (c.status === "Ongoing") statusClass = "Ongoing";

                    singleComplaint.innerHTML = `
                        <div class="id-status-complaint">
                            <p class="complaint-id">C-${new Date(c.created_at).getFullYear()}-${c.id.toString().padStart(3, '0')}</p>
                            <p class="complaint-status ${statusClass}">${c.status}</p>
                        </div>
                        <p class="complaint-title">${c.type}</p>
                        <p class="complaint-date">
                             ${formatDate(c.created_at)}
                        </p>
                    `;
                    your_complaints.appendChild(singleComplaint);
                });
                your_complaints.style.display = 'block';
            } else {
                const noData = document.createElement('p');
                noData.textContent = "No complaints found.";
                noData.style.color = "#64748B";
                noData.style.fontSize = "0.9rem";
                noData.style.marginTop = "1rem";
                your_complaints.appendChild(noData);
                your_complaints.style.display = 'block';
            }

        }
    } catch (error) {
        console.error("Error loading complaints", error);
    }
}

// Initial Load
document.addEventListener('DOMContentLoaded', loadUserComplaints);