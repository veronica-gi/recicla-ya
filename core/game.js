// LÓGICA DEL JUEGO (CORE)

// Relación tipo de basura → color contenedor
const tiposBasura = {
  papel: 'azul',
  vidrio: 'verde',
  plastico: 'amarillo',
  organico: 'marron'
};

// Catálogo de basura
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
  { nombre: "Cáscara de huevo", emoji: "🥚", tipo: "organico" }
];

// Estado del juego
let puntaje = 0;
let basuraProcesada = 0;
let basuraGenerada = 0;  
const MAX_BASURA = 30;   // límite total por partida

// Función de validación
function validarReciclaje(tipo, colorContenedor) {
  return tiposBasura[tipo] === colorContenedor;
}

//  Generación controlada de basura
function lanzarBasura() {
  if (basuraGenerada >= MAX_BASURA) return;

  const item = catalogoBasura[Math.floor(Math.random() * catalogoBasura.length)];
  basuraGenerada++;

  // Enviar evento a la UI para que muestre la basura
  document.dispatchEvent(new CustomEvent('crearBasura', { detail: item }));

  // Si alcanzamos el límite, fin del juego
  if (basuraGenerada >= MAX_BASURA) {
    document.dispatchEvent(new CustomEvent('finJuego', {
      detail: generarMensajeFinal()
    }));
  }
}


// Validar acción de reciclaje
document.addEventListener('validarReciclaje', e => {
  if (basuraProcesada >= MAX_BASURA) return;

  const { tipoBasura, colorContenedor } = e.detail;
  const acierto = validarReciclaje(tipoBasura, colorContenedor);

  basuraProcesada++;

  if (acierto) {
    puntaje = Math.min(puntaje + 10, 100);
    document.dispatchEvent(new CustomEvent('mensaje', {
      detail: `✅ ¡Correcto! Has reciclado bien (${tipoBasura}).`
    }));
  } else {
    puntaje = Math.max(puntaje - 5, 0);
    document.dispatchEvent(new CustomEvent('mensaje', {
      detail: `❌ Incorrecto, esa basura no va en ese contenedor.`
    }));
  }

  document.dispatchEvent(new CustomEvent('puntajeActualizado', { detail: puntaje }));

  if (puntuación < 50) {
    document.dispatchEvent(new CustomEvent('nivelReciclaje', {
      detail: '♻️ Necesitas mejorar en reciclaje. ¡Sigue practicando!'
    }));
  } else if (puntuación < 100) {
    document.dispatchEvent(new CustomEvent('nivelReciclaje', {
      detail: '🌱 ¡Eres un buen reciclador! Sigue así para llegar a ser un maestro.'
    }));
  } else {
    document.dispatchEvent(new CustomEvent('nivelReciclaje', {
      detail: '🏆 ¡Excelente! Has alcanzado la máxima puntuación. Eres un verdadero experto del reciclaje.'
    }));
  }

  // Fin del juego si procesamos todas las basuras
  if (basuraProcesada >= MAX_BASURA) {
    document.dispatchEvent(new CustomEvent('finJuego', {
      detail: generarMensajeFinal()
    }));
  }
});

// Reiniciar juego
document.addEventListener('reiniciarJuego', () => {
  puntuación = 0;
  basuraProcesada = 0;
  basuraGenerada = 0;

  document.dispatchEvent(new CustomEvent('puntuaciónActualizado', { detail: puntaje }));
  document.dispatchEvent(new CustomEvent('nivelReciclaje', {
    detail: '♻️ ¡Juego reiniciado! Comienza a reciclar.'
  }));

  // Volver a lanzar basura desde el inicio
  iniciarPartida();
});

// Helpers
function generarMensajeFinal() {
  let mensaje = `🌍 ¡Juego terminado! Has completado la ronda.\n`;
  if (puntaje < 50) mensaje += "Necesitas mejorar tus hábitos de reciclaje.";
  else if (puntaje < 100) mensaje += "Buen trabajo, ¡eres un buen reciclador!";
  else mensaje += "¡Excelente! Eres un experto del reciclaje ♻️";
  return mensaje;
}

// Iniciar partida
function iniciarPartida() {
  const intervalo = setInterval(() => {
    if (basuraGenerada >= MAX_BASURA) {
      clearInterval(intervalo);
      return;
    }
    lanzarBasura();
  }, 2500); 
}

// Arrancar al cargar
iniciarPartida();

console.log("♻️ Core del juego cargado y listo, límite máximo de basura:", MAX_BASURA);
