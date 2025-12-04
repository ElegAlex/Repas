import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../db/schema.js';

// Créer une BDD en mémoire pour les tests
const testSqlite = new Database(':memory:');
testSqlite.exec(`
  CREATE TABLE IF NOT EXISTS guests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    comment TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
  );
  CREATE TABLE IF NOT EXISTS contributions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_id INTEGER NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    servings INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
  );
`);

const testDb = drizzle(testSqlite, { schema });

// Mock le module db
vi.mock('../db/index.js', () => ({
  db: testDb,
  schema,
}));

// Import après le mock
const { default: statsRouter } = await import('./stats.js');

// Créer l'app de test
function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/stats', statsRouter);
  return app;
}

// Helper pour créer un guest et retourner son ID
function createGuest(firstName: string, lastName: string): number {
  const stmt = testSqlite.prepare('INSERT INTO guests (first_name, last_name) VALUES (?, ?)');
  const result = stmt.run(firstName, lastName);
  return result.lastInsertRowid as number;
}

// Helper pour créer une contribution
function createContribution(guestId: number, category: string, description: string, servings: number): void {
  const stmt = testSqlite.prepare('INSERT INTO contributions (guest_id, category, description, servings) VALUES (?, ?, ?, ?)');
  stmt.run(guestId, category, description, servings);
}

describe('Stats API', () => {
  beforeEach(() => {
    testSqlite.exec('DELETE FROM contributions');
    testSqlite.exec('DELETE FROM guests');
  });

  describe('GET /api/stats', () => {
    it('devrait retourner des stats vides initialement', async () => {
      const app = createTestApp();

      const response = await request(app).get('/api/stats');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.guestsCount).toBe(0);
      expect(response.body.data.contributionsCount).toBe(0);
      expect(response.body.data.totalServings).toBe(0);
    });

    it('devrait calculer correctement les statistiques', async () => {
      const app = createTestApp();

      // Créer des guests et contributions
      const guest1Id = createGuest('Jean', 'Dupont');
      const guest2Id = createGuest('Marie', 'Martin');
      createContribution(guest1Id, 'SALTY', 'Salade', 10);
      createContribution(guest1Id, 'SWEET', 'Tarte', 8);
      createContribution(guest2Id, 'SALTY', 'Lasagnes', 12);

      const response = await request(app).get('/api/stats');

      expect(response.body.data.guestsCount).toBe(2);
      expect(response.body.data.contributionsCount).toBe(3);
      expect(response.body.data.totalServings).toBe(30);
      expect(response.body.data.servingsPerGuest).toBe(15);
    });

    it('devrait indiquer la couverture par catégorie', async () => {
      const app = createTestApp();

      const guestId = createGuest('Test', 'User');
      createContribution(guestId, 'SALTY', 'Salade', 10);
      createContribution(guestId, 'SWEET', 'Tarte', 8);

      const response = await request(app).get('/api/stats');

      expect(response.body.data.categoryCoverage.SALTY).toBe(true);
      expect(response.body.data.categoryCoverage.SWEET).toBe(true);
      expect(response.body.data.categoryCoverage.DRINK).toBe(false);
      expect(response.body.data.categoryCoverage.SIDE).toBe(false);
    });

    it('devrait générer des alertes pour les catégories manquantes', async () => {
      const app = createTestApp();

      const guestId = createGuest('Test', 'Alerts');
      createContribution(guestId, 'SALTY', 'Salade', 10);

      const response = await request(app).get('/api/stats');

      const alerts = response.body.data.alerts;
      expect(alerts.length).toBeGreaterThan(0);

      const drinkAlert = alerts.find((a: { message: string }) => a.message.includes('boisson'));
      expect(drinkAlert).toBeDefined();
      expect(drinkAlert.type).toBe('warning');
    });

    it('devrait alerter si peu de parts par personne', async () => {
      const app = createTestApp();

      // 10 guests mais seulement 5 parts au total = 0.5 parts/personne
      const guestIds: number[] = [];
      for (let i = 1; i <= 10; i++) {
        guestIds.push(createGuest(`Guest${i}`, 'Test'));
      }
      createContribution(guestIds[0], 'SALTY', 'Mini portion', 5);

      const response = await request(app).get('/api/stats');

      const lowServingsAlert = response.body.data.alerts.find(
        (a: { message: string }) => a.message.includes('parts par personne')
      );
      expect(lowServingsAlert).toBeDefined();
    });

    it('devrait calculer les stats par catégorie', async () => {
      const app = createTestApp();

      const guestId = createGuest('Stats', 'Test');
      createContribution(guestId, 'SWEET', 'Tarte 1', 8);
      createContribution(guestId, 'SWEET', 'Tarte 2', 6);
      createContribution(guestId, 'DRINK', 'Jus', 20);

      const response = await request(app).get('/api/stats');

      expect(response.body.data.byCategory.SWEET.count).toBe(2);
      expect(response.body.data.byCategory.SWEET.servings).toBe(14);
      expect(response.body.data.byCategory.DRINK.count).toBe(1);
      expect(response.body.data.byCategory.DRINK.servings).toBe(20);
    });
  });
});
