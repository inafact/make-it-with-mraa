#!/usr/bin/env python

import mraa
import time

print('MRAA Version: %s' % mraa.getVersion())

myLed = mraa.Gpio(13)
myLed.dir(mraa.DIR_OUT)
ledState = True

while True:
    l = 1 if ledState else 0
    myLed.write(l)
    ledState = not ledState
    time.sleep(1)
