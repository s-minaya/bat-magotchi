"use strict";

// ======================= // SELECTORES // =======================

const startBtn = document.querySelector("#startAudio");
const intro = document.querySelector(".js_intro");
const introStart = document.querySelector("#introStart");

// Game Over
const gameoverScreen = document.querySelector(".js_gameover");
const gameoverRestart = document.querySelector("#gameoverRestart");

// Corazones
const hearts = document.querySelectorAll(".js_heart");

// Murciélago
const bat = document.querySelector(".js_bat");

// Comida
const foodBtns = document.querySelectorAll(".js_foodBtn");
const foodsContainer = document.querySelector(".tamagotchi__foods");

// Controles Game Boy
const dpadUp = document.querySelector(".js_dpad-up");
const dpadDown = document.querySelector(".js_dpad-down");
const dpadLeft = document.querySelector(".js_dpad-left");
const dpadRight = document.querySelector(".js_dpad-right");
const btnA = document.querySelector(".js_btn-a");
const btnB = document.querySelector(".js_btn-b");
const selectBtn = document.querySelector(".js_select-btn");
const resetBtn = document.querySelector(".js_reset-btn");

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

// Estado del menú de comida
let foodMenuVisible = false;
let selectedFoodIndex = 0;

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
    "bat--paused",
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

// Verificar si el tamagotchi está muerto
function isDead() {
  return emptyHeartsCount >= hearts.length;
}

// Mostrar pantalla de Game Over
function showGameOver() {
  gameoverScreen.classList.add("gameover--visible");
}

// Pausar/reanudar juego
function pauseGame() {
  // No se puede pausar si está muerto
  if (isPaused || isDead()) return;

  isPaused = true;
  pauseHearts();
  setBat(batStates.paused);
  toggleFoodButtons(true);
  hideFoodMenu();
}

// Desactivar botones cuando pausado
function toggleFoodButtons(disabled) {
  foodBtns.forEach((btn) => {
    btn.style.pointerEvents = disabled ? "none" : "auto";
    btn.style.opacity = disabled ? "0.4" : "1";
  });
}

function resumeGame() {
  // No se puede reanudar si está muerto
  if (!isPaused || isDead()) return;

  isPaused = false;
  setBat(calculateBatState());
  resumeHearts();
  toggleFoodButtons(false);
  pauseHearts();
  resumeHearts();
}

// Reiniciar el juego completamente
function resetGame() {
  // Detener todo
  pauseHearts();
  hideFoodMenu();

  // Ocultar pantalla de Game Over si está visible
  gameoverScreen.classList.remove("gameover--visible");

  // Resetear estado del juego
  currentHeartIndex = hearts.length - 1;
  currentState = 0;
  emptyHeartsCount = 0;
  isPaused = false;

  // Restaurar corazones visualmente
  hearts.forEach((heart) => setHeartState(heart, 0));

  // Restaurar murciélago
  setBat(batStates.normal);
  bat.dataset.busy = "false";

  // Reiniciar música
  bgMusic.pause();
  bgMusic.currentTime = 0;
  bgMusic.src = "/sounds/background.ogg";
  if (!bgMusic.paused || startBtn.innerHTML.includes("volume-xmark")) {
    bgMusic.play();
  }

  // Reiniciar temporizador
  resumeHearts();
}

// ======================= // FUNCIONES DE MENÚ DE COMIDA // =======================

function showFoodMenu() {
  if (foodMenuVisible || isPaused || isDead()) return;
  foodMenuVisible = true;
  foodsContainer.classList.add("tamagotchi__foods--visible");
  selectedFoodIndex = 0;
  updateFoodSelection();
}

function hideFoodMenu() {
  foodMenuVisible = false;
  foodsContainer.classList.remove("tamagotchi__foods--visible");
  foodBtns.forEach((btn) =>
    btn.classList.remove("tamagotchi__food-button--selected"),
  );
}

function updateFoodSelection() {
  foodBtns.forEach((btn, index) => {
    if (index === selectedFoodIndex) {
      btn.classList.add("tamagotchi__food-button--selected");
    } else {
      btn.classList.remove("tamagotchi__food-button--selected");
    }
  });
}

function moveFoodSelectionLeft() {
  if (!foodMenuVisible) return;
  selectedFoodIndex =
    (selectedFoodIndex - 1 + foodBtns.length) % foodBtns.length;
  updateFoodSelection();
}

function moveFoodSelectionRight() {
  if (!foodMenuVisible) return;
  selectedFoodIndex = (selectedFoodIndex + 1) % foodBtns.length;
  updateFoodSelection();
}

function confirmFoodSelection() {
  if (!foodMenuVisible) return;
  const selectedFood = foodBtns[selectedFoodIndex].dataset.food;
  handleFood(selectedFood);
  hideFoodMenu();
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

      // Mostrar pantalla de Game Over después de un breve delay
      setTimeout(() => {
        showGameOver();
      }, 1500);
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
      setBat(batStates.normal);
      heartInterval = setInterval(degradeHeart, intervalTime);
    },
    { once: true },
  );
});

// Botón de reinicio desde Game Over
gameoverRestart.addEventListener("click", () => {
  resetGame();
});

// Botones de comida (click directo aún funciona)
foodBtns.forEach((button) => {
  button.addEventListener("click", () => {
    if (!foodMenuVisible) return;
    handleFood(button.dataset.food);
    hideFoodMenu();
  });
});

// ======================= // CONTROLES GAME BOY // =======================

// D-Pad Up - Mostrar menú de comida
dpadUp.addEventListener("click", () => {
  showFoodMenu();
});

// D-Pad Down - Ocultar menú de comida
dpadDown.addEventListener("click", () => {
  hideFoodMenu();
});

// D-Pad Left - Mover selección a la izquierda
dpadLeft.addEventListener("click", () => {
  moveFoodSelectionLeft();
});

// D-Pad Right - Mover selección a la derecha
dpadRight.addEventListener("click", () => {
  moveFoodSelectionRight();
});

// Botón A - Confirmar selección
btnA.addEventListener("click", () => {
  confirmFoodSelection();
});

// Botón B - Cancelar/Ocultar menú
btnB.addEventListener("click", () => {
  hideFoodMenu();
});

// Botón SELECT - Toggle pausa (solo si no está muerto)
selectBtn.addEventListener("click", () => {
  // Verificar que no está muerto antes de pausar/reanudar
  if (isDead()) return;

  if (isPaused) {
    resumeGame();
  } else {
    pauseGame();
  }
});

// Botón RESET - Reiniciar el juego
resetBtn.addEventListener("click", () => {
  if (
    confirm(
      "¿Estás seguro de que quieres reiniciar el juego? Se perderá todo el progreso.",
    )
  ) {
    resetGame();
  }
});

// ======================= // CONTROLES DE TECLADO // =======================

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "W":
      e.preventDefault();
      showFoodMenu();
      break;
    case "ArrowDown":
    case "s":
    case "S":
      e.preventDefault();
      hideFoodMenu();
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      e.preventDefault();
      moveFoodSelectionLeft();
      break;
    case "ArrowRight":
    case "d":
    case "D":
      e.preventDefault();
      moveFoodSelectionRight();
      break;
    case "Enter":
    case " ":
      e.preventDefault();
      confirmFoodSelection();
      break;
    case "Escape":
    case "Backspace":
      e.preventDefault();
      hideFoodMenu();
      break;
    case "p":
    case "P":
      e.preventDefault();
      // Solo permitir pausar/reanudar si no está muerto
      if (isDead()) return;
      if (isPaused) {
        resumeGame();
      } else {
        pauseGame();
      }
      break;
    case "r":
    case "R":
      e.preventDefault();
      if (
        confirm(
          "¿Estás seguro de que quieres reiniciar el juego? Se perderá todo el progreso.",
        )
      ) {
        resetGame();
      }
      break;
  }
});
