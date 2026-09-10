/* =========================================
   PASS SPOT — CORE SCRIPT
   Handles theme, currency, session,
   toasts, modals, and shared UI utilities.
========================================= */

/* =========================================
   1. SAFE STORAGE HELPERS
   localStorage wrappers that never store
   sensitive financial or auth credentials.
========================================= */
const PS = {
  store: {
    get(key, fallback = null) {
      try {
        const raw = localStorage.getItem(`ps_${key}`);
        return raw ? JSON.parse(raw) : fallback;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(`ps_${key}`, JSON.stringify(value));
      } catch {}
    },
    remove(key) {
      try {
        localStorage.removeItem(`ps_${key}`);
      } catch {}
    },
  },

  /* =========================================
     2. FORMATTING UTILITIES
  ========================================= */
  formatMoney(amount, currencyCode) {
    // Convert NGN base to selected currency for display
    const cfg =
      window.PS_DATA.CURRENCIES[currencyCode] || window.PS_DATA.CURRENCIES.NGN;
    const converted = cfg.base ? amount : amount * cfg.rate;
    const formatted = Math.abs(converted).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const sign = converted < 0 ? "-" : "";
    return `${sign}${cfg.symbol}${formatted}`;
  },

  formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  },

  formatDateTime(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  formatTime(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  /* =========================================
     3. CURRENCY MANAGEMENT
     Display currency is separate from stored
     base (NGN) values — switching does not
     corrupt underlying amounts.
  ========================================= */
  getCurrency() {
    return PS.store.get("currency", "NGN");
  },

  setCurrency(code) {
    PS.store.set("currency", code);
    document.querySelectorAll("[data-currency-switch]").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.currencySwitch === code);
    });
    document.dispatchEvent(
      new CustomEvent("ps:currencychange", { detail: { currency: code } }),
    );
    PS.toast(`Currency changed to ${code}`, "info");
  },

  /* =========================================
     4. THEME MANAGEMENT
     Light / dark mode with persistence.
  ========================================= */
  initTheme() {
    const saved = PS.store.get("theme", "light");
    document.documentElement.setAttribute("data-theme", saved);
    PS.updateThemeIcon(saved);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    PS.store.set("theme", next);
    PS.updateThemeIcon(next);
  },

  updateThemeIcon(theme) {
    document.querySelectorAll("#themeToggle").forEach((btn) => {
      btn.innerHTML =
        theme === "dark"
          ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`
          : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
    });
  },

  /* =========================================
     5. TOAST NOTIFICATIONS
  ========================================= */
  toast(message, type = "success", title = "") {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      container.setAttribute("role", "region");
      container.setAttribute("aria-live", "polite");
      document.body.appendChild(container);
    }

    const icons = {
      success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
      error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>`,
      warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/></svg>`,
      info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`,
    };

    const titles = {
      success: "Success",
      error: "Error",
      warning: "Warning",
      info: "Notice",
    };

    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-body">
        <div class="toast-title">${title || titles[type]}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Dismiss">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    `;

    el.querySelector(".toast-close").addEventListener("click", () =>
      PS.dismissToast(el),
    );
    container.appendChild(el);
    setTimeout(() => PS.dismissToast(el), 4500);
  },

  dismissToast(el) {
    if (!el || !el.parentNode) return;
    el.classList.add("is-leaving");
    setTimeout(() => el.remove(), 200);
  },

  /* =========================================
     6. MODAL SYSTEM
  ========================================= */
  openModal(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    const focusable = overlay.querySelector(
      "button, [href], input, select, textarea",
    );
    if (focusable) setTimeout(() => focusable.focus(), 60);
  },

  closeModal(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  },

  /* =========================================
     7. FORM VALIDATION HELPERS
  ========================================= */
  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  validatePhone(phone) {
    // Accepts Nigerian formats: 0XXXXXXXXXX, +234XXXXXXXXXX
    return /^(\+?234|0)[789]\d{9}$/.test(phone.replace(/\s/g, ""));
  },

  setFieldError(field, message) {
    const group = field.closest(".form-group");
    if (!group) return;
    group.classList.add("has-error");
    const err = group.querySelector(".form-error");
    if (err) err.textContent = message;
  },

  clearFieldError(field) {
    const group = field.closest(".form-group");
    if (group) group.classList.remove("has-error");
  },

  /* =========================================
     8. SESSION (FRONTEND SIMULATION)
     Not real authentication — just a UI state.
  ========================================= */
  session: {
    isLoggedIn() {
      return PS.store.get("loggedIn", false);
    },
    getUser() {
      return PS.store.get("user", {
        name: "Ada Okafor",
        email: "ada.okafor@example.com",
        role: "attendee",
        initials: "AO",
      });
    },
    login(user) {
      PS.store.set("loggedIn", true);
      PS.store.set("user", user || PS.session.getUser());
    },
    logout() {
      PS.store.remove("loggedIn");
      PS.store.remove("user");
      window.location.href = "login.html";
    },
  },

  /* =========================================
     9. FAVORITES (persisted in localStorage)
  ========================================= */
  favorites: {
    all() {
      return PS.store.get("favorites", []);
    },
    isFav(id) {
      return PS.favorites.all().includes(id);
    },
    toggle(id) {
      const list = PS.favorites.all();
      const idx = list.indexOf(id);
      if (idx >= 0) list.splice(idx, 1);
      else list.push(id);
      PS.store.set("favorites", list);
      return PS.favorites.isFav(id);
    },
  },

  /* =========================================
     10. WALLET (demo balance, demo only)
  ========================================= */
  wallet: {
    getBalance() {
      const stored = PS.store.get("wallet_balance", null);
      if (stored === null) {
        // Seed with a demo balance on first run
        PS.store.set("wallet_balance", 125000);
        return 125000;
      }
      return stored;
    },
    setBalance(value) {
      PS.store.set("wallet_balance", Math.max(0, value));
    },
    add(amount) {
      PS.wallet.setBalance(PS.wallet.getBalance() + amount);
    },
    deduct(amount) {
      PS.wallet.setBalance(PS.wallet.getBalance() - amount);
    },
  },

  /* =========================================
     11. DOM HELPERS
  ========================================= */
  qs(sel, ctx = document) {
    return ctx.querySelector(sel);
  },
  qsa(sel, ctx = document) {
    return Array.from(ctx.querySelectorAll(sel));
  },

  /* =========================================
     12. INITIALIZATION
  ========================================= */
  init() {
    PS.initTheme();

    // Theme toggle buttons
    document.addEventListener("click", (e) => {
      if (e.target.closest("#themeToggle")) PS.toggleTheme();
    });

    // Escape closes any open modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-overlay.is-open").forEach((m) => {
          PS.closeModal(m.id);
        });
      }
    });

    // Close modal on overlay click (not on modal itself)
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-overlay")) {
        PS.closeModal(e.target.id);
      }
    });

    // Currency switch buttons
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-currency-switch]");
      if (btn) PS.setCurrency(btn.dataset.currencySwitch);
    });

    // Sidebar mobile toggle
    document.addEventListener("click", (e) => {
      const toggle = e.target.closest("[data-sidebar-toggle]");
      if (toggle) {
        const sidebar = document.querySelector(".sidebar");
        const overlay = document.querySelector(".sidebar-overlay");
        if (sidebar) sidebar.classList.toggle("is-open");
        if (overlay) overlay.classList.toggle("is-open");
      }
      if (e.target.classList.contains("sidebar-overlay")) {
        document.querySelector(".sidebar")?.classList.remove("is-open");
        e.target.classList.remove("is-open");
      }
    });

    // Password visibility toggles
    document.addEventListener("click", (e) => {
      const toggle = e.target.closest(".password-toggle");
      if (!toggle) return;
      const input = toggle.parentElement.querySelector("input");
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      toggle.innerHTML = show
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 104.24 4.24M10.73 5.08A10.43 10.43 0 0112 5c7 0 10 7 10 7a13.16 13.16 0 01-1.67 2.68M6.61 6.61A13.526 13.526 0 002 12s3 7 10 7a9.74 9.74 0 005.39-1.61M2 2l20 20"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>`;
    });

    // Dropdown menus
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-dropdown-toggle]");
      document.querySelectorAll(".dropdown-menu.is-open").forEach((menu) => {
        if (
          !trigger ||
          menu !== trigger.parentElement.querySelector(".dropdown-menu")
        ) {
          menu.classList.remove("is-open");
        }
      });
      if (trigger) {
        const menu = trigger.parentElement.querySelector(".dropdown-menu");
        if (menu) menu.classList.toggle("is-open");
      }
    });

    // Password strength meters
    PS.qsa("[data-strength-for]").forEach((input) => {
      const meter = document.getElementById(input.dataset.strengthFor);
      if (!meter) return;
      input.addEventListener("input", () => {
        const val = input.value;
        let score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
        if (/\d/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;
        meter.setAttribute("data-strength", Math.min(score, 4));
      });
    });
  },
};

/* =========================================
   AUTO-INITIALIZE ON DOM READY
========================================= */
document.addEventListener("DOMContentLoaded", PS.init);

/* Expose globally for page-specific scripts */
window.PS = PS;

/* =========================================
   SHARED APP SHELL RENDERER
   Injects the sidebar and topbar into
   authenticated pages so we don't duplicate
   hundreds of lines of HTML across files.
========================================= */
window.PS_SHELL = {
  renderSidebar(active) {
    const sidebar = document.getElementById("appSidebar");
    if (!sidebar) return;

    const links = {
      dashboard: {
        href: "dashboard.html",
        label: "Dashboard",
        icon: '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
      },
      events: {
        href: "events.html",
        label: "Discover",
        icon: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
      },
      tickets: {
        href: "my-tickets.html",
        label: "My Tickets",
        icon: '<path d="M2 9a3 3 0 010-6h20a3 3 0 010 6M2 15a3 3 0 000 6h20a3 3 0 000-6M2 9v6M22 9v6"/>',
      },
      myEvents: {
        href: "my-events.html",
        label: "My Events",
        icon: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
      },
      wallet: {
        href: "wallet.html",
        label: "Wallet",
        icon: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
      },
      payments: {
        href: "payments.html",
        label: "Payments",
        icon: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>',
      },
      ads: {
        href: "advertisements.html",
        label: "Advertisements",
        icon: '<path d="M3 11h18v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6zM7 11V7a5 5 0 0110 0v4"/>',
      },
      analytics: {
        href: "analytics.html",
        label: "Analytics",
        icon: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
      },
      notifications: {
        href: "notifications.html",
        label: "Notifications",
        icon: '<path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 003.4 0"/>',
      },
      profile: {
        href: "profile.html",
        label: "Profile",
        icon: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
      },
      settings: {
        href: "settings.html",
        label: "Settings",
        icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/>',
      },
      help: {
        href: "help.html",
        label: "Help",
        icon: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/>',
      },
    };

    const link = (key) => {
      const l = links[key];
      return `<a href="${l.href}" class="sidebar-link ${active === key ? "is-active" : ""}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${l.icon}</svg>${l.label}</a>`;
    };

    sidebar.innerHTML = `
      <div class="sidebar-brand">
        <a href="dashboard.html" class="brand">Pass<span class="brand-accent">Spot</span></a>
      </div>
      <nav class="sidebar-section">
        <div class="sidebar-section-label">Main</div>
        <div class="sidebar-nav">${link("dashboard")}${link("events")}${link("tickets")}${link("myEvents")}</div>
      </nav>
      <nav class="sidebar-section">
        <div class="sidebar-section-label">Finance</div>
        <div class="sidebar-nav">${link("wallet")}${link("payments")}${link("ads")}</div>
      </nav>
      <nav class="sidebar-section">
        <div class="sidebar-section-label">Account</div>
        <div class="sidebar-nav">${link("analytics")}${link("notifications")}${link("profile")}${link("settings")}${link("help")}</div>
      </nav>
      <div class="sidebar-footer">
        <button class="sidebar-link" id="logoutBtn" style="width:100%;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          Log out
        </button>
      </div>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      if (confirm("Log out of Pass Spot?")) PS.session.logout();
    });
  },

  renderTopbar(title) {
    const topbar = document.getElementById("appTopbar");
    if (!topbar) return;
    const user = PS.session.getUser();
    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    topbar.innerHTML = `
      <button class="icon-btn" data-sidebar-toggle aria-label="Open menu" style="display:none;" id="mobileMenuBtn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
      <h1 class="topbar-title">${title}</h1>
      <div class="topbar-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input class="form-input" type="search" placeholder="Search…" id="globalSearch">
        <div class="search-results" id="searchResults"></div>
      </div>
      <div class="topbar-actions">
        <a href="wallet.html" class="wallet-chip">
          <span class="wallet-chip-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg></span>
          <span class="wallet-chip-info">
            <span class="wallet-chip-label">Wallet</span>
            <span class="wallet-chip-value" id="headerBalance">${PS.formatMoney(PS.wallet.getBalance(), PS.getCurrency())}</span>
          </span>
        </a>
        <div class="currency-switch">
          <button type="button" data-currency-switch="NGN" class="${PS.getCurrency() === "NGN" ? "is-active" : ""}">₦ NGN</button>
          <button type="button" data-currency-switch="USD" class="${PS.getCurrency() === "USD" ? "is-active" : ""}">$ USD</button>
        </div>
        <button class="icon-btn" id="themeToggle" aria-label="Toggle theme">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
        </button>
        <a href="notifications.html" class="icon-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 003.4 0"/></svg><span class="dot-badge"></span></a>
        <div class="dropdown">
          <button class="avatar-dropdown" data-dropdown-toggle><span class="avatar">${initials}</span></button>
          <div class="dropdown-menu">
            <div class="dropdown-header">
              <div class="fw-semibold text-sm">${user.name}</div>
              <div class="text-xs text-muted">${user.email}</div>
            </div>
            <a href="profile.html" class="dropdown-item">Profile</a>
            <a href="settings.html" class="dropdown-item">Settings</a>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item danger" id="logoutBtn2">Log out</button>
          </div>
        </div>
      </div>
    `;

    if (window.innerWidth <= 860)
      document.getElementById("mobileMenuBtn").style.display = "flex";
    window.addEventListener("resize", () => {
      document.getElementById("mobileMenuBtn").style.display =
        window.innerWidth <= 860 ? "flex" : "none";
    });

    document.getElementById("logoutBtn2").addEventListener("click", () => {
      if (confirm("Log out of Pass Spot?")) PS.session.logout();
    });

    // Re-render balance on currency change
    document.addEventListener("ps:currencychange", () => {
      document.getElementById("headerBalance").textContent = PS.formatMoney(
        PS.wallet.getBalance(),
        PS.getCurrency(),
      );
    });
  },
};

// ttttttttttttttttttttttttttttttttttttttttttttt

window.PS_ADMIN = window.PS_ADMIN || {
  renderSidebar(active) {
    const sidebar = document.getElementById("appSidebar");
    if (!sidebar) return;
    const links = {
      dashboard: ["dashboard.html", "Dashboard"],
      users: ["users.html", "Users"],
      events: ["events.html", "Events"],
      tickets: ["tickets.html", "Tickets"],
      transactions: ["transactions.html", "Transactions"],
      withdrawals: ["withdrawals.html", "Withdrawals"],
      advertisements: ["advertisements.html", "Advertisements"],
      reports: ["reports.html", "Reports"],
      audit: ["audit-logs.html", "Audit Logs"],
      settings: ["settings.html", "Settings"],
    };
    sidebar.innerHTML = `
      <div class="sidebar-brand"><a href="dashboard.html" class="brand">Pass<span class="brand-accent">Spot</span> <span class="badge badge-error" style="font-size:10px;">ADMIN</span></a></div>
      <nav class="sidebar-section">
        <div class="sidebar-section-label">Platform</div>
        <div class="sidebar-nav">
          ${Object.entries(links)
            .map(
              ([k, [href, label]]) =>
                `<a href="${href}" class="sidebar-link ${active === k ? "is-active" : ""}">${label}</a>`,
            )
            .join("")}
        </div>
      </nav>
      <div class="sidebar-footer"><a href="../dashboard.html" class="sidebar-link">← Exit admin</a></div>
    `;
  },
  renderTopbar(title) {
    const topbar = document.getElementById("appTopbar");
    if (!topbar) return;
    topbar.innerHTML = `
      <button class="icon-btn" data-sidebar-toggle aria-label="Menu" style="display:none;" id="mobileMenuBtn">☰</button>
      <h1 class="topbar-title">${title}</h1>
      <div class="topbar-actions">
        <div class="currency-switch">
          <button type="button" data-currency-switch="NGN" class="${PS.getCurrency() === "NGN" ? "is-active" : ""}">₦ NGN</button>
          <button type="button" data-currency-switch="USD" class="${PS.getCurrency() === "USD" ? "is-active" : ""}">$ USD</button>
        </div>
        <button class="icon-btn" id="themeToggle" aria-label="Toggle theme"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg></button>
        <span class="avatar">AD</span>
      </div>
    `;
  },
};

// Later Learnt --------------------------------------------------- Learnt Later

/* =========================================
   ADMIN SHELL RENDERER
   Shared across all /admin/* pages.
   Provides the admin sidebar + topbar so
   each admin page only needs its own body.
========================================= */
window.PS_ADMIN = {
  renderSidebar(active) {
    const sidebar = document.getElementById("appSidebar");
    if (!sidebar) return;

    const links = {
      dashboard: ["dashboard.html", "Dashboard"],
      users: ["users.html", "Users"],
      events: ["events.html", "Events"],
      tickets: ["tickets.html", "Tickets"],
      transactions: ["transactions.html", "Transactions"],
      withdrawals: ["withdrawals.html", "Withdrawals"],
      advertisements: ["advertisements.html", "Advertisements"],
      reports: ["reports.html", "Reports"],
      audit: ["audit-logs.html", "Audit Logs"],
      settings: ["settings.html", "Settings"],
    };

    sidebar.innerHTML = `
      <div class="sidebar-brand">
        <a href="dashboard.html" class="brand">
          Pass<span class="brand-accent">Spot</span>
          <span class="badge badge-error" style="font-size:10px;margin-left:6px;">ADMIN</span>
        </a>
      </div>
      <nav class="sidebar-section">
        <div class="sidebar-section-label">Platform</div>
        <div class="sidebar-nav">
          ${Object.entries(links)
            .map(
              ([key, [href, label]]) => `
            <a href="${href}" class="sidebar-link ${active === key ? "is-active" : ""}">
              ${label}
            </a>
          `,
            )
            .join("")}
        </div>
      </nav>
      <div class="sidebar-footer">
        <a href="../dashboard.html" class="sidebar-link">← Exit admin</a>
      </div>
    `;
  },

  renderTopbar(title) {
    const topbar = document.getElementById("appTopbar");
    if (!topbar) return;

    topbar.innerHTML = `
      <button class="icon-btn" data-sidebar-toggle aria-label="Open menu" style="display:none;" id="mobileMenuBtn">☰</button>
      <h1 class="topbar-title">${title}</h1>
      <div class="topbar-actions">
        <div class="currency-switch" role="group" aria-label="Currency">
          <button type="button" data-currency-switch="NGN" class="${PS.getCurrency() === "NGN" ? "is-active" : ""}">₦ NGN</button>
          <button type="button" data-currency-switch="USD" class="${PS.getCurrency() === "USD" ? "is-active" : ""}">$ USD</button>
        </div>
        <button class="icon-btn" id="themeToggle" aria-label="Toggle theme">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          </svg>
        </button>
        <span class="avatar">AD</span>
      </div>
    `;

    if (window.innerWidth <= 860) {
      document.getElementById("mobileMenuBtn").style.display = "flex";
    }
    window.addEventListener("resize", () => {
      const btn = document.getElementById("mobileMenuBtn");
      if (btn) btn.style.display = window.innerWidth <= 860 ? "flex" : "none";
    });
  },
};
