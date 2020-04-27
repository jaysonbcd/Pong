(function () {
    let pong = game;
   let newPartie;
   let player;
   let socket = io();
    var requestAnimId;

    class Game {
        constructor(roomId) {
            this.roomId = roomId;
        }
        displayGame(message) {
            document.getElementById('menu').style.display='none';
            document.getElementById('AccueilPart').style.display='block';
            document.getElementById('message').textContent=message;
        }
        getGameId(){
            return this.roomId;
        }
    }
    
    class Player {
        constructor(position) {
            this.position = position;
        }
        getPlayerPosition() {
            return this.position;
        }
    }
    var initialisation = function () {
   
        game.init();
        requestAnimId = window.requestAnimationFrame(main);
      
    }

    var main = function () {
        //prog du jeux 
     if(!game.iaGame)
     readyCheck();
     game.clearLayer(game.playersBallLayer);
     game.movePlayers();
     if(!game.iaGame)
     SPosition();
     game.displayPlayers();
     game.moveBall();
     if(!game.iaGame)
     ballPosition();
      if ( game.ball.inGame ) {
          game.lostBall();
          if(!game.iaGame)
          scoreCheck();
      }
      if(game.iaGame)
      game.ai.move();
     game.collideBallWithPlayersAndAction();
     requestAnimId = window.requestAnimationFrame(main);
   }

   var SPosition = function(){
    if ( game.playerOne.goDown || game.playerOne.goUp) socket.emit('moving', { roomId : this.newPartie.getGameId(),player : 'player1' ,posY : game.playerOne.posY});
    else if ( game.playerTwo.goDown || game.playerTwo.goUp) socket.emit('moving', {roomId : this.newPartie.getGameId(), player : 'player2' ,posY : game.playerTwo.posY});
    else if ( game.playerThree.goDown || game.playerThree.goUp) socket.emit('moving', {roomId : this.newPartie.getGameId(), player : 'player3' ,posY : game.playerThree.posY});
    else if ( game.playerFour.goDown || game.playerFour.goUp) socket.emit('moving', {roomId : this.newPartie.getGameId(), player : 'player4' ,posY : game.playerFour.posY});
    }

    var ballPosition = function(){
    if(game.ball.inGame)
        socket.emit('ball', {roomId :this.newPartie.getGameId(), position : {posX : game.ball.posX, posY : game.ball.posY}});
    }

    var scoreCheck = function(){
        if(game.ball.lost(game.playerOne))
            socket.emit('score',{roomId : this.newPartie.getGameId(), player : 'player1', score :{player1 : game.playerOne.score, player2 : game.playerTwo.score}});
        else if(game.ball.lost(game.playerTwo))
            socket.emit('score',{roomId : this.newPartie.getGameId(), player : 'player2', score :{player1 : game.playerOne.score, player2 : game.playerTwo.score}});
    }

    var readyCheck = function(){
        if(!game.twoVStwo){
            if(game.beginingP1 && !game.playerOne.ready && game.playerOne.amI){
                socket.emit('ready',{roomId : this.newPartie.getGameId(),player : 'player1'});
                game.playerOne.ready=true;
            }
            if(game.beginingP2 && !game.playerTwo.ready  && game.playerTwo.amI){
                socket.emit('ready',{roomId : this.newPartie.getGameId(),player : 'player2'});
                game.playerTwo.ready=true;
            }
        }else{
            if(game.beginingP1 && !game.playerOne.ready && game.playerOne.amI){
                socket.emit('ready',{roomId : this.newPartie.getGameId(),player : 'player1'});
                game.playerOne.ready=true;
            }
            if(game.beginingP2 && !game.playerTwo.ready  && game.playerTwo.amI){
                socket.emit('ready',{roomId : this.newPartie.getGameId(),player : 'player2'});
                game.playerTwo.ready=true;
            }
            if(game.beginingP4 && !game.playerFour.ready  && game.playerFour.amI){
                socket.emit('ready',{roomId : this.newPartie.getGameId(),player : 'player4'});
                game.playerFour.ready=true;
            }
            if(game.beginingP3 && !game.playerThree.ready  && game.playerThree.amI){
                socket.emit('ready',{roomId : this.newPartie.getGameId(),player : 'player3'});
                game.playerThree.ready=true;
            }
           
        }
        
    }

    
   

   //creation du j1 de gauche
   document.getElementById('j').onclick = ()=> {
    socket.emit('createNewGame', {nbPlayer : 2});
};

    document.getElementById('jIA').onclick = ()=>{
        game.iaGame=true;
        game.playerOne.amI=true;
        document.getElementById('menu').style.display='none';
        document.getElementById('AccueilPart').style.display='block';
        document.getElementById('startGame').disabled=false;
        document.getElementById('message').textContent=' EURO SPORT LIVE !'
        initialisation();
    };

document.getElementById('j2vs2').onclick = ()=>{
    game.twoVStwo = true;
    socket.emit('createNewGame', {nbPlayer : 4});
};

// Creer partie par P1
socket.on('newGame', (data) => {
    let message;
    if(!game.twoVStwo)
        message =`Game ID : ${data.roomId} ! Veuillez patienter un nouveau joueur...`;
    else{ 
        message = `Game ID : ${data.roomId} !  Veuillez patienter un autre nouveau joueur...`;
        game.playerOne.amI=true;
    }
    this.newPartie = new Game(data.roomId);
    this.newPartie.displayGame(message);
    game.playerOne.isSelected=true;
});

//rejoindre un match
document.getElementById('joinGame').onclick = () => {
    const roomID = document.getElementById('RoomName').value;
    if (!roomID) {
        alert('Please enter the name of the game.');
        return;
    }
    if(!game.twoVStwo){
        socket.emit('joinGame', {roomId: roomID, places : 2});
       
    }
    else{
        socket.emit('joinGame', {roomId: roomID, places : 4});
    }
    
};


socket.on('player1', (data) => {
    game.playerOne.amI=true;
    game.playerTwo.isSelected=true;
    initialisation();
    this.newPartie.displayGame('Game Id : '+data.roomId);
});

socket.on('newPlayer',(data)=>{
    if(data.player==2)game.playerTwo.isSelected=true;
    else if(data.player==3)game.playerThree.isSelected=true;
    else if(data.player==4){
        game.playerFour.isSelected=true;
        initialisation();
        this.newPartie.displayGame('Game Id : '+data.roomId);
    }
});

socket.on('player2', (data) => {
    this.newPartie = new Game(data.roomId);
    this.newPartie.displayGame('Game Id : '+data.roomId);
    document.getElementById('startGame').disabled=false;
    game.playerOne.isSelected=true;
    game.playerTwo.isSelected=true;
    game.playerTwo.amI=true;
    initialisation();
});

socket.on('2V2player2', (data) => {
    this.newPartie = new Game(data.roomId);
    this.newPartie.displayGame(`Game ID : ${data.roomId} ! Veuillez attendre un nouveau joueur ...`);
    game.twoVStwo=true;
    game.playerOne.isSelected=true;
    game.playerTwo.isSelected=true;
    game.playerTwo.amI=true;
});
socket.on('2V2player3',(data)=>{
    this.newPartie = new Game(data.roomId);
    this.newPartie.displayGame(`Game ID : ${data.roomId} ! Veuillez attendre un autre joueur...`);
   
    game.twoVStwo=true;
    game.playerOne.isSelected=true;
    game.playerTwo.isSelected=true;
    game.playerThree.isSelected=true;
    game.playerThree.amI=true;

});

socket.on('2V2player4',(data)=>{
    this.newPartie = new Game(data.roomId);
    this.newPartie.displayGame('Game Id : '+data.roomId);
    document.getElementById('startGame').disabled=false;
    game.twoVStwo=true;
    game.playerOne.isSelected=true;
    game.playerTwo.isSelected=true;
    game.playerThree.isSelected=true;
    game.playerFour.isSelected=true;
    game.playerFour.amI=true;
    initialisation();

});

socket.on('player1move',(data)=>{
    if(game.playerTwo.amI || game.playerThree.amI || game.playerFour.amI)game.playerOne.posY=data.posY;
});

socket.on('player2move',(data)=>{
    if(game.playerOne.amI || game.playerThree.amI || game.playerFour.amI)game.playerTwo.posY=data.posY;
});

socket.on('player3move',(data)=>{
    if(game.playerOne.amI || game.playerTwo.amI || game.playerFour.amI)game.playerThree.posY=data.posY;
});

socket.on('player4move',(data)=>{
    if(game.playerOne.amI || game.playerTwo.amI || game.playerThree.amI)game.playerFour.posY=data.posY;
});

socket.on('ballmove',(data)=>{
        game.ball.posX=data.position.posX;
        game.ball.posY=data.position.posY;
});

socket.on('scoreUpdate',(data)=>{
    if(data.player==='player1'){
        game.playerOne.engaging=true;
        if(game.twoVStwo)game.playerThree.engaging=true;
    }
    else if(data.player==='player2'){
       game.playerTwo.engaging=true;
       if(game.twoVStwo)game.playerFour.engaging=true;
    }
    game.playerOne.score=data.score.player1;
    game.playerTwo.score=data.score.player2;
    game.scoreLayer.clear();
    game.displayScore(game.playerOne.score,game.playerTwo.score);
    if((game.playerOne.amI || game.playerThree.amI) && (game.playerOne.score==='V' || game.playerTwo.score==='V')){
        game.gameOn=false;
        document.getElementById('messageWaiting').textContent='REMATCH';
        document.getElementById('messageWaiting').style.display='block';
        document.getElementById('startGame').disabled=false;
        game.playerOne.ready=false;
        game.playerTwo.ready=false;
        if(game.twoVStwo){
            game.playerThree.ready=false;
            game.playerFour.ready=false;
            game.beginingP3=false;
            game.beginingP4=false;
        }
        game.beginingP1=false;
        game.beginingP2=false;
    }
    else if((game.playerTwo.amI || game.playerFour.amI) && (game.playerOne.score==='V' || game.playerTwo.score==='V')){
        game.gameOn=false;
        document.getElementById('messageWaiting').textContent='REMATCH';
        document.getElementById('messageWaiting').style.display='block';
        document.getElementById('startGame').disabled=false;
        game.playerOne.ready=false;
        game.playerTwo.ready=false;
        if(game.twoVStwo){
            game.playerThree.ready=false;
            game.playerFour.ready=false;
            game.beginingP3=false;
            game.beginingP4=false;
        }
        game.beginingP1=false;
        game.beginingP2=false;
    }
});

socket.on('playerReady',(data)=>{
    if(!game.twoVStwo){
        if(data.player==='player1')game.beginingP1=true;
        if(data.player==='player2')game.beginingP2=true;
        if(game.beginingP1 && game.beginingP2) {
            document.getElementById('messageWaiting').textContent='';
            document.getElementById('messageWaiting').style.display='none';
            document.getElementById('startGame').disabled=true;
            game.reinitGame();
            game.gameOn = true;
            game.beginingP1=false;
            game.beginingP2=false;
        }
    }else{
        if(data.player==='player1')game.beginingP1=true;
        if(data.player==='player2')game.beginingP2=true;
        if(data.player==='player3')game.beginingP3=true;
        if(data.player==='player4')game.beginingP4=true;
        if(game.beginingP1 && game.beginingP2 && game.beginingP3 && game.beginingP4) {
            document.getElementById('messageWaiting').textContent='';
            document.getElementById('messageWaiting').style.display='none';
            document.getElementById('startGame').disabled=true;
            game.reinitGame();
            game.gameOn = true;
            game.beginingP1=false;
            game.beginingP2=false;
            game.beginingP3=false;
            game.beginingP4=false;
        }
    }

});

socket.on('err', (data) => {
    alert(data.message);
    location.reload();
});

  

}());