import {useContext } from "react";
import PokemonCard from "../pokemonContainer/PokemonCard";
import styled from "styled-components";
import { LoginContext } from "../../../context/LoginContext";

const PokemonCardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3rem;
`;

const FavouritesContainer = () => {
  const { user } = useContext(LoginContext)
  const userFavourires = user?.favourites
 if(userFavourires.length === 0 ) {
  return <h1>Polub pokemony</h1>
 }

  return (
    <>
      <h1>Ulubione pokemony</h1>
      <PokemonCardWrapper>
        {userFavourires.map((favourite) =><PokemonCard pokemon={favourite}/>)}
      </PokemonCardWrapper>
    </>
  );
};

export default FavouritesContainer;
