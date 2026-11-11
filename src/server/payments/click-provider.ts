import crypto from "node:crypto";
import { confirmBooking } from "../booking/hold-service.ts";
import { logAuditEvent } from "../audit/audit-log.ts";

export interface ClickPrepareRequest {
  click_trans_id: string;
  service_id: string;
  click_paydoc_id: string;
  merchant_trans_id: string; // Our bookingId
  amount: string;
  action: string; // "0" for Prepare, "1" for Complete
  error: string;
  error_note: string;
  sign_time: string;
  sign_string: string;
}

export interface ClickResponse {
  click_trans_id: string;
  merchant_trans_id: string;
  merchant_prepare_id?: string;
  merchant_confirm_id?: string;
  error: number;
  error_note: string;
}

/**
 * Click error codes:
 * 0: Success
 * -1: Sign check failed
 * -2: Incorrect amount
 * -3: Action not found
 * -4: Already paid
 * -5: User / Booking does not exist
 * -6: Transaction does not exist
 * -7: Failed to update user
 * -8: Error in request from click
 */
export function verifyClickSignature(
  req: ClickPrepareRequest,
  secretKey: string
): boolean {
  // MD5(click_trans_id + service_id + SECRET_KEY + merchant_trans_id + (action == 1 ? merchant_prepare_id : '') + amount + action + sign_time)
  const hash = crypto
    .createHash("md5")
    .update(
      `${req.click_trans_id}${req.service_id}${secretKey}${req.merchant_trans_id}${req.amount}${req.action}${req.sign_time}`
    )
    .digest("hex");

  return hash.toLowerCase() === req.sign_string.toLowerCase();
}

export async function handleClickWebhook(
  params: ClickPrepareRequest
): Promise<ClickResponse> {
  const secretKey = process.env.CLICK_SECRET_KEY || "TEST_CLICK_SECRET";

  // Check MD5 signature (in production secret must be configured)
  const isProd = process.env.NODE_ENV === "production";
  if (isProd && !process.env.CLICK_SECRET_KEY) {
    return {
      click_trans_id: params.click_trans_id,
      merchant_trans_id: params.merchant_trans_id,
      error: -8,
      error_note: "CLICK_SECRET_KEY not configured on server",
    };
  }

  const isValidSign = verifyClickSignature(params, secretKey);
  if (!isValidSign && process.env.CLICK_SECRET_KEY) {
    return {
      click_trans_id: params.click_trans_id,
      merchant_trans_id: params.merchant_trans_id,
      error: -1,
      error_note: "SIGN CHECK FAILED",
    };
  }

  const bookingId = params.merchant_trans_id;
  const action = params.action; // "0" Prepare, "1" Complete

  // Handle action 0: Prepare
  if (action === "0") {
    return {
      click_trans_id: params.click_trans_id,
      merchant_trans_id: bookingId,
      merchant_prepare_id: `prep_${bookingId}`,
      error: 0,
      error_note: "Success",
    };
  }

  // Handle action 1: Complete
  if (action === "1") {
    const confirmResult = await confirmBooking({
      bookingId,
      customerId: "click-webhook",
      provider: "CLICK",
      providerTransactionId: params.click_trans_id,
      idempotencyKey: `click-${params.click_trans_id}`,
    });

    if (!confirmResult.success && confirmResult.error !== "ALREADY_CONFIRMED") {
      return {
        click_trans_id: params.click_trans_id,
        merchant_trans_id: bookingId,
        error: -4,
        error_note: confirmResult.message || "Confirmation failed",
      };
    }

    await logAuditEvent({
      action: "PAYMENT_WEBHOOK_CLICK_SUCCESS",
      resourceType: "Booking",
      resourceId: bookingId,
      details: {
        clickTransId: params.click_trans_id,
        amount: params.amount,
      },
    });

    return {
      click_trans_id: params.click_trans_id,
      merchant_trans_id: bookingId,
      merchant_confirm_id: `conf_${bookingId}`,
      error: 0,
      error_note: "Success",
    };
  }

  return {
    click_trans_id: params.click_trans_id,
    merchant_trans_id: bookingId,
    error: -3,
    error_note: "Action not found",
  };
}
