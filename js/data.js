/* =========================================
   PASS SPOT — MOCK DATA
   Realistic Nigerian-context event, ticket,
   notification and analytics sample data.
   Used by every page so the platform feels
   like a real product without a backend.
========================================= */

// Nigerian event imagery (royalty-free via Unsplash CDN)
const IMG = {
  concert:
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=70",
  concert2:
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=70",
  tech: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=70",
  tech2:
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=70",
  business:
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=70",
  festival:
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=70",
  sports:
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=70",
  comedy:
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=70",
  fashion:
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=70",
  education:
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=70",
  networking:
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=70",
  worship:
    "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=70",
};

const ORGANIZERS = {
  rhythm: { name: "Rhythm Nation", initials: "RN" },
  techlag: { name: "TechLagos", initials: "TL" },
  rise: { name: "Rise Comedy", initials: "RC" },
  prime: { name: "Prime Sports", initials: "PS" },
  lagos: { name: "Lagos Fashion Week", initials: "LF" },
  elevate: { name: "Elevate Nigeria", initials: "EN" },
  alpha: { name: "Alpha Conference", initials: "AC" },
};

// ---- Core events dataset (10 realistic Nigerian events) ----
const EVENTS = [
  {
    id: "evt-001",
    title: "Lagos Soundscape 2025",
    category: "Music",
    image: IMG.concert,
    date: "2025-08-16",
    time: "7:00 PM",
    venue: "Eko Convention Centre",
    city: "Lagos",
    address: "Plot 1, Bisway Street, Victoria Island",
    organizer: ORGANIZERS.rhythm,
    description:
      "The biggest night in Afrobeats returns to Victoria Island. Lagos Soundscape brings together Africa's finest artists for one unforgettable evening of sound, light and energy. Expect headline sets from top Afrobeats stars, an immersive stage production and a crowd of thousands.",
    price: 15000,
    ticketsAvailable: 340,
    featured: true,
    ticketTypes: [
      {
        id: "reg",
        name: "Regular",
        price: 15000,
        benefits: ["General admission", "Standing area"],
        available: 200,
      },
      {
        id: "vip",
        name: "VIP",
        price: 45000,
        benefits: ["Front stage access", "Fast-lane entry", "VIP lounge"],
        available: 100,
      },
      {
        id: "vvip",
        name: "VVIP",
        price: 120000,
        benefits: [
          "Backstage access",
          "Premium seating",
          "Complimentary drinks",
          "Event merchandise",
        ],
        available: 40,
      },
    ],
  },
  {
    id: "evt-002",
    title: "TechLagos Annual Summit",
    category: "Technology",
    image: IMG.tech,
    date: "2025-09-04",
    time: "9:00 AM",
    venue: "Landmark Centre",
    city: "Lagos",
    address: "3 & 4 Water Corporation Drive, Oniru",
    organizer: ORGANIZERS.techlag,
    description:
      "Nigeria's premier technology conference. Two days of keynote sessions, product showcases and networking with the engineers, founders and investors shaping Africa's digital economy.",
    price: 25000,
    ticketsAvailable: 620,
    featured: true,
    ticketTypes: [
      {
        id: "reg",
        name: "Regular",
        price: 25000,
        benefits: ["All keynotes", "Networking sessions"],
        available: 400,
      },
      {
        id: "vip",
        name: "Pro",
        price: 75000,
        benefits: ["Front-row seating", "Speaker meetup", "Workshop access"],
        available: 180,
      },
      {
        id: "vvip",
        name: "Executive",
        price: 180000,
        benefits: ["Private lounge", "Executive dinner", "Investor roundtable"],
        available: 40,
      },
    ],
  },
  {
    id: "evt-003",
    title: "Abuja Comedy Night Live",
    category: "Comedy",
    image: IMG.comedy,
    date: "2025-08-30",
    time: "8:00 PM",
    venue: "Transcorp Hilton Ballroom",
    city: "Abuja",
    address: "1 Aguiyi Ironsi Street, Maitama",
    organizer: ORGANIZERS.rise,
    description:
      "An evening of non-stop laughter with Nigeria's funniest comedians. Premium seating, full bar service and a lineup guaranteed to leave you in stitches.",
    price: 20000,
    ticketsAvailable: 180,
    featured: true,
    ticketTypes: [
      {
        id: "reg",
        name: "Regular",
        price: 20000,
        benefits: ["Standard seating"],
        available: 120,
      },
      {
        id: "vip",
        name: "VIP",
        price: 55000,
        benefits: ["Front table", "Welcome drink"],
        available: 60,
      },
    ],
  },
  {
    id: "evt-004",
    title: "Port Harcourt Sports Festival",
    category: "Sports",
    image: IMG.sports,
    date: "2025-09-20",
    time: "4:00 PM",
    venue: "Adokiye Amiesimaka Stadium",
    city: "Port Harcourt",
    address: "Omagwa, Ikwerre LGA",
    organizer: ORGANIZERS.prime,
    description:
      "A celebration of athletic excellence featuring track events, football exhibition and youth championships from across the Niger Delta region.",
    price: 5000,
    ticketsAvailable: 1200,
    ticketTypes: [
      {
        id: "reg",
        name: "Regular",
        price: 5000,
        benefits: ["General stands"],
        available: 900,
      },
      {
        id: "vip",
        name: "VIP Stand",
        price: 25000,
        benefits: ["Covered seating", "Refreshments"],
        available: 300,
      },
    ],
  },
  {
    id: "evt-005",
    title: "Ibadan Fashion Weekend",
    category: "Fashion",
    image: IMG.fashion,
    date: "2025-10-11",
    time: "6:00 PM",
    venue: "Ibadan Civic Centre",
    city: "Ibadan",
    address: "Agodi, Ibadan North",
    organizer: ORGANIZERS.lagos,
    description:
      "Showcasing the finest emerging and established Nigerian designers across two nights of runway shows, exhibitions and after-parties.",
    price: 18000,
    ticketsAvailable: 260,
    ticketTypes: [
      {
        id: "reg",
        name: "Regular",
        price: 18000,
        benefits: ["Runway access"],
        available: 180,
      },
      {
        id: "vip",
        name: "Front Row",
        price: 60000,
        benefits: ["Front row seat", "Designer gift bag"],
        available: 80,
      },
    ],
  },
  {
    id: "evt-006",
    title: "Enugu Business Leadership Forum",
    category: "Business",
    image: IMG.business,
    date: "2025-09-12",
    time: "10:00 AM",
    venue: "Golden Royale Hotel",
    city: "Enugu",
    address: "32/36 Zik Avenue, Uwani",
    organizer: ORGANIZERS.elevate,
    description:
      "An exclusive forum bringing together CEOs, entrepreneurs and policy leaders from South-East Nigeria to discuss enterprise growth and regional development.",
    price: 35000,
    ticketsAvailable: 140,
    ticketTypes: [
      {
        id: "reg",
        name: "Standard",
        price: 35000,
        benefits: ["Full-day access", "Lunch"],
        available: 100,
      },
      {
        id: "vip",
        name: "Executive",
        price: 90000,
        benefits: ["Roundtable seat", "Private dinner"],
        available: 40,
      },
    ],
  },
  {
    id: "evt-007",
    title: "Benin City Cultural Festival",
    category: "Festivals",
    image: IMG.festival,
    date: "2025-10-25",
    time: "12:00 PM",
    venue: "Oba Ovonramwen Square",
    city: "Benin City",
    address: "Ring Road, Benin City",
    organizer: ORGANIZERS.elevate,
    description:
      "A vibrant celebration of Edo culture featuring traditional dance, art exhibitions, cuisine and live music from across the ancient kingdom.",
    price: 3000,
    ticketsAvailable: 2500,
    ticketTypes: [
      {
        id: "reg",
        name: "Regular",
        price: 3000,
        benefits: ["Festival entry"],
        available: 2000,
      },
      {
        id: "vip",
        name: "Royal Pass",
        price: 20000,
        benefits: ["Royal section", "Cultural feast"],
        available: 500,
      },
    ],
  },
  {
    id: "evt-008",
    title: "AI & Data Conference 2025",
    category: "Technology",
    image: IMG.tech2,
    date: "2025-11-08",
    time: "9:30 AM",
    venue: "Muson Centre",
    city: "Lagos",
    address: "8/9 Marina Road, Onikan",
    organizer: ORGANIZERS.techlag,
    description:
      "A deep-dive into applied AI, machine learning and data engineering with workshops and case studies from Africa's leading data teams.",
    price: 40000,
    ticketsAvailable: 340,
    ticketTypes: [
      {
        id: "reg",
        name: "Standard",
        price: 40000,
        benefits: ["Talks & workshops"],
        available: 220,
      },
      {
        id: "vip",
        name: "Pro",
        price: 95000,
        benefits: ["Hands-on labs", "Mentor sessions"],
        available: 120,
      },
    ],
  },
  {
    id: "evt-009",
    title: "Lagos Founders Network Night",
    category: "Networking",
    image: IMG.networking,
    date: "2025-09-27",
    time: "6:30 PM",
    venue: "Ventures Park",
    city: "Lagos",
    address: "6 Alhaji Adejumo Ave, Yaba",
    organizer: ORGANIZERS.techlag,
    description:
      "An intimate evening for founders, operators and investors. Curated introductions, short pitches and rooftop conversations over drinks.",
    price: 12000,
    ticketsAvailable: 90,
    ticketTypes: [
      {
        id: "reg",
        name: "Standard",
        price: 12000,
        benefits: ["Entry & drinks"],
        available: 70,
      },
      {
        id: "vip",
        name: "Investor",
        price: 50000,
        benefits: ["Private pitch room"],
        available: 20,
      },
    ],
  },
  {
    id: "evt-010",
    title: "Praise & Worship Night",
    category: "Worship",
    image: IMG.worship,
    date: "2025-10-04",
    time: "6:00 PM",
    venue: "The Covenant Place",
    city: "Lagos",
    address: "Plot 4, Iganmu Road, Ijora",
    organizer: ORGANIZERS.elevate,
    description:
      "A spirit-filled evening of gospel music featuring renowned choirs, worship leaders and an atmosphere of praise.",
    price: 0,
    ticketsAvailable: 5000,
    ticketTypes: [
      {
        id: "reg",
        name: "Free",
        price: 0,
        benefits: ["General seating"],
        available: 5000,
      },
    ],
  },
];

// ---- Mock user (used when logged in) ----
const MOCK_USER = {
  id: "usr-001",
  firstName: "Adaeze",
  lastName: "Okonkwo",
  email: "adaeze@example.com",
  phone: "+234 803 555 0110",
  accountType: "Attendee",
  joined: "2024-03-12",
};

// ---- User's tickets ----
const MOCK_TICKETS = [
  {
    id: "PS-2025-88102",
    eventId: "evt-001",
    eventName: "Lagos Soundscape 2025",
    eventImage: IMG.concert,
    type: "VIP",
    date: "2025-08-16",
    time: "7:00 PM",
    venue: "Eko Convention Centre",
    seat: "VIP-A12",
    attendee: "Adaeze Okonkwo",
    status: "upcoming",
  },
  {
    id: "PS-2025-66134",
    eventId: "evt-002",
    eventName: "TechLagos Annual Summit",
    eventImage: IMG.tech,
    type: "Executive",
    date: "2025-09-04",
    time: "9:00 AM",
    venue: "Landmark Centre",
    seat: "EX-04",
    attendee: "Adaeze Okonkwo",
    status: "upcoming",
  },
  {
    id: "PS-2024-33921",
    eventId: "evt-003",
    eventName: "Abuja Comedy Night Live",
    eventImage: IMG.comedy,
    type: "Regular",
    date: "2024-12-15",
    time: "8:00 PM",
    venue: "Transcorp Hilton Ballroom",
    seat: "GA-55",
    attendee: "Adaeze Okonkwo",
    status: "past",
  },
];

// ---- Organizer events (for My Events page) ----
const MOCK_ORG_EVENTS = [
  {
    id: "evt-002",
    title: "TechLagos Annual Summit",
    status: "Published",
    sold: 480,
    revenue: 12500000,
    attendees: 480,
    date: "2025-09-04",
  },
  {
    id: "evt-008",
    title: "AI & Data Conference 2025",
    status: "Published",
    sold: 220,
    revenue: 4800000,
    attendees: 220,
    date: "2025-11-08",
  },
  {
    id: "evt-009",
    title: "Lagos Founders Network Night",
    status: "Draft",
    sold: 0,
    revenue: 0,
    attendees: 0,
    date: "2025-09-27",
  },
];

// ---- Notifications ----
const MOCK_NOTIFICATIONS = [
  {
    id: "n-1",
    type: "success",
    title: "Ticket confirmed",
    msg: "Your VIP ticket for Lagos Soundscape 2025 is confirmed.",
    time: "2h ago",
    read: false,
  },
  {
    id: "n-2",
    type: "info",
    title: "Event reminder",
    msg: "TechLagos Annual Summit starts in 5 days.",
    time: "1d ago",
    read: false,
  },
  {
    id: "n-3",
    type: "warning",
    title: "Event updated",
    msg: "Abuja Comedy Night Live venue has changed.",
    time: "3d ago",
    read: true,
  },
  {
    id: "n-4",
    type: "success",
    title: "Payment received",
    msg: "Payment of ₦45,000 was successful.",
    time: "1w ago",
    read: true,
  },
];

// ---- Analytics sample series ----
const ANALYTICS = {
  weekly: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    revenue: [120000, 185000, 140000, 260000, 320000, 480000, 390000],
    tickets: [12, 18, 14, 26, 32, 48, 39],
  },
  monthly: {
    labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
    revenue: [980000, 1450000, 1120000, 1680000],
    tickets: [98, 145, 112, 168],
  },
  yearly: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    revenue: [
      2200000, 2800000, 3400000, 3100000, 4200000, 5100000, 4800000, 5600000,
      6100000, 5400000, 6200000, 7100000,
    ],
    tickets: [220, 280, 340, 310, 420, 510, 480, 560, 610, 540, 620, 710],
  },
};
