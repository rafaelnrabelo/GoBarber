import React, { useCallback, useRef, useState } from "react";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";
import { FiLock } from "react-icons/fi";
import { useHistory, useLocation } from "react-router-dom";

import { Container, Content, AnimationContainer, Background } from "./styles";
import Button from "../../components/Button";
import Input from "../../components/Input";

import { useToast } from "../../hooks/Toast";

import getValidationErrors from "../../utils/getValidationErrors";

import api from "../../services/api";

import LogoImg from "../../assets/logo.svg";

interface FormData {
  password: string;
  password_confirmation: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: FormData) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string()
            .required("Senha é necessária")
            .min(6, "Senha deve ter pelo menos 6 caracteres"),
          password_confirmation: Yup.string()
            .required("Confirmação da senha é necessária")
            .oneOf(
              [Yup.ref("password")],
              "Confirmação da senha deve ser igual a nova senha"
            ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const params = new URLSearchParams(location.search);

        const token = params.get("token");

        await api.post("/password/reset", {
          ...data,
          token,
        });

        addToast({
          title: "A alteração da senha foi realizada!",
          description: "Faça o login com sua nova senha.",
          type: "success",
        });
        history.push("/");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        } else {
          addToast({
            title: "Erro ao resetar a senha",
            description:
              "Sua requisição pode ter expirado, caso não seja o caso tente novamente",
            type: "error",
          });
        }
        setLoading(false);
      }
    },
    [addToast, history, location]
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={LogoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>

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
              placeholder="Confirmação da senha"
            />

            <Button loading={loading} type="submit">
              Alterar senha
            </Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
