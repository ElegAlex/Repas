// Types partagés avec le backend

export const CATEGORIES = ['SALTY', 'SWEET', 'DRINK', 'SIDE'] as const;
export type Category = typeof CATEGORIES[number];

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

export interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
  contributions?: Contribution[];
}

export interface Contribution {
  id: number;
  guestId: number;
  category: Category;
  description: string;
  servings: number;
  createdAt: string;
  updatedAt: string;
  guest?: Pick<Guest, 'id' | 'firstName' | 'lastName'>;
}

export interface Stats {
  guestsCount: number;
  contributionsCount: number;
  totalServings: number;
  servingsPerGuest: number;
  categoryCoverage: Record<Category, boolean>;
  byCategory: Record<Category, { count: number; servings: number }>;
  alerts: Array<{ type: 'warning' | 'info'; message: string }>;
}

// Inputs pour création/modification
export interface CreateGuestInput {
  firstName: string;
  lastName: string;
  comment?: string;
}

export interface CreateContributionInput {
  guestId: number;
  category: Category;
  description: string;
  servings: number;
}
