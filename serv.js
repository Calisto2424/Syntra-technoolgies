(function () {
  const section = document.querySelector(".populares");
  if (!section) return;

  const viewport = section.querySelector(".carrossel__viewport");
  const faixa = section.querySelector(".carrossel__faixa");
  const btnPrev = section.querySelector("#btnPrev");
  const btnNext = section.querySelector("#btnNext");
  const dotsContainer = section.querySelector(".carrossel__dots");
  const cards = faixa.querySelectorAll(".card");

  if (!viewport || !faixa || !btnPrev || !btnNext || !cards.length) return;

  let currentIndex = 0;
  let cardsPerView = cards.length; // inicialmente mostra todos
  let totalSlides = 1;
  const gap = 14; // mesmo valor do --gap

  // Verifica se está em modo carrossel (mobile)
  function isCarouselMode() {
    return window.innerWidth <= 768; // breakpoint ajustável
  }

  // Calcula quantos cards cabem no viewport
  function getCardsPerView() {
    if (!isCarouselMode()) return cards.length; // desktop: todos
    const viewportWidth = viewport.clientWidth;
    const cardWidth = cards[0].offsetWidth + gap;
    return Math.max(1, Math.floor(viewportWidth / cardWidth));
  }

  // Atualiza estado e renderiza
  function updateCarousel() {
    cardsPerView = getCardsPerView();
    totalSlides = Math.max(1, cards.length - cardsPerView + 1);

    // Garante que o índice não ultrapasse os limites
    if (currentIndex > totalSlides - 1) {
      currentIndex = totalSlides - 1;
    }
    if (currentIndex < 0) currentIndex = 0;

    // Move a faixa
    const cardWidth = cards[0].offsetWidth + gap;
    const offset = -currentIndex * cardWidth;
    faixa.style.transform = `translateX(${offset}px)`;

    // Atualiza estado dos botões
    btnPrev.disabled = currentIndex === 0;
    btnNext.disabled = currentIndex >= totalSlides - 1;

    // Atualiza dots
    renderDots();

    // Em desktop, esconde os controles e mostra tudo sem cortes
    if (!isCarouselMode()) {
      viewport.style.overflow = "visible";
      btnPrev.style.display = "none";
      btnNext.style.display = "none";
      dotsContainer.style.display = "none";
      faixa.style.transform = "translateX(0)";
    } else {
      viewport.style.overflow = "hidden";
      btnPrev.style.display = "";
      btnNext.style.display = "";
      dotsContainer.style.display = "";
    }
  }

  // Cria dots
  function renderDots() {
    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("button");
      dot.className = "dot" + (i === currentIndex ? " ativo" : "");
      dot.setAttribute("aria-label", `Ir para slide ${i + 1}`);
      dot.addEventListener("click", () => {
        currentIndex = i;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    }
  }

  // Eventos dos botões
  btnPrev.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  btnNext.addEventListener("click", () => {
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Redimensionamento
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Redefine o índice ao mudar de modo
      if (!isCarouselMode()) {
        currentIndex = 0;
      }
      updateCarousel();
    }, 200);
  });

  // Inicialização
  updateCarousel();
})();
