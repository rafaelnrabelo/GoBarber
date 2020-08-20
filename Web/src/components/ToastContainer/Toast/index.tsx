import React, { useCallback, useEffect } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from "react-icons/fi";

import { useToast } from "../../../hooks/Toast";

import { Container } from "./styles";

interface ToastProps {
  toast: ToastData;
  style: object;
}

interface ToastData {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "error" | "info";
}

const icons = {
  info: <FiInfo size={20} />,
  success: <FiCheckCircle size={20} />,
  error: <FiAlertCircle size={20} />,
};

const Toast: React.FC<ToastProps> = ({ toast, style }) => {
  const { removeToast } = useToast();

  const handleRemoveToast = useCallback(() => {
    removeToast(toast.id);
  }, [removeToast, toast]);

  useEffect(() => {
    const timer = setTimeout(handleRemoveToast, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [handleRemoveToast]);

  return (
    <Container
      type={toast.type}
      noDescription={!toast.description}
      style={style}
    >
      {icons[toast.type || "info"]}
      <div>
        <strong>{toast.title}</strong>
        {toast.description && <p>{toast.description}</p>}
      </div>
      <button onClick={handleRemoveToast} type="button">
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
