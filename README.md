# angular-canvas

Demo :
<a href='http://jsfiddle.net/hsub3pk3/7/'>http://jsfiddle.net/hsub3pk3/7/</a>

Code :
```
var module = angular.module('myApp', []);

module.controller('AnimatorController', function($scope) {

  $scope.initCanvas = function (flipitEngine) {
    console.log('initCanvas');

    var player = {
      color: "rgba(255, 255, 255, 0.1)",
      x: 220,
      y: 270,
      texture: 'imagelogo',
      width: 32,
      height: 32,
      update: function(deltaT) {
        this.x = Math.cos(flipitEngine.initTime) * 50 + flipitEngine.width / 2;
        this.y = Math.sin(flipitEngine.initTime) * 50 + flipitEngine.height / 2;
        this.width = this.texture.width;
        this.height = this.texture.height;
        this.x -= this.width / 2;
        this.y -= this.height / 2;
      },
      draw: function(canvas) {
        canvas.fillStyle = this.color;
        canvas.drawImage(this.texture, this.x, this.y);
      }
    };

    flipitEngine.addEntity(player);
  };

});
```