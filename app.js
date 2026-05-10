const STORAGE_KEY = 'mcg_progress';

// dayIndex 0=Mon … 6=Sun  (JS: 0=Sun, adjust)
const todayIndex = (() => {
  const js = new Date().getDay(); // 0 Sun … 6 Sat
  return js === 0 ? 6 : js - 1;  // remap to Mon=0 … Sun=6
})();

// Load / save helpers
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let progress = loadProgress();

// ── Build UI ──────────────────────────────────────────
function buildApp() {
  const container = document.getElementById('days');
  container.innerHTML = '';

  workouts.forEach((day, dayIdx) => {
    if (day.rest) {
      container.appendChild(buildRestCard(day, dayIdx));
    } else {
      container.appendChild(buildDayCard(day, dayIdx));
    }
  });

  renderWeekBar();
}

function buildRestCard(day, dayIdx) {
  const card = document.createElement('div');
  card.className = 'rest-card' + (dayIdx === todayIndex ? ' is-today' : '');
  card.innerHTML = `
    <div class="day-title">${day.day}</div>
    <p>${day.tip}</p>
  `;
  return card;
}

function buildDayCard(day, dayIdx) {
  const key = `day_${dayIdx}`;
  if (!progress[key]) progress[key] = {};

  const card = document.createElement('div');
  card.className = 'day-card';
  if (dayIdx === todayIndex) card.classList.add('is-today');

  const isComplete = day.exercises.every((_, i) => progress[key][i]);
  if (isComplete) card.classList.add('is-complete');

  const todayBadge = dayIdx === todayIndex ? '<span class="today-badge">HOY</span>' : '';

  card.innerHTML = `
    <div class="day-header">
      <div class="day-title">${day.day}${todayBadge}</div>
      <div class="day-progress">
        <span class="day-count">${countDone(dayIdx)} / ${day.exercises.length}</span>
        <div class="day-bar-bg">
          <div class="day-bar-fill" style="width:${pct(dayIdx, day)}%"></div>
        </div>
        <span class="day-complete-msg">✅ ¡Completado!</span>
        <button class="reset-day-btn" title="Reiniciar día" aria-label="Reiniciar ${day.day}">↺</button>
      </div>
    </div>
  `;

  const exerciseList = document.createElement('div');
  day.exercises.forEach((ex, exIdx) => {
    exerciseList.appendChild(buildExerciseRow(ex, dayIdx, exIdx, day));
  });
  card.appendChild(exerciseList);

  card.querySelector('.reset-day-btn').addEventListener('click', () => {
    progress[`day_${dayIdx}`] = {};
    saveProgress(progress);
    buildApp();
  });

  return card;
}

function buildExerciseRow(ex, dayIdx, exIdx, day) {
  const key = `day_${dayIdx}`;
  const checked = !!progress[key][exIdx];

  const row = document.createElement('div');
  row.className = 'exercise' + (checked ? ' done' : '');

  const checkId = `chk_${dayIdx}_${exIdx}`;
  row.innerHTML = `
    <div class="exercise-left">
      <span class="exercise-name">${ex.name}</span>
      <div class="exercise-meta">
        <span class="exercise-sets">${ex.sets}</span>
        <a class="video-link" href="${ex.video}" target="_blank" rel="noopener noreferrer">🎥 Ver vídeo</a>
      </div>
    </div>
    <input type="checkbox" class="exercise-check" id="${checkId}"
           aria-label="${ex.name}" ${checked ? 'checked' : ''} />
  `;

  row.querySelector('.exercise-check').addEventListener('change', (e) => {
    progress[key][exIdx] = e.target.checked;
    saveProgress(progress);
    buildApp();
  });

  return row;
}

// ── Progress helpers ──────────────────────────────────
function countDone(dayIdx) {
  const key = `day_${dayIdx}`;
  return Object.values(progress[key] || {}).filter(Boolean).length;
}

function pct(dayIdx, day) {
  const total = day.exercises.length;
  if (!total) return 0;
  return Math.round((countDone(dayIdx) / total) * 100);
}

function renderWeekBar() {
  let total = 0, done = 0;
  workouts.forEach((day, i) => {
    if (day.rest) return;
    total += day.exercises.length;
    done  += countDone(i);
  });
  document.getElementById('weekCount').textContent = `${done} / ${total}`;
  document.getElementById('weekBarFill').style.width = total ? `${Math.round((done/total)*100)}%` : '0%';
}

// ── Global reset ──────────────────────────────────────
document.getElementById('resetAllBtn').addEventListener('click', () => {
  if (confirm('¿Reiniciar todo el progreso de la semana?')) {
    progress = {};
    saveProgress(progress);
    buildApp();
  }
});

// ── Init ─────────────────────────────────────────────
buildApp();
