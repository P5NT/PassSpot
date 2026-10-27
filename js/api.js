/* =========================================
   PASS SPOT — API BRIDGE (FOR BACKEND DEVS)
   
   🚨 INSTRUCTIONS FOR BACKEND DEVELOPERS:
   =========================================
   This file is the single source of truth for 
   all frontend-to-backend communication. 
   
   TO DO:
   1. Set the API_BASE_URL to your live server.
   2. Uncomment the `fetch()` blocks inside each function.
   3. Delete the "MOCK RETURN" blocks.
   4. Ensure your database schema matches the 
      "Expected Request/Response" comments.
========================================= */

const API_BASE_URL = "http://localhost:3000/api"; // Change this to production URL

// Helper to get the auth token (assuming JWT stored in localStorage)
function getAuthToken() {
  return localStorage.getItem("ps_auth_token") || "";
}

window.PS_API = {
  // =========================================
  // 1. AUTHENTICATION
  // =========================================

  async login(email, password) {
    /* 
      Expected Request: { email, password }
      Expected Response: { token, user: { id, name, email, role, profilePic, isAmbassador } }
      NOTE: Role is either "attendee", "organizer", or "admin".
    */
    // const res = await fetch(`${API_BASE_URL}/auth/login`, {
    //   method: "POST", headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, password })
    // });
    // if (!res.ok) throw new Error("Invalid credentials");
    // return await res.json();

    // MOCK RETURN - REPLACE THIS
    return {
      token: "mock-jwt-token",
      user: {
        id: 1,
        name: "User",
        email,
        role: "attendee",
        isAmbassador: false,
      },
    };
  },

  async signup(userData) {
    /* 
      Expected Request: { name, email, phone, password, role }
      Expected Response: { token, user: { id, name, email, role } }
    */
    // const res = await fetch(`${API_BASE_URL}/auth/signup`, { ... });
    // return await res.json();

    // MOCK RETURN - REPLACE THIS
    return { token: "mock-jwt-token", user: { id: 1, ...userData } };
  },

  // =========================================
  // 2. NORMAL EVENTS (Ticketing)
  // =========================================

  async getEvents(filters = {}) {
    /* 
      Expected Request: Query params (e.g., ?state=Lagos&category=Music)
      Expected Response: Array of Event Objects
      
      Event Object Schema:
      {
        id, title, description, categories: ["Music"], 
        eventType: "physical" | "online", 
        state, city, venue, onlineLink,
        date, endDate, schedule: [{ date, startTime }],
        price, capacity, sold,
        organizerId, organizerName, imageData (base64 or URL),
        platformFee: number, promoCode: [{ code, discountType, discountValue, maxUses }]
      }
    */
    // const query = new URLSearchParams(filters).toString();
    // const res = await fetch(`${API_BASE_URL}/events?${query}`);
    // return await res.json();

    // MOCK RETURN - REPLACE THIS
    return [];
  },

  async createEvent(eventData) {
    /* 
      Expected Request: Event Object (without ID)
      Expected Response: The created Event Object with ID
    */
    // const res = await fetch(`${API_BASE_URL}/events`, {
    //   method: "POST",
    //   headers: { "Authorization": `Bearer ${getAuthToken()}`, "Content-Type": "application/json" },
    //   body: JSON.stringify(eventData)
    // });
    // return await res.json();

    // MOCK RETURN - REPLACE THIS
    return { id: Date.now(), ...eventData };
  },

  async updateEvent(eventId, eventData) {
    /* 
      Expected Request: Event Object updates
      Expected Response: The updated Event Object
    */
    // const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    //   method: "PUT",
    //   headers: { "Authorization": `Bearer ${getAuthToken()}`, "Content-Type": "application/json" },
    //   body: JSON.stringify(eventData)
    // });
    // return await res.json();
  },

  // =========================================
  // 3. VOTING EVENTS (Paid Polls)
  // =========================================

  async createVote(voteData) {
    /* 
      Expected Request: Vote Object
      Expected Response: The created Vote Object with ID
      
      Vote Object Schema:
      {
        id, title, description, imageData,
        startDate, endDate, status: "active" | "closed",
        pricePerVote: number,
        categories: ["Most Beautiful", "Most Handsome"],
        customFields: ["Instagram Handle", "Age"], // Fields to ask for each contestant
        organizerId
      }
    */
    // const res = await fetch(`${API_BASE_URL}/votes`, { ... });
    // return await res.json();
  },

  async updateVote(voteId, voteData) {
    /* 
      Expected Request: Vote updates (dates, status, categories, customFields)
      Expected Response: { success: boolean }
    */
    // const res = await fetch(`${API_BASE_URL}/votes/${voteId}`, { method: "PUT", ... });
    // return await res.json();
  },

  async addContestant(voteId, contestantData) {
    /* 
      Expected Request: { name, category, imageData, customData: { "Instagram": "@user" } }
      Expected Response: The created Contestant Object with ID
    */
    // const res = await fetch(`${API_BASE_URL}/votes/${voteId}/contestants`, { ... });
    // return await res.json();
  },

  async updateContestant(voteId, contestantId, contestantData) {
    /* 
      Expected Request: Contestant updates
      Expected Response: The updated Contestant Object
    */
    // const res = await fetch(`${API_BASE_URL}/votes/${voteId}/contestants/${contestantId}`, { method: "PUT", ... });
    // return await res.json();
  },

  async castVote(voteId, contestantId, email, quantity) {
    /* 
      Expected Request: { contestantId, email, quantity, totalPaid }
      Expected Response: { success: boolean, receiptId: string, newVoteCount: number }
      
      🚨 NOTE: Backend MUST handle payment processing here.
      Once payment succeeds, increment the contestant's vote count.
    */
    // const res = await fetch(`${API_BASE_URL}/votes/${voteId}/cast`, { ... });
    // return await res.json();

    // MOCK RETURN - REPLACE THIS
    return { success: true, receiptId: "VOTE-123", newVoteCount: 150 };
  },

  // =========================================
  // 4. TICKETING & CHECKOUT
  // =========================================

  async purchaseTicket(checkoutData) {
    /* 
      Expected Request: { eventId, ticketType, quantity, guestName, guestEmail, promoCode, currency }
      Expected Response: { orderId, totalPaid, tickets: [{ token, qrCodeUrl, attendeeName }] }
      
      🚨 NOTE: Backend MUST handle payment gateway integration 
      (Paystack/Flutterwave) and generate unique QR tokens.
    */
    // const res = await fetch(`${API_BASE_URL}/checkout`, { ... });
    // return await res.json();
  },

  async validateScan(ticketToken, scannerPassCode) {
    /* 
      Expected Request: { token, scannerPassCode }
      Expected Response: { valid: boolean, message: string, attendeeName: string }
      
      🚨 NOTE: Backend must verify the ticket hasn't been used AND 
      that the scanner pass is valid for this specific event.
    */
    // const res = await fetch(`${API_BASE_URL}/scan`, { ... });
    // return await res.json();
  },

  // =========================================
  // 5. WALLET & FINANCE
  // =========================================

  async getWalletBalance() {
    /* 
      Expected Response: { available: number, pending: number, total: number }
    */
    // const res = await fetch(`${API_BASE_URL}/wallet`, { headers: { "Authorization": `Bearer ${getAuthToken()}` } });
    // return await res.json();
  },

  async requestWithdrawal(withdrawalData) {
    /* 
      Expected Request: { amount, bankName, accountNumber, accountName }
      Expected Response: { success: boolean, message: string }
    */
    // const res = await fetch(`${API_BASE_URL}/wallet/withdraw`, { ... });
    // return await res.json();
  },

  // =========================================
  // 6. ADMIN CONTROLS & AMBASSADORS
  // =========================================

  async getPlatformSettings() {
    /* 
      Expected Response: { platformFee: 5, ambassadorFee: 2, maintenanceMode: false }
    */
    // const res = await fetch(`${API_BASE_URL}/admin/settings`, { ... });
    // return await res.json();

    // MOCK RETURN
    return { platformFee: 5, ambassadorFee: 2 };
  },

  async getOrganizers() {
    /* 
      Expected Response: Array of organizer objects with isAmbassador flag.
      { id, name, email, isAmbassador, eventCount, grossRevenue }
    */
    // const res = await fetch(`${API_BASE_URL}/admin/organizers`, { ... });
    // return await res.json();
  },

  async toggleAmbassador(userId, isAmbassador) {
    /* 
      Expected Request: { userId, isAmbassador: boolean }
      Expected Response: { success: boolean }
    */
    // const res = await fetch(`${API_BASE_URL}/admin/ambassadors`, {
    //   method: "POST",
    //   headers: { "Authorization": `Bearer ${getAuthToken()}`, "Content-Type": "application/json" },
    //   body: JSON.stringify({ userId, isAmbassador })
    // });
    // return await res.json();
  },
};

// =========================================
// 7. SYSTEM CONSTANTS
// =========================================
window.PS_CONSTANTS = {
  NIGERIAN_STATES: [
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
  ],
  NIGERIAN_BANKS: [
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
  ],
  CURRENCIES: {
    NGN: { symbol: "₦", code: "NGN", rate: 1 },
    USD: { symbol: "$", code: "USD", rate: 1 / 1500 },
  },
};
