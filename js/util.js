// Nástroje: náhoda (i se semínkem), čísla po česku, čtení odpovědi, jednotky.

let _rng = Math.random;
export function setRng(f) { _rng = f || Math.random; }
export function mulberry(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const rnd = () => _rng();
export const ri = (a, b) => a + Math.floor(_rng() * (b - a + 1));
export const pick = arr => arr[Math.floor(_rng() * arr.length)];
export const chance = p => _rng() < p;
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(_rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
// n různých prvků z pole
export function sample(arr, n) { return shuffle(arr).slice(0, n); }
// násobek kroku v rozsahu
export const rstep = (a, b, st) => a + st * ri(0, Math.round((b - a) / st));

// Zaokrouhlení na d míst (půlky nahoru, bez chyb typu 2.675 → 2.67)
export function rd(n, d = 0) {
  const f = 10 ** d;
  return Math.round((n + Math.sign(n) * 1e-9) * f) / f;
}

const NBSP = ' ';
// Číslo po česku: desetinná čárka, nejvýš d míst, koncové nuly pryč, tisíce od 10 000 s mezerou.
export function cz(n, d = 2) {
  let s = rd(n, d).toFixed(d);
  if (d > 0) s = s.replace(/\.?0+$/, '');
  return _cz(s);
}
// Pevný počet desetinných míst
export function czf(n, d) { return _cz(rd(n, d).toFixed(d)); }
function _cz(s) {
  let neg = false;
  if (s[0] === '-') { neg = true; s = s.slice(1); }
  let [i, f] = s.split('.');
  if (i.length > 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  if (neg && Number(s) === 0) neg = false;
  return (neg ? '−' : '') + i + (f ? ',' + f : '');
}

// Odpověď žáka → číslo (NaN, když to číslo není). Přijme čárku i tečku a mezery v tisících.
export function parseNum(s) {
  if (typeof s !== 'string') return NaN;
  const t = s.trim().replace(/[\s  ]/g, '').replace(/−/g, '-').replace(',', '.');
  if (!/^-?\d+(\.\d+)?$/.test(t)) return NaN;
  return parseFloat(t);
}

// Úhel v minutách → „37°30′“
export function dm(min) {
  const m = Math.round(min);
  const st = Math.floor(m / 60), mi = m % 60;
  return mi ? `${st}°${mi}′` : `${st}°`;
}

// Nabídka jednotek pro nejtěžší úroveň (žák volí jednotku sám)
const PREF = ['mm', 'cm', 'dm', 'm', 'km'];
export function unitChoices(u) {
  const m = /^(mm|cm|dm|m|km)([²³]?)$/.exec(u);
  if (m) {
    const [, p, e] = m;
    const jiny = PREF[PREF.indexOf(p) + (p === 'km' || p === 'm' ? -1 : 1)];
    return shuffle([p, p + '²', p + '³', jiny + e]);
  }
  const zvl = { l: ['l', 'ml', 'dm²', 'm³'], hl: ['hl', 'l', 'm²', 'dm³'], ml: ['ml', 'l', 'cm²', 'dm³'],
    ha: ['ha', 'a', 'm', 'km'], a: ['a', 'ha', 'm', 'm³'] };
  return zvl[u] ? shuffle(zvl[u]) : null;
}

// Vektory
export const V = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1]],
  mul: (a, k) => [a[0] * k, a[1] * k],
  len: a => Math.hypot(a[0], a[1]),
  dist: (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]),
  unit: a => { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l]; },
  rot: (a, deg) => { const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [a[0] * c - a[1] * s, a[0] * s + a[1] * c]; },
  mid: (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2],
  dot: (a, b) => a[0] * b[0] + a[1] * b[1],
  ang: a => Math.atan2(a[1], a[0]) * 180 / Math.PI,
  perp: a => [-a[1], a[0]],
};

export const b = x => `<b>${x}</b>`;
export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
