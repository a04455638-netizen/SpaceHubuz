import OpenAI from "openai";
import { CURATED_VENUES, type CuratedVenue } from "../mock-venues.ts";
import { formatPrice } from "../../lib/format-price.ts";

export interface ConciergeMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface SuggestedVenueCard {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryLabel: string;
  city: string;
  address: string;
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  priceFormatted: string;
  image: string;
  description: string;
  amenities: string[];
  canBookDirect: boolean;
  bookingResourceId?: string;
  latitude: number;
  longitude: number;
}

export interface ConciergeResponse {
  message: string;
  suggestedVenues?: SuggestedVenueCard[];
  isFallback: boolean;
}

export interface CategorySummary {
  id: string;
  name: string;
  examples: readonly string[];
}

export const CORE_CATEGORIES: readonly CategorySummary[] = [
  {
    id: "coworking",
    name: "Ish va o'qish (Coworking)",
    examples: ["Kovorking", "Ish stoli", "O'quv xonasi", "Kutubxona joyi"],
  },
  {
    id: "sports",
    name: "Sport inshootlari",
    examples: [
      "Futbol maydoni",
      "Tennis korti",
      "Padel korti",
      "Basseyn",
      "Basketbol maydoni",
    ],
  },
  {
    id: "restaurant",
    name: "Restoran va Choyxonalar",
    examples: ["Restoran", "VIP xona", "Choyxona", "Kafe", "Oilaviy ovqatlanish"],
  },
  {
    id: "meetings",
    name: "Uchrashuv va trening",
    examples: [
      "Majlis xonasi",
      "Konferensiya zali",
      "Trening xonasi",
      "Muzokara xonasi",
    ],
  },
  {
    id: "events",
    name: "Tadbir va bayram joylari",
    examples: [
      "To'yxona",
      "Banket zali",
      "Tug'ilgan kun joyi",
      "Rooftop terassa",
    ],
  },
  {
    id: "cinema",
    name: "Kinoteatr va kinozallar",
    examples: ["VIP Kinoteatr", "Xususiy kinozal", "Film tomosha qilish"],
  },
];

export const CONCIERGE_TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "search_venues",
      description: "Search verified bookable places and venues across Uzbekistan with strict category filters",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: [
              "football",
              "basketball",
              "swimming_pool",
              "tennis",
              "restaurant",
              "events",
              "birthday",
              "cinema",
              "meetings",
              "coworking",
            ],
            description: "The specific intent category of venue requested by the user",
          },
          city: {
            type: "string",
            description: "City or district name (e.g., Toshkent, Chilonzor, Samarqand)",
          },
          guestCount: {
            type: "number",
            description: "Requested number of guests or participants (e.g. 5)",
          },
          budgetPreference: {
            type: "string",
            enum: ["cheap", "standard", "vip"],
            description: "Price or budget preference: cheap (arzon), standard, or vip/premium",
          },
        },
        required: ["category"],
      },
    },
  },
];

export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({ apiKey });
}

export function getOpenAIModel(): string {
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}

export function getSystemPrompt(locale: "uz" | "ru" | "en" = "uz"): string {
  switch (locale) {
    case "ru":
      return `Вы — универсальный официальный AI-ассистент платформы бронирования SpaceHub UZ.
СТРОГИЕ ПРАВИЛА:
1. Язык интерфейса сайта — РУССКИЙ. Отвечайте ТОЛЬКО на русском языке.
2. Если пользователь пишет на узбекском или английском, вежливо ответьте на русском: "Извините, я вас не понял. Пожалуйста, напишите ваш вопрос на русском языке, так как на сайте выбран русский язык. (Вы также можете переключить язык сайта в верхнем меню)."
3. ТОЧНОЕ ОПРЕДЕЛЕНИЕ КАТЕГОРИИ:
   - Футбол/Футзал -> Только футбольные поля (НЕ коворкинги!).
   - Бассейн -> Только плавательные бассейны.
   - Ресторан/Кафе -> Только рестораны и банкетные залы.
   - Теннис/Падел -> Только теннисные корты.
   - День рождения/Праздник -> Залы торжеств, рестораны, VIP-кинотеатры.
   - Коворкинг -> Коворкинги и рабочие места.
4. Вызывайте функцию search_venues с правильной категорией.
5. Для общих вопросов (приветствие, правила сервиса, способы оплаты) отвечайте вежливо без вызова поиска площадок.`;

    case "en":
      return `You are the universal AI Booking Assistant for the SpaceHub UZ booking platform.
STRICT RULES:
1. The user's active website language is ENGLISH. Respond STRICTLY in English.
2. If the user writes in Uzbek or Russian, respond in English: "I did not understand your message in that language. Please ask your question in English, as your selected interface language is English. (Or switch language in the top menu)."
3. PRECISE INTENT & CATEGORY:
   - Football/Soccer -> Football fields and futsal arenas ONLY (NEVER coworking spaces).
   - Swimming pool -> Swimming pools ONLY.
   - Restaurant -> Restaurants and private dining halls ONLY.
   - Tennis/Padel -> Tennis and padel courts ONLY.
   - Birthday/Party -> Event halls, restaurants, screening lounges.
   - Coworking -> Coworking desks and shared offices ONLY.
4. Call search_venues function with the matching category.
5. For general questions (greetings, payment methods, how it works), answer normally without searching venues.`;

    case "uz":
    default:
      return `Sen SpaceHub UZ platformasining universal aqlli bron yordamchisi (AI Booking Assistant)san.
QAT'IY QOIDALAR:
1. Saytning tanlangan tili — O'ZBEKCHA. Barcha javoblarni xushmuomala tarzda O'ZBEK tilida ber.
2. Agar foydalanuvchi rus yoki ingliz tilida yozsa, o'zbek tilida: "Kechirasiz, men sizni to'liq tushunmadim. Iltimos, savolingizni o'zbek tilida bering, chunki sayt tili o'zbekcha qilib tanlangan. (Yoki yuqori menyudan sayt tilini o'zgartirishingiz mumkin)." deb javob ber.
3. KATEGORIYANI ANIQ ANIQLASH:
   - Futbol / Futsal -> Faqat futbol maydonlari (Hech qachon kovorking emas!).
   - Basseyn -> Faqat suzish havzalari va akva zallar.
   - Restoran -> Faqat restoranlar va milliy choyxonalar.
   - Tennis -> Faqat tennis va padel kortlari.
   - Tug'ilgan kun / Tadbirlar -> Restoranlar, tadbir zallari va kino zallari.
   - Kovorking -> Faqat kovorking va ish stollari.
4. Doim search_venues funksiyasini chaqir.
5. Umumiy savollarga (salomlashish, qoidalar, to'lov usullari) joylarni tavsiya qilmasdan to'g'ridan-to'g'ri tushuntirib javob ber.`;
  }
}

/**
 * Transforms a CuratedVenue into a rich UI recommendation card.
 */
function venueToCard(v: CuratedVenue, locale: "uz" | "ru" | "en"): SuggestedVenueCard {
  const resource = v.resources[0];
  return {
    id: v.id,
    name: v.name,
    slug: v.slug,
    category: v.category,
    categoryLabel: v.categoryName[locale] || v.categoryName.uz,
    city: v.city,
    address: `${v.address}, ${v.district}`,
    rating: v.rating,
    reviewCount: v.reviewCount,
    pricePerHour: v.pricePerHour,
    priceFormatted: `${formatPrice(v.pricePerHour)} UZS`,
    image: v.featuredImage,
    description: v.description[locale] || v.description.uz,
    amenities: v.amenities.slice(0, 4),
    canBookDirect: true,
    bookingResourceId: resource?.id,
    latitude: v.latitude,
    longitude: v.longitude,
  };
}

export type DetectedIntentCategory =
  | "football"
  | "basketball"
  | "swimming_pool"
  | "tennis"
  | "restaurant"
  | "birthday"
  | "cinema"
  | "meetings"
  | "coworking"
  | "general";

function normalizeQueryText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u2018\u2019\u201B\u2032`´]/g, "'")
    .trim();
}

function hasKeyword(text: string, keywords: string[]): boolean {
  const norm = normalizeQueryText(text);
  const words = norm.split(/[\s,.;:!?()[\]{}"/\\-]+/).filter(Boolean);

  return keywords.some((kw) => {
    const k = normalizeQueryText(kw);
    if (k.includes(" ")) {
      return norm.includes(k);
    }
    return words.some((w) => w === k || w.startsWith(k));
  });
}

/**
 * Reliable multilingual category & intent detector.
 * Avoids false substring matches (e.g. "ish" inside verbs).
 */
export function detectUserIntent(query: string): {
  category: DetectedIntentCategory;
  guestCount?: number;
  isCheap?: boolean;
  district?: string;
} {
  const q = normalizeQueryText(query);

  // Extract party size / guest count (e.g. "5 kishilik", "10 odam", "4 guests")
  let guestCount: number | undefined;
  const guestMatch = q.match(/\b(\d+)\s*(kishilik|kishi|odam|person|people|человек|персон|guests?)\b/);
  if (guestMatch && guestMatch[1]) {
    guestCount = parseInt(guestMatch[1], 10);
  }

  // Budget preference
  const isCheap = hasKeyword(q, ["arzon", "cheap", "дешев", "arzonroq", "ekonom"]);

  // District / City
  let district: string | undefined;
  if (hasKeyword(q, ["chilonzor", "чиланзар"])) district = "Chilonzor";
  if (hasKeyword(q, ["yunusobod", "юнусабад"])) district = "Yunusobod";
  if (hasKeyword(q, ["mirobod", "мирабад"])) district = "Mirobod";
  if (hasKeyword(q, ["samarqand", "самарканд"])) district = "Samarqand";
  if (hasKeyword(q, ["buxoro", "бухара"])) district = "Buxoro";

  // Strict category keyword matching
  // 1. FOOTBALL / FUTSAL
  if (hasKeyword(q, ["futbol", "futsal", "football", "soccer", "футбол", "футзал"])) {
    return { category: "football", guestCount, isCheap, district };
  }

  // 2. BASKETBALL / VOLLEYBALL
  if (hasKeyword(q, ["basketbol", "basketball", "voleybol", "volleyball", "баскетбол", "волейбол"])) {
    return { category: "basketball", guestCount, isCheap, district };
  }

  // 3. SWIMMING POOL / BASSEYN
  if (hasKeyword(q, ["basseyn", "hovuz", "cho'milish", "suzish", "swimming", "pool", "бассейн", "плавание"])) {
    return { category: "swimming_pool", guestCount, isCheap, district };
  }

  // 4. TENNIS / PADEL
  if (hasKeyword(q, ["tennis", "padel", "kort", "теннис", "падел", "корт"])) {
    return { category: "tennis", guestCount, isCheap, district };
  }

  // 5. RESTAURANTS / DINING
  if (hasKeyword(q, ["restoran", "restaurant", "choyxona", "kafe", "cafe", "tamaddixona", "ресторан", "чайхана", "кафе"])) {
    return { category: "restaurant", guestCount, isCheap, district };
  }

  // 6. BIRTHDAY / PARTY / CELEBRATION
  if (hasKeyword(q, ["tug'ilgan kun", "tugilgan kun", "birthday", "to'y", "banket", "party", "bayram", "tantana", "банкет", "день рождения", "праздник"])) {
    return { category: "birthday", guestCount, isCheap, district };
  }

  // 7. CINEMA / SCREENING
  if (hasKeyword(q, ["kino", "cinema", "kinoteatr", "film", "kinozal", "кино", "кинотеатр"])) {
    return { category: "cinema", guestCount, isCheap, district };
  }

  // 8. MEETINGS / CONFERENCE
  if (hasKeyword(q, ["majlis", "konferens", "muzokara", "trening", "meeting", "conference", "boardroom", "переговорн", "конференц"])) {
    return { category: "meetings", guestCount, isCheap, district };
  }

  // 9. COWORKING / WORKSPACE
  if (hasKeyword(q, ["kovorking", "coworking", "ish stoli", "ish joyi", "openspace", "ishlashga joy", "ishlash uchun", "коворкинг", "рабочее место", "офис"])) {
    return { category: "coworking", guestCount, isCheap, district };
  }

  return { category: "general", guestCount, isCheap, district };
}

/**
 * Searches and ranks real venues strictly matching category and filters.
 */
export function queryRealVenues(
  category: DetectedIntentCategory,
  options?: { guestCount?: number; isCheap?: boolean; district?: string },
  locale: "uz" | "ru" | "en" = "uz"
): SuggestedVenueCard[] {
  let matched = [...CURATED_VENUES];

  switch (category) {
    case "football":
      matched = matched.filter(
        (v) =>
          v.category === "sports" &&
          (v.slug.includes("futsal") ||
            v.slug.includes("football") ||
            v.name.toLowerCase().includes("futsal") ||
            v.name.toLowerCase().includes("football"))
      );
      break;

    case "basketball":
      matched = matched.filter(
        (v) =>
          v.category === "sports" &&
          (v.slug.includes("basket") || v.name.toLowerCase().includes("basket"))
      );
      break;

    case "swimming_pool":
      matched = matched.filter(
        (v) =>
          v.category === "sports" &&
          (v.slug.includes("pool") ||
            v.slug.includes("suv") ||
            v.name.toLowerCase().includes("basseyn") ||
            v.name.toLowerCase().includes("pool"))
      );
      break;

    case "tennis":
      matched = matched.filter(
        (v) =>
          v.category === "sports" &&
          (v.slug.includes("tennis") ||
            v.slug.includes("padel") ||
            v.name.toLowerCase().includes("tennis") ||
            v.name.toLowerCase().includes("padel"))
      );
      break;

    case "restaurant":
      matched = matched.filter((v) => v.category === "restaurant");
      break;

    case "birthday":
      // For birthday / parties, recommend restaurants, event halls, and VIP cinemas
      matched = matched.filter(
        (v) =>
          v.category === "restaurant" ||
          v.category === "events" ||
          v.slug.includes("cinema") ||
          v.slug.includes("rooftop")
      );
      break;

    case "cinema":
      matched = matched.filter((v) => v.category === "cinema");
      break;

    case "meetings":
      matched = matched.filter((v) => v.category === "meetings");
      break;

    case "coworking":
      matched = matched.filter((v) => v.category === "coworking");
      break;

    default:
      return [];
  }

  // Filter by capacity if guest count is given
  if (options?.guestCount && options.guestCount > 0) {
    const minCap = options.guestCount;
    const capacityFiltered = matched.filter((v) =>
      v.resources.some((r) => r.capacity >= minCap)
    );
    if (capacityFiltered.length > 0) {
      matched = capacityFiltered;
    }
  }

  // Filter or prioritize district
  if (options?.district) {
    const dist = options.district.toLowerCase();
    const districtMatched = matched.filter(
      (v) =>
        v.district.toLowerCase().includes(dist) ||
        v.city.toLowerCase().includes(dist)
    );
    if (districtMatched.length > 0) {
      matched = districtMatched;
    }
  }

  // Sorting: If cheap is requested, sort ascending by price; else sort by rating & reviews
  if (options?.isCheap) {
    matched.sort((a, b) => a.pricePerHour - b.pricePerHour);
  } else {
    matched.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });
  }

  return matched.slice(0, 3).map((v) => venueToCard(v, locale));
}

/**
 * Universal fallback AI response generator when OpenAI API key is unset or as deterministic resolver.
 */
export function generateFallbackResponse(
  userQuery: string,
  categories: readonly CategorySummary[] = CORE_CATEGORIES,
  locale: "uz" | "ru" | "en" = "uz"
): ConciergeResponse {
  const query = userQuery.toLowerCase().trim();

  const isUzbekQuery =
    /\b(salom|qanday|qayerda|kerak|joy|bron|qancha|narxi|xona|maydon|bor|menga|rahmat|iltimos|uchun|qilish|bormi|qayer|yaxshi|topib)\b/i.test(
      query
    ) ||
    query.includes("o'zbek") ||
    query.includes("ozbek");

  const isRussianQuery = /[а-яё]/i.test(query);

  const isEnglishQuery =
    /\b(hello|hi|hey|where|how|what|need|book|booking|price|cost|room|arena|space|tashkent|which|good|desk|find)\b/i.test(
      query
    );

  // Check language directive compliance
  if (locale === "ru") {
    if (isUzbekQuery && !isRussianQuery) {
      return {
        message:
          "Извините, я не понял ваше сообщение на этом языке. Пожалуйста, напишите ваш вопрос на русском языке, так как на сайте выбран русский язык. (Вы также можете переключить язык на O‘zbekcha в верхнем меню). Чем я могу вам помочь?",
        isFallback: true,
      };
    }
  } else if (locale === "en") {
    if ((isUzbekQuery || isRussianQuery) && !isEnglishQuery) {
      return {
        message:
          "I didn't understand your message in that language. Please ask your question in English, as your selected website language is English. (If you prefer Uzbek, you can switch the website language to O‘zbekcha from the top menu). How can I assist you with booking a space today?",
        isFallback: true,
      };
    }
  } else {
    // Uzbek locale default
    if (isEnglishQuery && !isUzbekQuery) {
      return {
        message:
          "Kechirasiz, men sizning savolingizni to'liq tushunmadim. Sayt tili o'zbekcha qilib tanlangani sababli, iltimos, savolingizni o'zbek tilida bering. (Yoki yuqoridagi menyudan sayt tilini English ga o'zgartirishingiz mumkin). Sizga qanday joy kerak?",
        isFallback: true,
      };
    }
  }

  // Detect user's intent accurately
  const intent = detectUserIntent(query);

  // Handle general non-booking questions gracefully without forcing venue recommendations
  if (intent.category === "general") {
    if (
      /\b(salom|assalomu alaykum|qalaysiz|qandaysiz|privet|hello|hi|hey|здравствуйте|привет)\b/i.test(
        query
      )
    ) {
      const greetingMsg =
        locale === "ru"
          ? "Здравствуйте! Я официальный AI-ассистент платформы SpaceHub UZ. Я помогу вам мгновенно найти и забронировать футбольные поля, бассейны, теннисные корты, рестораны, банкетные залы и коворкинги. Что именно вы ищете?"
          : locale === "en"
          ? "Hello! I am the SpaceHub UZ AI Booking Assistant. I can help you discover and book verified football arenas, swimming pools, tennis courts, restaurants, event halls, and coworking spaces in Uzbekistan. What space are you looking for?"
          : "Assalomu alaykum! Men SpaceHub UZ ning aqlli bron yordamchisiman. Sizga futbol maydonlari, basseynlar, tennis kortlari, restoranlar, tadbir zallari yoki kovorkinglarni topish va darhol bron qilishda yordam bera olaman. Sizga qanday joy kerak?";

      return {
        message: greetingMsg,
        isFallback: true,
      };
    }

    if (/\b(qanday|to['’`]?lov|click|payme|bekor|qoida|how|payment|как|оплата)\b/i.test(query)) {
      const infoMsg =
        locale === "ru"
          ? "На SpaceHub UZ вы можете выбрать нужное время и моментально забронировать его онлайн. Оплата поддерживается через Click.uz, Payme или наличными на месте. Бесплатная отмена возможна за 24 часа до начала. Какую площадку вы хотите забронировать?"
          : locale === "en"
          ? "On SpaceHub UZ, you can select your preferred time slot and book it with guaranteed real-time availability. We support Click.uz, Payme, and cash at venue. Free cancellation is available up to 24 hours prior. Which venue would you like to book?"
          : "SpaceHub UZ orqali bo'sh vaqtni tanlab, 1 daqiqada real vaqtda kafolatlangan bron qilishingiz mumkin. To'lov Click.uz, Payme yoki joyida naqd to'lash orqali amalga oshiriladi. 24 soat oldin bepul bekor qilish imkoniyati mavjud. Qaysi joy sizni qiziqtirmoqda?";

      return {
        message: infoMsg,
        isFallback: true,
      };
    }
  }

  // Query real venues from database
  const suggestedVenues = queryRealVenues(
    intent.category,
    {
      guestCount: intent.guestCount,
      isCheap: intent.isCheap,
      district: intent.district,
    },
    locale
  );

  // If no venues match:
  if (suggestedVenues.length === 0) {
    const emptyMsg =
      locale === "ru"
        ? "К сожалению, по указанным критериям подходящих площадок сейчас не найдено. Пожалуйста, попробуйте изменить параметры поиска или ознакомьтесь с [Каталогом всех пространств](/explore)."
        : locale === "en"
        ? "Unfortunately, no venues matching your exact criteria were found at the moment. Please try adjusting your search filters or browse our [Complete Catalog](/explore)."
        : "Afsuski, kiritilgan talablar bo'yicha hozircha mos joy topilmadi. Qidiruv so'zlarini o'zgartirib ko'rishingiz yoki barcha joylar ro'yxatini [Katalogimizda](/explore) ko'rishingiz mumkin.";

    return {
      message: emptyMsg,
      isFallback: true,
    };
  }

  const bestVenue = suggestedVenues[0];

  // Construct natural message in appropriate language
  let responseText = "";

  if (locale === "ru") {
    switch (intent.category) {
      case "football":
        responseText = `Для игры в футбол рекомендуем **${bestVenue.name}** (${bestVenue.address}). Профессиональный газон FIFA, вечерние прожекторы и удобные раздевалки. Стоимость от **${bestVenue.priceFormatted}/час**. Выберите удобное время и забронируйте онлайн:`;
        break;
      case "basketball":
        responseText = `Для баскетбола отлично подойдет **${bestVenue.name}** (${bestVenue.address}) с паркетным полом и табло. Стоимость: **${bestVenue.priceFormatted}/час**. Доступные слоты для бронирования:`;
        break;
      case "swimming_pool":
        responseText = `По вашему запросу рекомендуем **${bestVenue.name}** (${bestVenue.address}). Подогреваемая вода 28°C, финская сауна и дорожки. Стоимость от **${bestVenue.priceFormatted}/час**. Ознакомьтесь с деталями:`;
        break;
      case "restaurant":
        responseText = `Для трапезы ${intent.guestCount ? `на ${intent.guestCount} персон` : ""} рекомендуем **${bestVenue.name}** (${bestVenue.address}). Уютные VIP-залы, национальная и европейская кухня. Стоимость от **${bestVenue.priceFormatted}/час**:`;
        break;
      case "birthday":
        responseText = `Для празднования дня рождения отлично подойдет **${bestVenue.name}** (${bestVenue.address}). Праздничная атмосфера, банкетное обслуживание и VIP-залы. Стоимость от **${bestVenue.priceFormatted}/час**:`;
        break;
      case "tennis":
        responseText = `Для тенниса рекомендуем **${bestVenue.name}** (${bestVenue.address}) ${intent.isCheap ? "(по доступной цене)" : ""}. Стоимость от **${bestVenue.priceFormatted}/час**. Выберите время для игры:`;
        break;
      case "cinema":
        responseText = `Для приватного просмотра фильмов рекомендуем **${bestVenue.name}** (${bestVenue.address}). 4K лазерный проектор и VIP-кресла. Стоимость от **${bestVenue.priceFormatted}/час**:`;
        break;
      case "meetings":
        responseText = `Для деловых встреч и переговоров рекомендуем **${bestVenue.name}** (${bestVenue.address}). Высокоскоростной интернет, экраны и микрофоны. Стоимость от **${bestVenue.priceFormatted}/час**:`;
        break;
      case "coworking":
      default:
        responseText = `В Ташкенте для работы и учебы рекомендуем **${bestVenue.name}** (${bestVenue.address}). Оптоволоконный интернет 500 Мбит/с, зоны отдыха и кофе. Стоимость от **${bestVenue.priceFormatted}/час**:`;
        break;
    }
  } else if (locale === "en") {
    switch (intent.category) {
      case "football":
        responseText = `For football, we recommend **${bestVenue.name}** (${bestVenue.address}). Features FIFA-certified turf, floodlights, and modern locker rooms. Rates from **${bestVenue.priceFormatted}/hour**. Select a time slot below to book:`;
        break;
      case "basketball":
        responseText = `For basketball, check out **${bestVenue.name}** (${bestVenue.address}) with genuine wooden parquet and scoreboards. Rates from **${bestVenue.priceFormatted}/hour**:`;
        break;
      case "swimming_pool":
        responseText = `For swimming, we recommend **${bestVenue.name}** (${bestVenue.address}). Features 28°C heated water, Finnish sauna, and lap lanes. Rates from **${bestVenue.priceFormatted}/hour**:`;
        break;
      case "restaurant":
        responseText = `For dining ${intent.guestCount ? `for ${intent.guestCount} guests` : ""}, we recommend **${bestVenue.name}** (${bestVenue.address}). Private VIP halls and gourmet cuisine. Rates from **${bestVenue.priceFormatted}/hour**:`;
        break;
      case "birthday":
        responseText = `For birthdays and celebrations, **${bestVenue.name}** (${bestVenue.address}) is an ideal choice with private party halls and custom dining. Rates from **${bestVenue.priceFormatted}/hour**:`;
        break;
      case "tennis":
        responseText = `For tennis, we recommend **${bestVenue.name}** (${bestVenue.address}) ${intent.isCheap ? "(budget-friendly rates)" : ""}. Rates from **${bestVenue.priceFormatted}/hour**:`;
        break;
      case "cinema":
        responseText = `For private movie screenings, we recommend **${bestVenue.name}** (${bestVenue.address}). Features 4K projection and Dolby sound. Rates from **${bestVenue.priceFormatted}/hour**:`;
        break;
      case "meetings":
        responseText = `For meetings and workshops, we recommend **${bestVenue.name}** (${bestVenue.address}). Fast Wi-Fi, 4K display, and whiteboard. Rates from **${bestVenue.priceFormatted}/hour**:`;
        break;
      case "coworking":
      default:
        responseText = `For work and focus in Tashkent, we recommend **${bestVenue.name}** (${bestVenue.address}). 500 Mbps internet, ergonomic workstations, and coffee. Rates from **${bestVenue.priceFormatted}/hour**:`;
        break;
    }
  } else {
    // Uzbek response
    switch (intent.category) {
      case "football":
        responseText = `Futbol uchun eng yaxshi variant — **${bestVenue.name}** (${bestVenue.address}). FIFA talabidagi sun'iy chim, kechki chiroqlar va dush xonalari mavjud. Narxi: **${bestVenue.priceFormatted}/soat**. Quyidagi tugmalar orqali xaritada ko'rishingiz yoki darhol bron qilishingiz mumkin:`;
        break;
      case "basketball":
        responseText = `Basketbol uchun **${bestVenue.name}** (${bestVenue.address}) maydonini tavsiya qilaman. Sifatli yog'och parket, elektron tablo va dush mavjud. Narxi: **${bestVenue.priceFormatted}/soat**:`;
        break;
      case "swimming_pool":
        responseText = `Basseyn bo'yicha **${bestVenue.name}** (${bestVenue.address}) ajoyib tanlov. 28°C doimiy isitiladigan toza suv, Fin saunasi va dush mavjud. Narxi: **${bestVenue.priceFormatted}/soat**:`;
        break;
      case "restaurant":
        responseText = `${intent.guestCount ? `${intent.guestCount} kishilik tashrif uchun ` : ""}shinam va mazali **${bestVenue.name}** (${bestVenue.address}) restoranini tavsiya qilaman. Alohida qulay VIP xonalar va milliy taomlar mavjud. Narxi: **${bestVenue.priceFormatted}/soat**:`;
        break;
      case "birthday":
        responseText = `Tug'ilgan kunni unutilmas nishonlash uchun **${bestVenue.name}** (${bestVenue.address}) eng to'g'ri tanlov. Bayramona muhit, maxsus xizmat va shinam zallar mavjud. Narxi: **${bestVenue.priceFormatted}/soat**:`;
        break;
      case "tennis":
        responseText = `Tennis uchun **${bestVenue.name}** (${bestVenue.address}) kortlarini tavsiya etamiz ${intent.isCheap ? "(arzon narxda)" : ""}. Professional qoplama va sifatli sharoitlar. Narxi: **${bestVenue.priceFormatted}/soat**:`;
        break;
      case "cinema":
        responseText = `Kino tomosha qilish uchun **${bestVenue.name}** (${bestVenue.address}) VIP zalini tavsiya qilaman. Katta ekran, akustik ovoz va qulay divanlar. Narxi: **${bestVenue.priceFormatted}/soat**:`;
        break;
      case "meetings":
        responseText = `Muzokaralar va rasmiy yig'ilishlar uchun **${bestVenue.name}** (${bestVenue.address}) zalini tavsiya qilaman. Yuqori tezlikdagi internet, 4K monitor va ovoz tizimi. Narxi: **${bestVenue.priceFormatted}/soat**:`;
        break;
      case "coworking":
      default:
        responseText = `Toshkentda ishlash va o'qish uchun eng qulay joylar: **${bestVenue.name}** (${bestVenue.address}). 500 Mbit/s optik internet, qulay stullar va bepul qahva. Narxi: **${bestVenue.priceFormatted}/soat**:`;
        break;
    }
  }

  return {
    message: responseText,
    suggestedVenues,
    isFallback: true,
  };
}

/**
 * Universal AI Concierge processor.
 * Uses OpenAI Chat Completion with search_venues tool when available,
 * or falls back to our robust deterministic engine.
 */
export async function askConcierge(
  messages: ConciergeMessage[],
  categoriesOrOptions?:
    | readonly CategorySummary[]
    | { categories?: readonly CategorySummary[]; locale?: "uz" | "ru" | "en" },
  maybeLocale: "uz" | "ru" | "en" = "uz"
): Promise<ConciergeResponse> {
  let categories: readonly CategorySummary[] = CORE_CATEGORIES;
  let locale: "uz" | "ru" | "en" = maybeLocale;

  if (Array.isArray(categoriesOrOptions)) {
    categories = categoriesOrOptions;
  } else if (categoriesOrOptions && typeof categoriesOrOptions === "object") {
    if ("categories" in categoriesOrOptions && Array.isArray(categoriesOrOptions.categories)) {
      categories = categoriesOrOptions.categories;
    }
    if ("locale" in categoriesOrOptions && categoriesOrOptions.locale) {
      locale = categoriesOrOptions.locale;
    }
  }

  const client = getOpenAIClient();
  const lastUserMessage =
    [...messages].reverse().find((m) => m.role === "user")?.content || "";

  if (!client) {
    return generateFallbackResponse(lastUserMessage, categories, locale);
  }

  try {
    const model = getOpenAIModel();
    const systemPrompt = getSystemPrompt(locale);

    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content.slice(0, 1000),
        })),
      ],
      tools: CONCIERGE_TOOLS,
      tool_choice: "auto",
      max_tokens: 600,
      temperature: 0.2,
    });

    const choice = response.choices[0];
    const toolCalls = choice?.message?.tool_calls;

    if (toolCalls && toolCalls.length > 0) {
      const firstCall = toolCalls[0];
      if (firstCall.type === "function" && firstCall.function.name === "search_venues") {
        let args: {
          category?: string;
          city?: string;
          guestCount?: number;
          budgetPreference?: string;
        } = {};
        try {
          args = JSON.parse(firstCall.function.arguments || "{}");
        } catch {
          // ignore
        }

        const mappedCategory = (args.category as DetectedIntentCategory) || "football";
        const isCheap = args.budgetPreference === "cheap";
        const venues = queryRealVenues(
          mappedCategory,
          {
            guestCount: args.guestCount,
            isCheap,
            district: args.city,
          },
          locale
        );

        if (venues.length > 0) {
          const fallback = generateFallbackResponse(lastUserMessage, categories, locale);
          return {
            message: fallback.message,
            suggestedVenues: venues,
            isFallback: false,
          };
        }
      }
    }

    const reply =
      choice?.message?.content ||
      (locale === "ru"
        ? "Извините, произошла ошибка при получении ответа."
        : locale === "en"
        ? "Sorry, an error occurred while processing your request."
        : "Kechirasiz, javob olishda xatolik yuz berdi.");

    return {
      message: reply,
      isFallback: false,
    };
  } catch {
    return generateFallbackResponse(lastUserMessage, categories, locale);
  }
}
