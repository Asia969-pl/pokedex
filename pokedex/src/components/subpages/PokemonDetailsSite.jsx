import Header from "../shared/header/Header";
import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import styled from "styled-components";
import GreyHeartIcon from "../shared/pokemonContainer/GreyHeartIcon";
import SwordIcon from "../shared/pokemonContainer/SwordIcon";
import RedHeartIcon from "../shared/pokemonContainer/RedHeartIcon";
import { useSnackbar } from "notistack";

// ---------- Styled Components ----------
const PokemonDetailsWrapper = styled.div`
  position: relative;
  width: 70vw;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 2rem;
  transition: transform 0.2s, box-shadow 0.2s;
  margin: 1rem;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

const PokemonImg = styled.img`
  width: 40%;
  height: auto;
`;

const PokemonDataContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  justify-content: space-between;
`;

const PokemonDataWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
  gap: 2rem;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  top: 0rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

const ScoreWrapper = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  background-color: grey;
  color: white;
  border-radius: 0.5rem;
  font-weight: bold;
`;

const ValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Value = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 1.2rem;
  color: black;
`;

const PokemonName = styled.h1`
  margin: 0.3rem 0 0.5rem 0;
  color: black;
`;

// ---------- Component ----------
const PokemonDetailsSite = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const { isLoggedIn, user, setUser } = useContext(LoginContext);
  const [isFavourite, setIsFavourite] = useState(false);
  const [onArena, setOnArena] = useState(false);

  const API_URL = "https://pokeapi.co/api/v2/pokemon/";
  const USERS_URL = "http://localhost:3000/users";

  // ---- Fetch pokemon ----
  const showPokemon = async () => {
    try {
      let pokemonFromJSON = null;

      if (user) {
        const allUserPokemons = [
          ...(user.scores || []),
          ...(user.favourites || []),
          ...(user.arena || []),
        ];
        pokemonFromJSON = allUserPokemons.find((p) => p.id.toString() === id.toString());
      }

      if (pokemonFromJSON) {
        setPokemon({ ...pokemonFromJSON, id: pokemonFromJSON.id.toString() });
      } else {
        const response = await fetch(`${API_URL}${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        setPokemon({
          id: data.id.toString(),
          name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
          ability: data.abilities?.[0]?.ability?.name || "Unknown",
          spriteUrl: data.sprites.front_default,
          weight: data.weight,
          base_experience: data.base_experience,
          height: data.height,
        });
      }
    } catch (error) {
      console.error("Błąd podczas pobierania pokemona:", error);
    }
  };

  // ---- Check status ----
  const checkIfFavourite = () => {
    if (!user?.favourites || !pokemon) return;
    setIsFavourite(user.favourites.some((fav) => fav.id.toString() === pokemon.id.toString()));
  };

  const checkIfOnArena = () => {
    if (!user?.arena || !pokemon) return;
    setOnArena(user.arena.some((p) => p.id.toString() === pokemon.id.toString()));
  };

  // ---- Favourite actions ----
  const addToFavourites = async () => {
    if (!user || !pokemon || isFavourite) return;
    const updatedFavourites = [...(user.favourites || []), pokemon];

    try {
      const res = await fetch(`${USERS_URL}/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favourites: updatedFavourites }),
      });

      if (res.ok) {
        setIsFavourite(true);
        setUser((prev) => ({ ...prev, favourites: updatedFavourites }));
        enqueueSnackbar("Dodano do ulubionych!", { variant: "success" });
      }
    } catch (err) {
      console.error("Błąd przy dodawaniu do favourites:", err);
    }
  };

  const removeFromFavourites = async () => {
    if (!user || !pokemon) return;
    const updatedFavourites = user.favourites.filter((fav) => fav.id !== pokemon.id);

    try {
      const res = await fetch(`${USERS_URL}/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favourites: updatedFavourites }),
      });

      if (res.ok) {
        setIsFavourite(false);
        setUser((prev) => ({ ...prev, favourites: updatedFavourites }));
        enqueueSnackbar("Usunięto z ulubionych!", { variant: "success" });
      }
    } catch (err) {
      console.error("Błąd przy usuwaniu z favourites:", err);
    }
  };

  // ---- Arena ----
  const addToArena = async () => {
    if (!user || !pokemon) return;
    const currentArena = user.arena || [];

    if (currentArena.length >= 2) {
      enqueueSnackbar("Arena jest pełna! Nie można dodać więcej pokemonów.", { variant: "error" });
      return;
    }

    const updatedArena = [...currentArena, pokemon];

    try {
      const res = await fetch(`${USERS_URL}/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ arena: updatedArena }),
      });

      if (res.ok) {
        setUser((prev) => ({ ...prev, arena: updatedArena }));
        setOnArena(true);
        enqueueSnackbar("Dodano pokemona do areny!", { variant: "success" });
      }
    } catch (err) {
      console.error("Błąd podczas dodawania do areny:", err);
    }
  };

  // ---- Effects ----
  useEffect(() => {
    showPokemon();
  }, [id]);

  useEffect(() => {
    if (user && pokemon) {
      checkIfFavourite();
      checkIfOnArena();
    }
  }, [pokemon]);

  if (!pokemon) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <PokemonDetailsWrapper>
        <PokemonImg src={pokemon.spriteUrl} alt={pokemon.name} />
        <PokemonDataContainer>
          {isLoggedIn && (
            <IconContainer>
                 {!onArena && <SwordIcon onClick={addToArena} />}
                 <Value>{user.arena.length}</Value>
              {isFavourite ? (
                <RedHeartIcon onClick={removeFromFavourites} />
              ) : (
                <GreyHeartIcon onClick={addToFavourites} />
              )}
            </IconContainer>
          )}

      
          {pokemon.win !== undefined && pokemon.lose !== undefined && (
            <ScoreWrapper>
              <div>Win: {pokemon.win}</div>
              <div>Lose: {pokemon.lose}</div>
            </ScoreWrapper>
          )}

          <PokemonName>{pokemon.name}</PokemonName>
          <PokemonDataWrapper>
            <div>
              <ValueContainer>
                <Value>{pokemon.height}</Value>
                <Value>Height</Value>
              </ValueContainer>
              <ValueContainer>
                <Value>{pokemon.base_experience}</Value>
                <Value>Base Experience</Value>
              </ValueContainer>
            </div>
            <div>
              <ValueContainer>
                <Value>{pokemon.ability}</Value>
                <Value>Ability</Value>
              </ValueContainer>
              <ValueContainer>
                <Value>{pokemon.weight}</Value>
                <Value>Weight</Value>
              </ValueContainer>
            </div>
          </PokemonDataWrapper>
        </PokemonDataContainer>
      </PokemonDetailsWrapper>
    </>
  );
};

export default PokemonDetailsSite;
