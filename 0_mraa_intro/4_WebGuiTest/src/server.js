var express= require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

app.use(express.static('public'));

server.listen(8888);

app.get('/', function (req, res) {
  res.sendfile(path.resolve(__dirname, '../public', 'index.html'));
});

io.on('connection', function (socket) {
  socket.emit('bang', {value:10});
});
