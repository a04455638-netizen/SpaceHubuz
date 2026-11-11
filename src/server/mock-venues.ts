export interface VenueResource {
  id: string;
  name: string;
  categoryId: string;
  capacity: number;
  pricePerHour: number;
  pricePerDay?: number;
  minBookingDurationHours: number;
  amenities: string[];
  images: string[];
  active: boolean;
}

export interface CuratedVenue {
  id: string;
  slug: string;
  name: string;
  category: "coworking" | "sports" | "meetings" | "events";
  categoryName: { uz: string; ru: string; en: string };
  address: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  pricePerDay?: number;
  description: { uz: string; ru: string; en: string };
  amenities: string[];
  featuredImage: string;
  gallery: string[];
  resources: VenueResource[];
}

export const CURATED_VENUES: CuratedVenue[] = [
  // 1. Coworking: Impact Hub Tashkent
  {
    id: "v-coworking-1",
    slug: "impact-hub-tashkent",
    name: "Impact Hub Tashkent & Smart Workspace",
    category: "coworking",
    categoryName: {
      uz: "Kovorking va O'quv zallari",
      ru: "Коворкинг и Учебные залы",
      en: "Coworking & Study Spaces",
    },
    address: "Amir Temur shoh ko'chasi, 107B",
    city: "Toshkent",
    district: "Yunusobod tumani",
    latitude: 41.3385,
    longitude: 69.2842,
    phone: "+998 71 200 45 45",
    email: "info@impacthub.uz",
    rating: 4.9,
    reviewCount: 142,
    pricePerHour: 35000,
    pricePerDay: 180000,
    description: {
      uz: "Toshkent markazidagi eng zamonaviy kovorking maydoni. Yuqori tezlikdagi optik tolali internet (500 Mbit/s), qulay ergonomik Herman Miller stullari, alohida telefon kabinalari (phone booths), cheksiz sifatli qahva va choy.",
      ru: "Современное коворкинг-пространство в центре Ташкента. Высокоскоростной интернет (500 Мбит/с), эргономичные кресла, звукоизолированные телефонные будки, безлимитный кофе и чай.",
      en: "Premier modern coworking space in the heart of Tashkent. Ultra-fast 500 Mbps fiber internet, ergonomic chairs, soundproof phone booths, and unlimited specialty coffee & tea.",
    },
    amenities: ["Wi-Fi 500 Mbps", "Qahva va choy", "Printer / Skaner", "Konditsioner", "Muzokaralar xonasi", "24/7 Kirish", "Avtoturargoh"],
    featuredImage: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    ],
    resources: [
      {
        id: "r-impact-openspace",
        name: "Asosiy Open Space (Erkin ish stoli)",
        categoryId: "coworking",
        capacity: 65,
        pricePerHour: 35000,
        pricePerDay: 180000,
        minBookingDurationHours: 1,
        amenities: ["Optik internet", "Rozetka", "Qahva"],
        images: ["https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80"],
        active: true,
      },
      {
        id: "r-impact-teamroom",
        name: "Kichik jamoa xonasi (4 kishilik)",
        categoryId: "meetings",
        capacity: 4,
        pricePerHour: 80000,
        pricePerDay: 450000,
        minBookingDurationHours: 1,
        amenities: ["Whiteboard", "TV monitor", "Konditsioner"],
        images: ["https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80"],
        active: true,
      },
    ],
  },

  // 2. Coworking: C-Space Mirabad
  {
    id: "v-coworking-2",
    slug: "c-space-mirabad",
    name: "C-Space Mirabad Avenue",
    category: "coworking",
    categoryName: {
      uz: "Kovorking va O'quv zallari",
      ru: "Коворкинг и Учебные залы",
      en: "Coworking & Study Spaces",
    },
    address: "Mirobod tumani, Nukus ko'chasi, 29",
    city: "Toshkent",
    district: "Mirobod tumani",
    latitude: 41.2985,
    longitude: 69.2735,
    phone: "+998 71 205 12 12",
    email: "mirabad@cspace.uz",
    rating: 4.8,
    reviewCount: 98,
    pricePerHour: 40000,
    pricePerDay: 200000,
    description: {
      uz: "Premial darajadagi biznes kovorking. Tinch va professional muhit, erkin zonalar, ovoz yozish podkast studiyasi va shinam kofe-bar.",
      ru: "Премиальный бизнес-коворкинг в районе Мирабад. Тихая атмосфера, подкаст-студия и первоклассный кофе.",
      en: "Premium business coworking in prestigious Mirabad district. Quiet focused environment, podcast studio, and specialty coffee bar.",
    },
    amenities: ["Wi-Fi 300 Mbps", "Podkast studiyasi", "Qahva bar", "Lounge", "Konditsioner", "Avtoturargoh"],
    featuredImage: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80",
    ],
    resources: [
      {
        id: "r-cspace-desk",
        name: "Dedicated Desk (Shaxsiy stol)",
        categoryId: "coworking",
        capacity: 1,
        pricePerHour: 40000,
        pricePerDay: 200000,
        minBookingDurationHours: 1,
        amenities: ["Monitor", "Shaxsiy shkafcha", "Tezkor Wi-Fi"],
        images: ["https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80"],
        active: true,
      },
    ],
  },

  // 3. Sports: Milliy Futsal Arena
  {
    id: "v-sports-1",
    slug: "milliy-futsal-arena",
    name: "Milliy Futsal Arena & Stadium",
    category: "sports",
    categoryName: {
      uz: "Sport maydonlari va Zallar",
      ru: "Спортивные комплексы и Арены",
      en: "Sports Facilities & Arenas",
    },
    address: "Chilonzor tumani, Qatortol ko'chasi, 18",
    city: "Toshkent",
    district: "Chilonzor tumani",
    latitude: 41.2789,
    longitude: 69.2155,
    phone: "+998 90 999 11 22",
    email: "arena@milliyfutsal.uz",
    rating: 4.8,
    reviewCount: 215,
    pricePerHour: 180000,
    description: {
      uz: "FIFA talablariga mos keluvchi professional sintetik chimli yopiq va ochiq mini-futbol maydonlari. Zamonaviy yoritish tizimi (LED prorektorlar), dush, issiq suv, kiyim almashtirish xonalari va tomoshabinlar tribunasi.",
      ru: "Профессиональные мини-футбольные поля с искусственным газоном стандарта FIFA. Светодиодное освещение, раздевалки, горячий душ и трибуны для зрителей.",
      en: "Professional FIFA-grade artificial turf futsal pitches, both indoor and covered. Powerful floodlights, locker rooms with hot showers, and spectator stands.",
    },
    amenities: ["Sintetik chim", "Kiyinish xonasi", "Dush va issiq suv", "LED yoritish", "Ichimliklar burchagi", "Bepul avtoturargoh"],
    featuredImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80",
    ],
    resources: [
      {
        id: "r-futsal-indoor",
        name: "Yopiq Futsal Maydoni (40x20m)",
        categoryId: "sports",
        capacity: 14,
        pricePerHour: 180000,
        minBookingDurationHours: 1,
        amenities: ["Isitish tizimi", "Dush", "Koptoklar"],
        images: ["https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80"],
        active: true,
      },
    ],
  },

  // 4. Sports: Olympic Tennis & Padel Club
  {
    id: "v-sports-2",
    slug: "olympic-tennis-padel-club",
    name: "Olympic Tennis & Padel Club",
    category: "sports",
    categoryName: {
      uz: "Sport maydonlari va Zallar",
      ru: "Спортивные комплексы и Арены",
      en: "Sports Facilities & Arenas",
    },
    address: "Yashnobod tumani, Parkent ko'chasi, 155",
    city: "Toshkent",
    district: "Yashnobod tumani",
    latitude: 41.3195,
    longitude: 69.3325,
    phone: "+998 71 289 77 88",
    email: "club@olympictennis.uz",
    rating: 4.9,
    reviewCount: 87,
    pricePerHour: 150000,
    description: {
      uz: "Professional qattiq qoplamali (hard court) va tuproqli (clay) tennis kortlari hamda O'zbekistondagi eng so'nggi rusumdagi panoramik oynali Padel kortlari. Raketka va koptoklar ijarasi mavjud.",
      ru: "Профессиональные теннисные корты с покрытием хард и грунт, а также новые падел-корты с панорамным остеклением. Прокат ракеток и мячей.",
      en: "Championship-standard hard and clay tennis courts, plus modern panoramic glass Padel courts. Racket and ball rentals available on-site.",
    },
    amenities: ["Hard & Clay kortlar", "Padel korti", "Raketka ijarasi", "Konditsioner", "Sport bar", "Sauna"],
    featuredImage: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1200&q=80",
    ],
    resources: [
      {
        id: "r-padel-court-1",
        name: "Padel Korti #1 (Panoramik)",
        categoryId: "sports",
        capacity: 4,
        pricePerHour: 150000,
        minBookingDurationHours: 1,
        amenities: ["LED yoritish", "Padel raketkalari", "Dush"],
        images: ["https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1200&q=80"],
        active: true,
      },
    ],
  },

  // 5. Meetings: Hyatt Grand Executive Conference
  {
    id: "v-meetings-1",
    slug: "hyatt-grand-executive-conference",
    name: "Hyatt Grand Executive Conference Center",
    category: "meetings",
    categoryName: {
      uz: "Majlis va Konferensiya xonalari",
      ru: "Конференц-залы и Переговорные",
      en: "Conference & Meeting Rooms",
    },
    address: "Navoiy shoh ko'chasi, 1A",
    city: "Toshkent",
    district: "Shayxontohur tumani",
    latitude: 41.3168,
    longitude: 69.2745,
    phone: "+998 71 207 12 34",
    email: "events@hyatttashkent.uz",
    rating: 5.0,
    reviewCount: 164,
    pricePerHour: 350000,
    description: {
      uz: "Oliy toifadagi xalqaro standartdagi konferensiya zallari. Sinxron tarjima kabinalari, 4K lazerli proyektorlar, Shure simsiz audio konferensiya tizimi va VIP katering xizmati.",
      ru: "Конференц-залы международного уровня в центре столицы. Кабины синхронного перевода, 4K лазерные проекторы, микрофонные системы Shure и VIP-кейтеринг.",
      en: "World-class conference facilities in downtown Tashkent. Simultaneous interpretation booths, 4K laser projection, Shure wireless audio system, and five-star catering.",
    },
    amenities: ["4K Lazer Proyektor", "Sinxron tarjima", "Shure mikrofonlar", "Kofe-breyk", "Yuqori tezlikdagi Wi-Fi", "Yer osti garaji"],
    featuredImage: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
    ],
    resources: [
      {
        id: "r-boardroom-vip",
        name: "VIP Boardroom (18 kishilik)",
        categoryId: "meetings",
        capacity: 18,
        pricePerHour: 350000,
        minBookingDurationHours: 2,
        amenities: ["Video-anjuman", "Kofe-breyk", "Mikrofonlar"],
        images: ["https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80"],
        active: true,
      },
    ],
  },

  // 6. Events: Silk Road International Event Hall
  {
    id: "v-events-1",
    slug: "silk-road-event-hall",
    name: "Silk Road International Event Hall & Banquet",
    category: "events",
    categoryName: {
      uz: "Tadbir va Bayram zallari",
      ru: "Залы для мероприятий и Банкетов",
      en: "Event Halls & Banquets",
    },
    address: "Islom Karimov ko'chasi, 98",
    city: "Toshkent",
    district: "Mirobod tumani",
    latitude: 41.3052,
    longitude: 69.2618,
    phone: "+998 71 210 50 50",
    email: "silkroad@events.uz",
    rating: 4.9,
    reviewCount: 79,
    pricePerHour: 1200000,
    pricePerDay: 8500000,
    description: {
      uz: "500 kishigacha bo'lgan tantanali bayramlar, yirik xalqaro forumlar, ko'rgazmalar va gala-kechalar uchun hashamatli zal. DMX boshqariladigan sahna yoritgichlari, JBL Line Array ovoz tizimi va LED ekranlar.",
      ru: "Роскошный зал вместимостью до 500 человек для международных форумов, корпоративных вечеров и выставок. Световое оборудование DMX, звук JBL Line Array и светодиодные экраны.",
      en: "Magnificent grand hall accommodating up to 500 guests for international summits, galas, and exhibitions. Full DMX concert lighting, JBL Line Array sound system, and giant LED video walls.",
    },
    amenities: ["500 kishilik zal", "Konsert sahna va yorug'lik", "Katta LED ekran", "Banket xizmati", "Grim xonasi", "Keng avtoturargoh"],
    featuredImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    ],
    resources: [
      {
        id: "r-grand-ballroom",
        name: "Grand Ballroom & Banquet Hall",
        categoryId: "events",
        capacity: 500,
        pricePerHour: 1200000,
        pricePerDay: 8500000,
        minBookingDurationHours: 4,
        amenities: ["Sahna", "LED ekran", "Akustika", "Grim xonasi"],
        images: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"],
        active: true,
      },
    ],
  },
];

export function getVenueBySlug(slug: string): CuratedVenue | undefined {
  return CURATED_VENUES.find((v) => v.slug === slug);
}

export function getVenuesByCategory(category?: string): CuratedVenue[] {
  if (!category || category === "all") return CURATED_VENUES;
  return CURATED_VENUES.filter((v) => v.category === category);
}

export function searchCuratedVenues(query?: string, category?: string): CuratedVenue[] {
  let list = CURATED_VENUES;
  if (category && category !== "all") {
    list = list.filter((v) => v.category === category);
  }
  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    list = list.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.district.toLowerCase().includes(q) ||
        v.address.toLowerCase().includes(q) ||
        v.description.uz.toLowerCase().includes(q) ||
        v.description.ru.toLowerCase().includes(q) ||
        v.description.en.toLowerCase().includes(q)
    );
  }
  return list;
}
