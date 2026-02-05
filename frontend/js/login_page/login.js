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

// this code is so dry it makes me wanna kill myself 
// i dont know if i should blame the "file structure" that chef de project 
// implimented  ... 
// matter or fact ? 
// its his fault , i would loved to have utils file where we have shared functions 

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

// Email icon
const emailIcon = `
<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.75 6.00003L11.2575 10.7725C11.0033 10.9202 10.7145 10.998 10.4204 10.998C10.1264 10.998 9.8376 10.9202 9.58334 10.7725L2.08334 6.00003" stroke="#64748B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17.0833 3.50003H3.75001C2.82954 3.50003 2.08334 4.24622 2.08334 5.1667V15.1667C2.08334 16.0872 2.82954 16.8334 3.75001 16.8334H17.0833C18.0038 16.8334 18.75 16.0872 18.75 15.1667V5.1667C18.75 4.24622 18.0038 3.50003 17.0833 3.50003Z" stroke="#64748B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
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
    // List of element IDs in your
    // HTML where you want to inject icons
    let ids = [
        "iconTitle",
        "iconEmail",
        "iconPassword",
        "iconTogglePassword"
    ];

    let idMap = {
        iconTitle: titleIcon,
        iconEmail: emailIcon,
        iconPassword: passwordIcon,
        iconTogglePassword: togglePasswordIcon
    };

    ids.forEach(id => {
        let el = document.getElementById(id);
        if (!el) alert("cannot find");
        if (el) el.innerHTML = idMap[id];
    });
}


function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
}

function validatePassword(password) {
    return password.length >= 8 && /\d/.test(password);
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
            "email",
            "email_input_data",
            "sub_email_container",
            "email_container",
            "Please enter a valid email address."
        ],
        [
            "password",
            "password_input_data",
            "sub_password_container",
            "password_container",
            "Password must be at least 8 characters and contain a number."
        ]
    ];


    const formValidateMap = {
        email: validateEmail,
        password: validatePassword,
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
    const errorMsg = document.getElementById("login-error");
    if (errorMsg) errorMsg.remove();

    if (validateForm(e)) {
        const username = document.getElementById("email_input_data").value; // Using email logic as username for now or we can update backend
        const password = document.getElementById("password_input_data").value;

        try {
            submit_button.innerHTML = "Signing in...";
            submit_button.disabled = true;

            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store JWT token
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.href = "../../html/home/home.html?logged=true";
            } else {
                // Show error
                showLoginError(data.message || "Login failed");
                submit_button.innerHTML = "Sign In";
                submit_button.disabled = false;
            }
        } catch (error) {
            console.error("Login error:", error);
            showLoginError("Connection failed. Please try again.");
            submit_button.innerHTML = "Sign In";
            submit_button.disabled = false;
        }
    }
});

function showLoginError(message) {
    const container = document.querySelector(".signin_button_container"); // Assuming this class exists or button parent
    const errorDiv = document.createElement("div");
    errorDiv.id = "login-error";
    errorDiv.style.color = "red";
    errorDiv.style.marginTop = "10px";
    errorDiv.style.textAlign = "center";
    errorDiv.textContent = message;

    // Insert before button
    if (container) container.insertBefore(errorDiv, submit_button);
    else submit_button.parentNode.insertBefore(errorDiv, submit_button);
}
