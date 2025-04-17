import { createContext, useContext } from 'react';
import { A11yContextValue } from '../types/a11y';

// Context oluşturma
export const A11yContext = createContext<A11yContextValue | null>(null);

// useA11y hook'u
export function useA11y(): A11yContextValue {
  const context = useContext(A11yContext);
  if (!context) {
    throw new Error('useA11y hook, A11yProvider içinde kullanılmalıdır');
  }
  return context;
} 