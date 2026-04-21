export function employeeService(prisma) {
    return {
        getAll: () => prisma.employee.findMany(),

        getOne: (id) => prisma.employee.findUnique({ where: { id } }),

        create: (data) => prisma.employee.create({ data }),

        update: (id, data) => prisma.employee.update({ where: { id }, data }),

        remove: (id) => prisma.employee.delete({ where: { id } }),
    }
}