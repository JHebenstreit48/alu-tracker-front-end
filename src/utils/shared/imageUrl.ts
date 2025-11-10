const bucket = import.meta.env.VITE_FB_STORAGE_BUCKET as
  | string
  | undefined;

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

export const getCarImageUrl = (rel?: string): string => {
  if (!rel) return "";

  // Already absolute? Just return.
  if (/^https?:\/\//i.test(rel)) {
    return rel;
  }

  // Normalize leading slash
  const clean = rel.startsWith("/") ? rel.slice(1) : rel;

  // No bucket configured: use relative path (public/).
  if (!bucket) {
    if (import.meta.env.DEV) {
      console.warn(
        "[getCarImageUrl] VITE_FB_STORAGE_BUCKET is not set; returning relative path:",
        `/${clean}`
      );
    }
    return `/${clean}`;
  }

  // Map to Firebase Storage public URL
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
    clean
  )}?alt=media`;
};

export const getImageUrl = getCarImageUrl;