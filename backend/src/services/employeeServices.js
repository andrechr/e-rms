export function employeeService(prisma) {
    return {
        getAll: ({ page = 1, limit = 10 } = {}) => prisma.employee.findMany({
            skip: (page - 1) * limit,
            take: limit,
        }),
        
        count: () => prisma.employee.count(),

        getOne: (id) => prisma.employee.findUnique({ where: { id } }),

        create: (data) => prisma.employee.create({ data }),

        update: (id, data) => prisma.employee.update({ where: { id }, data }),

        remove: (id) => prisma.employee.delete({ where: { id } }),
    }
}