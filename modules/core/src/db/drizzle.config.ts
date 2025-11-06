import {defineConfig} from 'drizzle-kit'

export default defineConfig({
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  dialect: 'postgresql',
  out: './src/db/drizzle',
  schema: './src/db/schema',
  casing: 'snake_case',
})
