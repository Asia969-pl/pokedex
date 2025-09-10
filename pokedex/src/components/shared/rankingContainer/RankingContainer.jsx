import { useContext, useState } from "react";
import styled from "styled-components";
import { GlobalContext } from "../../../context/GlobalContext";
import { LoginContext } from "../../../context/LoginContext";

const RankingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
`;

const SortSelect = styled.select`
  background-color: yellow;
  font-size: 1rem;
  border-radius: 0.5rem;
`;

const PokemonList = styled.ul`
  list-style: none;
  padding: 2rem;
`;

const PokemonItem = styled.li`
  display: flex;
  flex-wrap:wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border-bottom: 2px solid blue;
`;

const PokemonImage = styled.img`
  width: 100px;
  height: 100px;
`;

const RankingContainer = () => {
  const { user } = useContext(LoginContext);
  const { allUserPokemons, pokemons } = useContext(GlobalContext);
  const [sortKey, setSortKey] = useState("base_experience");

  if (!user) return <p>Nie znaleziono użytkownika</p>;


  const allCombined = [];
  const idMap = {};
  [...allUserPokemons, ...pokemons, ...user.scores].forEach((p) => {
    if (!idMap[p.id]) {
      idMap[p.id] = true;
      allCombined.push(p);
    }
  });

  const sortedPokemons = allCombined.sort((a, b) => b[sortKey] - a[sortKey]);

  return (
    <RankingWrapper>
      <h1>Ranking Pokemonów</h1>

      <SortSelect value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
        <option value="base_experience">Doświadczenie</option>
        <option value="weight">Waga</option>
        <option value="height">Wzrost</option>
        <option value="win">Liczba wygranych</option>
      </SortSelect>

      <PokemonList>
        {sortedPokemons.map((pokemon, index) => (
          <PokemonItem key={pokemon.id}>
            <p>{index + 1}</p>
            <PokemonImage src={pokemon.spriteUrl} alt={pokemon.name} />

            <p>{pokemon.name}</p>
            <p>Doświadczenie {pokemon.base_experience}</p>
            <p> Waga {pokemon.weight}</p>
            <p> Wzrost {pokemon.height}</p>
            <p>
              {pokemon.win || pokemon.lose
                ? `Liczba wygranych: ${pokemon.win}`
                : ""}
            </p>
          </PokemonItem>
        ))}
      </PokemonList>
    </RankingWrapper>
  );
};

export default RankingContainer;
