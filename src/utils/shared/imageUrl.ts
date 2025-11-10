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

  if (/^https?:\/\//i.test(rel)) {
    return rel;
  }

  const clean = rel.startsWith("/") ? rel.slice(1) : rel;

  if (!bucket) {
    if (import.meta.env.DEV) {
      console.warn(
        "[getCarImageUrl] VITE_FB_STORAGE_BUCKET is not set; returning relative path:",
        `/${clean}`
      );
    }
    return `/${clean}`;
  }

  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
    clean
  )}?alt=media`;
};

// Alias for generic use (icons, logos, etc.)
export const getImageUrl = getCarImageUrl;