// UI - Juego de Reciclaje (solo presentación)

// Variables de estado solo para animación
let basuraSeleccionada = null;

// Referencias del DOM
const zonaCaida = document.getElementById('zona-basura-cayendo');
const contenedores = document.querySelectorAll('.contenedor');
const mensajeJuego = document.getElementById('mensaje-juego');
const puntajeJuego = document.getElementById('puntaje-juego');

// Crear basura (solo animación)
function crearBasura(item) {
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

  animarCaida(basura);
}

// Animación simple de caída
function animarCaida(elemento) {
  let y = 0;
  const velocidad = Math.random() * 2 + 1;
  const id = setInterval(() => {
    y += velocidad * 5;
    elemento.style.top = y + 'px';
    if (y > zonaCaida.offsetHeight - 80) {
      clearInterval(id);
      elemento.remove();
    }
  }, 50);
  elemento._fallInterval = id;
}

// Arrastrar y soltar (solo envía eventos)
document.addEventListener('dragstart', e => {
  if (e.target.classList.contains('item-cayendo')) {
    basuraSeleccionada = e.target.dataset.tipo;
    e.dataTransfer.setData('text/plain', basuraSeleccionada);
    e.dataTransfer.setData('text/uid', e.target.dataset.uid);
    e.target.style.opacity = '0.5';
  }
});

document.addEventListener('dragend', e => {
  if (e.target.classList.contains('item-cayendo')) {
    if (e.target._fallInterval) clearInterval(e.target._fallInterval);
    e.target.remove();
  }
});

contenedores.forEach(contenedor => {
  contenedor.addEventListener('dragover', e => e.preventDefault());
  contenedor.addEventListener('drop', e => {
    const tipoBasura = e.dataTransfer.getData('text/plain');
    const colorContenedor = contenedor.getAttribute('data-color');
    document.dispatchEvent(new CustomEvent('validarReciclaje', {
      detail: { tipoBasura, colorContenedor }
    }));
    basuraSeleccionada = null;
  });
});

// Botón Reiniciar 
const botonReiniciar = document.createElement('button');
botonReiniciar.textContent = 'Reiniciar juego';
botonReiniciar.className = 'boton-reiniciar';
document.body.appendChild(botonReiniciar);

botonReiniciar.addEventListener('click', () => {
  document.dispatchEvent(new CustomEvent('reiniciarJuego'));
});


// Eventos del core (solo mostrar)
document.addEventListener('mensaje', e => mensajeJuego.textContent = e.detail);
document.addEventListener('puntajeActualizado', e => puntajeJuego.textContent = `Puntuación: ${e.detail}`);
document.addEventListener('nivelReciclaje', e => mensajeJuego.textContent = e.detail);
document.addEventListener('finJuego', e => alert(e.detail));

// Escuchar al core para crear basura
document.addEventListener('crearBasura', e => {
  crearBasura(e.detail); 
});



