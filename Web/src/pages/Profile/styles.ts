import styled from "styled-components";
import { shade } from "polished";

export const Container = styled.div`
  header {
    width: 100%;
    height: 102px;
    background-color: #28262e;

    display: flex;
    align-items: center;

    > div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;

      svg {
        color: #999591;
        width: 24px;
        height: 24px;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: -71px 0 auto;

  form {
    margin: 10px 0 0 0;
    width: 340px;
    text-align: center;
    display: flex;
    flex-direction: column;

    h1 {
      margin-bottom: 16px;
      font-size: 20px;
      text-align: left;
    }
  }
`;

export const AvatarInput = styled.div`
  position: relative;
  margin-bottom: 10px;
  align-self: center;

  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }

  label {
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    background-color: #ff9000;
    border: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: background-color 0.2s;

    input {
      display: none;
    }

    svg {
      width: 18px;
      height: 18px;
      color: #312e38;
    }

    :hover {
      background-color: ${shade(0.2, "#ff9000")};
    }
  }
`;

export const PasswordContainer = styled.div`
  margin-top: 24px !important;
`;
