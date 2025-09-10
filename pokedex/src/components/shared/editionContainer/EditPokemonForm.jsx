import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "../../../context/GlobalContext";
import { LoginContext } from "../../../context/LoginContext";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSnackbar } from "notistack";

const USER_URL = "http://localhost:3000/users";

const EditFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding:2rem

`;

const EditInput = styled.input`
  background-color: yellow;
  border-radius: 0.5rem;
`;

const SaveButton = styled.button`
  background-color: green;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
`;

const editSchema = z.object({
  height: z.coerce.number().min(1, "Wzrost nie może być mniejszy od 1"),
  weight: z.coerce.number().min(1, "Waga nie może być mniejsza od 1"),
  base_experience: z.coerce.number().min(
    1,
    "Doświadczenie nie może być mniejsze od 1"
  ),
});

const EditPokemonForm = () => {
  const { user, setUser } = useContext(LoginContext);
  const { allUserPokemons, pokemons } = useContext(GlobalContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const allCombined = [...allUserPokemons, ...pokemons];
  const pokemon = allCombined.find((p) => String(p.id) === id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editSchema),
  });

  if (!pokemon || !user)
    return <p>Nie znaleziono pokemona lub użytkownika</p>;

  const onSubmit = async (formData) => {
    try {
      const updatedPokemon = { ...pokemon, ...formData };

      const updatedScores = [...user.scores];
      const index = updatedScores.findIndex(
        (p) => String(p.id) === String(id)
      );

      if (index !== -1) {
        updatedScores[index] = updatedPokemon;
      } else {
        updatedScores.push(updatedPokemon);
      }

      const updatedUser = { ...user, scores: updatedScores };

      const res = await fetch(`${USER_URL}/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) throw new Error("Błąd zapisu do serwera");

      setUser(updatedUser);
      enqueueSnackbar("Zmieniono dane Pokemona", { variant: "success" });
      navigate("/edition");
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        "Wystąpił błąd podczas zapisu. Spróbuj ponownie.",
        { variant: "error" }
      );
    }
  };

  return (
    <EditFormWrapper>
      <h1>{pokemon.name}</h1>
      <EditForm onSubmit={handleSubmit(onSubmit)}>
        <EditInput {...register("height")} type="number" placeholder="Wzrost" />
        {errors.height && <p>{errors.height.message}</p>}

        <EditInput
          {...register("base_experience")}
          type="number"
          placeholder="Doświadczenie"
        />
        {errors.base_experience && <p>{errors.base_experience.message}</p>}

        <EditInput {...register("weight")} type="number" placeholder="Waga" />
        {errors.weight && <p>{errors.weight.message}</p>}

        <SaveButton type="submit">Zmień atrybuty</SaveButton>
      </EditForm>
    </EditFormWrapper>
  );
};

export default EditPokemonForm;
