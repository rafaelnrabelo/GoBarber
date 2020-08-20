import React from "react";

import GlobalStyle from "./styles/global";

import HooksProvider from "./hooks";

import SignIn from "./pages/SignIn";

const App: React.FC = () => {
  return (
    <>
      <HooksProvider>
        <SignIn />
      </HooksProvider>
      <GlobalStyle />
    </>
  );
};

export default App;
