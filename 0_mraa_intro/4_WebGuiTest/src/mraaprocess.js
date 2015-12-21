/*eslint no-console:0*/

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
l.isr(m.EDGE_BOTH, isrUpdate);
r.isr(m.EDGE_BOTH, isrUpdate);

process.on('message', function(msg) {
  if (msg.hasOwnProperty('data')) {
    updateInterval =  msg.data;
  }
});

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
    process.send({type:'analog', data:analogValue});
  }

  //
  process.send({type:'bang', data:counter});
  
  //
  setTimeout(periodicActivity, updateInterval);
}


function isrUpdate() {
  if(counter < 100 && l.read()){
    counter ++;
  }

  if(counter > 0 && r.read()){
    counter --;
  }
}
