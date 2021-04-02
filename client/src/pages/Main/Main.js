import React, {useEffect, useState} from 'react';
import socket from '../../socket';
import {Link} from 'react-router-dom';
import SvgIcon from '../../components/shared/SvgIcon/SvgIcon';
import Slide from 'react-reveal/Slide';
import styles from './Main.module.css';
import {Col, Container, Row, Form, Button, InputGroup, FormControl} from 'react-bootstrap';

const Main = (props) => {
        const [rooms, setRooms] = useState({});
        const [roomName, setRoomName] = useState('');
        const [userName, setUserName] = useState('');

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

        const createRoom = (event) => {
            if (roomName && userName) {
                props.history.push(`/room/room_${roomName}`);
            }
        };

        const joinRoom = (roomName) => {
            props.history.push(`/room/room_${roomName}`);
        };

        const hasAvailRooms = Object.entries(rooms).length > 0;

        return (
            <Container className="my-auto">
                <Row className="justify-content-center">
                    <Col>
                        <Slide right>
                            <SvgIcon width={200} src={'developer.svg'}/>
                        </Slide>
                    </Col>
                </Row>

                <Row className="justify-content-center mt-5">
                    <Col sm={8}>
                        <Slide left>
                            <h3>Enter Your Name</h3>
                            <FormControl isValid={userName}
                                         // className={styles.myDiv}
                                         onChange={event => setUserName(event.target.value)}/>
                        </Slide>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-5">
                    <Col sm={8}>
                        <Slide right>
                            <h3>Create Your Room</h3>
                            <FormControl className={'mb-2'} onChange={event => setRoomName(event.target.value)}/>
                            <Button className="btn-block" variant="primary" type="submit" onClick={createRoom}>
                                Create Room
                            </Button>
                        </Slide>
                    </Col>
                </Row>

                {hasAvailRooms &&
                <Row className="justify-content-center mt-5">
                    <Col sm={8}>
                        <Slide left>
                            <div className={`${styles.availRooms} pt-4`}>
                                <h3>Join Available</h3>
                                {Object.entries(rooms).map(([i, k], index) => <
                                        div key={index}>
                                        <Button className="btn-block" variant="primary" onClick={() => joinRoom(i)}>
                                            {i} [{k.length} users]
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Slide>
                    </Col>
                </Row>
                }
            </Container>

        );
    }
;


export default Main;
