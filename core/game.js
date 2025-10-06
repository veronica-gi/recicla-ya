
const tiposBasura = {
  papel: 'azul',
  vidrio: 'verde',
  plastico: 'amarillo',
  organico: 'marron'
};

let puntaje = 0;

function validarReciclaje(tipoBasura, colorContenedor) {
  if (tiposBasura[tipoBasura] === colorContenedor) {
    puntaje += 10;
    return true;
  } else {
    puntaje -= 5;
    return false;
  }
}

console.log("Lógica básica lista");

