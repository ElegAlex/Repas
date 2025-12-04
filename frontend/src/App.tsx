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

      {/* Modales */}
      <RsvpModal isOpen={isRsvpOpen} onClose={() => setIsRsvpOpen(false)} />
      <ContributionModal isOpen={isContributionOpen} onClose={() => setIsContributionOpen(false)} />
    </div>
  );
}

export default App;
