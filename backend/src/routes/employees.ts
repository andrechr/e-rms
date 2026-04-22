import type { FastifyInstance } from 'fastify'
import { employeeService } from '../services/employeeServices.js'

const employeeBodySchema = {
    type: 'object',
    required: ['name', 'email'],
    properties: {
        name:         { type: 'string', minLength: 1 },
        email:        { type: 'string', format: 'email' },
        departmentId: { type: 'string' },
        role:         { type: 'string' },
    },
    additionalProperties: false
} as const

const employeeUpdateSchema = {
    type: 'object',
    properties: {
        name:         { type: 'string', minLength: 1 },
        email:        { type: 'string', format: 'email' },
        departmentId: { type: 'string' },
        role:         { type: 'string' },
    },
    additionalProperties: false
} as const

export default async function employeeRoutes(app: FastifyInstance) {
    const service = employeeService(app.prisma)

    app.get('/employees', async (request) => {
        const query = request.query as { page?: string; limit?: string }
        const page = parseInt(query.page ?? '1') || 1
        const limit = parseInt(query.limit ?? '10') || 10
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
        const { id } = request.params as { id: string }
        const employee = await service.getOne(id)
        if (!employee) return reply.code(404).send({ error: 'Employee not found' })
        return employee
    })

    app.post('/employees', { schema: { body: employeeBodySchema } }, async (request, reply) => {
        const employee = await service.create(request.body as { name: string; email: string; departmentId?: string; role?: string })
        return reply.code(201).send(employee)
    })

    app.put('/employees/:id', { schema: { body: employeeUpdateSchema } }, async (request, reply) => {
        const { id } = request.params as { id: string }
        return await service.update(id, request.body as { name?: string; email?: string; departmentId?: string; role?: string })
    })

    app.delete('/employees/:id', async (request, reply) => {
        const { id } = request.params as { id: string }
        await service.remove(id)
        return reply.code(204).send()
    })
}
