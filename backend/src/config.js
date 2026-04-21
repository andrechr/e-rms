const required = ['DATABASE_URL']

for (const key of required) {
    if (!process.env[key]) {
        console.error(`Missing required env var: ${key}`)
        process.exit(1)
    }
}

export const config = {
    db: process.env.DATABASE_URL,
    port: Number(process.env.PORT) || 3000
}