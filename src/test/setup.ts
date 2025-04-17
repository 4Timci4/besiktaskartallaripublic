import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock the Supabase client
vi.mock('../utils/supabase', () => {
  return {
    supabase: {
      auth: {
        getSession: vi.fn().mockResolvedValue({ 
          data: { session: { user: { id: 'test-user-id' } } } 
        }),
        onAuthStateChange: vi.fn(),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation((cb: (arg: { data: unknown[]; error: null }) => void) => cb({ data: [], error: null })),
      }),
    },
    logger: {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    },
  };
});

// Setup window.matchMedia mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// IntersectionObserverCallback tipi tanımı
type IntersectionObserverCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void;

// Intersection Observer mockunu window nesnesi ile tanımlayalım
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: class IntersectionObserver {
    root = null;
    rootMargin = '';
    thresholds = [0];
    
    constructor(public callback: IntersectionObserverCallback) {}
    
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = () => [] as IntersectionObserverEntry[];
  }
}); 