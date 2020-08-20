import React, { createContext, useCallback, useState, useContext } from "react";
import { v4 as uuid } from "uuid";

import ToastContainer from "../components/ToastContainer";

interface ToastContextData {
  addToast(Toast: Omit<Toast, "id">): void;
  removeToast(id: string): void;
}

interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "error" | "info";
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((state) => state.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ title, description, type }: Omit<Toast, "id">) => {
      const id = uuid();
      const toast = {
        id,
        title,
        description,
        type,
      };

      if (toasts.length === 6) {
        removeToast(toasts[5].id);
      }

      setToasts((state) => [toast, ...state]);
    },
    [removeToast, toasts]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={toasts} />
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
