import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { logger, initLogger } from '@shared/logger';
import App from './App';
import './index.css';
import { Config } from '@shared/config';

// Initialize logger for web resource
initLogger(Config.MODULE_NAME, 'debug_mode');

logger.debug('Starting Web UI...', 'INIT');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
