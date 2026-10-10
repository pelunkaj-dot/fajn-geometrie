// Stavba úloh a vyhodnocení odpovědí (bez DOM, testovatelné v Node).
import { shuffle, cz, rd, ri, pick, chance, V } from './util.js';
import { kStav, kExec, kCil } from './kon.js';

// --- číselná odpověď ---
// ans, unit, dec (počet des. míst, na která se zaokrouhluje; null = přesná hodnota),
// alt (další uznávané výsledky, např. s tlačítkem π), traps [[hodnota, hláška]] = typické chyby
export function N(o) {
  const t = { kind: 'num', unit: '', dec: null, alt: [], traps: [], hints: [], steps: [], ...o };
  const h = t.dec == null ? 1e-6 : 0.5 * 10 ** -t.dec + 1e-9;
  // past, která se v tomhle zadání náhodou rovná správnému výsledku, pastí není
  t.traps = t.traps.filter(([v]) => Number.isFinite(v) && v >= 0 && [t.ans, ...t.alt].every(a => Math.abs(a - v) > h));
  return t;
}
// --- výběr z možností: ok = správná, bad = špatné; keep = neměnit pořadí (opts zadány ručně) ---
export function C(o) {
  const opts = o.opts ? o.opts : shuffle([o.ok, ...o.bad]);
  return { kind: 'choice', hints: [], steps: [], ...o, opts, ans: opts.indexOf(o.ok) };
}
// --- úhel ve stupních a minutách: ans v minutách ---
export function DM(o) { return { kind: 'dm', hints: [], steps: [], ...o }; }
// --- čtvercová síť: žák ťuká obrazy bodů ---
export function GR(o) { return { kind: 'grid', hints: [], steps: [], ...o }; }
// --- konstrukční úloha: mode 1 vedená, 2 skládání z připravených kroků, 3 samostatně ---
// dano: u úloh s náčrtkem objekt { prvek náčrtku: hodnota } (z něj se odvodí giv), jinak pole krátkých zápisů.
// sestroj: co má vzniknout a jak se mají jmenovat nové body. Obojí zůstává při řešení stále na očích.
export function K(o) {
  const t = { kind: 'kon', init: [], hints: [], steps: [], lens: [], angs: [], names: [], dano: [], sestroj: '', ...o };
  if (!Array.isArray(t.dano)) t.giv = Object.keys(t.dano);
  return t;
}

// výsledek s π: hlavní s 3,14, uznává se i s přesným π
export function pia(f, dec = 1) {
  const a = rd(f(3.14), dec), b = rd(f(Math.PI), dec);
  return { ans: a, alt: a === b ? [] : [b], dec };
}
export const PI_T = '(π ≐ 3,14)';

// Text správné odpovědi pro zobrazení
export function odpoved(t) {
  if (t.kind === 'num') return cz(t.ans, t.dec ?? 3) + (t.unit ? (t.unit === '°' || t.unit === '′' ? '' : ' ') + t.unit : '');
  if (t.kind === 'choice') return t.opts[t.ans];
  if (t.kind === 'dm') { const m = t.ans % 60; return `${Math.floor(t.ans / 60)}°${m ? ' ' + m + '′' : ''}`; }
  return '';
}

// Vyhodnocení. strict = nejtěžší úroveň (přesné zaokrouhlení, kontrola jednotky).
export function check(t, inp, strict = false) {
  if (t.kind === 'choice') return { ok: inp.i === t.ans, msg: '' };
  if (t.kind === 'dm') {
    if (inp.min >= 60) return { ok: false, msg: 'Minut musí být méně než 60. Každých 60′ převeď na 1°.' };
    const x = inp.deg * 60 + inp.min, tr = (t.traps || []).find(([v]) => v === x);
    return { ok: x === t.ans, msg: tr ? tr[1] : '' };
  }
  if (t.kind === 'grid') {
    const key = p => p[0] + ',' + p[1], a = new Set(t.ans.map(key)), b = new Set(inp.pts.map(key));
    const ok = a.size === b.size && [...a].every(k => b.has(k));
    const spr = [...b].filter(k => a.has(k)).length;
    return { ok, msg: ok ? '' : (spr ? `Správně ${spr === 1 ? 'je 1 bod' : 'jsou ' + spr + ' body'} z ${a.size}. ` : '') + (t.stred ? 'Obraz leží na přímce procházející středem S, stejně daleko na opačné straně.' : 'Počítej čtverečky kolmo k ose: obraz je stejně daleko na druhé straně.') };
  }
  if (t.kind === 'num') {
    const x = inp.val, acc = [t.ans, ...t.alt], h = t.dec == null ? 1e-6 : 0.5 * 10 ** -t.dec + 1e-9;
    const exact = acc.some(a => Math.abs(x - a) < 1e-9), loose = acc.some(a => Math.abs(x - a) <= h);
    let ok = strict ? exact : loose, msg = '';
    if (!ok && strict && loose) msg = `Jsi blízko, ale výsledek není přesně zaokrouhlený na ${t.dec === 0 ? 'celé číslo' : t.dec + (t.dec === 1 ? ' desetinné místo' : ' desetinná místa')}.`;
    if (!ok && !msg) { const tr = t.traps.find(([v]) => Math.abs(x - v) <= h); if (tr) msg = tr[1]; }
    if (strict && t.units && inp.unit !== t.unit) {
      msg = ok ? 'Číslo je správně, ale jednotka ne.' : (msg || '');
      ok = false;
    }
    return { ok, msg };
  }
  return { ok: false, msg: '' };
}

// Převod na rychlou úlohu se čtyřmi možnostmi (obrana města)
export function toChoice(t) {
  if (t.kind === 'choice') return t.opts.length <= 4 ? t : null;
  if (t.kind !== 'num') return null;
  const d = t.dec ?? 2, u = t.unit ? ' ' + t.unit : '', spr = cz(t.ans, d), set = new Set([spr]), bad = [];
  const kand = [...shuffle(t.traps.map(x => x[0])), ...shuffle([t.ans + 1, t.ans - 1, t.ans * 2, t.ans / 2, t.ans + 10, t.ans - 2, t.ans + 2, t.ans * 10])];
  for (const k of kand) {
    if (!(k > 0)) continue;
    const s = cz(k, d); if (set.has(s)) continue;
    set.add(s); bad.push(s + u); if (bad.length === 3) break;
  }
  if (bad.length < 3) return null;
  return C({ text: t.text, q: t.q, ok: spr + u, bad, steps: t.steps });
}

// ---------- souměrnosti na síti ----------
export function obrazOsa(p, o) {
  const [x, y] = p, k = o.k;
  return o.typ === 'v' ? [2 * k - x, y] : o.typ === 'h' ? [x, 2 * k - y] : o.typ === 'd1' ? [y - k, x + k] : [k - y, k - x];
}
export const obrazStred = (p, s) => [2 * s[0] - p[0], 2 * s[1] - p[1]];
const TVARY_SIT = {
  1: [[[0, 0]]],
  2: [[[0, 0], [2, 1]], [[0, 0], [1, 2]], [[0, 0], [2, 0]], [[0, 1], [2, 0]]],
  3: [[[0, 0], [3, 0], [1, 2]], [[0, 0], [2, 1], [0, 3]], [[0, 0], [3, 1], [1, 3]], [[0, 0], [2, 0], [0, 2]], [[1, 0], [3, 2], [0, 2]]],
  4: [[[0, 0], [3, 0], [3, 2], [1, 2]], [[0, 0], [2, 0], [3, 2], [1, 2]], [[0, 0], [3, 1], [2, 3], [0, 2]], [[1, 0], [3, 1], [2, 3], [0, 2]]],
};
// o: n (počet bodů), osa ['v','h','d1','d2'] nebo stred:true, pres (útvar smí osu protínat), naOse (jeden bod leží na ose)
export function sit(o) {
  const cols = 9, rows = 7, uvn = p => p[0] >= 0 && p[0] <= cols && p[1] >= 0 && p[1] <= rows;
  for (let pokus = 0; pokus < 400; pokus++) {
    let tv = pick(TVARY_SIT[o.n]).map(p => [...p]);
    if (chance(0.5)) tv = tv.map(p => [-p[0], p[1]]);
    if (chance(0.5)) tv = tv.map(p => [p[1], p[0]]);
    const dx = ri(-3, cols), dy = ri(-3, rows), body = tv.map(p => [p[0] + dx, p[1] + dy]);
    if (!body.every(uvn)) continue;
    let ans, osa = null, stred = null;
    if (o.stred) {
      stred = [ri(2, cols - 2), ri(2, rows - 2)];
      ans = body.map(p => obrazStred(p, stred));
      if (!o.pres && body.some(p => p[0] === stred[0] && p[1] === stred[1])) continue;
    } else {
      const typ = pick(o.osa);
      osa = { typ, k: typ === 'v' ? ri(2, cols - 2) : typ === 'h' ? ri(2, rows - 2) : typ === 'd1' ? ri(-2, 1) : ri(6, 10) };
      ans = body.map(p => obrazOsa(p, osa));
      const str = p => Math.sign(osa.typ === 'v' ? p[0] - osa.k : osa.typ === 'h' ? p[1] - osa.k : osa.typ === 'd1' ? p[1] - p[0] - osa.k : p[1] + p[0] - osa.k);
      const ss = body.map(str), nul = ss.filter(s => s === 0).length, plus = ss.some(s => s > 0), minus = ss.some(s => s < 0);
      if (o.naOse ? nul !== 1 : nul !== 0) { if (!o.pres) continue; }
      if (!o.pres && plus && minus) continue;
      if (o.pres && !(plus && minus)) continue;
    }
    if (!ans.every(uvn)) continue;
    const key = p => p[0] + ',' + p[1], stejne = ans.filter(p => body.some(q => key(q) === key(p))).length;
    if (stejne > (o.naOse ? 1 : 0) && !o.pres) continue;
    return { cols, rows, osa, stred, body, ans, jmena: 'ABCD'.slice(0, o.n).split(''), uzavrit: o.n > 2 };
  }
  throw new Error('sit: nepodařilo se vygenerovat');
}

// ---------- kontrola konstrukční úlohy (pro testy i hru) ----------
export function konOver(u) {
  const st = kStav();
  for (const s of [...u.init, ...u.plan]) { const e = kExec(st, s); if (e) return `krok ${JSON.stringify(s)}: ${e}`; }
  return kCil(st, u.goal);
}
export { V };
