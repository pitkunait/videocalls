import React from 'react';

import Container from '../../components/shared/Container/Container';
import SvgIcon from '../../components/shared/SvgIcon/SvgIcon';
import Button from '../../components/shared/Button/Button';
import { Col, Row } from 'antd';
import Slide from 'react-reveal/Slide';
import styled from 'styled-components';
import { texts } from '../../locale/locale';

const LandingPage = (props) => {
    return (
        <Container>
            <Row type="flex" justify="space-between" align="middle">
                <Col lg={11} md={11} sm={24} xs={24}>
                    <Slide left>
                        <SvgIcon src={"waving.svg"} />
                    </Slide>
                </Col>
                <Col lg={11} md={11} sm={24} xs={24}>
                    <Slide right>
                        <ContentWrapper>
                            <Content>{texts.english.title}</Content>
                            <h6>{texts.english.content}</h6>
                        </ContentWrapper>
                        <ButtonWrapper>
                            <Button onClick={() => {props.history.push('/main');}}>Join Chat Room</Button>
                        </ButtonWrapper>
                    </Slide>
                </Col>
            </Row>
        </Container>
    );
};

export default LandingPage;


export const Content = styled.p`
  margin: 1.5rem 0 2rem 0;
`;

export const ContentWrapper = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

