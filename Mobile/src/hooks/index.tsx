import React from "react";

import { NotificationProvider } from "./Notification";
import { AuthProvider } from "./Auth";

const HooksProvider: React.FC = ({ children }) => {
  return (
    <AuthProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </AuthProvider>
  );
};

export default HooksProvider;
