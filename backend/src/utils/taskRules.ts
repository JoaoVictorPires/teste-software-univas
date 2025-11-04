// backend/src/utils/taskRules.ts
export type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export function canTransition(from: Status, to: Status) {
  if (from === 'COMPLETED' || from === 'CANCELLED') return false
  if (from === 'PENDING' && to === 'IN_PROGRESS') return true
  if (from === 'IN_PROGRESS' && (to === 'COMPLETED' || to === 'CANCELLED')) return true
  return false
}