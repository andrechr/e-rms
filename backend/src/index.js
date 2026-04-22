//import './config.js'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import db from './plugins/db.js'
import employeeRoutes from './routes/employees.js'

const app = Fastify({ logger: true })

await app.register(cors, {
  origin: [
    'http://localhost:5173',
    'https://e-rms.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
})
await app.register(db)
app.setErrorHandler((error, request, reply) => {
    if (error.validation) return reply.code(400).send({ error: error.message })
    if (error.code === 'P2002') return reply.code(409).send({ error: 'Email already exists' })
    if (error.code === 'P2025') return reply.code(404).send({ error: 'Employee not found' })
    reply.code(500).send({ error: 'Internal server error' })
})
await app.register(employeeRoutes)
app.get('/health', async () => ({ status: 'ok' }))

await app.listen({ port: app.config?.port || Number(process.env.PORT) || 3000, host: '0.0.0.0' })
