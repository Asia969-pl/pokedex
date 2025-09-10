import { useState, useEffect, useContext } from "react";
import { LoginContext } from "../context/LoginContext";

const USERS_URL = "http://localhost:3000/users";

export const useGatAllUsersPokemons = () => {
  const { user } = useContext(LoginContext); 
  const [allUserPokemons, setAllUserPokemons] = useState([]);
  const [error, setError] = useState(null);

  const getUserPokemons = async () => {
    if (!user?.id) {
      return;
    }

    try {
      const response = await fetch(`${USERS_URL}/${user.id}`);
      if (!response.ok) throw new Error("Nie udało się pobrać danych użytkownika");

      const data = await response.json();

      const scores = Array.isArray(data.scores)
        ? data.scores.map((p) => ({ ...p, id: Number(p.id) }))
        : [];
      
  
      const pokemonsMap = {};
      scores.forEach((pokemon) => {
        if (!pokemon.id) return; 
        const existing = pokemonsMap[pokemon.id];

        if (!existing) {
          pokemonsMap[pokemon.id] = pokemon;
        } else {
          // wybieramy "lepszą" wersję
          pokemonsMap[pokemon.id] =
            Object.keys(pokemon).length >= Object.keys(existing).length ? pokemon : existing;
        }
      });

      const allPokemons = Object.values(pokemonsMap);

    
      allPokemons.sort((a, b) => a.id - b.id);

      setAllUserPokemons(allPokemons);

    } catch (err) {
      console.error("Error fetching user pokemons:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    getUserPokemons();
  }, [user]);

  return { allUserPokemons, error };
};
