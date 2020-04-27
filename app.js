const express  = require('express');
const app      = express();
const path = require('path');
const port = 8080;
const server = require('http').Server(app);
const io = require('socket.io')(server);

require('dotenv-flow').config();
app.use(express.static('.'));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});
let roomName = 0;
let nbPlayer = 0;
io.on('connection', function (socket) {
    socket.on('Creer nouveau',(data)=>{
        this.roomName = ++roomName;
        nbPlayer = data.nbPlayer;
        socket.join(`room-`+roomName);
        socket.emit('nouveau Match', { roomId : `room-${roomName}` });
    })
    socket.on('joindre Match', function (data) {
        let room = io.nsps['/'].adapter.rooms[data.roomId];
        if(nbPlayer==2){
            if (room && room.length === 1) {
                socket.join(data.roomId);
                socket.broadcast.to(data.roomId).emit('J1', {roomId : data.roomId});
                socket.emit('j2', {roomId: data.roomId})
            } else {
                socket.emit('err', { message: 'Desole la salle est au maximum de sa capacite !' });
            }
        }else if(nbPlayer==4){
            if (room && room.length === 1) {
                socket.join(data.roomId);
                socket.broadcast.to(data.roomId).emit('nouveau joueur', {roomId : data.roomId, player : 2});
                socket.emit('2V2J2', {roomId: data.roomId})
            }else if (room && room.length === 2) {
                socket.join(data.roomId);
                socket.broadcast.to(data.roomId).emit('nouveau joueur', {roomId : data.roomId, player : 3});
                socket.emit('2V2J', {roomId: data.roomId})
            }else if (room && room.length === 3) {
                socket.join(data.roomId);
                socket.broadcast.to(data.roomId).emit('nouveau joueur', {roomId : data.roomId, player : 4});
                socket.emit('2V2J4', {roomId: data.roomId})
            }else {
                socket.emit('err', { message: 'Sorry the room is full !' });
            }
        }
    })
    
    
    socket.on('moving', (data)=>{
        if(data.player==='player1'){
            socket.broadcast.to(data.roomId).emit('player1move', {posY : data.posY});
        }else if(data.player==='player2'){
            socket.broadcast.to(data.roomId).emit('player2move', {posY : data.posY});
        }else if(data.player==='player3'){
            socket.broadcast.to(data.roomId).emit('player3move', {posY : data.posY});
        }else if(data.player==='player4'){
            socket.broadcast.to(data.roomId).emit('player4move', {posY : data.posY});
        }
        
    });

    socket.on('ball', (data)=>{
        socket.broadcast.to(data.roomId).emit('ballmove', {position : {posX : data.position.posX, posY : data.position.posY}});
    });

    socket.on('score', (data)=>{
        socket.broadcast.to(data.roomId).emit('scoreUpdate', {player : data.player ,score :{player1 : data.score.player1, player2 : data.score.player2}});
    });

    socket.on('ready', (data)=>{
        socket.emit('playerReady',{player : data.player});
        socket.broadcast.to(data.roomId).emit('playerReady',{player : data.player});
    });

    socket.on('disconnect', function () {
        io.emit('user disconnected');
    });


});



server.listen(port);
//server.listen(port);
console.log(title + ' is running on port : ' + port);