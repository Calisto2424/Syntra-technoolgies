// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12 },
);
reveals.forEach((el) => observer.observe(el));

// Animated counter for stats
function animateCount(el, target, suffix = "") {
  let start = 0;
  const duration = 1800;
  const step = target / (duration / 16);
  const update = () => {
    start += step;
    if (start >= target) {
      el.textContent = target + suffix;
      return;
    }
    el.textContent = Math.floor(start) + suffix;
    requestAnimationFrame(update);
  };
  update();
}

const statsSection = document.querySelector(".stats-section");
let animated = false;
new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      const numbers = document.querySelectorAll(".stat-number");
      const data = [
        { val: 120, suffix: "+" },
        { val: 87, suffix: "%" },
        { val: 48, suffix: "h" },
        { val: 3, suffix: "×" },
      ];
      numbers.forEach((el, i) => {
        const inner = el.innerHTML;
        // keep the colored span structure
        animateCount(el.childNodes[0], data[i].val, "");
        el.innerHTML = "";
        const num = document.createTextNode("");
        el.appendChild(num);
        const span = document.createElement("span");
        span.textContent = data[i].suffix;
        el.appendChild(span);
        let start = 0;
        const target = data[i].val;
        const step = target / (1800 / 16);
        const update = () => {
          start += step;
          if (start >= target) {
            num.textContent = target;
            return;
          }
          num.textContent = Math.floor(start);
          requestAnimationFrame(update);
        };
        setTimeout(update, i * 120);
      });
    }
  },
  { threshold: 0.3 },
).observe(statsSection);
