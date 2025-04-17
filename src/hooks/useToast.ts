import { useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning';

interface Toast {
  message: string;
  type: ToastType;
  id: number;
}

export const useToast = () => {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: ToastType) => {
    const id = Date.now();
    setToast({ message, type, id });
    
    // 5 saniye sonra toast'u otomatik kapat
    setTimeout(() => {
      hideToast(id);
    }, 5000);
  };

  const hideToast = (id?: number) => {
    setToast((prev) => {
      if (!id || (prev && prev.id === id)) {
        return null;
      }
      return prev;
    });
  };

  return { toast, showToast, hideToast };
};