import {
  askConcierge,
  type ConciergeMessage,
} from "../../../../server/ai/concierge";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: ConciergeMessage[] };
    const messages = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "INVALID_MESSAGES_FORMAT" },
        { status: 400 },
      );
    }

    const response = await askConcierge(messages);
    return Response.json(response);
  } catch {
    return Response.json({ error: "INTERNAL_AI_ERROR" }, { status: 500 });
  }
}
