import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Table des participants (guests)
export const guests = sqliteTable('guests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  comment: text('comment'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  uniqueIndex('guests_name_idx').on(table.firstName, table.lastName)
]);

// Catégories de contributions
export const CATEGORIES = ['SALTY', 'SWEET', 'DRINK', 'SIDE'] as const;
export type Category = typeof CATEGORIES[number];

// Table des contributions
export const contributions = sqliteTable('contributions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  guestId: integer('guest_id').references(() => guests.id, { onDelete: 'cascade' }).notNull(),
  category: text('category', { enum: CATEGORIES }).notNull(),
  description: text('description').notNull(),
  servings: integer('servings').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Types inférés
export type Guest = typeof guests.$inferSelect;
export type NewGuest = typeof guests.$inferInsert;
export type Contribution = typeof contributions.$inferSelect;
export type NewContribution = typeof contributions.$inferInsert;
