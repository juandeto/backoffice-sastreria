import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: ['./src/lib/db/schema.ts', './src/lib/db/enums.ts'],
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: `${process.env.POSTGRES_URL}`,
  },
  verbose: true,
  strict: true,
});
