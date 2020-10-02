import React from "react";
import { BrowserRouter } from "react-router-dom";

import GlobalStyle from "./styles/global";

import HooksProvider from "./hooks";

import Routes from "./routes";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <HooksProvider>
        <Routes />
      </HooksProvider>

      <GlobalStyle />
    </BrowserRouter>
  );
};

export default App;
