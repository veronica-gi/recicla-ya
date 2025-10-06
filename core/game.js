const tiposBasura = {
  papel: 'azul',
  vidrio: 'verde',
  plastico: 'amarillo',
  organico: 'marron'
};

let puntaje = 0;

function validarReciclaje(tipoBasura, colorContenedor) {
  return tiposBasura[tipoBasura] === colorContenedor;
}

// Escucha cuando UI indica que el usuario quiere validar reciclaje
document.addEventListener('validarReciclaje', (e) => {
  const { tipoBasura, colorContenedor } = e.detail;

  const acierto = validarReciclaje(tipoBasura, colorContenedor);

  if (acierto) {
    puntaje += 10;
    document.dispatchEvent(new CustomEvent('mensaje', { detail: '¡Correcto! Has reciclado bien.' }));
  } else {
    puntaje -= 5;
    document.dispatchEvent(new CustomEvent('mensaje', { detail: 'Incorrecto, esa basura no va ahí.' }));
  }

  document.dispatchEvent(new CustomEvent('puntajeActualizado', { detail: puntaje }));
});

console.log("Lógica básica lista y lista para eventos");
