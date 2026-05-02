/**
 * simulator.js
 * Identity Builder — atualização em tempo real de domínios e e-mails
 */

(function () {
  "use strict";

  /* ── Estado ── */
  let currentSlug = "";
  let selectedDomain = null;

  /* ── DOM ── */
  const input = document.getElementById("companyInput");
  const clearBtn = document.getElementById("clearBtn");
  const domainList = document.getElementById("domainList");
  const previewEmpty = document.getElementById("previewEmpty");
  const previewContent = document.getElementById("previewContent");
  const emailList = document.getElementById("emailList");
  const previewCompany = document.getElementById("previewCompanyName");

  /* ── Input handler ── */
  const handleInput = debounce(function () {
    const raw = input.value.trim();
    currentSlug = slugify(raw);

    clearBtn.style.display = raw.length > 0 ? "flex" : "none";

    if (!currentSlug) {
      resetSimulator();
      return;
    }

    renderDomains(currentSlug, raw);
    renderEmails(currentSlug, raw);
  }, 180);

  input.addEventListener("input", handleInput);

  /* ── Clear ── */
  clearBtn.addEventListener("click", function () {
    input.value = "";
    clearBtn.style.display = "none";
    resetSimulator();
    input.focus();
  });

  /* ── Enter ── */
  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      input.value = "";
      clearBtn.style.display = "none";
      resetSimulator();
    }
  });

  /* ══════════════════════════════
     Render — lista de domínios
  ══════════════════════════════ */
  function renderDomains(slug, rawName) {
    domainList.innerHTML = "";
    selectedDomain = null;

    SYNTRA_CONFIG.dominios.forEach(function (d, i) {
      const fullDomain = slug + d.tld;

      const row = document.createElement("div");
      row.className = "domain-row";
      row.style.animationDelay = i * 0.05 + "s";
      row.dataset.tld = d.tld;
      row.dataset.domain = fullDomain;

      row.innerHTML = `
        <span class="dr__name"><strong>${slug}</strong>${d.tld}</span>
        <div class="dr__right">
          <span class="dr__price">${d.preco}</span>
          <button class="dr__btn">Solicitar</button>
        </div>
      `;

      row.addEventListener("click", function () {
        selectDomain(row, slug, d.tld, rawName);
      });

      domainList.appendChild(row);
    });
  }

  /* ══════════════════════════════
     Render — preview de e-mails
  ══════════════════════════════ */
  function renderEmails(slug, rawName) {
    previewEmpty.style.display = "none";
    previewContent.style.display = "flex";

    previewCompany.textContent = rawName;
    emailList.innerHTML = "";

    /* Gera combinações prefix × domínio (top 5) */
    const combos = [];
    SYNTRA_CONFIG.dominios.forEach(function (d) {
      SYNTRA_CONFIG.emailPrefixes.slice(0, 2).forEach(function (prefix) {
        combos.push({ prefix, domain: slug + d.tld });
      });
    });

    // Mostra os primeiros 5 únicos
    const shown = combos.slice(0, 5);

    shown.forEach(function (c, i) {
      const chip = document.createElement("div");
      chip.className = "email-chip";
      chip.style.animationDelay = i * 0.06 + "s";
      chip.innerHTML = `
        <span class="email-chip__prefix">${c.prefix}</span>
        <span class="email-chip__at">@</span>
        <span class="email-chip__domain">${c.domain}</span>
      `;
      emailList.appendChild(chip);
    });
  }

  /* ══════════════════════════════
     Selecionar domínio
  ══════════════════════════════ */
  function selectDomain(row, slug, tld, rawName) {
    // Remove seleção anterior
    domainList
      .querySelectorAll(".domain-row")
      .forEach((r) => r.classList.remove("selected"));
    row.classList.add("selected");
    selectedDomain = { slug, tld, fullDomain: slug + tld, rawName };

    // Abre modal
    openModal(selectedDomain);
  }

  /* ══════════════════════════════
     Reset
  ══════════════════════════════ */
  function resetSimulator() {
    currentSlug = "";
    selectedDomain = null;
    domainList.innerHTML =
      '<p class="sim-domains__hint">↑ Digite o nome da empresa para ver os domínios</p>';
    previewEmpty.style.display = "flex";
    previewContent.style.display = "none";
  }

  /* Expõe estado para o modal */
  window.SimulatorState = {
    getSelected: () => selectedDomain,
    getCurrentSlug: () => currentSlug,
  };
})();
