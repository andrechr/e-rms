import type { PrismaClient } from '@prisma/client'

export function departmentService(prisma: PrismaClient) {
    return {
        findAll: () => prisma.department.findMany({ orderBy: { name: 'asc' } }),

        create: (name: string) => prisma.department.create({ data: { name } }),

        remove: (id: string) => prisma.department.delete({ where: { id } }),
    }
}
