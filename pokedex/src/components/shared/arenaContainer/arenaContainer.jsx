import styled from "styled-components";
import { useContext, useState, useEffect } from "react";
import { LoginContext } from "../../../context/LoginContext";
import BattleCard from "./battleCard";
import BattlePokemon from "./BattlePokemon";
import { useSnackbar } from "notistack"; 

const BattleContainer = styled.div`
  justify-content: center;
  width: 100vw;
  display: flex;
  gap: 10rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FighButton = styled.button`
  width: 60px;
  height: 60px;
  color: white;
  background-color: red;
  margin: 10px;
`;

const ClearButton = styled.button`
  width: 100px;
  height: 40px;
  margin: 10px;
  background-color: gray;
  color: white;
`;

const ArenaContainer = () => {
  const USERS_URL = "http://localhost:3000/users";
  const { user, setUser } = useContext(LoginContext);
  const { enqueueSnackbar } = useSnackbar(); 

  const [leftPokemon, setLeftPokemon] = useState(user?.arena[0]);
  const [rightPokemon, setRightPokemon] = useState(user?.arena[1]);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (user?.arena) {
      setLeftPokemon(user.arena[0]);
      setRightPokemon(user.arena[1]);
    }
  }, [user]);

  const handleFight = () => {
    if (!user || !leftPokemon || !rightPokemon) return;

    const leftScore = leftPokemon.base_experience * leftPokemon.weight;
    const rightScore = rightPokemon.base_experience * rightPokemon.weight;

    let updatedUser = { ...user };
    const arena = [...(user?.arena || [])];

    if (arena[0]) arena[0] = { ...arena[0] };
    if (arena[1]) arena[1] = { ...arena[1] };

    if (leftScore > rightScore) {
      if (arena[0]) {
        arena[0].base_experience += 10;
        arena[0].win = (arena[0].win || 0) + 1;
        arena[0].isLoser = false;
        arena[0].lose = arena[0].lose || 0;
      }
      if (arena[1]) {
        arena[1].lose = (arena[1].lose || 0) + 1;
        arena[1].isLoser = true;
        arena[1].win = arena[1].win || 0;
      }
      setWinner(arena[0]);
    } else if (rightScore > leftScore) {
      if (arena[1]) {
        arena[1].base_experience += 10;
        arena[1].win = (arena[1].win || 0) + 1;
        arena[1].isLoser = false;
        arena[1].lose = arena[1].lose || 0;
      }
      if (arena[0]) {
        arena[0].lose = (arena[0].lose || 0) + 1;
        arena[0].isLoser = true;
        arena[0].win = arena[0].win || 0;
      }
      setWinner(arena[1]);
    } else {
      setWinner(null);
      enqueueSnackbar("Remis!", { variant: "error" }); 
    }

    updatedUser.arena = arena;
    setUser(updatedUser);

    setLeftPokemon(arena[0]);
    setRightPokemon(arena[1]);

    handleAddtoscores(updatedUser, arena[0], arena[1]);
  };

  const handleAddtoscores = async (currentUser, left, right) => {
    if (!currentUser || !currentUser.scores) {
      console.error("Brak użytkownika lub jego scores");
      return;
    }

    const updatedScores = [...currentUser.scores];

    const sanitizePokemon = (pokemon) => {
      const { isLoser, ...cleaned } = pokemon;
      return cleaned;
    };

    const updateOrAddPokemon = (pokemon) => {
      const cleanedPokemon = sanitizePokemon(pokemon);
      const index = updatedScores.findIndex((p) => p.id === cleanedPokemon.id);

      if (index === -1) {
        updatedScores.push(cleanedPokemon);
      } else {
        updatedScores[index] = { ...updatedScores[index], ...cleanedPokemon };
      }
    };

    if (left) updateOrAddPokemon(left);
    if (right) updateOrAddPokemon(right);

    try {
      const res = await fetch(`${USERS_URL}/${currentUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scores: updatedScores }),
      });

      if (res.ok) {
        setUser({ ...currentUser, scores: updatedScores });
        enqueueSnackbar("Wyniki zostały zaktualizowane", { variant: "success" }); 
      } else {
        enqueueSnackbar("Błąd podczas aktualizacji wyników", { variant: "error" }); 
      }
    } catch (err) {
      console.error("Błąd podczas aktualizacji scores:", err);
      enqueueSnackbar("Wystąpił błąd przy zapisie wyników", { variant: "error" }); 
    }
  };

  const handleResetArena = async () => {
    const updatedArena = [];

    try {
      const res = await fetch(`${USERS_URL}/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ arena: updatedArena }),
      });

      if (res.ok) {
        setUser({ ...user, arena: updatedArena });
        setLeftPokemon(null);
        setRightPokemon(null);
        enqueueSnackbar("Pokemony zostały usunięte z areny", { variant: "success" }); 
      } else {
        enqueueSnackbar("Nie udało się wyczyścić areny", { variant: "error" }); 
      }
    } catch (err) {
      console.error("Błąd podczas resetowania areny:", err);
      enqueueSnackbar("Błąd po stronie serwera przy resetowaniu areny", { variant: "error" }); 
    }
  };

  const isLeftPokemonLoser = leftPokemon?.isLoser;
  const isRightPokemonLoser = rightPokemon?.isLoser;

  return (
    <>
      <h1>Arena Walki</h1>

      <BattleContainer>
        {leftPokemon ? (
          <BattlePokemon pokemon={leftPokemon} isLoser={isLeftPokemonLoser} />
        ) : (
          <BattleCard />
        )}

        <FighButton disabled={user?.arena?.length !== 2} onClick={handleFight}>
          Walcz
        </FighButton>

        {rightPokemon ? (
          <BattlePokemon pokemon={rightPokemon} isLoser={isRightPokemonLoser} />
        ) : (
          <BattleCard />
        )}
      </BattleContainer>

      <ClearButton onClick={handleResetArena}>Wyczyść arenę</ClearButton>
    </>
  );
};

export default ArenaContainer;
