#!/usr/bin/env python

import mraa
import time

print('MRAA Version: %s' % mraa.getVersion())

myDigitalPin = mraa.Gpio(6)
myDigitalPin.dir(mraa.DIR_IN)
myDigitalPin.mode(mraa.MODE_PULLUP)

while True:
    myDigitalValue = myDigitalPin.read()
    print('Gpio is %d' % myDigitalValue)
    time.sleep(1)
