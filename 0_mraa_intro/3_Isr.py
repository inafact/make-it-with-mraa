import mraa
import time


class Counter:
    count = 0


def encodeL(args):
    c.count -= 1
    print(c.count)


def encodeR(args):
    c.count += 1
    print(c.count)


print('MRAA Version: %s' % mraa.getVersion())

l = mraa.Gpio(6)
r = mraa.Gpio(7)
c = Counter()

l.dir(mraa.DIR_IN)
l.mode(mraa.MODE_PULLUP)
r.dir(mraa.DIR_IN)
r.mode(mraa.MODE_PULLUP)

l.isr(mraa.EDGE_RISING, encodeL, encodeL)
r.isr(mraa.EDGE_FALLING, encodeR, encodeR)

time.sleep(1000)
