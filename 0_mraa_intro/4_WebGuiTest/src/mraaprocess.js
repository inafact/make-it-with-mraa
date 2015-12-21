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
l.isr(m.EDGE_RISING, encodeL);
r.isr(m.EDGE_FALLING, encodeR);

periodicActivity();

//
function periodicActivity() {
  //
  ledState = !ledState;
  led.write(ledState ? 1:0);
  
  //
  analogValue = analogPin0.read();

  // //
  // if(!digitalPin5.read()){
  //   io.emit('bang.analog', {data:analogValue});
  // }

  // //
  // io.emit('bang.encoder', {data:counter});
  
  //
  setTimeout(periodicActivity, updateInterval);
}

//
function encodeL() {
  if(counter > 0){
    counter --;
  }

  // console.log(counter);
}

function encodeR() {
  if(counter < 100){
    counter ++;
  }

  // console.log(counter);
}
