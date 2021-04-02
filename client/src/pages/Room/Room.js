import React, { Component, createRef } from 'react';
import Peer from 'simple-peer';
import styled from 'styled-components';
import socket from '../../socket';
import VideoCard from '../../components/Video/VideoCard';
import BottomBar from '../../components/BottomBar/BottomBar';
import Chat from '../../components/Chat/Chat';
import UsersModal from '../../components/UsersModal/UsersModal';


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
        currentUserName: '',
        roomId: this.props.match.params.roomId,
    };

    getStream = async() => {
        return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    };

    initRoom = async(userName) => {
        const userStream = await this.getStream();
        const currentUserId = socket.id;
        this.setState({ userStream, currentUserId, currentUserName: userName });
        socket.on('FE-user-join', this.onUserJoined);
        socket.on('FE-receive-call', this.onReceiveCall);
        socket.on('FE-call-accepted', this.onCallAccepted);
        socket.on('FE-user-leave', ({ userId }) => this.removePeer(userId));
        socket.on('FE-toggle-camera', this.onToggleCamera);
        socket.emit('BE-join-room', { roomId: this.state.roomId, userId: this.state.currentUserId, userName });
    };

    async componentDidMount() {
        const userName = sessionStorage.getItem('userName')
        if (userName) {
            await this.initRoom(userName);
        }

    }

    componentWillUnmount() {
        socket.emit('BE-leave-room', { roomId: this.state.roomId });
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
                    userVideoAudio[peer.peerID] = { video, audio };
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
        let { userId, userName, video, audio } = info;
        const peerIdx = this.findPeer(from);
        if (!peerIdx) {
            console.log('[RECEIVING CALL FROM]', info.userName);
            const peer = this.receivePeer(signal, from);
            peer.userName = userName;
            peer.peerID = userId;
            const peers = [...this.state.peers, peer];
            const setUserVideoAudio = { ...this.state.userVideoAudio, [peer.peerID]: { video, audio } };
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
    };

    onToggleCamera = ({ userId, switchTarget }) => {
        const peerIdx = this.findPeer(userId);
        const userVideoAudio = { ...this.state.userVideoAudio };
        const peer = userVideoAudio[peerIdx.peerID];
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
            this.removePeer(userId);
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
            peer.destroy();
            this.removePeer(callerId);
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
                        <VideoCard stream={this.state.userStream} muted userName={this.state.currentUserName}/>
                        {this.state.peers.map((peer, index) => <VideoCard key={index} stream={peer.videoStream} userName={peer.userName}/>)}
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
                <UsersModal
                    displayUsers={this.state.displayUsers}
                    peers={this.state.peers}
                    roomId={this.state.roomId}
                    socketId={socket.id}
                    clickUsers={this.clickUsers}/>
                <Chat
                    display={this.state.displayChat}
                    roomId={this.state.roomId}/>
            </RoomContainer>
        );
    }
}

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


export default Room;
