/**
 * Syntra Partners Carousel - High Performance Edition
 * Focado em fluidez e estabilidade.
 */

class PartnerCarousel {
  constructor() {
    this.faixa = document.getElementById("faixa");
    this.viewport = document.getElementById("viewport");
    this.btnPrev = document.getElementById("btnPrev");
    this.btnNext = document.getElementById("btnNext");
    this.dotsContainer = document.getElementById("dots");

    if (!this.faixa || !this.viewport) return;

    this.currentIndex = 0;
    this.isDragging = false;
    this.startPos = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;

    this.init();
  }

  init() {
    this.createDots();
    this.update();
    this.bindEvents();

    // Auto-ajuste inteligente quando a janela muda de tamanho
    const resizeObserver = new ResizeObserver(() => this.update());
    resizeObserver.observe(this.viewport);
  }

  getCards() {
    return Array.from(this.faixa.querySelectorAll(".card"));
  }

  createDots() {
    const cards = this.getCards();
    this.dotsContainer.innerHTML = ""; // Limpa antes de criar
    cards.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (index === 0) dot.classList.add("active");
      dot.addEventListener("click", () => this.goTo(index));
      this.dotsContainer.appendChild(dot);
    });
  }

  update() {
    const cards = this.getCards();
    if (cards.length === 0) return;

    // Cálculo dinâmico de largura considerando o Gap do CSS
    const style = window.getComputedStyle(this.faixa);
    const gap = parseInt(style.columnGap) || 0;
    const cardWidth = cards[0].offsetWidth + gap;

    this.currentTranslate = this.currentIndex * -cardWidth;
    this.prevTranslate = this.currentTranslate;

    this.faixa.style.transition = "transform 0.7s cubic-bezier(0.2, 1, 0.2, 1)";
    this.faixa.style.transform = `translateX(${this.currentTranslate}px)`;

    this.updateDots();
  }

  move(direction) {
    const cards = this.getCards();
    if (direction === "next") {
      this.currentIndex =
        this.currentIndex + 1 >= cards.length ? 0 : this.currentIndex + 1;
    } else {
      this.currentIndex =
        this.currentIndex - 1 < 0 ? cards.length - 1 : this.currentIndex - 1;
    }
    this.update();
  }

  goTo(index) {
    this.currentIndex = index;
    this.update();
  }

  updateDots() {
    const dots = this.dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === this.currentIndex);
    });
  }

  bindEvents() {
    // Botões
    this.btnNext.addEventListener("click", () => this.move("next"));
    this.btnPrev.addEventListener("click", () => this.move("prev"));

    // Touch (Mobile)
    this.faixa.addEventListener("touchstart", (e) => this.startDrag(e), {
      passive: true,
    });
    this.faixa.addEventListener("touchmove", (e) => this.drag(e), {
      passive: true,
    });
    this.faixa.addEventListener("touchend", () => this.endDrag());

    // Mouse (Desktop)
    this.faixa.addEventListener("mousedown", (e) => this.startDrag(e));
    this.faixa.addEventListener("mousemove", (e) => this.drag(e));
    this.faixa.addEventListener("mouseup", () => this.endDrag());
    this.faixa.addEventListener("mouseleave", () => this.endDrag());
  }

  // Lógica de Drag sutil
  startDrag(e) {
    this.isDragging = true;
    this.startPos = this.getPositionX(e);
    this.faixa.style.transition = "none";
    this.faixa.style.cursor = "grabbing";
  }

  drag(e) {
    if (!this.isDragging) return;
    const currentPos = this.getPositionX(e);
    const diff = currentPos - this.startPos;
    const translate = this.prevTranslate + diff;
    this.faixa.style.transform = `translateX(${translate}px)`;
  }

  endDrag() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.faixa.style.cursor = "grab";

    const style = window.getComputedStyle(this.faixa);
    const matrix = new WebKitCSSMatrix(style.transform);
    const currentX = matrix.m41;

    const movedBy = currentX - this.prevTranslate;

    if (movedBy < -100) this.move("next");
    else if (movedBy > 100) this.move("prev");
    else this.update();
  }

  getPositionX(e) {
    return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
  }
}

// Ativação
document.addEventListener("DOMContentLoaded", () => {
  window.partnerCarousel = new PartnerCarousel();
});
