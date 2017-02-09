PIXI.utils.skipHello();

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
var clientWidth = document.documentElement.clientWidth;
var clientHeight = document.documentElement.clientHeight;

//Create the document.documentElement.clientHeight
var renderer = PIXI.autoDetectRenderer(clientWidth, clientHeight);
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.backgroundColor = 0x7ac3ff;
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new PIXI.Container();

var ws = undefined;
if (document.location.host) {
  ws = new WebSocket('ws:' + document.location.host);
} else {
  ws = new WebSocket('wss:' + document.location.host);
}

ws.onopen = function(e) {
  PIXI.loader.add('img/sprite1.png').load(setup);
};
ws.onmessage = function(e) {
  console.log(e.data);
  if (e.data === 'addSprite') {
    addSprite();
  }
}

function setup() {
  document.addEventListener('keypress', function(e) {
    var key;
    if(window.event) { // IE
      key = e.keyCode;
    } else if(e.which){ // Netscape/Firefox/Opera
      key = e.which;
    }

    if (key === 32) {
      ws.send('addSprite');
    }
  });

  update();
}

var sprites = [];

function update() {
  requestAnimationFrame(update);

  var deletedSprite = false;
  sprites.forEach(function(sprite, index, arr) {
    sprite.x -= getRand(5, 7); // A little bit of wobble
    sprite.y -= getRand(-1, 1); // A little bit of wobble
    if (sprite.x < -sprite.width) {
      stage.removeChild(sprite);
      delete arr[index];
      deletedSprite = true;
    }
  });

  if (deletedSprite) { // Remove the undefined sprites
    sprites = sprites.filter(function(sprite) { return sprite !== undefined; });
  }

  renderer.render(stage);
}

function addSprite() {
  var sprite = new PIXI.Sprite(PIXI.loader.resources["img/sprite1.png"].texture);
  sprite.height = 128;
  sprite.width = 128;
  sprite.x = clientWidth;
  sprite.y = getRand(0, clientHeight - 128);
  stage.addChild(sprite);
  sprites.push(sprite);
}

function getRand(min, max) {
  return Math.random() * (max - min) + min;
}
