// select complaint types
function formatDate(timestamp) {
    const date = new Date(timestamp);

    const options = {
        month: "short",
        day: "numeric",
        year: "numeric"
    };

    return date.toLocaleDateString("en-US", options);
}


const select_complaint_types = document.getElementById("select-complaint-type");
const complaint_types = document.getElementById("complaint-types");
const complaint_types_array = ["Service Delay", "Vehicle No-Show", "Cleanliness issue", "Other"]
const complaint_types_placeholder = document.getElementById("select-placeholder");

let selectedComplaintType = "";

select_complaint_types.addEventListener("click", () => {
    const displayValue = window.getComputedStyle(complaint_types).getPropertyValue("display");
    complaint_types.style.display = displayValue === "none" ? "flex" : "none";
})

complaint_types_array.map((c) => {
    const p = document.createElement("p");
    p.className = "complaint-type";
    p.textContent = c;

    p.addEventListener("click", () => {
        selectedComplaintType = c;
        complaint_types_placeholder.textContent = c;
        complaint_types_placeholder.style.color = "black";
        document.querySelectorAll(".complaint-type").forEach((el) =>
            el.classList.remove("selected-complaint")
        );
        p.classList.add("selected-complaint");
        clearError(select_complaint_types);
    })

    complaint_types.appendChild(p);
})

complaint_types_placeholder.style.color = "#64748B";

// Form Validation Functions

function showError(input, message) {
    const parent = input.parentElement;
    
    // Remove existing error message if any
    const existingError = parent.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error styling
    input.style.borderColor = "#EF4444";
    
    // Create and add error message
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
    
    if (errorMessage) {
        errorMessage.remove();
    }
    
    input.style.borderColor = "";
}

function validateName(name) {
    const trimmedName = name.trim();
    
    if (trimmedName === "") {
        return { valid: false, message: "Full name is required" };
    }
    
    if (trimmedName.length < 2) {
        return { valid: false, message: "Name must be at least 2 characters" };
    }
    
    if (!/^[a-zA-Z\s\u0600-\u06FF]+$/.test(trimmedName)) {
        return { valid: false, message: "Name can only contain letters and spaces" };
    }
    
    return { valid: true };
}

function validateEmail(email) {
    const trimmedEmail = email.trim();
    
    if (trimmedEmail === "") {
        return { valid: false, message: "Email is required" };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(trimmedEmail)) {
        return { valid: false, message: "Please enter a valid email address" };
    }
    
    return { valid: true };
}

function validatePhone(phone) {
    const trimmedPhone = phone.trim();
    
    // Phone is optional, so if empty, it's valid
    if (trimmedPhone === "") {
        return { valid: true };
    }
    
    // Remove spaces, hyphens, and plus signs for validation
    const cleanedPhone = trimmedPhone.replace(/[\s\-+]/g, '');
    
    if (!/^\d+$/.test(cleanedPhone)) {
        return { valid: false, message: "Phone number can only contain digits, spaces, hyphens, and +" };
    }
    
    if (cleanedPhone.length < 8 || cleanedPhone.length > 15) {
        return { valid: false, message: "Phone number must be between 8 and 15 digits" };
    }
    
    return { valid: true };
}

function validateDescription(description) {
    const trimmedDesc = description.trim();
    
    if (trimmedDesc === "") {
        return { valid: false, message: "Description is required" };
    }
    
    if (trimmedDesc.length < 10) {
        return { valid: false, message: "Please provide at least 10 characters" };
    }
    
    return { valid: true };
}

// Get form elements
const form = document.querySelector('form');
const fullnameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const routeInput = document.getElementById('route');
const descriptionInput = document.getElementById('description');

// Real-time validation on blur
fullnameInput.addEventListener('blur', () => {
    const validation = validateName(fullnameInput.value);
    if (!validation.valid) {
        showError(fullnameInput, validation.message);
    } else {
        clearError(fullnameInput);
    }
});

emailInput.addEventListener('blur', () => {
    const validation = validateEmail(emailInput.value);
    if (!validation.valid) {
        showError(emailInput, validation.message);
    } else {
        clearError(emailInput);
    }
});

phoneInput.addEventListener('blur', () => {
    const validation = validatePhone(phoneInput.value);
    if (!validation.valid) {
        showError(phoneInput, validation.message);
    } else {
        clearError(phoneInput);
    }
});

descriptionInput.addEventListener('blur', () => {
    const validation = validateDescription(descriptionInput.value);
    if (!validation.valid) {
        showError(descriptionInput, validation.message);
    } else {
        clearError(descriptionInput);
    }
});

// Clear error on input
fullnameInput.addEventListener('input', () => clearError(fullnameInput));
emailInput.addEventListener('input', () => clearError(emailInput));
phoneInput.addEventListener('input', () => clearError(phoneInput));
descriptionInput.addEventListener('input', () => clearError(descriptionInput));

// Form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Validate name
    const nameValidation = validateName(fullnameInput.value);
    if (!nameValidation.valid) {
        showError(fullnameInput, nameValidation.message);
        isValid = false;
    } else {
        clearError(fullnameInput);
    }
    
    // Validate email
    const emailValidation = validateEmail(emailInput.value);
    if (!emailValidation.valid) {
        showError(emailInput, emailValidation.message);
        isValid = false;
    } else {
        clearError(emailInput);
    }
    
    // Validate phone
    const phoneValidation = validatePhone(phoneInput.value);
    if (!phoneValidation.valid) {
        showError(phoneInput, phoneValidation.message);
        isValid = false;
    } else {
        clearError(phoneInput);
    }
    
    // Validate complaint type
    if (!selectedComplaintType) {
        showError(select_complaint_types, "Please select a complaint type");
        isValid = false;
    } else {
        clearError(select_complaint_types);
    }
    
    // Validate description
    const descValidation = validateDescription(descriptionInput.value);
    if (!descValidation.valid) {
        showError(descriptionInput, descValidation.message);
        isValid = false;
    } else {
        clearError(descriptionInput);
    }
    
    // If all validations pass
    if (isValid) {
        // Form data is valid, you can submit it
        console.log('Form is valid! Submitting...');
        
        const formData = {
            fullname: fullnameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            complaintType: selectedComplaintType,
            route: routeInput.value.trim(),
            datetime: formatDate(Date.now()), // Using current timestamp as placeholder
            description: descriptionInput.value.trim()
        };
        
        console.log('Form Data:', formData);
        
        // Here you would typically send the data to your server
        // Example: fetch('/api/complaints', { method: 'POST', body: JSON.stringify(formData) })
        
        alert('Complaint submitted successfully! You will receive a tracking number via email.');
        
        // Reset form
        form.reset();
        selectedComplaintType = "";
        complaint_types_placeholder.textContent = "Select Complaint Type";
        complaint_types_placeholder.style.color = "#64748B";
        document.querySelectorAll(".complaint-type").forEach((el) =>
            el.classList.remove("selected-complaint")
        );
    } else {
        // Scroll to first error
        const firstError = document.querySelector('.error-message');
        if (firstError) {
            firstError.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

// previous complaints

const your_complaints = document.getElementById("your-complaints");

const previous_complaints = [
    {
        id: "C-2024-001",
        status: "Resolved",
        date: "Oct 5, 2025",
        type: "Service Delay",
    },
    {
        id: "C-2024-002",
        status: "Ongoing",
        date: "Oct 6, 2025",
        type: "Bus Not Arrived",
    },
    {
        id: "C-2024-003",
        status: "Pending",
        date: "Oct 7, 2025",
        type: "Incorrect Schedule",
    },
]

previous_complaints.map((c) => {
    const singleComplaint = document.createElement("div");
    singleComplaint.className = "client-single-complaint";
    const style_status_class = c.status === "Resolved" ? "Resolved" :
        c.status === "Ongoing" ?
            "Ongoing" : "Pending";

    singleComplaint.innerHTML = `
        <div class="id-status-complaint">
            <p class="complaint-id">${c.id}</p>
            <p class="complaint-status ${style_status_class}">${c.status}</p>
        </div>
        <p class="complaint-title">${c.type}</p>
        <p class="complaint-date"><svg width="13" height="13" viewBox="0 0 13 13" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1_1081)">
                <path d="M6.66667 3.66669V6.66669L8.66667 7.66669" stroke="#64748B"
                    stroke-linecap="round" stroke-linejoin="round" />
                <path
                    d="M6.66667 11.6667C9.42809 11.6667 11.6667 9.42811 11.6667 6.66669C11.6667 3.90526 9.42809 1.66669 6.66667 1.66669C3.90524 1.66669 1.66667 3.90526 1.66667 6.66669C1.66667 9.42811 3.90524 11.6667 6.66667 11.6667Z"
                    stroke="#64748B" stroke-linecap="round" stroke-linejoin="round" />
                </g>
                <defs>
                <clipPath id="clip0_1_1081">
                    <rect width="12" height="12" fill="white"
                        transform="translate(0.666668 0.666687)" />
                </clipPath>
                </defs>
                </svg>
                        ${c.date}
                    </p>
    `
    your_complaints.appendChild(singleComplaint);
})