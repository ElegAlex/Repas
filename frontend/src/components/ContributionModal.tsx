import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Modal } from './Modal';
import { useGuests, useCreateContribution } from '../hooks/useApi';
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_EMOJIS, type Category } from '../types';

interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContributionModal({ isOpen, onClose }: ContributionModalProps) {
  const [guestId, setGuestId] = useState<number | ''>('');
  const [category, setCategory] = useState<Category | ''>('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState(8);

  const { data: guestsResponse } = useGuests();
  const createContribution = useCreateContribution();

  const guests = guestsResponse?.data ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guestId) {
      toast.error('Veuillez sélectionner votre nom');
      return;
    }
    if (!category) {
      toast.error('Veuillez choisir une catégorie');
      return;
    }
    if (description.trim().length < 3) {
      toast.error('La description doit contenir au moins 3 caractères');
      return;
    }

    try {
      await createContribution.mutateAsync({
        guestId: guestId as number,
        category,
        description: description.trim(),
        servings,
      });

      toast.success('Contribution ajoutée !');
      resetForm();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de l\'ajout';
      toast.error(message);
    }
  };

  const resetForm = () => {
    setGuestId('');
    setCategory('');
    setDescription('');
    setServings(8);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="🍽️ J'apporte quelque chose">
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" noValidate>
        {/* Sélection du participant */}
        <div>
          <label htmlFor="guest" className="block text-sm font-medium text-text mb-1">
            Qui êtes-vous ? <span className="text-primary" aria-label="requis">*</span>
          </label>
          {guests.length === 0 ? (
            <p className="text-amber-600 text-sm bg-amber-50 p-3 rounded-[12px]" role="alert">
              Vous devez d'abord vous inscrire avant d'ajouter une contribution.
            </p>
          ) : (
            <select
              id="guest"
              value={guestId}
              onChange={(e) => setGuestId(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-shadow bg-white text-base"
              required
              aria-required="true"
            >
              <option value="">Sélectionnez votre nom</option>
              {guests.map((guest) => (
                <option key={guest.id} value={guest.id}>
                  {guest.firstName} {guest.lastName}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Sélection de la catégorie */}
        <fieldset>
          <legend className="block text-sm font-medium text-text mb-2">
            Catégorie <span className="text-primary" aria-label="requis">*</span>
          </legend>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2" role="radiogroup" aria-required="true">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                role="radio"
                aria-checked={category === cat}
                className={`flex flex-col items-center p-2 sm:p-3 rounded-[12px] border-2 transition-all touch-manipulation ${
                  category === cat
                    ? 'border-secondary bg-secondary/10 text-secondary'
                    : 'border-gray-200 hover:border-gray-300 text-text-muted'
                }`}
              >
                <span className="text-xl sm:text-2xl mb-0.5 sm:mb-1" aria-hidden="true">{CATEGORY_EMOJIS[cat]}</span>
                <span className="text-[10px] sm:text-xs text-center leading-tight">
                  {CATEGORY_LABELS[cat].split('/')[0]}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text mb-1">
            Description <span className="text-primary" aria-label="requis">*</span>
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-shadow text-base"
            placeholder="Tarte aux pommes maison"
            required
            minLength={3}
            maxLength={200}
            aria-required="true"
          />
        </div>

        {/* Nombre de parts */}
        <div>
          <label htmlFor="servings" className="block text-sm font-medium text-text mb-1">
            Nombre de parts <span className="text-primary" aria-label="requis">*</span>
          </label>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-10 h-10 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 rounded-[12px] hover:bg-gray-50 transition-colors text-xl touch-manipulation"
              aria-label="Réduire le nombre de parts"
            >
              −
            </button>
            <input
              type="number"
              id="servings"
              value={servings}
              onChange={(e) => setServings(Math.min(50, Math.max(1, Number(e.target.value))))}
              className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-shadow text-center text-lg sm:text-xl font-semibold"
              min={1}
              max={50}
              required
              aria-required="true"
            />
            <button
              type="button"
              onClick={() => setServings(Math.min(50, servings + 1))}
              className="w-10 h-10 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 rounded-[12px] hover:bg-gray-50 transition-colors text-xl touch-manipulation"
              aria-label="Augmenter le nombre de parts"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-3 sm:px-4 py-3 border border-gray-300 text-text-muted rounded-[12px] hover:bg-gray-50 transition-colors touch-manipulation text-sm sm:text-base"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={createContribution.isPending || guests.length === 0}
            className="flex-1 px-3 sm:px-4 py-3 bg-secondary hover:bg-secondary-hover active:scale-[0.98] text-white rounded-[12px] font-semibold transition-all touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            aria-busy={createContribution.isPending}
          >
            {createContribution.isPending ? 'Ajout...' : '✓ Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
