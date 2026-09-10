/* =========================================
   PASS SPOT — PAGE CONTROLLERS
   Page-specific logic. Each function
   checks for its DOM anchor before running.
========================================= */

/* =========================================
   EVENT CARD RENDERER
   Shared by discover page, landing page,
   and featured sections.
========================================= */
function eventCardHTML(e) {
  const fav = Favorites.has(e.id);
  const priceLabel = e.price === 0 ? "Free" : fmt.naira(e.price);
  return `
        <article class="event-card" data-event-id="${e.id}">
            <div class="event-media">
                <img src="${e.image}" alt="${e.title}" loading="lazy">
                <span class="cat">${e.category}</span>
                <button class="fav ${fav ? "is-active" : ""}" aria-label="Save event" data-fav="${e.id}">
                    <svg viewBox="0 0 24 24" fill="${fav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                </button>
            </div>
            <div class="event-body">
                <h3 class="event-title">${e.title}</h3>
                <div class="event-meta">
                    <div class="event-meta-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span>${fmt.date(e.date)} · ${e.time}</span>
                    </div>
                    <div class="event-meta-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span>${e.venue}, ${e.city}</span>
                    </div>
                </div>
                <div class="event-footer">
                    <div>
                        <div class="event-price">${priceLabel}<small>starting from</small></div>
                    </div>
                    <a href="event-details.html?id=${e.id}" class="btn btn-sm btn-primary">View</a>
                </div>
                <div class="event-organizer">
                    <span class="avatar" style="width:22px;height:22px;font-size:.625rem">${e.organizer.initials}</span>
                    <span>${e.organizer.name}</span>
                </div>
            </div>
        </article>
    `;
}

function bindFavButtons(scope = document) {
  scope.querySelectorAll("[data-fav]").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      const id = btn.dataset.fav;
      const added = Favorites.toggle(id);
      btn.classList.toggle("is-active", added);
      const svg = btn.querySelector("svg");
      svg.setAttribute("fill", added ? "currentColor" : "none");
      Toast.success(added ? "Saved to favorites" : "Removed from favorites");
    });
  });
}

/* =========================================
   LANDING PAGE
========================================= */
function initLandingPage() {
  const featured = document.getElementById("featured-events");
  if (!featured) return;
  const list = EVENTS.filter((e) => e.featured).slice(0, 3);
  featured.innerHTML = list.map(eventCardHTML).join("");
  bindFavButtons(featured);
}

/* =========================================
   DISCOVER EVENTS PAGE
========================================= */
function initDiscoverPage() {
  const grid = document.getElementById("events-grid");
  if (!grid) return;

  const searchInput = document.getElementById("event-search");
  const catChips = document.querySelectorAll("[data-cat]");
  const locationSelect = document.getElementById("filter-location");
  const priceSelect = document.getElementById("filter-price");
  const sortSelect = document.getElementById("filter-sort");
  const resultCount = document.getElementById("result-count");

  let activeCategory = "All";

  const categories = [
    "All",
    "Music",
    "Technology",
    "Comedy",
    "Sports",
    "Fashion",
    "Business",
    "Festivals",
    "Networking",
    "Worship",
  ];

  // Build category chips dynamically so the list stays in sync with data
  const chipRow = document.getElementById("cat-chips");
  if (chipRow) {
    chipRow.innerHTML = categories
      .map(
        (c) => `
            <button class="chip ${c === "All" ? "is-active" : ""}" data-cat="${c}">${c}</button>
        `,
      )
      .join("");
    chipRow.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-cat]");
      if (!chip) return;
      activeCategory = chip.dataset.cat;
      chipRow
        .querySelectorAll(".chip")
        .forEach((c) => c.classList.toggle("is-active", c === chip));
      render();
    });
  }

  function render() {
    const q = (searchInput?.value || "").toLowerCase().trim();
    const loc = locationSelect?.value || "";
    const price = priceSelect?.value || "";
    const sort = sortSelect?.value || "date-asc";

    let list = EVENTS.filter((e) => {
      if (activeCategory !== "All" && e.category !== activeCategory)
        return false;
      if (loc && e.city !== loc) return false;
      if (price === "free" && e.price !== 0) return false;
      if (price === "under25" && (e.price === 0 || e.price >= 25000))
        return false;
      if (price === "25to75" && (e.price < 25000 || e.price > 75000))
        return false;
      if (price === "over75" && e.price <= 75000) return false;
      if (q) {
        const hay =
          `${e.title} ${e.city} ${e.category} ${e.venue}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "date-desc":
          return new Date(b.date) - new Date(a.date);
        default:
          return new Date(a.date) - new Date(b.date);
      }
    });

    if (resultCount)
      resultCount.textContent = `${list.length} event${list.length === 1 ? "" : "s"} found`;

    if (!list.length) {
      grid.innerHTML = `
                <div class="empty-state" style="grid-column:1/-1">
                    <div class="empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                    <h3>No events match your filters</h3>
                    <p>Try adjusting your search, category or price filter to see more events.</p>
                    <button class="btn btn-primary" onclick="location.reload()">Reset filters</button>
                </div>`;
      return;
    }

    grid.innerHTML = list.map(eventCardHTML).join("");
    bindFavButtons(grid);
  }

  [searchInput, locationSelect, priceSelect, sortSelect].forEach(
    (el) => el && el.addEventListener("input", render),
  );
  render();
}

/* =========================================
   EVENT DETAILS PAGE
   Loads event from ?id= query param and
   renders hero, ticket options, and total.
========================================= */
function initEventDetailsPage() {
  const root = document.getElementById("event-detail");
  if (!root) return;

  const params = new URLSearchParams(location.search);
  const id = params.get("id") || EVENTS[0].id;
  const event = EVENTS.find((e) => e.id === id) || EVENTS[0];

  document.title = `${event.title} — Pass Spot`;

  // Populate hero + description
  document.getElementById("ev-image").src = event.image;
  document.getElementById("ev-image").alt = event.title;
  document.getElementById("ev-cat").textContent = event.category;
  document.getElementById("ev-title").textContent = event.title;
  document.getElementById("ev-date").textContent = fmt.date(event.date);
  document.getElementById("ev-time").textContent = event.time;
  document.getElementById("ev-venue").textContent =
    `${event.venue}, ${event.city}`;
  document.getElementById("ev-desc").textContent = event.description;
  document.getElementById("ev-org-name").textContent = event.organizer.name;
  document.getElementById("ev-org-avatar").textContent =
    event.organizer.initials;

  // ---- Ticket selection with live total ----
  const ticketList = document.getElementById("ticket-options");
  const totalsEl = document.getElementById("order-total");
  const subtotalEl = document.getElementById("order-subtotal");
  const feeEl = document.getElementById("order-fee");

  // State: id -> quantity
  const qty = {};

  ticketList.innerHTML = event.ticketTypes
    .map(
      (t) => `
        <div class="card" style="margin-bottom:12px" data-ticket="${t.id}">
            <div style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap">
                <div style="flex:1;min-width:200px">
                    <h4 style="margin-bottom:6px">${t.name}</h4>
                    <div style="font-family:var(--font-display);font-size:1.25rem;font-weight:700;margin-bottom:12px">
                        ${t.price === 0 ? "Free" : fmt.naira(t.price)}
                    </div>
                    <ul style="display:flex;flex-direction:column;gap:6px;font-size:.875rem;color:var(--text-secondary)">
                        ${t.benefits
                          .map(
                            (
                              b,
                            ) => `<li style="display:flex;align-items:center;gap:8px">
                            <span style="color:var(--success)">✓</span> ${b}
                        </li>`,
                          )
                          .join("")}
                    </ul>
                    <div class="muted" style="margin-top:12px;font-size:.75rem">${t.available} remaining</div>
                </div>
                <div style="display:flex;flex-direction:column;justify-content:center;align-items:flex-end;gap:10px">
                    <div style="display:inline-flex;align-items:center;gap:0;border:1px solid var(--border-strong);border-radius:var(--radius-md);overflow:hidden">
                        <button class="btn-qty btn btn-sm" data-dec="${t.id}" style="border-radius:0;height:40px;width:40px;padding:0">−</button>
                        <input type="text" value="0" readonly data-qty="${t.id}" style="width:48px;height:40px;text-align:center;border:none;background:var(--surface);color:var(--text-primary);font-weight:600">
                        <button class="btn-qty btn btn-sm" data-inc="${t.id}" style="border-radius:0;height:40px;width:40px;padding:0">+</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("");

  function recalc() {
    let subtotal = 0,
      count = 0;
    event.ticketTypes.forEach((t) => {
      const q = qty[t.id] || 0;
      subtotal += q * t.price;
      count += q;
    });
    const fee = Math.round(subtotal * 0.05); // 5% service fee
    const total = subtotal + fee;
    subtotalEl.textContent = fmt.naira(subtotal);
    feeEl.textContent = fmt.naira(fee);
    totalsEl.textContent = fmt.naira(total);
    document.getElementById("checkout-btn").disabled = count === 0;
  }

  ticketList.addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    if (!inc && !dec) return;
    const tid = (inc || dec).dataset.inc || (inc || dec).dataset.dec;
    const t = event.ticketTypes.find((x) => x.id === tid);
    const current = qty[tid] || 0;
    if (inc && current < t.available) qty[tid] = current + 1;
    if (dec && current > 0) qty[tid] = current - 1;
    ticketList.querySelector(`[data-qty="${tid}"]`).value = qty[tid];
    recalc();
  });

  document.getElementById("checkout-btn").addEventListener("click", () => {
    const btn = document.getElementById("checkout-btn");
    btn.classList.add("is-loading");
    setTimeout(() => {
      btn.classList.remove("is-loading");
      Toast.success("Order placed", "Your tickets have been confirmed.");
    }, 1400);
  });

  recalc();

  // Fav toggle on details page
  const favBtn = document.getElementById("ev-fav");
  if (favBtn) {
    if (Favorites.has(event.id)) favBtn.classList.add("is-active");
    favBtn.addEventListener("click", () => {
      const added = Favorites.toggle(event.id);
      favBtn.classList.toggle("is-active", added);
      Toast.success(added ? "Saved to favorites" : "Removed from favorites");
    });
  }

  // Share button (uses Web Share API when available)
  const shareBtn = document.getElementById("ev-share");
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const data = {
        title: event.title,
        text: event.description,
        url: location.href,
      };
      if (navigator.share) {
        try {
          await navigator.share(data);
        } catch {}
      } else {
        await navigator.clipboard.writeText(location.href);
        Toast.info("Link copied", "Event link copied to your clipboard.");
      }
    });
  }
}

/* =========================================
   TICKET / MY-TICKETS PAGES
========================================= */
function initMyTicketsPage() {
  const list = document.getElementById("tickets-list");
  if (!list) return;

  function render(filter = "upcoming") {
    const items = MOCK_TICKETS.filter((t) => t.status === filter);
    if (!items.length) {
      list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                    </div>
                    <h3>No ${filter} tickets</h3>
                    <p>When you purchase tickets, they'll appear here.</p>
                    <a href="events.html" class="btn btn-primary">Discover events</a>
                </div>`;
      return;
    }
    list.innerHTML = items
      .map(
        (t) => `
            <div class="ticket-card" style="margin-bottom:16px">
                <div class="tc-media"><img src="${t.eventImage}" alt="${t.eventName}"></div>
                <div class="tc-body">
                    <span class="badge badge-primary">${t.type}</span>
                    <h4>${t.eventName}</h4>
                    <div class="muted" style="font-size:.8125rem">${fmt.date(t.date)} · ${t.time}</div>
                    <div class="muted" style="font-size:.8125rem">${t.venue}</div>
                </div>
                <div class="tc-side">
                    <span class="badge badge-${t.status === "upcoming" ? "success" : "warning"}">${t.status}</span>
                    <div style="text-align:right">
                        <div class="muted" style="font-size:.6875rem">TICKET ID</div>
                        <div style="font-family:var(--font-display);font-weight:700;font-size:.8125rem">${t.id}</div>
                    </div>
                    <a href="ticket-details.html?id=${t.id}" class="btn btn-sm btn-primary">View ticket</a>
                </div>
            </div>
        `,
      )
      .join("");
  }

  document.querySelectorAll("[data-ticket-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll("[data-ticket-tab]")
        .forEach((b) => b.classList.toggle("is-active", b === btn));
      render(btn.dataset.ticketTab);
    });
  });

  render("upcoming");
}

function initTicketDetailsPage() {
  const root = document.getElementById("digital-ticket");
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || MOCK_TICKETS[0].id;
  const t = MOCK_TICKETS.find((x) => x.id === id) || MOCK_TICKETS[0];

  root.querySelector("#dt-event").textContent = t.eventName;
  root.querySelector("#dt-type").textContent = t.type;
  root.querySelector("#dt-name").textContent = t.attendee;
  root.querySelector("#dt-id").textContent = t.id;
  root.querySelector("#dt-date").textContent = fmt.date(t.date);
  root.querySelector("#dt-time").textContent = t.time;
  root.querySelector("#dt-venue").textContent = t.venue;
  root.querySelector("#dt-seat").textContent = t.seat || "General";
  const img = root.querySelector("#dt-img");
  img.src = t.eventImage;
  img.alt = t.eventName;

  root.querySelector("[data-download]")?.addEventListener("click", () => {
    Toast.success("Ticket downloaded", `${t.id} saved to your device.`);
  });
  root.querySelector("[data-share]")?.addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: t.eventName, url: location.href });
      } catch {}
    } else {
      await navigator.clipboard.writeText(location.href);
      Toast.info("Link copied", "Ticket link copied to your clipboard.");
    }
  });
}

/* =========================================
   MY EVENTS PAGE (organizer)
========================================= */
function initMyEventsPage() {
  const tbody = document.getElementById("org-events-body");
  if (!tbody) return;

  if (!MOCK_ORG_EVENTS.length) {
    tbody.innerHTML = `<tr><td colspan="6">
            <div class="empty-state"><h3>You haven't created an event yet</h3>
            <p>Start by creating your first event.</p>
            <a href="create-event.html" class="btn btn-primary">Create event</a></div>
        </td></tr>`;
    return;
  }

  tbody.innerHTML = MOCK_ORG_EVENTS.map(
    (e) => `
        <tr>
            <td><strong>${e.title}</strong></td>
            <td>${fmt.date(e.date)}</td>
            <td><span class="badge badge-${e.status === "Published" ? "success" : "warning"}">${e.status}</span></td>
            <td>${e.sold}</td>
            <td>${fmt.naira(e.revenue)}</td>
            <td>
                <div class="dropdown" data-dropdown style="display:inline-block;position:relative">
                    <button class="btn btn-sm btn-ghost" data-dropdown-trigger>⋯</button>
                    <div data-dropdown-menu style="display:none;position:absolute;right:0;top:100%;margin-top:6px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md);box-shadow:var(--shadow-lg);min-width:160px;padding:6px;z-index:10">
                        <a href="event-details.html?id=${e.id}" style="display:block;padding:8px 12px;font-size:.875rem;border-radius:var(--radius-sm);color:var(--text-secondary)">View</a>
                        <a href="create-event.html?id=${e.id}" style="display:block;padding:8px 12px;font-size:.875rem;border-radius:var(--radius-sm);color:var(--text-secondary)">Edit</a>
                        <button data-delete="${e.id}" style="display:block;width:100%;text-align:left;padding:8px 12px;font-size:.875rem;border-radius:var(--radius-sm);color:var(--danger)">Delete</button>
                    </div>
                </div>
            </td>
        </tr>
    `,
  ).join("");

  // Bind dropdown open/close
  tbody.querySelectorAll("[data-dropdown]").forEach((wrap) => {
    const trigger = wrap.querySelector("[data-dropdown-trigger]");
    const menu = wrap.querySelector("[data-dropdown-menu]");
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menu.style.display === "block";
      document
        .querySelectorAll("[data-dropdown-menu]")
        .forEach((m) => (m.style.display = "none"));
      menu.style.display = isOpen ? "none" : "block";
    });
  });
  document.addEventListener("click", () =>
    document
      .querySelectorAll("[data-dropdown-menu]")
      .forEach((m) => (m.style.display = "none")),
  );

  // Delete confirmation modal
  tbody.addEventListener("click", (e) => {
    const del = e.target.closest("[data-delete]");
    if (!del) return;
    Modal.open({
      title: "Delete this event?",
      desc: "This action cannot be undone. All associated tickets and attendee data will be removed.",
      confirmText: "Delete event",
      danger: true,
      onConfirm: () => Toast.success("Event deleted"),
    });
  });
}

/* =========================================
   CREATE EVENT PAGE
========================================= */
function initCreateEventPage() {
  const form = document.getElementById("create-event-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll("[required]").forEach((input) => {
      if (!Validators.required(input.value)) {
        showError(input, "This field is required.");
        valid = false;
      } else {
        clearError(input);
      }
    });
    if (!valid) {
      Toast.error("Please fix the errors", "Some required fields are missing.");
      return;
    }
    const btn = form.querySelector("[type=submit]");
    btn.classList.add("is-loading");
    setTimeout(() => {
      btn.classList.remove("is-loading");
      Toast.success("Event published", "Your event is now live on Pass Spot.");
      setTimeout(() => (location.href = "my-events.html"), 900);
    }, 1400);
  });

  form.querySelector("[data-draft]")?.addEventListener("click", () => {
    Toast.info("Draft saved", "You can continue editing later.");
  });
}

/* =========================================
   AUTH PAGES (login + signup)
========================================= */
function initLoginPage() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    const email = form.querySelector("#email");
    const pwd = form.querySelector("#password");

    if (!Validators.required(email.value)) {
      showError(email, "Email is required.");
      valid = false;
    } else if (!Validators.email(email.value)) {
      showError(email, "Enter a valid email address.");
      valid = false;
    } else clearError(email);

    if (!Validators.required(pwd.value)) {
      showError(pwd, "Password is required.");
      valid = false;
    } else if (!Validators.minLen(pwd.value, 8)) {
      showError(pwd, "Password must be at least 8 characters.");
      valid = false;
    } else clearError(pwd);

    if (!valid) {
      Toast.error("Check your details", "Some fields need attention.");
      return;
    }

    const btn = form.querySelector("[type=submit]");
    btn.classList.add("is-loading");
    setTimeout(() => {
      // Simulated login — no real authentication
      Auth.set({
        email: email.value,
        firstName: "Adaeze",
        lastName: "Okonkwo",
      });
      Toast.success("Welcome back", "Redirecting to your dashboard…");
      setTimeout(() => (location.href = "dashboard.html"), 700);
    }, 1300);
  });
}

function initSignupPage() {
  const form = document.getElementById("signup-form");
  if (!form) return;

  const pwd = form.querySelector("#password");
  const meter = form.querySelector(".pwd-strength");
  const confirm = form.querySelector("#confirm");

  pwd.addEventListener("input", () => updateStrength(meter, pwd.value));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    const rules = [
      { id: "#first", msg: "First name is required." },
      { id: "#last", msg: "Last name is required." },
      { id: "#email", msg: "Email is required." },
      { id: "#phone", msg: "Phone number is required." },
      { id: "#password", msg: "Password is required." },
      { id: "#confirm", msg: "Please confirm your password." },
      { id: "#account-type", msg: "Select an account type." },
    ];

    rules.forEach((r) => {
      const input = form.querySelector(r.id);
      if (!Validators.required(input.value)) {
        showError(input, r.msg);
        valid = false;
      } else clearError(input);
    });

    const email = form.querySelector("#email");
    if (email.value && !Validators.email(email.value)) {
      showError(email, "Enter a valid email address.");
      valid = false;
    }

    if (pwd.value && !Validators.minLen(pwd.value, 8)) {
      showError(pwd, "Minimum 8 characters.");
      valid = false;
    }
    if (pwd.value && confirm.value && pwd.value !== confirm.value) {
      showError(confirm, "Passwords do not match.");
      valid = false;
    }

    const terms = form.querySelector("#terms");
    if (!terms.checked) {
      Toast.error("Terms required", "Please accept the Terms of Service.");
      valid = false;
    }

    if (!valid) {
      Toast.error("Check your details", "Some fields need attention.");
      return;
    }

    const btn = form.querySelector("[type=submit]");
    btn.classList.add("is-loading");
    setTimeout(() => {
      Auth.set({
        email: email.value,
        firstName: form.querySelector("#first").value,
        lastName: form.querySelector("#last").value,
      });
      Toast.success("Account created", "Welcome to Pass Spot.");
      setTimeout(() => (location.href = "dashboard.html"), 800);
    }, 1300);
  });
}

/* =========================================
   DASHBOARD — populates user + stats
========================================= */
function initDashboardPage() {
  const root = document.getElementById("dashboard-page");
  if (!root) return;

  const user = Auth.get() || { firstName: "Guest", lastName: "" };
  document
    .querySelectorAll("[data-user-name]")
    .forEach(
      (el) =>
        (el.textContent =
          `${user.firstName} ${user.lastName}`.trim() || "Guest"),
    );

  // Draw a premium SVG area chart for revenue
  const chart = document.getElementById("revenue-chart");
  if (chart)
    drawAreaChart(chart, ANALYTICS.weekly.revenue, ANALYTICS.weekly.labels);
}

/* =========================================
   SVG AREA CHART
   Lightweight, dependency-free chart used
   across the dashboard and analytics pages.
========================================= */
function drawAreaChart(mount, values, labels, color = "var(--primary)") {
  const w = 800,
    h = 260,
    pad = 20;
  const max = Math.max(...values) * 1.15;
  const stepX = (w - pad * 2) / (values.length - 1);

  const points = values.map((v, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (v / max) * (h - pad * 2);
    return [x, y];
  });

  const linePath = points
    .map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`)
    .join(" ");
  const areaPath = `${linePath} L${points[points.length - 1][0]},${h - pad} L${points[0][0]},${h - pad} Z`;

  // Use gradient id unique to mount id to allow multiple charts
  const gid = `grad-${mount.id}`;

  mount.innerHTML = `
        <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
            <defs>
                <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#6C2BD9" stop-opacity="0.28"/>
                    <stop offset="100%" stop-color="#6C2BD9" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <path d="${areaPath}" fill="url(#${gid})"/>
            <path d="${linePath}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            ${points
              .map(
                (p, i) => `
                <circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="var(--surface)" stroke="${color}" stroke-width="2"/>
                <text x="${p[0]}" y="${h - 4}" text-anchor="middle" font-size="11" fill="var(--text-muted)">${labels[i]}</text>
            `,
              )
              .join("")}
        </svg>
    `;
}

/* =========================================
   ANALYTICS PAGE
========================================= */
function initAnalyticsPage() {
  const chart = document.getElementById("analytics-chart");
  if (!chart) return;
  const series = ANALYTICS.monthly;
  drawAreaChart(chart, series.revenue, series.labels);

  document.querySelectorAll("[data-range]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll("[data-range]")
        .forEach((b) => b.classList.toggle("is-active", b === btn));
      const data = ANALYTICS[btn.dataset.range];
      drawAreaChart(chart, data.revenue, data.labels);
    });
  });
}

/* =========================================
   NOTIFICATIONS PAGE
========================================= */
function initNotificationsPage() {
  const list = document.getElementById("notifications-list");
  if (!list) return;

  function render() {
    if (!MOCK_NOTIFICATIONS.length) {
      list.innerHTML = `<div class="empty-state"><h3>No notifications</h3>
                <p>You're all caught up. New activity will appear here.</p></div>`;
      return;
    }
    list.innerHTML = MOCK_NOTIFICATIONS.map(
      (n) => `
            <div class="card" style="display:flex;gap:16px;margin-bottom:12px;${n.read ? "opacity:.7" : ""}">
                <div class="stat-icon ${n.type === "success" ? "green" : n.type === "warning" ? "amber" : ""}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>
                </div>
                <div style="flex:1">
                    <div style="display:flex;justify-content:space-between;gap:12px">
                        <strong>${n.title}</strong>
                        <span class="muted" style="font-size:.75rem">${n.time}</span>
                    </div>
                    <p style="font-size:.875rem;margin-top:4px">${n.msg}</p>
                    ${!n.read ? `<button class="btn btn-sm btn-ghost" data-mark="${n.id}" style="margin-top:8px;color:var(--primary)">Mark as read</button>` : ""}
                </div>
            </div>
        `,
    ).join("");

    list.querySelectorAll("[data-mark]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const n = MOCK_NOTIFICATIONS.find((x) => x.id === btn.dataset.mark);
        if (n) n.read = true;
        render();
        Toast.success("Marked as read");
      });
    });
  }

  document.getElementById("mark-all-read")?.addEventListener("click", () => {
    MOCK_NOTIFICATIONS.forEach((n) => (n.read = true));
    render();
    Toast.success("All notifications marked as read");
  });

  render();
}

/* =========================================
   PROFILE PAGE
   Saves editable fields to localStorage.
========================================= */
function initProfilePage() {
  const form = document.getElementById("profile-form");
  if (!form) return;

  const saved = JSON.parse(localStorage.getItem("ps-profile") || "null") || {
    firstName: "Adaeze",
    lastName: "Okonkwo",
    email: "adaeze@example.com",
    phone: "+234 803 555 0110",
  };
  Object.entries(saved).forEach(([k, v]) => {
    const el = form.querySelector(`[name="${k}"]`);
    if (el) el.value = v;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {};
    new FormData(form).forEach((v, k) => (data[k] = v));
    localStorage.setItem("ps-profile", JSON.stringify(data));
    Toast.success("Profile updated", "Your changes have been saved.");
  });
}

/* =========================================
   SETTINGS PAGE
========================================= */
function initSettingsPage() {
  const prefs = JSON.parse(localStorage.getItem("ps-settings") || "{}");
  document.querySelectorAll("[data-setting]").forEach((el) => {
    const key = el.dataset.setting;
    if (el.type === "checkbox") el.checked = prefs[key] ?? true;
    else if (prefs[key] != null) el.value = prefs[key];

    el.addEventListener("change", () => {
      const current = JSON.parse(localStorage.getItem("ps-settings") || "{}");
      current[key] = el.type === "checkbox" ? el.checked : el.value;
      localStorage.setItem("ps-settings", JSON.stringify(current));
      Toast.success("Settings saved");
    });
  });
}

/* =========================================
   DASHBOARD / NAV ACTIVE LINKS
   Highlights the current page in the sidebar.
========================================= */
function initActiveNav() {
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-item").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === here) a.classList.add("is-active");
  });
}

/* =========================================
   LOGOUT
========================================= */
function initLogout() {
  document.querySelectorAll("[data-logout]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      Modal.open({
        title: "Sign out of Pass Spot?",
        desc: "You'll need to sign in again to access your tickets and events.",
        confirmText: "Sign out",
        onConfirm: () => {
          Auth.logout();
          Toast.info("Signed out");
          setTimeout(() => (location.href = "login.html"), 600);
        },
      });
    });
  });
}

/* =========================================
   PAGE ROUTER
   Calls the relevant initializer based
   on a data-page attribute on <body>.
========================================= */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  const map = {
    landing: initLandingPage,
    discover: initDiscoverPage,
    event: initEventDetailsPage,
    "my-tickets": initMyTicketsPage,
    "ticket-details": initTicketDetailsPage,
    "my-events": initMyEventsPage,
    "create-event": initCreateEventPage,
    login: initLoginPage,
    signup: initSignupPage,
    dashboard: initDashboardPage,
    analytics: initAnalyticsPage,
    notifications: initNotificationsPage,
    profile: initProfilePage,
    settings: initSettingsPage,
  };
  if (map[page]) map[page]();
  initActiveNav();
  initLogout();

  // Populate any [data-user-*] placeholders
  const user = Auth.get();
  if (user) {
    document
      .querySelectorAll("[data-user-name]")
      .forEach(
        (el) =>
          (el.textContent =
            `${user.firstName || ""} ${user.lastName || ""}`.trim()),
      );
    document
      .querySelectorAll("[data-user-avatar]")
      .forEach(
        (el) =>
          (el.textContent =
            (
              (user.firstName?.[0] || "") + (user.lastName?.[0] || "")
            ).toUpperCase() || "PS"),
      );
  }
});
