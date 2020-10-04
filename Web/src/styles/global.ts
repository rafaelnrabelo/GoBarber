import { createGlobalStyle } from "styled-components";
import { lighten } from "polished";

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0%;
    box-sizing: border-box;
    outline: 0;
  }

  body {
    background-color: #312E38;
    color: #FFF;
    -webkit-font-smoothing: antialiased;

    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background-color: transparent; 
    }
    ::-webkit-scrollbar-thumb {
      background-color: ${lighten(0.1, "#312E38")};
    }
    ::-webkit-scrollbar-thumb:hover {
      background-color: ${lighten(0.15, "#312E38")};
    }
  }

  body, input, button {
    font-family: "Roboto Slab", serif;
    font-size: 16px;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
  }

  button {
    cursor: pointer;
  }
`;
