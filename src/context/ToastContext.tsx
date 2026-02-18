import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { CheckIcon, XIcon } from '../components/icons';

interface ToastContextValue {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastMessage {
  id: number;
  variant: 'danger' | 'success';
  message: string;
}

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showError = useCallback((message: string) => {
    setToasts((prev) => [...prev, { id: nextId++, variant: 'danger', message }]);
  }, []);

  const showSuccess = useCallback((message: string) => {
    setToasts((prev) => [...prev, { id: nextId++, variant: 'success', message }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showError, showSuccess }}>
      {children}
      <ToastContainer position="top-end" className="p-3 toast-container-fixed">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            bg={t.variant}
            autohide
            delay={5000}
            onClose={() => remove(t.id)}
            className="toast-animated"
          >
            <Toast.Body className="text-white d-flex align-items-center gap-2">
              {t.variant === 'success' ? <CheckIcon /> : <XIcon />}
              <span>{t.message}</span>
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
