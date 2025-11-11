import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'
import app, { prisma as appPrisma } from '../../src/index'
import { prisma, resetDb } from './testDb'

describe('Tasks API', () => {
  afterAll(async () => {
    await prisma.$disconnect()
    await appPrisma.$disconnect()
  })

  beforeEach(async () => {
    await resetDb()
  })

  async function createUserAndCategory() {
    const user = await prisma.user.create({
      data: { name: 'Ana', email: 'ana@ex.com' },
    })
    const category = await prisma.category.create({
      data: { name: 'Trabalho', description: 'Tarefas do trabalho' },
    })
    return { user, category }
  }

  it('POST /api/tasks cria tarefa válida', async () => {
    const { user, category } = await createUserAndCategory()

    const res = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Estudar Vitest',
        description: 'Ler documentação e praticar',
        status: 'PENDING',
        priority: 'MEDIUM',
        userId: user.id,
        categoryId: category.id,
      })

    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({
      title: 'Estudar Vitest',
      status: 'PENDING',
      priority: 'MEDIUM',
    })
  })

  it('GET /api/tasks lista tarefas', async () => {
    const { user, category } = await createUserAndCategory()
    await prisma.task.create({
      data: {
        title: 'Ler docs Prisma',
        description: 'Estudar relacionamentos',
        userId: user.id,
        categoryId: category.id,
      },
    })

    const res = await request(app).get('/api/tasks')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.some((t: any) => t.title === 'Ler docs Prisma')).toBe(true)
  })

  it('PUT /api/tasks/:id atualiza tarefa existente', async () => {
    const { user, category } = await createUserAndCategory()
    const task = await prisma.task.create({
      data: {
        title: 'Aprender Supertest',
        description: 'Testes de API',
        userId: user.id,
        categoryId: category.id,
      },
    })

    const res = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({
        title: 'Aprender Supertest (atualizado)',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
      })

    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({
      title: 'Aprender Supertest (atualizado)',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
    })

    const updated = await prisma.task.findUnique({ where: { id: task.id } })
    expect(updated).toMatchObject({
      title: 'Aprender Supertest (atualizado)',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
    })
  })

  it('DELETE /api/tasks/:id remove tarefa existente', async () => {
    const { user, category } = await createUserAndCategory()
    const task = await prisma.task.create({
      data: {
        title: 'Tarefa temporária',
        description: 'Será deletada',
        userId: user.id,
        categoryId: category.id,
      },
    })

    const res = await request(app).delete(`/api/tasks/${task.id}`)
    expect(res.status).toBe(204)

    const deleted = await prisma.task.findUnique({ where: { id: task.id } })
    expect(deleted).toBeNull()
  })
})