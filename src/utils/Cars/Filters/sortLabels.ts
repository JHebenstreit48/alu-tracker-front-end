export const sortLabels = (values: string[]): string[] =>
  [...values]
    .filter(Boolean)
    .map((v) => v.trim())
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));