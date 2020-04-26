
(function () {
    let socket = io();
    var requestAnimId;

    var initialisation = function () {
        // le code de l'initialisation
        game.init();
        requestAnimId = window.requestAnimationFrame(main); // premier appel de main au rafraîchissement de la page
    }

    var main = function () {
        // le code du jeu
        game.clearLayer(game.playersBallLayer);
        updatePlayers()
        game.displayBall();
        startGame()
        game.displayPlayers();
        updateBall()
        game.moveBall();
        game.checkGoal();
        game.checkVictory();
        // game.ia.move();
        checkEndGame();
        game.collideBallWithPlayersAndAction();
        requestAnimId = window.requestAnimationFrame(main); // rappel de main au prochain rafraîchissement de la page
    }
   
   
    var updatePlayers = function () {
        if (game.amIPlayerOne) {
            let player1_pos = game.movePlayer1();
            if (player1_pos) {
                socket.emit('updatePlayer', { room: this.pong.getRoomId(), player1: true, position: player1_pos })
            }
        }
        else {
            let player2_pos = game.movePlayer2();
            if (player2_pos) {
                socket.emit('updatePlayer', { room: this.pong.getRoomId(), player1: false, position: player2_pos })
            }
        }
    }

    var startGame = function () {
        if (game.amIPlayerOne && game.whoStart) {
            socket.emit('updateGameStatus', { room: this.pong.getRoomId(), player1: true, start: true })
        }
        else if (!game.amIPlayerOne && game.whoStart) {
            socket.emit('updateGameStatus', { room: this.pong.getRoomId(), player1: false, start: true })
        }
    }

    var updateBall = function () {
        if (game.amIPlayerOne && game.whoStart) {
            socket.emit('updateBall', { room: this.pong.getRoomId(), posX: game.getBall().getPosX(), posY: game.getBall().getPosY() })
        }
        else if (!game.amIPlayerOne && game.whoStart) {
            socket.emit('updateBall', { room: this.pong.getRoomId(), posX: game.getBall().getPosX(), posY: game.getBall().getPosY() })
        }
    }

    var checkEndGame = function() {
        if(game.exitGame && game.amIPlayerOne){
            socket.emit('endGame', {room: this.pong.getRoomId(), player1: true});
        }
        else if (game.exitGame && !game.amIPlayerOne){
            socket.emit('endGame', {room: this.pong.getRoomId(), player1: false});
        }
    }

    // Creation of the Player one
    $('#new').on('click', () => {
        const name = $('#nameNew').val();
        if (!name) {
            alert('Please enter your name.');
            return;
        }
        socket.emit('createGame', { name });
      
    });
    // Creation of the pong for P1
    socket.on('newGame', (data) => {
        const message =
            `Hello, ${data.name}. Please ask your friend to enter Game ID: 
      ${data.room}. Waiting for player 2...`;

      this.pong = new Room(data.room);
      this.pong.displayBoard(message);
     
    });

    $('#join').on('click', () => {
        const name = $('#nameJoin').val();
        const roomID = $('#room').val();
        if (!name || !roomID) {
            alert('Please enter your name and game ID.');
            return;
        }
        socket.emit('joinGame', { name, room: roomID });
      
    });

    socket.on('player1', (data) => {
        const message = `Hello, ${data.player1.name}`;
        $('#userHello').html(message);
       // initialisation();
       game.amIPlayerOne = true;
    });

    socket.on('player2', (data) => {
        const message = `Hello, ${data.name}`;

        this.pong = new Room(data.room);
        this.pong.displayBoard(message);
       // initialisation();
    });
    socket.on('playgame', (data) => {
        player1 = new Player(data.player1.name, data.player1.position)
        game.setPlayerOne(player1)
        player2 = new Player(data.player2.name, data.player2.position)
        game.setPlayerTwo(player2)
        initialisation();

    });
    socket.on('movePlayers', (data) => {
        if (data.player1) {
            game.getPlayerOne().setPosition(data.position)
        }
        else {
            game.getPlayerTwo().setPosition(data.position)
        }
    })
    socket.on('moveBall', (data) => {
        game.getBall().setPosX(data.posX);
        game.getBall().setPosY(data.posY);
    });
    socket.on('updateStart', (data) => {
        game.getBall().setStatus(data.start);
    });

    socket.on('exitGame', (data) => {
        if(data.player1){
            message = game.getPlayerOne().getPlayerName() + ' leaves the room !'
        }
        else {
            message = game.getPlayerTwo().getPlayerName() + ' leaves the room !'
        }
        alert(message);
        location.reload();
    });
    socket.on('err', (data) => {
        alert(data.message);
        location.reload();
    });

    class Player {
        constructor(name, position) {
            this.name = name;
            this.position = position;
        }
        getPlayerName() {
            return this.name;
        }
        getPlayerPosition() {
            return this.position;
        }
    }

    class Game {
        constructor(roomId) {
            this.roomId = roomId;
        }

        displayBoard(message) {
            $('.menu').css('display', 'none');
            $('.main_game').css('display', 'block');
            $('#userHello').html(message);
        }
    }
}());