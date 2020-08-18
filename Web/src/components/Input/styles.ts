import styled, { css } from "styled-components";

import Tooltip from "../Tooltip";

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #232129;
  border-radius: 10px;

  border: 2px solid #232129;
  color: #666360;

  ${(props) =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}

  ${(props) =>
    props.isFocused &&
    css`
      border-color: #ff9000;
      color: #ff9000;
    `}

  ${(props) =>
    props.isFilled &&
    css`
      color: #ff9000;
    `}

  padding: 16px;
  width: 100%;

  & + div {
    margin-top: 8px;
  }

  input {
    flex: 1;
    background-color: transparent;
    border: 0;
    color: #f4ede8;

    &::placeholder {
      color: #666360;
    }

    :-webkit-autofill,
    :-webkit-autofill:hover,
    :-webkit-autofill:focus,
    :-webkit-autofill:active {
      -webkit-text-fill-color: #f4ede8;
      box-shadow: 0 0 0px 1000px #232129 inset;
      -webkit-box-shadow: 0 0 0px 1000px #232129 inset;
      transition: background-color 5000s ease-in-out 0s;
    }
  }

  svg {
    margin-right: 16px;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background-color: #c53030;
    color: #f4ede8;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
