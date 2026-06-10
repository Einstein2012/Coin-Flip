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
const coin         = document.getElementById('coin');
const flipBtn      = document.getElementById('flip-btn');
const speakBtn     = document.getElementById('speak-btn');
const lastResultEl = document.getElementById('last-result');
const headsPctEl   = document.getElementById('heads-pct');
const tailsPctEl   = document.getElementById('tails-pct');

const FLIP_MS = 700;

// ── Flip ───────────────────────────────────────────────────────
function flip() {
  if (state.isFlipping) return;
  state.isFlipping = true;
  flipBtn.disabled = true;

  const result = Math.random() < 0.5 ? 'H' : 'T';
  const fullResult = result === 'H' ? 'Heads' : 'Tails';

  // Remove any previous state
  coin.classList.remove('flipping', 'show-tails');
  void coin.offsetWidth; // force reflow

  // Trigger flip animation
  coin.classList.add('flipping');

  setTimeout(() => {
    coin.classList.remove('flipping');

    // Show correct face
    if (result === 'T') {
      coin.classList.add('show-tails');
    } else {
      coin.classList.remove('show-tails');
    }

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

  if (history.length === 0) {
    lastResultEl.textContent = '—';
    headsPctEl.textContent = '—';
    tailsPctEl.textContent = '—';
  } else {
    const latest = history[history.length - 1];
    lastResultEl.innerHTML = `<span class="pill pill-${latest}">${latest}</span>`;

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