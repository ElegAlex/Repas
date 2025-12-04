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
testSqlite.pragma('foreign_keys = ON');

const testDb = drizzle(testSqlite, { schema });

// Mock le module db
vi.mock('../db/index.js', () => ({
  db: testDb,
  schema,
}));

// Import après le mock
const { default: contributionsRouter } = await import('./contributions.js');

// Créer l'app de test
function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/contributions', contributionsRouter);
  return app;
}

// Helper pour créer un guest
function createGuest(firstName: string, lastName: string): number {
  const stmt = testSqlite.prepare('INSERT INTO guests (first_name, last_name) VALUES (?, ?)');
  const result = stmt.run(firstName, lastName);
  return result.lastInsertRowid as number;
}

describe('Contributions API', () => {
  beforeEach(() => {
    testSqlite.exec('DELETE FROM contributions');
    testSqlite.exec('DELETE FROM guests');
  });

  describe('GET /api/contributions', () => {
    it('devrait retourner les contributions groupées par catégorie', async () => {
      const app = createTestApp();
      const guestId = createGuest('Jean', 'Dupont');

      // Ajouter des contributions
      testSqlite.exec(`
        INSERT INTO contributions (guest_id, category, description, servings)
        VALUES
          (${guestId}, 'SALTY', 'Salade', 10),
          (${guestId}, 'SWEET', 'Tarte', 8)
      `);

      const response = await request(app).get('/api/contributions');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.SALTY.length).toBe(1);
      expect(response.body.data.SWEET.length).toBe(1);
      expect(response.body.data.DRINK.length).toBe(0);
      expect(response.body.stats.totalContributions).toBe(2);
      expect(response.body.stats.totalServings).toBe(18);
    });

    it('devrait inclure les informations du guest', async () => {
      const app = createTestApp();
      const guestId = createGuest('Marie', 'Martin');

      testSqlite.exec(`
        INSERT INTO contributions (guest_id, category, description, servings)
        VALUES (${guestId}, 'SALTY', 'Lasagnes', 12)
      `);

      const response = await request(app).get('/api/contributions');

      expect(response.body.data.SALTY[0].guest.firstName).toBe('Marie');
      expect(response.body.data.SALTY[0].guest.lastName).toBe('Martin');
    });
  });

  describe('POST /api/contributions', () => {
    it('devrait créer une contribution valide', async () => {
      const app = createTestApp();
      const guestId = createGuest('Pierre', 'Lefebvre');

      const response = await request(app)
        .post('/api/contributions')
        .send({
          guestId,
          category: 'SWEET',
          description: 'Mousse au chocolat',
          servings: 10,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.description).toBe('Mousse au chocolat');
    });

    it('TU-004: devrait rejeter une contribution pour un guest inexistant', async () => {
      const app = createTestApp();

      const response = await request(app)
        .post('/api/contributions')
        .send({
          guestId: 999,
          category: 'SALTY',
          description: 'Test plat',
          servings: 5,
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('Participant non trouvé');
    });

    it('TU-005: devrait rejeter une catégorie invalide', async () => {
      const app = createTestApp();
      const guestId = createGuest('Test', 'User');

      const response = await request(app)
        .post('/api/contributions')
        .send({
          guestId,
          category: 'INVALID',
          description: 'Test',
          servings: 5,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Données invalides');
    });

    it('devrait rejeter une description trop courte', async () => {
      const app = createTestApp();
      const guestId = createGuest('Test', 'Short');

      const response = await request(app)
        .post('/api/contributions')
        .send({
          guestId,
          category: 'SALTY',
          description: 'AB',
          servings: 5,
        });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/contributions/:id', () => {
    it('devrait modifier une contribution existante', async () => {
      const app = createTestApp();
      const guestId = createGuest('Update', 'Test');

      // Créer une contribution
      const createResponse = await request(app)
        .post('/api/contributions')
        .send({
          guestId,
          category: 'DRINK',
          description: 'Jus de pomme',
          servings: 5,
        });

      const contribId = createResponse.body.data.id;

      // Modifier
      const updateResponse = await request(app)
        .put(`/api/contributions/${contribId}`)
        .send({ servings: 10 });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.data.servings).toBe(10);
    });

    it('devrait retourner 404 pour une contribution inexistante', async () => {
      const app = createTestApp();

      const response = await request(app)
        .put('/api/contributions/999')
        .send({ servings: 10 });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/contributions/:id', () => {
    it('devrait supprimer une contribution', async () => {
      const app = createTestApp();
      const guestId = createGuest('Delete', 'Contrib');

      // Créer puis supprimer
      const createResponse = await request(app)
        .post('/api/contributions')
        .send({
          guestId,
          category: 'SIDE',
          description: 'Pain frais',
          servings: 15,
        });

      const contribId = createResponse.body.data.id;

      const deleteResponse = await request(app)
        .delete(`/api/contributions/${contribId}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);

      // Vérifier
      const listResponse = await request(app).get('/api/contributions');
      expect(listResponse.body.stats.totalContributions).toBe(0);
    });

    it('devrait retourner 404 pour une contribution inexistante', async () => {
      const app = createTestApp();

      const response = await request(app).delete('/api/contributions/999');

      expect(response.status).toBe(404);
    });
  });
});
