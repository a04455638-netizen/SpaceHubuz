export const BookingStatus = {
  DRAFT: "DRAFT",
  HELD: "HELD",
  AWAITING_PAYMENT: "AWAITING_PAYMENT",
  REQUESTED: "REQUESTED",
  CONFIRMED: "CONFIRMED",
  CHECKED_IN: "CHECKED_IN",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
  NO_SHOW: "NO_SHOW",
  REFUND_PENDING: "REFUNDED_PENDING",
  REFUNDED: "REFUNDED",
} as const;

export type BookingStatusType =
  (typeof BookingStatus)[keyof typeof BookingStatus];

/**
 * States that actively reserve time intervals in the calendar / database constraint.
 */
export const INVENTORY_OCCUPYING_STATUSES: readonly BookingStatusType[] = [
  BookingStatus.HELD,
  BookingStatus.AWAITING_PAYMENT,
  BookingStatus.REQUESTED,
  BookingStatus.CONFIRMED,
  BookingStatus.CHECKED_IN,
];

export function occupiesInventory(status: BookingStatusType): boolean {
  return INVENTORY_OCCUPYING_STATUSES.includes(status);
}

/**
 * Valid state transitions for the booking lifecycle.
 */
export const ALLOWED_TRANSITIONS: Record<
  BookingStatusType,
  readonly BookingStatusType[]
> = {
  [BookingStatus.DRAFT]: [
    BookingStatus.HELD,
    BookingStatus.REQUESTED,
    BookingStatus.CANCELLED,
  ],
  [BookingStatus.HELD]: [
    BookingStatus.AWAITING_PAYMENT,
    BookingStatus.CONFIRMED,
    BookingStatus.EXPIRED,
    BookingStatus.CANCELLED,
  ],
  [BookingStatus.AWAITING_PAYMENT]: [
    BookingStatus.CONFIRMED,
    BookingStatus.EXPIRED,
    BookingStatus.CANCELLED,
  ],
  [BookingStatus.REQUESTED]: [
    BookingStatus.CONFIRMED,
    BookingStatus.EXPIRED,
    BookingStatus.CANCELLED,
  ],
  [BookingStatus.CONFIRMED]: [
    BookingStatus.CHECKED_IN,
    BookingStatus.COMPLETED,
    BookingStatus.CANCELLED,
    BookingStatus.NO_SHOW,
    BookingStatus.REFUND_PENDING,
  ],
  [BookingStatus.CHECKED_IN]: [
    BookingStatus.COMPLETED,
    BookingStatus.REFUND_PENDING,
  ],
  [BookingStatus.COMPLETED]: [BookingStatus.REFUND_PENDING],
  [BookingStatus.CANCELLED]: [
    BookingStatus.REFUND_PENDING,
    BookingStatus.REFUNDED,
  ],
  [BookingStatus.EXPIRED]: [],
  [BookingStatus.NO_SHOW]: [BookingStatus.REFUND_PENDING],
  [BookingStatus.REFUND_PENDING]: [
    BookingStatus.REFUNDED,
    BookingStatus.CANCELLED,
  ],
  [BookingStatus.REFUNDED]: [],
};

export function canTransition(
  from: BookingStatusType,
  to: BookingStatusType,
): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}
