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
if (document.location.host === 'localhost') {
  ws = new WebSocket('ws:' + document.location.host);
} else {
  ws = new WebSocket('wss:' + document.location.host);
}

ws.onopen = function(e) {
  PIXI.loader.add('img/sprite1.png').load(setup);
  ws.send(JSON.stringify({
    action: 'server'
  }));
};
ws.onmessage = function(e) {
  console.log(e.data);
  var obj = JSON.parse(e.data);
  if (obj.action === 'addSprite') {
    addSprite(obj.yPos * (clientHeight - 128));
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

var dt = 0;
var lastTime = (new Date).getTime();
function updateDt() {
  var nowTime = (new Date).getTime();
  dt = (nowTime - lastTime) / 1000.0;
  lastTime = nowTime;
}

function update() {
  requestAnimationFrame(update);
  updateDt();

  var deletedSprite = false;
  sprites.forEach(function(sprite, index, arr) {
    sprite.x -= getRand(250, 300) * dt; // A little bit of wobble
    sprite.y -= getRand(-70, 70) * dt; // A little bit of wobble
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

function addSprite(yPos) {
  var sprite = new PIXI.Sprite(PIXI.loader.resources["img/sprite1.png"].texture);
  sprite.height = 128;
  sprite.width = 128;
  sprite.x = clientWidth;
  sprite.y = yPos;
  stage.addChild(sprite);
  sprites.push(sprite);
}

function getRand(min, max) {
  return Math.random() * (max - min) + min;
}
