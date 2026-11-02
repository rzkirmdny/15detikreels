// ---------- classroom (version B: spotlight effect) ----------
// Scenes only. Assemble by replacing the S3..overlays section of videos/01-bystander/index.html
// Note: person() in 01-bystander ignores the stain/label options this version passes; add them if you rebuild it.
const ROWS = [
  { y: 985, s: .54, n: 7, x0: 150, dx: 130 },
  { y: 1090, s: .61, n: 7, x0: 110, dx: 143 },
  { y: 1200, s: .69, n: 7, x0: 70, dx: 157 },
];
const SEATS = [];
ROWS.forEach((r, ri) => { for (let i = 0; i < r.n; i++) SEATS.push({ x: r.x0 + i * r.dx + (ri % 2) * 10, y: r.y, s: r.s, ri, i, k: SEATS.length }); });
// who "notices" in the guess (50%) and in reality (~25%)
const GUESS = [0, 2, 4, 6, 8, 9, 11, 13, 15, 17, 19];
const REAL = [2, 9, 13, 17, 19];
// what everyone is busy with in the reveal
const BUSY = SEATS.map((s, i) => ['phone', 'sleep', 'phone', 'stain', 'phone', 'sleep', 'phone'][(i * 3 + s.ri) % 7]);
const HERO_B = { x: 540, y: 1365, s: 1.25 };

function classBG() {
  c.fillStyle = '#221e1a'; c.fillRect(-500, -500, 2080, 2900);
  // board
  c.fillStyle = '#1a2320'; rr(c, 110, 420, 860, 330, 14); c.fill();
  c.strokeStyle = '#3a342b'; c.lineWidth = 14; rr(c, 110, 420, 860, 330, 14); c.stroke();
  c.strokeStyle = 'rgba(239,230,210,.18)'; c.lineWidth = 5; c.lineCap = 'round';
  c.beginPath(); c.moveTo(170, 500); c.lineTo(520, 495); c.moveTo(170, 560); c.lineTo(430, 562); c.moveTo(600, 520); c.quadraticCurveTo(700, 450, 800, 540); c.stroke();
  // lamps
  for (let i = 0; i < 3; i++) { const x = 220 + i * 320; c.fillStyle = '#2b2722'; rr(c, x - 80, 300, 160, 18, 6); c.fill(); c.fillStyle = '#d9cdb3'; rr(c, x - 70, 316, 140, 6, 3); c.fill(); }
  // floor + tiers
  c.fillStyle = '#171412'; c.fillRect(-500, 900, 2080, 1600);
  for (const r of ROWS) { c.fillStyle = '#1c1916'; c.fillRect(-500, r.y - 20, 2080, 26); }
}
function seated(st, t, busyK, markK) {
  for (const s of SEATS) {
    const b = BUSY[s.k];
    const pose = busyK > .5 && b === 'phone' ? POSE.phone : POSE.idle;
    const sleep = busyK > .5 && b === 'sleep';
    const out = person({ x: s.x, y: s.y, s: s.s, rot: sleep ? .22 : Math.sin(t * 1.7 + s.k) * .012, pose, eye: busyK > .5 ? 0 : (s.x < 540 ? 1 : -1), stain: busyK > .5 && b === 'stain' ? 1 : 0 });
    // desk hides the legs
    c.fillStyle = '#2a251f'; c.fillRect(s.x - 62 * s.s * 1.15, s.y - 150 * s.s, 124 * s.s * 1.15, 150 * s.s);
    c.strokeStyle = CREAM; c.lineWidth = 3; c.beginPath(); c.moveTo(s.x - 62 * s.s * 1.15, s.y - 150 * s.s); c.lineTo(s.x + 62 * s.s * 1.15, s.y - 150 * s.s); c.stroke();
    s.out = out;
    if (sleep && busyK > 0) {
      c.save(); c.globalAlpha = clamp((busyK - .5) * 2); c.font = '900 34px Inter'; c.fillStyle = CREAM; c.textAlign = 'center';
      c.fillText('z', s.x + 40 * s.s + 30, s.y - 380 * s.s - 10 * Math.sin(t * 3 + s.k)); c.font = '900 24px Inter'; c.fillText('z', s.x + 40 * s.s + 55, s.y - 420 * s.s - 10 * Math.sin(t * 3 + s.k)); c.restore();
    }
  }
}

function stateB(t) {
  const s = { z: 1.2, dark: .58, cone: 85, heroX: HERO_B.x, walk: 0, stain: 1, label: 0, busy: 0, marks: [], bubble: 0 };
  if (t >= 2.35 && t < 9.55) {
    s.z = lerp(.86, .8, seg(t, 2.35, 9.5)); s.dark = 0; s.stain = 0; s.label = 1;
    const w = seg(t, 2.6, 5.7);
    s.heroX = lerp(80, 540, eio(w)); s.walk = w > 0 && w < 1 ? 1 : 0;
    s.bubble = back(seg(t, 5.95, 6.2)) * (1 - seg(t, 7.8, 8.0));
    s.marks = SEATS.map((q, i) => {
      const gi = GUESS.indexOf(i), on = gi >= 0 ? back(seg(t, 6.3 + gi * .06, 6.5 + gi * .06)) : 0;
      if (REAL.includes(i)) return on;
      return on * (1 - seg(t, 8.25 + (gi % 6) * .08, 8.4 + (gi % 6) * .08));
    });
  }
  if (t >= 11.25) {
    s.z = .8; s.dark = lerp(.35, 0, seg(t, 11.4, 12.3)); s.cone = lerp(140, 420, eout(seg(t, 11.3, 12.4)));
    s.stain = 0; s.label = 1; s.busy = seg(t, 11.65, 12.1);
  }
  if (t >= 13.35) {
    const r = eio(seg(t, 13.4, 14.3));
    s.z = lerp(.8, 1.2, r); s.dark = lerp(0, .58, r); s.cone = lerp(420, 85, r);
    s.stain = r; s.label = 1 - r; s.busy = 1 - seg(t, 13.4, 13.9);
  }
  return s;
}

function classroom(t) {
  const st = stateB(t);
  c.save(); c.translate(540, 1250); c.scale(st.z, st.z); c.translate(-540, -1250);
  classBG();
  seated(st, t, st.busy);
  // marks: red ring around heads that "noticed"
  st.marks.forEach((m, i) => {
    if (m <= 0) return; const q = SEATS[i];
    const hx = q.x, hy = q.y - 306 * q.s;
    c.save(); c.translate(hx, hy); c.scale(m, m);
    c.strokeStyle = RED; c.lineWidth = 7; c.beginPath(); c.arc(0, 0, 58 * q.s + 10, 0, Math.PI * 2); c.stroke();
    c.fillStyle = RED; c.font = '900 40px Inter'; c.textAlign = 'center'; c.fillText('!', 0, -58 * q.s - 22); c.restore();
  });
  const sw = Math.sin(t * 14) * st.walk;
  const pose = st.walk ? { aL: [-.5 * sw, -.5 * sw - .2], aR: [.5 * sw, .5 * sw - .2], lL: [.45 * sw, .45 * sw - .2], lR: [-.45 * sw, -.45 * sw - .2] } : POSE.idle;
  const hero = person({ x: st.heroX, y: HERO_B.y, s: HERO_B.s, rot: st.walk ? .05 : 0, pose, eye: 1, stain: st.stain, label: st.label });
  c.restore();

  if (st.dark > .001) {
    d.setTransform(1, 0, 0, 1, 0, 0); d.clearRect(0, 0, W, H);
    d.fillStyle = `rgba(8,7,6,${st.dark})`; d.fillRect(0, 0, W, H);
    const [sx, sy] = zoomPt(st.heroX, HERO_B.y, st.z);
    const cw = st.cone * st.z * 1.6;
    d.globalCompositeOperation = 'destination-out';
    d.beginPath(); d.moveTo(sx - 50, -40); d.lineTo(sx + 50, -40); d.lineTo(sx + cw, sy + 10); d.lineTo(sx - cw, sy + 10); d.closePath(); d.fill();
    d.beginPath(); d.ellipse(sx, sy, cw, 46 * st.z, 0, 0, Math.PI * 2); d.fill();
    d.globalCompositeOperation = 'source-over';
    c.drawImage(dk, 0, 0);
    c.save(); c.globalAlpha = .08 * (st.dark / .58); c.fillStyle = CREAM;
    c.beginPath(); c.moveTo(sx - 50, -40); c.lineTo(sx + 50, -40); c.lineTo(sx + cw, sy + 10); c.lineTo(sx - cw, sy + 10); c.closePath(); c.fill(); c.restore();
  }
  // thought bubble 50%
  if (st.bubble > 0) {
    const [hx, hy] = hero.head;
    c.save(); c.translate(hx + 150, hy - 200); c.scale(st.bubble, st.bubble);
    c.fillStyle = CREAM;
    c.beginPath(); c.arc(-120, 150, 16, 0, Math.PI * 2); c.fill(); c.beginPath(); c.arc(-150, 190, 9, 0, Math.PI * 2); c.fill();
    rr(c, -190, -95, 380, 200, 50); c.fill();
    c.fillStyle = INK; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = '700 34px Inter'; c.fillText('everyone saw it', 0, -40);
    c.font = '900 78px Inter'; c.fillStyle = RED; c.fillText('50%', 0, 35);
    c.restore();
  }
}

function panelB(t) {
  const a = seg(t, 7.95, 8.1) * (1 - seg(t, 9.45, 9.55));
  if (a <= 0) return;
  c.save(); c.globalAlpha = a;
  c.fillStyle = 'rgba(13,12,11,.86)'; rr(c, 90, 340, 900, 330, 28); c.fill();
  const drop = eio(seg(t, 8.25, 8.9));
  const pct = Math.round(lerp(50, 25, drop));
  c.font = '700 40px Inter'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = CREAM;
  c.fillText(drop < .5 ? 'They guessed' : 'Actually noticed', 140, 400);
  c.textAlign = 'right'; c.font = '900 72px Inter'; c.fillStyle = RED; c.fillText((drop > .5 ? '~' : '') + pct + '%', 940, 400);
  c.strokeStyle = CREAM; c.lineWidth = 5; rr(c, 140, 460, 800, 74, 16); c.stroke();
  c.fillStyle = RED; rr(c, 150, 470, 780 * pct / 100, 54, 10); c.fill();
  c.textAlign = 'left'; c.font = '600 32px Inter'; c.fillStyle = 'rgba(239,230,210,.85)';
  c.fillText('of the class noticed the embarrassing shirt', 140, 585);
  c.fillStyle = 'rgba(239,230,210,.55)'; c.font = '500 26px Inter'; c.fillText('Gilovich, Medvec & Savitsky (2000)', 140, 630);
  c.restore();
}

function titleB(t) {
  c.fillStyle = '#181513'; c.fillRect(0, 0, W, H);
  const k = eout(seg(t, 9.55, 9.9));
  // big spotlight on a tiny figure
  const g = c.createRadialGradient(540, 1250, 20, 540, 1250, 330);
  g.addColorStop(0, `rgba(239,230,210,${.22 * k})`); g.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g; c.fillRect(0, 700, W, 1000);
  c.save(); c.globalAlpha = .1 * k; c.fillStyle = CREAM;
  c.beginPath(); c.moveTo(500, -20); c.lineTo(580, -20); c.lineTo(760, 1290); c.lineTo(320, 1290); c.closePath(); c.fill(); c.restore();
  c.fillStyle = `rgba(239,230,210,${.25 * k})`; c.beginPath(); c.ellipse(540, 1290, 220, 44, 0, 0, Math.PI * 2); c.fill();
  person({ x: 540, y: 1290, s: .95, rot: Math.sin(t * 3) * .02, pose: POSE.cross, eye: 1, stain: 1 });
  const ts = back(seg(t, 10.1, 10.35));
  c.save(); c.translate(540, 560); c.scale(lerp(1.5, 1, eout(seg(t, 10.1, 10.35))), lerp(1.5, 1, eout(seg(t, 10.1, 10.35))));
  c.globalAlpha = clamp(ts * 3); c.textAlign = 'center';
  c.font = '900 132px Inter'; c.lineWidth = 16; c.strokeStyle = INK;
  c.strokeText('SPOTLIGHT', 0, -40); c.fillStyle = CREAM; c.fillText('SPOTLIGHT', 0, -40);
  c.strokeText('EFFECT', 0, 100); c.fillStyle = RED; c.fillText('EFFECT', 0, 100);
  c.restore();
  const u = eout(seg(t, 10.6, 10.9));
  c.fillStyle = RED; c.fillRect(540 - 250 * u, 690, 500 * u, 12);
}

function hookB(alpha) {
  if (alpha <= 0) return;
  c.save(); c.globalAlpha = alpha;
  c.fillStyle = 'rgba(13,12,11,.82)'; rr(c, 130, 380, 820, 230, 28); c.fill();
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = '900 84px Inter'; c.fillStyle = CREAM; c.fillText('Everyone saw that.', 540, 450);
  c.fillStyle = RED; c.fillText('Right?', 540, 545);
  c.restore();
}
