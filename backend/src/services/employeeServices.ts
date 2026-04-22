import type { PrismaClient } from '@prisma/client'

export function employeeService(prisma: PrismaClient) {
    return {
        getAll: ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) =>
            prisma.employee.findMany({
                skip: (page - 1) * limit,
                take: limit,
            }),

        count: () => prisma.employee.count(),

        getOne: (id: string) => prisma.employee.findUnique({ where: { id } }),

        create: (data: { name: string; email: string; department?: string; role?: string }) =>
            prisma.employee.create({ data }),

        update: (id: string, data: { name?: string; email?: string; department?: string; role?: string }) =>
            prisma.employee.update({ where: { id }, data }),

        remove: (id: string) => prisma.employee.delete({ where: { id } }),
    }
}
