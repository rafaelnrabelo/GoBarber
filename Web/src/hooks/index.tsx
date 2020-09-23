import React from "react";

import { AuthProvider } from "./Auth";
import { ToastProvider } from "./Toast";

const HooksProvider: React.FC = ({ children }) => {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
};

export default HooksProvider;
