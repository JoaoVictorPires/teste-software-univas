import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'
<<<<<<< HEAD
//Crie os teste de CRUD para todas as rotas de Tarefas (/api/tasks/)
import app, { prisma as appPrisma } from '../../src/index'
import { prisma, resetDb, seedMinimal } from './testDb'

describe('Users API', () => {
    afterAll(async () => {
        await prisma.$disconnect()
        await appPrisma.$disconnect()
    })
    beforeEach(async () => {
        await resetDb()
    })
    it('POST /api/users cria usuário válido', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ name: 'Ana', email: 'ana@ex.com' })
        expect(res.status).toBe(201)
        expect(res.body.data).toMatchObject({ name: 'Ana', email: 'ana@ex.com' })
    })
    it('GET /api/users lista usuários', async () => {
        await prisma.user.create({ data: { name: 'Ana', email: 'ana@ex.com' } })
        const res = await request(app).get('/api/users')
        expect(res.status).toBe(200)
        expect(Array.isArray(res.body.data)).toBe(true)
        expect(res.body.data.some((u: any) => u.email === 'ana@ex.com')).toBe(true)
    })
})
describe('Users API - Update', () => {
    afterAll(async () => {
        await prisma.$disconnect()
        await appPrisma.$disconnect()
    })
     beforeEach(async () => {
        await resetDb()
    })
    it('PUT /api/users/:id atualiza usuário existente', async () => {
        const user = await prisma.user.create({
            data: { name: 'Carlos', email: 'carlos@ex.com' }
        })
        const res = await request(app)
            .put(`/api/users/${user.id}`)
            .send({ name: 'Carlos Silva', email: 'carlos.silva@ex.com' })
        expect(res.status).toBe(200)
        expect(res.body.data).toMatchObject({ name: 'Carlos Silva', email: 'carlos.silva@ex.com' })
    })
})

describe('Users API - Delete', () => {
    afterAll(async () => {
        await prisma.$disconnect()
        await appPrisma.$disconnect()
    })
     beforeEach(async () => {
        await resetDb()
    })
    it('DELETE /api/users/:id deleta usuário existente', async () => {
        const user = await prisma.user.create({
            data: { name: 'Mariana', email: 'mariana@ex.com' }
        })
        const res = await request(app)
            .delete(`/api/users/${user.id}`)
        expect(res.status).toBe(204)
    })
})

describe('Users API - Get by id', () => {
    afterAll(async () => {
        await prisma.$disconnect()
        await appPrisma.$disconnect()
    })
        beforeEach(async () => {
        await resetDb()
    })
    it('GET /api/users/:id retorna usuário existente', async () => {
        const user = await prisma.user.create({
            data: { name: 'Lucas', email: 'lucas@ex.com' }
        })
        const res = await request(app)
            .get(`/api/users/${user.id}`)
        expect(res.status).toBe(200)
        expect(res.body.data).toMatchObject({ name: 'Lucas', email: 'lucas@ex.com' })
    })
=======
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
>>>>>>> cf17de85e40b68240548b7827a3b962c8205dee3
})