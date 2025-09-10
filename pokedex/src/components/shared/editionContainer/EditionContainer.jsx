import { useContext } from "react";
import { GlobalContext } from "../../../context/GlobalContext";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PokemonLiDetailed from "./PokemonLiDetailed";

const CreateButton = styled.button`
  color: white;
  width: 20%;
  height: 50px;
  border: none;
  border-radius: 0.5rem;
  font-size: 20px;
  background-color: green;
`;
const LiContainer = styled.div`
  display:flex;
  flex-direction:column;
  padding:1rem;
`


const EditionContainer = () => {
  const { allUserPokemons, pokemons } = useContext(GlobalContext);
  const navigate = useNavigate();

  const allPokemonsCombined = [...allUserPokemons, ...pokemons];

  const pokemonsMap = {};

  allPokemonsCombined.forEach((pokemon) => {
    const id = String(pokemon.id);
    if (!pokemonsMap[id]) {
      pokemonsMap[id] = pokemon;
    }
  });
  const pokemonsForDisplay = Object.values(pokemonsMap);

  const handleCreateButton = () => {
    navigate("/create");
  };

  const handleEditButton = (pokemon) => {
    navigate(`/editForm/${pokemon.id}`);
  };

  return (
    <>
      <h1>Stwórz/Edytuj Pokemona</h1>
      <CreateButton onClick={handleCreateButton}>Stwórz Pokemona</CreateButton>

      <LiContainer>
        {pokemonsForDisplay.map((pokemon) => (
          <PokemonLiDetailed
            key={pokemon.id}
            pokemon={pokemon}
            onclick={() => handleEditButton(pokemon)}
          />
        ))}
      </LiContainer>
    </>
  );
};

export default EditionContainer;
