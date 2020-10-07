import React from "react";
import { ActivityIndicator } from "react-native";
import { RectButtonProperties } from "react-native-gesture-handler";

import { Container, ButtonText } from "./styles";

interface ButtonProps extends RectButtonProperties {
  children: string;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  ...props
}) => {
  return (
    <Container {...props}>
      {loading ? (
        <ActivityIndicator color="#312e38" size="large" />
      ) : (
        <ButtonText>{children}</ButtonText>
      )}
    </Container>
  );
};

export default Button;
