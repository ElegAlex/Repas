import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db, schema } from '../db/index.js';
import { createContributionSchema, updateContributionSchema, CATEGORIES, Category } from '../validation.js';

const router = Router();

// GET /api/contributions - Liste toutes les contributions groupées par catégorie
router.get('/', async (req, res) => {
  try {
    const categoryFilter = req.query.category as Category | undefined;

    let query = db.select().from(schema.contributions);

    if (categoryFilter && CATEGORIES.includes(categoryFilter)) {
      query = query.where(eq(schema.contributions.category, categoryFilter)) as typeof query;
    }

    const allContributions = await query;

    // Récupérer les infos des guests
    const contributionsWithGuests = await Promise.all(
      allContributions.map(async (contrib) => {
        const [guest] = await db
          .select({ id: schema.guests.id, firstName: schema.guests.firstName, lastName: schema.guests.lastName })
          .from(schema.guests)
          .where(eq(schema.guests.id, contrib.guestId));

        return {
          ...contrib,
          guest: guest || null,
        };
      })
    );

    // Grouper par catégorie
    const grouped: Record<Category, typeof contributionsWithGuests> = {
      SALTY: [],
      SWEET: [],
      DRINK: [],
      SIDE: [],
    };

    contributionsWithGuests.forEach((contrib) => {
      grouped[contrib.category as Category].push(contrib);
    });

    // Calculer les stats
    const stats = {
      totalContributions: contributionsWithGuests.length,
      totalServings: contributionsWithGuests.reduce((sum, c) => sum + c.servings, 0),
      byCategory: {} as Record<Category, { count: number; servings: number }>,
    };

    CATEGORIES.forEach((cat) => {
      stats.byCategory[cat] = {
        count: grouped[cat].length,
        servings: grouped[cat].reduce((sum, c) => sum + c.servings, 0),
      };
    });

    res.json({
      success: true,
      data: grouped,
      stats,
    });
  } catch (error) {
    console.error('Erreur GET /contributions:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des contributions' });
  }
});

// POST /api/contributions - Ajoute une nouvelle contribution
router.post('/', async (req, res) => {
  try {
    const validation = createContributionSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'Données invalides',
        details: validation.error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
      return;
    }

    const { guestId, category, description, servings } = validation.data;

    // Vérifier que le guest existe
    const [guest] = await db
      .select()
      .from(schema.guests)
      .where(eq(schema.guests.id, guestId));

    if (!guest) {
      res.status(404).json({
        success: false,
        error: 'Participant non trouvé',
      });
      return;
    }

    const [newContribution] = await db
      .insert(schema.contributions)
      .values({ guestId, category, description, servings })
      .returning();

    res.status(201).json({
      success: true,
      data: newContribution,
    });
  } catch (error) {
    console.error('Erreur POST /contributions:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la création de la contribution' });
  }
});

// PUT /api/contributions/:id - Modifie une contribution
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'ID invalide' });
      return;
    }

    const validation = updateContributionSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'Données invalides',
        details: validation.error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
      return;
    }

    const [updatedContribution] = await db
      .update(schema.contributions)
      .set({ ...validation.data, updatedAt: new Date().toISOString() })
      .where(eq(schema.contributions.id, id))
      .returning();

    if (!updatedContribution) {
      res.status(404).json({ success: false, error: 'Contribution non trouvée' });
      return;
    }

    res.json({
      success: true,
      data: updatedContribution,
    });
  } catch (error) {
    console.error('Erreur PUT /contributions/:id:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la modification de la contribution' });
  }
});

// DELETE /api/contributions/:id - Supprime une contribution
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'ID invalide' });
      return;
    }

    const [deleted] = await db
      .delete(schema.contributions)
      .where(eq(schema.contributions.id, id))
      .returning();

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Contribution non trouvée' });
      return;
    }

    res.json({
      success: true,
      message: 'Contribution supprimée avec succès',
    });
  } catch (error) {
    console.error('Erreur DELETE /contributions/:id:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression de la contribution' });
  }
});

export default router;
