import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  RefObject,
  useImperativeHandle,
  forwardRef,
} from "react";
import { TextInputProps, TextInput as ReactTextInput } from "react-native";
import { useField } from "@unform/core";

import { Container, TextInput, Icon } from "./styles";

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, icon, ...props },
  ref
) => {
  const { registerField, fieldName, defaultValue = "", error } = useField(name);
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });
  const inputElementRef = useRef<ReactTextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current?.focus();
    },
  }));

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: "value",
      setValue(ref: RefObject<ReactTextInput>, value) {
        inputValueRef.current.value = value;
        inputElementRef.current?.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = "";
        inputElementRef.current?.clear;
      },
    });
  }, [fieldName, registerField]);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!inputValueRef.current.value);
  }, []);

  return (
    <Container isErrored={!!error} isFocused={isFocused} isFilled={isFilled}>
      <Icon
        name={icon}
        size={20}
        color={
          isFilled || isFocused ? "#ff9000" : error ? "#c53030" : "#666360"
        }
      />
      <TextInput
        ref={inputElementRef}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        onChangeText={(value) => {
          inputValueRef.current.value = value;
        }}
        placeholderTextColor="#666360"
        {...props}
      />
    </Container>
  );
};

export default forwardRef(Input);
