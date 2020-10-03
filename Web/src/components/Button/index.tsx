import React, { ButtonHTMLAttributes } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { lighten } from "polished";

import { Container } from "./styles";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...props }) => {
  return (
    <Container {...props}>
      {loading ? (
        <PulseLoader
          size={12}
          color={lighten(0.1, "#312e38")}
          loading={loading}
        />
      ) : (
        children
      )}
    </Container>
  );
};

export default Button;
