// ====== CONFIG ======
const UNLOCK_CODE = "makeitready"; // change this to private code

const ROTATE = true;

const STATUS_LINES = [
  "Not ready yet.",
  "This one's for you.",
  "Some things are worth waiting for.",
  "🖤"
];

let index = 0;

setInterval(() => {
  statusLine.textContent = lines[index % lines.length];
  index++;
}, 9000);

// ====== STATE ======
const qs = new URLSearchParams(window.location.search);
const keyFromUrl = qs.get("key");
const isUnlockedStored = localStorage.getItem("unlocked") === "true";

const lockedEl = document.getElementById("locked");
const unlockedEl = document.getElementById("unlocked");
const statusLineEl = document.getElementById("statusLine");
const microTimeEl = document.getElementById("microTime");
const relockBtn = document.getElementById("relockBtn");

// ====== HELPERS ======
function showLocked() {
  lockedEl.style.display = "";
  unlockedEl.style.display = "none";
  lockedEl.setAttribute("aria-hidden", "false");
  unlockedEl.setAttribute("aria-hidden", "true");
}

function showUnlocked() {
  lockedEl.style.display = "none";
  unlockedEl.style.display = "";
  lockedEl.setAttribute("aria-hidden", "true");
  unlockedEl.setAttribute("aria-hidden", "false");
}

function setUnlocked() {
  localStorage.setItem("unlocked", "true");
  showUnlocked();
  // clean URL 
  if (window.location.search.includes("key=")) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

function setLocked() {
  localStorage.removeItem("unlocked");
  showLocked();
}

function setMicroTime() {
  const el = document.getElementById("microTime");
  if (!el) return; // prevents crash 

  const now = new Date();
  const fmt = new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" });
  el.textContent = fmt.format(now);
}

function rotateStatusLines() {
  if (!ROTATE) return;

  let i = 0;
  setInterval(() => {
    i = (i + 1) % STATUS_LINES.length;

    // gentle slide
    statusLineEl.style.opacity = "0";
    statusLineEl.style.transform = "translateY(4px)";

    setTimeout(() => {
      statusLineEl.textContent = STATUS_LINES[i];
      statusLineEl.style.opacity = "1";
      statusLineEl.style.transform = "translateY(0)";
    }, 260);
  }, 5500);
}
function applyDateTheme() {
  const body = document.body;
  const badge = document.getElementById("specialBadge");

  // Use the date when opened
  const now = new Date();
  const m = now.getMonth();     // 0-11
  const d = now.getDate();      // 1-31
  const y = now.getFullYear();  // 2025, 2026, ...

  // Clear classes
  body.classList.remove(
    "season-winter","season-spring","season-summer","season-fall",
    "special","special-valentine","special-anniversary","special-birthday"
  );

  // --- Season by month ---
  // Winter: Dec–Feb | Spring: Mar–May | Summer: Jun–Aug | Fall: Sep–Nov
  if (m === 11 || m <= 1) body.classList.add("season-winter");
  else if (m >= 2 && m <= 4) body.classList.add("season-spring");
  else if (m >= 5 && m <= 7) body.classList.add("season-summer");
  else body.classList.add("season-fall");

  // --- Special days ---
  // Valentine’s Day: Feb 14, 2026
  if (y === 2026 && m === 1 && d === 14) {
    body.classList.add("special", "special-valentine");
    if (badge) badge.textContent = "Happy Valentine’s Day";
    return;
  }

  // Anniversary: July 21, 2026
  if (y === 2026 && m === 6 && d === 21) {
    body.classList.add("special", "special-anniversary");
    if (badge) badge.textContent = "Happy Anniversary";
    return;
  }

  // Her birthday: July 28, 2026
  if (y === 2026 && m === 6 && d === 28) {
    body.classList.add("special", "special-birthday");
    if (badge) badge.textContent = "Happy Birthday";
    return;
  }

  // Not a special day → hide badge
  if (badge) badge.textContent = "";
}

// ====== INIT ======
(function init() {
  // Decide unlock
  if (keyFromUrl && keyFromUrl === UNLOCK_CODE) {
    setUnlocked();
  } else if (isUnlockedStored) {
    showUnlocked();
  } else {
    showLocked();
  }
  
  applyDateTheme();

  setMicroTime();
  rotateStatusLines();

  if (relockBtn) {
    relockBtn.addEventListener("click", () => {
      setLocked();
    });
  }
})();
