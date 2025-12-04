import { z } from 'zod';

// Catégories disponibles
export const CATEGORIES = ['SALTY', 'SWEET', 'DRINK', 'SIDE'] as const;
export type Category = typeof CATEGORIES[number];

// Labels français pour les catégories
export const CATEGORY_LABELS: Record<Category, string> = {
  SALTY: 'Salé',
  SWEET: 'Sucré',
  DRINK: 'Boisson',
  SIDE: 'Pain/Accomp.',
};

export const CATEGORY_EMOJIS: Record<Category, string> = {
  SALTY: '🧀',
  SWEET: '🍰',
  DRINK: '🥤',
  SIDE: '🥖',
};

// Schémas de validation pour les participants
export const createGuestSchema = z.object({
  firstName: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  lastName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  comment: z.string()
    .max(500, 'Le commentaire ne peut pas dépasser 500 caractères')
    .optional(),
});

export const updateGuestSchema = createGuestSchema.partial();

// Schémas de validation pour les contributions
export const createContributionSchema = z.object({
  guestId: z.number().positive('L\'identifiant du participant est requis'),
  category: z.enum(CATEGORIES, {
    error: 'Catégorie invalide',
  }),
  description: z.string()
    .min(3, 'La description doit contenir au moins 3 caractères')
    .max(200, 'La description ne peut pas dépasser 200 caractères'),
  servings: z.number()
    .min(1, 'Le nombre de parts doit être au moins 1')
    .max(50, 'Le nombre de parts ne peut pas dépasser 50'),
});

export const updateContributionSchema = createContributionSchema.partial().omit({ guestId: true });

// Types inférés
export type CreateGuestInput = z.infer<typeof createGuestSchema>;
export type UpdateGuestInput = z.infer<typeof updateGuestSchema>;
export type CreateContributionInput = z.infer<typeof createContributionSchema>;
export type UpdateContributionInput = z.infer<typeof updateContributionSchema>;
