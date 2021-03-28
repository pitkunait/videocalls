import React, { useEffect, useState } from 'react';
import socket from '../../socket';
import { Link } from 'react-router-dom';
import SvgIcon from '../../components/shared/SvgIcon/SvgIcon';
import Slide from 'react-reveal/Slide';
import styles from './Main.module.css';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';


const Main = (props) => {
    const [rooms, setRooms] = useState({});

    useEffect(() => {
        socket.on('list-rooms', obj => {
            console.log(obj.rooms);
            const rooms = Object.keys(obj.rooms)
                .filter(key => key.startsWith('room_'))
                .reduce((o, key) => {
                    o[key.replace('room_', '')] = obj.rooms[key];
                    return o;
                }, {});
            setRooms(rooms);
        });
        socket.emit('list-rooms');
    }, []);

    const joinRoom = (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target).entries());
        if (data.roomName && data.userName) {
            props.history.push(`/room/room_${data.roomName}`);
        }
    };

    const hasAvailRooms = Object.entries(rooms).length > 0;

    return (
        <Container className="my-auto">
            <Row className="justify-content-center">
                <Col sm={6}>
                    <Slide right>
                        <SvgIcon width={200} src={'developer.svg'}/>
                    </Slide>
                </Col>
            </Row>

            <Row className="justify-content-center mt-5">
                <Col sm={4}>
                    <Slide left>
                        <Form onSubmit={joinRoom}>
                            <Form.Group controlId="userName">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" name={'userName'} placeholder="Username"/>
                            </Form.Group>
                            <Form.Group controlId="roomName">
                                <Form.Label>Room name</Form.Label>
                                <Form.Control type="text" name={'roomName'} placeholder="Room name"/>
                            </Form.Group>
                            <Button className="btn-block" variant="primary" type="submit">
                                Join Room
                            </Button>
                        </Form>
                    </Slide>
                </Col>
            </Row>


            {hasAvailRooms &&
            <Row className="justify-content-center mt-5">
                <Col sm={6} className="text-center">
                    <Slide left>
                        <div className={`${styles.availRooms} pt-4`}>
                            <h3>Or join Available:</h3>
                            {Object.entries(rooms).map(([i, k], index) => <div key={index}>
                                <Link to={`/room/room_${i}`}>"{i}" with {k.length} users</Link>
                            </div>)}
                        </div>
                    </Slide>
                </Col>
            </Row>
            }
        </Container>

    );
};


export default Main;
