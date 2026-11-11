import { NextRequest, NextResponse } from "next/server";
import { handlePaymeRpc, type PaymeRpcRequest } from "@/server/payments/payme-provider";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const body = (await request.json()) as PaymeRpcRequest;

    const response = await handlePaymeRpc(body, authHeader);
    return NextResponse.json(response);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Error";
    return NextResponse.json(
      {
        id: 0,
        error: {
          code: -32400,
          message: {
            uz: "Tizim xatoligi",
            ru: "Системная ошибка",
            en: errMsg,
          },
        },
      },
      { status: 500 }
    );
  }
}
