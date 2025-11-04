// backend/src/utils/categoryRules.ts
export function canDeleteCategory(tasksCount: number) {
  return tasksCount === 0
}