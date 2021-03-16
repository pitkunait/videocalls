import React from 'react';

import LeftContentBlock from "../../components/LeftContentBlock";
import Container from "../../common/Container";
import SvgIcon from "../../common/SvgIcon";
import Button from "../../common/Button";
import {Col, Row} from "antd";
import Slide from "react-reveal/Slide";
import * as S from "../../components/LeftContentBlock/styles";
import Main from "../Main/Main";

const id = "intro";
const icon = "developer.svg";
const title = "A simple communication service for those who are not tech savvy.";
const content =  "By focusing on the accessibility aspect of self-moderated chat rooms we tackle loneliness, together.";
const section = "";

const LandingPage = (props) => {
    return (
        <Container>
            <Row type="flex" justify="space-between" align="middle" id={id}>
                <Col lg={11} md={11} sm={12} xs={24}>
                    <Slide left>
                        <SvgIcon
                            src={icon}
                            className="about-block-image"
                            width="100%"
                            height="100%"
                        />
                    </Slide>
                </Col>
                <Col lg={11} md={11} sm={11} xs={24}>
                    <Slide right>
                        <S.ContentWrapper>
                            <h6>{title}</h6>
                            <S.Content>{content}</S.Content>
                            <S.ServiceWrapper>
                                <Row type="flex" justify="space-between">
                                    {section &&
                                    typeof section === "object" &&
                                    section.map((item, id) => {
                                        return (
                                            <Col key={id} span={11}>
                                                <SvgIcon src={item.icon} width="60px" height="60px" />
                                                <S.MinTitle>{t(item.title)}</S.MinTitle>
                                                <S.MinPara>{t(item.content)}</S.MinPara>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </S.ServiceWrapper>
                        </S.ContentWrapper>
                    </Slide>
                </Col>
                <Col lg={11} md={11} sm={11} xs={24}>
                    <Slide left>
                        <S.ButtonWrapper>
                            <Button onClick={()=>{props.history.push('/main')}}> Create Chat Room </Button>
                            <Button> Join Chat Room </Button>
                        </S.ButtonWrapper>
                    </Slide>
                </Col>
            </Row>
        </Container>
    );
};

export default LandingPage;
