const toggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
    document.body.classList.toggle("menu-open", !open);
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }));
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const showDemoSuccess = (form, message) => {
  const status = form.querySelector("[data-form-status]");
  status.textContent = message;
  status.classList.add("is-visible");
  status.setAttribute("tabindex", "-1");
  status.focus();
  form.reset();
};

document.querySelectorAll("[data-demo-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (form.querySelector('[name="website"]')?.value) return;

    if (form.matches("[data-emergency-form]")) {
      showDemoSuccess(form, "Demo request validated. Nothing was sent, stored, scheduled, or monitored. A purchased website requires the electrical contractor's approved provider, credentials, safety language, and end-to-end testing before launch.");
      return;
    }

    const services = form.querySelectorAll('[name="services"]:checked');
    const firstService = form.querySelector('[name="services"]');
    if (!services.length && firstService) {
      firstService.setCustomValidity("Choose at least one service.");
      firstService.reportValidity();
      firstService.setCustomValidity("");
      return;
    }

    const firstName = form.querySelector('[name="firstName"]')?.value.trim();
    showDemoSuccess(form, `${firstName ? `${firstName}, t` : "T"}hanks for testing the service form. Nothing was sent, stored, scheduled, uploaded, or paid. Email, CRM, or dispatch delivery is client-specific and activated only after credentials and end-to-end testing.`);
  });
});

const requestedService = new URLSearchParams(window.location.search).get("service");
if (requestedService) {
  const checkbox = document.querySelector(`[data-service="${CSS.escape(requestedService)}"]`);
  if (checkbox) checkbox.checked = true;
  const serviceSelect = document.querySelector('[name="serviceType"]');
  if (serviceSelect && [...serviceSelect.options].some((option) => option.value === requestedService)) {
    serviceSelect.value = requestedService;
  }
}
