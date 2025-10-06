const tiposBasura = {
  papel: 'azul',
  vidrio: 'verde',
  plastico: 'amarillo',
  organico: 'marron'
};

let basuraSeleccionada = null;
let puntaje = 0;

function validarReciclaje(tipoBasura, colorContenedor) {
  return tiposBasura[tipoBasura] === colorContenedor;
}

// Escucha cuando UI indica que el usuario seleccionó una basura
document.addEventListener('basuraSeleccionada', (e) => {
  basuraSeleccionada = e.detail.tipoBasura;
  document.dispatchEvent(new CustomEvent('mensaje', { detail: `Seleccionaste: ${basuraSeleccionada}` }));
});

// Escucha cuando UI indica que el usuario seleccionó un contenedor
document.addEventListener('contenedorSeleccionado', (e) => {
  if (!basuraSeleccionada) {
    document.dispatchEvent(new CustomEvent('mensaje', { detail: 'Primero selecciona una basura.' }));
    return;
  }

  const colorContenedor = e.detail.colorContenedor;
  const acierto = validarReciclaje(basuraSeleccionada, colorContenedor);

  if (acierto) {
    puntaje += 10;
    document.dispatchEvent(new CustomEvent('mensaje', { detail: '¡Correcto! Has reciclado bien.' }));
  } else {
    puntaje -= 5;
    document.dispatchEvent(new CustomEvent('mensaje', { detail: 'Incorrecto, esa basura no va ahí.' }));
  }

  document.dispatchEvent(new CustomEvent('puntajeActualizado', { detail: puntaje }));

  basuraSeleccionada = null;
});

console.log("Lógica básica lista y lista para eventos");


