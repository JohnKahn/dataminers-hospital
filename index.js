const express   = require('express');
const path      = require('path');
const WebSocket = require('ws').Server;

let app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port ' + process.env.PORT + '!');
});

let wss = new WebSocket({port: 8080});
wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    console.log(msg);
    if (msg == 'addSprite') {
      ws.send('addSprite');
    }
  });

  startAddingSprites(ws);

  console.log('New Client');
});

function startAddingSprites(ws) {
  setTimeout(function () {
    try {
      ws.send('addSprite');
      startAddingSprites(ws);
    } catch(e) {}
  }, getRand(100, 1000));
}

function getRand(min, max) {
  return Math.random() * (max - min) + min;
}
