"use strict";

// SECCIÓN DE QUERY-SELECTOR
const startBtn = document.querySelector("#startAudio");

// Intro
const intro = document.querySelector(".js_intro");
const introStart = document.querySelector("#introStart");

// Corazones
const hearts = document.querySelectorAll(".js_heart");
const heartStates = {
  full: "/images/Full-heart.png",
  half: "/images/Half-heart.png",
  empty: "/images/Empty-heart.png",
};
let heartInterval = null;

// Murciélago
const bat = document.querySelector(".js_bat");
const batStates = {
  normal: "/images/Happy-bat.gif",
  sad: "/images/Sad-bat.gif",
  hungry: "/images/Hungry-bat.gif",
  dead: "/images/Dead-bat.gif",
};

// Comida
const foodBtns = document.querySelectorAll(".js_foodBtn");

// SECCIÓN DE DATOS
const intervalTime = 10000; //Tiempo entre degradaciones

let currentHeartIndex = hearts.length - 1; //Empezamos desde el último corazón
let currentState = 0; // 0 = lleno, 1 = medio, 2 = vacío
let emptyHeartsCount = 0;

// =======================
//       MÚSICA
// =======================

const soundEffect = new Audio("/sounds/heart-down.mp3");

const bgMusic = new Audio("/sounds/background.ogg");
bgMusic.loop = true;
bgMusic.volume = 0.2;

const gameStartSound = new Audio("/sounds/game-start.mp3");

// SECCIÓN DE FUNCIONES

// Efecto suave cuando un corazón cambia de estado
function animateHeart(heartElement) {
  heartElement.classList.add("heart--anim");

  setTimeout(() => {
    heartElement.classList.remove("heart--anim");
  }, 300);
}

// =======================
//   LÓGICA DE VIDA
// =======================

function degradeHeart() {
  // Si no quedan corazones por degradar...
  if (currentHeartIndex < 0) {
    clearInterval(heartInterval);
    return;
  }

  const heart = hearts[currentHeartIndex]; //Referencia al corazón actual

  // PASO 1 → lleno → medio
  if (currentState === 0) {
    heart.src = heartStates.half;
    animateHeart(heart);
    soundEffect.currentTime = 0;
    soundEffect.play();
    currentState = 1;

    // PASO 2 → medio → vacío
  } else if (currentState === 1) {
    heart.src = heartStates.empty;
    animateHeart(heart);
    soundEffect.currentTime = 0;
    soundEffect.play();
    currentState = 2;

    emptyHeartsCount++;

    // Si este corazón era el último que quedaba con vida:
    if (emptyHeartsCount >= hearts.length) {
      // Cambiar GIF del murciélago
      bat.src = batStates.dead;

      // Cambiar música
      bgMusic.pause();
      bgMusic.src = "/sounds/game-over.mp3";
      bgMusic.currentTime = 0;
      bgMusic.volume = 1.0;

      // reproducir la nueva música
      bgMusic.play().catch(() => {
        console.log("El navegador bloqueó el autoplay de la música de muerte.");
      });
    } else {
      updateBatState();
    }

    // PASO 3 → si ya está vacío → pasamos al corazón anterior
  } else {
    currentHeartIndex--;
    currentState = 0;
    degradeHeart();
  }
}

function updateBatState() {
  // Si está comiendo o en animación → no cambiar estado automático
  if (bat.dataset.busy === "true") return;

  if (emptyHeartsCount === 1) {
    bat.src = batStates.sad;
  } else if (emptyHeartsCount === 2) {
    bat.src = batStates.hungry;
  } else if (emptyHeartsCount >= hearts.length) {
    bat.src = batStates.dead;
  }
}

function getRealBatState() {
  if (emptyHeartsCount >= hearts.length) return batStates.dead;
  if (emptyHeartsCount === 2) return batStates.hungry;
  if (emptyHeartsCount === 1) return batStates.sad;
  return batStates.normal;
}

function handleFood(foodType) {
  if (bat.dataset.busy === "true") return;
  bat.dataset.busy = "true";

  let prevState = getRealBatState();

  // ANIMACIÓN 1 → Comiendo
  bat.src = "/images/Eating-bat.gif?rnd=" + Date.now();
  const eatingDuration = 1780;

  setTimeout(() => {
    if (foodType === "ajo") {
      bat.src = "/images/No-bat.gif?rnd=" + Date.now();

      setTimeout(() => {
        bat.src = getRealBatState();
        bat.dataset.busy = "false";
      }, 2000);
    } else if (foodType === "melon") {
      bat.src = getRealBatState();
      bat.dataset.busy = "false";
    } else if (foodType === "polilla") {
      bat.src = "/images/Love-this-food.gif?rnd=" + Date.now();

      setTimeout(() => {
        bat.src = getRealBatState();
        bat.dataset.busy = "false";
      }, 2000);
    }
  }, eatingDuration);
}

// SECCIÓN DE FUNCIONES DE EVENTOS

startBtn.textContent = "⏸ Parar música";

startBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    // ▷ Si estaba parada → reanudar
    bgMusic.play();
    startBtn.textContent = "⏸ Parar música";
    startBtn.classList.remove("is-paused");
  } else {
    // ⏸ Si estaba sonando → pausar
    bgMusic.pause();
    startBtn.textContent = "▶ Empezar música";
    startBtn.classList.add("is-paused");
  }
});

introStart.addEventListener("click", () => {
  // Animación para cerrar la intro
  intro.classList.add("intro--closing");

  // Reproducir sonido de inicio
  gameStartSound.volume = 0.5;
  gameStartSound.play().catch(() => console.log("Autoplay bloqueado"));

  // Reproducir bgMusic cuando termine el sonido de inicio
  gameStartSound.addEventListener(
    "ended",
    () => {
      bgMusic.play().catch(() => console.log("Autoplay bloqueado"));
    },
    { once: true }
  );

  // Empezar juego al cerrar la intro
  intro.addEventListener(
    "animationend",
    () => {
      intro.style.display = "none";
      heartInterval = setInterval(degradeHeart, intervalTime);
    },
    { once: true }
  );
});

foodBtns.forEach((button) => {
  const foodImg = button.querySelector("img");
  const foodType = foodImg.alt.toLowerCase();
  console.log(foodType);

  button.addEventListener("click", () => {
    handleFood(foodType);
  });
});

// SECCIÓN DE ACCIONES AL CARGAR LA PÁGINA
