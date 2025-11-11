import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()

export async function resetDb() {
    await prisma.task.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()
}
export async function seedMinimal() {
    const user = await prisma.user.create({ data: { name: 'Ana', email: 'ana@ex.com' } })
    const category = await prisma.category.create({ data: { name: 'Work' } })
    return { user, category }
<<<<<<< HEAD
}
=======
}
>>>>>>> cf17de85e40b68240548b7827a3b962c8205dee3
