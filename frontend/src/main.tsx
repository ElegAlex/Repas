import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 5000, // Polling toutes les 5 secondes pour le temps réel
      staleTime: 2000,
      retry: 2,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1F2937',
            color: '#fff',
            borderRadius: '12px',
          },
          success: {
            iconTheme: { primary: '#15803D', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#B91C1C', secondary: '#fff' },
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
)
