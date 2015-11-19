var express= require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

var m = require('mraa');
console.log('MRAA Version: ' + m.getVersion());

var analogPin0 = new m.Aio(0);
var analogValue = analogPin0.read();

var digitalPin5 = new m.Gpio(5);

var led = new m.Gpio(13);
var ledState = false;

var l = new m.Gpio(6);
var r = new m.Gpio(7);
var counter = 0;

var updateIntervalBase = 1 / 30 * 1000;
var updateInterval = updateIntervalBase * 1;

digitalPin5.dir(m.DIR_IN);
digitalPin5.mode(m.MODE_PULLUP);

led.dir(m.DIR_OUT);

l.dir(m.DIR_IN);
l.mode(m.MODE_PULLUP);
r.dir(m.DIR_IN);
r.mode(m.MODE_PULLUP);
l.isr(m.EDGE_RISING, encoderUpdate);

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
    updateInterval = updateIntervalBase * Math.max(data.value * 0.25, 1);
  });
});

//
periodicActivity();

//
function periodicActivity() {
  //
  ledState = !ledState;
  led.write(ledState ? 1:0);
  
  //
  analogValue = analogPin0.read();

  //
  if(!digitalPin5.read()){
    io.emit('bang.analog', {data:analogValue});
  }

  //
  io.emit('bang.encoder', {data:counter});
  
  //
  setTimeout(periodicActivity, updateInterval);
}

//
function encoderUpdate() {
  if(l.read() == 1){
    if(r.read() == 1){
      counter ++;
    }else{
      counter --;
    }
  }

  if(counter > 100){
    counter = 100;
  }else if(counter < 1){
    counter = 1;
  }
}
