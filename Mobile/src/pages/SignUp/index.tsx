import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  View,
  ScrollView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

import Input from "../../components/Input";
import Button from "../../components/Button";

import {
  Container,
  Title,
  BackToSignInButton,
  BackToSignInButtonText,
} from "./styles";

import logoImg from "../../assets/logo.png";

const SignUp: React.FC = () => {
  const navigation = useNavigation();

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
          <Input name="name" icon="user" placeholder="Nome" />
          <Input
            name="email"
            icon="mail"
            placeholder="E-mail"
            keyboardType="email-address"
          />
          <Input
            name="password"
            icon="lock"
            placeholder="Senha"
            secureTextEntry
          />
          <Button>Cadastrar</Button>
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
