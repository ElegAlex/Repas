import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useGuests, useDeleteGuest } from '../hooks/useApi';
import { EditGuestModal } from './EditGuestModal';
import type { Guest } from '../types';

export function GuestsList() {
  const { data: response, isLoading } = useGuests();
  const deleteGuest = useDeleteGuest();
  const [expanded, setExpanded] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const guests = response?.data ?? [];
  const total = response?.total ?? 0;

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Désinscrire ${name} ? Ses contributions seront également supprimées.`)) return;

    try {
      await deleteGuest.mutateAsync(id);
      toast.success('Participant désinscrit');
    } catch {
      toast.error('Erreur lors de la désinscription');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-[12px] shadow-lg p-4 sm:p-6 animate-fade-in" aria-busy="true" aria-label="Chargement des participants">
        <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/4 mb-3 sm:mb-4 animate-pulse"></div>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-7 sm:h-8 w-20 sm:w-24 bg-gray-100 rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const displayedGuests = expanded ? guests : guests.slice(0, 8);
  const hasMore = guests.length > 8;

  return (
    <>
      <section className="bg-card rounded-[12px] shadow-lg p-4 sm:p-6 animate-fade-in" aria-labelledby="guests-title">
        <h2 id="guests-title" className="text-lg sm:text-xl font-semibold text-text mb-3 sm:mb-4 flex items-center gap-2">
          <span aria-hidden="true">👥</span> Qui vient ?
          <span className="text-xs sm:text-sm font-normal text-text-muted">
            ({total} participant{total > 1 ? 's' : ''})
          </span>
        </h2>

        {guests.length === 0 ? (
          <p className="text-text-muted text-center py-4 text-sm sm:text-base">
            Aucun participant inscrit pour le moment
          </p>
        ) : (
          <>
            <ul className="flex flex-wrap gap-2 mb-3 sm:mb-4" role="list" aria-label="Liste des participants">
              {displayedGuests.map((guest) => (
                <li
                  key={guest.id}
                  className="group relative inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-all duration-200"
                >
                  <span className="text-text text-sm sm:text-base">
                    {guest.firstName} {guest.lastName}
                  </span>
                  {guest.comment && (
                    <span
                      className="text-amber-500 cursor-help"
                      title={guest.comment}
                      aria-label={`Allergie ou régime: ${guest.comment}`}
                    >
                      <span aria-hidden="true">⚠️</span>
                    </span>
                  )}
                  {(guest.contributions?.length ?? 0) > 0 && (
                    <span className="text-xs bg-secondary/20 text-secondary px-1.5 rounded-full" aria-label={`${guest.contributions?.length} contribution${(guest.contributions?.length ?? 0) > 1 ? 's' : ''}`}>
                      {guest.contributions?.length}
                    </span>
                  )}

                  {/* Actions au survol */}
                  <div className="absolute -top-1 -right-1 flex gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingGuest(guest)}
                      className="w-5 h-5 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-blue-600 transition-colors touch-manipulation"
                      aria-label={`Modifier ${guest.firstName} ${guest.lastName}`}
                    >
                      <span aria-hidden="true">✏️</span>
                    </button>
                    <button
                      onClick={() => handleDelete(guest.id, `${guest.firstName} ${guest.lastName}`)}
                      className="w-5 h-5 bg-primary text-white rounded-full text-xs flex items-center justify-center hover:bg-primary-hover transition-colors touch-manipulation"
                      aria-label={`Désinscrire ${guest.firstName} ${guest.lastName}`}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {hasMore && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs sm:text-sm text-secondary hover:underline transition-colors touch-manipulation"
                aria-expanded={expanded}
              >
                {expanded ? 'Voir moins' : `Voir tous (+${guests.length - 8})`}
              </button>
            )}

            {/* Liste des commentaires/allergies */}
            {guests.some(g => g.comment) && (
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                <h3 className="text-xs sm:text-sm font-medium text-text mb-2 flex items-center gap-1">
                  <span aria-hidden="true">⚠️</span> Allergies et régimes
                </h3>
                <ul className="space-y-1 text-xs sm:text-sm" role="list">
                  {guests.filter(g => g.comment).map((guest) => (
                    <li key={guest.id} className="text-text-muted">
                      <strong className="text-text">{guest.firstName}</strong>: {guest.comment}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </section>

      {/* Modal d'édition */}
      <EditGuestModal
        isOpen={editingGuest !== null}
        onClose={() => setEditingGuest(null)}
        guest={editingGuest}
      />
    </>
  );
}
