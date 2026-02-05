let inputs = document.querySelectorAll("input");
let starting = inputs[0];
let destination = inputs[1];
let findButton = document.querySelector(".find-button");
let cities = [];

// Load cities
fetch("../../json/home/cities.json")
  .then((res) => res.json())
  .then((data) => {
    cities = data;
    setupAutocomplete(starting, 0);
    setupAutocomplete(destination, 1);
  });

// Function to animate the splitted letters
function animateSplitted(splitted, up, index) {
  const letters = splitted.querySelectorAll("div");
  letters.forEach((letter, i) => {
    letter.style.transition = "all 0.25s ease-in-out";
    letter.style.transitionDelay = `${0.02 * i}s`;
    letter.style.marginTop = up ? "-45px" : "0px";
    letter.style.fontSize = up ? "18px" : "16px";
    letter.style.color = up ? (index === 0 ? "#00A63E" : "#E7000B") : "gray";
  });
}

// Handle focus, blur and animation for each input
inputs.forEach((input, i, arr) => {
  const container = input.parentElement.parentElement;
  const splitted = container.querySelector(".splitted");
  let selected = false; // prevent splitted from appearing after selecting

  input.addEventListener("focus", () => {
    if (!selected) splitted.style.display = "flex";
    container.classList.add("focused");
    animateSplitted(splitted, true, i);

    if (window.innerWidth <= 790) {
      if (i === 0)
        document.querySelector(".search-container").style.paddingTop = "18px";
      else document.querySelector(".destination").style.marginTop = "18px";
    } else {
      document.querySelector(".search-container").style.paddingTop = "18px";
    }
  });

  input.addEventListener("blur", () => {
    const value = input.value.trim().toLowerCase();
    const isValid = cities.some(
      (c) => c.commune_name_ascii.toLowerCase() === value
    );

    if (!isValid) {
      input.value = "";
      selected = false;
      splitted.style.display = "flex";
    } else {
      splitted.style.display = "none";
    }

    container.classList.remove("focused");
    animateSplitted(splitted, false, i);

    document.querySelector(".search-container").style.paddingTop = "0";
    document.querySelector(".destination").style.marginTop = "0";

    updateFindButton();
  });
});

// Autocomplete setup
function setupAutocomplete(inputElement, i) {
  const suggestionBox =
    inputElement.parentElement.querySelector(".suggestions");
  let selected = false;

  inputElement.addEventListener("input", () => {
    let value = inputElement.value.trim().toLowerCase();
    if (!value) {
      suggestionBox.style.display = "none";
      updateFindButton();
      return;
    }

    const filtered = cities
      .filter((c) => c.commune_name_ascii.toLowerCase().includes(value))
      .filter((c) => {
        if (
          inputElement === destination &&
          starting.value.toLowerCase() === c.commune_name_ascii.toLowerCase()
        )
          return false;
        return true;
      })
      .sort((a, b) => a.commune_name_ascii.localeCompare(b.commune_name_ascii))
      .slice(0, 8);

    suggestionBox.innerHTML = filtered
      .map((c) => `<div class="suggestion-item">${c.commune_name_ascii}</div>`)
      .join("");

    suggestionBox.style.display = filtered.length ? "block" : "none";

    suggestionBox.querySelectorAll(".suggestion-item").forEach((item) => {
      item.addEventListener("click", () => {
        inputElement.value = item.textContent;
        suggestionBox.style.display = "none";
        inputElement.parentElement.parentElement.querySelector(
          ".splitted"
        ).style.display = "none";
        selected = true; // mark as selected
        updateFindButton();
      });
    });

    updateFindButton();
  });
}

// Enable/disable Find button
function updateFindButton() {
  const startVal = starting.value.trim().toLowerCase();
  const destVal = destination.value.trim().toLowerCase();

  const startValid = cities.some(
    (c) => c.commune_name_ascii.toLowerCase() === startVal
  );
  const destValid = cities.some(
    (c) => c.commune_name_ascii.toLowerCase() === destVal
  );

  if (startValid && destValid && startVal !== destVal) {
    findButton.classList.remove("disabled");
  } else {
    findButton.classList.add("disabled");
  }
}

// Handle Find Routes button click
findButton.addEventListener("click", () => {
  if (findButton.classList.contains("disabled")) return; // prevent if not valid

  const startVal = starting.value.trim();
  const destVal = destination.value.trim();

  starting.value = "";
  destination.value = "";

  // Build the URL with query parameters
  const url = `../../html/routes_page/routes_page.html?start=${encodeURIComponent(
    startVal
  )}&destination=${encodeURIComponent(destVal)}`;

  window.location.href = url;
});

const serviceContainers = document.querySelectorAll(".service-container");

serviceContainers.forEach((container) => {
  container.addEventListener("click", () => {
    const serviceName = container
      .querySelector(".service-name")
      .innerText.toLowerCase();
    let link = "";

    switch (serviceName) {
      case "find route":
        link = "route_finder";
        break;
      case "driver dashboard":
        link = "driver_dashboard";
        break;
      case "my profile":
        link = "profile";
        break;
      case "complaints":
        link = "complaints";
        break;
      case "about tossal":
        link = "about";
        break;
      case "contact us":
        link = "contact";
        break;
      case "home":
        link = "home";
        break;
      case "login":
        link = "login";
        break;
      default:
        return;
    }

    window.location.href = `../../html/${link}/${link}.html`;
  });
});

const buttons = document.querySelectorAll(".ready-to-start .button");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const text = button.querySelector(".button-d").innerText.toLowerCase();
    let link = "";

    switch (text) {
      case "find a route":
        link = "route_finder";
        break;
      case "create account":
        link = "sign_up";
        break;
      default:
        console.warn(`No link mapping for: ${text}`);
        return;
    }

    window.location.href = `../../html/${link}/${link}.html`;
  });
});

const parameters = new URLSearchParams(window.location.search);
const loggedStatus = parameters.get("logged");

const ready_start_section = document.querySelector(".ready-to-start");
if (loggedStatus === "true") {
  ready_start_section.style.display = "none";
}
