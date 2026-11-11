import { formatPrice } from "../../lib/format-price.ts";

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
  const chatId =
    process.env.TELEGRAM_CHAT_ID ||
    process.env.TELEGRAM_ADMIN_CHAT_ID ||
    process.env.TELEGRAM_OWNER_CHAT_ID ||
    process.env.TELEGRAM_CHANNEL_ID;

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
        console.warn(`[TELEGRAM DISPATCH WARNING ${res.status}]: ${errData}`);
        if (errData.includes("chat not found")) {
          console.warn(
            `\n⚠️ DIQQAT: Telegram bot (@SpaceHubUZ_bot) ${chatId} ID raqamiga xabar yubora olmadi.\n` +
            `👉 Sababi: Telegram qoidasiga binoan, bot sizga xabar yuborishi uchun siz avval Telegramda @SpaceHubUZ_bot ga kirib "START" (/start) tugmasini bosishingiz kerak!\n`
          );
        }
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
      console.warn(`[TELEGRAM NETWORK ERROR]: ${errMsg}`);
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
<b>Umumiy summa:</b> <b>${formatPrice(payload.totalPrice)} UZS</b>
`.trim();

  return sendTelegramAlert(html, { parseMode: "HTML" });
}

export interface ReviewTelegramPayload {
  reviewId: string;
  venueName: string;
  customerName: string;
  rating: number;
  comment: string;
  submittedAt?: string;
  status?: string;
  adminReviewUrl?: string;
}

const sentReviewNotifications = new Set<string>();

export async function notifyReviewTelegram(
  payload: ReviewTelegramPayload
): Promise<TelegramAlertResult> {
  // Deduplication check: prevent duplicate notifications
  if (sentReviewNotifications.has(payload.reviewId)) {
    console.log(`[TELEGRAM REVIEW NOTIFICATION] Duplicate suppressed for reviewId: ${payload.reviewId}`);
    return {
      success: true,
      simulated: true,
      error: "DUPLICATE_NOTIFICATION_SUPPRESSED",
    };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const adminUrl = payload.adminReviewUrl || `${appUrl}/admin/moderation`;
  const submittedTime =
    payload.submittedAt ||
    new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
  const stars = "⭐".repeat(Math.max(1, Math.min(5, Math.round(payload.rating))));

  const html = `
<b>⭐ NEW CUSTOMER REVIEW / YANGI MIJOZ SHARHI</b>
━━━━━━━━━━━━━━━━━━
🏢 <b>Venue:</b> ${payload.venueName}
👤 <b>Customer:</b> ${payload.customerName}
⭐ <b>Rating:</b> ${payload.rating}/5 ${stars}

💬 <b>Review:</b>
<i>"${payload.comment.replace(/[<>]/g, "")}"</i>

🕒 <b>Submitted:</b> ${submittedTime}
📌 <b>Status:</b> <code>${payload.status || "Pending moderation"}</code>
━━━━━━━━━━━━━━━━━━
🔗 <a href="${adminUrl}">Admin tekshiruv paneliga o'tish (Review moderation)</a>
`.trim();

  // Primary delivery attempt
  let result = await sendTelegramAlert(html, { parseMode: "HTML" });

  // Retry once if temporarily failed on network error
  if (!result.success && !result.simulated) {
    try {
      await new Promise((r) => setTimeout(r, 600));
      result = await sendTelegramAlert(html, { parseMode: "HTML" });
    } catch {
      // ignore
    }
  }

  if (result.success) {
    sentReviewNotifications.add(payload.reviewId);
  }

  return result;
}
