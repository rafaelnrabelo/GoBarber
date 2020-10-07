import React, { createContext, useCallback, useState, useContext } from "react";
import {
  Notifier,
  NotifierComponents,
  NotifierWrapper,
} from "react-native-notifier";
import { StatusBar } from "react-native";

interface NotificationContextData {
  addNotification(notification: Notification): void;
}

interface Notification {
  title: string;
  description?: string;
  type: "success" | "error";
  duration?: number;
}

const NotificationContext = createContext<NotificationContextData>(
  {} as NotificationContextData
);

export const NotificationProvider: React.FC = ({ children }) => {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const addNotification = useCallback(
    ({ title, description, type, duration }: Notification) => {
      if (type === "error") {
        setError(true);
      } else {
        setSuccess(true);
      }

      Notifier.showNotification({
        title,
        description,
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: type,
        },
        duration,
        onHidden: () =>
          type === "error" ? setError(false) : setSuccess(false),
      });
    },
    [success, error, Notifier, NotifierComponents]
  );

  return (
    <NotifierWrapper>
      <StatusBar
        barStyle="light-content"
        backgroundColor={error ? "#e03837" : success ? "#00b003" : "#312e38"}
      />

      <NotificationContext.Provider value={{ addNotification }}>
        {children}
      </NotificationContext.Provider>
    </NotifierWrapper>
  );
};

export function useNotification(): NotificationContextData {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }

  return context;
}
