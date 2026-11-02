import numpy as np, json
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000
DUR = json.load(open('./words.json'))['dur']
N = int(round(SR * DUR))
out = np.zeros(N)
rng = np.random.default_rng(11)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'band', fs=SR, output='sos'), x)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, 'low', fs=SR, output='sos'), x)


def env(n, a=0.005, d=0.2):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)


def add(x, t, g=1.0):
    i = int(t * SR)
    if i < 0:
        x = x[-i:]; i = 0
    j = min(N, i + len(x))
    if j > i:
        out[i:j] += x[:j - i] * g


def tone(f, dur, d=0.2, a=0.004, kind='sin'):
    n = int(dur * SR); t = np.arange(n) / SR
    ph = 2 * np.pi * (np.cumsum(f(t)) / SR if callable(f) else f * t)
    w = np.sin(ph) if kind == 'sin' else (np.sign(np.sin(ph)) * .6 if kind == 'sq' else 2 * ((ph / (2 * np.pi)) % 1) - 1)
    return w * env(n, a, d)


def noise(dur):
    return rng.standard_normal(int(dur * SR))


def whoosh(t, g=.6, dur=.45):
    n = int(dur * SR); w = bp(noise(dur), 400, 3000) * np.sin(np.linspace(0, np.pi, n)) ** 2
    add(w * .5, t - dur / 2, g)


tt = np.arange(N) / SR
# room tone bed: circular filtered noise, loops seamlessly
spec = np.fft.rfft(rng.standard_normal(N)); fr = np.fft.rfftfreq(N, 1 / SR)
shape = np.exp(-((np.log(fr + 1) - np.log(220)) ** 2) / 0.6)
bed = np.fft.irfft(spec * shape, N); bed /= np.abs(bed).max()
keys = [(0, .55), (2.4, .55), (2.6, .3), (13.8, .3), (14.0, .55), (DUR, .55)]
kt, kv = zip(*keys)
out += bed * np.interp(tt, kt, kv) * .3
# low drone that swells in the explanation, periodic over DUR
f0 = round(55 * DUR) / DUR
out += np.sin(2 * np.pi * f0 * tt) * .05 * np.interp(tt, [0, 4.9, 5.2, 8.7, 9.0, DUR], [0, 0, 1, 1, .4, 0])

# notification pings on the feed, phase locked to the loop point
def ping(t, g):
    p = tone(1568, .12, d=.05) + tone(2349, .12, d=.035) * .5
    add(p, t, g)
for k in range(0, 9):
    ping(k * .28, .28)
for k in range(1, 3):
    ping(DUR - k * .28, .28)
# "persis?" sting: identical bubbles go red
add(tone(lambda t: 466 + 0 * t, .7, d=.35, kind='saw') * .3 + tone(494, .7, d=.35, kind='saw') * .3, 1.72, .5)

# cut to the wall
whoosh(2.45)
for i in range(0, 28, 3):
    add(tone(lambda t, i=i: 420 + i * 18 + 800 * t, .08, d=.03), 2.47 + i * .012 + .1, .35)
# strings pluck
for i, f in enumerate((196, 247, 294, 330, 392)):
    add(tone(f, 1.2, d=.4, a=.002, kind='saw') * lp(np.ones(int(1.2 * SR)), 2000), 3.0 + i * .07, .16)
# synced bobbing creak
for tb in np.arange(3.6, 4.9, 2 * np.pi / 5.2):
    add(bp(noise(.18), 300, 900) * env(int(.18 * SR), .02, .06), tb, .35)
# BUZZER stamp
st = tone(lambda t: 85 - 40 * t, .5, d=.14) + bp(noise(.5), 150, 2500) * env(int(.5 * SR), .001, .05) * .9
add(st, 4.2, 1.5)

# repetition into the head
whoosh(5.05, .5)
for i, f in enumerate((5.25, 5.85, 6.45)):
    whoosh(f + .2, .55, .5)
    add(tone(lambda t: 120 - 50 * t, .35, d=.1) + lp(noise(.35), 400) * env(int(.35 * SR), .002, .04) * .5, f + .42, .9)
    add(tone(620 + i * 140, .2, d=.08), f + .5, .35)

# term card
whoosh(7.35, .6)
add(st, 7.42, 1.3)
n = int(.3 * SR); add(bp(noise(.3), 2000, 7000) * np.sin(np.linspace(0, np.pi, n)) * .4, 8.05, .6)

# checklist
whoosh(8.8, .5)
add(tone(lambda t: 300 + 900 * t, .12, d=.05), 8.85, .45)
for tt_ in (9.80, 10.77, 12.21):
    add(tone(lambda t: 500 + 1100 * t, .1, d=.04), tt_ - .05, .5)
    ck = tone(1320, .25, d=.09) + tone(1980, .25, d=.06) * .4
    ck[:int(.05 * SR)] += bp(noise(.05), 2000, 8000) * .3
    add(ck, tt_ + .3, .45)
for i, f in enumerate((523.25, 659.25, 783.99)):
    add(tone(f, .9, d=.4, a=.01) * .5, 12.75 + i * .04, .35)

# rewind whirr back into the feed
n = int(.65 * SR); t = np.arange(n) / SR
whir = np.sin(2 * np.pi * np.cumsum(300 + 900 * np.sin(np.pi * t / .65)) / SR) * .3 + bp(noise(.65), 800, 5000) * .5
whir *= np.sin(np.linspace(0, np.pi, n)) ** .7
add(whir, 13.9, .5)

out /= np.abs(out).max() * 1.05
wavfile.write('./sfx.wav', SR, (out * 32767).astype(np.int16))
print('ok', len(out) / SR)
