import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

const DATABASE_PATH = process.env.DATABASE_URL || './data/repas.db';

const sqlite = new Database(DATABASE_PATH);

// Enable WAL mode for better concurrent performance
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });

// Initialize database tables
export function initializeDatabase() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS guests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      comment TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS guests_name_idx ON guests(first_name, last_name);

    CREATE TABLE IF NOT EXISTS contributions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guest_id INTEGER NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
      category TEXT NOT NULL CHECK(category IN ('SALTY', 'SWEET', 'DRINK', 'SIDE')),
      description TEXT NOT NULL,
      servings INTEGER NOT NULL CHECK(servings >= 1 AND servings <= 50),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `);

  console.log('✅ Base de données initialisée');
}

export { schema };
