/**
 * Coin Flip — script.js
 */

// ── State ──────────────────────────────────────────────────────
const state = {
  history: [],
  isFlipping: false,
  lastResult: null,
};

// ── DOM References ─────────────────────────────────────────────
const coin          = document.getElementById('coin');
const flipBtn       = document.getElementById('flip-btn');
const speakBtn      = document.getElementById('speak-btn');
const lastResultEl  = document.getElementById('last-result');
const headsPctEl    = document.getElementById('heads-pct');
const tailsPctEl    = document.getElementById('tails-pct');

const FLIP_MS = 700; // Must match --flip-duration in style.css

// ── Flip ───────────────────────────────────────────────────────
function flip() {
  if (state.isFlipping) return;
  state.isFlipping = true;
  flipBtn.disabled = true;

  const result = Math.random() < 0.5 ? 'H' : 'T';
  const fullResult = result === 'H' ? 'Heads' : 'Tails';

  coin.classList.remove('flipping-heads', 'flipping-tails');
  coin.style.transform = '';
  void coin.offsetWidth;

  coin.classList.add(result === 'H' ? 'flipping-heads' : 'flipping-tails');

  setTimeout(() => {
    coin.classList.remove('flipping-heads', 'flipping-tails');
    coin.style.transform = result === 'H' ? 'rotateY(0deg)' : 'rotateY(180deg)';

    state.history.push(result);
    state.lastResult = fullResult;
    updateStats();

    state.isFlipping = false;
    flipBtn.disabled = false;
  }, FLIP_MS);
}

// ── Stats ──────────────────────────────────────────────────────
function updateStats() {
  const { history } = state;

  // Most recent result as a single pill
  if (history.length === 0) {
    lastResultEl.textContent = '—';
  } else {
    const latest = history[history.length - 1];
    lastResultEl.innerHTML = `<span class="pill pill-${latest}">${latest}</span>`;
  }

  // Percentages
  if (history.length === 0) {
    headsPctEl.textContent = '—';
    tailsPctEl.textContent = '—';
  } else {
    const heads = history.filter(r => r === 'H').length;
    const tails = history.length - heads;
    headsPctEl.textContent = `${((heads / history.length) * 100).toFixed(1)}%`;
    tailsPctEl.textContent = `${((tails / history.length) * 100).toFixed(1)}%`;
  }
}

// ── Text-to-Speech ─────────────────────────────────────────────
function speakResult() {
  const text = state.lastResult
    ? `${state.lastResult}!`
    : 'No result yet. Press Flip to get started.';
  speak(text);
}

function speak(text) {
  if (!('speechSynthesis' in window)) {
    alert('Sorry, your browser does not support text-to-speech.');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}

// ── Event Listeners ────────────────────────────────────────────
flipBtn.addEventListener('click', flip);
speakBtn.addEventListener('click', speakResult);

document.addEventListener('keydown', (e) => {
  if ((e.code === 'Space' || e.code === 'Enter') && e.target === document.body) {
    e.preventDefault();
    flip();
  }
});

// ── Init ───────────────────────────────────────────────────────
updateStats();