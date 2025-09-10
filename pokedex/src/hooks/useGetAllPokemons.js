import { useState, useEffect } from "react";

const API_URL = "https://pokeapi.co/api/v2/pokemon/";

export const useGetAllPokemons = () => {
  const [pokemons, setPokemons] = useState([]);
  const [error, setError] = useState(null);

  const getPokemonDetails = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      ability: data.abilities[0].ability.name,
      spriteUrl: data.sprites.front_default,
      weight: data.weight,
      base_experience: data.base_experience,
      height: data.height,
    };
  };

  const fetchAllPokemons = async () => {
    try {
      const response = await fetch(`${API_URL}?limit=150`);
      const data = await response.json();

      const detailedPokemons = await Promise.all(
        data.results.map((pokemon) => getPokemonDetails(pokemon.url))
      );

      setPokemons(detailedPokemons);
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    fetchAllPokemons();
  }, []);

  return { pokemons, error, fetchAllPokemons };
};
