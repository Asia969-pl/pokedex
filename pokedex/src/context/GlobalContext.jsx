import { createContext, useContext, useState, useEffect } from "react";
import { useGetAllPokemons } from "../hooks/useGetAllPokemons";
import { useSearchPokemon } from "../hooks/useSearchPokemon";
import { useGatAllUsersPokemons } from "../hooks/useGatAllUsersPokemons";

export const GlobalContext = createContext(null);

export const GlobalProvider = ({ children }) => {
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); 
  const { pokemons, fetchAllPokemons } = useGetAllPokemons();
  const { searchedPokemon, error, searchPokemon, setSearchedPokemon } = useSearchPokemon();
  const [arena, setArena] = useState([]);
 const {allUserPokemons} = useGatAllUsersPokemons();

  return (
    <GlobalContext.Provider
      value={{
        offset,
        setOffset,
        pokemons,
        fetchAllPokemons,
        error,
        searchPokemon,
        searchedPokemon,
        setSearchedPokemon,
        searchTerm,
        setSearchTerm, 
        arena,
        setArena,
        allUserPokemons,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
