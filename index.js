const express   = require('express');
const path      = require('path');
const WebSocket = require('ws').Server;

let app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/viewer', (req, res) => {
  res.sendFile(path.join(__dirname, 'viewer.html'));
});

let port = process.env.PORT || 80;
let server = app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});

let wss = new WebSocket({ server });
let viewers = [];
wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    switch(msg) {
      case 'server':
        viewers.push(ws);
        break;
      case 'addSprite':
        viewers.forEach((viewer) => {
          viewer.send('addSprite');
        });
        break;
    }
    console.log(msg);
    if (msg == 'addSprite') {
      ws.send('addSprite');
    }
  });

  // startAddingSprites(ws);

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
