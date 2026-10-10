// Zvuky se skládají za běhu přes Web Audio (žádné soubory).
let ctx = null, ven = null, zap = true;
export function nastavZvuk(z) { zap = !!z; }
export function odemkni() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  try { ctx = new AC(); ven = ctx.createGain(); ven.gain.value = 0.28; ven.connect(ctx.destination); } catch (e) { ctx = null; }
}
const hz = m => 440 * 2 ** ((m - 69) / 12);
function ton(m, kdy, dur, typ = 'sine', hlas = 0.5, glide = 0) {
  if (!ctx || !zap) return;
  const t = ctx.currentTime + kdy, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = typ; o.frequency.setValueAtTime(hz(m), t);
  if (glide) o.frequency.exponentialRampToValueAtTime(hz(m + glide), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(hlas, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(ven); o.start(t); o.stop(t + dur + 0.03);
}
const MOTIVY = [[0, 4, 7], [0, 7, 12], [4, 7, 12], [0, 5, 9], [7, 4, 12], [0, 2, 7]];
let posl = -1;
export const zvuk = {
  // správně: stoupající trojzvuk, s řadou bez chyby se zvedá tónina
  ok(combo = 0) { let i; do { i = Math.floor(Math.random() * MOTIVY.length); } while (i === posl); posl = i; const z = 67 + Math.min(combo, 8); MOTIVY[i].forEach((n, k) => ton(z + n, k * 0.075, 0.2, 'triangle', 0.5)); },
  chyba() { ton(52, 0, 0.22, 'sine', 0.5, -4); ton(47, 0.1, 0.26, 'sine', 0.4, -3); },
  klik() { ton(79, 0, 0.05, 'triangle', 0.2); },
  napoveda() { ton(72, 0, 0.12, 'sine', 0.3); ton(76, 0.09, 0.16, 'sine', 0.3); },
  odhaleni() { ton(60, 0, 0.3, 'sine', 0.35); ton(64, 0.12, 0.3, 'sine', 0.3); },
  krok() { ton(74, 0, 0.09, 'triangle', 0.3, 5); },
  hotovo(hv = 1) { [60, 64, 67, 72, 76].slice(0, 2 + hv).forEach((n, k) => ton(n + 7, k * 0.11, 0.32, 'triangle', 0.5)); },
  neuspech() { [64, 60, 57].forEach((n, k) => ton(n, k * 0.16, 0.34, 'sine', 0.4)); },
  zasah() { ton(88, 0, 0.09, 'square', 0.16, -12); ton(64, 0.03, 0.2, 'triangle', 0.4, 12); },
  dopad() { ton(40, 0, 0.35, 'sawtooth', 0.35, -12); },
  stavba() { [55, 62, 67, 74].forEach((n, k) => ton(n, k * 0.06, 0.25, 'triangle', 0.45)); },
  odznak() { [72, 76, 79, 84, 88].forEach((n, k) => ton(n, k * 0.08, 0.28, 'triangle', 0.4)); },
};
