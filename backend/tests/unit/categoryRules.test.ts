// backend/tests/unit/categoryRules.test.ts
import { describe, it, expect } from 'vitest'
import { canDeleteCategory } from '../../src/utils/categoryRules'

describe('canDeleteCategory', () => {
  it('permite deletar quando não há tarefas', () => {
    expect(canDeleteCategory(0)).toBe(true)
  })
  it('bloqueia quando há pelo menos 1 tarefa', () => {
    expect(canDeleteCategory(1)).toBe(false)
    expect(canDeleteCategory(5)).toBe(false)
  })
})