import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.js';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./data/repas.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

// Initialize database tables
export async function initializeDatabase() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS guests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      comment TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `);

  await client.execute(`
    CREATE UNIQUE INDEX IF NOT EXISTS guests_name_idx ON guests(first_name, last_name)
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS contributions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guest_id INTEGER NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
      category TEXT NOT NULL CHECK(category IN ('SALTY', 'SWEET', 'DRINK', 'SIDE')),
      description TEXT NOT NULL,
      servings INTEGER NOT NULL CHECK(servings >= 1 AND servings <= 50),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `);

  console.log('✅ Base de données initialisée');
}

export { schema };
