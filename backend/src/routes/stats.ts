import { Router } from 'express';
import { db, schema } from '../db/index.js';
import { CATEGORIES, Category } from '../validation.js';

const router = Router();

// GET /api/stats - Récupère les statistiques globales
router.get('/', async (req, res) => {
  try {
    const allGuests = await db.select().from(schema.guests);
    const allContributions = await db.select().from(schema.contributions);

    const guestsCount = allGuests.length;
    const contributionsCount = allContributions.length;
    const totalServings = allContributions.reduce((sum, c) => sum + c.servings, 0);
    const servingsPerGuest = guestsCount > 0 ? Math.round((totalServings / guestsCount) * 10) / 10 : 0;

    // Vérifier la couverture par catégorie
    const categoryCoverage: Record<Category, boolean> = {
      SALTY: false,
      SWEET: false,
      DRINK: false,
      SIDE: false,
    };

    const byCategory: Record<Category, { count: number; servings: number }> = {
      SALTY: { count: 0, servings: 0 },
      SWEET: { count: 0, servings: 0 },
      DRINK: { count: 0, servings: 0 },
      SIDE: { count: 0, servings: 0 },
    };

    allContributions.forEach((contrib) => {
      const cat = contrib.category as Category;
      categoryCoverage[cat] = true;
      byCategory[cat].count++;
      byCategory[cat].servings += contrib.servings;
    });

    // Générer les alertes
    const alerts: Array<{ type: 'warning' | 'info'; message: string }> = [];

    const categoryLabels: Record<Category, string> = {
      SALTY: 'salé',
      SWEET: 'sucré',
      DRINK: 'boisson',
      SIDE: 'pain/accompagnement',
    };

    CATEGORIES.forEach((cat) => {
      if (!categoryCoverage[cat]) {
        alerts.push({
          type: 'warning',
          message: `Aucun(e) ${categoryLabels[cat]} prévu(e)`,
        });
      }
    });

    if (guestsCount > 0 && servingsPerGuest < 2) {
      alerts.push({
        type: 'warning',
        message: `Seulement ${servingsPerGuest} parts par personne - pensez à ajouter des contributions !`,
      });
    }

    if (guestsCount >= 15 && contributionsCount === 0) {
      alerts.push({
        type: 'info',
        message: 'Beaucoup de participants mais aucune contribution déclarée',
      });
    }

    res.json({
      success: true,
      data: {
        guestsCount,
        contributionsCount,
        totalServings,
        servingsPerGuest,
        categoryCoverage,
        byCategory,
        alerts,
      },
    });
  } catch (error) {
    console.error('Erreur GET /stats:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des statistiques' });
  }
});

export default router;
