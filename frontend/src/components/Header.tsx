export function Header() {
  return (
    <header
      className="bg-gradient-to-r from-primary to-secondary py-6 sm:py-8 text-white text-center shadow-lg relative overflow-hidden"
      role="banner"
    >
      {/* Décoration festive - masquée sur mobile pour performance */}
      <div className="absolute inset-0 opacity-10 hidden sm:block" aria-hidden="true">
        <div className="absolute top-2 left-10 text-6xl">🎄</div>
        <div className="absolute top-4 right-16 text-5xl">✨</div>
        <div className="absolute bottom-2 left-1/4 text-4xl">🎁</div>
        <div className="absolute bottom-4 right-1/3 text-5xl">⭐</div>
      </div>

      <div className="relative z-10 px-4">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2">
          <span aria-hidden="true">🎄 </span>
          Repas d'Équipe DRSM IDF
          <span aria-hidden="true"> 🎄</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl opacity-90">
          Fin d'Année 2024
        </p>
        <p className="text-xs sm:text-sm mt-2 opacity-75 max-w-md mx-auto">
          Le dernier repas avant la TAM - Célébrons ensemble !
        </p>
      </div>
    </header>
  );
}
