import { NextRequest, NextResponse } from "next/server";
import { normalizeUzbekPhone } from "@/server/auth/phone-validation";
import { sendOtpSms } from "@/server/auth/sms-adapter";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = body.phone as string | undefined;

    if (!phone) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", message: "Telefon raqami kiritilishi shart" },
        { status: 400 }
      );
    }

    const normalized = normalizeUzbekPhone(phone);
    if (!normalized) {
      return NextResponse.json(
        {
          error: "INVALID_PHONE",
          message: "O'zbekiston raqamini to'g'ri kiriting (+998 XX XXX XX XX)",
        },
        { status: 400 }
      );
    }

    // Generate 6 digit numeric code
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const result = await sendOtpSms(normalized, randomCode);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "SMS_FAILED", message: result.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      phone: normalized,
      simulated: result.simulated,
      message: result.message,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json(
      { error: "SERVER_ERROR", message: errMessage },
      { status: 500 }
    );
  }
}
