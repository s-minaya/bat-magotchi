"use strict";

// SECCIÓN DE QUERY-SELECTOR
const startBtn = document.querySelector("#startAudio");

// Corazones
const hearts = document.querySelectorAll(".heart");
const heartStates = {
  full: "/images/Full-heart.png",
  half: "/images/Half-heart.png",
  empty: "/images/Empty-heart.png",
};

// Murciélago
const bat = document.querySelector(".js_bat");
const batStates = {
  normal: "images/Happy-bat.gif",
  sad: "images/Sad-bat.gif",
  hungry: "images/Hungry-bat.gif",
  dead: "images/Dead-bat.gif",
};

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

// Intervalo que controla la pérdida de vida
const heartInterval = setInterval(degradeHeart, intervalTime);

function updateBatState() {
  if (emptyHeartsCount === 1) {
    bat.src = batStates.sad;
  } else if (emptyHeartsCount === 2) {
    bat.src = batStates.hungry;
  } else if (emptyHeartsCount >= hearts.length) {
    bat.src = batStates.dead;
  }
}

// SECCIÓN DE FUNCIONES DE EVENTOS

startBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    startBtn.textContent = "⏸ Parar";
  } else {
    bgMusic.pause();
    startBtn.textContent = "▶ Empezar";
  }
});

// SECCIÓN DE ACCIONES AL CARGAR LA PÁGINA
