import mraa
import time


class Counter:
    count = 0


def isrUpdate(args):
    if l.read():
        c.count += 1
    if r.read():
        c.count -= 1
    print(c.count)


print('MRAA Version: %s' % mraa.getVersion())

l = mraa.Gpio(6)
r = mraa.Gpio(7)
c = Counter()

l.dir(mraa.DIR_IN)
l.mode(mraa.MODE_PULLUP)
r.dir(mraa.DIR_IN)
r.mode(mraa.MODE_PULLUP)

l.isr(mraa.EDGE_BOTH, isrUpdate, isrUpdate)
r.isr(mraa.EDGE_BOTH, isrUpdate, isrUpdate)

time.sleep(1000)
