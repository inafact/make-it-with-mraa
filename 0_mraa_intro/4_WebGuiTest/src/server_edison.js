/*eslint no-console:0*/

var express= require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

var updateIntervalBase = 1 / 30 * 1000;

//
var cp = require('child_process');
var mp = cp.fork(__dirname + '/mraaprocess.js');

mp.on('message', function(msg) {
  if (msg.hasOwnProperty('type') && msg.hasOwnProperty('data')) {
    if (msg.type === 'bang') {
      io.emit('bang.encoder', {data:msg.data});
    }

    if (msg.type === 'analog') {
      io.emit('bang.analog', {data:msg.data});
    }
  }
});

app.use(express.static('public'));
server.listen(8888);

app.get('/', function (req, res) {
  res.sendfile(path.resolve(__dirname, '../public', 'index.html'));
});

io.on('connection', function (socket) {
  //
  socket.emit('init', { hello: 'world' });

  //
  socket.on('vslider', function (data) {
    mp.send({data:updateIntervalBase * Math.max(data.value * 0.25, 1)});
  });
});
