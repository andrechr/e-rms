import type { FastifyInstance } from 'fastify'
import { departmentService } from '../services/departmentService.js'

const departmentBodySchema = {
    type: 'object',
    required: ['name'],
    properties: {
        name: { type: 'string', minLength: 1 },
    },
    additionalProperties: false,
} as const

export default async function departmentRoutes(app: FastifyInstance) {
    const service = departmentService(app.prisma)

    app.get('/departments', async () => {
        return service.findAll()
    })

    app.post('/departments', { schema: { body: departmentBodySchema } }, async (request, reply) => {
        const { name } = request.body as { name: string }
        const department = await service.create(name)
        return reply.code(201).send(department)
    })

    app.delete('/departments/:id', async (request, reply) => {
        const { id } = request.params as { id: string }
        await service.remove(id)
        return reply.code(204).send()
    })
}
