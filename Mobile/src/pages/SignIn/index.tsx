import React, { useCallback, useRef, useState } from "react";
import { Image, View, TextInput, StatusBar } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { Form } from "@unform/mobile";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";

import { useNotification } from "../../hooks/Notification";

import getValidationErrors from "../../utils/getValidationErrors";

import { useAuth } from "../../hooks/Auth";

import Input from "../../components/Input";
import Button from "../../components/Button";

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from "./styles";

import logoImg from "../../assets/logo.png";

interface FormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const navigation = useNavigation();

  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const [loading, setLoading] = useState(false);

  const { addNotification } = useNotification();
  const { signIn } = useAuth();

  const handleSignIn = useCallback(async (data: FormData) => {
    try {
      setLoading(true);

      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string()
          .required("O E-mail é necessário")
          .email("O E-mail deve ser válido"),
        password: Yup.string().required("A Senha é necessária"),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await signIn(data);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);

        addNotification({
          title: "Erro na autenticação",
          description: Object.values(errors).toString().replace(/,/g, ",\n"),
          type: "error",
          duration: 4000,
        });
      } else {
        addNotification({
          title: "Erro na autenticação",
          description: "E-mail ou Senha inválidos",
          type: "error",
          duration: 4000,
        });
      }
      setLoading(false);
    }
  }, []);

  return (
    <>
      <Container>
        <Image source={logoImg} />
        <View>
          <Title>Faça seu logon</Title>
        </View>
        <Form ref={formRef} onSubmit={handleSignIn}>
          <Input
            name="email"
            icon="mail"
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => {
              passwordInputRef.current?.focus();
            }}
          />
          <Input
            ref={passwordInputRef}
            name="password"
            icon="lock"
            placeholder="Senha"
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={() => {
              formRef.current?.submitForm();
            }}
          />
        </Form>
        <Button
          loading={loading}
          onPress={() => {
            formRef.current?.submitForm();
          }}
        >
          Entrar
        </Button>
        <ForgotPassword>
          <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
        </ForgotPassword>
      </Container>
      <CreateAccountButton onPress={() => navigation.navigate("SignUp")}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>Criar uma Conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  );
};

export default SignIn;
