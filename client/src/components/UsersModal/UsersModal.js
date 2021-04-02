import React from 'react';
import Modal from 'react-modal';


const UsersModal = ({displayUsers, roomId, socketId, peers, clickUsers}) => {
    return (
        <Modal
            isOpen={displayUsers}
            onRequestClose={clickUsers}
        >
            <h1>room ID : {roomId}</h1>
            <h1>Users: </h1>
            <h1>ME: {socketId}</h1>
            {peers.map((item, index) => <h1 key={index}>User {item.peerID}</h1>)}

            <button onClick={clickUsers}>close</button>
        </Modal>
    );
};

export default UsersModal;
