import React from 'react';
import Slide from 'react-reveal/Slide';
import { texts } from '../../locale/locale';
import SvgIcon from '../../components/shared/SvgIcon/SvgIcon';
import { Button, Col, Container, Row } from 'react-bootstrap';


const LandingPage = (props) => {

    const onJoinChatClick = () => {
        props.history.push('/main');
    };

    return (
        <Container className="my-auto">
            <Row className="align-items-center justify-content-center">
                <Col sm>
                    <Slide left>
                        <SvgIcon width={200} src={'waving.svg'}/>
                    </Slide>
                </Col>
                <Col sm>
                    <Slide right>
                        <h1>{texts.english.title}</h1>
                        <h5>{texts.english.content}</h5>
                        <Button
                            type="primary"
                            onClick={onJoinChatClick}>
                            Join Chat Room
                        </Button>
                    </Slide>
                </Col>
            </Row>
        </Container>
    );
};

export default LandingPage;
