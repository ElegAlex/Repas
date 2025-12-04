import { useEffect, useRef, type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="bg-card rounded-t-[16px] sm:rounded-[12px] shadow-2xl w-full sm:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="sticky top-0 bg-card border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h2 id="modal-title" className="text-lg sm:text-xl font-semibold text-text">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text p-1.5 sm:p-1 rounded-full hover:bg-gray-100 transition-colors touch-manipulation"
            aria-label="Fermer la fenêtre"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
