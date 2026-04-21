import './config.js'
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
await app.register(employeeRoutes)

app.get('/health', async () => ({ status: 'ok' }))

await app.listen({ port: app.config?.port || Number(process.env.PORT) || 3000, host: '0.0.0.0' })
