import { createApp } from './app.js';
import { initializeDatabase } from './db/index.js';

const PORT = process.env.PORT || 3001;

// Initialize database and start server
async function start() {
  await initializeDatabase();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  });
}

start().catch(console.error);
