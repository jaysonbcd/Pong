class Player {
    constructor(name, position) {
        this.name = name;
        this.originalPosition = position;
        this.width = 10;
        this.height = 50;
        this.goUp = false;
        this.goDown = false;
        this.score = 0;
        if (this.originalPosition === 'left') {
            this.color = "#3333ff";
            this.posX = 30;
            this.posY = 200;
        }
        else if (this.originalPosition === 'right') {
            this.color = "#ff1a1a";
            this.posX = 650;
            this.posY = 200;
        }
    }
    getPlayerName() {
        return this.name;
    }
     getPlayerPosition() {
         return this.originalPosition;
     }

     getScore () {
         return this.score;
     }

     setScore () {
         this.score = score;
     }

     setPosition (posY) {
         this.posY = posY;
     }
 }