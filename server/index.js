const express = require('express');
const app = express();
const secure = require('express-force-https');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3001;
const path = require('path');


app.use(express.static(path.join(__dirname, 'public')));
app.use(secure);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('/*', function(req, res) {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

app.get('/ping', (req, res) => {
    console.log(req.secure);
    res
        .send({
            success: true,
        })
        .status(200);
});


// Socket
let socketList = {};
io.on('connection', (socket) => {
    console.log(`New User connected: ${socket.id}`);


    socket.on('disconnect', () => {
        socket.disconnect();
        console.log(`User disconnected: ${socket.id}`);
    });

    socket.on('disconnecting', function() {
        Object.entries(socket.rooms).map(([i, k]) => {
            socket.to(i).emit('FE-user-leave', { userId: socket.id });
        });
    });


    socket.on('list-rooms', () => {
        socket.emit('list-rooms', { rooms: io.sockets.adapter.rooms });
    });

    socket.on('BE-check-user', ({ roomId, userName }) => {
        let error = false;

        io.sockets.in(roomId).clients((err, clients) => {
            clients.forEach((client) => {
                if (socketList[client] === userName) {
                    error = true;
                }
            });
            socket.emit('FE-error-user-exist', { error });
        });
    });

    /**
     * Join Room
     */
    socket.on('BE-join-room', ({ roomId, userId, userName }) => {
        // Socket Join RoomName
        socket.join(roomId);
        socketList[socket.id] = { userId, userName, video: true, audio: true };

        // Set User List
        io.sockets.in(roomId).clients((err, clients) => {
            try {
                const users = clients.map(client => ({ userId: client, info: socketList[client] }));
                io.sockets.in(roomId).emit('FE-user-join', users);
            } catch ( e ) {
                io.sockets.in(roomId).emit('FE-error-user-exist', { err: true });
            }
        });
    });

    socket.on('BE-call-user', ({ userToCall, from, signal }) => {
        io.to(userToCall).emit('FE-receive-call', {
            signal,
            from,
            info: socketList[socket.id],
        });
    });

    socket.on('BE-accept-call', ({ signal, to }) => {
        io.to(to).emit('FE-call-accepted', {
            signal,
            answerId: socket.id,
        });
    });

    socket.on('BE-send-message', ({ roomId, msg, sender }) => {
        io.sockets.in(roomId).emit('FE-receive-message', { msg, sender });
    });

    socket.on('BE-leave-room', ({ roomId }) => {
        delete socketList[socket.id];
        socket.broadcast
            .to(roomId)
            .emit('FE-user-leave', { userId: socket.id, userName: [socket.id] });
        io.sockets.sockets[socket.id].leave(roomId);
    });

    socket.on('BE-toggle-camera-audio', ({ roomId, switchTarget }) => {
        if (switchTarget === 'video') {
            socketList[socket.id].video = !socketList[socket.id].video;
        } else {
            socketList[socket.id].audio = !socketList[socket.id].audio;
        }
        socket.broadcast
            .to(roomId)
            .emit('FE-toggle-camera', { userId: socket.id, switchTarget });
    });
});

http.listen(PORT, () => {
    console.log('Connected : 3001');
});
