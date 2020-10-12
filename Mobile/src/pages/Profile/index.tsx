import React, { useRef, useCallback, useState } from "react";
import { View, ScrollView, TextInput, StatusBar } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { Form } from "@unform/mobile";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";
import ImagePicker from "react-native-image-picker";

import { useNotification } from "../../hooks/Notification";
import { useAuth } from "../../hooks/Auth";

import getValidationErrors from "../../utils/getValidationErrors";

import api from "../../services/api";

import Input from "../../components/Input";
import Button from "../../components/Button";

import {
  Container,
  BackButton,
  LoggoutButton,
  UserAvatarButton,
  UserAvatar,
  UserAvatarPlaceholder,
  Title,
  PasswordContainer,
} from "./styles";

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const navigation = useNavigation();

  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmationInputRef = useRef<TextInput>(null);

  const [loading, setLoading] = useState(false);

  const { addNotification, error, success } = useNotification();
  const { user, signOut, updateUser } = useAuth();

  const [profileImage, setProfileImage] = useState(user.avatar_url);
  const [profileImageFile, setProfileImageFile] = useState<FormData>();

  const handleUpdateProfile = useCallback(
    async (data: ProfileFormData) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required("Nome é obrigatório"),
          email: Yup.string()
            .required("E-mail é obrigatório")
            .email("E-mail deve ser válido"),
          old_password: Yup.string().when("password", {
            is: (val) => !!val.length,
            then: Yup.string().required(
              "O Campo Senha atual é necessario para alterar a senha"
            ),
            otherwise: Yup.string(),
          }),
          password: Yup.string()
            .when("$password", {
              is: (val) => !!val.length,
              then: Yup.string().min(
                6,
                "Senha deve ter pelo menos 6 caracteres"
              ),
              otherwise: Yup.string(),
            })
            .when("$old_password", {
              is: (val) => !!val.length,
              then: Yup.string().required(
                "O Campo Nova senha é necessario para alterar a senha"
              ),
              otherwise: Yup.string(),
            }),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref("password")],
            "Confirmação da senha deve ser igual a nova senha"
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
          context: {
            password: data.password,
            old_password: data.old_password,
          },
        });

        if (profileImageFile) {
          await api.patch("/users/avatar", profileImageFile);
        }

        if (data.old_password.length === 0) {
          const response = await api.put("/profile", {
            name: data.name,
            email: data.email,
          });
          await updateUser(response.data);
        } else {
          const response = await api.put("/profile", data);
          updateUser(response.data);
        }

        addNotification({
          title: "Perfil atualizado com sucesso!",
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
            title: "Erro ao atualizar perfil",
            description: Object.values(errors).toString().replace(/,/g, ",\n"),
            type: "error",
            duration: 4000,
          });
        } else {
          if (err.response.data.message === "E-mail already in use.") {
            addNotification({
              title: "Erro ao atualizar perfil",
              description: "E-mail já está em uso.",
              type: "error",
              duration: 4000,
            });
          } else {
            addNotification({
              title: "Erro ao atualizar perfil",
              description:
                "Ocorreu um erro ao atualizar perfil, tente novamente.",
              type: "error",
              duration: 4000,
            });
          }
        }
        setLoading(false);
      }
    },
    [addNotification, navigation, updateUser, profileImageFile]
  );

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: "Selecione um avatar",
        cancelButtonTitle: "Cancelar",
        takePhotoButtonTitle: "Usar câmera",
        chooseFromLibraryButtonTitle: "Escolher da galeria",
      },
      (response) => {
        if (response.didCancel) {
          return;
        } else if (response.error) {
          addNotification({
            title: "Falha ao selecionar uma imagem",
            description:
              "Ocorreu um erro ao tentar selecionar uma imagem, tente novamente",
            type: "error",
            duration: 4000,
          });
          return;
        }

        setProfileImage(response.uri);

        const data = new FormData();
        data.append("avatar", {
          uri: response.uri,
          type: response.type,
          name: response.fileName,
        });

        setProfileImageFile(data);
      }
    );
  }, [addNotification, ImagePicker, setProfileImage, setProfileImageFile]);

  return (
    <ScrollView>
      <StatusBar
        barStyle="light-content"
        backgroundColor={error ? "#e03837" : success ? "#00b003" : "#312e38"}
      />
      <Container>
        <BackButton onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" color="#999591" size={28} />
        </BackButton>
        <UserAvatarButton onPress={handleUpdateAvatar}>
          {profileImage ? (
            <UserAvatar source={{ uri: profileImage }} />
          ) : (
            <UserAvatarPlaceholder>
              <Icon name="user" color="#ff9000" size={100} />
            </UserAvatarPlaceholder>
          )}
        </UserAvatarButton>
        <LoggoutButton onPress={() => signOut()}>
          <Icon name="power" color="#e03837" size={30} />
        </LoggoutButton>
        <View>
          <Title>Meu perfil</Title>
        </View>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleUpdateProfile}
        >
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
              oldPasswordInputRef.current?.focus();
            }}
          />

          <PasswordContainer>
            <Input
              ref={oldPasswordInputRef}
              name="old_password"
              icon="lock"
              placeholder="Senha atual"
              secureTextEntry
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordInputRef.current?.focus();
              }}
            />
            <Input
              ref={passwordInputRef}
              name="password"
              icon="lock"
              placeholder="Nova senha"
              secureTextEntry
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordConfirmationInputRef.current?.focus();
              }}
            />
            <Input
              ref={passwordConfirmationInputRef}
              name="password_confirmation"
              icon="lock"
              placeholder="Confirmar senha"
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={() => {
                formRef.current?.submitForm();
              }}
            />
          </PasswordContainer>
        </Form>
        <Button
          loading={loading}
          onPress={() => {
            formRef.current?.submitForm();
          }}
        >
          Confirmar mudanças
        </Button>
      </Container>
    </ScrollView>
  );
};

export default Profile;
