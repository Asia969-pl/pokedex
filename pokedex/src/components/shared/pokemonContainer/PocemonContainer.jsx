import { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import PokemonCard from "./PokemonCard";
import { GlobalContext } from "../../../context/GlobalContext";
import { LoginContext } from "../../../context/LoginContext";
import LeftArrowIcon from "./LeftArrowIcon";
import RightArrowIcon from "./RightArrowIcon";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const PokemonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const PokemonInputWrapper = styled.div`
  width: 100%;
  height: 200px;
  background-color: lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset,
    rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
`;

const PokemonInput = styled.input`
  height: 2rem;
  background-color: inherit;
  color: black;
`;

const PokemonCardWrapper = styled.div`
  width: 90%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
`;

const PokemonContainer = () => {
  const globalContext = useContext(GlobalContext);
  const loginContext = useContext(LoginContext);

  const offset = globalContext.offset;
  const setOffset = globalContext.setOffset;
  const searchedPokemon = globalContext.searchedPokemon;
  const setSearchedPokemon = globalContext.setSearchedPokemon;
  const allUserPokemons = globalContext.allUserPokemons;
  const apiPokemons = globalContext.pokemons;
  const fetchAllPokemons = globalContext.fetchAllPokemons;

  const user = loginContext.user;
  const limitPerPage = 15;

  const [searchInputValue, setSearchInputValue] = useState("");
  const [paginatedPokemons, setPaginatedPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const getCombinedPokemons = () => {
    let combined = [];
    if (Array.isArray(apiPokemons) && apiPokemons.length > 0) {
      if (user && Array.isArray(allUserPokemons) && allUserPokemons.length > 0) {
        const userMap = {};
        allUserPokemons.forEach(p => {
          if (p.id != null) userMap[p.id] = p;
        });

        combined = apiPokemons.map(p => userMap[p.id] || p);

        allUserPokemons.forEach(p => {
          if (!combined.some(c => c.id === p.id)) combined.push(p);
        });
      } else {
        combined = [...apiPokemons];
      }
      combined.sort((a, b) => a.id - b.id);
    }
    return combined;
  };

  const [combinedPokemons, setCombinedPokemons] = useState(getCombinedPokemons());

  
  useEffect(() => {
    setCombinedPokemons(getCombinedPokemons());
    setOffset(0); 
    setSearchedPokemon(null); 
    setSearchInputValue("");
  }, [apiPokemons, allUserPokemons, user]);


  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    setSearchInputValue(value);

    if (value.trim() === "") {
      setSearchedPokemon(null);
    } else {
      const filtered = combinedPokemons.filter(
        p => p.name.toLowerCase().includes(value.toLowerCase()) || p.id.toString() === value
      );
      setSearchedPokemon(filtered.length > 0 ? filtered : null);
    }
  };

  const handleShowAllPokemons = () => {
    setSearchedPokemon(null);
    setSearchInputValue("");
  };


  const handleNextPage = () => {
    const maxOffset = combinedPokemons.length - limitPerPage;
    setOffset(prev => Math.min(prev + limitPerPage, maxOffset));
  };

  const handlePreviousPage = () => {
    setOffset(prev => Math.max(prev - limitPerPage, 0));
  };

  useEffect(() => {
    const paginated = combinedPokemons.slice(offset, offset + limitPerPage);
    setPaginatedPokemons(paginated);
  }, [offset, combinedPokemons]);


  useEffect(() => {
    setIsLoading(true);
    fetchAllPokemons().finally(() => setIsLoading(false));
  }, []);

  return (
    <PokemonWrapper>
      <PokemonInputWrapper>
        <PokemonInput
          placeholder="Search"
          value={searchInputValue}
          onChange={handleSearchInputChange}
        />
      </PokemonInputWrapper>

      {searchedPokemon ? (
        <>
          <PokemonCardWrapper>
            {Array.isArray(searchedPokemon) ? (
              searchedPokemon.map(p => (
                <Link key={p.id} to={`/pokemon/${p.id}`}>
                  <PokemonCard pokemon={p} />
                </Link>
              ))
            ) : (
              <Link key={searchedPokemon.id} to={`/pokemon/${searchedPokemon.id}`}>
                <PokemonCard pokemon={searchedPokemon} />
              </Link>
            )}
          </PokemonCardWrapper>
          <Button onClick={handleShowAllPokemons}>Show All</Button>
        </>
      ) : (
        <>
          <PokemonCardWrapper>
            {paginatedPokemons.map(p => (
              <Link key={p.id} to={`/pokemon/${p.id}`}>
                <PokemonCard pokemon={p} />
              </Link>
            ))}
          </PokemonCardWrapper>

          <ButtonContainer>
            <LeftArrowIcon onClick={handlePreviousPage} />
            <RightArrowIcon onClick={handleNextPage} />
          </ButtonContainer>
        </>
      )}

      {isLoading && <div>Loading...</div>}
    </PokemonWrapper>
  );
};

export default PokemonContainer;
