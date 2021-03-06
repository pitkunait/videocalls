import React from 'react';
import styled from 'styled-components';
import styles from './BottomBar.module.css'

const BottomBar = ({
                       clickChat,
                       clickUsers,
                       goToBack,
                       toggleCameraAudio,
                       userVideoAudio,
                       clickScreenSharing,
                       screenShare,
                   }) => {
    return (
        <div className={styles.bottomBar}>
            <Left>
                <CameraButton onClick={toggleCameraAudio} data-switch="video">
                    <div>
                        {userVideoAudio.video ? (
                            <FaIcon className="fas fa-video"></FaIcon>
                        ) : (
                            <FaIcon className="fas fa-video-slash"></FaIcon>
                        )}
                    </div>
                    Camera
                </CameraButton>
                <CameraButton onClick={toggleCameraAudio} data-switch="audio">
                    <div>
                        {userVideoAudio.audio ? (
                            <FaIcon className="fas fa-microphone"></FaIcon>
                        ) : (
                            <FaIcon className="fas fa-microphone-slash"></FaIcon>
                        )}
                    </div>
                    Audio
                </CameraButton>
            </Left>
            <Center>
                <ChatButton onClick={clickUsers}>
                    <div>
                        <FaIcon className="fas fa-comments"></FaIcon>
                    </div>
                    Users
                </ChatButton>
                <ChatButton onClick={clickChat}>
                    <div>
                        <FaIcon className="fas fa-comments"></FaIcon>
                    </div>
                    Chat
                </ChatButton>
                {/*<ScreenButton onClick={clickScreenSharing}>*/}
                {/*    <div>*/}
                {/*        <FaIcon*/}
                {/*            className={`fas fa-desktop ${screenShare ? 'sharing' : ''}`}*/}
                {/*        ></FaIcon>*/}
                {/*    </div>*/}
                {/*    Share Screen*/}
                {/*</ScreenButton>*/}
            </Center>
            <Right>
                <StopButton onClick={goToBack}>Stop</StopButton>
            </Right>
        </div>
    );
};




const Left = styled.div`
  display: flex;
  align-items: center;

  margin-left: 15px;
`;

const Center = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const Right = styled.div``;

const ChatButton = styled.div`
  width: 75px;
  border: none;
  font-size: 0.9375rem;
  padding: 5px;

  :hover {
    background-color: #77b7dd;
    cursor: pointer;
    border-radius: 15px;
  }

  * {
    pointer-events: none;
  }
`;

const ScreenButton = styled.div`
  width: auto;
  border: none;
  font-size: 0.9375rem;
  padding: 5px;

  :hover {
    background-color: #77b7dd;
    cursor: pointer;
    border-radius: 15px;
  }

  .sharing {
    color: #ee2560;
  }
`;

const FaIcon = styled.i`
  width: 30px;
  font-size: calc(16px + 1vmin);
`;

const StopButton = styled.div`
  text-align: center;
  width: 50px;
  height: 30px;
  border: none;
  font-size: 0.9375rem;
  line-height: 30px;
  margin-right: 15px;
  background-color: #ee2560;
  border-radius: 15px;

  :hover {
    background-color: #f25483;
    cursor: pointer;
  }
`;

const CameraButton = styled.div`
  width: 75px;
  border: none;
  font-size: 0.9375rem;
  padding: 5px;

  :hover {
    background-color: #77b7dd;
    cursor: pointer;
    border-radius: 15px;
  }

  * {
    pointer-events: none;
  }

  .fa-microphone-slash {
    color: #ee2560;
  }

  .fa-video-slash {
    color: #ee2560;
  }
`;

export default BottomBar;
