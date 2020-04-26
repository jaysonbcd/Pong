const express = require('express');
 const app = express();
 const path = require('path');
 const port = process.env.SERVER_PORT || 8080
 const title = process.env.TITLE || 'PingPongGame'
 const server = require('http').Server(app);
 const io = require('socket.io')(server);

 let rooms = 0;
 let player1 = null;
 let player2 = null;

 require('dotenv-flow').config();
 app.use(express.static('.'));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});
io.on('connection', function (socket) {
     socket.on('createGame', function (data) {
         socket.join(`room-${++rooms}`);
         socket.emit('newGame', { name: data.name, room: `room-${rooms}` });
         player1 = {
             name: data.name, 
             position: 'left'
         };
     })

    // Connect the Player 2 to the room he requested. Show error if room full.
    socket.on('joinGame', function (data) {
        let room = io.nsps['/'].adapter.rooms[data.room];
        if (room && room.length === 1) {
            socket.join(data.room);
            socket.broadcast.to(data.room).emit('player1', {player1:player1});
             // io.sockets.in(data.room).emit('player1', {})
             socket.emit('player2', { name: data.name, room: data.room});
             player2 = {
                 name: data.name, 
                 position: 'right'
             };
             io.sockets.in(data.room).emit('playgame', {room: data.room, player1: player1, player2: player2})
         } else {
             socket.emit('err', { message: 'Sorry, The room is full!' });
         }
    });
    socket.on('updatePlayer', function (data) {
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('movePlayers', {player1: data.player1, position:data.position});
    });

    socket.on('updateBall', function (data) {
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('moveBall', {posX:data.posX, posY:data.posY});
    });

    socket.on('updateGameStatus', function (data) {
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('updateStart', {start: data.start});
    })


    socket.on('endGame', function (data) {
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('exitGame', {player1: data.player1});
    });
 });

 server.listen(port);
console.log(title + ' is running on port : ' + port);