import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';


const VideoCard = ({ userName, stream, muted}) => {

    //
    // function writeUserName(userName, index) {
    //     if (userVideoAudio.hasOwnProperty(userName)) {
    //         if (!userVideoAudio[userName].video) {
    //             return <UserName key={userName}>{userName}</UserName>;
    //         }
    //     }
    // }


    const expandScreen = (e) => {
        const elem = e.target;

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    };


    return (stream ?
        <VideoBox>
            <p>
                {stream.id}
            </p>
            {/*{writeUserName(peer.userName)}*/}
            <FaIcon onClick={expandScreen} className="fas fa-expand"/>
            <video
                muted={muted}
                playsInline
                autoPlay
                ref={(e) => {if (e) e.srcObject = stream}}
            />
        </VideoBox> : null);
};


const FaIcon = styled.i`
  display: none;
  position: absolute;
  right: 15px;
  top: 15px;
`;


const VideoBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > video {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  :hover {
    > i {
      display: block;
    }
  }
`;


export default VideoCard;
