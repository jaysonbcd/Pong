class Room {
     constructor(roomId) {
         this.roomId = roomId;
     }

     getRoomId () {
         return this.roomId
     }

     displayBoard(message) {
         $('.menu').css('display', 'none');
         $('.main_game').css('display', 'block');
         $('#userHello').html(message);
     }
 }