export interface TelegramAlertResult {
  success: boolean;
  simulated: boolean;
  messageId?: number;
  error?: string;
}

export interface BookingTelegramPayload {
  bookingId: string;
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  venueName: string;
  venueCategory: string;
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  paymentMethod?: string;
}

export async function sendTelegramAlert(
  text: string,
  options?: { parseMode?: "Markdown" | "HTML" }
): Promise<TelegramAlertResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (token && chatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: options?.parseMode || "HTML",
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

  // Safe non-production simulator logging
  console.log(`[TELEGRAM OPERATIONAL NOTIFICATION (SIMULATOR)]\n${text}`);
  return {
    success: true,
    simulated: true,
  };
}

export async function notifyBookingTelegram(payload: BookingTelegramPayload): Promise<TelegramAlertResult> {
  const html = `
<b>🔔 YANGI BUYURTMA / NEW BOOKING — SPACEHUB UZ</b>
━━━━━━━━━━━━━━━━━━
<b>Bron raqami:</b> <code>${payload.bookingNumber}</code>
<b>Holat (Status):</b> <code>${payload.status}</code>
${payload.paymentMethod ? `<b>To'lov usuli:</b> <code>${payload.paymentMethod}</code>\n` : ""}
<b>Mijoz:</b> ${payload.customerName}
<b>Telefon:</b> ${payload.customerPhone}
━━━━━━━━━━━━━━━━━━
<b>Joy / Bino:</b> ${payload.venueName} (${payload.venueCategory})
<b>Manzil:</b> ${payload.address}
<b>Sana:</b> ${payload.date}
<b>Vaqt:</b> ${payload.startTime} — ${payload.endTime}
━━━━━━━━━━━━━━━━━━
<b>Umumiy summa:</b> <b>${payload.totalPrice.toLocaleString()} UZS</b>
`.trim();

  return sendTelegramAlert(html, { parseMode: "HTML" });
}
