import Header from "../shared/header/Header";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useSnackbar } from "notistack";
import { useContext } from "react";
import { LoginContext } from "../../context/LoginContext";

const LoginFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const LoginInput = styled.input`
  background-color: yellow;
  border-radius: 0.5rem;
`;

const LoginButton = styled.button`
  border-radius: 0.5rem;
  background-color: blue;
  color: white;
  height: 2rem;
`;

const loginSchema = z.object({
  email: z.email("Niepoprawny email"),
  password: z.string().min(1, "Wprowadź hasło"),
});

const Login = () => {
  const { login } = useContext(LoginContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        `http://localhost:3000/users?email=${data.email}`
      );
      const users = await response.json();
      const user = users[0];
      if (!user || user.password !== data.password) {
        enqueueSnackbar("Niepoprawny email lub hasło", { variant: "error" });
        return;
      }
     login(user)
      enqueueSnackbar("Zalogowano pomyślnie", { variant: "success" });
      navigate("/");
    } catch {
      enqueueSnackbar("Błąd logowania", { variant: "error" });
    }
  };

  return (
    <>
      <Header />
      <LoginFormWrapper>
        <h1>Login</h1>
        <LoginForm onSubmit={handleSubmit(onSubmit)}>
          <LoginInput
            {...register("email")}
            type="text"
            id="email"
            placeholder="email"
          />
          {errors.email && <p>{errors.email.message}</p>}

          <LoginInput
            {...register("password")}
            type="password"
            id="password"
            placeholder="password"
          />
          {errors.password && <p>{errors.password.message}</p>}

          <LoginButton type="submit">Zaloguj się</LoginButton>
        </LoginForm>
      </LoginFormWrapper>
    </>
  );
};

export default Login;
