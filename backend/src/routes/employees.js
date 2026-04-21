  // src/routes/employees.js
import { employeeService } from '../services/employeeServices.js'

export default async function employeeRoutes(app) {
    const service = employeeService(app.prisma)

    app.get('/employees', async () => {
        return service.getAll()
    })

    app.get('/employees/:id', async (request) => {
        return service.getOne(request.params.id)
    })

    app.post('/employees', async (request, reply) => {
        const employee = await service.create(request.body)
        return reply.code(201).send(employee)
    })

    app.put('/employees/:id', async (request) => {
        return service.update(request.params.id, request.body)
    })

    app.delete('/employees/:id', async (request, reply) => {
        await service.remove(request.params.id)
        return reply.code(204).send()
    })
}