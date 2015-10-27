#!/usr/bin/env python

import mraa
import time

print('MRAA Version: %s' % mraa.getVersion())

analogPin0 = mraa.Aio(0)
analogValue = analogPin0.read()
analogValueFloat = analogPin0.readFloat()

while True:
    analogValue = analogPin0.read()
    analogValueFloat = analogPin0.readFloat()
    print(analogValue)
    print('%.5f' % analogValueFloat)
    time.sleep(1)
