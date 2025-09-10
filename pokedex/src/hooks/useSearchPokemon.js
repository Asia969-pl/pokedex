import { useState } from "react";

const Api_URL = "https://pokeapi.co/api/v2/pokemon/";

export const useSearchPokemon = () => {
  const [searchedPokemon, setSearchedPokemon] = useState(null);
  const [error, setError] = useState(null);

  const searchPokemon = async (pokemonName) => {
    if (!pokemonName) return;
    const URL = `${Api_URL}${pokemonName.toLowerCase()}`;
    setError(null); 

    try {
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error('Pokemon not found');
      }
      const searchPokemonData = await response.json();

      const ability = searchPokemonData.abilities[0].ability.name 
      const spriteUrl = searchPokemonData.sprites.front_default;

      const result = {
        name: searchPokemonData.name.charAt(0).toUpperCase() + searchPokemonData.name.slice(1),
        ability,
        spriteUrl,
        weight: searchPokemonData.weight,
        base_experience: searchPokemonData.base_experience,
        height: searchPokemonData.height,
        id: searchPokemonData.id,
      };

      setSearchedPokemon(result);
    } catch (error) {
      setError(error.message);
      setSearchedPokemon(null);
    }
  };

  return { searchedPokemon, error, searchPokemon, setSearchedPokemon};
};
