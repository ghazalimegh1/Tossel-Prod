function togglePassword() {
    const pwInput = document.getElementById('password_input_data');
    const toggleBtn = document.getElementById('togglePassword');

    // object that stores the svgs  
    const icons = {
        show: `
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.13503 10.4567C2.06558 10.2696 2.06558 10.0638 2.13503 9.87668C2.81145 8.23656 3.95963 6.83422 5.43401 5.84743C6.90839 4.86065 8.64257 4.33386 10.4167 4.33386C12.1908 4.33386 13.925 4.86065 15.3994 5.84743C16.8738 6.83422 18.022 8.23656 18.6984 9.87668C18.7678 10.0638 18.7678 10.2696 18.6984 10.4567C18.022 12.0968 16.8738 13.4991 15.3994 14.4859C13.925 15.4727 12.1908 15.9995 10.4167 15.9995C8.64257 15.9995 6.90839 15.4727 5.43401 14.4859C3.95963 13.4991 2.81145 12.0968 2.13503 10.4567Z" stroke="#64748B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10.4167 12.6667C11.7974 12.6667 12.9167 11.5474 12.9167 10.1667C12.9167 8.78598 11.7974 7.66669 10.4167 7.66669C9.03598 7.66669 7.91669 8.78598 7.91669 10.1667C7.91669 11.5474 9.03598 12.6667 10.4167 12.6667Z" stroke="#64748B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
        hide: `
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_18_112)">
        <path d="M9.86084 4.39668C11.802 4.16534 13.7655 4.57569 15.4516 5.56505C17.1376 6.55441 18.4535 8.0684 19.1983 9.87584C19.2678 10.0629 19.2678 10.2687 19.1983 10.4558C18.8921 11.1983 18.4873 11.8963 17.995 12.5308" stroke="#64748B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12.6535 11.965C12.182 12.4204 11.5505 12.6724 10.895 12.6667C10.2395 12.661 9.6125 12.3981 9.14898 11.9346C8.68546 11.4711 8.42254 10.844 8.41684 10.1885C8.41115 9.53305 8.66313 8.90154 9.11853 8.43004" stroke="#64748B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15.4826 14.7492C14.3772 15.404 13.1438 15.8134 11.8662 15.9495C10.5886 16.0857 9.29672 15.9454 8.07812 15.5383C6.85952 15.1311 5.74276 14.4666 4.80361 13.5898C3.86445 12.713 3.12489 11.6445 2.6351 10.4567C2.56565 10.2696 2.56565 10.0638 2.6351 9.87668C3.37396 8.0849 4.67399 6.58106 6.3401 5.59085" stroke="#64748B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2.5835 1.83336L19.2502 18.5" stroke="#64748B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
        <clipPath id="clip0_18_112">
        <rect width="20" height="20" fill="white" transform="translate(0.916748 0.166687)"/>
        </clipPath>
        </defs>
        </svg>
      `
    };

    // Initially assume password is hidden; set icon accordingly
    toggleBtn.innerHTML = icons.hide;

    function updateButton(isVisible) {
        // isVisible === true means password is currently shown (type="text")
        toggleBtn.setAttribute('aria-pressed', String(isVisible));
        toggleBtn.setAttribute('aria-label', isVisible ? 'Hide password' : 'Show password');
        toggleBtn.title = isVisible ? 'Hide password' : 'Show password';
        toggleBtn.innerHTML = isVisible ? icons.show : icons.hide;
    }

    toggleBtn.addEventListener('click', function () {
        // toggle type
        const isHidden = pwInput.type === 'password';
        pwInput.type = isHidden ? 'text' : 'password';

        // If you want the cursor to stay at the end after toggling:
        const pos = pwInput.value.length;
        try {
            pwInput.setSelectionRange(pos, pos);
            pwInput.focus();
        } catch (e) {
            // setSelectionRange may fail on some browsers for type=text->password toggles; ignore
        }

        updateButton(isHidden); // isHidden true -> now visible
    });

}


var titleIcon = `
<svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.700012 12.1667C0.700012 5.53925 6.0726 0.166672 12.7 0.166672H36.7C43.3274 0.166672 48.7 5.53925 48.7 12.1667V36.1667C48.7 42.7941 43.3274 48.1667 36.7 48.1667H12.7C6.0726 48.1667 0.700012 42.7941 0.700012 36.1667V12.1667Z" fill="url(#paint0_linear_1_7)"/>
<path d="M20.0333 17.1667V24.1667" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M28.2 17.1667V24.1667" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.0333 24.1667H35.9" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M31.7 31.1667H35.2C35.2 31.1667 35.7833 29.1833 36.1333 27.9C36.25 27.4333 36.3667 26.9667 36.3667 26.5C36.3667 26.0333 36.25 25.5667 36.1333 25.1L34.5 19.2667C34.15 18.1 32.9833 17.1667 31.7 17.1667H15.3667C14.7478 17.1667 14.1543 17.4125 13.7167 17.8501C13.2792 18.2877 13.0333 18.8812 13.0333 19.5V31.1667H16.5333" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.8667 33.5C20.1553 33.5 21.2 32.4553 21.2 31.1667C21.2 29.878 20.1553 28.8333 18.8667 28.8333C17.578 28.8333 16.5333 29.878 16.5333 31.1667C16.5333 32.4553 17.578 33.5 18.8667 33.5Z" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21.2 31.1667H27.0333" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M29.3667 33.5C30.6553 33.5 31.7 32.4553 31.7 31.1667C31.7 29.878 30.6553 28.8333 29.3667 28.8333C28.078 28.8333 27.0333 29.878 27.0333 31.1667C27.0333 32.4553 28.078 33.5 29.3667 33.5Z" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
<defs>
<linearGradient id="paint0_linear_1_7" x1="24.7" y1="0.166672" x2="24.7" y2="48.1667" gradientUnits="userSpaceOnUse">
<stop stop-color="#2563EB"/>
<stop offset="1" stop-color="#06B6D4"/>
</linearGradient>
</defs>
</svg>

`;

// Full name user icon
const fullNameIcon = `
<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.75 17.6667V16.0001C16.75 15.116 16.3989 14.2682 15.7737 13.6431C15.1486 13.0179 14.3008 12.6667 13.4167 12.6667H8.41671C7.53265 12.6667 6.68481 13.0179 6.05968 13.6431C5.43456 14.2682 5.08337 15.116 5.08337 16.0001V17.6667" stroke="#64748B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.9167 9.33341C12.7577 9.33341 14.25 7.84103 14.25 6.00008C14.25 4.15913 12.7577 2.66675 10.9167 2.66675C9.07576 2.66675 7.58337 4.15913 7.58337 6.00008C7.58337 7.84103 9.07576 9.33341 10.9167 9.33341Z" stroke="#64748B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

// Email icon
const emailIcon = `
<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.75 6.00003L11.2575 10.7725C11.0033 10.9202 10.7145 10.998 10.4204 10.998C10.1264 10.998 9.8376 10.9202 9.58334 10.7725L2.08334 6.00003" stroke="#64748B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17.0833 3.50003H3.75001C2.82954 3.50003 2.08334 4.24622 2.08334 5.1667V15.1667C2.08334 16.0872 2.82954 16.8334 3.75001 16.8334H17.0833C18.0038 16.8334 18.75 16.0872 18.75 15.1667V5.1667C18.75 4.24622 18.0038 3.50003 17.0833 3.50003Z" stroke="#64748B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

// Phone number icon
const phoneIcon = `
<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_22_52)">
    <path d="M12.4434 13.9735C12.6155 14.0525 12.8094 14.0706 12.9931 14.0247C13.1769 13.9788 13.3395 13.8717 13.4542 13.721L13.75 13.3335C13.9053 13.1265 14.1066 12.9585 14.338 12.8428C14.5694 12.7271 14.8246 12.6668 15.0834 12.6668H17.5834C18.0254 12.6668 18.4493 12.8424 18.7619 13.155C19.0744 13.4675 19.25 13.8915 19.25 14.3335V16.8335C19.25 17.2755 19.0744 17.6994 18.7619 18.012C18.4493 18.3246 18.0254 18.5002 17.5834 18.5002C13.6051 18.5002 9.78982 16.9198 6.97677 14.1068C4.16373 11.2937 2.58337 7.47841 2.58337 3.50016C2.58337 3.05814 2.75897 2.63421 3.07153 2.32165C3.38409 2.00909 3.80801 1.8335 4.25004 1.8335H6.75004C7.19207 1.8335 7.61599 2.00909 7.92855 2.32165C8.24111 2.63421 8.41671 3.05814 8.41671 3.50016V6.00016C8.41671 6.2589 8.35647 6.51409 8.24075 6.74552C8.12504 6.97694 7.95703 7.17825 7.75004 7.3335L7.36004 7.626C7.20705 7.74281 7.09922 7.90898 7.05487 8.09629C7.01051 8.28359 7.03236 8.48048 7.11671 8.6535C8.25561 10.9667 10.1287 12.8375 12.4434 13.9735Z" stroke="#64748B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
    <clipPath id="clip0_22_52">
    <rect width="20" height="20" fill="white" transform="translate(0.916748 0.166748)"/>
    </clipPath>
    </defs>
</svg>
`;

// Password icon
const passwordIcon = `
<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.25 9.33334H4.58335C3.66288 9.33334 2.91669 10.0795 2.91669 11V16.8333C2.91669 17.7538 3.66288 18.5 4.58335 18.5H16.25C17.1705 18.5 17.9167 17.7538 17.9167 16.8333V11C17.9167 10.0795 17.1705 9.33334 16.25 9.33334Z" stroke="#64748B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6.25003 9.33334V6.00001C6.25003 4.89494 6.68902 3.83513 7.47042 3.05373C8.25182 2.27233 9.31163 1.83334 10.4167 1.83334C11.5218 1.83334 12.5816 2.27233 13.363 3.05373C14.1444 3.83513 14.5834 4.89494 14.5834 6.00001V9.33334" stroke="#64748B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

// Password visibility toggle icon
const togglePasswordIcon = `
<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.13503 10.4567C2.06558 10.2696 2.06558 10.0638 2.13503 9.87668C2.81145 8.23656 3.95963 6.83422 5.43401 5.84743C6.90839 4.86065 8.64257 4.33386 10.4167 4.33386C12.1908 4.33386 13.925 4.86065 15.3994 5.84743C16.8738 6.83422 18.022 8.23656 18.6984 9.87668C18.7678 10.0638 18.7678 10.2696 18.6984 10.4567C18.022 12.0968 16.8738 13.4991 15.3994 14.4859C13.925 15.4727 12.1908 15.9995 10.4167 15.9995C8.64257 15.9995 6.90839 15.4727 5.43401 14.4859C3.95963 13.4991 2.81145 12.0968 2.13503 10.4567Z" stroke="#64748B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.4167 12.6667C11.7974 12.6667 12.9167 11.5474 12.9167 10.1667C12.9167 8.78598 11.7974 7.66669 10.4167 7.66669C9.03598 7.66669 7.91669 8.78598 7.91669 10.1667C7.91669 11.5474 9.03598 12.6667 10.4167 12.6667Z" stroke="#64748B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;


function injectIcons() {
    // List of element IDs in your HTML where you want to inject icons
    let ids = [
        "iconTitle",
        "iconFullName",
        "iconEmail",
        "iconPhone",
        "iconPassword",
        "iconTogglePassword"
    ];

    let idMap = {
        iconTitle: titleIcon,
        iconFullName: fullNameIcon,
        iconEmail: emailIcon,
        iconPhone: phoneIcon,
        iconPassword: passwordIcon,
        iconTogglePassword: togglePasswordIcon
    };

    ids.forEach(id => {
        let el = document.getElementById(id);
        if (el) el.innerHTML = idMap[id];
    });
}

// Validation functions
function validateFullName(name) {
    return /^[a-zA-Z]+(\s[a-zA-Z]+)+$/.test(name.trim());
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
}

function validatePhone(phone) {
    return /^\+?\d{1,4}?[-.\s]?(\(?\d{1,3}?\))?[-.\s]?\d{3,4}[-.\s]?\d{3,4}$/.test(phone.trim());
}

function validatePassword(password) {
    return password.length >= 8 && /\d/.test(password);
}

function validateConfirmPassword(confirm, password) {
    return confirm.trim() !== "" && confirm === password;
}

function validateTerms(checked) {
    return checked === true;
}

function createExplainHeader(text, name) {
    let explainHeader = document.createElement("h3");
    explainHeader.id = `${name}_explain`;
    explainHeader.className = "text_explain";
    explainHeader.textContent = text;
    return explainHeader;
}

// Main form validation
function validateForm(e) {
    const data = [
        [
            "fullName",
            "full_name_input",
            "sub_full_name_container",
            "full_name_container",
            "Please enter your full name (first & last name)."
        ],
        [
            "email",
            "email_input_data",
            "sub_email_container",
            "email_container",
            "Please enter a valid email address."
        ],
        [
            "phone",
            "phone_input_data",
            "sub_phone_number_container",
            "phone_number_container",
            "Please enter a valid phone number."
        ],
        [
            "password",
            "password_input_data",
            "sub_password_container",
            "password_container",
            "Password must be at least 8 characters and contain a number."
        ],
        [
            "confirmPassword",
            "confirm_password_input",
            "sub_password_container_confirm",
            "password_confirm_container",
            "Passwords do not match."
        ]
    ];


    const formValidateMap = {
        fullName: validateFullName,
        email: validateEmail,
        phone: validatePhone,
        password: validatePassword,
        confirmPassword: (value) => {
            const password = document.getElementById("password_input_data").value;
            return validateConfirmPassword(value, password);
        }
    };

    let flag = true;

    data.forEach(([field, id, containerClass, masterContainer, explainText]) => {
        let container = document.querySelector(`.${masterContainer}`);
        let inputBox = document.querySelector(`.${containerClass}`);
        let element = document.getElementById(id);
        const value = element.value;

        inputBox.classList.remove("validateError", "validateSuccess");

        if (!formValidateMap[field](value)) {
            inputBox.classList.add("validateError");
            let explain = document.getElementById(`${masterContainer}_explain`);
            if (!explain) {
                let explainHeader = createExplainHeader(explainText, masterContainer);
                container.append(explainHeader);
            }
            flag = false;
        } else {
            let explain = document.getElementById(`${masterContainer}_explain`);
            if (explain) {
                explain.remove();
            }
            inputBox.classList.add("validateSuccess");
        }
    });


    // Terms checkbox validation
    const termsCheckbox = document.getElementById("terms_checkbox");
    const termsContainer = document.querySelector(".terms_option");
    termsContainer.classList.remove("validateError", "validateSuccess");

    if (!validateTerms(termsCheckbox.checked)) {
        termsContainer.classList.add("validateError");
        flag = false;
    } else {
        termsContainer.classList.add("validateSuccess");
    }

    if (!flag) e.preventDefault();

    return flag;
}



injectIcons();
togglePassword();

// Backend API Integration
// Backend API Integration
const API_URL = "/api/auth";

var submit_button = document.querySelector(".signin_button");
submit_button.addEventListener("click", async (e) => {
    e.preventDefault();

    // Clear previous errors
    const errorMsg = document.getElementById("signup-error");
    if (errorMsg) errorMsg.remove();

    if (validateForm(e)) {
        const username = document.getElementById("full_name_input").value;
        const email = document.getElementById("email_input_data").value;
        const password = document.getElementById("password_input_data").value;

        try {
            submit_button.innerHTML = "Creating account...";
            submit_button.disabled = true;

            const response = await fetch(`${API_URL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store JWT token
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.href = "../../html/home/home.html?logged=true";
            } else {
                // Show error
                showSignupError(data.message || "Signup failed");
                submit_button.innerHTML = "Create Account";
                submit_button.disabled = false;
            }
        } catch (error) {
            console.error("Signup error:", error);
            showSignupError("Connection failed. Please try again.");
            submit_button.innerHTML = "Create Account";
            submit_button.disabled = false;
        }
    }
});

function showSignupError(message) {
    const container = document.querySelector(".signin_button_container");
    const errorDiv = document.createElement("div");
    errorDiv.id = "signup-error";
    errorDiv.style.color = "red";
    errorDiv.style.marginTop = "10px";
    errorDiv.style.textAlign = "center";
    errorDiv.textContent = message;

    if (container) container.insertBefore(errorDiv, submit_button);
    else submit_button.parentNode.insertBefore(errorDiv, submit_button);
}
