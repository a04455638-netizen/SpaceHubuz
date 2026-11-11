export interface TelegramAlertResult {
  success: boolean;
  simulated: boolean;
  messageId?: number;
  error?: string;
}

export async function sendTelegramAlert(
  text: string,
  options?: { parseMode?: "Markdown" | "HTML" }
): Promise<TelegramAlertResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (token && chatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: options?.parseMode || "Markdown",
        }),
      });

      if (!res.ok) {
        const errData = await res.text();
        return {
          success: false,
          simulated: false,
          error: `Telegram API error: ${res.status} - ${errData}`,
        };
      }

      const data = (await res.json()) as { ok: boolean; result?: { message_id: number } };
      return {
        success: data.ok,
        simulated: false,
        messageId: data.result?.message_id,
      };
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : "Network error";
      return { success: false, simulated: false, error: errMsg };
    }
  }

  // Safe non-production simulator
  console.log(`[TELEGRAM OPERATIONAL ALERT (SIMULATOR)]\n${text}`);
  return {
    success: true,
    simulated: true,
  };
}
