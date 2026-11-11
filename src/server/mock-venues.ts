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
  category: "coworking" | "sports" | "meetings" | "events" | "cinema";
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

  // 7. Kinoteatr / Cinema: Premier Cinema Hall & VIP Screening
  {
    id: "v-cinema-1",
    slug: "premier-cinema-vip-hall",
    name: "Premier Cinema Hall & VIP Screening Lounge",
    category: "cinema",
    categoryName: {
      uz: "Kinoteatr va VIP kinozallar",
      ru: "Кинотеатры и VIP залы",
      en: "Cinema & VIP Screening",
    },
    address: "Tashkent City Mall, 4-qavat, Botir Zokirov ko'chasi",
    city: "Toshkent",
    district: "Shayxontohur tumani",
    latitude: 41.3052,
    longitude: 69.2625,
    phone: "+998 71 202 88 00",
    email: "cinema@premierhall.uz",
    rating: 4.95,
    reviewCount: 184,
    pricePerHour: 250000,
    pricePerDay: 2000000,
    description: {
      uz: "Eksklyuziv shaxsiy kinoteatr va VIP kinozal. 4K lazer proyektor, Dolby Atmos 7.1 hajmli audio tizimi, qulay avtomatlashtirilgan charm kreslolar (recliner seats), popkorn va ichimliklar servisi. Shaxsiy film premyeralari, do'stlar bilan kino kechalari va PlayStation 5 turnirlari uchun mukammal tanlov.",
      ru: "Эксклюзивный частный кинотеатр и VIP кинозал. Лазерный 4K проектор, объемный звук Dolby Atmos 7.1, моторизованные кожаные кресла-реклайнеры, обслуживание с попкорном и напитками. Идеально для приватных просмотров и PS5 турниров.",
      en: "Exclusive private cinema and VIP screening lounge. Ultra-sharp 4K laser projection, Dolby Atmos 7.1 surround sound, motorized leather recliners, and in-room snack service. Ideal for private movie nights, presentations, and PS5 gaming.",
    },
    amenities: ["4K Laser Proyektor", "Dolby Atmos 7.1", "Recliner charm kreslolar", "PlayStation 5", "Popkorn & Bar", "Konditsioner", "Shaxsiy xizmat"],
    featuredImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1200&q=80",
    ],
    resources: [
      {
        id: "r-cinema-vip-1",
        name: "VIP Diamond Kinozali (15 kishilik)",
        categoryId: "cinema",
        capacity: 15,
        pricePerHour: 250000,
        pricePerDay: 2000000,
        minBookingDurationHours: 2,
        amenities: ["4K ekran", "Dolby Atmos", "Recliner stullar", "PS5"],
        images: ["https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80"],
        active: true,
      },
    ],
  },

  // 8. Kinoteatr / Cinema: Starlight Private Cinema
  {
    id: "v-cinema-2",
    slug: "starlight-private-cinema",
    name: "Starlight Private Cinema & Film Lounge",
    category: "cinema",
    categoryName: {
      uz: "Kinoteatr va VIP kinozallar",
      ru: "Кинотеатры и VIP залы",
      en: "Cinema & VIP Screening",
    },
    address: "Shahrisabz ko'chasi, 25A",
    city: "Toshkent",
    district: "Mirobod tumani",
    latitude: 41.3184,
    longitude: 69.281,
    phone: "+998 71 205 77 11",
    email: "booking@starlightcinema.uz",
    rating: 4.88,
    reviewCount: 96,
    pricePerHour: 180000,
    pricePerDay: 1400000,
    description: {
      uz: "Qulay shinam muhitga ega shaxsiy kinoteatr. Oila va kichik do'stlar davrasi uchun yumshoq divanlar, 150 dyuymli ulkan akustik ekran, Apple TV, Netflix, YouTube va karaoke tizimi.",
      ru: "Уютный частный кинозал с мягкими диванами, 150-дюймовым акустическим экраном, Apple TV, подписками на фильмы и караоке.",
      en: "Cozy private film lounge equipped with luxury plush couches, 150-inch acoustically transparent screen, streaming platforms, and high-end karaoke.",
    },
    amenities: ["150-dyuym Ekran", "Apple TV 4K", "Karaoke tizimi", "Yumshoq divanlar", "Qahva va Choy", "Konditsioner"],
    featuredImage: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    ],
    resources: [
      {
        id: "r-starlight-lounge",
        name: "Starlight Cozy Cinema Lounge (10 kishilik)",
        categoryId: "cinema",
        capacity: 10,
        pricePerHour: 180000,
        pricePerDay: 1400000,
        minBookingDurationHours: 2,
        amenities: ["150-dyuym Ekran", "Dolby Audio", "Karaoke", "Yumshoq divanlar"],
        images: ["https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80"],
        active: true,
      },
    ],
  },

  // 9. Sports: Chilonzor Padel & Tennis Club
  {
    id: "v-sports-3",
    slug: "chilonzor-padel-tennis-club",
    name: "Chilonzor Padel Arena & Tennis Club",
    category: "sports",
    categoryName: {
      uz: "Sport maydonlari",
      ru: "Спортивные площадки",
      en: "Sports Facilities",
    },
    address: "Bunyodkor shoh ko'chasi, 42-uy",
    city: "Toshkent",
    district: "Chilonzor tumani",
    latitude: 41.2825,
    longitude: 69.2084,
    phone: "+998 90 999 12 34",
    email: "padel@chilonzorarena.uz",
    rating: 4.86,
    reviewCount: 112,
    pricePerHour: 140000,
    pricePerDay: 1100000,
    description: {
      uz: "Ispaniya standartlari asosida barpo etilgan yopiq panoramik oynaviy padel kortlari va tennis maydoni. Yoritish tizimi professional LED projektorlar, kiyim almashtirish xonalari, dush va zamonaviy raketka ijarasi mavjud.",
      ru: "Крытые панорамные корты для падел-тенниса международного стандарта. Профессиональное освещение, раздевалки, душевые и прокат ракеток.",
      en: "Indoor panoramic glass padel courts built to international standards. Tournament-grade LED illumination, locker rooms, hot showers, and racket rentals.",
    },
    amenities: ["Panoramik Padel Korti", "Professional LED", "Dush va Kiyinish xonasi", "Raketka ijarasi", "Kafeteriy", "Avtoturargoh"],
    featuredImage: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80",
    ],
    resources: [
      {
        id: "r-padel-court-1",
        name: "Padel Kort №1 (Yopiq)",
        categoryId: "sports",
        capacity: 4,
        pricePerHour: 140000,
        pricePerDay: 1100000,
        minBookingDurationHours: 1,
        amenities: ["Panoramik oyna", "Professional chim", "LED yoritgichlar"],
        images: ["https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1200&q=80"],
        active: true,
      },
    ],
  },

  // 10. Events: Tashkent City Skyline Rooftop Terrace
  {
    id: "v-events-3",
    slug: "tashkent-city-skyline-terrace",
    name: "Tashkent City Skyline Rooftop Terrace",
    category: "events",
    categoryName: {
      uz: "Tadbir va Bayram zallari",
      ru: "Залы для мероприятий",
      en: "Event Halls & Banquets",
    },
    address: "Tashkent City, 22-qavat panoramik bino",
    city: "Toshkent",
    district: "Shayxontohur tumani",
    latitude: 41.3142,
    longitude: 69.252,
    phone: "+998 71 200 90 90",
    email: "rooftop@tashkentcity.uz",
    rating: 4.97,
    reviewCount: 168,
    pricePerHour: 850000,
    pricePerDay: 6000000,
    description: {
      uz: "Toshkent City markazida 22-qavatda joylashgan ochiq va yopiq panoramik tom terassasi. Shahar uzra 360 darajali fantastik ko'rinish, DJ boshqaruv pulti, kokteyl bari, lounge mebellar va yoritish uskunalari.",
      ru: "Панорамная терраса на крыше 22-го этажа в Tashkent City. Вид 360° на город, зона для диджея, лаундж-мебель и стильная иллюминация для закрытых вечеринок.",
      en: "Spectacular 22nd-floor rooftop terrace in Tashkent City. 360-degree city skyline view, DJ booth, cocktail bar, designer lounge furniture, and ambient lighting.",
    },
    amenities: ["360° Panorama Ko'rinish", "DJ Uskunasi", "Kokteyl Bar", "Lounge Mebellar", "Optik Wi-Fi", "VIP Lift"],
    featuredImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    ],
    resources: [
      {
        id: "r-rooftop-terrace",
        name: "Skyline Rooftop Lounge (120 kishilik)",
        categoryId: "events",
        capacity: 120,
        pricePerHour: 850000,
        pricePerDay: 6000000,
        minBookingDurationHours: 3,
        amenities: ["Panoramik ko'rinish", "Akustika", "Bar", "DJ zona"],
        images: ["https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80"],
        active: true,
      },
    ],
  },

  // 11. Events / Creative: White Loft Production Studio
  {
    id: "v-events-4",
    slug: "white-loft-production-studio",
    name: "White Loft Photo & Cinema Production Studio",
    category: "events",
    categoryName: {
      uz: "Tadbir va Ijodiy zallar",
      ru: "Залы для мероприятий",
      en: "Event & Creative Spaces",
    },
    address: "Shota Rustaveli ko'chasi, 64",
    city: "Toshkent",
    district: "Yakkasaroy tumani",
    latitude: 41.2985,
    longitude: 69.245,
    phone: "+998 90 321 00 22",
    email: "loft@whitestudio.uz",
    rating: 4.91,
    reviewCount: 78,
    pricePerHour: 120000,
    pricePerDay: 950000,
    description: {
      uz: "Keng oq sikloramali (cyclorama), baland shiftli zamonaviy fotostudiya va videoprodakshn zali. Godox va Profoto professional yoritish uskunalari, kiyinish xonasi, dush va qulay mebellar.",
      ru: "Просторная фото- и видеостудия с белой циклорамой и высоким потолком. Оборудование Profoto и Godox, гримерка, естественный свет и фактурные стены.",
      en: "High-ceiling creative photo and video production studio with seamless white cyclorama. Professional Profoto/Godox lighting, dedicated makeup stations, and props.",
    },
    amenities: ["Oq Siklorama", "Godox Professional Nur", "Grim xonasi", "Baland shift (5m)", "Wi-Fi 300 Mbps", "Konditsioner"],
    featuredImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    ],
    resources: [
      {
        id: "r-white-loft-main",
        name: "Siklorama va Asosiy Zal (30 kishilik)",
        categoryId: "events",
        capacity: 30,
        pricePerHour: 120000,
        pricePerDay: 950000,
        minBookingDurationHours: 2,
        amenities: ["Siklorama", "Profoto nurlar", "Grim xonasi"],
        images: ["https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80"],
        active: true,
      },
    ],
  },

  // 12. Meetings / Audio: SoundWave Pro Studio
  {
    id: "v-meetings-3",
    slug: "soundwave-pro-recording-studio",
    name: "SoundWave Pro Audio & Podcast Studio",
    category: "meetings",
    categoryName: {
      uz: "Majlis va Ovoz zallari",
      ru: "Переговорные и Аудиостудии",
      en: "Meetings & Audio Studios",
    },
    address: "Buyuk Ipak Yo'li, 15",
    city: "Toshkent",
    district: "Mirzo Ulug'bek tumani",
    latitude: 41.325,
    longitude: 69.295,
    phone: "+998 71 210 33 44",
    email: "sound@soundwave.uz",
    rating: 4.93,
    reviewCount: 64,
    pricePerHour: 90000,
    pricePerDay: 700000,
    description: {
      uz: "Professional ovoz yozish va podkast studiyasi. 4 kishilik Shure SM7B mikrofonlari, Rodecaster Pro II miksher pulti, 4K kameralar va mukammal ovoz izolyatsiyasi.",
      ru: "Профессиональная студия звукозаписи и подкастов. Микрофоны Shure SM7B, микшер Rodecaster Pro, 4K камеры и идеальная звукоизоляция.",
      en: "State-of-the-art podcast and audio production studio. Shure SM7B dynamic mics, Rodecaster Pro console, 4K video recording, and acoustic isolation.",
    },
    amenities: ["Shure SM7B mikrofonlar", "Rodecaster Pro II", "Ovoz izolyatsiyasi", "4K Kameralar", "Choy & Qahva", "Tezkor Wi-Fi"],
    featuredImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    ],
    resources: [
      {
        id: "r-soundwave-podcast",
        name: "Podkast va Ovoz Yozish Xonasi (6 kishilik)",
        categoryId: "meetings",
        capacity: 6,
        pricePerHour: 90000,
        pricePerDay: 700000,
        minBookingDurationHours: 1,
        amenities: ["4x Shure SM7B", "Ovoz izolyatsiyasi", "4K Kameralar"],
        images: ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80"],
        active: true,
      },
    ],
  },

  // 13. Sports / Esports: CyberArena Tashkent
  {
    id: "v-sports-4",
    slug: "cyberarena-tashkent-gaming",
    name: "CyberArena Tashkent Pro Gaming & Esports Bootcamp",
    category: "sports",
    categoryName: {
      uz: "Sport va Kiber maydonlar",
      ru: "Киберспорт и Тренировки",
      en: "Esports & Gaming Arenas",
    },
    address: "Yunusobod 4-mavze, 12-uy",
    city: "Toshkent",
    district: "Yunusobod tumani",
    latitude: 41.332,
    longitude: 69.288,
    phone: "+998 97 700 80 80",
    email: "info@cyberarena.uz",
    rating: 4.85,
    reviewCount: 220,
    pricePerHour: 45000,
    pricePerDay: 350000,
    description: {
      uz: "Professional kiber sport va butkemp (bootcamp) zali. RTX 4080 videokartalari, 360 Hz monitorlar, DXRacer o'yin kreslolari va gigabit tezlikdagi past pingli optik internet.",
      ru: "Профессиональный киберспортивный буткемп-зал. Компьютеры на RTX 4080, мониторы 360 Гц, кресла DXRacer и сверхнизкий пинг.",
      en: "Pro esports bootcamp and gaming arena. High-end RTX 4080 PCs, 360Hz monitors, DXRacer chairs, and dedicated ultra-low latency fiber line.",
    },
    amenities: ["RTX 4080 PC", "360 Hz Monitor", "Gigabit Internet (Ping 5ms)", "Konditsioner", "O'yin kreslolari", "Mini-bar"],
    featuredImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    ],
    resources: [
      {
        id: "r-cyberarena-bootcamp",
        name: "5x5 Pro Butkemp Xonasi (10 kishilik)",
        categoryId: "sports",
        capacity: 10,
        pricePerHour: 45000,
        pricePerDay: 350000,
        minBookingDurationHours: 2,
        amenities: ["RTX 4080", "360Hz", "Gigabit internet"],
        images: ["https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"],
        active: true,
      },
    ],
  },

  // 14. Meetings: Regus International Executive Boardroom
  {
    id: "v-meetings-4",
    slug: "regus-international-boardroom",
    name: "Regus International Executive Boardroom",
    category: "meetings",
    categoryName: {
      uz: "Majlis va Konferensiya",
      ru: "Переговорные и Конференции",
      en: "Meetings & Conferences",
    },
    address: "Oybek ko'chasi, 38A, Business Center",
    city: "Toshkent",
    district: "Mirobod tumani",
    latitude: 41.309,
    longitude: 69.278,
    phone: "+998 71 230 40 50",
    email: "tashkent@regus.com",
    rating: 4.94,
    reviewCount: 89,
    pricePerHour: 220000,
    pricePerDay: 1600000,
    description: {
      uz: "Xalqaro biznes standartidagi boshqaruv kengashi va VIP muzokaralar zali. Cisco telekonferensiya tizimi, 85 dyuymli 4K interaktiv taxta, sinxron tarjima uskunasi va qahva-breyk xizmati.",
      ru: "Представительская переговорная комната международного уровня. Системы видеосвязи Cisco, интерактивная панель 85 дюймов и кофе-брейк сервис.",
      en: "Premium international executive boardroom. Cisco teleconferencing, 85-inch 4K touchscreen display, soundproofing, and coffee break catering.",
    },
    amenities: ["Cisco Telekonferensiya", "85\" 4K Sensor Panel", "Herman Miller Stullar", "Qahva-breyk Servisi", "Avtoturargoh"],
    featuredImage: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
    ],
    resources: [
      {
        id: "r-regus-boardroom",
        name: "Executive Boardroom (20 kishilik)",
        categoryId: "meetings",
        capacity: 20,
        pricePerHour: 220000,
        pricePerDay: 1600000,
        minBookingDurationHours: 1,
        amenities: ["Cisco Video", "85 dyuym ekran", "VIP kofe"],
        images: ["https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80"],
        active: true,
      },
    ],
  },

  // 15. Meetings: Registan Grand Conference Hall Samarqand
  {
    id: "v-meetings-5",
    slug: "samarqand-registan-conference-hall",
    name: "Registan Grand Conference Hall Samarqand",
    category: "meetings",
    categoryName: {
      uz: "Majlis va Konferensiya",
      ru: "Переговорные и Конференции",
      en: "Meetings & Conferences",
    },
    address: "Universitet xiyoboni, 14",
    city: "Samarqand",
    district: "Markaziy tuman",
    latitude: 39.6542,
    longitude: 66.9597,
    phone: "+998 66 233 44 55",
    email: "samarkand@registangrand.uz",
    rating: 4.96,
    reviewCount: 145,
    pricePerHour: 280000,
    pricePerDay: 2200000,
    description: {
      uz: "Samarqand markazidagi xalqaro forum va konferensiyalar zali. 250 kishilik amfiteatr zali, sinxron tarjima kabinalari, ulkan LED devor va bepul yuqori tezlikdagi Wi-Fi.",
      ru: "Международный конференц-зал в Самарканде на 250 мест. Кабины синхронного перевода, LED видеостена и зона для кофе-брейков.",
      en: "Prestigious conference auditorium in central Samarkand seating 250 attendees. Simultaneous translation booths, giant LED wall, and catering area.",
    },
    amenities: ["250 kishilik amfiteatr", "Sinxron tarjima", "LED Devor", "Simsiz mikrofonlar", "Qahva zali"],
    featuredImage: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    ],
    resources: [
      {
        id: "r-samarkand-main-hall",
        name: "Asosiy Konferens Zali (250 kishilik)",
        categoryId: "meetings",
        capacity: 250,
        pricePerHour: 280000,
        pricePerDay: 2200000,
        minBookingDurationHours: 3,
        amenities: ["250 o'rin", "LED ekran", "Sinxron tarjima"],
        images: ["https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80"],
        active: true,
      },
    ],
  },

  // 16. Coworking: Bukhara Silk Road IT Hub
  {
    id: "v-coworking-3",
    slug: "buxoro-silk-road-it-hub",
    name: "Bukhara Silk Road IT & Creative Coworking",
    category: "coworking",
    categoryName: {
      uz: "Kovorking va O'qish",
      ru: "Коворкинг и Учеба",
      en: "Coworking & Study",
    },
    address: "Ibn Sino ko'chasi, 22",
    city: "Buxoro",
    district: "Tarixiy markaz",
    latitude: 39.7747,
    longitude: 64.4286,
    phone: "+998 65 220 11 22",
    email: "bukhara@silkhub.uz",
    rating: 4.87,
    reviewCount: 73,
    pricePerHour: 25000,
    pricePerDay: 130000,
    description: {
      uz: "Buxoroning qadimiy g'ishtli me'morchiligi va zamonaviy IT infratuzilmasi uyg'unlashgan qulay kovorking maydoni. Optik internet, alohida zoom xonalari, qahvaxona va terrasa.",
      ru: "Уникальный коворкинг в Бухаре, сочетающий восточный колорит и современную IT-инфраструктуру. Скоростной интернет, тихие зоны и кофе.",
      en: "Unique coworking space in Bukhara combining historic brick architecture with modern tech amenities. High-speed fiber, meeting pods, and specialty espresso bar.",
    },
    amenities: ["Wi-Fi 300 Mbps", "Zoom xonasi", "Shinam qahvaxona", "Konditsioner", "Ochiq terrasa"],
    featuredImage: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    ],
    resources: [
      {
        id: "r-bukhara-desk",
        name: "Yakkalik Ish Stoli (Buxoro IT Hub)",
        categoryId: "coworking",
        capacity: 1,
        pricePerHour: 25000,
        pricePerDay: 130000,
        minBookingDurationHours: 1,
        amenities: ["Ergonomik stol", "Wi-Fi", "Kofe"],
        images: ["https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"],
        active: true,
      },
    ],
  },

  // 17. Sports / Dance: Art & Motion Dance Studio
  {
    id: "v-sports-5",
    slug: "art-motion-dance-studio",
    name: "Art & Motion Dance & Rehearsal Studio",
    category: "sports",
    categoryName: {
      uz: "Sport va Raqs maydonlari",
      ru: "Спортивные и Танцевальные залы",
      en: "Dance & Rehearsal Studios",
    },
    address: "Navoiy shoh ko'chasi, 88",
    city: "Toshkent",
    district: "Shayxontohur tumani",
    latitude: 41.315,
    longitude: 69.268,
    phone: "+998 90 111 44 77",
    email: "dance@artmotion.uz",
    rating: 4.89,
    reviewCount: 88,
    pricePerHour: 80000,
    pricePerDay: 650000,
    description: {
      uz: "Professional parket polli, to'liq oynali devorli zamonaviy raqs va teatr repetitsiya zali. JBL akustik audio tizimi, kiyim almashtirish xonasi va konditsioner.",
      ru: "Просторный танцевальный зал с паркетом, зеркалами во всю стену, мощной акустикой JBL и климат-контролем.",
      en: "Spacious dance and choreography rehearsal studio with spring-loaded parquet floor, full-wall mirrors, JBL sound system, and climate control.",
    },
    amenities: ["Oynali devor", "Parket pol", "JBL Audio Tizimi", "Kiyinish xonasi", "Konditsioner"],
    featuredImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
    ],
    resources: [
      {
        id: "r-dance-studio-main",
        name: "Katta Raqs Zali (30 kishilik)",
        categoryId: "sports",
        capacity: 30,
        pricePerHour: 80000,
        pricePerDay: 650000,
        minBookingDurationHours: 1,
        amenities: ["Oynalar", "JBL Sound", "Parket"],
        images: ["https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80"],
        active: true,
      },
    ],
  },

  // 18. Sports / Action: Apex Tactical Paintball Park
  {
    id: "v-sports-6",
    slug: "apex-tactical-paintball-arena",
    name: "Apex Tactical Paintball & Laser Tag Park",
    category: "sports",
    categoryName: {
      uz: "Sport maydonlari",
      ru: "Спортивные площадки",
      en: "Sports Facilities",
    },
    address: "Bo'zsuv sohil bo'yi, 5",
    city: "Toshkent",
    district: "Yunusobod tumani",
    latitude: 41.345,
    longitude: 69.315,
    phone: "+998 99 888 77 66",
    email: "game@apexpaintball.uz",
    rating: 4.92,
    reviewCount: 175,
    pricePerHour: 110000,
    pricePerDay: 900000,
    description: {
      uz: "Ochiq havoda 3000 kv.m maydonga ega eng yirik taktik peyntbol va lazerteg poligon. Barcha harbiy to'siqlar, yangi maskalar, himoya liboslari va professional hakamlik xizmati.",
      ru: "Самый большой полигон для пейнтбола и лазертага на 3000 кв.м. Защитная экипировка, современные маркеры и зона барбекю.",
      en: "Tashkent's premier 3000 sq.m tactical outdoor paintball and laser tag park. Modern protective gear, tactical bunkers, and BBQ picnic pavilions.",
    },
    amenities: ["3000 kv.m Poligon", "Himoya kiyimi va maska", "Peyntbol qurollari", "Besedka & Mangal", "Dush & Kiyinish xonasi"],
    featuredImage: "https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1200&q=80",
    ],
    resources: [
      {
        id: "r-paintball-field",
        name: "Asosiy Taktik Maydon (20 kishilik)",
        categoryId: "sports",
        capacity: 20,
        pricePerHour: 110000,
        pricePerDay: 900000,
        minBookingDurationHours: 1,
        amenities: ["Poligon", "Himoya kiyimi", "Ekipirovka"],
        images: ["https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1200&q=80"],
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
