import type { ProgressResponse } from '@/types/shared/userDataSync/syncFromAccount';

export function isObject(u: unknown): u is Record<string, unknown> {
  return typeof u === 'object' && u !== null;
}

export function isProgressResponse(u: unknown): u is ProgressResponse {
  return isObject(u) && 'progress' in u;
}

export function safeParseJSON(text: string): unknown {
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}