import styled from "styled-components";


const PokemonLI = styled.div`
  display:flex;
  flex-wrap:wrap;
  gap:1rem;
  width:100%;
  justify-content:center;
  align-items:center;
  border-bottom:2px solid blue;
`

const EditButton = styled.button`
  color:white;
  background-color:green;
  border-radius:0.5rem;
`

const PokemonLiDetailed = ({ pokemon, onclick }) => {
  return (
    <PokemonLI>
    <h1>{pokemon.id}</h1>
      <h2>{pokemon.name}</h2>
      <img src={pokemon.spriteUrl} />
      <EditButton onClick={onclick}>edytuj</EditButton>
    </PokemonLI>
  );
};

export default PokemonLiDetailed;
