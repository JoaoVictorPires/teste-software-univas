import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'
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
})