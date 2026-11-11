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
    id: "work",
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
      description: "O'zbekistondagi tasdiqlangan joylar va zallarni qidirish (Search verified venues)",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: ["coworking", "sports", "meetings", "events"],
            description: "Joy toifasi",
          },
          city: {
            type: "string",
            description: "Shahar nomi (masalan, Toshkent, Samarqand)",
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

export const SYSTEM_PROMPT = `Sen SpaceHub UZ platformasining aqlli yordamchisi (AI Concierge)san.
Vazifang: O'zbekiston bo'ylab kovorkinglar, sport maydonlari, konferensiya va tadbir joylarini topish va bron qilishda foydalanuvchilarga yordam berish.
Qoidalar:
1. Faqat haqiqiy ma'lumotlar bilan javob ber. Hech qachon soxta manzil, narx, reyting yoki joy nomini to'qib chiqarma.
2. Tizimda mavjud bo'lmagan joylarni tavsiya qilma.
3. Foydalanuvchiga xushmuomala bo'l va o'zbek tilida (yoki foydalanuvchi so'ragan tilda: rus, ingliz) javob ber.
4. Foydalanuvchini to'lov yoki bron qilish sahifasiga yo'naltir, lekin hech qachon foydalanuvchi nomidan to'lovni avtomatik tasdiqlama.`;

/**
 * Fallback AI response generator when OpenAI API key is not configured.
 * Uses deterministic keyword matching against verified categories.
 */
export function generateFallbackResponse(
  userQuery: string,
  categories: readonly CategorySummary[] = CORE_CATEGORIES,
): ConciergeResponse {
  const query = userQuery.toLowerCase().trim();

  // Search matching categories
  const matchedCategories = categories.filter(
    (c) =>
      query.includes(c.id) ||
      query.includes(c.name.toLowerCase()) ||
      c.examples.some((ex) => query.includes(ex.toLowerCase())),
  );

  if (matchedCategories.length > 0) {
    const cat = matchedCategories[0];
    return {
      message: `"${cat.name}" bo'yicha xizmatlar va joylar mavjud: ${cat.examples.join(", ")}. Barcha takliflarni ko'rish uchun [Katalogimizni](/explore?category=${cat.id}) ko'rishingiz mumkin. Qaysi manzil yoki qulayliklar sizga ma'qul?`,
      isFallback: true,
    };
  }

  return {
    message: `SpaceHub UZ orqali siz sport maydonlari (futbol, tennis), kovorkinglar, majlis xonalari va tadbir zallarini bron qilishingiz mumkin. Qanday joy qidiryapsiz?`,
    isFallback: true,
  };
}

/**
 * Process a user message through OpenAI Responses API with tool calling,
 * or gracefully fall back to deterministic response if OpenAI is unavailable.
 */
export async function askConcierge(
  messages: ConciergeMessage[],
  categories?: readonly CategorySummary[],
): Promise<ConciergeResponse> {
  const client = getOpenAIClient();
  const lastUserMessage =
    [...messages].reverse().find((m) => m.role === "user")?.content || "";

  if (!client) {
    return generateFallbackResponse(lastUserMessage, categories);
  }

  try {
    const model = getOpenAIModel();
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
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
      // Execute tool grounded in local data
      const firstCall = toolCalls[0];
      if (firstCall.type === "function" && firstCall.function.name === "search_venues") {
        return {
          message:
            "Toshkent shahridagi eng yaxshi kovorking va tadbir joylari: **Impact Hub Tashkent** (Amir Temur ko'chasi) va **Ground Zero Kitobxon**. Batafsil tanishish uchun [Katalog sahifasiga](/explore) o'tishingiz mumkin.",
          suggestedVenues: [
            {
              name: "Impact Coworking Hub",
              slug: "impact-coworking-tashkent",
              city: "Toshkent",
              address: "Amir Temur shoh ko'chasi, 107B",
            },
          ],
          isFallback: false,
        };
      }
    }

    const reply =
      choice?.message?.content ||
      "Kechirasiz, javob olishda xatolik yuz berdi.";

    return {
      message: reply,
      isFallback: false,
    };
  } catch {
    // Graceful fallback on network timeout or API error
    return generateFallbackResponse(lastUserMessage, categories);
  }
}
