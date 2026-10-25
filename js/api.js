/* =========================================
   PASS SPOT — API BRIDGE (FOR BACKEND DEVS)
   
   🚨 IMPORTANT INSTRUCTIONS FOR BACKEND DEVELOPERS:
   =========================================
   This file replaces the old `data.js` demo data.
   All current frontend actions point to these 
   async functions. 
   
   TO DO:
   1. Set the API_BASE_URL to your live server URL.
   2. Uncomment the `fetch()` blocks inside each function.
   3. Delete the "MOCK RETURN" blocks.
   4. Ensure endpoints return JSON matching the shapes 
      commented above each function.
========================================= */

const API_BASE_URL = "http://localhost:3000/api"; // Change this to production URL

// Helper to get the auth token (assuming JWT stored in localStorage)
function getAuthToken() {
  return localStorage.getItem("ps_auth_token") || "";
}

window.PS_API = {
  // =========================================
  // AUTHENTICATION
  // =========================================

  async login(email, password) {
    /* 
      Expected Request: { email, password }
      Expected Response: { token, user: { id, name, email, role, profilePic } }
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
      user: { id: 1, name: "User", email, role: "attendee" },
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
  // EVENTS
  // =========================================

  async getEvents(filters = {}) {
    /* 
      Expected Request: Query params (e.g., ?state=Lagos&category=Music)
      Expected Response: Array of Event Objects
      Event: { id, title, description, category, state, city, venue, date, 
               price, capacity, sold, organizerId, organizerName, 
               imageUrl, feeHandling, platformFee, ticketTiers }
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

  // =========================================
  // TICKETS & CHECKOUT
  // =========================================

  async purchaseTicket(checkoutData) {
    /* 
      Expected Request: { eventId, ticketType, quantity, guestName, guestEmail, promoCode, currency }
      Expected Response: { orderId, totalPaid, tickets: [{ token, qrCodeUrl, attendeeName }] }
      
      🚨 NOTE: The backend MUST handle the actual payment gateway integration 
      (e.g., Paystack/Flutterwave) here. The frontend just sends the request.
    */
    // const res = await fetch(`${API_BASE_URL}/checkout`, {
    //   method: "POST", headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(checkoutData)
    // });
    // return await res.json();

    // MOCK RETURN - REPLACE THIS
    return {
      orderId: "ORD-123",
      totalPaid: 10000,
      tickets: [
        {
          token: "TKT-123",
          qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?data=TKT-123",
          attendeeName: checkoutData.guestName,
        },
      ],
    };
  },

  async validateScan(ticketToken, eventId) {
    /* 
      Expected Request: { token, eventId }
      Expected Response: { valid: boolean, message: string, attendeeName: string }
      
      🚨 NOTE: Backend must ensure the ticket hasn't been used yet.
    */
    // const res = await fetch(`${API_BASE_URL}/scan`, { ... });
    // return await res.json();

    // MOCK RETURN - REPLACE THIS
    return { valid: true, message: "Valid Ticket", attendeeName: "Ada Okafor" };
  },

  // =========================================
  // WALLET & FINANCE
  // =========================================

  async getWalletBalance() {
    /* 
      Expected Response: { available: number, pending: number, total: number }
    */
    // const res = await fetch(`${API_BASE_URL}/wallet`, {
    //   headers: { "Authorization": `Bearer ${getAuthToken()}` }
    // });
    // return await res.json();

    // MOCK RETURN - REPLACE THIS
    return { available: 0, pending: 0, total: 0 };
  },

  async requestWithdrawal(withdrawalData) {
    /* 
      Expected Request: { amount, bankName, accountNumber, accountName }
      Expected Response: { success: boolean, message: string }
    */
    // const res = await fetch(`${API_BASE_URL}/wallet/withdraw`, {
    //   method: "POST",
    //   headers: { "Authorization": `Bearer ${getAuthToken()}`, "Content-Type": "application/json" },
    //   body: JSON.stringify(withdrawalData)
    // });
    // return await res.json();

    // MOCK RETURN - REPLACE THIS
    return { success: true, message: "Withdrawal requested" };
  },

  // =========================================
  // ADMIN CONTROLS
  // =========================================

  async getPlatformSettings() {
    /* 
      Expected Response: { platformFee: 5, ambassadorFee: 2, maintenanceMode: false }
    */
    // const res = await fetch(`${API_BASE_URL}/admin/settings`, { ... });
    // return await res.json();

    // MOCK RETURN - REPLACE THIS
    return { platformFee: 5, ambassadorFee: 2 };
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

    // MOCK RETURN - REPLACE THIS
    return { success: true };
  },
};

// =========================================
// SYSTEM CONSTANTS (Move these from data.js)
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
    USD: { symbol: "$", code: "USD", rate: 1 / 1500 }, // Note: Backend should handle live exchange rates
  },
};
