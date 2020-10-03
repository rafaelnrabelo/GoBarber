import React, { useCallback, useRef, useState } from "react";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";

import { Container, Content, AnimationContainer, Background } from "./styles";
import Button from "../../components/Button";
import Input from "../../components/Input";

import { useToast } from "../../hooks/Toast";

import getValidationErrors from "../../utils/getValidationErrors";

import api from "../../services/api";

import LogoImg from "../../assets/logo.svg";

interface FormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: FormData) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required("E-mail é necessário")
            .email("E-mail deve ser válido"),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post("/password/forgot", data);

        addToast({
          title: "E-mail de recuperação de senha enviado!",
          description: "Cheque sua caixa de entrada para resetar sua senha.",
          type: "success",
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        } else {
          addToast({
            title: "Erro na recuperação de senha",
            description: "Cheque se o e-mail está correto e tente novamente.",
            type: "error",
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [addToast]
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={LogoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input
              name="email"
              type="text"
              icon={FiMail}
              placeholder="E-mail"
            />

            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>
          <Link to="/">
            <FiArrowLeft />
            Voltar para logon
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
