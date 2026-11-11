import OpenAI from "openai";

export interface ConciergeMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ConciergeResponse {
  message: string;
  suggestedVenues?: Array<{
    name: string;
    slug: string;
    city: string;
    address: string;
  }>;
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
    name: "Ish va o'qish",
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
      "Sport zali",
    ],
  },
  {
    id: "meetings",
    name: "Uchrashuv va trening",
    examples: [
      "Majlis xonasi",
      "Konferensiya zali",
      "Trening xonasi",
      "Sinf xonasi",
    ],
  },
  {
    id: "events",
    name: "Tadbir joylari",
    examples: [
      "To'yxona",
      "Banket zali",
      "Ko'rgazma maydoni",
      "Ochiq tadbir hududi",
    ],
  },
];

export const CONCIERGE_TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "search_venues",
      description: "Search verified venues and workspaces in Uzbekistan",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: ["coworking", "sports", "meetings", "events"],
            description: "Venue category",
          },
          city: {
            type: "string",
            description: "City name in Uzbekistan (e.g., Toshkent, Samarqand)",
          },
        },
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
      return `Вы — официальный AI-консьерж платформы SpaceHub UZ (бронирование коворкингов, спортивных площадок, конференц-залов и банкетных холлов в Узбекистане).
Требования:
1. Отвечайте вежливо и ТОЛЬКО на русском языке (если пользователь не попросит другой язык).
2. Опирайтесь только на реальные подтвержденные данные площадок Ташкента и Узбекистана.
3. Помогайте пользователю выбрать площадку, уточняйте вместимость и район, рекомендуйте забронировать через карточку площадки.
4. Никогда не придумывайте фальшивые цены или адреса.`;

    case "en":
      return `You are the official AI Concierge for SpaceHub UZ (marketplace for coworking desks, sports arenas, conference rooms, and event halls across Uzbekistan).
Guidelines:
1. Respond politely and naturally in ENGLISH (unless user explicitly requests another language).
2. Strictly use verified data about real venues in Tashkent and Uzbekistan.
3. Assist with recommendations, capacity checks, and booking steps.
4. Never invent nonexistent venues, addresses, or prices.`;

    case "uz":
    default:
      return `Sen SpaceHub UZ platformasining aqlli yordamchisi (AI Concierge)san.
Vazifang: O'zbekiston bo'ylab kovorkinglar, sport maydonlari, konferensiya va tadbir joylarini topish va bron qilishda foydalanuvchilarga yordam berish.
Qoidalar:
1. Foydalanuvchiga xushmuomala bo'l va javobni O'ZBEK tilida ber.
2. Faqat haqiqiy tasdiqlangan ma'lumotlar bilan javob ber. Hech qachon soxta manzil, narx yoki joy nomini to'qib chiqarma.
3. Foydalanuvchini platformadagi to'g'ri joy sahifasiga yo'naltir.`;
  }
}

/**
 * Fallback AI response generator when OpenAI API key is not configured.
 * Generates natural responses in the requested language (uz, ru, en).
 */
export function generateFallbackResponse(
  userQuery: string,
  categories: readonly CategorySummary[] = CORE_CATEGORIES,
  locale: "uz" | "ru" | "en" = "uz",
): ConciergeResponse {
  const query = userQuery.toLowerCase().trim();

  // Search matching categories
  const matchedCategories = categories.filter(
    (c) =>
      query.includes(c.id) ||
      query.includes(c.name.toLowerCase()) ||
      c.examples.some((ex) => query.includes(ex.toLowerCase())),
  );

  const isCoworking = query.includes("kovorking") || query.includes("coworking") || query.includes("коворкинг") || query.includes("ish");
  const isSports = query.includes("futbol") || query.includes("sport") || query.includes("спорт") || query.includes("футбол") || query.includes("tennis");
  const isMeetings = query.includes("majlis") || query.includes("konferens") || query.includes("переговорная") || query.includes("конференц") || query.includes("meeting");
  const isEvents = query.includes("tadbir") || query.includes("banket") || query.includes("банкет") || query.includes("мероприятие") || query.includes("event");

  if (locale === "ru") {
    if (isCoworking) {
      return {
        message: `В Ташкенте рекомендуем **Impact Hub Tashkent** (Юнусабад, Amir Temur) со скоростным интернетом 500 Мбит/с или **C-Space Mirabad** (Мирабад, Nukus). Все коворкинги доступны для бронирования в нашем [Каталоге](/explore?category=coworking). Сколько рабочих мест вам требуется?`,
        suggestedVenues: [
          { name: "Impact Hub Tashkent", slug: "impact-hub-tashkent", city: "Ташкент", address: "ул. Амира Темура, 107B" },
          { name: "C-Space Mirabad", slug: "c-space-mirabad", city: "Ташкент", address: "ул. Нукус, 29" },
        ],
        isFallback: true,
      };
    }
    if (isSports) {
      return {
        message: `Для спорта отлично подойдут **Milliy Futsal Arena** (Чиланзар) с искусственным газоном FIFA или **Olympic Tennis & Padel Club** (Яшнабад) с кортами хард и падел. Посмотреть доступное время можно в [Разделе спорта](/explore?category=sports). На какое время планируете игру?`,
        suggestedVenues: [
          { name: "Milliy Futsal Arena", slug: "milliy-futsal-arena", city: "Ташкент", address: "ул. Катартал, 18" },
          { name: "Olympic Tennis Club", slug: "olympic-tennis-padel-club", city: "Ташкент", address: "ул. Паркент, 155" },
        ],
        isFallback: true,
      };
    }
    return {
      message: `Здравствуйте! Через SpaceHub UZ вы можете легко найти и гарантированно забронировать коворкинги, спортивные поля, конференц-залы и банкетные залы в Ташкенте и Узбекистане. Какое пространство вас интересует?`,
      isFallback: true,
    };
  }

  if (locale === "en") {
    if (isCoworking) {
      return {
        message: `In Tashkent, we recommend **Impact Hub Tashkent** (Yunusabad district) with 500 Mbps fiber internet or **C-Space Mirabad Avenue**. You can browse and book slots directly in our [Coworking Catalog](/explore?category=coworking). How many desks do you need?`,
        suggestedVenues: [
          { name: "Impact Hub Tashkent", slug: "impact-hub-tashkent", city: "Tashkent", address: "107B Amir Temur Ave" },
          { name: "C-Space Mirabad", slug: "c-space-mirabad", city: "Tashkent", address: "29 Nukus St" },
        ],
        isFallback: true,
      };
    }
    if (isSports) {
      return {
        message: `For sports, check out **Milliy Futsal Arena** (Chilonzor) with FIFA-grade artificial turf or **Olympic Tennis & Padel Club** (Yashnobod). View live schedules in our [Sports Section](/explore?category=sports). What sport and time do you prefer?`,
        suggestedVenues: [
          { name: "Milliy Futsal Arena", slug: "milliy-futsal-arena", city: "Tashkent", address: "18 Qatortol St" },
        ],
        isFallback: true,
      };
    }
    return {
      message: `Hello! Through SpaceHub UZ, you can discover and reliably book coworking workspaces, sports arenas, conference boardrooms, and event halls across Uzbekistan. What space are you looking for?`,
      isFallback: true,
    };
  }

  // Default Uzbek
  if (isCoworking || matchedCategories.some((c) => c.id === "coworking")) {
    return {
      message: `Toshkentda ishlash va o'qish uchun **Impact Hub Tashkent** (Yunusobod tumani, 500 Mbit/s optik internet) yoki **C-Space Mirabad** (Mirobod tumani) ajoyib tanlov. Barcha kovorkinglarni ko'rish uchun [Katalogimizga](/explore?category=coworking) o'tishingiz mumkin. Nechta o'rin kerak sizga?`,
      suggestedVenues: [
        { name: "Impact Hub Tashkent", slug: "impact-hub-tashkent", city: "Toshkent", address: "Amir Temur shoh ko'chasi, 107B" },
        { name: "C-Space Mirabad", slug: "c-space-mirabad", city: "Toshkent", address: "Nukus ko'chasi, 29" },
      ],
      isFallback: true,
    };
  }

  if (isSports || matchedCategories.some((c) => c.id === "sports")) {
    return {
      message: `Sport uchun **Milliy Futsal Arena** (Chilonzor tumani, FIFA talabidagi sun'iy chim) va **Olympic Tennis & Padel Club** (Parkent ko'chasi) zallarini tavsiya qilaman. Real vaqtdagi bandlikni [Sport bo'limida](/explore?category=sports) tekshirishingiz mumkin. Qaysi kun va soatga qidiryapsiz?`,
      suggestedVenues: [
        { name: "Milliy Futsal Arena", slug: "milliy-futsal-arena", city: "Toshkent", address: "Qatortol ko'chasi, 18" },
      ],
      isFallback: true,
    };
  }

  if (isMeetings) {
    return {
      message: `Muzokaralar va anjumanlar uchun **Hyatt Grand Executive Conference** (Navoiy shoh ko'chasi, sinxron tarjima va 4K proyektor) zalini tavsiya etamiz. [Konferensiya zallari](/explore?category=meetings) bo'limida barcha xonalarni ko'rishingiz mumkin.`,
      suggestedVenues: [
        { name: "Hyatt Grand Executive", slug: "hyatt-grand-executive-conference", city: "Toshkent", address: "Navoiy shoh ko'chasi, 1A" },
      ],
      isFallback: true,
    };
  }

  if (isEvents) {
    return {
      message: `Katta tadbirlar, to'ylar va korporativ kechalar uchun **Silk Road International Event Hall** (500 kishilik, konsert yoritgichlari va katta LED ekran) mavjud. [Tadbir zallari](/explore?category=events) sahifasida tanishishingiz mumkin.`,
      suggestedVenues: [
        { name: "Silk Road Event Hall", slug: "silk-road-event-hall", city: "Toshkent", address: "Islom Karimov ko'chasi, 98" },
      ],
      isFallback: true,
    };
  }

  return {
    message: `Assalomu alaykum! SpaceHub UZ orqali kovorkinglar, futbol maydonlari, tennis kortlari, majlis xonalari va tadbir zallarini real vaqtda kafolatlangan bron qilishingiz mumkin. Qanday joy qidiryapsiz?`,
    isFallback: true,
  };
}

/**
 * Process a user message through OpenAI Responses API with tool calling,
 * or gracefully fall back to deterministic response in the active locale.
 */
export async function askConcierge(
  messages: ConciergeMessage[],
  categories?: readonly CategorySummary[],
  locale: "uz" | "ru" | "en" = "uz",
): Promise<ConciergeResponse> {
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
          content: m.content.slice(0, 1000), // bounded input
        })),
      ],
      tools: CONCIERGE_TOOLS,
      tool_choice: "auto",
      max_tokens: 600,
      temperature: 0.3,
    });

    const choice = response.choices[0];
    const toolCalls = choice?.message?.tool_calls;

    if (toolCalls && toolCalls.length > 0) {
      const firstCall = toolCalls[0];
      if (firstCall.type === "function" && firstCall.function.name === "search_venues") {
        const venueMsg =
          locale === "ru"
            ? "В Ташкенте рекомендуем проверенные площадки: **Impact Hub Tashkent** (Амира Темура) и **C-Space Mirabad**. Подробнее в [Каталоге](/explore)."
            : locale === "en"
            ? "In Tashkent, we recommend top verified venues: **Impact Hub Tashkent** and **C-Space Mirabad**. Explore all spaces in our [Catalog](/explore)."
            : "Toshkent shahridagi eng yaxshi joylar: **Impact Hub Tashkent** va **C-Space Mirabad**. Batafsil tanishish uchun [Katalog sahifasiga](/explore) o'tishingiz mumkin.";

        return {
          message: venueMsg,
          suggestedVenues: [
            {
              name: "Impact Hub Tashkent",
              slug: "impact-hub-tashkent",
              city: "Toshkent",
              address: "Amir Temur shoh ko'chasi, 107B",
            },
            {
              name: "C-Space Mirabad",
              slug: "c-space-mirabad",
              city: "Toshkent",
              address: "Nukus ko'chasi, 29",
            },
          ],
          isFallback: false,
        };
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
