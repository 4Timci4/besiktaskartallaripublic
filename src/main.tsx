import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { DataProvider } from './contexts/DataProvider';
import A11yProvider from './components/A11yProvider';
import './assets/a11y.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <A11yProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </A11yProvider>
  </StrictMode>
);