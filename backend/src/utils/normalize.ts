// backend/src/utils/normalize.ts
export function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, ' ').toLowerCase()
}