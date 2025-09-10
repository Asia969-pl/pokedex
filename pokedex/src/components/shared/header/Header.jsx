import React, { useContext } from "react";
import styled from "styled-components";
import Switch from "@mui/material/Switch";
import { NavLink, useNavigate } from "react-router-dom";
import { LoginContext } from "../../../context/LoginContext";
import { colorThemes } from "../../../services/cotorTheme";
import { ThemeContext } from "../../../context/ThemeContext";
import Logo from "./PokemonLogo";
import LoggedInIcon from "./LoggedInIcon";

const HeaderDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  width: 90vw;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.txColor};
  padding: 1rem 0;
  transition: background-color 0.3s, color 0.3s;
`;

const NavDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const LikeButtonDiv = styled.div`
  background-color: blue;
  color: white;
  width: 8rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  justify-content: center;
  cursor: pointer;

  &.active {
    font-weight: bold;
    color: red;
  }
`;

const SwitchContainer = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:0.5rem;
`

const loginRoutes = [
  { name: "ZALOGUJ", id: 1, path: "/login" },
  { name: "ZAREJESTRUJ", id: 2, path: "/register" },
];

const userRoutes = [
  { name: "ULUBIONE", id: 1, path: "/favourites" },
  { name: "ARENA", id: 2, path: "/arena" },
  { name: "RANKING", id: 3, path: "/ranking" },
  { name: "EDYCJA", id: 4, path: "/edition" },
];

const Header = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { isLoggedIn, logout, user } = useContext(LoginContext);
  const navigate = useNavigate();

  const backGroundColor = darkMode
    ? colorThemes.dark.background
    : colorThemes.light.background;
  const textColor = darkMode ? colorThemes.dark.text : colorThemes.light.text;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <HeaderDiv bgColor={backGroundColor} txColor={textColor}>
      <Logo />
      <NavDiv>
        <SwitchContainer>
        {isLoggedIn && <LoggedInIcon/>}
        {isLoggedIn &&<p>{user.name}</p>}
        <Switch checked={darkMode} onChange={toggleTheme} />
        </SwitchContainer>
        <ButtonWrapper>
          {!isLoggedIn &&
            loginRoutes.map(({ name, id, path }) => (
              <NavLink
                key={id}
                to={path}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <LikeButtonDiv>{name}</LikeButtonDiv>
              </NavLink>
            ))}

          {isLoggedIn && (
            <>
              {userRoutes.map(({ name, id, path }) => (
                <NavLink
                  key={id}
                  to={path}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <LikeButtonDiv>{name}</LikeButtonDiv>
                </NavLink>
              ))}
              <LikeButtonDiv onClick={handleLogout}>WYLOGUJ</LikeButtonDiv>
            </>
          )}
        </ButtonWrapper>
      </NavDiv>
    </HeaderDiv>
  );
};

export default Header;
