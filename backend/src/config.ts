const required = ['DATABASE_URL']

for (const key of required) {
    if (!process.env[key]) {
        console.error(`[FATAL] Missing required env var: ${key}`)
        console.error(`[FATAL] Available env vars: ${Object.keys(process.env).join(', ')}`)
        setTimeout(() => process.exit(1), 1000)
    }
}

export const config = {
    db: process.env.DATABASE_URL,
    port: Number(process.env.PORT) || 3000
}
