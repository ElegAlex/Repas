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
  CREATE UNIQUE INDEX IF NOT EXISTS guests_name_idx ON guests(first_name, last_name);
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
// Activer les foreign keys
testSqlite.pragma('foreign_keys = ON');

const testDb = drizzle(testSqlite, { schema });

// Mock le module db
vi.mock('../db/index.js', () => ({
  db: testDb,
  schema,
}));

// Import après le mock
const { default: guestsRouter } = await import('./guests.js');

// Créer l'app de test
function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/guests', guestsRouter);
  return app;
}

describe('Guests API', () => {
  beforeEach(() => {
    testSqlite.exec('DELETE FROM contributions');
    testSqlite.exec('DELETE FROM guests');
  });

  describe('GET /api/guests', () => {
    it('TI-001: devrait retourner une liste vide initialement', async () => {
      const app = createTestApp();
      const response = await request(app).get('/api/guests');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.total).toBe(0);
    });

    it('devrait retourner les participants avec leurs contributions', async () => {
      const app = createTestApp();

      // Créer un participant
      await request(app)
        .post('/api/guests')
        .send({ firstName: 'Jean', lastName: 'Dupont' });

      const response = await request(app).get('/api/guests');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].firstName).toBe('Jean');
      expect(response.body.data[0].contributions).toBeDefined();
    });
  });

  describe('POST /api/guests', () => {
    it('TU-001/TI-002: devrait créer un participant avec données valides', async () => {
      const app = createTestApp();
      const guestData = {
        firstName: 'Marie',
        lastName: 'Martin',
        comment: 'Végétarienne',
      };

      const response = await request(app)
        .post('/api/guests')
        .send(guestData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe('Marie');
      expect(response.body.data.lastName).toBe('Martin');
      expect(response.body.data.comment).toBe('Végétarienne');
      expect(response.body.data.id).toBeDefined();
    });

    it('TU-002: devrait rejeter un prénom trop court', async () => {
      const app = createTestApp();
      const invalidData = {
        firstName: 'A',
        lastName: 'Martin',
      };

      const response = await request(app)
        .post('/api/guests')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Données invalides');
      expect(response.body.details).toBeDefined();
    });

    it('TU-003: devrait rejeter un doublon nom/prénom', async () => {
      const app = createTestApp();
      const guestData = {
        firstName: 'Pierre',
        lastName: 'Lefebvre',
      };

      // Premier ajout
      await request(app).post('/api/guests').send(guestData);

      // Doublon
      const response = await request(app)
        .post('/api/guests')
        .send(guestData);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('existe déjà');
    });
  });

  describe('PUT /api/guests/:id', () => {
    it('TI-003: devrait modifier un participant existant', async () => {
      const app = createTestApp();

      // Créer un participant
      const createResponse = await request(app)
        .post('/api/guests')
        .send({ firstName: 'Sophie', lastName: 'Bernard' });

      const guestId = createResponse.body.data.id;

      // Modifier
      const updateResponse = await request(app)
        .put(`/api/guests/${guestId}`)
        .send({ comment: 'Allergique aux arachides' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.data.comment).toBe('Allergique aux arachides');
    });

    it('devrait retourner 404 pour un participant inexistant', async () => {
      const app = createTestApp();

      const response = await request(app)
        .put('/api/guests/999')
        .send({ comment: 'Test' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('devrait retourner 400 pour un ID invalide', async () => {
      const app = createTestApp();

      const response = await request(app)
        .put('/api/guests/invalid')
        .send({ comment: 'Test' });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/guests/:id', () => {
    it('TI-004: devrait supprimer un participant', async () => {
      const app = createTestApp();

      // Créer puis supprimer
      const createResponse = await request(app)
        .post('/api/guests')
        .send({ firstName: 'Test', lastName: 'Delete' });

      const guestId = createResponse.body.data.id;

      const deleteResponse = await request(app)
        .delete(`/api/guests/${guestId}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);

      // Vérifier la suppression
      const listResponse = await request(app).get('/api/guests');
      expect(listResponse.body.total).toBe(0);
    });

    it('TU-006: devrait supprimer en cascade les contributions', async () => {
      const app = createTestApp();

      // Créer un participant
      const createResponse = await request(app)
        .post('/api/guests')
        .send({ firstName: 'Cascade', lastName: 'Test' });

      const guestId = createResponse.body.data.id;

      // Ajouter une contribution directement en BDD
      testSqlite.exec(`
        INSERT INTO contributions (guest_id, category, description, servings)
        VALUES (${guestId}, 'SWEET', 'Test dessert', 5)
      `);

      // Supprimer le participant
      await request(app).delete(`/api/guests/${guestId}`);

      // Vérifier que la contribution est supprimée
      const contribs = testSqlite.prepare('SELECT * FROM contributions WHERE guest_id = ?').all(guestId);
      expect(contribs.length).toBe(0);
    });

    it('devrait retourner 404 pour un participant inexistant', async () => {
      const app = createTestApp();

      const response = await request(app).delete('/api/guests/999');

      expect(response.status).toBe(404);
    });
  });
});
