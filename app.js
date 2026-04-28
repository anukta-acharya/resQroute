// ---- CLOCK ----
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('en-IN', { hour12: false });
  const date = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const el = document.getElementById('clock');
  if (el) el.textContent = `${date}  ${time}`;
}
updateClock();
setInterval(updateClock, 1000);

// ---- LOADING MESSAGES ----
const loadingMessages = [
  "Initializing AI response engine...",
  "Analyzing disaster parameters...",
  "Calculating evacuation routes...",
  "Scanning resource databases...",
  "Generating multilingual alerts...",
  "Preparing emergency protocol..."
];

let loadingInterval;

function startLoadingCycle() {
  let i = 0;
  const el = document.getElementById('loading-sub');
  if (el) el.textContent = loadingMessages[0];
  loadingInterval = setInterval(() => {
    i = (i + 1) % loadingMessages.length;
    if (el) el.textContent = loadingMessages[i];
  }, 700);
}

function stopLoadingCycle() {
  clearInterval(loadingInterval);
}

// ---- RISK CONFIG ----
const riskConfig = {
  CRITICAL: { class: 'risk-critical', icon: '🚨', barColor: '#ff1744', barWidth: '100%' },
  HIGH:     { class: 'risk-high',     icon: '⚠️',  barColor: '#ff8c00', barWidth: '75%'  },
  MEDIUM:   { class: 'risk-medium',   icon: '⚡',  barColor: '#ffd700', barWidth: '50%'  },
  LOW:      { class: 'risk-low',      icon: '✅',  barColor: '#00e676', barWidth: '25%'  }
};

// ---- COPY TEXT ----
function copyText(id) {
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector(`#${id} ~ .copy-btn`) ||
                document.querySelector(`.alert-block:has(#${id}) .copy-btn`);
    if (btn) {
      btn.textContent = 'COPIED ✓';
      setTimeout(() => btn.textContent = 'COPY', 2000);
    }
  });
}

// ---- MAIN ANALYZE ----
async function analyze() {
  const disaster = document.getElementById("disaster").value;
  const location = document.getElementById("location").value.trim();

  if (!disaster || !location) {
    shakeInput(!disaster ? 'disaster' : 'location');
    return;
  }

  const btn = document.getElementById("btn");
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = 'ANALYZING...';

  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("result").classList.add("hidden");
  startLoadingCycle();

  try {
    const response = await fetch("/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disaster, location })
    });

    const result = await response.json();

    if (result.error) {
      showError(result.error);
      return;
    }

    renderResult(result);

  } catch (err) {
    showError("Connection failed. Please try again.");
    console.error(err);
  } finally {
    stopLoadingCycle();
    document.getElementById("loading").classList.add("hidden");
    btn.disabled = false;
    btn.querySelector('.btn-text').textContent = 'GENERATE RESPONSE PLAN';
  }
}

// ---- RENDER RESULT ----
function renderResult(result) {
  const level = result.risk_level.toUpperCase();
  const config = riskConfig[level] || riskConfig.HIGH;

  // Risk banner
  document.getElementById("risk-icon").textContent = config.icon;
  const riskEl = document.getElementById("risk-level");
  riskEl.textContent = level;
  riskEl.className = `risk-level ${config.class}`;
  document.getElementById("risk-summary").textContent = result.risk_summary;

  // Risk bar animate
  const bar = document.getElementById("risk-bar");
  bar.style.background = config.barColor;
  bar.style.boxShadow = `0 0 12px ${config.barColor}`;
  setTimeout(() => bar.style.width = config.barWidth, 100);

  // Evacuation steps
  const evacEl = document.getElementById("evacuation");
  evacEl.innerHTML = result.evacuation_steps
    .map(s => `<li>${s}</li>`).join("");

  // Resources
  const resEl = document.getElementById("resources");
  resEl.innerHTML = result.nearest_resources
    .map(r => `<li>${r}</li>`).join("");

  // Alerts
  document.getElementById("alert-en").textContent = result.alert_english;
  document.getElementById("alert-hi").textContent = result.alert_hindi;

  // Show result with animation
  const resultEl = document.getElementById("result");
  resultEl.classList.remove("hidden");
  resultEl.style.opacity = 0;
  resultEl.style.transform = 'translateY(20px)';
  requestAnimationFrame(() => {
    resultEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    resultEl.style.opacity = 1;
    resultEl.style.transform = 'translateY(0)';
  });

  // Scroll to result
  setTimeout(() => resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

// ---- HELPERS ----
function shakeInput(id) {
  const el = document.getElementById(id);
  el.style.borderColor = 'var(--red)';
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => {
    el.style.animation = '';
    el.style.borderColor = '';
  }, 400);
}

function showError(msg) {
  alert('⚠ ' + msg);
}

const style = document.createElement('style');
style.textContent = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}`;
document.head.appendChild(style);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') analyze();
});