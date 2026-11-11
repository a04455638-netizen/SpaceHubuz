interface OtpEntry {
  code: string;
  expiresAt: number;
}

// In-memory OTP store for development/testing
const otpStore = new Map<string, OtpEntry>();

export interface SendOtpResult {
  success: boolean;
  simulated: boolean;
  message: string;
  error?: string;
}

export async function sendOtpSms(phone: string, code: string): Promise<SendOtpResult> {
  const isProduction = process.env.NODE_ENV === "production";
  const eskizEmail = process.env.ESKIZ_EMAIL;
  const eskizPassword = process.env.ESKIZ_PASSWORD;

  if (eskizEmail && eskizPassword) {
    try {
      // 1. Eskiz Auth Token
      const authRes = await fetch("https://notify.eskiz.uz/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: eskizEmail, password: eskizPassword }),
      });
      if (!authRes.ok) {
        throw new Error(`Eskiz authentication failed: ${authRes.status}`);
      }
      const authData = (await authRes.json()) as { data?: { token?: string } };
      const token = authData.data?.token;

      // 2. Send SMS
      const cleanPhone = phone.replace("+", "");
      const messageText = `SpaceHub UZ tasdiqlash kodi: ${code}. Hech kimga bermang.`;
      const sendRes = await fetch("https://notify.eskiz.uz/api/message/sms/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mobile_phone: cleanPhone,
          message: messageText,
          from: "4546",
        }),
      });

      if (!sendRes.ok) {
        throw new Error(`Eskiz send failed: ${sendRes.status}`);
      }

      return {
        success: true,
        simulated: false,
        message: "SMS muvaffaqiyatli yuborildi",
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("SMS provider failed:", errorMessage);
      if (isProduction) {
        return {
          success: false,
          simulated: false,
          message: "SMS yuborishda xatolik yuz berdi",
          error: errorMessage,
        };
      }
    }
  }

  // Development/Test simulator
  if (isProduction) {
    return {
      success: false,
      simulated: false,
      message: "SMS provayder sozlanmagan (Production error: SMS provider unconfigured)",
      error: "MISSING_SMS_CREDENTIALS",
    };
  }

  // Store in memory for 5 minutes
  otpStore.set(phone, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  console.log(`[DEV SMS SIMULATOR] Sent OTP code "${code}" to ${phone}`);

  return {
    success: true,
    simulated: true,
    message: "Test rejimida tasdiqlash kodi qabul qilindi (Simulator active)",
  };
}

export function verifyOtpCode(phone: string, inputCode: string): boolean {
  const isProduction = process.env.NODE_ENV === "production";

  // In non-production, standard developer test code 123456 is accepted
  if (!isProduction && inputCode === "123456") {
    return true;
  }

  const entry = otpStore.get(phone);
  if (!entry) return false;

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(phone);
    return false;
  }

  if (entry.code === inputCode) {
    otpStore.delete(phone);
    return true;
  }

  return false;
}
