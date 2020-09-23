import React, { useCallback, useRef } from "react";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";
import { FiArrowLeft, FiUser, FiMail, FiLock } from "react-icons/fi";

import { Container, Content, Background } from "./styles";
import Button from "../../components/Button";
import Input from "../../components/Input";

import getValidationErrors from "../../utils/getValidationErrors";

import LogoImg from "../../assets/logo.svg";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(async (data: FormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required("Nome é obrigatório"),
        email: Yup.string()
          .required("E-mail é obrigatório")
          .email("E-mail deve ser válido"),
        password: Yup.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
      });

      await schema.validate(data, {
        abortEarly: false,
      });
    } catch (err) {
      const errors = getValidationErrors(err);
      formRef.current?.setErrors(errors);
    }
  }, []);

  return (
    <Container>
      <Background />
      <Content>
        <img src={LogoImg} alt="GoBarber" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu cadastro</h1>

          <Input name="name" type="text" icon={FiUser} placeholder="Nome" />
          <Input name="email" type="text" icon={FiMail} placeholder="E-mail" />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Senha"
          />

          <Button type="submit">Cadastrar</Button>
        </Form>
        <a href="/">
          <FiArrowLeft />
          Voltar para logon
        </a>
      </Content>
    </Container>
  );
};

export default SignUp;
