import React, {useState} from 'react';
import Slide from 'react-reveal/Slide';
import {texts} from '../../locale/locale';
import SvgIcon from '../../components/shared/SvgIcon/SvgIcon';
import {Button, Col, Container, FormControl, Row} from 'react-bootstrap';
import styles from "../EnterYourName/EnterYourName.module.css";

const EnterYourName = (props) => {
    const [userNameValid, setUserNameValid] = useState(true);
    const [userName, setUserName] = useState('');
    console.log(props)
    const joinRoom = () => {
        setUserNameValid(!!userName);
        if (userName) {
            sessionStorage.setItem('userName', userName)
            props.history.push(`/room/room_${props.params.roomId}`);
        }
    };

    return (
        <Container className="my-auto">
            <row>
                <div className={`${styles.inputCol} pt-2 pb-2 pl-2 pr-2`}>
                    <Slide left>
                        <h3>Enter Your Name</h3>
                        <FormControl isInvalid={!userNameValid} className={'mb-2'}
                                     onChange={event => setUserName(event.target.value)}/>
                        <Button className="btn-block"
                                variant="primary" type="submit"
                                onClick={joinRoom}>
                            Join Room
                        </Button>
                    </Slide>
                </div>
            </row>
        </Container>
    );
};

export default EnterYourName;
