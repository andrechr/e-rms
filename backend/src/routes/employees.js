  // src/routes/employees.js
import { employeeService } from '../services/employeeServices.js'

const employeeBodySchema = {
    type: 'object',
    required: ['name', 'email'],
    properties: {
        name:       { type: 'string', minLength: 1 },
        email:      { type: 'string', format: 'email' },
        department: { type: 'string' },
        role:       { type: 'string' },
    },
    additionalProperties: false
}
const employeeUpdateSchema = {
    type: 'object',
    properties: {
        name:       { type: 'string', minLength: 1 },
        email:      { type: 'string', format: 'email' },
        department: { type: 'string' },
        role:       { type: 'string' },
    },
    additionalProperties: false
}

export default async function employeeRoutes(app) {
    const service = employeeService(app.prisma)

    app.get('/employees', async (request) => {
        const page = parseInt(request.query.page) || 1
        const limit = parseInt(request.query.limit) || 10
        const [data, total] = await Promise.all([
            service.getAll({ page, limit }),
            service.count(),
        ])
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    })

    app.get('/employees/:id', async (request, reply) => {
        const employee = await service.getOne(request.params.id)
        if (!employee) return reply.code(404).send({ error: 'Employee not found' })
        return employee
    })

    app.post('/employees', { schema: { body: employeeBodySchema } }, async (request, reply) => {
        const employee = await service.create(request.body)
        return reply.code(201).send(employee)
    })

    app.put('/employees/:id', { schema: { body: employeeUpdateSchema } }, async (request, reply) => {
        return await service.update(request.params.id, request.body)
    })

    app.delete('/employees/:id', async (request, reply) => {
        await service.remove(request.params.id)
        return reply.code(204).send()
    })
}