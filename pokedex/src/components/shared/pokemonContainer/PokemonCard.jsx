import styled from "styled-components";

const Card = styled.div`
  position: relative;
  width: 200px;
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin: 1rem;

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

const ScoreWrapper = styled.div`
  top: 0;
  left: 0;
  position: absolute;
  width: 20%;
  display: flex;
  flex-direction:column;
  justify-content: space-around;
  padding:0.5rem;
  font-weight: bold;
  color: white;
  background-color: grey;
  border-radius:0.5rem;
`;

const PokemonCard = ({ pokemon }) => {
  const {
    ability,
    base_experience,
    height,
    id,
    name,
    weight,
    spriteUrl,
    win,
    lose,
  } = pokemon;

  return (
    <Card>
      {/* Wyświetlamy wyniki tylko jeśli istnieją */}
      {win !== undefined && lose !== undefined && (
        <ScoreWrapper>
          <div>Win: {win}</div>
          <div>Lose: {lose}</div>
        </ScoreWrapper>
      )}

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
    </Card>
  );
};

export default PokemonCard;
