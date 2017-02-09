var ws = undefined;
if (document.location.host === 'localhost') {
  ws = new WebSocket('ws:' + document.location.host);
} else {
  ws = new WebSocket('wss:' + document.location.host);
}

ws.onopen = function(e) {
  document.addEventListener('touchend', function() {
    ws.send('addSprite');
  });
};
ws.onmessage = function(e) {
  console.log(e.data);
}
