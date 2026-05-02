(function () {
  // Elementos do DOM
  const input = document.getElementById("companyInput");
  const emailBox = document.getElementById("emailBox");
  const domainCards = document.querySelectorAll(".syntra-domain-card");
  const errorMsg = document.getElementById("inputError");

  // Estado do domínio selecionado (inicia .com para pré‑visualização)
  let selectedDomain = ".co.mz";

  // Extensões proibidas
  const forbiddenExtensions = [
    ".com",
    ".co.mz",
    ".ac.mz",
    ".org.mz",
    ".net",
    ".org",
  ];
  // Regex para detetar qualquer extensão no final (ignorando case)
  const forbiddenRegex = new RegExp(
    `(\\.${forbiddenExtensions.map((ext) => ext.replace(/\./g, "\\.")).join("|\\.")})(\\/|$)`,
    "i",
  );

  // Verifica se o nome da empresa é válido (não contém domínio e não está vazio)
  function isCompanyNameValid(name) {
    if (!name.trim()) return false;
    return !forbiddenRegex.test(name.trim());
  }

  // Função slug
  function cleanCompanyName(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  // Gerar 4 e-mails com domínio
  function generateEmails(name, domain) {
    const clean = cleanCompanyName(name || "empresa");
    return [
      `comercial@${clean}${domain}`,
      `suporte@${clean}${domain}`,
      `info@${clean}${domain}`,
    ];
  }

  // Renderizar e-mails (normais ou de erro)
  function renderEmails(emails, isValid) {
    if (!isValid && input.value.trim() !== "") {
      emailBox.innerHTML = [
        "Nome inválido",
        "Nome inválido",
        "Nome inválido",
        "Nome inválido",
      ]
        .map(
          (t) =>
            `<div class="syntra-email-item syntra-email-item--invalid">⚠️ ${t}</div>`,
        )
        .join("");
    } else {
      emailBox.innerHTML = emails
        .map((email) => `<div class="syntra-email-item">${email}</div>`)
        .join("");
    }
  }

  // Atualizar toda a interface com base no estado atual
  function updateUI(applyShake = false) {
    const rawName = input.value;
    const valid = isCompanyNameValid(rawName);

    // Input vazio → estado neutro
    if (rawName.trim() === "") {
      input.classList.remove("syntra-input--error");
      errorMsg.style.display = "none";
      renderEmails(generateEmails("", selectedDomain), true);
      return;
    }

    // Inválido
    if (!valid) {
      input.classList.add("syntra-input--error");
      errorMsg.style.display = "block";
      renderEmails([], false);

      // Se veio de um clique (applyShake), reaplica a animação
      if (applyShake) {
        // Reiniciar animação: remove e adiciona a classe
        input.classList.remove("syntra-input--error");
        void input.offsetWidth; // trigger reflow
        input.classList.add("syntra-input--error");
      }
    } else {
      // Válido
      input.classList.remove("syntra-input--error");
      errorMsg.style.display = "none";
      renderEmails(generateEmails(rawName, selectedDomain), true);
    }
  }

  // Evento de digitação
  input.addEventListener("input", () => updateUI(false));

  // Função para abrir WhatsApp
  function openWhatsApp(name, domain) {
    const clean = cleanCompanyName(name);
    const phone = "258871582209"; // <-- SUBSTITUIR PELO NÚMERO REAL
    const message =
      `Olá Syntra, quero adquirir um domínio e e-mail profissional.\n\n` +
      `Empresa: ${name}\n` +
      `Domínio: ${domain}\n\n` +
      `E-mails gerados:\n` +
      `- comercial@${clean}${domain}\n` +
      `- suporte@${clean}${domain}\n` +
      `- info@${clean}${domain}\n` +
      `- contacto@${clean}${domain}\n\n` +
      `Gostaria de avançar com o serviço.`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  // Clique nos domínios
  domainCards.forEach((card) => {
    card.addEventListener("click", function () {
      const domain = this.dataset.domain;
      const rawName = input.value.trim();

      // Nome vazio
      if (!rawName) {
        input.focus();
        // Ativar visual de erro (campo vermelho + shake) sem mostrar a mensagem de "domínio inválido"
        input.classList.add("syntra-input--error");
        void input.offsetWidth;
        input.classList.remove("syntra-input--error");
        void input.offsetWidth;
        input.classList.add("syntra-input--error");
        // Mas queremos uma mensagem específica? Podemos modificar o texto do erro ou apenas focar.
        // Vamos mostrar uma mensagem temporária opcional ou apenas o shake.
        // Para consistência, não mostraremos a mensagem de domínio inválido, apenas o shake.
        // No entanto, a mensagem de erro está associada ao domínio inválido. Vamos criar uma lógica.
        // Se o nome estiver vazio, o campo fica vermelho e balança, mas sem texto de erro.
        // O texto de erro só aparece se o nome tiver um domínio.
        errorMsg.style.display = "none"; // O input error message é só para domínio.
        // Pode-se exibir uma dica rápida: vou adicionar um placeholder style ou tooltip? Vou manter simples.
        return;
      }

      // Nome inválido (contém domínio)
      if (!isCompanyNameValid(rawName)) {
        // Aplica o shake e mantém a mensagem de erro
        updateUI(true); // true → força refresh com shake
        input.focus();
        return;
      }

      // Nome válido → proceder
      selectedDomain = domain;
      updateUI(false);
      openWhatsApp(rawName, domain);
    });
  });

  // Inicialização
  input.value = "";
  updateUI(false);
})();
