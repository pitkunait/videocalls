import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import styles from './VideoCard.module.css'

const VideoCard = ({ userName, stream, muted}) => {

    //
    // function writeUserName(userName, index) {
    //     if (userVideoAudio.hasOwnProperty(userName)) {
    //         if (!userVideoAudio[userName].video) {
    //             return <UserName key={userName}>{userName}</UserName>;
    //         }
    //     }
    // }

    const renderVideo = useMemo(() => (
        <video
            className={styles.video}
            muted={muted}
            playsInline
            autoPlay
            ref={(e) => {if (e) e.srcObject = stream}}
        />
    ), [stream, muted])

    useEffect(() => {console.log('Loaded')}, [])


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
        <div className={styles.videoCard}>
            <p>
                {userName}
            </p>
            {/*{writeUserName(peer.userName)}*/}
            <FaIcon onClick={expandScreen} className="fas fa-expand"/>
            {renderVideo}
        </div> : null);
};


const FaIcon = styled.i`
  display: none;
  position: absolute;
  right: 15px;
  top: 15px;
`;





export default VideoCard;
