import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000
DUR = 14.52
N = int(SR * DUR)
out = np.zeros(N)
rng = np.random.default_rng(7)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'band', fs=SR, output='sos'), x)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, 'low', fs=SR, output='sos'), x)


def env(n, a=0.005, d=0.2):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)


def add(x, t, g=1.0):
    i = int(t * SR)
    j = min(N, i + len(x))
    out[i:j] += x[:j - i] * g


def tone(f, dur, d=0.2, a=0.004, kind='sin'):
    n = int(dur * SR); t = np.arange(n) / SR
    if callable(f):
        ph = 2 * np.pi * np.cumsum(f(t)) / SR
    else:
        ph = 2 * np.pi * f * t
    w = np.sin(ph) if kind == 'sin' else np.sign(np.sin(ph)) * .6
    return w * env(n, a, d)


def noise(dur):
    return rng.standard_normal(int(dur * SR))


# crowd murmur bed: circular filtered noise so the end joins the start
spec = np.fft.rfft(rng.standard_normal(N))
fr = np.fft.rfftfreq(N, 1 / SR)
shape = np.exp(-((np.log(fr + 1) - np.log(450)) ** 2) / 0.5)
bed = np.fft.irfft(spec * shape, N)
bed /= np.abs(bed).max()
# syllable-like amplitude wobble, also periodic over DUR
tt = np.arange(N) / SR
wob = 0.75 + 0.25 * np.sin(2 * np.pi * tt * (round(3.1 * DUR) / DUR)) * np.sin(2 * np.pi * tt * (round(1.3 * DUR) / DUR))
keys = [(0, .8), (3.8, .8), (3.95, .3), (8.35, .3), (8.5, .7), (10.5, .7), (10.7, .35), (13.3, .35), (14.52, .8)]
kt, kv = zip(*keys)
bed *= wob * np.interp(tt, kt, kv) * 0.35
out += bed

# body falls
thud = tone(lambda t: 70 - 30 * t, .5, d=.12) + lp(noise(.5), 300) * env(int(.5 * SR), .002, .05) * .5
add(thud, .76, 1.4)

# crowd pops
for i in range(10):
    add(tone(lambda t, i=i: 500 + i * 40 + 900 * t, .09, d=.03), 2.35 + i * .11 + .1, .5)
# meter drop
add(tone(lambda t: 760 - 520 * np.clip(t / .7, 0, 1), .8, d=.6, a=.02), 2.8, .45)

# whooshes on cuts
for tw in (3.9, 6.55, 8.4):
    n = int(.45 * SR); w = bp(noise(.45), 400, 3000) * np.sin(np.linspace(0, np.pi, n)) ** 2
    add(w * .5, tw - .2, .7)

# bubble ticks
for i in range(5):
    add(tone(1200 + i * 90, .08, d=.025), 4.25 + i * .3, .6); add(tone(2400 + i * 180, .05, d=.015), 4.25 + i * .3, .24)

# stamp + underline swish
st = tone(lambda t: 90 - 40 * t, .4, d=.1) + bp(noise(.4), 200, 2500) * env(int(.4 * SR), .001, .04) * .8
add(st, 7.15, 1.3)
n = int(.3 * SR); add(bp(noise(.3), 2000, 7000) * np.sin(np.linspace(0, np.pi, n)) * .4, 7.95, .6)

# shout rings (echoing pulses)
for k, tr in enumerate((8.85, 9.3)):
    for e in range(4):
        add(tone(330, .5, d=.18), tr + e * .14, .45 * (.55 ** e))
# question pops
for i, tq in enumerate(np.linspace(9.05, 9.6, 6)):
    add(tone(lambda t, i=i: 700 + 600 * t * 10, .07, d=.025), tq, .35)
# buzzer
add(tone(110, .4, d=.5, a=.01, kind='sq') * np.where(np.arange(int(.4 * SR)) < int(.36 * SR), 1, 0), 9.95, .45)

# spotlight clunks
for tc, g in ((10.55, 1.0), (11.3, 1.1)):
    cl = tone(55, .35, d=.08) + bp(noise(.35), 1500, 6000) * env(int(.35 * SR), .001, .015) * .7
    add(cl, tc, g)
# hum of the light
n = int(2.6 * SR); add(tone(120, 2.6, d=99, a=.2) * .12 * np.linspace(1, 0, n), 10.6, 1)

# blue shimmer
for i, f in enumerate((880, 1320, 1760)):
    add(tone(f, .5, d=.25), 12.05 + i * .05, .2)
# footsteps
for i, tf in enumerate(np.arange(12.37, 12.9, .11)):
    add(lp(noise(.12), 500) * env(int(.12 * SR), .002, .02) + tone(80, .12, d=.03) * .5, tf, .9)
# warm chime on help
for i, f in enumerate((523.25, 659.25, 783.99, 1046.5)):
    add(tone(f, 1.0, d=.45, a=.01) * .6, 12.98 + i * .035, .45)

# rewind tape whirr
n = int(1.15 * SR); t = np.arange(n) / SR
whir = np.sin(2 * np.pi * np.cumsum(300 + 900 * np.sin(np.pi * t / 1.15)) / SR) * .3
whir += bp(noise(1.15), 800, 5000) * .5
whir *= np.sin(np.linspace(0, np.pi, n)) ** .7 * (0.7 + .3 * np.sign(np.sin(2 * np.pi * 14 * t)))
add(whir, 13.3, .5)

out /= np.abs(out).max() * 1.05
wavfile.write('sfx.wav', SR, (out * 32767).astype(np.int16))
print('ok', len(out) / SR)
