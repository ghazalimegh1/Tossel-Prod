const params = new URLSearchParams(window.location.search);
const loggedFlag = params.get("logged");

let menuButton = document.querySelector(".menu-button");
let clicked = false;

let x = `<svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 4L4 12" stroke="#0F172A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 4L12 12" stroke="#0F172A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
let m = `<svg width="20" height="20" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.71094 3.33008H13.3672" stroke="#0F172A" stroke-width="1.33203" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.71094 7.99219H13.3672" stroke="#0F172A" stroke-width="1.33203" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.71094 12.6543H13.3672" stroke="#0F172A" stroke-width="1.33203" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

let oc = document.querySelector(".options-container");
let navAfter = document.querySelector("nav + *");
let nav = document.querySelector("nav");

menuButton.addEventListener("click", () => {
  clicked = !clicked;

  menuButton.innerHTML = clicked ? x : m;
  oc.style.display = clicked ? "flex" : "none";
  navAfter.style.paddingTop =
    clicked && !scrollY ? `${70 + oc.clientHeight}px` : "70px";
  nav.style.backgroundColor = clicked ? "white" : "rgba(255,255,255,.8)";
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1000) {
    menuButton.innerHTML = m;
    oc.style.display = "none";
    navAfter.style.paddingTop = "70px";
  }
});

function setupOption(option) {
  const anchor = option.querySelector("a");
  const text = anchor ? anchor.innerText : option.innerText;

  if (text) {
    const folderFileName = text.trim().toLowerCase().replace(/\s+/g, "_");

    option.addEventListener("click", () => {
      window.location.href = `../../html/${folderFileName}/${folderFileName}.html${loggedFlag === "true" ? "?logged=true" : ""}`;
    });
  }
}

const navOptions = document.querySelectorAll(".nav-container .option");
navOptions.forEach(setupOption);

const mobileOptions = document.querySelectorAll(".options-container .option");
mobileOptions.forEach(setupOption);

function setActiveNavOption() {
  const pathParts = window.location.pathname.split("/");
  const fileName = pathParts[pathParts.length - 1];
  const folderName = fileName.replace(".html", "");

  const normalize = (text) => text.trim().toLowerCase().replace(/\s+/g, "_");

  const allOptions = document.querySelectorAll(
    ".nav-container .option, .options-container .option"
  );

  allOptions.forEach((option) => {
    const anchor = option.querySelector("a");
    const text = anchor ? anchor.innerText : option.innerText;
    if (text && normalize(text) === folderName) {
      option.classList.add("active");
    } else {
      option.classList.remove("active");
    }
  });
}

setActiveNavOption();

let logo = document.querySelector(".logo");

logo.addEventListener("click", () => {
  window.location.href = `../../html/home/home.html${loggedFlag === "true" ? "?logged=true" : ""}`;
});

function checkLoginState() {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("user");
  const isLogged = token || user || loggedFlag === "true";

  if (isLogged) {
    document.querySelectorAll(".login").forEach((e) => (e.style.display = "none"));

    // Show profile if it exists (it was commented out in HTML, assuming we uncomment or manage via JS)
    // Actually, looking at HTML, profile option is there but might need display handling
    // Let's select by class .profile and ensure it's shown
    const profileBtn = document.querySelector(".option.profile");
    if (profileBtn) {
      profileBtn.style.display = "flex";
    }
  } else {
    // Hide profile if not logged
    const profileBtn = document.querySelector(".option.profile");
    if (profileBtn) {
      profileBtn.style.display = "none";
    }
    // Show login
    document.querySelectorAll(".login").forEach((e) => (e.style.display = "flex"));
  }
}

window.onload = checkLoginState();

