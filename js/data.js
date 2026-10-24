/* =========================================
   PASS SPOT — DATA & CONSTANTS
   Central location for demo data,
   reference tables, and admin accounts.
========================================= */

/* =========================================
   NIGERIAN STATES + FCT
========================================= */
const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "Federal Capital Territory (FCT)",
];

/* =========================================
   MAJOR CITIES BY STATE
========================================= */
const NIGERIAN_CITIES = {
  Lagos: [
    "Ikeja",
    "Lekki",
    "Victoria Island",
    "Yaba",
    "Surulere",
    "Ikoyi",
    "Ajah",
    "Ikorodu",
  ],
  Edo: ["Benin City", "Auchi", "Ekpoma"],
  Rivers: ["Port Harcourt", "Bonny", "Eleme"],
  Oyo: ["Ibadan", "Ogbomoso", "Oyo Town"],
  Enugu: ["Enugu", "Nsukka", "Awgu"],
  Kaduna: ["Kaduna", "Zaria", "Kafanchan"],
  Kano: ["Kano", "Wudil", "Gaya"],
  "Federal Capital Territory (FCT)": ["Abuja", "Gwagwalada", "Kuje", "Bwari"],
  Delta: ["Asaba", "Warri", "Ughelli"],
  Anambra: ["Awka", "Onitsha", "Nnewi"],
  Ogun: ["Abeokuta", "Sagamu", "Ijebu Ode"],
  "Akwa Ibom": ["Uyo", "Eket", "Ikot Ekpene"],
  Plateau: ["Jos", "Bukuru"],
  Kogi: ["Lokoja", "Okene", "Idah"],
  Kwara: ["Ilorin", "Offa"],
  Osun: ["Osogbo", "Ile-Ife", "Ede"],
  Ondo: ["Akure", "Ondo City", "Owo"],
  Ekiti: ["Ado Ekiti", "Ikere"],
  Abia: ["Umuahia", "Aba"],
  Imo: ["Owerri", "Orlu"],
  Benue: ["Makurdi", "Gboko"],
  Nasarawa: ["Lafia", "Keffi", "Karu"],
  Niger: ["Minna", "Bida", "Suleja"],
  Borno: ["Maiduguri", "Biu"],
  Bauchi: ["Bauchi", "Azare"],
  Adamawa: ["Yola", "Mubi"],
  Taraba: ["Jalingo", "Wukari"],
  Yobe: ["Damaturu", "Potiskum"],
  Gombe: ["Gombe", "Billiri"],
  Sokoto: ["Sokoto", "Tambuwal"],
  Kebbi: ["Birnin Kebbi", "Argungu"],
  Zamfara: ["Gusau", "Kaura Namoda"],
  Katsina: ["Katsina", "Daura"],
  Jigawa: ["Dutse", "Hadejia"],
  Bayelsa: ["Yenagoa", "Brass"],
  "Cross River": ["Calabar", "Ikom"],
  Ebonyi: ["Abakaliki", "Afikpo"],
};

/* =========================================
   NIGERIAN BANKS
========================================= */
const NIGERIAN_BANKS = [
  "Access Bank",
  "Citibank",
  "Ecobank",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank (FCMB)",
  "Guaranty Trust Bank (GTBank)",
  "Heritage Bank",
  "Keystone Bank",
  "Polaris Bank",
  "Providus Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "Union Bank",
  "United Bank for Africa (UBA)",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
  "Kuda MFB",
  "Opay",
  "Palmpay",
  "Moniepoint MFB",
  "9 Payment Service Bank (9PSB)",
];

/* =========================================
   EVENT CATEGORIES (defaults)
   Admins can add/remove via
   admin/categories.html — those changes
   are stored in localStorage and merged.
========================================= */
const DEFAULT_CATEGORIES = [
  "Music",
  "Concert",
  "Sports",
  "Football",
  "Comedy",
  "Business",
  "Technology",
  "Education",
  "Conference",
  "Networking",
  "Fashion",
  "Food",
  "Religion",
  "Art",
  "Culture",
  "Entertainment",
  "Festival",
  "Lifestyle",
  "Family",
  "Community",
];

/* =========================================
   CURRENCY CONFIGURATION
========================================= */
const CURRENCIES = {
  NGN: { symbol: "₦", code: "NGN", name: "Nigerian Naira", base: true },
  USD: { symbol: "$", code: "USD", name: "US Dollar", rate: 1 / 1500 },
};

/* =========================================
   ADMIN ACCOUNTS
   Team members with full admin access.
   No roles, no super-admin — flat structure.

   HOW TO ADD AN ADMIN (before backend):
   1. Add an entry to ADMIN_ACCOUNTS below
   2. Commit + redeploy
   3. New admin logs in at login.html with
      that email + any 8+ char password.

   ⚠️ Frontend-only placeholder. With a real
   backend, admin accounts live in the
   database and this array is deleted.
========================================= */
const ADMIN_ACCOUNTS = [
  { email: "admin@passspot.ng", name: "Platform Admin" },
  // { email: "tunde@passspot.ng", name: "Tunde Bakare" },
  // { email: "ngozi@passspot.ng", name: "Ngozi Adeyemi" },
];

function isAdminEmail(email) {
  const normalized = (email || "").toLowerCase().trim();
  return ADMIN_ACCOUNTS.some((a) => a.email.toLowerCase() === normalized);
}

function findAdmin(email) {
  const normalized = (email || "").toLowerCase().trim();
  return ADMIN_ACCOUNTS.find((a) => a.email.toLowerCase() === normalized);
}

/* =========================================
   SEEDED DEMO EVENTS
========================================= */
const DEMO_EVENTS = [
  {
    id: "evt_001",
    title: "Lagos Music Festival 2025",
    category: "Music",
    state: "Lagos",
    city: "Victoria Island",
    venue: "Eko Convention Centre",
    date: "2025-12-14T19:00:00",
    price: 15000,
    sold: 842,
    capacity: 1200,
    organizer: "SoundWave NG",
    featured: true,
    trending: true,
    emoji: "🎵",
  },
  {
    id: "evt_002",
    title: "Tech Founders Summit",
    category: "Technology",
    state: "Lagos",
    city: "Lekki",
    venue: "Landmark Event Centre",
    date: "2025-12-20T09:00:00",
    price: 25000,
    sold: 318,
    capacity: 500,
    organizer: "Innovate Lagos",
    featured: true,
    emoji: "💼",
  },
  {
    id: "evt_003",
    title: "Super Eagles Live Viewing",
    category: "Football",
    state: "Rivers",
    city: "Port Harcourt",
    venue: "Yakubu Gowon Stadium",
    date: "2025-12-22T16:00:00",
    price: 8000,
    sold: 1204,
    capacity: 3000,
    organizer: "SportsHub PH",
    trending: true,
    emoji: "⚽",
  },
  {
    id: "evt_004",
    title: "Comedy Night with Basket Mouth",
    category: "Comedy",
    state: "Federal Capital Territory (FCT)",
    city: "Abuja",
    venue: "Transcorp Hilton",
    date: "2025-12-28T20:00:00",
    price: 20000,
    sold: 421,
    capacity: 600,
    organizer: "Laugh Factory NG",
    featured: true,
    emoji: "😂",
  },
  {
    id: "evt_005",
    title: "Afrobeat Block Party",
    category: "Music",
    state: "Lagos",
    city: "Ikeja",
    venue: "Muri Okunola Park",
    date: "2026-01-04T18:00:00",
    price: 10000,
    sold: 562,
    capacity: 1500,
    organizer: "SoundWave NG",
    emoji: "🎶",
  },
  {
    id: "evt_006",
    title: "Startup Pitch Night",
    category: "Business",
    state: "Lagos",
    city: "Yaba",
    venue: "CcHUB Lagos",
    date: "2026-01-10T17:00:00",
    price: 5000,
    sold: 187,
    capacity: 250,
    organizer: "Innovate Lagos",
    emoji: "🚀",
  },
  {
    id: "evt_007",
    title: "Benin Cultural Festival",
    category: "Culture",
    state: "Edo",
    city: "Benin City",
    venue: "Oba's Palace Grounds",
    date: "2025-12-30T10:00:00",
    price: 3000,
    sold: 892,
    capacity: 2000,
    organizer: "Edo Heritage",
    emoji: "🎭",
  },
  {
    id: "evt_008",
    title: "Ibadan Food Festival",
    category: "Food",
    state: "Oyo",
    city: "Ibadan",
    venue: "Trans Amusement Park",
    date: "2026-01-18T12:00:00",
    price: 7500,
    sold: 412,
    capacity: 1000,
    organizer: "Taste of Naija",
    emoji: "🍲",
  },
  {
    id: "evt_009",
    title: "Fashion Week Abuja",
    category: "Fashion",
    state: "Federal Capital Territory (FCT)",
    city: "Abuja",
    venue: "International Conference Centre",
    date: "2026-02-02T15:00:00",
    price: 35000,
    sold: 218,
    capacity: 700,
    organizer: "Style Collective",
    emoji: "👗",
  },
  {
    id: "evt_010",
    title: "Gospel Concert — Wole Oni Live",
    category: "Religion",
    state: "Lagos",
    city: "Lekki",
    venue: "Harvesters Auditorium",
    date: "2025-12-25T17:00:00",
    price: 5000,
    sold: 1420,
    capacity: 3000,
    organizer: "Praise Nation",
    trending: true,
    emoji: "🙏",
  },
  {
    id: "evt_011",
    title: "Enugu Marathon",
    category: "Sports",
    state: "Enugu",
    city: "Enugu",
    venue: "Nnamdi Azikiwe Stadium",
    date: "2026-01-26T06:00:00",
    price: 6000,
    sold: 745,
    capacity: 1500,
    organizer: "Coal City Sports",
    emoji: "🏃",
  },
  {
    id: "evt_012",
    title: "Art & Wine Evening",
    category: "Art",
    state: "Lagos",
    city: "Ikoyi",
    venue: "Nike Art Gallery",
    date: "2026-01-08T18:30:00",
    price: 18000,
    sold: 142,
    capacity: 200,
    organizer: "ArtHouse Lagos",
    emoji: "🎨",
  },
];

/* =========================================
   USER-CREATED EVENTS PERSISTENCE
========================================= */
const EVENT_STORAGE_KEY = "user_events";

function loadUserEvents() {
  try {
    const raw = localStorage.getItem(EVENT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUserEvents(events) {
  try {
    localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.warn("Could not save user events:", e);
  }
}

function saveEvent(event) {
  const userEvents = loadUserEvents();
  const idx = userEvents.findIndex((e) => e.id === event.id);
  if (idx >= 0) userEvents[idx] = event;
  else userEvents.unshift(event);
  saveUserEvents(userEvents);
  return event;
}

function deleteEvent(eventId) {
  const userEvents = loadUserEvents().filter((e) => e.id !== eventId);
  saveUserEvents(userEvents);
}

function getEvents() {
  const userEvents = loadUserEvents();
  const userIds = new Set(userEvents.map((e) => e.id));
  const seeded = DEMO_EVENTS.filter((e) => !userIds.has(e.id));
  return [...userEvents, ...seeded];
}

function getEventById(id) {
  return getEvents().find((e) => e.id === id);
}

/* =========================================
   CATEGORIES PERSISTENCE
   Admin custom categories merge with defaults.
========================================= */
const CATEGORY_STORAGE_KEY = "custom_categories";

function loadCustomCategories() {
  try {
    const raw = localStorage.getItem(CATEGORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomCategories(cats) {
  try {
    localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(cats));
  } catch (e) {
    console.warn("Could not save categories:", e);
  }
}

function getCategories() {
  // Admin-added categories first, then defaults
  const custom = loadCustomCategories();
  const defaults = DEFAULT_CATEGORIES.filter((c) => !custom.includes(c));
  return [...custom, ...defaults];
}

function addCategory(name) {
  const clean = (name || "").trim();
  if (!clean) return false;
  const all = getCategories();
  if (all.map((c) => c.toLowerCase()).includes(clean.toLowerCase()))
    return false;
  const custom = loadCustomCategories();
  custom.push(clean);
  saveCustomCategories(custom);
  return true;
}

function removeCategory(name) {
  // Can only remove custom ones, not defaults
  const custom = loadCustomCategories();
  const filtered = custom.filter((c) => c !== name);
  saveCustomCategories(filtered);
  return filtered.length !== custom.length;
}

/* =========================================
   SEEDED DEMO ORGANIZERS
   Used on admin/organizers.html so the page
   has content on first view. When real
   organizers exist (users with role =
   "organizer"), those merge in too.
========================================= */
const SEEDED_ORGANIZERS = [
  {
    id: "org_seed_1",
    name: "SoundWave NG",
    email: "hello@soundwave.ng",
    phone: "+234 803 111 2233",
    state: "Lagos",
    city: "Lekki",
    joined: "2025-02-14",
    status: "active",
    eventCount: 2,
    grossRevenue: 21150000,
    totalWithdrawn: 12000000,
  },
  {
    id: "org_seed_2",
    name: "Innovate Lagos",
    email: "team@innovatelagos.com",
    phone: "+234 809 555 7788",
    state: "Lagos",
    city: "Yaba",
    joined: "2025-05-08",
    status: "active",
    eventCount: 2,
    grossRevenue: 8885000,
    totalWithdrawn: 5000000,
  },
];

/* =========================================
   DEMO TICKETS
========================================= */
const DEMO_TICKETS = [
  {
    id: "PS-8421-LAG",
    eventId: "evt_001",
    eventTitle: "Lagos Music Festival 2025",
    ticketType: "VIP",
    price: 45000,
    date: "2025-12-14T19:00:00",
    venue: "Eko Convention Centre, Victoria Island, Lagos",
    status: "valid",
    attendee: "Ada Okafor",
    purchasedAt: "2025-11-20T14:32:00",
  },
  {
    id: "PS-5102-TEC",
    eventId: "evt_002",
    eventTitle: "Tech Founders Summit",
    ticketType: "Regular",
    price: 25000,
    date: "2025-12-20T09:00:00",
    venue: "Landmark Event Centre, Lekki, Lagos",
    status: "valid",
    attendee: "Ada Okafor",
    purchasedAt: "2025-11-25T09:14:00",
  },
  {
    id: "PS-3309-COM",
    eventId: "evt_004",
    eventTitle: "Comedy Night with Basket Mouth",
    ticketType: "Regular",
    price: 20000,
    date: "2025-12-28T20:00:00",
    venue: "Transcorp Hilton, Abuja",
    status: "used",
    attendee: "Ada Okafor",
    purchasedAt: "2025-11-12T16:05:00",
  },
];

/* =========================================
   DEMO TRANSACTIONS
========================================= */
const DEMO_TRANSACTIONS = [
  {
    id: "TX-20251120-8421",
    type: "Ticket Purchase",
    description: "Lagos Music Festival 2025 — VIP x1",
    amount: -45000,
    status: "completed",
    date: "2025-11-20T14:32:00",
    method: "Pass Spot Wallet",
  },
  {
    id: "TX-20251118-7712",
    type: "Deposit",
    description: "Wallet funding via bank transfer",
    amount: 100000,
    status: "completed",
    date: "2025-11-18T11:05:00",
    method: "Bank Transfer",
  },
  {
    id: "TX-20251112-6504",
    type: "Ticket Purchase",
    description: "Comedy Night — Regular x1",
    amount: -20000,
    status: "completed",
    date: "2025-11-12T16:05:00",
    method: "Pass Spot Wallet",
  },
  {
    id: "TX-20251110-5401",
    type: "Deposit",
    description: "Wallet funding via card",
    amount: 50000,
    status: "completed",
    date: "2025-11-10T08:22:00",
    method: "Card",
  },
  {
    id: "TX-20251105-4399",
    type: "Ticket Revenue",
    description: "Super Eagles viewing — ticket sales",
    amount: 120000,
    status: "pending",
    date: "2025-11-05T19:00:00",
    method: "Event proceeds",
  },
  {
    id: "TX-20251028-3210",
    type: "Withdrawal",
    description: "Withdrawal to GTBank ****4821",
    amount: -80000,
    status: "completed",
    date: "2025-10-28T13:11:00",
    method: "Bank Transfer",
  },
  {
    id: "TX-20251020-2104",
    type: "Advertisement",
    description: "Tech Founders Summit — campaign spend",
    amount: -5000,
    status: "completed",
    date: "2025-10-20T10:00:00",
    method: "Pass Spot Wallet",
  },
  {
    id: "TX-20251015-1023",
    type: "Refund",
    description: "Cancelled ticket refund",
    amount: 15000,
    status: "refunded",
    date: "2025-10-15T14:40:00",
    method: "Pass Spot Wallet",
  },
];

/* =========================================
   SEEDED DEPOSITS
   These are the deposit-type transactions
   with extra fields (reference, bank).
========================================= */
const SEEDED_DEPOSITS = [
  {
    id: "DEP-20251118-001",
    txId: "TX-20251118-7712",
    user: "Ada Okafor",
    email: "ada.okafor@example.com",
    amount: 100000,
    status: "completed",
    method: "Bank Transfer",
    reference: "GTB-REF-884211",
    date: "2025-11-18T11:05:00",
  },
  {
    id: "DEP-20251110-002",
    txId: "TX-20251110-5401",
    user: "Ada Okafor",
    email: "ada.okafor@example.com",
    amount: 50000,
    status: "completed",
    method: "Card",
    reference: "PS-CARD-993421",
    date: "2025-11-10T08:22:00",
  },
  {
    id: "DEP-20251105-003",
    txId: "TX-20251105-0003",
    user: "Emeka Nwosu",
    email: "emeka.nwosu@example.com",
    amount: 250000,
    status: "completed",
    method: "Bank Transfer",
    reference: "ZEN-REF-114730",
    date: "2025-11-05T15:44:00",
  },
  {
    id: "DEP-20251102-004",
    txId: "TX-20251102-0004",
    user: "Fatima Bello",
    email: "fatima.bello@example.com",
    amount: 75000,
    status: "pending",
    method: "Bank Transfer",
    reference: "GTB-REF-449123",
    date: "2025-11-02T09:12:00",
  },
  {
    id: "DEP-20251028-005",
    txId: "TX-20251028-0005",
    user: "Chidi Okeke",
    email: "chidi.okeke@example.com",
    amount: 30000,
    status: "completed",
    method: "Card",
    reference: "PS-CARD-772801",
    date: "2025-10-28T17:30:00",
  },
  {
    id: "DEP-20251022-006",
    txId: "TX-20251022-0006",
    user: "Ngozi Adeyemi",
    email: "ngozi.a@example.com",
    amount: 150000,
    status: "failed",
    method: "Bank Transfer",
    reference: "ACC-REF-558822",
    date: "2025-10-22T12:03:00",
  },
];

/* =========================================
   DEMO ADVERTISEMENTS
========================================= */
const DEMO_ADS = [
  {
    id: "AD-001",
    eventId: "evt_002",
    eventTitle: "Tech Founders Summit",
    status: "active",
    budget: 50000,
    spent: 18420,
    impressions: 42800,
    clicks: 1240,
    ctr: 2.9,
    startDate: "2025-11-15",
    endDate: "2025-12-20",
    objective: "Increase Ticket Sales",
  },
  {
    id: "AD-002",
    eventId: "evt_001",
    eventTitle: "Lagos Music Festival 2025",
    status: "pending",
    budget: 120000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    startDate: "2025-12-01",
    endDate: "2025-12-14",
    objective: "Increase Event Awareness",
  },
  {
    id: "AD-003",
    eventId: "evt_006",
    eventTitle: "Startup Pitch Night",
    status: "completed",
    budget: 30000,
    spent: 30000,
    impressions: 68200,
    clicks: 2140,
    ctr: 3.1,
    startDate: "2025-10-01",
    endDate: "2025-11-30",
    objective: "Increase Event Page Visits",
  },
  {
    id: "AD-004",
    eventId: "evt_007",
    eventTitle: "Benin Cultural Festival",
    status: "rejected",
    budget: 40000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    startDate: "2025-12-15",
    endDate: "2025-12-30",
    objective: "Increase Ticket Sales",
  },
];

/* =========================================
   DEMO NOTIFICATIONS
========================================= */
const DEMO_NOTIFICATIONS = [
  {
    id: "n1",
    type: "success",
    title: "Ticket purchased",
    text: "Your ticket for Lagos Music Festival 2025 is ready.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "n2",
    type: "info",
    title: "Deposit confirmed",
    text: "Your deposit of ₦100,000.00 was successful.",
    time: "1 day ago",
    read: false,
  },
  {
    id: "n3",
    type: "warning",
    title: "Event reminder",
    text: "Tech Founders Summit starts in 3 days.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "n4",
    type: "success",
    title: "Withdrawal completed",
    text: "₦80,000.00 was sent to GTBank ****4821.",
    time: "3 weeks ago",
    read: true,
  },
  {
    id: "n5",
    type: "info",
    title: "Welcome to Pass Spot",
    text: "Explore events across all 36 states and FCT.",
    time: "1 month ago",
    read: true,
  },
];

/* =========================================
   EXPOSE GLOBALLY
========================================= */
window.PS_DATA = {
  NIGERIAN_STATES,
  NIGERIAN_CITIES,
  NIGERIAN_BANKS,
  EVENT_CATEGORIES: DEFAULT_CATEGORIES, // legacy alias
  CURRENCIES,
  DEMO_EVENTS,
  DEMO_TICKETS,
  DEMO_TRANSACTIONS,
  DEMO_ADS,
  DEMO_NOTIFICATIONS,
  SEEDED_ORGANIZERS,
  SEEDED_DEPOSITS,
  ADMIN_ACCOUNTS,

  // Persistence API
  getEvents,
  getEventById,
  saveEvent,
  deleteEvent,
  loadUserEvents,

  // Categories
  getCategories,
  addCategory,
  removeCategory,

  // Admin
  isAdminEmail,
  findAdmin,
};
