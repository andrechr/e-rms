import { describe, it, expect, vi } from 'vitest'
import Fastify from 'fastify'
import employeeRoutes from './employees.js'

const mockEmployee = {
  id: '1',
  name: 'Boodi Santoso',
  email: 'boodi@example.com',
  department: 'Engineering',
  role: 'Developer',
}

const mockEmployee2 = {
  id: '2',
  name: 'Maja Putri',
  email: 'maja@example.com',
  department: 'HR',
  role: 'Manager',
}

function buildApp(prisma) {
  const app = Fastify()
  app.decorate('prisma', prisma)
  app.register(employeeRoutes)
  app.setErrorHandler((error, request, reply) => {
    if (error.validation) return reply.code(400).send({ error: error.message })
    if (error.code === 'P2002') return reply.code(409).send({ error: 'Email already exists' })
    if (error.code === 'P2025') return reply.code(404).send({ error: 'Employee not found' })
    reply.code(500).send({ error: 'Internal server error' })
  })
  return app
}

describe('GET /employees', () => {
  it('returns paginated employees', async () => {
    const prisma = {
      employee: {
        findMany: vi.fn().mockResolvedValue([mockEmployee, mockEmployee2]),
        count: vi.fn().mockResolvedValue(2),
      }
    }
    const app = buildApp(prisma)
    const res = await app.inject({ method: 'GET', url: '/employees?page=1&limit=10' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.data).toHaveLength(2)
    expect(body.total).toBe(2)
    expect(body.totalPages).toBe(1)
  })
})

describe('GET /employees/:id', () => {
  it('returns employee when found', async () => {
    const prisma = { employee: { findUnique: vi.fn().mockResolvedValue(mockEmployee) } }
    const app = buildApp(prisma)
    const res = await app.inject({ method: 'GET', url: '/employees/1' })
    expect(res.statusCode).toBe(200)
    expect(res.json().name).toBe('Boodi Santoso')
  })

  it('returns 404 when not found', async () => {
    const prisma = { employee: { findUnique: vi.fn().mockResolvedValue(null) } }
    const app = buildApp(prisma)
    const res = await app.inject({ method: 'GET', url: '/employees/999' })
    expect(res.statusCode).toBe(404)
  })
})

describe('POST /employees', () => {
  it('creates and returns new employee', async () => {
    const prisma = { employee: { create: vi.fn().mockResolvedValue(mockEmployee) } }
    const app = buildApp(prisma)
    const res = await app.inject({
      method: 'POST',
      url: '/employees',
      payload: { name: 'Boodi Santoso', email: 'boodi@example.com' }
    })
    expect(res.statusCode).toBe(201)
    expect(res.json().email).toBe('boodi@example.com')
  })

  it('returns 400 on missing required fields', async () => {
    const prisma = { employee: { create: vi.fn() } }
    const app = buildApp(prisma)
    const res = await app.inject({
      method: 'POST',
      url: '/employees',
      payload: { name: 'Boodi Santoso' }
    })
    expect(res.statusCode).toBe(400)
  })

  it('returns 409 on duplicate email', async () => {
    const error = Object.assign(new Error('Unique constraint'), { code: 'P2002' })
    const prisma = { employee: { create: vi.fn().mockRejectedValue(error) } }
    const app = buildApp(prisma)
    const res = await app.inject({
      method: 'POST',
      url: '/employees',
      payload: { name: 'Boodi Santoso', email: 'boodi@example.com' }
    })
    expect(res.statusCode).toBe(409)
    expect(res.json().error).toBe('Email already exists')
  })
})

describe('PUT /employees/:id', () => {
  it('updates and returns employee', async () => {
    const updated = { ...mockEmployee, role: 'Senior Developer' }
    const prisma = { employee: { update: vi.fn().mockResolvedValue(updated) } }
    const app = buildApp(prisma)
    const res = await app.inject({
      method: 'PUT',
      url: '/employees/1',
      payload: { role: 'Senior Developer' }
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().role).toBe('Senior Developer')
  })

  it('returns 404 when employee not found', async () => {
    const error = Object.assign(new Error('Not found'), { code: 'P2025' })
    const prisma = { employee: { update: vi.fn().mockRejectedValue(error) } }
    const app = buildApp(prisma)
    const res = await app.inject({
      method: 'PUT',
      url: '/employees/999',
      payload: { role: 'Senior Developer' }
    })
    expect(res.statusCode).toBe(404)
  })
})

describe('DELETE /employees/:id', () => {
  it('returns 204 on success', async () => {
    const prisma = { employee: { delete: vi.fn().mockResolvedValue(mockEmployee) } }
    const app = buildApp(prisma)
    const res = await app.inject({ method: 'DELETE', url: '/employees/1' })
    expect(res.statusCode).toBe(204)
  })

  it('returns 404 when employee not found', async () => {
    const error = Object.assign(new Error('Not found'), { code: 'P2025' })
    const prisma = { employee: { delete: vi.fn().mockRejectedValue(error) } }
    const app = buildApp(prisma)
    const res = await app.inject({ method: 'DELETE', url: '/employees/999' })
    expect(res.statusCode).toBe(404)
  })
})
