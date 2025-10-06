// ==========================
// 🎯 LÓGICA DEL JUEGO (CORE)
// ==========================

// Relación entre tipo de basura y color del contenedor correspondiente
const tiposBasura = {
  papel: 'azul',        // papel y cartón
  vidrio: 'verde',      // botellas, frascos
  plastico: 'amarillo', // plásticos, bricks, latas, yogures
  organico: 'marron'    // restos de comida, plantas, servilletas, tierra
};

// Puntuación inicial
let puntaje = 0;

// ==========================
// 🧩 FUNCIÓN DE VALIDACIÓN
// ==========================
function validarReciclaje(tipo, colorContenedor) {
  return tiposBasura[tipo] === colorContenedor;
}

// ==========================
// 🎮 EVENTOS PRINCIPALES
// ==========================

// Escucha cuando la UI envía una acción de reciclaje
document.addEventListener('validarReciclaje', (e) => {
  const { tipoBasura, colorContenedor } = e.detail;

  const acierto = validarReciclaje(tipoBasura, colorContenedor);

  if (acierto) {
    puntaje = Math.min(puntaje + 10, 100); // límite máximo 100
    document.dispatchEvent(new CustomEvent('mensaje', {
      detail: `✅ ¡Correcto! Has reciclado bien (${tipoBasura}).`
    }));
  } else {
    puntaje = Math.max(puntaje - 5, 0); // evita puntajes negativos
    document.dispatchEvent(new CustomEvent('mensaje', {
      detail: `❌ Incorrecto, esa basura no va en ese contenedor.`
    }));
  }

  // Notificar actualización de puntaje
  document.dispatchEvent(new CustomEvent('puntajeActualizado', { detail: puntaje }));

  // Evaluar nivel de reciclaje del jugador
  if (puntaje < 50) {
    document.dispatchEvent(new CustomEvent('nivelReciclaje', {
      detail: '♻️ Necesitas mejorar en reciclaje. ¡Sigue practicando!'
    }));
  } else if (puntaje >= 50 && puntaje < 100) {
    document.dispatchEvent(new CustomEvent('nivelReciclaje', {
      detail: '🌱 ¡Eres un buen reciclador! Sigue así para llegar a ser un maestro.'
    }));
  } else if (puntaje === 100) {
    document.dispatchEvent(new CustomEvent('nivelReciclaje', {
      detail: '🏆 ¡Excelente! Has alcanzado el máximo puntaje. Eres un verdadero experto del reciclaje.'
    }));
  }
});

console.log("♻️ Lógica del juego cargada y lista para eventos.");

