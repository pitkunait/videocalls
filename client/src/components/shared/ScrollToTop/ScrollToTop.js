import React from "react";
import SvgIcon from "../SvgIcon/SvgIcon";

import styled from 'styled-components';

export const StyledUp = styled.div`
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.5715;
  list-style: none;
  position: fixed;
  right: 100px;
  bottom: 50px;
  z-index: 10;
  width: 40px;
  height: 40px;
  cursor: pointer;

  @media screen and (max-width: 1024px) {
    display: none;
  }
`;


const ScrollToTop = () => {
  const scrollUp = () => {
    const element = document.getElementById("intro");
    element.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  return (
    <StyledUp onClick={scrollUp}>
      <SvgIcon src="scroll-top.svg" width="26px" height="26px" />
    </StyledUp>
  );
};

export default ScrollToTop;
