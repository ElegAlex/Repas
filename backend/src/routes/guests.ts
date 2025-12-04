import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db, schema } from '../db/index.js';
import { createGuestSchema, updateGuestSchema } from '../validation.js';

const router = Router();

// GET /api/guests - Liste tous les participants avec leurs contributions
router.get('/', async (req, res) => {
  try {
    const allGuests = await db.query.guests.findMany({
      with: {
        // Relations will be added when we set up the relations
      },
      orderBy: (guests, { asc }) => [asc(guests.lastName), asc(guests.firstName)],
    });

    // Récupérer les contributions pour chaque guest
    const guestsWithContributions = await Promise.all(
      allGuests.map(async (guest) => {
        const guestContributions = await db
          .select()
          .from(schema.contributions)
          .where(eq(schema.contributions.guestId, guest.id));

        return {
          ...guest,
          contributions: guestContributions,
        };
      })
    );

    res.json({
      success: true,
      data: guestsWithContributions,
      total: guestsWithContributions.length,
    });
  } catch (error) {
    console.error('Erreur GET /guests:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des participants' });
  }
});

// POST /api/guests - Crée un nouveau participant
router.post('/', async (req, res) => {
  try {
    const validation = createGuestSchema.safeParse(req.body);

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

    const { firstName, lastName, comment } = validation.data;

    // Vérifier si le participant existe déjà
    const existing = await db
      .select()
      .from(schema.guests)
      .where(eq(schema.guests.firstName, firstName))
      .limit(1);

    if (existing.length > 0 && existing[0].lastName === lastName) {
      res.status(409).json({
        success: false,
        error: 'Un participant avec ce nom existe déjà',
      });
      return;
    }

    const [newGuest] = await db
      .insert(schema.guests)
      .values({ firstName, lastName, comment })
      .returning();

    res.status(201).json({
      success: true,
      data: newGuest,
    });
  } catch (error) {
    console.error('Erreur POST /guests:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la création du participant' });
  }
});

// PUT /api/guests/:id - Modifie un participant
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'ID invalide' });
      return;
    }

    const validation = updateGuestSchema.safeParse(req.body);

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

    const [updatedGuest] = await db
      .update(schema.guests)
      .set({ ...validation.data, updatedAt: new Date().toISOString() })
      .where(eq(schema.guests.id, id))
      .returning();

    if (!updatedGuest) {
      res.status(404).json({ success: false, error: 'Participant non trouvé' });
      return;
    }

    res.json({
      success: true,
      data: updatedGuest,
    });
  } catch (error) {
    console.error('Erreur PUT /guests/:id:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la modification du participant' });
  }
});

// DELETE /api/guests/:id - Supprime un participant
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'ID invalide' });
      return;
    }

    const [deleted] = await db
      .delete(schema.guests)
      .where(eq(schema.guests.id, id))
      .returning();

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Participant non trouvé' });
      return;
    }

    res.json({
      success: true,
      message: 'Participant supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur DELETE /guests/:id:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression du participant' });
  }
});

export default router;
