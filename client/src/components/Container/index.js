import * as S from "./styles";
import React from "react";

const Container = ({ padding, border, children }) => (
  <S.Container padding={padding} border={border}>
    {children}
  </S.Container>
);

export default Container;
