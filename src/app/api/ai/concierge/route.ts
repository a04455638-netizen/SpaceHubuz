import {
  askConcierge,
  type ConciergeMessage,
} from "../../../../server/ai/concierge";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      messages?: ConciergeMessage[];
      locale?: "uz" | "ru" | "en";
    };
    const messages = body.messages;
    const locale = body.locale || "uz";

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "INVALID_MESSAGES_FORMAT" },
        { status: 400 },
      );
    }

    const response = await askConcierge(messages, undefined, locale);
    return Response.json(response);
  } catch {
    return Response.json({ error: "INTERNAL_AI_ERROR" }, { status: 500 });
  }
}
