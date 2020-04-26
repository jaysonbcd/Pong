game.display = {
    container: "",

    layer: {
        name: "",
        canvas: "",
        context2D: "",
        posX: null,
        posY: null,
        width: "",
        height: "",
        backgroundColor: "",
        zIndex: "",
        clear : function() {
            this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
          }
    },

    createLayer: function (name, width, height, htmlContainer, zIndex, backgroundColor, x, y) {
        var layer = Object.create(this.layer);

        layer.canvas = window.document.createElement("canvas");

        layer.canvas.id = name;

        if (backgroundColor != undefined)
            layer.canvas.style.background = backgroundColor;

        layer.zIndex = zIndex
        layer.canvas.style.zIndex = zIndex;

        layer.width = width
        layer.canvas.width = width;

        layer.height = height
        layer.canvas.height = height;

        if (x != undefined)
            layer.posX = x;

        if (y != undefined)
            layer.posY = y;

        layer.canvas.style.position = "absolute";

        if (x != undefined)
            layer.canvas.style.left = x;

        if (y != undefined)
            layer.canvas.style.top = y;

        if (htmlContainer != undefined) {
            htmlContainer.appendChild(layer.canvas);
        } else {
            let terrain = document.getElementById('terrain')
            terrain.appendChild(layer.canvas);
        }

        layer.context2D = layer.canvas.getContext('2d');

        return layer;
    },

    drawRectangleInLayer: function (targetLayer, width, heigth, color, x, y) {
        targetLayer.context2D.fillStyle = color;
        targetLayer.context2D.fillRect(x, y, width, heigth);
    },

    drawTextInLayer : function(targetLayer, text, font, color, x, y) {
        targetLayer.context2D.font = font;
        targetLayer.context2D.fillStyle = color;
        targetLayer.context2D.fillText(text, x, y);
      },

      drawScoreLayer: function (targetLayer, winner, width, heigth) {
          targetLayer.context2D.fillStyle = "	#A8A8A8";
          targetLayer.context2D.font = "30px Arial";
          targetLayer.context2D.fillRect(width/4, heigth/4, width/2, heigth/2);
          targetLayer.context2D.fillStyle = "	#FFFFFF"
          targetLayer.context2D.fillText(winner, width/4+width/8, heigth/2);
} 
}