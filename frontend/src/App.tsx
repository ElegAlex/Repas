import { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ContributionsList } from './components/ContributionsList';
import { GuestsList } from './components/GuestsList';
import { RsvpModal } from './components/RsvpModal';
import { ContributionModal } from './components/ContributionModal';

function App() {
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isContributionOpen, setIsContributionOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
        Aller au contenu principal
      </a>

      <Header />

      <main id="main-content" className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl flex-1" role="main">
        <Dashboard
          onOpenRsvp={() => setIsRsvpOpen(true)}
          onOpenContribution={() => setIsContributionOpen(true)}
        />

        <ContributionsList />

        <GuestsList />
      </main>

      <footer className="text-center py-4 sm:py-6 text-text-muted text-xs sm:text-sm border-t border-gray-200 bg-white/50" role="contentinfo">
        <p>Équipe Informatique DRSM Île-de-France</p>
        <p className="text-xs mt-1 opacity-75">Application de gestion du repas d'équipe</p>
      </footer>

      {/* Modales */}
      <RsvpModal isOpen={isRsvpOpen} onClose={() => setIsRsvpOpen(false)} />
      <ContributionModal isOpen={isContributionOpen} onClose={() => setIsContributionOpen(false)} />
    </div>
  );
}

export default App;
