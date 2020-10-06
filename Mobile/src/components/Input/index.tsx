import React, { useState, useRef, RefObject, useCallback } from "react";
import { TextInputProps, TextInput as ReactTextInput } from "react-native";

import { Container, TextInput, Icon } from "./styles";

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

const Input: React.FC<InputProps> = ({ name, icon, ...props }) => {
  const inputRef = useRef<ReactTextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    /* setIsFilled(!!inputRef.current?.value); */
  }, []);

  return (
    <Container isErrored={true} isFocused={isFocused} isFilled={isFilled}>
      <Icon
        name={icon}
        size={20}
        color={
          isFilled || isFocused
            ? "#ff9000"
            : "error" === "error"
            ? "#c53030"
            : "#666360"
        }
      />
      <TextInput
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        ref={inputRef}
        placeholderTextColor="#666360"
        {...props}
      />
    </Container>
  );
};

export default Input;
