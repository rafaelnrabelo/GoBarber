import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";
import { FiArrowLeft, FiUser, FiMail, FiLock, FiCamera } from "react-icons/fi";
import { Link, useHistory } from "react-router-dom";

import { Container, Content, PasswordContainer, AvatarInput } from "./styles";
import Button from "../../components/Button";
import Input from "../../components/Input";

import getValidationErrors from "../../utils/getValidationErrors";
import { useToast } from "../../hooks/Toast";
import api from "../../services/api";
import { useAuth } from "../../hooks/Auth";

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user.avatar_url);
  const [profileImageFile, setProfileImageFile] = useState<FormData>();

  const handleSubmit = useCallback(
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
              "Campo necessario para alterar a senha"
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
                "Campo necessario para alterar a senha"
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
          updateUser(response.data);
        } else {
          const response = await api.put("/profile", data);
          updateUser(response.data);
        }

        addToast({
          title: "Perfil atualizado com sucesso!",
          type: "success",
        });

        history.push("/dashboard");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        } else {
          if (err.response.data.message === "E-mail already in use.") {
            addToast({
              title: "Erro ao atualizar perfil",
              description: "E-mail já está em uso.",
              type: "error",
            });
          } else {
            addToast({
              title: "Erro ao atualizar perfil",
              description:
                "Ocorreu um erro ao tentar atualizar o perfil, tente novamente.",
              type: "error",
            });
          }
        }
        setLoading(false);
      }
    },
    [history, addToast, profileImageFile, updateUser]
  );

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const data = new FormData();

      setProfileImage(URL.createObjectURL(e.target.files[0]));

      data.append("avatar", e.target.files[0]);
      setProfileImageFile(data);
    }
  }, []);

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={profileImage} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Meu Perfil</h1>

          <Input name="name" type="text" icon={FiUser} placeholder="Nome" />
          <Input name="email" type="text" icon={FiMail} placeholder="E-mail" />

          <PasswordContainer>
            <Input
              name="old_password"
              icon={FiLock}
              type="password"
              placeholder="Senha atual"
            />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />

            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmar senha"
            />
          </PasswordContainer>

          <Button loading={loading} type="submit">
            Confirmar alterações
          </Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
