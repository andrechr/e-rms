import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

await prisma.employee.deleteMany()
await prisma.department.deleteMany()

const product = await prisma.department.create({ data: { name: 'Product' } })
const engineering = await prisma.department.create({ data: { name: 'Engineering' } })

await prisma.employee.createMany({
  data: [
    { name: 'Boodi Santoso', email: 'boodi@abc.com', departmentId: product.id, role: 'Product Manager' },
    { name: 'Maja Putri', email: 'maja@abc.com', departmentId: engineering.id, role: 'Fullstack Developer' },
  ]
})

console.log('Seeded')
await prisma.$disconnect()
