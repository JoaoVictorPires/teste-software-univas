import { describe, it, beforeEach, afterAll, expect } from 'vitest'
import request from 'supertest'
import app, { prisma as appPrisma } from '../../src/index'
import { prisma, resetDb } from './testDb'

describe('Users API - simples update & delete', () => {
	beforeEach(async () => {
		await resetDb()
	})

	afterAll(async () => {
		await prisma.$disconnect()
		await appPrisma.$disconnect()
	})

	it('atualiza um usuário)', async () => {
		const user = await prisma.user.create({ data: { name: 'Any', email: 'any@ex.com' } })

		const res = await request(app)
			.put(`/api/users/${user.id}`)
			.send({ name: 'Updated Any' })

		expect(res.status).toBe(200)
		expect(res.body.success).toBe(true)
		expect(res.body.data.name).toBe('Updated Any')
	})

	it('deleta um usuário )', async () => {
		const user = await prisma.user.create({ data: { name: 'ToDelete', email: 'todel@ex.com' } })

		const res = await request(app).delete(`/api/users/${user.id}`)
		expect(res.status).toBe(200)
		expect(res.body.success).toBe(true)
	})
})

