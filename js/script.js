/* =========================================
   DYNAMIC API LOADER
   Automatically injects js/api.js into every 
   page that loads script.js.
========================================= */
(function loadAPI() {
  // Determine if we are in the root folder or the /admin/ folder
  const isAdmin = window.location.pathname.includes("/admin/");
  const apiPath = isAdmin ? "../js/api.js" : "js/api.js";

  // Only load it if it hasn't been loaded yet
  if (!document.querySelector(`script[src="${apiPath}"]`)) {
    const script = document.createElement("script");
    script.src = apiPath;
    // We insert it before script.js so it's available immediately
    document.head.appendChild(script);
  }
})();

/* =========================================
   PASS SPOT — CORE SCRIPT
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

  formatMoney(amount, currencyCode) {
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

  getCurrency() {
    return PS.store.get("currency", "NGN");
  },

  setCurrency(code) {
    PS.store.set("currency", code);
    PS.syncCurrencySwitches();
    document.dispatchEvent(
      new CustomEvent("ps:currencychange", { detail: { currency: code } }),
    );
    PS.toast(`Currency changed to ${code}`, "info");
  },

  syncCurrencySwitches() {
    const code = PS.getCurrency();
    document.querySelectorAll("[data-currency-switch]").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.currencySwitch === code);
    });
  },

  initTheme() {
    const saved = PS.store.get("theme", "light");
    document.documentElement.setAttribute("data-theme", saved);
    PS.updateThemeIcon(saved);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    PS.setTheme(current === "dark" ? "light" : "dark");
  },

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    PS.store.set("theme", theme);
    PS.updateThemeIcon(theme);
    document.dispatchEvent(
      new CustomEvent("ps:themechange", { detail: { theme } }),
    );
  },

  updateThemeIcon(theme) {
    document.querySelectorAll("#themeToggle").forEach((btn) => {
      btn.innerHTML =
        theme === "dark"
          ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`
          : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
    });
  },

  toast(message, type = "success", title = "") {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      container.setAttribute("role", "region");
      container.setAttribute("aria-live", "polite");
      document.body.appendChild(container);
    }
    container.innerHTML = "";

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

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
  validatePhone(phone) {
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
     SESSION
     Distinguishes admin vs regular user via
     ps_isAdmin flag.
  ========================================= */
  session: {
    isLoggedIn() {
      return PS.store.get("loggedIn", false);
    },
    isAdmin() {
      return PS.store.get("isAdmin", false) === true;
    },
    getUser() {
      return PS.store.get("user", {
        name: "Ada Okafor",
        email: "ada.okafor@example.com",
        role: "attendee",
        profilePic: null,
        initials: "AO",
      });
    },
    login(user) {
      PS.store.set("loggedIn", true);
      PS.store.set("isAdmin", false);
      PS.store.set("user", user || PS.session.getUser());
    },
    loginAsAdmin(admin) {
      PS.store.set("loggedIn", true);
      PS.store.set("isAdmin", true);
      PS.store.set("user", {
        name: admin.name,
        email: admin.email,
        role: "admin",
        profilePic: null,
      });
    },
    logout() {
      PS.store.remove("loggedIn");
      PS.store.remove("isAdmin");
      PS.store.remove("user");
      window.location.href = "login.html";
    },
    getRole() {
      return PS.session.getUser().role || "attendee";
    },
    isOrganizer() {
      return PS.session.getRole() === "organizer";
    },
    upgradeToOrganizer() {
      const user = PS.session.getUser();
      user.role = "organizer";
      PS.store.set("user", user);
      return user;
    },
    setProfilePic(dataUrl) {
      const user = PS.session.getUser();
      user.profilePic = dataUrl;
      PS.store.set("user", user);
      return user;
    },
    clearProfilePic() {
      const user = PS.session.getUser();
      user.profilePic = null;
      PS.store.set("user", user);
      return user;
    },

    // Guard for admin pages — call at top of
    // every /admin/* script. Redirects to login
    // if the visitor isn't an admin.
    requireAdmin() {
      if (!PS.session.isAdmin()) {
        window.location.href = "../login.html";
        return false;
      }
      return true;
    },
  },

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

  wallet: {
    getBalance() {
      const stored = PS.store.get("wallet_balance", null);
      if (stored === null) {
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

  guest: {
    allOrders() {
      return PS.store.get("guest_orders", []);
    },
    allTickets() {
      return PS.guest.allOrders().flatMap((o) => o.tickets || []);
    },
    findOrder(orderId) {
      return PS.guest.allOrders().find((o) => o.orderId === orderId);
    },
    findTicket(token) {
      return PS.guest.allTickets().find((t) => t.token === token);
    },
    findOrdersByEmail(email) {
      return PS.guest
        .allOrders()
        .filter(
          (o) =>
            (o.guestEmail || "").toLowerCase() === (email || "").toLowerCase(),
        );
    },
    createOrder(data) {
      const orderId =
        "GS-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      const now = new Date().toISOString();
      const tickets = Array.from({ length: data.qty }, (_, i) => ({
        token: `${orderId}-${i + 1}-of-${data.qty}`,
        index: i + 1,
        total: data.qty,
        attendeeName: i === 0 ? data.guestName : "",
        used: false,
        usedAt: null,
      }));
      const order = { orderId, ...data, purchasedAt: now, tickets };
      const existing = PS.guest.allOrders();
      existing.unshift(order);
      PS.store.set("guest_orders", existing.slice(0, 20));
      return order;
    },
    markUsed(token) {
      const orders = PS.guest.allOrders();
      for (const order of orders) {
        const ticket = (order.tickets || []).find((t) => t.token === token);
        if (ticket) {
          ticket.used = true;
          ticket.usedAt = new Date().toISOString();
          PS.store.set("guest_orders", orders);
          return ticket;
        }
      }
      return null;
    },
    getOrderForTicket(token) {
      return PS.guest
        .allOrders()
        .find((o) => (o.tickets || []).some((t) => t.token === token));
    },
    allScans() {
      return PS.store.get("scans", []);
    },
    logScan({ token, eventTitle, attendeeName, result, reason }) {
      const scans = PS.guest.allScans();
      scans.unshift({
        token,
        eventTitle,
        attendeeName,
        result,
        reason,
        at: new Date().toISOString(),
      });
      PS.store.set("scans", scans.slice(0, 100));
    },
  },

  scanners: {
    all() {
      return PS.store.get("scanner_passes", []);
    },
    generateCode() {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let code = "";
      for (let i = 0; i < 4; i++)
        code += chars[Math.floor(Math.random() * chars.length)];
      return `SCAN-${code}`;
    },
    create({ eventId, eventTitle, label, createdBy }) {
      const passes = PS.scanners.all();
      let code;
      do {
        code = PS.scanners.generateCode();
      } while (passes.some((p) => p.code === code));
      const pass = {
        code,
        eventId,
        eventTitle,
        label: label || "Main entrance",
        createdBy: createdBy || "Organizer",
        createdAt: new Date().toISOString(),
        revokedAt: null,
        scanCount: 0,
      };
      passes.unshift(pass);
      PS.store.set("scanner_passes", passes.slice(0, 50));
      return pass;
    },
    validate(code) {
      const pass = PS.scanners.all().find((p) => p.code === code);
      if (!pass) return { ok: false, reason: "not_found" };
      if (pass.revokedAt) return { ok: false, reason: "revoked", pass };
      return { ok: true, pass };
    },
    revoke(code) {
      const passes = PS.scanners.all();
      const pass = passes.find((p) => p.code === code);
      if (pass) {
        pass.revokedAt = new Date().toISOString();
        PS.store.set("scanner_passes", passes);
        return pass;
      }
      return null;
    },
    incrementScan(code) {
      const passes = PS.scanners.all();
      const pass = passes.find((p) => p.code === code);
      if (pass) {
        pass.scanCount = (pass.scanCount || 0) + 1;
        PS.store.set("scanner_passes", passes);
      }
    },
    forEvent(eventId) {
      return PS.scanners
        .all()
        .filter((p) => p.eventId === eventId && !p.revokedAt);
    },
  },

  /* =========================================
     ADMIN NOTIFICATIONS (platform-wide
     announcements admins send).
  ========================================= */
  announcements: {
    all() {
      return PS.store.get("announcements", []);
    },
    send({ title, body, audience }) {
      const list = PS.announcements.all();
      const record = {
        id: "ANN-" + Date.now().toString(36).toUpperCase(),
        title,
        body,
        audience,
        sentBy: PS.session.getUser().name,
        sentAt: new Date().toISOString(),
        recipientCount: PS.announcements.estimateRecipients(audience),
      };
      list.unshift(record);
      PS.store.set("announcements", list.slice(0, 50));
      return record;
    },
    delete(id) {
      const list = PS.announcements.all().filter((a) => a.id !== id);
      PS.store.set("announcements", list);
    },
    estimateRecipients(audience) {
      // Demo estimate — count seeded users matching the audience
      const base = 24518; // total registered users (demo)
      if (audience === "all") return base;
      if (audience === "attendees") return 23676;
      if (audience === "organizers") return 842;
      return 0;
    },
  },

  qs(sel, ctx = document) {
    return ctx.querySelector(sel);
  },
  qsa(sel, ctx = document) {
    return Array.from(ctx.querySelectorAll(sel));
  },

  init() {
    PS.initTheme();

    document.addEventListener("click", (e) => {
      if (e.target.closest("#themeToggle")) PS.toggleTheme();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document
          .querySelectorAll(".modal-overlay.is-open")
          .forEach((m) => PS.closeModal(m.id));
      }
    });

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-overlay"))
        PS.closeModal(e.target.id);
    });

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-currency-switch]");
      if (btn) PS.setCurrency(btn.dataset.currencySwitch);
    });

    PS.syncCurrencySwitches();

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

document.addEventListener("DOMContentLoaded", PS.init);
window.PS = PS;

/* =========================================
   SHARED APP SHELL RENDERER
========================================= */
window.PS_SHELL = {
  renderSidebar(active) {
    const sidebar = document.getElementById("appSidebar");
    if (!sidebar) return;

    const isOrganizer = PS.session.isOrganizer();

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
        organizerOnly: true,
      },
      voting: {
        href: "my-voting-events.html",
        label: "Voting Events",
        icon: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>',
        organizerOnly: true,
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
        organizerOnly: true,
      },
      analytics: {
        href: "analytics.html",
        label: "Analytics",
        icon: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
        organizerOnly: true,
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
      if (l.organizerOnly && !isOrganizer) return "";
      return `<a href="${l.href}" class="sidebar-link ${active === key ? "is-active" : ""}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${l.icon}</svg>${l.label}</a>`;
    };

    sidebar.innerHTML = `
      <div class="sidebar-brand">
        <a href="dashboard.html" class="brand">Pass<span class="brand-accent">Spot</span></a>
      </div>
      <nav class="sidebar-section">
        <div class="sidebar-section-label">Main</div>
        <div class="sidebar-nav">${link("dashboard")}${link("events")}${link("tickets")}${link("myEvents")}${link("voting")}</div>
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
    const currency = PS.getCurrency();
    const roleLabel = PS.session.isOrganizer() ? "Organizer" : "Attendee";
    const roleBadgeClass = PS.session.isOrganizer()
      ? "badge-primary"
      : "badge-neutral";

    const avatarHTML = user.profilePic
      ? `<span class="avatar" style="padding:0;overflow:hidden;"><img src="${user.profilePic}" alt="" style="width:100%;height:100%;object-fit:cover;"></span>`
      : `<span class="avatar">${initials}</span>`;

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
            <span class="wallet-chip-value" id="headerBalance">${PS.formatMoney(PS.wallet.getBalance(), currency)}</span>
          </span>
        </a>
        <div class="currency-switch">
          <button type="button" data-currency-switch="NGN" class="${currency === "NGN" ? "is-active" : ""}">₦ NGN</button>
          <button type="button" data-currency-switch="USD" class="${currency === "USD" ? "is-active" : ""}">$ USD</button>
        </div>
        <button class="icon-btn" id="themeToggle" aria-label="Toggle theme">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
        </button>
        <a href="notifications.html" class="icon-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 003.4 0"/></svg><span class="dot-badge"></span></a>
        <div class="dropdown">
          <button class="avatar-dropdown" data-dropdown-toggle>${avatarHTML}</button>
          <div class="dropdown-menu">
            <div class="dropdown-header">
              <div class="fw-semibold text-sm">${user.name}</div>
              <div class="text-xs text-muted">${user.email}</div>
              <div style="margin-top:6px;"><span class="badge ${roleBadgeClass}">${roleLabel}</span></div>
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

    document.addEventListener("ps:currencychange", () => {
      document.getElementById("headerBalance").textContent = PS.formatMoney(
        PS.wallet.getBalance(),
        PS.getCurrency(),
      );
    });
  },
};

/* =========================================
   ADMIN SHELL RENDERER
   Updated sidebar to include the 4 new pages.
========================================= */
window.PS_ADMIN = {
  renderSidebar(active) {
    const sidebar = document.getElementById("appSidebar");
    if (!sidebar) return;

    const links = {
      dashboard: ["dashboard.html", "Dashboard"],
      users: ["users.html", "Users"],
      organizers: ["organizers.html", "Organizers"],
      events: ["events.html", "Events"],
      tickets: ["tickets.html", "Tickets"],
      transactions: ["transactions.html", "Transactions"],
      deposits: ["deposits.html", "Deposits"],
      withdrawals: ["withdrawals.html", "Withdrawals"],
      advertisements: ["advertisements.html", "Advertisements"],
      categories: ["categories.html", "Categories"],
      notifications: ["notifications.html", "Notifications"],
      reports: ["reports.html", "Reports"],
      audit: ["audit-logs.html", "Audit Logs"],
      settings: ["settings.html", "Settings"],
    };

    const user = PS.session.getUser();
    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

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
            <a href="${href}" class="sidebar-link ${active === key ? "is-active" : ""}">${label}</a>
          `,
            )
            .join("")}
        </div>
      </nav>
      <div class="sidebar-footer">
        <a href="../dashboard.html" class="sidebar-link">← Exit admin</a>
        <button class="sidebar-link" id="adminLogoutBtn" style="width:100%;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          Log out
        </button>
      </div>
    `;

    document.getElementById("adminLogoutBtn").addEventListener("click", () => {
      if (confirm("Log out of Pass Spot?")) PS.session.logout();
    });
  },

  renderTopbar(title) {
    const topbar = document.getElementById("appTopbar");
    if (!topbar) return;
    const currency = PS.getCurrency();
    const user = PS.session.getUser();
    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    topbar.innerHTML = `
      <button class="icon-btn" data-sidebar-toggle aria-label="Open menu" style="display:none;" id="mobileMenuBtn">☰</button>
      <h1 class="topbar-title">${title}</h1>
      <div class="topbar-actions">
        <span class="text-xs text-muted" style="margin-right:var(--space-2);">${user.name}</span>
        <div class="currency-switch" role="group" aria-label="Currency">
          <button type="button" data-currency-switch="NGN" class="${currency === "NGN" ? "is-active" : ""}">₦ NGN</button>
          <button type="button" data-currency-switch="USD" class="${currency === "USD" ? "is-active" : ""}">$ USD</button>
        </div>
        <button class="icon-btn" id="themeToggle" aria-label="Toggle theme">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          </svg>
        </button>
        <span class="avatar" style="background:var(--error-color);">${initials}</span>
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
