# 🦇 Bat-magotchi

## 📖 Descripción

**Bat-magotchi** es un juego interactivo inspirado en los clásicos Tamagotchi, pero con un giro único: ¡cuidas de un adorable murciélago! El juego recrea la estética retro de las consolas portátiles Game Boy con una pantalla LCD monocromática verde y controles físicos.

Mantén vivo a tu murciélago alimentándolo con diferentes comidas antes de que sus corazones se vacíen. Pero ten cuidado: ¡no toda la comida es buena para él!

🎮 **[JUEGA AHORA - Demo en vivo](https://s-minaya.github.io/bat-magotchi/)**

## ✨ Características

- 🎨 **Diseño pixel-art retro** con estética Game Boy auténtica
- 💚 **Sistema de vida con corazones** (3 corazones, cada uno con estados: lleno, medio y vacío)
- 🍽️ **Tres tipos de comida** con diferentes efectos:
  - 🧄 **Ajo**: Daña a tu murciélago (¡los vampiros odian el ajo!)
  - 🍉 **Melón**: Restaura medio corazón
  - 🦋 **Polilla**: Restaura todos los corazones (¡su comida favorita!)
- 🎮 **Controles estilo Game Boy**: D-Pad y botones A/B
- ⌨️ **Soporte completo de teclado** (WASD, flechas, Enter, Escape)
- 🎵 **Música de fondo y efectos de sonido** con control de volumen
- ⏸️ **Sistema de pausa** (botón SELECT o tecla P)
- 🔄 **Función de reinicio** (botón RESET o tecla R)
- 💾 **Guardado automático** — tu progreso se conserva aunque cierres el navegador
- 💀 **Pantalla de Game Over** con opción de reintentar
- 📱 **Totalmente responsive** - Juega en móvil, tablet o escritorio
- 🎭 **Animaciones fluidas** y transiciones suaves
- ♿ **Accesible** con soporte para `prefers-reduced-motion`

## 🎬 Estados del Murciélago

El murciélago tiene múltiples estados emocionales según su salud:

| Estado            | Descripción                | Condición                  |
| ----------------- | -------------------------- | -------------------------- |
| 😊 **Feliz**      | Contento y saludable       | 3 corazones llenos         |
| 😔 **Triste**     | Necesita atención          | 1 corazón vacío            |
| 😫 **Hambriento** | ¡Necesita comida urgente!  | 2 corazones vacíos         |
| 🍽️ **Comiendo**   | Está disfrutando su comida | Durante la alimentación    |
| 😍 **Enamorado**  | ¡Le encantó la polilla!    | Después de comer polilla   |
| 🤢 **Rechazando** | No quiere comer más        | Corazones llenos o ajo     |
| 💀 **Muerto**     | Game Over                  | Todos los corazones vacíos |
| 😴 **Durmiendo**  | Juego en pausa             | Modo pausa activado        |

## 🎮 Controles

### 🕹️ Controles en Pantalla

- **D-Pad ↑**: Abrir menú de comida
- **D-Pad ↓**: Cerrar menú de comida
- **D-Pad ←/→**: Navegar entre opciones de comida
- **Botón A**: Confirmar selección
- **Botón B**: Cancelar/Cerrar menú
- **SELECT**: Pausar/Reanudar juego
- **RESET**: Reiniciar juego

### ⌨️ Atajos de Teclado

| Tecla                  | Acción                    |
| ---------------------- | ------------------------- |
| `W` / `↑`              | Abrir menú de comida      |
| `S` / `↓`              | Cerrar menú de comida     |
| `A` / `←`              | Mover selección izquierda |
| `D` / `→`              | Mover selección derecha   |
| `Enter` / `Space`      | Confirmar selección       |
| `Escape` / `Backspace` | Cancelar                  |
| `P`                    | Pausar/Reanudar           |
| `R`                    | Reiniciar juego           |

## 🛠️ Tecnologías Utilizadas

<div align="center">

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

</div>

- **Vite** - Build tool ultrarrápido y servidor de desarrollo
- **JavaScript Vanilla** - Sin frameworks, puro JavaScript
- **Sass/SCSS** - Preprocesador CSS con variables y nesting
- **HTML5** - Estructura semántica
- **Google Fonts** - Tipografías Pixelify Sans y Jacquard 12
- **Font Awesome** - Iconos para controles de audio

## 🎨 Recursos Gráficos

Todos los sprites y gráficos fueron creados por mí específicamente para este proyecto:

- ✅ GIFs animados del murciélago (8 estados diferentes)
- ✅ Sprites de corazones (lleno, medio, vacío)
- ✅ Sprites de comida (ajo, melón, polilla)
- ✅ Pantalla de inicio personalizada
- ✅ Favicon

## 📦 Instalación y Uso

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de instalación

1. **Clona el repositorio**

```bash
git clone https://github.com/TU_USUARIO/bat-magotchi.git
cd bat-magotchi
```

2. **Instala las dependencias**

```bash
npm install
```

3. **Inicia el servidor de desarrollo**

```bash
npm run dev
```

4. **Abre tu navegador**

```
http://localhost:5173
```

### Construir para producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

### Vista previa de la build

```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
bat-magotchi/
├── images/              # Sprites y gráficos
│   ├── Happy-bat.gif
│   ├── Sad-bat.gif
│   ├── Hungry-bat.gif
│   ├── Dead-bat.gif
│   ├── Eating-bat.gif
│   ├── Love-this-food.gif
│   ├── No-bat.gif
│   ├── Sleeping-bat.gif
│   ├── Full-heart.png
│   ├── Half-heart.png
│   ├── Empty-heart.png
│   ├── Garlic.png
│   ├── Melon.png
│   ├── Moth.png
│   ├── Landing.png
│   └── fav-icon.png
├── sounds/              # Audio del juego
│   ├── background.ogg
│   ├── game-over.mp3
│   ├── game-start.mp3
│   └── heart-down.mp3
├── scss/
│   └── main.scss        # Estilos Sass
├── js/
│   └── main.js          # Lógica del juego
├── index.html           # HTML principal
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Mecánicas del Juego

### Sistema de Corazones

- Cada corazón tiene 2 estados: **lleno** → **medio** → **vacío**
- El juego comienza con 3 corazones llenos
- Cada 10 segundos, medio corazón se degrada automáticamente
- Cuando los 3 corazones están vacíos, el murciélago muere

### Efectos de la Comida

| Comida     | Efecto         | Reacción       |
| ---------- | -------------- | -------------- |
| 🧄 Ajo     | -0.5 corazones | Rechazo y daño |
| 🍉 Melón   | +0.5 corazones | Satisfacción   |
| 🦋 Polilla | Restaura todo  | ¡Amor total!   |

### Reglas Especiales

- No puedes alimentar al murciélago si tiene todos los corazones llenos
- Si le das melón o polilla con vida llena, lo rechazará
- El ajo puede matar instantáneamente si está en el último medio corazón
- Durante las animaciones de comer, el temporizador se pausa

### 💾 Guardado Automático

El progreso se guarda automáticamente en el navegador usando `localStorage`. Esto significa que si cierras la pestaña o el navegador, al volver a cargar el juego tu murciélago seguirá exactamente en el estado en que lo dejaste: con los mismos corazones y la misma salud.

El guardado se borra automáticamente cuando el murciélago muere o cuando reinicias manualmente la partida con el botón RESET.

## 🌟 Características Técnicas

### Performance

- Uso de `requestAnimationFrame` para animaciones suaves
- Optimización de imágenes con `image-rendering: pixelated`
- Lazy loading de audio
- CSS Grid y Flexbox para layouts eficientes

### Accesibilidad

- Soporte para `prefers-reduced-motion`
- Controles por teclado completos
- Contraste adecuado en UI
- Feedback visual y auditivo

### Persistencia

- Guardado automático del estado del juego con `localStorage`
- Restauración del progreso al recargar la página
- Limpieza automática del guardado en Game Over o reinicio manual

### Responsive Design

Breakpoints optimizados:

- 📱 Mobile: < 480px
- 📱 Tablet: 480px - 768px
- 💻 Desktop: 768px - 1024px
- 🖥️ Large: 1024px - 1440px
- 🖥️ XL: > 1440px

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar el juego:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 👨‍💻 Autora

**Sofia Minaya**

- GitHub: [@s-minaya](https://github.com/s-minaya)
- LinkedIn: [Sofía Minaya](https://linkedin.com/in/sofia-minaya)

## 🙏 Agradecimientos

- Inspirado en los clásicos Tamagotchi de Bandai
- Estética basada en la Nintendo Game Boy
- Fuentes pixel-art de Google Fonts
