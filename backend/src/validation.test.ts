import { describe, it, expect } from 'vitest';
import {
  createGuestSchema,
  updateGuestSchema,
  createContributionSchema,
  updateContributionSchema,
  CATEGORIES,
} from './validation.js';

describe('Validation Schemas', () => {
  describe('createGuestSchema', () => {
    it('TU-001: devrait valider des données correctes', () => {
      const validData = {
        firstName: 'Jean',
        lastName: 'Dupont',
        comment: 'Végétarien',
      };

      const result = createGuestSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('devrait valider sans commentaire', () => {
      const validData = {
        firstName: 'Marie',
        lastName: 'Martin',
      };

      const result = createGuestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('TU-002: devrait rejeter un prénom trop court', () => {
      const invalidData = {
        firstName: 'A',
        lastName: 'Dupont',
      };

      const result = createGuestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('2 caractères');
      }
    });

    it('devrait rejeter un nom trop court', () => {
      const invalidData = {
        firstName: 'Jean',
        lastName: 'D',
      };

      const result = createGuestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un prénom trop long (> 50 caractères)', () => {
      const invalidData = {
        firstName: 'A'.repeat(51),
        lastName: 'Dupont',
      };

      const result = createGuestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un commentaire trop long (> 500 caractères)', () => {
      const invalidData = {
        firstName: 'Jean',
        lastName: 'Dupont',
        comment: 'A'.repeat(501),
      };

      const result = createGuestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('updateGuestSchema', () => {
    it('devrait permettre une mise à jour partielle', () => {
      const partialData = { comment: 'Nouveau commentaire' };

      const result = updateGuestSchema.safeParse(partialData);
      expect(result.success).toBe(true);
    });

    it('devrait permettre un objet vide', () => {
      const result = updateGuestSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('createContributionSchema', () => {
    it('devrait valider une contribution correcte', () => {
      const validData = {
        guestId: 1,
        category: 'SWEET' as const,
        description: 'Tarte aux pommes',
        servings: 8,
      };

      const result = createContributionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('TU-005: devrait rejeter une catégorie invalide', () => {
      const invalidData = {
        guestId: 1,
        category: 'INVALID_CATEGORY',
        description: 'Test',
        servings: 5,
      };

      const result = createContributionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('devrait rejeter une description trop courte (< 3 caractères)', () => {
      const invalidData = {
        guestId: 1,
        category: 'SALTY' as const,
        description: 'AB',
        servings: 5,
      };

      const result = createContributionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un nombre de parts < 1', () => {
      const invalidData = {
        guestId: 1,
        category: 'SALTY' as const,
        description: 'Salade',
        servings: 0,
      };

      const result = createContributionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un nombre de parts > 50', () => {
      const invalidData = {
        guestId: 1,
        category: 'DRINK' as const,
        description: 'Jus de fruits',
        servings: 51,
      };

      const result = createContributionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un guestId négatif', () => {
      const invalidData = {
        guestId: -1,
        category: 'SIDE' as const,
        description: 'Pain',
        servings: 10,
      };

      const result = createContributionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('updateContributionSchema', () => {
    it('devrait permettre une mise à jour partielle', () => {
      const partialData = { servings: 10 };

      const result = updateContributionSchema.safeParse(partialData);
      expect(result.success).toBe(true);
    });

    it('ne devrait pas permettre de modifier guestId', () => {
      const dataWithGuestId = { guestId: 2, servings: 10 };

      const result = updateContributionSchema.safeParse(dataWithGuestId);
      // guestId est omis du schéma, donc il sera ignoré
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).not.toHaveProperty('guestId');
      }
    });
  });

  describe('CATEGORIES', () => {
    it('devrait contenir toutes les catégories attendues', () => {
      expect(CATEGORIES).toContain('SALTY');
      expect(CATEGORIES).toContain('SWEET');
      expect(CATEGORIES).toContain('DRINK');
      expect(CATEGORIES).toContain('SIDE');
      expect(CATEGORIES.length).toBe(4);
    });
  });
});
