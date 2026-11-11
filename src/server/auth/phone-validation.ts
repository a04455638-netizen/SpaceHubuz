/**
 * Validates and normalizes Uzbekistan phone numbers.
 * Format: +998 followed by 9 digits (2 operator digits + 7 subscriber digits).
 * Valid operator codes: 90, 91 (Beeline), 93, 94 (Ucell), 97, 88 (Mobiuz), 99, 77, 95 (Uztelecom), 33 (Humans), etc.
 */
export function normalizeUzbekPhone(phone: string): string | null {
  if (!phone) return null;

  // Remove whitespace, dashes, parentheses
  let cleaned = phone.replace(/[\s\-()]/g, "");

  // If starts with 8 (legacy domestic), replace with +998
  if (cleaned.startsWith("8") && cleaned.length === 10) {
    cleaned = "+998" + cleaned.slice(1);
  }

  // If doesn't have leading +, add it if starts with 998
  if (cleaned.startsWith("998") && cleaned.length === 12) {
    cleaned = "+" + cleaned;
  }

  // Validate format: +998 followed by 9 digits
  const uzPhoneRegex = /^\+998(33|77|88|90|91|93|94|95|97|98|99)\d{7}$/;
  if (!uzPhoneRegex.test(cleaned)) {
    return null;
  }

  return cleaned;
}

export function formatUzbekPhoneDisplay(phone: string): string {
  const normalized = normalizeUzbekPhone(phone);
  if (!normalized) return phone;
  // +998 90 123 45 67
  return `${normalized.slice(0, 4)} (${normalized.slice(4, 6)}) ${normalized.slice(6, 9)}-${normalized.slice(9, 11)}-${normalized.slice(11, 13)}`;
}
