document.addEventListener("DOMContentLoaded", () => {
  fetch("./ui/components/header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;
    })
    .catch(err => console.error("No se pudo cargar el header:", err));
});

