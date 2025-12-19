"use strict";

// ======================= // SELECTORES // =======================

const startBtn = document.querySelector("#startAudio");
const pauseBtn = document.querySelector("#pauseGame");
const intro = document.querySelector(".js_intro");
const introStart = document.querySelector("#introStart");

// Corazones
const hearts = document.querySelectorAll(".js_heart");

// Murciélago
const bat = document.querySelector(".js_bat");

// Comida
const foodBtns = document.querySelectorAll(".js_foodBtn");

// ======================= // CONSTANTES Y CONFIGURACIÓN // =======================

// Estados gráficos de los corazones
// 0: lleno | 1: medio | 2: vacío
const heartStates = ["heart--full", "heart--half", "heart--empty"];

// Estados gráficos del murciélago
const batStates = {
  normal: "bat--normal",
  sad: "bat--sad",
  hungry: "bat--hungry",
  dead: "bat--dead",
  eating: "bat--eating",
  love: "bat--love",
  no: "bat--no",
  paused: "bat--paused",
};

// Intervalo de pérdida de vida
const intervalTime = 10000; // 10 segundos
const EAT_DURATION = 2100;
const REACTION_DURATION = 1000;

// ======================= // ESTADO DEL JUEGO // =======================

// Índice del corazón actual (empezamos por el último)
let currentHeartIndex = hearts.length - 1;

// Estado actual del corazón
// 0: lleno | 1: medio | 2: vacío
let currentState = 0;

// Número total de corazones completamente vacíos
let emptyHeartsCount = 0;

// Temporizador de pérdida de vida
let heartInterval = null;

// Pausar el juego
let isPaused = false;
// ======================= // AUDIO // =======================

const soundEffect = new Audio("/sounds/heart-down.mp3");
const bgMusic = new Audio("/sounds/background.ogg");
const gameStartSound = new Audio("/sounds/game-start.mp3");

bgMusic.loop = true;
bgMusic.volume = 0.2;

// ======================= // FUNCIONES DE UTILIDAD // =======================

// Cambia el estado visual de un corazón
function setHeartState(heart, stateIndex) {
  heart.classList.remove("heart--full", "heart--half", "heart--empty");
  heart.classList.add(heartStates[stateIndex]);
}

// Cambia el estado visual del murciélago
function setBat(state) {
  bat.classList.remove(
    "bat--normal",
    "bat--sad",
    "bat--hungry",
    "bat--dead",
    "bat--eating",
    "bat--love",
    "bat--no",
    "bat--paused"
  );
  bat.classList.add(state);
}

// Aplica una animación breve al corazón
function animateHeart(heartElement) {
  heartElement.classList.add("heart--anim");
  setTimeout(() => heartElement.classList.remove("heart--anim"), 300);
}

// Detiene temporalmente la pérdida de vida (por ejemplo, mientras come)
function pauseHearts() {
  clearInterval(heartInterval);
  heartInterval = null;
}

// Reanuda la pérdida de vida si no hay un temporizador activo
function resumeHearts() {
  if (!heartInterval) {
    heartInterval = setInterval(degradeHeart, intervalTime);
  }
}

// Permite crear pausas usando async/await
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Pausar/reanudar juego
function pauseGame() {
  if (isPaused) return;

  isPaused = true;
  pauseHearts();
  setBat(batStates.paused);
  toggleFoodButtons(true);
}
// Desactivar botones cuando pausado
function toggleFoodButtons(disabled) {
  foodBtns.forEach((btn) => {
    btn.style.pointerEvents = disabled ? "none" : "auto";
    btn.style.opacity = disabled ? "0.4" : "1";
  });
}

function resumeGame() {
  if (!isPaused) return;

  isPaused = false;
  setBat(calculateBatState());
  resumeHearts();
  toggleFoodButtons(false);
  pauseHearts();
  resumeHearts();
}

// ======================= // LÓGICA DEL JUEGO // =======================

// Reduce progresivamente la vida del murciélago
function degradeHeart() {
  if (isPaused) return;
  if (currentHeartIndex < 0) return;

  const heart = hearts[currentHeartIndex];

  // Corazón lleno → medio
  if (currentState === 0) {
    setHeartState(heart, 1);
    animateHeart(heart);
    soundEffect.play();
    currentState = 1;

    // Corazón medio → vacío
  } else if (currentState === 1) {
    setHeartState(heart, 2);
    animateHeart(heart);
    soundEffect.play();
    currentState = 2;

    emptyHeartsCount++;

    // Si todos los corazones están vacíos, el murciélago muere
    if (emptyHeartsCount >= hearts.length) {
      setBat(batStates.dead);
      bgMusic.pause();
      bgMusic.src = "/sounds/game-over.mp3";
      bgMusic.play();
    } else {
      applyBatState();
    }

    // Pasamos al siguiente corazón (el de la izquierda)
  } else {
    currentHeartIndex--;
    currentState = 0;
    degradeHeart();
  }
}
function loseOneHeart() {
  // Forzamos una degradación inmediata
  degradeHeart();
}

function gainOneHeart() {
  // Si ya está todo lleno, no hacemos nada
  if (emptyHeartsCount === 0 && currentState === 0) return;

  // Si estamos en un corazón vacío
  if (currentState === 2) {
    setHeartState(hearts[currentHeartIndex], 1);
    currentState = 1;
    emptyHeartsCount--;
  }
  // Si estamos en medio
  else if (currentState === 1) {
    setHeartState(hearts[currentHeartIndex], 0);
    currentState = 0;
  }
  // Si el corazón actual está lleno, pasamos al siguiente
  else {
    currentHeartIndex++;
    currentState = 2;
    gainOneHeart();
    return;
  }

  applyBatState();
}

function restoreAllHearts() {
  hearts.forEach((heart) => setHeartState(heart, 0));
  currentHeartIndex = hearts.length - 1;
  currentState = 0;
  emptyHeartsCount = 0;
  applyBatState();
}
function isFullHealth() {
  return emptyHeartsCount === 0 && currentState === 0;
}

// Calcula el estado emocional del murciélago según la vida restante
function calculateBatState() {
  if (emptyHeartsCount >= hearts.length) return batStates.dead;
  if (emptyHeartsCount === 2) return batStates.hungry;
  if (emptyHeartsCount === 1) return batStates.sad;
  return batStates.normal;
}
function willGarlicKill() {
  // Último corazón y está en medio (va a pasar a vacío)
  return emptyHeartsCount === hearts.length - 1 && currentState === 1;
}

// Aplica el estado emocional si el murciélago no está ocupado
function applyBatState() {
  if (bat.dataset.busy === "true") return;
  setBat(calculateBatState());
}

// Gestiona toda la secuencia cuando el jugador da comida
async function handleFood(food) {
  if (isPaused) return;
  if (bat.dataset.busy === "true") return;
  if (calculateBatState() === batStates.dead) return;
  // No se puede dar comida si los corazones están llenos
  if (isFullHealth() && (food === "melon" || food === "moth")) {
    bat.dataset.busy = "true";
    pauseHearts();

    setBat(batStates.no);
    await sleep(REACTION_DURATION);

    setBat(calculateBatState());
    bat.dataset.busy = "false";
    resumeHearts();
    return;
  }

  bat.dataset.busy = "true";
  pauseHearts();
  // Caso especial: ajo que mata
  if (food === "ajo" && willGarlicKill()) {
    loseOneHeart(); // provoca la muerte
    bat.dataset.busy = "false";
    return; // SALIMOS sin animaciones
  }

  // 1. Comer
  setBat(batStates.eating);
  await sleep(EAT_DURATION);

  // 2. Reacción según la comida
  if (food === "ajo") {
    loseOneHeart();
    setBat(batStates.no);
    await sleep(REACTION_DURATION);
  } else if (food === "melon") {
    gainOneHeart();
  } else {
    restoreAllHearts();
    setBat(batStates.love);
    await sleep(REACTION_DURATION);
  }

  // 3. Volver al estado real
  setBat(calculateBatState());
  bat.dataset.busy = "false";
  resumeHearts();
}

// ======================= // MANEJADORES DE EVENTOS // =======================

// Botón de música
startBtn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;

startBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    startBtn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
  } else {
    bgMusic.pause();
    startBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
  }
});

// Botón de inicio del juego
introStart.addEventListener("click", () => {
  intro.classList.add("intro--closing");

  gameStartSound.volume = 0.5;
  gameStartSound.play();

  gameStartSound.addEventListener("ended", () => bgMusic.play(), {
    once: true,
  });

  intro.addEventListener(
    "animationend",
    () => {
      intro.style.display = "none";
      heartInterval = setInterval(degradeHeart, intervalTime);
    },
    { once: true }
  );
});

// Botón de pausar juego

pauseBtn.textContent = "⏸";

pauseBtn.addEventListener("click", () => {
  if (isPaused) {
    resumeGame();
    pauseBtn.textContent = "⏸";
  } else {
    pauseGame();
    pauseBtn.textContent = "▶";
  }
});

// Botones de comida
foodBtns.forEach((button) => {
  button.addEventListener("click", () => {
    handleFood(button.dataset.food);
  });
});
