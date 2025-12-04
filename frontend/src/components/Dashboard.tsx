import { useStats } from '../hooks/useApi';
import { CATEGORY_LABELS, CATEGORY_EMOJIS, CATEGORIES } from '../types';

interface DashboardProps {
  onOpenRsvp: () => void;
  onOpenContribution: () => void;
}

export function Dashboard({ onOpenRsvp, onOpenContribution }: DashboardProps) {
  const { data: statsResponse, isLoading } = useStats();
  const stats = statsResponse?.data;

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-card rounded-[12px] shadow-lg p-4 sm:p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-card rounded-[12px] shadow-lg p-4 sm:p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Card Inscription */}
      <article className="bg-card rounded-[12px] shadow-lg p-4 sm:p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-text flex items-center gap-2">
            <span aria-hidden="true">📋</span> Inscription
          </h2>
          <span className="text-2xl sm:text-3xl font-bold text-primary" aria-label={`${stats?.guestsCount ?? 0} participants`}>
            {stats?.guestsCount ?? 0}
          </span>
        </div>
        <p className="text-text-muted mb-3 sm:mb-4 text-sm sm:text-base">
          participant{(stats?.guestsCount ?? 0) > 1 ? 's' : ''} confirmé{(stats?.guestsCount ?? 0) > 1 ? 's' : ''}
        </p>
        <button
          onClick={onOpenRsvp}
          className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-semibold py-3 px-6 rounded-[12px] transition-all touch-manipulation"
          aria-label="S'inscrire au repas"
        >
          Je m'inscris !
        </button>
      </article>

      {/* Card Contributions */}
      <article className="bg-card rounded-[12px] shadow-lg p-4 sm:p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-text flex items-center gap-2">
            <span aria-hidden="true">🍽️</span> Contributions
          </h2>
          <span className="text-2xl sm:text-3xl font-bold text-secondary" aria-label={`${stats?.totalServings ?? 0} parts prévues`}>
            {stats?.totalServings ?? 0}
          </span>
        </div>
        <p className="text-text-muted mb-2 text-sm sm:text-base">parts prévues</p>

        {/* Barres de progression par catégorie */}
        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4" role="list" aria-label="Répartition par catégorie">
          {CATEGORIES.map((cat) => {
            const catStats = stats?.byCategory[cat];
            const count = catStats?.count ?? 0;
            const maxCount = 5;
            const percentage = Math.min((count / maxCount) * 100, 100);

            return (
              <div key={cat} className="flex items-center gap-2 text-xs sm:text-sm" role="listitem">
                <span className="w-5 sm:w-6" aria-hidden="true">{CATEGORY_EMOJIS[cat]}</span>
                <span className="w-16 sm:w-24 text-text-muted truncate">{CATEGORY_LABELS[cat]}</span>
                <div
                  className="flex-1 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={count}
                  aria-valuemin={0}
                  aria-valuemax={maxCount}
                  aria-label={`${CATEGORY_LABELS[cat]}: ${count} contributions`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      count > 0 ? 'bg-secondary' : 'bg-gray-300'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-6 sm:w-8 text-right text-text-muted">{count}</span>
              </div>
            );
          })}
        </div>

        <button
          onClick={onOpenContribution}
          className="w-full bg-secondary hover:bg-secondary-hover active:scale-[0.98] text-white font-semibold py-3 px-6 rounded-[12px] transition-all touch-manipulation"
          aria-label="Ajouter une contribution"
        >
          J'apporte quelque chose
        </button>
      </article>

      {/* Alertes */}
      {stats?.alerts && stats.alerts.length > 0 && (
        <aside className="sm:col-span-2 animate-fade-in" role="alert" aria-live="polite">
          <div className="bg-amber-50 border border-amber-200 rounded-[12px] p-3 sm:p-4">
            <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
              <span aria-hidden="true">⚠️</span> Attention
            </h3>
            <ul className="space-y-1">
              {stats.alerts.map((alert, index) => (
                <li key={index} className="text-amber-700 text-xs sm:text-sm">
                  {alert.message}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
}
