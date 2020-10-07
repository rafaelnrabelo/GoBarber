import React from "react";
import { ActivityIndicator, View } from "react-native";

import AuthRoutes from "./auth.routes";
import AppRoutes from "./app.routes";

import { useAuth } from "../hooks/Auth";

const Routes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#312e38",
        }}
      >
        <ActivityIndicator size="large" color="#ff9000" />
      </View>
    );
  }

  return user ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
