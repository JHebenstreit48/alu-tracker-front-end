const bucket = import.meta.env.VITE_FB_STORAGE_BUCKET;

// Matches your backend-style path scheme (for consistency)
const sanitize = (s: string): string =>
  s
    .replace(/[\s']/g, "")
    .replace(/&/g, "and")
    .replace(/[^A-Za-z0-9_-]/g, "");

export const buildCarImagePath = (brand: string, file: string): string => {
  const letter = brand?.[0]?.toUpperCase() ?? "_";
  const folder = sanitize(brand);
  return `/images/cars/${letter}/${folder}/${file}`;
};

/**
 * Turn a stored image path or URL into a usable browser URL.
 * - If already absolute (https://...), return as-is.
 * - If relative (/images/...), map to Firebase Storage public URL.
 */
export const getCarImageUrl = (rel?: string): string => {
  if (!rel) return "";

  if (/^https?:\/\//i.test(rel)) {
    return rel;
  }

  const clean = rel.startsWith("/") ? rel.slice(1) : rel;

  if (!bucket) {
    if (import.meta.env.DEV) {
      console.warn(
        "[getCarImageUrl] VITE_FB_STORAGE_BUCKET is not set; returning relative path."
      );
    }
    return `/${clean}`;
  }

  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
    clean
  )}?alt=media`;
};