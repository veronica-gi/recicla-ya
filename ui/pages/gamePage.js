// ==========================
// 🎮 UI - Juego de Reciclaje
// ==========================

// Variables de estado
let basuraSeleccionada = null;

// Referencias del DOM
const zonaCaida = document.getElementById('zona-basura-cayendo');
const contenedores = document.querySelectorAll('.contenedor');
const mensajeJuego = document.getElementById('mensaje-juego');
const puntajeJuego = document.getElementById('puntaje-juego');

// ==========================
// 🗑️ Catálogo de basura
// ==========================
const catalogoBasura = [
  { nombre: "Botella de vidrio", emoji: "🍾", tipo: "vidrio" },
  { nombre: "Botella de plástico", emoji: "🥤", tipo: "plastico" },
  { nombre: "Lata", emoji: "🥫", tipo: "plastico" },
  { nombre: "Brick", emoji: "🧃", tipo: "plastico" },
  { nombre: "Yogur", emoji: "🍶", tipo: "plastico" },
  { nombre: "Papel", emoji: "📰", tipo: "papel" },
  { nombre: "Cartón", emoji: "📦", tipo: "papel" },
  { nombre: "Servilleta usada", emoji: "🧻", tipo: "organico" },
  { nombre: "Restos de comida", emoji: "🍝", tipo: "organico" },
  { nombre: "Restos de fruta", emoji: "🍌", tipo: "organico" },
  { nombre: "Plantas", emoji: "🌿", tipo: "organico" },
  { nombre: "Tierra", emoji: "🪴", tipo: "organico" },
];

// ==========================
// 🌧️ Generación de basura que cae
// ==========================
function generarBasura() {
  const item = catalogoBasura[Math.floor(Math.random() * catalogoBasura.length)];

  const basura = document.createElement('div');
  basura.classList.add('item-cayendo');
  basura.dataset.tipo = item.tipo;
  basura.textContent = item.emoji;
  basura.title = item.nombre;
  basura.draggable = true;

  // Posición horizontal aleatoria
  basura.style.left = `${Math.random() * 80 + 10}%`;
  basura.style.top = '0px';
  zonaCaida.appendChild(basura);

  caerBasura(basura);
}

// Animar la caída de la basura
function caerBasura(elemento) {
  let y = 0;
  const velocidad = Math.random() * 2 + 1;
  const intervalo = setInterval(() => {
    y += velocidad * 5;
    elemento.style.top = y + 'px';

    // Si llega al fondo, se detiene
    if (y > zonaCaida.offsetHeight - 80) {
      clearInterval(intervalo);
      // El jugador puede arrastrar la basura hacia un contenedor
    }
  }, 50);
}

// Crear una nueva basura cada cierto tiempo
setInterval(generarBasura, 2500);

// ==========================
// 🖱️ Arrastrar y soltar
// ==========================
document.addEventListener('dragstart', e => {
  if (e.target.classList.contains('item-cayendo')) {
    basuraSeleccionada = e.target.dataset.tipo;
    e.dataTransfer.setData('text/plain', basuraSeleccionada);
    e.target.style.opacity = '0.5';
  }
});

document.addEventListener('dragend', e => {
  if (e.target.classList.contains('item-cayendo')) {
    e.target.remove(); // quitar la basura del área al soltarla
  }
});

contenedores.forEach(contenedor => {
  contenedor.addEventListener('dragover', e => e.preventDefault());

  contenedor.addEventListener('drop', e => {
    e.preventDefault();
    const colorContenedor = contenedor.getAttribute('data-color');
    const tipoBasura = e.dataTransfer.getData('text/plain');

    // Enviar evento al core para validar
    document.dispatchEvent(new CustomEvent('validarReciclaje', {
      detail: { tipoBasura, colorContenedor }
    }));

    basuraSeleccionada = null;
  });
});

// ==========================
// 💬 Escucha de eventos del core
// ==========================

// Mensaje de acierto/error
document.addEventListener('mensaje', e => {
  mensajeJuego.textContent = e.detail;
});

// Actualización de puntaje
document.addEventListener('puntajeActualizado', e => {
  puntajeJuego.textContent = `Puntaje: ${e.detail}`;
});

// Evaluación del nivel de reciclaje
document.addEventListener('nivelReciclaje', e => {
  mensajeJuego.textContent = e.detail;
});

// ==========================
// 🏁 Mensaje de fin del juego (opcional)
// ==========================
document.addEventListener('finJuego', e => {
  mensajeJuego.textContent = e.detail;
  alert(e.detail);
});
