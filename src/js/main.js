"use strict";

// SECCIÓN DE QUERY-SELECTOR

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
  //Si no quedan corazones por degradar...
  if (currentHeartIndex < 0) {
    clearInterval(heartInterval);
    return;
  }

  const heart = hearts[currentHeartIndex]; //Guardamos la posición de la imágen de cada corazón

  // PASO 1 → lleno → medio
  if (currentState === 0) {
    heart.src = heartStates.half;
    animateHeart(heart);
    currentState = 1;

    // PASO 2 → medio → vacío
  } else if (currentState === 1) {
    heart.src = heartStates.empty;
    animateHeart(heart);
    currentState = 2;
    emptyHeartsCount++;
    updateBatState();

    // PASO 3 → si ya está vacío, saltamos al siguiente corazón
  } else {
    currentHeartIndex--;
    currentState = 0;
    degradeHeart(); // se ejecuta inmediatamente, sin esperar los 10s
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
// Aquí van las funciones handler/manejadoras de eventos

// SECCIÓN DE EVENTOS
// Éstos son los eventos a los que reacciona la página
// Los más comunes son: click (en botones, enlaces), input (en ídem) y submit (en form)

// SECCIÓN DE ACCIONES AL CARGAR LA PÁGINA
// Este código se ejecutará cuando se carga la página
// Lo más común es:
//   - Pedir datos al servidor
//   - Pintar (render) elementos en la página
