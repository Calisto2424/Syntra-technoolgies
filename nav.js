/**
 * nav.js
 * Comportamento da navegação ao fazer scroll
 */

(function () {
  "use strict";

  const nav = document.getElementById("nav");

  window.addEventListener(
    "scroll",
    function () {
      if (window.scrollY > 20) {
        nav.classList.add("nav--scrolled");
      } else {
        nav.classList.remove("nav--scrolled");
      }
    },
    { passive: true },
  );
})();
