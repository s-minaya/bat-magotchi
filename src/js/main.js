"use strict";

// SECCIÓN DE QUERY-SELECTOR
const hearts = document.querySelectorAll(".heart");
const heartStates = {
  full: "/images/Full-heart.png",
  half: "/images/Half-heart.png",
  empty: "/images/Empty-heart.png",
};

// SECCIÓN DE DATOS
const intervalTime = 10000; //Cada 10 seg

let currentHeartIndex = hearts.length - 1; //Empezamos por el último corazón
let currentState = 0; // 0 = lleno, 1 = medio, 2 = vacío

// SECCIÓN DE FUNCIONES
function degradeHeart() {
  if (currentHeartIndex < 0) {
    clearInterval(heartInterval);
    return;
  }

  const heart = hearts[currentHeartIndex];

  if (currentState === 0) {
    heart.src = heartStates.half;
    currentState = 1;
  } else if (currentState === 1) {
    heart.src = heartStates.empty;
    currentState = 2;
  } else {
    currentHeartIndex--;
    currentState = 0;
    degradeHeart();
  }
}
const heartInterval = setInterval(degradeHeart, intervalTime);

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
