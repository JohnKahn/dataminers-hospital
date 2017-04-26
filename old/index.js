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

let port = process.env.PORT || 3000;
let server = app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});

let wss = new WebSocket({ server });
let viewers = [];
let deletedViewer = false;
wss.on('connection', (ws) => {
  ws.on('message', (raw) => {
    let obj = JSON.parse(raw);
    switch(obj.action) {
      case 'server':
        viewers.push(ws);
        break;
      case 'addSprite':
        viewers.forEach((viewer, index) => {
          try {
            viewer.send(raw);
          } catch(e) {
            delete viewers[index];
            deletedViewer = true;
          }
        });

        if (deletedViewer) { // Remove the undefined viewers
          viewers = viewers.filter(function(viewer) { return viewer !== undefined; });
        }
        break;
    }
  });
});
