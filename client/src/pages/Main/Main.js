import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import socket from '../../socket';
import {Link} from 'react-router-dom';
import {Col} from "antd";
import SvgIcon from "../../components/shared/SvgIcon/SvgIcon";
import Slide from "react-reveal/Slide";
import {texts} from "../../locale/locale";
import {Content, ContentWrapper} from "../LandingPage/LandingPage";

const Main = (props) => {
    const roomRef = useRef();
    const userRef = useRef();
    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState('');
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


        socket.on('FE-error-user-exist', ({error}) => {
            if (!error) {
                const roomName = `room_${roomRef.current.value}`;
                const userName = userRef.current.value;

                sessionStorage.setItem('user', userName);
                props.history.push(`/room/${roomName}`);
            } else {
                setErr(error);
                setErrMsg('User name already exist');
            }
        });
    }, [props.history]);

    function clickJoin() {
        const roomName = roomRef.current.value;
        const userName = userRef.current.value;

        if (!roomName || !userName) {
            setErr(true);
            setErrMsg('Enter Room Name or User Name');
        } else {
            socket.emit('BE-check-user', {roomId: `room_${roomName}`, userName});
        }
    }

    return (
        <MainContainer>
            <Row type="flex" justify="space-between" align="middle">
                <Col lg={24} md={24} sm={24}>
                    <Slide left>
                        <SvgIcon src={"developer.svg"}/>
                    </Slide>
                </Col>
            </Row>
            <Row type="flex" justify="space-between" align="middle">
                <Col>
                    <Slide right>
                        <FormGroup>
                            <Col span={24}>
                                <Label htmlFor="roomName">Room Name</Label>
                                <Input type="text" id="roomName" ref={roomRef}/>

                                <Label htmlFor="userName">User Name</Label>
                                <Input type="text" id="userName" ref={userRef}/>
                            </Col>
                        </FormGroup>
                    </Slide>
                </Col>

            </Row>

            <CreateButton onClick={clickJoin}> Create a Room</CreateButton>
            {err ? <Error>{errMsg}</Error> : null}

            <hr style={{
                color: '#000000',
                backgroundColor: '#000000',
                height: .5,
                width: '100%',
                borderColor: '#000000'
            }}/>

            <Row type="flex" justify="space-between" align="middle">
                <FormGroup>
                    {Object.entries(rooms).length > 0 &&
                    <Label> Or join Available:</Label>}

                    {Object.entries(rooms).map(([i, k], index) => <div key={index}>
                        <Link to={`/room/room_${i}`}> "{i}" with {k.length} users</Link>
                        </div>)}
                </FormGroup>
            </Row>

        </MainContainer>
    );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 15px;
  line-height: 35px;
`;

const Label = styled.label`
  padding-left: 35px`;

const Input = styled.input`
  width: 150px;
  height: 35px;
  margin-left: 15px;
  padding-left: 10px;
  outline: none;
  border: none;
  border-radius: 5px;
`;

const Error = styled.div`
  margin-top: 10px;
  font-size: 20px;
  color: #e85a71;
`;

const AvailableRoom = styled.button`
  height: 40px;
  margin-top: 35px;
  width: 50%;
  outline: none;
  border: none;
  border-radius: 15px;
  color: #d8e9ef;
  background-color: #2e1b68;
  font-size: 25px;
  font-weight: 200;

  :hover {
    background-color: #f47327;
    color: #2e1b68;
    cursor: pointer;
  }
`;

const CreateButton = styled.button`
  height: 40px;
  margin-top: 35px;
  outline: none;
  border: none;
  border-radius: 15px;
  color: #d8e9ef;
  background-color: #2e1b68;
  font-size: 25px;
  font-weight: 300;

  :hover {
    background-color: #f47327;
    color: #2e1b68;
    cursor: pointer;
  }
`;

const FormGroup = styled.form`
  justify-content: space-around;
  width: 100%;
  //max-width: 520px;
  @media only screen and (max-width: 1045px) {
    max-width: 100%;
    margin-top: 2rem;
  }
`;

export default Main;
