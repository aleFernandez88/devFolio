// ─── CONFIGURACIÓN EMAILJS ──────────────────────────────────────────────────
// Reemplazá los 3 valores de abajo con los de tu cuenta en emailjs.com
const EMAILJS_PUBLIC_KEY  = "TU_PUBLIC_KEY";
const EMAILJS_SERVICE_ID  = "TU_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "TU_TEMPLATE_ID";
// ────────────────────────────────────────────────────────────────────────────

(function () {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  const form    = document.getElementById("contactForm");
  const btn     = document.getElementById("sendMessageButton");
  const success = document.getElementById("success");

  function showMessage(html, type) {
    success.innerHTML = `<div class="alert alert-${type} mt-3">${html}</div>`;
  }

  function clearMessage() {
    success.innerHTML = "";
  }

  function validate() {
    const fields = [
      { id: "name",    label: "nombre"  },
      { id: "email",   label: "email"   },
      { id: "subject", label: "asunto"  },
      { id: "message", label: "mensaje" },
    ];

    for (const field of fields) {
      const el = document.getElementById(field.id);
      if (!el.value.trim()) {
        showMessage(`Por favor completá el campo <strong>${field.label}</strong>.`, "warning");
        el.focus();
        return false;
      }
    }

    const emailEl = document.getElementById("email");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      showMessage("Por favor ingresá un <strong>email válido</strong>.", "warning");
      emailEl.focus();
      return false;
    }

    return true;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearMessage();

    if (!validate()) return;

    btn.disabled    = true;
    btn.textContent = "Enviando...";

    const params = {
      name:     document.getElementById("name").value.trim(),
      reply_to: document.getElementById("email").value.trim(),
      asunto:   document.getElementById("subject").value.trim(),
      message:  document.getElementById("message").value.trim(),
    };

    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
      .then(function () {
        showMessage("¡Mensaje enviado! Me pondré en contacto pronto.", "success");
        form.reset();
      })
      .catch(function (err) {
        console.error("EmailJS error:", err);
        showMessage("Hubo un error al enviar el mensaje. Intentá de nuevo o escribime por WhatsApp.", "danger");
      })
      .finally(function () {
        btn.disabled    = false;
        btn.textContent = "Enviar";
      });
  });
})();
