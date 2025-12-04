import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Modal } from './Modal';
import { useUpdateGuest } from '../hooks/useApi';
import type { Guest } from '../types';

interface EditGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest | null;
}

export function EditGuestModal({ isOpen, onClose, guest }: EditGuestModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [comment, setComment] = useState('');

  const updateGuest = useUpdateGuest();

  useEffect(() => {
    if (guest) {
      setFirstName(guest.firstName);
      setLastName(guest.lastName);
      setComment(guest.comment ?? '');
    }
  }, [guest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guest) return;

    if (firstName.trim().length < 2) {
      toast.error('Le prénom doit contenir au moins 2 caractères');
      return;
    }
    if (lastName.trim().length < 2) {
      toast.error('Le nom doit contenir au moins 2 caractères');
      return;
    }

    try {
      await updateGuest.mutateAsync({
        id: guest.id,
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          comment: comment.trim() || undefined,
        },
      });

      toast.success('Participant modifié !');
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la modification';
      toast.error(message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="✏️ Modifier le participant">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="editFirstName" className="block text-sm font-medium text-text mb-1">
            Prénom <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="editFirstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
            required
            minLength={2}
            maxLength={50}
          />
        </div>

        <div>
          <label htmlFor="editLastName" className="block text-sm font-medium text-text mb-1">
            Nom <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="editLastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
            required
            minLength={2}
            maxLength={50}
          />
        </div>

        <div>
          <label htmlFor="editComment" className="block text-sm font-medium text-text mb-1">
            Commentaire <span className="text-text-muted">(allergies, régime...)</span>
          </label>
          <textarea
            id="editComment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow resize-none"
            rows={3}
            maxLength={500}
          />
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
            disabled={updateGuest.isPending}
            className="flex-1 px-4 py-3 bg-primary hover:bg-primary-hover text-white rounded-[12px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateGuest.isPending ? 'Modification...' : '✓ Enregistrer'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
