import SwordIcon from "../pokemonContainer/SwordIcon";
import styled from "styled-components";
import { useContext } from "react";
import { LoginContext } from "../../../context/LoginContext";

const IconContainer = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
`;

const BattleWrapper = styled.div`
  width: 200px;
  background-color:white;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin: 1rem; 
  opacity: ${(props) => (props.isLoser ? 0.3 : 1)};
  transition: opacity 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

const PokemonImage = styled.img`
  width: 70%;
`;

const InfoWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  text-decoration: none;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PropertyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const PropertyValue = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 1.2rem;
  text-decoration: none;
  color: black;
`;

const PropertyTitle = styled.h3`
  margin: 0.3rem 0 0.5rem 0;
  font-size: 1rem;
  text-decoration: none;
  color: black;
`;

const BattlePokemon = ({ pokemon, isLoser }) => {
  const { ability, base_experience, height, id, name, weight, spriteUrl } =
    pokemon;
  const { user, setUser } = useContext(LoginContext);
  console.log("arena", user.arena);

  const removePokemonFromArena = async (pokemonId) => {
    const updatedArena = user?.arena.filter(
      (pokemon) => pokemon.id !== pokemonId
    );
    if (!user) return;

    try {
      const res = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ arena: updatedArena }),
      });

      if (res.ok) {
        setUser({ ...user, arena: updatedArena });
      }
    } catch (err) {
      console.error("Błąd przy usuwaniu pokémona z areny:", err);
    }
  };
  
  return (
    <>
      <BattleWrapper isLoser={isLoser}>
        <IconContainer>
          <SwordIcon onClick={() => removePokemonFromArena(pokemon.id)} />
        </IconContainer>
        <PokemonImage src={spriteUrl} alt={name} />
        <h2>{name}</h2>
        <InfoWrapper>
          <InfoContainer>
            <PropertyContainer>
              <PropertyValue>{height}</PropertyValue>
              <PropertyTitle>Height</PropertyTitle>
            </PropertyContainer>
            <PropertyContainer>
              <PropertyValue>{weight}</PropertyValue>
              <PropertyTitle>Weight</PropertyTitle>
            </PropertyContainer>
          </InfoContainer>
          <InfoContainer>
            <PropertyContainer>
              <PropertyValue>{base_experience}</PropertyValue>
              <PropertyTitle>Base Experience</PropertyTitle>
            </PropertyContainer>
            <PropertyContainer>
              <PropertyValue>{ability}</PropertyValue>
              <PropertyTitle>Ability</PropertyTitle>
            </PropertyContainer>
          </InfoContainer>
        </InfoWrapper>
      </BattleWrapper>
    </>
  );
};

export default BattlePokemon;
