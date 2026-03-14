/**
 * Turns a category/product name into a URL slug.
 * e.g. "Maintenance Service Parts" -> "maintenance-service-parts"
 */
export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Converts a slug back to title case for display.
 * e.g. "maintenance-service-parts" -> "Maintenance Service Parts"
 */
export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
