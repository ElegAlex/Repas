import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Modal } from './Modal';
import { useCreateGuest } from '../hooks/useApi';

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RsvpModal({ isOpen, onClose }: RsvpModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [comment, setComment] = useState('');

  const createGuest = useCreateGuest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (firstName.trim().length < 2) {
      toast.error('Le prénom doit contenir au moins 2 caractères');
      return;
    }
    if (lastName.trim().length < 2) {
      toast.error('Le nom doit contenir au moins 2 caractères');
      return;
    }

    try {
      await createGuest.mutateAsync({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        comment: comment.trim() || undefined,
      });

      toast.success('Inscription confirmée !');
      setFirstName('');
      setLastName('');
      setComment('');
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de l\'inscription';
      toast.error(message);
    }
  };

  const handleClose = () => {
    setFirstName('');
    setLastName('');
    setComment('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="🎉 Je participe au repas !">
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" noValidate>
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-text mb-1">
            Prénom <span className="text-primary" aria-label="requis">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow text-base"
            placeholder="Marie"
            required
            minLength={2}
            maxLength={50}
            autoFocus
            autoComplete="given-name"
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-text mb-1">
            Nom <span className="text-primary" aria-label="requis">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow text-base"
            placeholder="Martin"
            required
            minLength={2}
            maxLength={50}
            autoComplete="family-name"
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-text mb-1">
            Commentaire <span className="text-text-muted">(allergies, régime...)</span>
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow resize-none text-base"
            placeholder="Végétarien, allergique aux fruits à coque..."
            rows={3}
            maxLength={500}
            aria-describedby="comment-hint"
          />
          <p id="comment-hint" className="sr-only">Optionnel. Indiquez vos allergies ou régime alimentaire.</p>
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
            disabled={createGuest.isPending}
            className="flex-1 px-3 sm:px-4 py-3 bg-primary hover:bg-primary-hover active:scale-[0.98] text-white rounded-[12px] font-semibold transition-all touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            aria-busy={createGuest.isPending}
          >
            {createGuest.isPending ? 'Inscription...' : "✓ Je m'inscris"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
