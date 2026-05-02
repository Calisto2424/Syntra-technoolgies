// Domínios — pesquisa
const domainInput = document.getElementById("domainInput");
const searchBtn = document.getElementById("searchBtn");
const searchError = document.getElementById("searchError");
const domNames = [
  document.getElementById("dn1"),
  document.getElementById("dn2"),
  document.getElementById("dn3"),
  document.getElementById("dn4"),
];
const emailsList = document.getElementById("emailsList");
const emailPrefixes = ["comercial", "suporte", "info", "direcao"];
const domSuffixes = [".co.mz", ".com", ".org.mz", ".ac.mz"];

const hasDomainExt = (v) =>
  /\.(com|net|org|mz|co\.mz|org\.mz|ac\.mz|gov\.mz)(\s|$)/i.test(v);

function updateDomains(name) {
  const slug =
    name
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9-]/g, "") || "empresa";
  domNames.forEach((el, i) => {
    if (el) el.textContent = slug + domSuffixes[i];
  });
  const pills = emailsList.querySelectorAll(".email-pill");
  pills.forEach((p, i) => {
    p.textContent = emailPrefixes[i] + "@" + slug + ".co.mz";
  });
}

searchBtn.addEventListener("click", () => {
  const val = domainInput.value.trim();
  if (hasDomainExt(val)) {
    searchError.style.display = "block";
    domainInput.style.borderColor = "#c0392b";
    return;
  }
  searchError.style.display = "none";
  domainInput.style.borderColor = "";
  updateDomains(val);
});

domainInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});
domainInput.addEventListener("input", () => {
  searchError.style.display = "none";
  domainInput.style.borderColor = "";
  if (domainInput.value.trim()) updateDomains(domainInput.value.trim());
});

function handleDomainSelect(ext, price) {
  const name = domainInput.value.trim() || "empresa";
  const slug =
    name
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9-]/g, "") || "empresa";
  const msg = `Olá! Quero registar o domínio ${slug}${ext} por ${price} MT/ano.`;
  window.open(
    "https://wa.me/258871582209?text=" + encodeURIComponent(msg),
    "_blank",
  );
}

// Formulário de contacto
function handleForm(e) {
  e.preventDefault();
  const btn = document.getElementById("submitBtn");
  const success = document.getElementById("formSuccess");
  btn.textContent = "A enviar…";
  btn.disabled = true;
  setTimeout(() => {
    btn.style.display = "none";
    success.classList.add("visible");
    document.getElementById("contactForm").reset();
  }, 1200);
}

// Scroll reveal suave para secções
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 },
);

document
  .querySelectorAll(".serv-card, .pstep, .dom-card, .stat")
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(el);
  });
