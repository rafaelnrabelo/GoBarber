import React, { useRef, useCallback, useState } from "react";
import { Image, View, ScrollView, TextInput, StatusBar } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { Form } from "@unform/mobile";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";

import { useNotification } from "../../hooks/Notification";

import getValidationErrors from "../../utils/getValidationErrors";

import api from "../../services/api";

import Input from "../../components/Input";
import Button from "../../components/Button";

import {
  Container,
  Title,
  BackToSignInButton,
  BackToSignInButtonText,
} from "./styles";

import logoImg from "../../assets/logo.png";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const navigation = useNavigation();

  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const [loading, setLoading] = useState(false);

  const { addNotification } = useNotification();

  const handleSignUp = useCallback(
    async (data: FormData) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required("O Nome é obrigatório"),
          email: Yup.string()
            .required(" O E-mail é obrigatório")
            .email("O E-mail deve ser válido"),
          password: Yup.string().min(
            6,
            "A Senha deve ter pelo menos 6 caracteres"
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post("/users", data);

        addNotification({
          title: "Cadastro realizado!",
          description: "Você já pode fazer seu logon.",
          type: "success",
          duration: 3000,
        });

        setLoading(false);
        navigation.goBack();
      } catch (err) {
        console.log(err.message);
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          addNotification({
            title: "Erro no cadastro",
            description: Object.values(errors).toString().replace(/,/g, ",\n"),
            type: "error",
            duration: 4000,
          });
        } else {
          addNotification({
            title: "Erro no cadastro",
            description:
              "Ocorreu um erro ao fazer o cadastro, esse email pode já estar em uso, tente novamente.",
            type: "error",
            duration: 4000,
          });
        }
        setLoading(false);
      }
    },
    [addNotification, navigation]
  );

  return (
    <>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Container>
          <Image source={logoImg} />
          <View>
            <Title>Crie sua conta</Title>
          </View>
          <Form ref={formRef} onSubmit={handleSignUp}>
            <Input
              name="name"
              icon="user"
              placeholder="Nome"
              returnKeyType="next"
              onSubmitEditing={() => {
                emailInputRef.current?.focus();
              }}
            />
            <Input
              ref={emailInputRef}
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
            Cadastrar
          </Button>
        </Container>
      </ScrollView>
      <BackToSignInButton onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#f4ede8" />
        <BackToSignInButtonText>Voltar para logon</BackToSignInButtonText>
      </BackToSignInButton>
    </>
  );
};

export default SignUp;
