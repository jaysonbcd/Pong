class Game {
    constructor(ball) {
        this.groundWidth = 700;
        this.groundHeight = 400;
        this.groundColor = "#000000";
        this.netWidth = 6;
        this.netColor = "#FFFFFF";
        this.scorePosPlayer1 = 280;
        this.scorePosPlayer2 = 365;
        this.groundLayer = null;
        this.startGame = null;
        this.scoreToWin = 6;
        this.ball = ball;
        this.playerOne = null;
        this.playerTwo = null;
         this.letsgo = false;
         this.amIPlayerOne = false;
         this.whoStart = false;
         this.exitGame = false;  
     }

     getPlayerOne() {
        return this.playerOne
    }
    getPlayerTwo() {
        return this.playerTwo
    }
    getLetsGo() {
        return this.letsgo;
    }
    getBall() {
        return this.ball;
    }
    setPlayerOne(playerOne) {
        this.playerOne = playerOne;
    }
    setPlayerTwo(playerTwo) {
        this.playerTwo = playerTwo;
        if (this.playerOne && this.playerTwo) {
            this.letsgo = true;
        }
    }
    setLetsGo(letsgo) {
        this.letsgo = letsgo;
    }

    init() {

    this.startGame = document.getElementById('start_button');
    this.quitGame = document.getElementById('quit_button');
    this.groundLayer = game.display.createLayer("terrain", this.groundWidth, this.groundHeight, undefined, 0, "#000000", 0, 0);

   game.display.drawRectangleInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth / 2 - this.netWidth / 2, 0);
   this.scoreLayer = game.display.createLayer("score", this.groundWidth, this.groundHeight, undefined, 1, undefined, 0, 0);
   this.playersBallLayer = game.display.createLayer("joueursetballe", this.groundWidth, this.groundHeight, undefined, 2, undefined, 0, 0);
   this.displayScore(this.playerOne.score, this.playerTwo.score);
   this.displayBall();
   this.displayPlayers();
    this.initKeyboard(game.control.onKeyDown, game.control.onKeyUp);
    this.initMouse(game.control.onMouseMove);
    this.start_the_game()
    this.quit_the_game()
    // game.ia.setPlayerAndBall(this.playerTwo, this.ball);

}
displayScore(scorePlayer1, scorePlayer2) {
   game.display.drawTextInLayer(this.scoreLayer, scorePlayer1, "60px Arial", "#FFFFFF", this.scorePosPlayer1, 55);
   game.display.drawTextInLayer(this.scoreLayer, scorePlayer2, "60px Arial", "#FFFFFF", this.scorePosPlayer2, 55);
}
displayBall() {
   game.display.drawRectangleInLayer(this.playersBallLayer, this.ball.width, this.ball.height, this.ball.color, this.ball.posX, this.ball.posY);
}
displayPlayers() {
   game.display.drawRectangleInLayer(this.playersBallLayer, this.playerOne.width, this.playerOne.height, this.playerOne.color, this.playerOne.posX, this.playerOne.posY);
   game.display.drawRectangleInLayer(this.playersBallLayer, this.playerTwo.width, this.playerTwo.height, this.playerTwo.color, this.playerTwo.posX, this.playerTwo.posY);
}
moveBall() {

    if (this.ball.start_game && this.whoStart) {
        this.displayBall()
        this.ball.move();
        this.ball.bounce(this);
   }
}
clearLayer(targetLayer) {
   targetLayer.clear();
}
initKeyboard(onKeyDownFunction, onKeyUpFunction) {
   window.onkeydown = onKeyDownFunction;
   window.onkeyup = onKeyUpFunction;
}
movePlayer1() {
   if (game.amIPlayerOne) {
       if (game.control.controlSystem == "KEYBOARD") {
           // keyboard control
           if (game.playerOne.goUp && game.playerOne.posY > 0) {
               game.playerOne.posY -= 7
               return game.playerOne.posY;
           } else if (game.playerOne.goDown && game.playerOne.posY < game.groundHeight - game.playerOne.height) {
               game.playerOne.posY += 7;
               return game.playerOne.posY;
           }
       }
   }
   return false
}
movePlayer2() {
   if (!game.amIPlayerOne) {
       if (game.control.controlSystem == "MOUSE") {
           // mouse control
           if (game.playerTwo.goUp && game.playerTwo.posY > game.control.mousePointer) {
               game.playerTwo.posY -= 7;
               return game.playerTwo.posY;
           }
           else if (game.playerTwo.goDown && game.playerTwo.posY < game.control.mousePointer && game.playerTwo.posY < game.groundHeight - game.playerTwo.height) {
               game.playerTwo.posY += 7;
               return game.playerTwo.posY;
           }
       }
   }
   return false
}
initMouse(onMouseMoveFunction) {
   window.onmousemove = onMouseMoveFunction;
}
collideBallWithPlayersAndAction() {
   if (this.ball.collide(game.playerOne)) {
       game.ball.directionX = -game.ball.directionX;
       
   }
   if (this.ball.collide(game.playerTwo)) {
       game.ball.directionX = -game.ball.directionX;
     
   }
}
checkGoal() {
         if (this.ball.goal(this.playerOne)) {
             this.playerTwo.score++;
             this.ball = new Ball('left');
             this.whoStart = false
         }
         else if (this.ball.goal(this.playerTwo)) {
             this.playerOne.score++;
             this.ball = new Ball('right')
             this.whoStart = false
         }
         this.scoreLayer.clear();
         this.displayScore(this.playerOne.score, this.playerTwo.score)
    }
    checkVictory() {
        let winner = null;
        if (this.playerOne.score === this.scoreToWin)
            winner = this.getPlayerOne().getPlayerName() + ' wins !';
        else if (this.playerTwo.score === this.scoreToWin)
            winner = this.getPlayerTwo().getPlayerName() + ' wins !';
        if (winner !== null) {
            this.playersBallLayer.clear();
            this.ball.posX = this.groundHeight / 2
            this.ball.posY = this.groundWidth / 2
            this.ball.start_game = false;
            game.display.drawScoreLayer(this.playersBallLayer, winner, this.groundWidth, this.groundHeight);
        }
    }
     start_the_game() {
         this.startGame.onclick = game.control.startTheGame;
     }
quit_the_game() {
    this.quitGame.onclick = game.control.quitTheGame;
}
}

var game = new Game(new Ball('left'));
