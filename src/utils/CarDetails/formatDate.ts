export type DateFormatPreference = 'locale' | 'mdy' | 'dmy';

/**
 * Tries to parse "D/M/YYYY" (your backend format), and returns a display string.
 * Default: user locale formatting (via toLocaleDateString()).
 */
export function formatAddedDate(
  raw?: string,
  preference: DateFormatPreference = 'locale',
  locale?: string
): string {
  if (!raw) return '—';

  // Expected: D/M/YYYY or DD/MM/YYYY
  const parts = raw.split('/');
  if (parts.length !== 3) return raw;

  const [dRaw, mRaw, yRaw] = parts;
  const d = Number(dRaw);
  const m = Number(mRaw);
  const y = Number(yRaw);

  if (!Number.isFinite(d) || !Number.isFinite(m) || !Number.isFinite(y)) return raw;

  // Build a Date in UTC so timezone doesn't affect the day
  const date = new Date(Date.UTC(y, m - 1, d));

  if (preference === 'mdy') return `${m}/${d}/${y}`;
  if (preference === 'dmy') return `${d}/${m}/${y}`;

  // Force UTC timezone when formatting so local offset doesn't roll the date back
  return date.toLocaleDateString(locale, { timeZone: 'UTC' });
}