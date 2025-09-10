import React, { useContext } from "react";
import styled from "styled-components";
import { colorThemes } from "../../../services/cotorTheme";
import { ThemeContext } from "../../../context/ThemeContext";

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
  min-height: 100vh;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.txColor};
  transition: background-color 0.3s, color 0.3s;
`;

const ContentContainer = ({ children }) => {
  const { darkMode } = useContext(ThemeContext);

  const backGroundColor = darkMode
    ? colorThemes.dark.background
    : colorThemes.light.background;

  const textColor = darkMode
    ? colorThemes.dark.text
    : colorThemes.light.text;

  return (
    <ContentWrapper bgColor={backGroundColor} txColor={textColor}>
      {children}
    </ContentWrapper>
  );
};

export default ContentContainer;
