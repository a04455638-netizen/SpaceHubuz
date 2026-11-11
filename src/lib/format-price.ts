/**
 * Deterministic price formatter that produces identical output on SSR and browser client,
 * completely preventing React hydration mismatches caused by locale differences.
 */
export function formatPrice(amount: number | string | undefined | null): string {
  if (amount == null || amount === "") return "0";
  const num = Math.round(Number(amount));
  if (isNaN(num)) return "0";
  // Formats 35000 as "35 000" consistently across all platforms
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
