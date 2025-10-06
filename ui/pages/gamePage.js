// Variables para guardar selección
let basuraSeleccionada = null;

// Capturamos los elementos
const itemsBasura = document.querySelectorAll('.basura .item');
const contenedores = document.querySelectorAll('.contenedor');
const mensajeJuego = document.getElementById('mensaje-juego');
const puntajeJuego = document.getElementById('puntaje-juego');

// Cuando el usuario clickea en un ítem de basura
itemsBasura.forEach(item => {
  item.addEventListener('click', () => {
    basuraSeleccionada = item.getAttribute('data-tipo');
    // Lanzamos evento para core con el tipo de basura seleccionada
    document.dispatchEvent(new CustomEvent('basuraSeleccionada', { detail: { tipoBasura: basuraSeleccionada } }));
    // Mensaje en UI
    mensajeJuego.textContent = `Has seleccionado: ${basuraSeleccionada}`;
  });
});

// Cuando el usuario clickea en un contenedor
contenedores.forEach(contenedor => {
  contenedor.addEventListener('click', () => {
    if (!basuraSeleccionada) {
      mensajeJuego.textContent = 'Por favor, selecciona primero una basura.';
      return;
    }
    const colorContenedor = contenedor.getAttribute('data-color');
    // Lanzamos evento para core con el color seleccionado
    document.dispatchEvent(new CustomEvent('contenedorSeleccionado', { detail: { colorContenedor } }));
  });
});

// Escuchamos mensajes que envia core
document.addEventListener('mensaje', e => {
  mensajeJuego.textContent = e.detail;
});

// Escuchamos actualización de puntaje
document.addEventListener('puntajeActualizado', e => {
  puntajeJuego.textContent = `Puntaje: ${e.detail}`;
  // Reseteamos la selección para que el usuario seleccione otra basura
  basuraSeleccionada = null;
});

