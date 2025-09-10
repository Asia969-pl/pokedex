import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../../context/GlobalContext";
import { LoginContext } from "../../../context/LoginContext";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSnackbar } from "notistack";
import LeftArrowIcon from "../pokemonContainer/LeftArrowIcon";
import RightArrowIcon from "../pokemonContainer/RightArrowIcon";

const USER_URL = "http://localhost:3000/users";

const CreateFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
`;

const CreateForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
  padding:3rem;
`;

const CreateInput = styled.input`
  background-color: yellow;
  border-radius: 0.5rem;
  font-size: 1rem;
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

const ImageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const PokemonImage = styled.img`
  width: 120px;
  height: 120px;
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  border: 2px solid black;
  border-radius: 0.5rem;
`;

const createSchema = z.object({
  name: z.string().min(1, "Nazwa pokemona nie może być pusta"),
  height: z.coerce.number().min(1, "Wzrost nie może być mniejszy niż 1"),
  weight: z.coerce.number().min(1, "Waga nie może być mniejsza niż 1"),
  base_experience: z.coerce
    .number()
    .min(1, "Doświadczenie nie może być mniejsze niż 1"),
});

const CreatePokemonForm = () => {
  const { user, setUser } = useContext(LoginContext);
  const { allUserPokemons, pokemons } = useContext(GlobalContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const allCombined = [...allUserPokemons, ...pokemons];
  const usedImages = allCombined.map((p) => Number(p.id));
  const availableImages = Array.from({ length: 50 }, (_, i) => 151 + i);

  const [imageIndex, setImageIndex] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createSchema),
  });

  if (!user) return <p>Nie znaleziono użytkownika</p>;

  const prevImage = () => {
    setImageIndex((prev) =>
      prev > 0 ? prev - 1 : availableImages.length - 1
    );
  };

  const nextImage = () => {
    setImageIndex((prev) =>
      prev < availableImages.length - 1 ? prev + 1 : 0
    );
  };

  const onSubmit = async (data) => {
    // Sprawdzamy wybraną grafikę
    const selectedImageId = availableImages[imageIndex];
    if (usedImages.includes(selectedImageId)) {
      enqueueSnackbar("Ta grafika jest już użyta!", { variant: "error" });
      return;
    }
  
  
    const maxId = user.scores.length
      ? Math.max(...user.scores.map((p) => p.id))
      : 150; 
    const newPokemonId = maxId + 1;
  
    const newPokemon = {
      ...data,
      id: newPokemonId, 
      spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedImageId}.png`,
    };
  
    const updatedScores = [...user.scores, newPokemon];
    const updatedUser = { ...user, scores: updatedScores };
  
    try {
      const res = await fetch(`${USER_URL}/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
  
      if (!res.ok) throw new Error("Błąd zapisu do serwera");
  
      setUser(updatedUser);
      enqueueSnackbar(`Nowy pokemon ${newPokemon.name} został dodany`, {
        variant: "success",
      });
      navigate("/edition");
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Wystąpił błąd podczas zapisu", { variant: "error" });
    }
  };
  

  return (
    <CreateFormWrapper>
      <h1>Stwórz Nowego Pokemona</h1>
      <CreateForm onSubmit={handleSubmit(onSubmit)}>
        <CreateInput {...register("name")} placeholder="Nazwa" />
        {errors.name && <p>{errors.name.message}</p>}

        <CreateInput {...register("weight")} type="number" placeholder="Waga" />
        {errors.weight && <p>{errors.weight.message}</p>}

        <CreateInput
          {...register("height")}
          type="number"
          placeholder="Wzrost"
        />
        {errors.height && <p>{errors.height.message}</p>}

        <CreateInput
          {...register("base_experience")}
          type="number"
          placeholder="Doświadczenie"
        />
        {errors.base_experience && <p>{errors.base_experience.message}</p>}

        <ImageContainer>
          <LeftArrowIcon onClick={prevImage} />
          <PokemonImage
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${availableImages[imageIndex]}.png`}
            disabled={usedImages.includes(availableImages[imageIndex])}
          />
          <RightArrowIcon onClick={nextImage} />
        </ImageContainer>

        <SaveButton type="submit">Stwórz Pokemona</SaveButton>
      </CreateForm>
    </CreateFormWrapper>
  );
};

export default CreatePokemonForm;
