// ==========================
// 🎮 UI - Juego de Reciclaje (versión con límite total de basura)
// ==========================

// Variables de estado
let basuraSeleccionada = null;
let intervaloBasura = null;
let juegoActivo = true;
let basuraActiva = 0;
let basuraGenerada = 0; // contador total
const MAX_BASURA_SIMULTANEA = 12;
const MAX_BASURA_TOTAL = 30; // debe coincidir con el core

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
  { nombre: "Copa de vino", emoji: "🍷", tipo: "vidrio" },
  { nombre: "Botella de plástico", emoji: "🥤", tipo: "plastico" },
  { nombre: "Lata de refresco", emoji: "🥫", tipo: "plastico" },
  { nombre: "Brick", emoji: "🧃", tipo: "plastico" },
  { nombre: "Yogur", emoji: "🍶", tipo: "plastico" },
  { nombre: "Yogur", emoji: "🥛", tipo: "plastico" },
  { nombre: "Papel", emoji: "📰", tipo: "papel" },
  { nombre: "Cartón", emoji: "📦", tipo: "papel" },
  { nombre: "Sobres", emoji: "✉️", tipo: "papel" },
  { nombre: "Libros", emoji: "📚", tipo: "papel" },
  { nombre: "Servilleta usada", emoji: "🧻", tipo: "organico" },
  { nombre: "Restos de comida", emoji: "🍝", tipo: "organico" },
  { nombre: "Restos de fruta", emoji: "🍌", tipo: "organico" },
  { nombre: "Plantas", emoji: "🌿", tipo: "organico" },
  { nombre: "Manzana", emoji: "🍎", tipo: "organico" },
  { nombre: "Verdura", emoji: "🥦", tipo: "organico" },
  { nombre: "Pan", emoji: "🥖", tipo: "organico" },
  { nombre: "Cáscara de huevo", emoji: "🥚", tipo: "organico" },
];

// ==========================
// 🌧️ Generación de basura
// ==========================
function generarBasura() {
  if (!juegoActivo) return;
  if (basuraActiva >= MAX_BASURA_SIMULTANEA) return;
  if (basuraGenerada >= MAX_BASURA_TOTAL) return; // 🚫 detener si llegamos al máximo

  basuraGenerada++;

  const item = catalogoBasura[Math.floor(Math.random() * catalogoBasura.length)];
  const basura = document.createElement('div');
  basura.classList.add('item-cayendo');
  basura.dataset.tipo = item.tipo;
  basura.dataset.uid = `b-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  basura.textContent = item.emoji;
  basura.title = item.nombre;
  basura.draggable = true;

  basura.style.left = `${Math.random() * 80 + 10}%`;
  basura.style.top = '0px';
  zonaCaida.appendChild(basura);

  basuraActiva++;
  caerBasura(basura);

  // ✅ Si llegamos al máximo, detenemos la generación automáticamente
  if (basuraGenerada >= MAX_BASURA_TOTAL) {
    clearInterval(intervaloBasura);
    intervaloBasura = null;
  }
}

// ==========================
// 🚀 Animación de caída
// ==========================
function caerBasura(elemento) {
  let y = 0;
  const velocidad = Math.random() * 2 + 1;

  const id = setInterval(() => {
    y += velocidad * 5;
    elemento.style.top = y + 'px';

    if (y > zonaCaida.offsetHeight - 80) {
      clearInterval(id);
      if (elemento.parentNode) elemento.parentNode.removeChild(elemento);
      basuraActiva = Math.max(0, basuraActiva - 1);
    }
  }, 50);

  elemento._fallInterval = id;
}

// ==========================
// ⚙️ Control de generación
// ==========================
function startGeneracion() {
  stopGeneracion(); // limpiar antes de iniciar
  basuraGenerada = 0;
  juegoActivo = true;
  intervaloBasura = setInterval(generarBasura, 2500);
}

function stopGeneracion() {
  juegoActivo = false;
  if (intervaloBasura) {
    clearInterval(intervaloBasura);
    intervaloBasura = null;
  }
  const items = Array.from(zonaCaida.querySelectorAll('.item-cayendo'));
  items.forEach(it => {
    if (it._fallInterval) clearInterval(it._fallInterval);
    if (it.parentNode) it.parentNode.removeChild(it);
  });
  basuraActiva = 0;
}

// Iniciar al cargar
startGeneracion();

// ==========================
// 🖱️ Arrastrar y soltar
// ==========================
document.addEventListener('dragstart', e => {
  if (e.target.classList.contains('item-cayendo')) {
    basuraSeleccionada = e.target.dataset.tipo;
    e.dataTransfer.setData('text/plain', basuraSeleccionada);
    e.dataTransfer.setData('text/uid', e.target.dataset.uid || '');
    e.target.style.opacity = '0.5';
    e.target.classList.add('dragging');
  }
});

document.addEventListener('dragend', e => {
  const el = e.target;
  if (el && el.classList.contains('item-cayendo')) {
    if (el._fallInterval) clearInterval(el._fallInterval);
    if (el.parentNode) el.parentNode.removeChild(el);
    basuraActiva = Math.max(0, basuraActiva - 1);
  }
});

contenedores.forEach(contenedor => {
  contenedor.addEventListener('dragover', e => e.preventDefault());
  contenedor.addEventListener('drop', e => {
    e.preventDefault();
    const colorContenedor = contenedor.getAttribute('data-color');
    const tipoBasura = e.dataTransfer.getData('text/plain');
    const uid = e.dataTransfer.getData('text/uid');

    const elemento = zonaCaida.querySelector(`[data-uid="${uid}"]`);
    if (elemento) {
      if (elemento._fallInterval) clearInterval(elemento._fallInterval);
      elemento.remove();
      basuraActiva = Math.max(0, basuraActiva - 1);
    }

    document.dispatchEvent(new CustomEvent('validarReciclaje', {
      detail: { tipoBasura, colorContenedor }
    }));
    basuraSeleccionada = null;
  });
});

// ==========================
// 💬 Escucha de eventos del core
// ==========================
document.addEventListener('mensaje', e => {
  mensajeJuego.textContent = e.detail;
});

document.addEventListener('puntajeActualizado', e => {
  puntajeJuego.textContent = `Puntaje: ${e.detail}`;
});

document.addEventListener('nivelReciclaje', e => {
  mensajeJuego.textContent = e.detail;
});

// ==========================
// 🏁 Fin del juego
// ==========================
document.addEventListener('finJuego', e => {
  stopGeneracion(); // ✅ detiene todo
  mensajeJuego.textContent = e.detail;
  alert(e.detail);
});

// ==========================
// 🔄 Botón Reiniciar
// ==========================
const botonReiniciar = document.createElement('button');
botonReiniciar.textContent = '🔄 Reiniciar juego';
botonReiniciar.className = 'boton-reiniciar';
document.body.appendChild(botonReiniciar);

botonReiniciar.addEventListener('click', () => {
  stopGeneracion();
  basuraGenerada = 0;
  mensajeJuego.textContent = '♻️ ¡Nueva ronda iniciada!';
  puntajeJuego.textContent = 'Puntaje: 0';
  document.dispatchEvent(new CustomEvent('reiniciarJuego'));
  startGeneracion();
});


