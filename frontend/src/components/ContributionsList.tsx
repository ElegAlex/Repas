import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useContributions, useDeleteContribution } from '../hooks/useApi';
import { EditContributionModal } from './EditContributionModal';
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_EMOJIS, type Category, type Contribution } from '../types';

type ContributionWithGuest = Contribution & { guest: { id: number; firstName: string; lastName: string } };

export function ContributionsList() {
  const { data: response, isLoading } = useContributions();
  const deleteContribution = useDeleteContribution();
  const [activeTab, setActiveTab] = useState<Category>('SALTY');
  const [editingContribution, setEditingContribution] = useState<ContributionWithGuest | null>(null);

  const contributions = response?.data;
  const stats = response?.stats;

  const handleDelete = async (id: number, description: string) => {
    if (!confirm(`Supprimer "${description}" ?`)) return;

    try {
      await deleteContribution.mutateAsync(id);
      toast.success('Contribution supprimée');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-[12px] shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 animate-fade-in" aria-busy="true" aria-label="Chargement des contributions">
        <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/3 mb-3 sm:mb-4 animate-pulse"></div>
        <div className="flex gap-2 mb-3 sm:mb-4 overflow-hidden">
          {CATEGORIES.map((cat) => (
            <div key={cat} className="h-8 sm:h-10 w-20 sm:w-28 bg-gray-100 rounded-full animate-pulse flex-shrink-0"></div>
          ))}
        </div>
        <div className="space-y-2 sm:space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 sm:h-16 bg-gray-100 rounded-[12px] animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const totalContributions = stats?.totalContributions ?? 0;

  return (
    <>
      <section className="bg-card rounded-[12px] shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 animate-fade-in" aria-labelledby="contributions-title">
        <h2 id="contributions-title" className="text-lg sm:text-xl font-semibold text-text mb-3 sm:mb-4 flex items-center gap-2">
          <span aria-hidden="true">📊</span> Détail des contributions
          <span className="text-xs sm:text-sm font-normal text-text-muted">
            ({totalContributions} au total)
          </span>
        </h2>

        {/* Onglets */}
        <nav className="flex gap-1 mb-3 sm:mb-4 overflow-x-auto pb-2 scrollbar-hide" role="tablist" aria-label="Catégories de contributions">
          {CATEGORIES.map((cat) => {
            const count = contributions?.[cat]?.length ?? 0;
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                role="tab"
                aria-selected={activeTab === cat}
                aria-controls={`tabpanel-${cat}`}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 touch-manipulation ${
                  activeTab === cat
                    ? 'bg-secondary text-white shadow-md scale-105'
                    : 'bg-gray-100 text-text-muted hover:bg-gray-200'
                }`}
              >
                <span aria-hidden="true">{CATEGORY_EMOJIS[cat]}</span>
                <span className="text-xs sm:text-sm">{CATEGORY_LABELS[cat]}</span>
                {count > 0 && (
                  <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                    activeTab === cat ? 'bg-white/20' : 'bg-gray-200'
                  }`} aria-label={`${count} contributions`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Liste des contributions */}
        <div
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="space-y-2 sm:space-y-3"
        >
          {contributions?.[activeTab]?.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-text-muted animate-fade-in">
              <span className="text-3xl sm:text-4xl mb-2 block" aria-hidden="true">{CATEGORY_EMOJIS[activeTab]}</span>
              <p className="text-sm sm:text-base">Aucun(e) {CATEGORY_LABELS[activeTab].toLowerCase()} prévu(e)</p>
              <p className="text-xs sm:text-sm">Soyez le premier à en apporter !</p>
            </div>
          ) : (
            <ul className="space-y-2 sm:space-y-3" role="list">
              {contributions?.[activeTab]?.map((contrib, index) => (
                <li
                  key={contrib.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-[12px] hover:bg-gray-100 transition-all duration-200 group animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text truncate text-sm sm:text-base">
                      {contrib.description}
                    </p>
                    <p className="text-xs sm:text-sm text-text-muted">
                      {contrib.servings} part{contrib.servings > 1 ? 's' : ''} — {contrib.guest?.firstName} {contrib.guest?.lastName?.charAt(0)}.
                    </p>
                  </div>
                  <div className="flex gap-1 sm:gap-2 ml-2 sm:ml-4 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingContribution(contrib as ContributionWithGuest)}
                      className="p-1.5 sm:p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors touch-manipulation"
                      aria-label={`Modifier ${contrib.description}`}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(contrib.id, contrib.description)}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors touch-manipulation"
                      aria-label={`Supprimer ${contrib.description}`}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Résumé des parts par catégorie */}
        {totalContributions > 0 && (
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
            <p className="text-xs sm:text-sm text-text-muted">
              <strong className="text-text">{stats?.totalServings ?? 0}</strong> parts au total
              {stats && response?.data && (
                <span className="ml-2">
                  ({CATEGORIES.map(cat => {
                    const s = stats.byCategory[cat]?.servings ?? 0;
                    return s > 0 ? `${CATEGORY_EMOJIS[cat]} ${s}` : null;
                  }).filter(Boolean).join(' • ')})
                </span>
              )}
            </p>
          </div>
        )}
      </section>

      {/* Modal d'édition */}
      <EditContributionModal
        isOpen={editingContribution !== null}
        onClose={() => setEditingContribution(null)}
        contribution={editingContribution}
      />
    </>
  );
}
