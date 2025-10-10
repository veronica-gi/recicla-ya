import { observeSection } from "../../core/index.js";

document.addEventListener("DOMContentLoaded", () => {
  observeSection(".info-adicional", (section) => {
    section.classList.add("visible");

    const tarjetas = section.querySelectorAll(".tarjeta-info");
    tarjetas.forEach((tarjeta, index) => {
      setTimeout(() => {
        tarjeta.classList.add("visible");
      }, index * 300);
    });
  });
});

