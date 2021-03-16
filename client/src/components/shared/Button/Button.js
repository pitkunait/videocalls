import React from 'react';

import styled from 'styled-components';


export const StyledButton = styled.button`
  background: ${(props) => props.color || '#2e186a'};
  color: ${(props) => (props.color ? '#2E186A' : '#fff')};
  font-size: 1rem;
  font-weight: 700;
  width: 100%;
  border: ${(props) => (props.color ? '1px solid #2E186A' : '0px')};
  border-radius: 8px;
  height: 60px;
  outline: none;
  cursor: pointer;
  margin: 0.625rem;
  max-width: 180px;

  @media only screen and (max-width: 1024px) {
    width: ${(props) => (props.width ? '160px' : '100%')};
  }

  @media only screen and (max-width: 768px) {
    width: ${(props) => (props.width ? '140px' : '100%')};
  }

  @media only screen and (max-width: 480px) {
    width: ${(props) => (props.width ? '130px' : '100%')};
  }
`;


const Button = ({ color, width, children, onClick }) => (
    <StyledButton color={color} width={width} onClick={onClick}>
      {children}
    </StyledButton>
);

export default Button;
