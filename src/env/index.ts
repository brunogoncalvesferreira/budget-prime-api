import 'dotenv/config'
import z from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: z.url(),
  PASSWORD_SEED: z.string(),
})

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  PASSWORD_SEED: process.env.PASSWORD_SEED,
})
