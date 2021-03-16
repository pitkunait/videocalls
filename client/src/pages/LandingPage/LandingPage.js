import React from 'react';

import Container from '../../components/shared/Container/Container';
import SvgIcon from '../../components/shared/SvgIcon/SvgIcon';
import Button from '../../components/shared/Button/Button';
import { Col, Row } from 'antd';
import Slide from 'react-reveal/Slide';
import styled from 'styled-components';


const icon = 'developer.svg';
const title = 'A simple communication service for those who are not tech savvy.';
const content = 'By focusing on the accessibility aspect of self-moderated chat rooms we tackle loneliness, together.';

const LandingPage = (props) => {
    return (
        <Container>
            <Row type="flex" justify="space-between" align="middle">
                <Col lg={11} md={11} sm={24} xs={24}>
                    <Slide left>
                        <SvgIcon
                            src={icon}
                            className="about-block-image"
                            // width="100%"
                            // height="100%"
                        />
                    </Slide>
                </Col>
                <Col lg={11} md={11} sm={24} xs={24}>
                    <Slide right>
                        <ContentWrapper>
                            <h6>{title}</h6>
                            <Content>{content}</Content>
                        </ContentWrapper>
                        <ButtonWrapper>
                            <Button onClick={() => {props.history.push('/main');}}> Create Chat Room </Button>
                            <Button> Join Chat Room </Button>
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
  
  @media only screen and (max-width: 480px) {
    margin: 2rem 0;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

