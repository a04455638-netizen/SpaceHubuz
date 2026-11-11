import { NextRequest, NextResponse } from "next/server";
import { handleClickWebhook, type ClickPrepareRequest } from "@/server/payments/click-provider";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body: ClickPrepareRequest;

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      const entries: Record<string, string> = {};
      formData.forEach((value, key) => {
        entries[key] = value.toString();
      });
      body = entries as unknown as ClickPrepareRequest;
    } else {
      body = (await request.json()) as ClickPrepareRequest;
    }

    const response = await handleClickWebhook(body);
    return NextResponse.json(response);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Error";
    return NextResponse.json(
      {
        error: -8,
        error_note: errMsg,
      },
      { status: 500 }
    );
  }
}
