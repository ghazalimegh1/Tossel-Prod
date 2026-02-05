document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("the_info");
  const startingPoint = document.getElementById("starting_point");
  const destination = document.getElementById("destination");
  const departureTime = document.getElementById("departure_time");
  const submitBtn = document.getElementById("submit_btn");
  let knownLocationslist = [];

  //Backend API Integration
  //Backend API Integration
  const API_URL = "/api/routes";

  //Loading the knownlocations from backend
  fetch(`${API_URL}/locations`)
    .then((response) => response.json())
    .then((data) => {
      knownLocationslist = data.knownLocations;
    })
    .catch(err => console.error("Error fetching locations:", err));

  setMinDT();

  startingPoint.addEventListener("input", () =>
    validateLocation(startingPoint)
  );
  destination.addEventListener("input", () => validateLocation(destination));
  departureTime.addEventListener("change", () =>
    validateDateTime(departureTime)
  );

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();
    let isValid = true;

    if (!validateLocation(startingPoint)) {
      isValid = false;
    }
    if (!validateLocation(destination)) {
      isValid = false;
    }
    if (
      startingPoint.value.trim().toLowerCase() ===
      destination.value.trim().toLowerCase()
    ) {
      showError(
        destination,
        "Destination cannot be the same as starting point"
      );
      isValid = false;
    }
    if (!validateDateTime(departureTime)) {
      isValid = false;
    }
    if (isValid) {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<img src="../../assets/Icon.svg" id="search-icon" alt="search">Searching...';
      saveSearchData();
      setTimeout(() => {
        const url = `../../html/routes_page/routes_page.html?start=${encodeURIComponent(
          startingPoint.value.trim()
        )}&destination=${encodeURIComponent(destination.value.trim())}`;

        window.location.href = url;
      }, 1500);
    }
  });

  function setMinDT() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    departureTime.setAttribute("min", minDateTime);
  }

  function validateLocation(input) {
    const value = input.value.trim();

    if (value === "") {
      indicateError(input, "Locations can not be empty");
      return false;
    }

    if (value.length < 2) {
      indicateError(input, "Please enter at least 2 characters");
      return false;
    }

    const validPattern = /^[a-zA-Z0-9\s\-,.'()]+$/;
    if (!validPattern.test(value)) {
      indicateError(input, "Please enter a valid location name");
      return false;
    }

    if (!/[a-zA-Z]/.test(value)) {
      indicateError(input, "Location must contain at least one letter");
      return false;
    }

    if (!isKnownLocation(value)) {
      Warning(input, "Location not recognized. Please check spelling.");
      return true;
    }

    clearError(input);
    return true;
  }

  function validateDateTime(input) {
    const value = input.value;


    if (value === "") {
      indicateError(input, "Please select a departure time");
      return false;
    }


    const selectedDate = new Date(value);
    const now = new Date();

    if (!selectedDate.getFullYear()) {
      indicateError(input, "Please enter a valid year");
      return false;
    }
    if (selectedDate < now) {
      indicateError(input, "Departure time cannot be in the past");
      return false;
    }

    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    if (selectedDate > oneYearFromNow) {
      indicateError(input, "Please select a date within the next year");
      return false;
    }

    if (selectedDate.getFullYear() > oneYearFromNow.getFullYear()) {

      indicateError(input, "invalid year");
      return false;
    }

    clearError(input);
    return true;
  }

  function isKnownLocation(location) {
    const locationLower = location.toLowerCase().trim();
    return knownLocationslist.some(
      (known) => {
        // Handle both string and object formats
        const knownName = typeof known === 'string' ? known : known.name;
        return (
          knownName.toLowerCase() === locationLower ||
          knownName.toLowerCase().includes(locationLower) ||
          locationLower.includes(knownName.toLowerCase())
        );
      }
    );
  }

  function indicateError(input, message) {
    clearError(input);

    const inputContainer = input.closest(".inputs");
    const labinpu = input.closest(".labinpu");

    inputContainer.style.border = "1px solid #EF4444";
    inputContainer.style.background = "#FEF2F2";

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.color = "#EF4444";
    errorDiv.style.fontSize = "14px";
    errorDiv.style.marginTop = "4px";
    errorDiv.textContent = message;

    labinpu.appendChild(errorDiv);
  }

  function Warning(input, message) {
    clearError(input);

    const inputContainer = input.closest(".inputs");
    const labinpu = input.closest(".labinpu");

    inputContainer.style.border = "1px solid #F59E0B";
    inputContainer.style.background = "#FFFBEB";

    const warningDiv = document.createElement("div");
    warningDiv.className = "error-message";
    warningDiv.style.color = "#F59E0B";
    warningDiv.style.fontSize = "14px";
    warningDiv.style.marginTop = "4px";
    warningDiv.textContent = message;

    labinpu.appendChild(warningDiv);
  }

  function clearError(input) {
    const inputContainer = input.closest(".inputs");
    const labinpu = input.closest(".labinpu");

    inputContainer.style.border = "1px solid #f8fafc";
    inputContainer.style.background = "#f8fafc";

    const errorMessage = labinpu.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  function clearErrors() {
    const allInputs = [startingPoint, destination, departureTime];
    allInputs.forEach((input) => clearError(input));
  }

  function saveSearchData() {
    const searchData = {
      startingPoint: startingPoint.value.trim(),
      destination: destination.value.trim(),
      departureTime: departureTime.value,
      timestamp: new Date().toISOString(),
    };

    let recentSearches = JSON.parse(
      localStorage.getItem("recentSearches") || "[]"
    );
    recentSearches = recentSearches.filter(
      (search) =>
        !(
          search.startingPoint.toLowerCase() ===
          searchData.startingPoint.toLowerCase() &&
          search.destination.toLowerCase() ===
          searchData.destination.toLowerCase()
        )
    );
    recentSearches.unshift(searchData);
    recentSearches = recentSearches.slice(0, 10);

    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }
  function displayRecentSearches() {
    const recentSearches = JSON.parse(
      localStorage.getItem("recentSearches") || "[]"
    );
    const recentSearchesContainer = document.querySelector(".recent_searches");

    if (!recentSearchesContainer) {
      return;
    }
    const title = recentSearchesContainer.querySelector(
      "#recent_searches_title"
    );
    recentSearchesContainer.innerHTML = "";
    if (title) {
      recentSearchesContainer.appendChild(title);
    }
    if (recentSearches.length === 0) {
      const noSearchesMsg = document.createElement("p");
      noSearchesMsg.style.color = "#64748b";
      noSearchesMsg.style.fontSize = "14px";
      noSearchesMsg.style.padding = "10px 0";
      noSearchesMsg.textContent =
        "No recent searches yet. Start by planning your first route!";
      recentSearchesContainer.appendChild(noSearchesMsg);
      return;
    }
    const searchesToDisplay = recentSearches.slice(0, 3);

    searchesToDisplay.forEach((search) => {
      const searchDiv = document.createElement("div");
      searchDiv.className = "recent_destination";

      searchDiv.innerHTML = `
                <div class="recent_locations">
                    <div><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.6668 7.00002C13.6668 10.3287 9.97412 13.7954 8.73412 14.866C8.61861 14.9529 8.47799 14.9999 8.33346 14.9999C8.18892 14.9999 8.04831 14.9529 7.93279 14.866C6.69279 13.7954 3.00012 10.3287 3.00012 7.00002C3.00012 5.58553 3.56203 4.22898 4.56222 3.22878C5.56241 2.22859 6.91897 1.66669 8.33346 1.66669C9.74794 1.66669 11.1045 2.22859 12.1047 3.22878C13.1049 4.22898 13.6668 5.58553 13.6668 7.00002Z" stroke="#00A63E" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8.3335 9.00006C9.43807 9.00006 10.3335 8.10463 10.3335 7.00006C10.3335 5.89549 9.43807 5.00006 8.3335 5.00006C7.22893 5.00006 6.3335 5.89549 6.3335 7.00006C6.3335 8.10463 7.22893 9.00006 8.3335 9.00006Z" stroke="#00A63E" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg></div>
                    <div><p>${search.startingPoint}</p></div>
                </div>
                <div class="recent_locations">
                    <div><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.6668 7.00002C13.6668 10.3287 9.97412 13.7954 8.73412 14.866C8.61861 14.9529 8.47799 14.9999 8.33346 14.9999C8.18892 14.9999 8.04831 14.9529 7.93279 14.866C6.69279 13.7954 3.00012 10.3287 3.00012 7.00002C3.00012 5.58553 3.56203 4.22898 4.56222 3.22878C5.56241 2.22859 6.91897 1.66669 8.33346 1.66669C9.74794 1.66669 11.1045 2.22859 12.1047 3.22878C13.1049 4.22898 13.6668 5.58553 13.6668 7.00002Z" stroke="#E7000B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8.3335 9.00006C9.43807 9.00006 10.3335 8.10463 10.3335 7.00006C10.3335 5.89549 9.43807 5.00006 8.3335 5.00006C7.22893 5.00006 6.3335 5.89549 6.3335 7.00006C6.3335 8.10463 7.22893 9.00006 8.3335 9.00006Z" stroke="#E7000B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg></div>
                    <div><p>${search.destination}</p></div>
                </div>
            `;
      searchDiv.style.cursor = "pointer";
      searchDiv.addEventListener("click", function () {
        startingPoint.value = search.startingPoint;
        destination.value = search.destination;
        clearErrors();
      });
      recentSearchesContainer.appendChild(searchDiv);
    });
  }
  displayRecentSearches();
  function setupPopularDestinations() {
    const popularDestinations = document.querySelectorAll(
      ".popular_distination_lines .the_text"
    );

    if (popularDestinations.length === 0) {
      return;
    }
    popularDestinations.forEach((destinationElement) => {
      destinationElement.style.cursor = "pointer";

      destinationElement.addEventListener("click", function () {
        const destinationText = this.textContent.trim();
        destination.value = destinationText;
        clearError(destination);
        form.scrollIntoView({ behavior: "smooth", block: "center" });
        destination.focus();
      });
    });
  }
  setupPopularDestinations();
});
