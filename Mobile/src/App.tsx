import "react-native-gesture-handler";

import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import HookProviders from "./hooks";

import Routes from "./routes";

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <HookProviders>
        <Routes />
      </HookProviders>
    </NavigationContainer>
  );
};

export default App;
