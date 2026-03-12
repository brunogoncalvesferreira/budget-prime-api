import 'dotenv/config'
import z from 'zod'

const envSchema = z.object({
  BASE_URL: z.url().default('http://localhost:8080'),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: z.url(),
  PASSWORD_SEED: z.string(),
  FRONTEND_URL: z.url().default('http://localhost:5173'),
})

export const env = envSchema.parse({
  BASE_URL: process.env.BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  PASSWORD_SEED: process.env.PASSWORD_SEED,
  FRONTEND_URL: process.env.FRONTEND_URL,
})
