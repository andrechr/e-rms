import { describe, it, expect, vi } from 'vitest'
import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify'
import departmentRoutes from './departments.js'

const mockDepartment = { id: 'd1', name: 'Engineering', createdAt: new Date().toISOString() }
const mockDepartment2 = { id: 'd2', name: 'Product', createdAt: new Date().toISOString() }

function buildApp(prisma: unknown): FastifyInstance {
    const app = Fastify()
    app.decorate('prisma', prisma as any)
    app.register(departmentRoutes)
    app.setErrorHandler((error: any, request, reply) => {
        if (error.validation) return reply.code(400).send({ error: error.message })
        reply.code(500).send({ error: 'Internal server error' })
    })
    return app
}

describe('GET /departments', () => {
    it('returns all departments', async () => {
        const prisma = {
            department: { findMany: vi.fn().mockResolvedValue([mockDepartment, mockDepartment2]) }
        } as any
        const app = buildApp(prisma)
        const res = await app.inject({ method: 'GET', url: '/departments' })
        expect(res.statusCode).toBe(200)
        expect(res.json()).toHaveLength(2)
    })

    it('returns empty array when no departments', async () => {
        const prisma = {
            department: { findMany: vi.fn().mockResolvedValue([]) }
        } as any
        const app = buildApp(prisma)
        const res = await app.inject({ method: 'GET', url: '/departments' })
        expect(res.statusCode).toBe(200)
        expect(res.json()).toHaveLength(0)
    })
})

describe('POST /departments', () => {
    it('creates and returns new department', async () => {
        const prisma = {
            department: { create: vi.fn().mockResolvedValue(mockDepartment) }
        } as any
        const app = buildApp(prisma)
        const res = await app.inject({
            method: 'POST',
            url: '/departments',
            payload: { name: 'Engineering' }
        })
        expect(res.statusCode).toBe(201)
        expect(res.json().name).toBe('Engineering')
    })

    it('returns 400 on missing name', async () => {
        const prisma = {
            department: { create: vi.fn() }
        } as any
        const app = buildApp(prisma)
        const res = await app.inject({
            method: 'POST',
            url: '/departments',
            payload: {}
        })
        expect(res.statusCode).toBe(400)
    })
})

describe('DELETE /departments/:id', () => {
    it('returns 204 on success', async () => {
        const prisma = {
            department: { delete: vi.fn().mockResolvedValue(mockDepartment) }
        } as any
        const app = buildApp(prisma)
        const res = await app.inject({ method: 'DELETE', url: '/departments/d1' })
        expect(res.statusCode).toBe(204)
    })
})
