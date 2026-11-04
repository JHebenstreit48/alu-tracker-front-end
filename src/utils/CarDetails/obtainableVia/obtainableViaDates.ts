import type { ObtainableMethod } from '@/types/shared/car';

export type NormalizedMethod = {
  name: string;
  dateLabel?: string;
};

// Trailing "(...)" whose contents end in a 4-digit year, e.g. "(Sep 15 - Oct 14, 2026)".
// Non-date parentheses like "(Support Car)" don't match and stay in the name.
const TRAILING_DATE_RANGE = /^(.*?)\s*\(([^()]*\d{4})\)\s*$/;

const MONTH_DAY: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', timeZone: 'UTC' };
const MONTH_DAY_YEAR: Intl.DateTimeFormatOptions = { ...MONTH_DAY, year: 'numeric' };

/** "2026-09-15" -> Date (UTC), or null if not a valid ISO date */
function parseIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, year, month, day] = match;
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

function formatDate(date: Date, options: Intl.DateTimeFormatOptions): string {
  return date.toLocaleDateString('en-US', options);
}

/** "2026-09-15" + "2026-10-14" -> "Sep 15 – Oct 14, 2026" */
export function formatDateRange(start?: string, end?: string): string | undefined {
  const startDate = start ? parseIsoDate(start) : null;
  const endDate = end ? parseIsoDate(end) : null;

  if (startDate && endDate) {
    const sameYear = startDate.getUTCFullYear() === endDate.getUTCFullYear();
    const startText = formatDate(startDate, sameYear ? MONTH_DAY : MONTH_DAY_YEAR);
    return `${startText} – ${formatDate(endDate, MONTH_DAY_YEAR)}`;
  }
  if (startDate) return `From ${formatDate(startDate, MONTH_DAY_YEAR)}`;
  if (endDate) return `Until ${formatDate(endDate, MONTH_DAY_YEAR)}`;

  // Unparseable values: show them as-is rather than hiding them
  const raw = [start, end].filter(Boolean).join(' – ');
  return raw || undefined;
}

/** "Legend Pass (Sep 15 - Oct 14, 2026)" -> { name: "Legend Pass", dateLabel: "Sep 15 – Oct 14, 2026" } */
function parseMethodString(method: string): NormalizedMethod {
  const trimmed = method.trim();
  const match = TRAILING_DATE_RANGE.exec(trimmed);
  if (!match) return { name: trimmed };

  const [, name, dates] = match;
  if (!name || !dates) return { name: trimmed };

  return { name, dateLabel: dates.replace(/\s+-\s+/g, ' – ') };
}

/** Turns either method format into { name, dateLabel } for rendering. */
export function normalizeMethod(method: ObtainableMethod): NormalizedMethod {
  if (typeof method === 'string') return parseMethodString(method);
  return { name: method.name, dateLabel: formatDateRange(method.start, method.end) };
}