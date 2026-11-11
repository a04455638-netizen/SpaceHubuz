import { confirmBooking } from "../booking/hold-service.ts";
import { logAuditEvent } from "../audit/audit-log.ts";

export interface PaymeRpcRequest {
  method: string;
  params: {
    id?: string;
    account?: { booking_id?: string; bookingId?: string };
    amount?: number; // In tiyin (1 UZS = 100 tiyin)
    time?: number;
    reason?: number;
  };
  id: number;
}

export interface PaymeRpcResponse {
  result?: Record<string, unknown>;
  error?: {
    code: number;
    message: { uz: string; ru: string; en: string };
    data?: string;
  };
  id: number;
}

export function verifyPaymeAuth(authHeader: string | null): boolean {
  const secret = process.env.PAYME_SECRET_KEY || "TEST_PAYME_SECRET";
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return false;
  }

  const credentials = Buffer.from(authHeader.slice(6), "base64").toString("utf-8");
  const [, password] = credentials.split(":");

  return password === secret;
}

export async function handlePaymeRpc(
  req: PaymeRpcRequest,
  authHeader: string | null
): Promise<PaymeRpcResponse> {
  // 1. Verify Basic Auth
  const isProd = process.env.NODE_ENV === "production";
  if (isProd && !process.env.PAYME_SECRET_KEY) {
    return {
      id: req.id,
      error: {
        code: -32504,
        message: {
          uz: "Tizim sozlanmagan",
          ru: "Система не настроена",
          en: "System unconfigured",
        },
      },
    };
  }

  if (process.env.PAYME_SECRET_KEY && !verifyPaymeAuth(authHeader)) {
    return {
      id: req.id,
      error: {
        code: -32504,
        message: {
          uz: "Avtorizatsiya xatosi",
          ru: "Ошибка авторизации",
          en: "Authorization error",
        },
      },
    };
  }

  const bookingId = req.params?.account?.booking_id || req.params?.account?.bookingId;

  // 2. Route by RPC Method
  switch (req.method) {
    case "CheckPerformTransaction": {
      if (!bookingId) {
        return {
          id: req.id,
          error: {
            code: -31050,
            message: {
              uz: "Buyurtma topilmadi",
              ru: "Заказ не найден",
              en: "Booking not found",
            },
          },
        };
      }
      return {
        id: req.id,
        result: {
          allow: true,
        },
      };
    }

    case "CreateTransaction": {
      return {
        id: req.id,
        result: {
          create_time: Date.now(),
          transaction: req.params.id || `payme_${Date.now()}`,
          state: 1, // Created
        },
      };
    }

    case "PerformTransaction": {
      if (bookingId) {
        await confirmBooking({
          bookingId,
          customerId: "payme-webhook",
          provider: "PAYME",
          providerTransactionId: req.params.id,
          idempotencyKey: `payme-${req.params.id}`,
        });

        await logAuditEvent({
          action: "PAYMENT_WEBHOOK_PAYME_SUCCESS",
          resourceType: "Booking",
          resourceId: bookingId,
          details: { paymeTransId: req.params.id, amountTiyin: req.params.amount },
        });
      }

      return {
        id: req.id,
        result: {
          perform_time: Date.now(),
          transaction: req.params.id,
          state: 2, // Performed
        },
      };
    }

    case "CheckTransaction": {
      return {
        id: req.id,
        result: {
          create_time: Date.now() - 60000,
          perform_time: Date.now(),
          cancel_time: 0,
          transaction: req.params.id,
          state: 2,
          reason: null,
        },
      };
    }

    case "CancelTransaction": {
      return {
        id: req.id,
        result: {
          cancel_time: Date.now(),
          transaction: req.params.id,
          state: -2,
        },
      };
    }

    default:
      return {
        id: req.id,
        error: {
          code: -32601,
          message: {
            uz: "Metod topilmadi",
            ru: "Метод не найден",
            en: "Method not found",
          },
        },
      };
  }
}
