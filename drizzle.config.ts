import { defineConfig } from 'drizzle-kit';

const dbBasePath = "./src/db/"

//https://orm.drizzle.team/docs/migrations
export default defineConfig({
  schema: `${dbBasePath}schema.ts`,
  out: `${dbBasePath}migrations`,
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres',
  },
});