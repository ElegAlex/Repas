import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Modal } from './Modal';
import { useUpdateContribution } from '../hooks/useApi';
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_EMOJIS, type Category, type Contribution } from '../types';

interface EditContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contribution: (Contribution & { guest?: { firstName: string; lastName: string } }) | null;
}

export function EditContributionModal({ isOpen, onClose, contribution }: EditContributionModalProps) {
  const [category, setCategory] = useState<Category>('STARTER');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState(8);

  const updateContribution = useUpdateContribution();

  useEffect(() => {
    if (contribution) {
      setCategory(contribution.category);
      setDescription(contribution.description);
      setServings(contribution.servings);
    }
  }, [contribution]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contribution) return;

    if (description.trim().length < 3) {
      toast.error('La description doit contenir au moins 3 caractères');
      return;
    }

    try {
      await updateContribution.mutateAsync({
        id: contribution.id,
        data: {
          category,
          description: description.trim(),
          servings,
        },
      });

      toast.success('Contribution modifiée !');
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la modification';
      toast.error(message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="✏️ Modifier la contribution">
      <form onSubmit={handleSubmit} className="space-y-4">
        {contribution?.guest && (
          <div className="bg-gray-50 rounded-[12px] px-4 py-3 text-sm">
            <span className="text-text-muted">Contribution de </span>
            <span className="font-medium text-text">
              {contribution.guest.firstName} {contribution.guest.lastName}
            </span>
          </div>
        )}

        {/* Sélection de la catégorie */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Catégorie <span className="text-primary">*</span>
          </label>
          <div className="grid grid-cols-5 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`flex flex-col items-center p-3 rounded-[12px] border-2 transition-all ${
                  category === cat
                    ? 'border-secondary bg-secondary/10 text-secondary'
                    : 'border-gray-200 hover:border-gray-300 text-text-muted'
                }`}
              >
                <span className="text-2xl mb-1">{CATEGORY_EMOJIS[cat]}</span>
                <span className="text-xs text-center leading-tight">
                  {CATEGORY_LABELS[cat].split('/')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="editDescription" className="block text-sm font-medium text-text mb-1">
            Description <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="editDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-shadow"
            required
            minLength={3}
            maxLength={200}
          />
        </div>

        {/* Nombre de parts */}
        <div>
          <label htmlFor="editServings" className="block text-sm font-medium text-text mb-1">
            Nombre de parts <span className="text-primary">*</span>
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-[12px] hover:bg-gray-50 transition-colors text-xl"
            >
              −
            </button>
            <input
              type="number"
              id="editServings"
              value={servings}
              onChange={(e) => setServings(Math.min(50, Math.max(1, Number(e.target.value))))}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-shadow text-center text-xl font-semibold"
              min={1}
              max={50}
              required
            />
            <button
              type="button"
              onClick={() => setServings(Math.min(50, servings + 1))}
              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-[12px] hover:bg-gray-50 transition-colors text-xl"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-text-muted rounded-[12px] hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={updateContribution.isPending}
            className="flex-1 px-4 py-3 bg-secondary hover:bg-secondary-hover text-white rounded-[12px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateContribution.isPending ? 'Modification...' : '✓ Enregistrer'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
