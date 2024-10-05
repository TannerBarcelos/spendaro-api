import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './src/db/schema';
import * as relations from './src/db/relations';
import dotenv from 'dotenv';

dotenv.config();
const databaseUrl = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`;

if (!databaseUrl) {
  throw new Error('DATABASE_URL must be set to connect to the database');
}

const client = postgres(databaseUrl);
const db = drizzle(client, {
  schema: { ...schema, ...relations },
});

async function main() {
  console.log('Migration started');
  try {
    await migrate(db, {
      migrationsFolder: './src/db/migrations',
    });
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

main()
  .then(() => {
    console.log('Migration process finished');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration process failed:', err);
    process.exit(1);
  });
