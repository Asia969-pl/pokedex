import Header from "../shared/header/Header";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useSnackbar } from "notistack";

const RegisterFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
`;

const RegistrationForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const RegistrationInput = styled.input`
  background-color: yellow;
  border-radius: 0.5rem;
`;

const RegistrationButton = styled.button`
  border-radius: 0.5rem;
  background-color: blue;
  color: white;
  height: 2rem;
`;


const registrationSchema = z
  .object({
    name: z.string().min(3, "Imię musi mieć minimum 3 znaki"),
    email: z.string().nonempty("Email jest wymagany").email("Niepoprawny email"),
    password: z
      .string()
      .min(8, "Hasło musi mieć minimum 8 znaków")
      .regex(/[A-Z]/, "Hasło musi zawierać dużą literę")
      .regex(/[0-9]/, "Hasło musi zawierać cyfrę")
      .regex(/[!@#$%^&*]/, "Hasło musi zawierać znak specjalny"),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Hasła nie są identyczne",
    path: ["repeatPassword"],
  });


const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registrationSchema) });

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
 
      const response = await fetch(
        `http://localhost:3000/users?email=${(data.email)}`
      );
      const users = await response.json();

      if (users.length > 0) {
        enqueueSnackbar("Użytkownik o tym emailu już istnieje", {
          variant: "error",
        });
        return;
      }

   
      const postResponse = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          favourites:[],
          arena:[],
          scores:[],
        }),
      });

      if (!postResponse.ok) {
        throw new Error("Błąd podczas rejestracji");
      }

      enqueueSnackbar("Rejestracja powiodła się", { variant: "success" });
      navigate("/");
    } catch {
      enqueueSnackbar("Błąd podczas rejestracji", { variant: "error" });
      navigate("/login");
    }
  };

  return (
    <>
      <Header />
      <RegisterFormWrapper>
        <h1>Zarejestruj się</h1>
        <RegistrationForm onSubmit={handleSubmit(onSubmit)}>

          <RegistrationInput
            {...register("name")}
            type="text"
            id="name"
            placeholder="imię"
          />
          {errors.name && <p>{errors.name.message}</p>}
          <RegistrationInput
            {...register("email")}
            type="email"
            id="email"
            placeholder="email"
          />
          {errors.email && <p>{errors.email.message}</p>}

          <RegistrationInput
            {...register("password")}
            type="password"
            id="password"
            placeholder="hasło"
          />
          {errors.password && <p>{errors.password.message}</p>}

          <RegistrationInput
            {...register("repeatPassword")}
            type="password"
            id="repeatPassword"
            placeholder="powtórz hasło"
          />
          {errors.repeatPassword && <p>{errors.repeatPassword.message}</p>}

          <RegistrationButton type="submit">Zarejestruj się</RegistrationButton>
        </RegistrationForm>
      </RegisterFormWrapper>
    </>
  );
};

export default Register;
