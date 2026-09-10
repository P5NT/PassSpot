/* =========================================
   PASS SPOT — GLOBAL BEHAVIOURS
   Theme switching, toasts, modals,
   sidebar, dropdowns, password toggle,
   form validation helpers and utilities.
   Loaded on every page.
========================================= */

/* ---------- SVG ICON REGISTRY ----------
   Central place for inline SVG so icon
   usage stays consistent across pages. */
const ICONS = {
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  checkCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
};

/* =========================================
   THEME
   Reads preference from localStorage on
   load; toggles between light and dark.
========================================= */
const Theme = {
  key: "ps-theme",

  init() {
    const saved = localStorage.getItem(this.key);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    this.updateToggleIcon();
  },

  current() {
    return document.documentElement.getAttribute("data-theme") || "light";
  },

  toggle() {
    const next = this.current() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(this.key, next);
    this.updateToggleIcon();
  },

  updateToggleIcon() {
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.innerHTML = this.current() === "dark" ? ICONS.sun : ICONS.moon;
      btn.setAttribute(
        "aria-label",
        this.current() === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode",
      );
    });
  },
};

/* =========================================
   TOASTS
   Lightweight, non-blocking notifications.
========================================= */
const Toast = {
  container: null,

  ensure() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.className = "toast-container";
      document.body.appendChild(this.container);
    }
  },

  show(type, title, msg = "", duration = 3800) {
    this.ensure();
    const iconMap = {
      success: ICONS.checkCircle,
      error: ICONS.alert,
      warning: ICONS.warning,
      info: ICONS.info,
    };

    const el = document.createElement("div");
    el.className = `toast toast-${type}`;
    el.setAttribute("role", "status");
    el.innerHTML = `
            <span class="toast-icon">${iconMap[type] || ICONS.info}</span>
            <div class="toast-body">
                <div class="toast-title">${title}</div>
                ${msg ? `<div class="toast-msg">${msg}</div>` : ""}
            </div>
            <button class="toast-close" aria-label="Dismiss notification">${ICONS.x}</button>
        `;
    this.container.appendChild(el);

    const remove = () => {
      el.classList.add("is-leaving");
      setTimeout(() => el.remove(), 250);
    };
    el.querySelector(".toast-close").addEventListener("click", remove);
    setTimeout(remove, duration);
  },

  success(t, m) {
    this.show("success", t, m);
  },
  error(t, m) {
    this.show("error", t, m);
  },
  warning(t, m) {
    this.show("warning", t, m);
  },
  info(t, m) {
    this.show("info", t, m);
  },
};

/* =========================================
   MODAL
   Reusable confirmation modal with
   Escape-key and click-outside dismissal.
========================================= */
const Modal = {
  open({
    title,
    desc,
    confirmText = "Confirm",
    cancelText = "Cancel",
    danger = false,
    onConfirm,
  }) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
            <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <button class="modal-close" aria-label="Close">${ICONS.x}</button>
                <div class="modal-header">
                    <div class="modal-icon" ${danger ? "" : 'style="background:rgba(108,43,217,.12);color:var(--primary)"'}>
                        ${danger ? ICONS.alert : ICONS.info}
                    </div>
                    <div>
                        <h3 id="modal-title" class="modal-title">${title}</h3>
                        <p class="modal-desc">${desc}</p>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-ghost" data-cancel>${cancelText}</button>
                    <button class="btn ${danger ? "btn-danger" : "btn-primary"}" data-confirm>${confirmText}</button>
                </div>
            </div>
        `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    document.body.style.overflow = "hidden";

    const close = () => {
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
      setTimeout(() => overlay.remove(), 250);
      document.removeEventListener("keydown", onKey);
    };
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };

    overlay.querySelector(".modal-close").addEventListener("click", close);
    overlay.querySelector("[data-cancel]").addEventListener("click", close);
    overlay.querySelector("[data-confirm]").addEventListener("click", () => {
      close();
      onConfirm && onConfirm();
    });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", onKey);
  },
};

/* =========================================
   PASSWORD VISIBILITY TOGGLE
   Attach to any [data-pwd-toggle] wrapper.
========================================= */
function initPasswordToggles() {
  document.querySelectorAll("[data-pwd-toggle]").forEach((wrap) => {
    const input = wrap.querySelector("input");
    const btn = wrap.querySelector(".input-suffix");
    if (!input || !btn) return;
    btn.innerHTML = ICONS.eye;
    btn.addEventListener("click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.innerHTML = show ? ICONS.eyeOff : ICONS.eye;
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });
}

/* =========================================
   PASSWORD STRENGTH METER
   Returns a level from 0 (weak) to 4 (strong).
========================================= */
function scorePassword(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

function updateStrength(el, pwd) {
  const level = pwd ? Math.max(1, scorePassword(pwd)) : 0;
  el.dataset.level = level;
  const labels = [
    "",
    "Weak password",
    "Fair password",
    "Good password",
    "Strong password",
  ];
  const label = el.parentElement.querySelector(".pwd-strength-label");
  if (label) label.textContent = labels[level];
}

/* =========================================
   FORM VALIDATION HELPERS
========================================= */
const Validators = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  phone: (v) => /^[+]?[\d\s()-]{7,}$/.test(v.trim()),
  required: (v) => v != null && String(v).trim().length > 0,
  minLen: (v, n) => v.length >= n,
};

function showError(input, message) {
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");
  const group = input.closest(".form-group");
  const err = group && group.querySelector(".form-error");
  if (err) {
    err.innerHTML = `${ICONS.alert.replace("viewBox", 'width="14" height="14" viewBox')} <span>${message}</span>`;
    err.classList.add("is-visible");
  }
  input.setAttribute("aria-invalid", "true");
}

function clearError(input) {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
  const group = input.closest(".form-group");
  const err = group && group.querySelector(".form-error");
  if (err) err.classList.remove("is-visible");
  input.removeAttribute("aria-invalid");
}

/* =========================================
   SIDEBAR / MOBILE NAV
========================================= */
function initSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".menu-toggle");
  if (!sidebar || !toggle) return;

  const overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);

  const open = () => {
    sidebar.classList.add("is-open");
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  toggle.addEventListener("click", open);
  overlay.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
  sidebar
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", close));
}

/* =========================================
   DROPDOWNS
   Simple toggle menus with outside-click close.
========================================= */
function initDropdowns() {
  document.querySelectorAll("[data-dropdown]").forEach((wrap) => {
    const trigger = wrap.querySelector("[data-dropdown-trigger]");
    const menu = wrap.querySelector("[data-dropdown-menu]");
    if (!trigger || !menu) return;
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll("[data-dropdown-menu].is-open").forEach((m) => {
        if (m !== menu) m.classList.remove("is-open");
      });
      menu.classList.toggle("is-open");
    });
  });
  document.addEventListener("click", () => {
    document
      .querySelectorAll("[data-dropdown-menu].is-open")
      .forEach((m) => m.classList.remove("is-open"));
  });
}

/* =========================================
   LANDING NAV SCROLL STATE
========================================= */
function initNavScroll() {
  const nav = document.querySelector(".landing-nav");
  if (!nav) return;
  const check = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  check();
  window.addEventListener("scroll", check, { passive: true });
}

/* =========================================
   FAQ ACCORDION
========================================= */
function initFAQ() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", () => {
      const open = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach((o) => {
        o.classList.remove("is-open");
        o.querySelector(".faq-a").style.maxHeight = "0px";
      });
      if (!open) {
        item.classList.add("is-open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });
}

/* =========================================
   AUTH STATE (MOCK)
   Frontend-only simulation. DO NOT treat
   this as real authentication.
========================================= */
const Auth = {
  key: "ps-user",

  set(user) {
    localStorage.setItem(this.key, JSON.stringify(user));
  },
  get() {
    try {
      return JSON.parse(localStorage.getItem(this.key));
    } catch {
      return null;
    }
  },
  isLoggedIn() {
    return !!this.get();
  },
  logout() {
    localStorage.removeItem(this.key);
  },

  /** Redirects to login if no mock session exists. */
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = "login.html";
      return false;
    }
    return true;
  },
};

/* =========================================
   FAVORITES (localStorage)
========================================= */
const Favorites = {
  key: "ps-favs",
  all() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || [];
    } catch {
      return [];
    }
  },
  has(id) {
    return this.all().includes(id);
  },
  toggle(id) {
    const list = this.all();
    const idx = list.indexOf(id);
    if (idx === -1) list.push(id);
    else list.splice(idx, 1);
    localStorage.setItem(this.key, JSON.stringify(list));
    return idx === -1;
  },
};

/* =========================================
   FORMATTERS
========================================= */
const fmt = {
  naira: (n) => "₦" + Number(n).toLocaleString("en-NG"),
  date: (d) =>
    new Date(d).toLocaleDateString("en-NG", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  shortDate: (d) =>
    new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short" }),
  initials: (a, b) => ((a?.[0] || "") + (b?.[0] || "")).toUpperCase(),
};

/* =========================================
   BOOTSTRAP — runs on every page
========================================= */
document.addEventListener("DOMContentLoaded", () => {
  Theme.init();
  document
    .querySelectorAll("[data-theme-toggle]")
    .forEach((btn) => btn.addEventListener("click", () => Theme.toggle()));

  initPasswordToggles();
  initSidebar();
  initDropdowns();
  initNavScroll();
  initFAQ();
});
