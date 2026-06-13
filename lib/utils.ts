import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn() — merge Tailwind classes safely.
 *
 * Why tailwind-merge matters: without it, `cn('bg-red-500', 'bg-blue-500')`
 * produces both classes in the DOM and the winner is determined by CSS source
 * order (unpredictable). tailwind-merge detects conflicting utilities and keeps
 * only the last one, making variant-based components reliable.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a USD price, or return null for "Price on Request" items. */
export function formatPrice(
  price: number | null,
  currency: string = "USD"
): string | null {
  if (price === null) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

/** Convert a product name + stock number to a URL-safe slug. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/** Format operating hours with locale-aware thousands separator. */
export function formatHours(hours: number | null): string {
  if (hours === null) return "N/A";
  return `${new Intl.NumberFormat("en-US").format(hours)} hrs`;
}

/** Truncate text to a max character count, adding ellipsis. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/** Build a WhatsApp message URL pre-filled with product info. */
export function buildWhatsAppUrl(message: string): string {
  const phone = "260979046745"; // +260 979 046 745 without symbols
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
