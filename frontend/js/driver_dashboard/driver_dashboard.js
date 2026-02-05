const confirmButton = document.querySelector(".current-button:nth-child(1)");
let button = document.querySelector(".on-duty div:last-child");
let dutyText = document.querySelector(".on-duty div:first-child");
let isClicked = false;

// Backend API Integration
const API_URL = "http://localhost:5000/api/driver";
let stops = [];

// Fetch Initial State
async function fetchDashboardState() {
  try {
    const response = await fetch(`${API_URL}/dashboard`);
    const data = await response.json();

    stops = data.stops;
    createRouteStops(stops);

    // Update UI based on initial state
    isClicked = !data.isOnDuty; // logic seems inverted in original: if clicked -> Off Duty. So if OnDuty=false -> clicked=true
    updateDutyUI();

    // Update status UI (simple text update for now)
    const statusDiv = document.querySelector(".status div:first-child");
    statusDiv.innerHTML = data.status;

  } catch (error) {
    console.error("Error fetching dashboard state:", error);
  }
}
fetchDashboardState();


function updateDutyUI() {
  if (isClicked) {
    button.parentElement.classList.add("clicked");
    dutyText.innerHTML = "Off Duty";
  } else {
    button.parentElement.classList.remove("clicked");
    dutyText.innerHTML = "On Duty";
  }
}

button.addEventListener("click", () => {
  isClicked = !isClicked;
  updateDutyUI();

  // Update Backend
  fetch(`${API_URL}/duty`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isOnDuty: !isClicked })
  }).catch(e => console.error(e));
});

let statusButton = document.querySelector(".status");
let states = document.querySelector(".states");
let state = false;

statusButton.addEventListener("click", () => {
  state = !state;
  states.style.display = state ? "flex" : "none";
});

let statesArr = document.querySelectorAll(".state");
let chr = document.querySelector(".current-head-right");
let symbol = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>`;

statesArr.forEach((s) => {
  s.addEventListener("click", () => {
    document.querySelector(".actual div:last-child").innerHTML = "";
    document.querySelector(".actual").classList.remove("actual");
    s.classList.add("actual");
    document.querySelector(".actual div:last-child").innerHTML = symbol;
    let textKey = s.querySelector("div:first-child").innerHTML; // "On Time", "Delayed" etc

    document.querySelector(".status div:first-child").innerHTML = textKey;

    // Update visual style
    updateCHRClass(textKey);

    states.style.display = "none";
    state = !state;

    // Update Backend
    fetch(`${API_URL}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: textKey })
    }).catch(e => console.error(e));
  });
});

function updateCHRClass(text) {
  if (text === "Running Early" || text === "Technical Issue")
    chr.innerHTML = "Early"; // Logic from original code, seemingly "Early" for issues too?
  else chr.innerHTML = text;

  // Reset classes
  chr.className = "current-head-right"; // Reset

  switch (text) {
    case "On Time":
      chr.classList.add("on-time");
      break;
    case "Delayed":
      chr.classList.add("delayed");
      break;
    case "Running Early":
      chr.classList.add("early");
      break;
    case "Technical Issue":
      chr.classList.add("early"); // Original logic used 'early' class for technical issue too
      break;
  }
}


const iconSVG = `
<svg width="17" height="17" viewBox="0 0 17 17" fill="none"
xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_82_543)">
<path d="M11.5703 14.6582V13.3262C11.5703 12.6196 11.2896 11.942 10.79 11.4424C10.2904 10.9428 9.6128 10.6621 8.90625 10.6621H4.91016C4.2036 10.6621 3.52599 10.9428 3.02638 11.4424C2.52677 11.942 2.24609 12.6196 2.24609 13.3262V14.6582" stroke="#64748B" stroke-width="1.33203" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.5703 2.75513C12.1416 2.90323 12.6475 3.23683 13.0087 3.70357C13.3699 4.17032 13.5658 4.74378 13.5658 5.33394C13.5658 5.9241 13.3699 6.49756 13.0087 6.9643C12.6475 7.43105 12.1416 7.76465 11.5703 7.91275" stroke="#64748B" stroke-width="1.33203" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.5664 14.6583V13.3263C15.566 12.736 15.3695 12.1626 15.0079 11.6961C14.6462 11.2295 14.1399 10.8963 13.5684 10.7488" stroke="#64748B" stroke-width="1.33203" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.9082 7.99805C8.37952 7.99805 9.57227 6.80531 9.57227 5.33398C9.57227 3.86266 8.37952 2.66992 6.9082 2.66992C5.43688 2.66992 4.24414 3.86266 4.24414 5.33398C4.24414 6.80531 5.43688 7.99805 6.9082 7.99805Z" stroke="#64748B" stroke-width="1.33203" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs><clipPath id="clip0_82_543"><rect width="15.9844" height="15.9844" fill="white" transform="translate(0.914062 0.671875)" /></clipPath></defs>
</svg>
`;

function createRouteStops(stopsData) {
  const container = document.getElementById("routeStops");
  container.innerHTML = "";

  stopsData.forEach(stop => {
    const stopDiv = document.createElement("div");
    stopDiv.className = `stop ${stop.status.toLowerCase()}`;

    const showRight = stop.count && stop.count > 0;

    stopDiv.innerHTML = `
            <div class="stop-left">
                <div class="rank">${stop.rank}</div>
                <div class="sl-info">
                    <div class="sli-top">
                        <div class="stop-name">${stop.name}</div>
                        <div class="stop-status">${stop.status}</div>
                    </div>
                    <div class="sli-buttom">${stop.time}</div>
                </div>
            </div>
            <div class="stop-right" style="display:${showRight ? 'flex' : 'none'}">
                <div>${iconSVG}</div>
                <div>${stop.count}</div>
            </div>
        `;

    let currentStopTitle = document.querySelector(".current-main-head-right > div:first-child");
    let currentStopSchedual = document.querySelector(".current-main-head-right > div:last-child");

    if (!confirmButton.classList.contains("confirm-button-disabled")) {
      let current = stopsData.filter(e => e.status === "Current")[0];
      if (current) {
        currentStopTitle.innerHTML = current.name;
        currentStopSchedual.innerHTML = `Scheduled: ${current.time}`
      } else {
        // Maybe finished?
        currentStopTitle.innerHTML = "Trip Completed";
        currentStopSchedual.innerHTML = "";
      }
    }


    container.appendChild(stopDiv);
  });
}

// createRouteStops(stops); // Called in fetch

const tooltip = document.createElement("div");
tooltip.className = "tooltip";
tooltip.innerText = "Arrival confirmed";
document.body.appendChild(tooltip);

confirmButton.addEventListener("click", (e) => {
  if (confirmButton.classList.contains("confirm-button-disabled")) return;

  // Optimistic UI update or wait for backend? Let's do backend first for correctness
  fetch(`${API_URL}/stop/complete`, { method: "POST" })
    .then(res => res.json())
    .then(data => {
      if (data.stops) {
        stops = data.stops;
        createRouteStops(stops);

        // Show tooltip
        const rect = confirmButton.getBoundingClientRect();
        tooltip.style.top = `${rect.top + 40}px`;
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.opacity = "1";

        setTimeout(() => {
          tooltip.style.opacity = "0";
        }, 2000);

        if (data.completed) {
          confirmButton.classList.add("confirm-button-disabled");
          confirmButton.innerHTML = "Already Arived!"
        }
      }
    })
    .catch(err => console.error(err));
});

const techIssueButton = document.querySelector(".current-button.login.option");
const ch = document.querySelector(".current-head-right");
const statusDiv = document.querySelector(".status div:first-child");

techIssueButton.addEventListener("click", () => {
  document.querySelectorAll(".actual").forEach(el => {
    el.classList.remove("actual");
    el.querySelector("div:last-child").innerHTML = "";
  });

  statesArr.forEach(s => {
    if (s.querySelector("div:first-child").innerHTML === "Technical Issue") {
      s.classList.add("actual");
      s.querySelector("div:last-child").innerHTML = symbol;
    }
  });

  const text = "Technical Issue";
  statusDiv.innerHTML = text;
  ch.innerHTML = text;
  ch.className = "current-head-right early";

  const states = document.querySelector(".states");
  states.style.display = "none";

  // Update Backend
  fetch(`${API_URL}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: text })
  }).catch(e => console.error(e));
});
