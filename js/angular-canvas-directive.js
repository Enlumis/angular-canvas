var module = angular.module('myApp');

Flipit = {};

Flipit.FlipitCanvas = function (element, canvas, initMethod, fps) {
  this.elem = element;
  this.width = element.width();
  this.height = element.height();
  canvas.canvas.width  = this.width;
  canvas.canvas.height = this.height;
  console.log(this.width, this.height);

  this.canvas = canvas;
  this.textures = {};

  this.initTime = 0;
  this.init = initMethod;

  this.entities = [];
  this.maxFPS = fps;
};

Flipit.FlipitCanvas.prototype.startEngine = function () {
  this.init(this);
  this.runLoop(this.maxFPS);
};

Flipit.FlipitCanvas.prototype.addEntity = function (entity) {
  this.entities.push(entity);
  console.log('addEntity : ', entity.textures);
  entity.texture = this.textures[entity.texture];
};

Flipit.FlipitCanvas.prototype.runLoop = function(FPS) {

  var lastTime = Date.now();

  var loopMeth = _.bind(function() {
    var currentTime = Date.now();
    var deltaT = (currentTime - lastTime) * 0.001;
    lastTime = currentTime;
    this.initTime += deltaT;
    this.canvas.fillStyle = "rgba(0, 0, 0, 0.03)";
    var lastCompo = this.canvas.globalCompositeOperation;
    this.canvas.globalCompositeOperation = 'source-over';
    this.canvas.fillRect(0, 0, this.width, this.height);
    for (var i = this.entities.length - 1; i >= 0; i--) {
      var entity = this.entities[i];
        entity.update(deltaT);
        entity.draw(this.canvas);
    }
  }, this);

  var inter = setInterval(loopMeth, 1000 / FPS);
};

Flipit.FlipitCanvas.prototype.updateSize = function(w, h) {
  this.width = w;
  this.height = h;
};

module.directive('angularCanvas', function() {
  return {
    restrict: 'E',
    scope: {
      initMethod:'&init'
    },
    link: function(scope, element, attrs) {
      var canvasElement = $("<canvas width='500' height='500' style='width: 100%; height: 100%;'></canvas>");
      var canvas = canvasElement.get(0).getContext("2d");
      element.append(canvasElement);

      var flipitCanvas = new Flipit.FlipitCanvas(element, canvas, scope.initMethod(), attrs.fps || 60);
      var textures = eval(attrs.textures) || [];

      var loadImage = function (textureName) {
        console.log('load ok ', textureName);
        document.getElementById(textureName).addEventListener('load', function() {
          var i = new Image();
          i.src = this.src;
          flipitCanvas.textures[textureName] = i;
          if (textures.length === _.size(flipitCanvas.textures)) {
            flipitCanvas.startEngine();
          }
        });
      };

      for(var i = 0; i < textures.length; i++) {
        loadImage(textures[i]);
      }


      // Update viewport size on window resize
      $(window).resize(function () {
          scope.$apply(function () {
              canvas.canvas.width  = element.width();
              canvas.canvas.height = element.height();
              console.log(element.width(), element.height());
              flipitCanvas.updateSize(element.width(), element.height());
          });
      });
    }
  };
});