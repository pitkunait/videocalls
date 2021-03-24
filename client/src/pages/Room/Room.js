import React, { Component, createRef } from 'react';
import Peer from 'simple-peer';
import styled from 'styled-components';
import socket from '../../socket';
import VideoCard from '../../components/Video/VideoCard';
import BottomBar from '../../components/BottomBar/BottomBar';
import Chat from '../../components/Chat/Chat';
import Modal from 'react-modal';


class Room extends Component {

    screenTrackRef = createRef();

    state = {
        justJoined: true,
        displayUsers: false,
        screenShare: false,
        displayChat: false,
        userVideoAudio: {
            localUser: { video: true, audio: true },
        },
        userStream: null,
        peers: [],
        currentUserId: null,
        roomId: this.props.match.params.roomId,
    };

    constructor(props) {
        super(props);
    }

    getStream = async() => {
        return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    };

    initRoom = async() => {
        const userStream = await this.getStream();
        const currentUserId = socket.id;
        this.setState({ userStream, currentUserId });
        console.log(this.state.justJoined)
        socket.on('FE-user-join', this.onUserJoined);
        socket.on('FE-receive-call', this.onReceiveCall);
        socket.on('FE-call-accepted', this.onCallAccepted);
        socket.on('FE-user-leave',({userId}) =>  this.removePeer(userId));
        socket.on('FE-toggle-camera', this.onToggleCamera);
        socket.emit('BE-join-room', { roomId: this.state.roomId, userName: this.state.currentUserId });
    };

    async componentDidMount() {
        await this.initRoom();
    }

    componentWillUnmount() {
        socket.emit('BE-leave-room', { roomId: this.state.roomId })
    }

    onUserJoined = (users) => {
        console.log('User Joined', users);
        const justJoined = this.state.justJoined;
        if (justJoined) {
            const peers = [];
            const userVideoAudio = { ...this.state.userVideoAudio };
            users.forEach(({ userId, info }) => {
                const { userName, video, audio } = info;
                if (userId !== this.state.currentUserId && !this.findPeer(userId)) {
                    const peer = this.createPeer(userId, this.state.currentUserId);
                    peer.userName = userName;
                    peer.peerID = userId;
                    peers.push(peer);
                    userVideoAudio[peer.userName] = { video, audio };
                }
            });
            if (peers.length > 0) {
                console.log('Updating peers', [...this.state.peers, ...peers]);
                this.setState({ peers, userVideoAudio });
            }
            this.setState({ justJoined: !justJoined });
        }

    };

    onReceiveCall = ({ signal, from, info }) => {
        let { userName, video, audio } = info;
        const peerIdx = this.findPeer(from);
        if (!peerIdx) {
            console.log('[RECEIVING CALL FROM]', info.userName);
            const peer = this.receivePeer(signal, from);
            peer.userName = userName;
            peer.peerID = userName;
            const peers = [...this.state.peers, peer];
            const setUserVideoAudio = { ...this.state.userVideoAudio, [peer.userName]: { video, audio } };
            this.setState({ peers, setUserVideoAudio });
        }
    };

    onCallAccepted = ({ signal, answerId }) => {
        const peer = this.findPeer(answerId);
        peer.signal(signal);
    };

    removePeer = (userId) => {
        console.log('[PEER LEFT]', userId);
        const peers = this.state.peers.filter((peer) => peer.peerID !== userId);
        this.setState({ peers });
    }

    onToggleCamera = ({ userId, switchTarget }) => {
        const peerIdx = this.findPeer(userId);
        const userVideoAudio = { ...this.state.userVideoAudio };
        const peer = userVideoAudio[peerIdx.userName];
        if (switchTarget === 'video') {
            peer.video = !peer.video;
        } else {
            peer.audio = !peer.audio;
        }
        this.setState({ userVideoAudio });
    };

    createPeer(userId, caller) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: this.state.userStream,
        });

        peer.on('signal', (signal) => {
            console.log('CALLING', userId);
            socket.emit('BE-call-user', {
                userToCall: userId,
                from: caller,
                signal,
            });
        });

        peer.on('disconnect', () => {
            peer.destroy();
            this.removePeer(userId)
        });

        peer.on('stream', (stream) => {
            console.log('RECEIVING STREAM FROM', userId, stream.id);
            peer.videoStream = stream;
            this.setState([...this.state.peers]);
        });

        return peer;
    }

    receivePeer(incomingSignal, callerId) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: this.state.userStream,
        });

        peer.on('signal', (signal) => {
            socket.emit('BE-accept-call', { signal, to: callerId });
        });

        peer.on('close', () => {
            console.log("FADFNKAJFNAJFNAIJIJNJNOUYBIUY")
            peer.destroy();
            this.removePeer(callerId)
        });

        peer.on('stream', (stream) => {
            console.log('RECEIVING STREAM FROM', callerId, stream.id);
            peer.videoStream = stream;
            this.setState([...this.state.peers]);
        });

        peer.signal(incomingSignal);

        return peer;
    }

    findPeer(id) {
        return this.state.peers.find((p) => p.peerID === id);
    }

    clickChat = (e) => {
        e.stopPropagation();
        const displayChat = !this.state.displayChat;
        this.setState({ displayChat });
    };

    clickUsers = (e) => {
        e.stopPropagation();
        const displayUsers = !this.state.displayUsers;
        this.setState({ displayUsers });
    };

    goToBack = (e) => {
        e.preventDefault();
        socket.emit('BE-leave-room', { roomId: this.state.roomId, leaver: this.state.currentUserId });
        sessionStorage.removeItem('user');
        window.location.href = '/';
    };

    toggleCameraAudio = (e) => {
        // const target = e.target.getAttribute('data-switch');
        //
        //
        // setUserVideoAudio((preList) => {
        //     let videoSwitch = preList['localUser'].video;
        //     let audioSwitch = preList['localUser'].audio;
        //
        //     if (target === 'video') {
        //         const userVideoTrack = userStream.getVideoTracks()[0];
        //         videoSwitch = !videoSwitch;
        //         userVideoTrack.enabled = videoSwitch;
        //     } else {
        //         const userAudioTrack = userStream.getAudioTracks()[0];
        //         audioSwitch = !audioSwitch;
        //
        //         if (userAudioTrack) {
        //             userAudioTrack.enabled = audioSwitch;
        //         } else {
        //             userStream.getAudioTracks()[0].enabled = audioSwitch;
        //         }
        //     }
        //
        //     return {
        //         ...preList,
        //         localUser: { video: videoSwitch, audio: audioSwitch },
        //     };
        // });
        //
        // socket.emit('BE-toggle-camera-audio', { roomId, switchTarget: target });
    };

    clickScreenSharing = () => {
        // if (!screenShare) {
        //     navigator.mediaDevices
        //         .getDisplayMedia({ cursor: true })
        //         .then((stream) => {
        //             const screenTrack = stream.getTracks()[0];
        //
        //             peersRef.current.forEach(({ peer }) => {
        //                 // replaceTrack (oldTrack, newTrack, oldStream);
        //                 peer.replaceTrack(
        //                     peer.streams[0]
        //                         .getTracks()
        //                         .find((track) => track.kind === 'video'),
        //                     screenTrack,
        //                     userStream,
        //                 );
        //             });
        //
        //             // Listen click end
        //             screenTrack.onended = () => {
        //                 peersRef.current.forEach(({ peer }) => {
        //                     peer.replaceTrack(
        //                         screenTrack,
        //                         peer.streams[0]
        //                             .getTracks()
        //                             .find((track) => track.kind === 'video'),
        //                         userStream,
        //                     );
        //                 });
        //                 setScreenShare(false);
        //             };
        //             setUserStream(stream);
        //             screenTrackRef.current = screenTrack;
        //             setScreenShare(true);
        //         });
        // } else {
        //     screenTrackRef.current.onended();
        // }
    };

    render() {
        console.log(this.state.peers)
        return (
            <RoomContainer>
                <VideoAndBarContainer>
                    <VideoContainer>
                        <VideoCard stream={this.state.userStream} muted/>
                        {this.state.peers.map((peer, index) => <VideoCard key={index} stream={peer.videoStream}/>)}
                    </VideoContainer>
                    <BottomBar
                        clickScreenSharing={this.clickScreenSharing}
                        clickChat={this.clickChat}
                        clickUsers={this.clickUsers}
                        goToBack={this.goToBack}
                        toggleCameraAudio={this.toggleCameraAudio}
                        userVideoAudio={this.state.userVideoAudio['localUser']}
                        screenShare={this.screenShare}
                    />
                </VideoAndBarContainer>


                <Modal
                    isOpen={this.displayUsers}
                    style={modalChatStyle}
                    onRequestClose={this.clickUsers}
                >
                    <h1>room ID : {this.state.roomId}</h1>
                    <h1>Users:</h1>
                    {this.state.peers.map((item, index) => <h1 key={index}>{item.peerID}</h1>)}

                    <button onClick={this.clickUsers}>close</button>
                </Modal>

                <Chat display={this.state.displayChat} roomId={this.state.roomId}/>
            </RoomContainer>
        );
    }

};

const modalChatStyle = styled.div`
  align-items: end;
  //display: flex;
  //width: 100%;
  //max-height: 100vh;
  //flex-direction: row;
  top: 50%;
  left: 50%;
  //right: auto;
  //bottom: auto;
  margin-right: -50%;
  transform: translate(-50%, -50%)
`;

const RoomContainer = styled.div`
  display: flex;
  width: 100%;
  max-height: 100vh;
  flex-direction: row;
`;

const VideoContainer = styled.div`
  max-width: 100%;
  height: 92%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  align-items: center;
  padding: 15px;
  box-sizing: border-box;
  gap: 10px;
`;

const VideoAndBarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;

const UserName = styled.div`
  position: absolute;
  font-size: calc(20px + 5vmin);
  z-index: 1;
`;


export default Room;
