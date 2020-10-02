import React, { useCallback, useRef } from "react";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";
import { FiArrowLeft, FiUser, FiMail, FiLock } from "react-icons/fi";
import { Link, useHistory } from "react-router-dom";

import { Container, Content, AnimationContainer, Background } from "./styles";
import Button from "../../components/Button";
import Input from "../../components/Input";

import getValidationErrors from "../../utils/getValidationErrors";
import { useToast } from "../../hooks/Toast";
import api from "../../services/api";

import LogoImg from "../../assets/logo.svg";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: FormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required("Nome é obrigatório"),
          email: Yup.string()
            .required("E-mail é obrigatório")
            .email("E-mail deve ser válido"),
          password: Yup.string().min(
            6,
            "Senha deve ter pelo menos 6 caracteres"
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post("/users", data);
        addToast({
          title: "Cadastro realizado!",
          description: "Você já pode fazer seu logon",
          type: "success",
        });

        history.push("/");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        } else {
          addToast({
            title: "Erro no cadastro",
            description:
              "Ocorreu um erro ao fazer o cadastro, tente novamente.",
            type: "error",
          });
        }
      }
    },
    [history, addToast]
  );

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={LogoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>

            <Input name="name" type="text" icon={FiUser} placeholder="Nome" />
            <Input
              name="email"
              type="text"
              icon={FiMail}
              placeholder="E-mail"
            />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />

            <Button type="submit">Cadastrar</Button>
          </Form>
          <Link to="/">
            <FiArrowLeft />
            Voltar para logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
