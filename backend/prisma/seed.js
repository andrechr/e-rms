import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

await prisma.employee.createMany({
  data: [
    { name: 'Boodi Santoso', email: 'boodi@abc.com', department: 'Product', role: 'Product Manager' },
    { name: 'Maja Putri', email: 'maja@abc.com', department: 'Engineering', role: 'Fullstack Developer' },
  ]
})

console.log('Seeded')
await prisma.$disconnect()
