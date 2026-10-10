// Konstrukční stavebnice – jádro bez DOM.
// Krok zápisu postupu je obyčejný objekt ({op:'circ', name:'k', c:'A', r:5}); jádro ho skutečně
// „narýsuje“ (spočítá body, přímky, kružnice). Správnost se neporovnává se vzorovým postupem,
// ale kontroluje se výsledek: uzná se každý postup, který vede k útvaru se zadanými vlastnostmi.
import { V, cz } from './util.js';
import { Fig } from './fig.js';

const E = 1e-6;
export function kStav() { return { pts: {}, lines: {}, circs: {}, draw: [] }; }
export const kKopie = st => JSON.parse(JSON.stringify(st));

function gl(st, ref) {
  if (st.lines[ref]) return st.lines[ref];
  if (ref.length === 2 && st.pts[ref[0]] && st.pts[ref[1]]) {
    const a = st.pts[ref[0]], b = st.pts[ref[1]];
    if (V.dist(a, b) < E) return null;
    return { p: a, d: V.unit(V.sub(b, a)) };
  }
  return null;
}
const naPaprsku = (L, p) => !L.ray || V.dot(V.sub(p, L.p), L.d) >= -E;

function pruseciky(o1, o2) {
  let r = [];
  const lc = (L, C) => {
    const f = V.sub(L.p, C.c), bq = V.dot(f, L.d), cq = V.dot(f, f) - C.r * C.r, D = bq * bq - cq;
    if (D < -E) return [];
    const sq = Math.sqrt(Math.max(0, D));
    return (sq < 1e-5 ? [-bq] : [-bq - sq, -bq + sq]).map(t => V.add(L.p, V.mul(L.d, t))).filter(p => naPaprsku(L, p));
  };
  if (o1.r !== undefined && o2.r !== undefined) {
    const d = V.dist(o1.c, o2.c);
    if (d < E || d > o1.r + o2.r + E || d < Math.abs(o1.r - o2.r) - E) return [];
    const a = (o1.r * o1.r - o2.r * o2.r + d * d) / (2 * d), h = Math.sqrt(Math.max(0, o1.r * o1.r - a * a));
    const u = V.unit(V.sub(o2.c, o1.c)), m = V.add(o1.c, V.mul(u, a)), n = V.perp(u);
    r = h < 1e-5 ? [m] : [V.add(m, V.mul(n, h)), V.sub(m, V.mul(n, h))];
  } else if (o1.r !== undefined) r = lc(o2, o1);
  else if (o2.r !== undefined) r = lc(o1, o2);
  else {
    const det = o1.d[0] * o2.d[1] - o1.d[1] * o2.d[0];
    if (Math.abs(det) < E) return [];
    const w = V.sub(o2.p, o1.p), t = (w[0] * o2.d[1] - w[1] * o2.d[0]) / det, p = V.add(o1.p, V.mul(o1.d, t));
    r = naPaprsku(o1, p) && naPaprsku(o2, p) ? [p] : [];
  }
  return r.sort((a, b) => Math.abs(b[1] - a[1]) > 1e-5 ? b[1] - a[1] : a[0] - b[0]); // horní (pak levý) první
}

// Provede krok. Vrací null, nebo českou chybovou hlášku (stav se při chybě nemění).
export function kExec(st, s) {
  const P = n => st.pts[n];
  const need = (...ns) => { for (const n of ns) if (!P(n)) return `Bod ${n} zatím nemáme. Nejdřív ho musíš sestrojit.`; return null; };
  const volne = n => (st.lines[n] || st.circs[n]) ? `Jméno ${n} už je použité.` : null;
  const obj = ref => st.circs[ref] || gl(st, ref);
  let e;
  switch (s.op) {
    case 'seg': {
      const a = P(s.a), b = P(s.b);
      if (a && b) {
        if (s.len != null && Math.abs(V.dist(a, b) - s.len) > 1e-4) return `Body ${s.a} a ${s.b} už jsou sestrojené a nejsou od sebe ${cz(s.len)} cm.`;
        st.draw.push(['seg', s.a, s.b]); return null;
      }
      if (!a && !b) {
        if (Object.keys(st.pts).length) return `Úsečku ${s.a}${s.b} nejde umístit – ani jeden její krajní bod ještě není sestrojený.`;
        if (s.len == null) return 'U první úsečky musíš zvolit délku.';
        st.pts[s.a] = [0, 0]; st.pts[s.b] = [s.len, 0]; st.draw.push(['seg', s.a, s.b]); return null;
      }
      return `Bod ${a ? s.b : s.a} zatím nemáme. Jeho polohu musíš nejdřív najít (kružnicí, úhlem nebo jako průsečík).`;
    }
    case 'line': if ((e = need(s.a, s.b))) return e; st.draw.push(['linepp', s.a, s.b]); return null;
    case 'circ': {
      if ((e = need(s.c) || volne(s.name))) return e;
      let r = s.r;
      if (typeof r === 'object') { if ((e = need(...r.pp))) return e; r = V.dist(P(r.pp[0]), P(r.pp[1])); }
      if (!(r > E)) return 'Kružnice musí mít kladný poloměr.';
      st.circs[s.name] = { c: P(s.c), r }; st.draw.push(['circ', s.name]); return null;
    }
    case 'ray': {
      if ((e = need(s.v, s.to) || volne(s.name))) return e;
      const d0 = V.unit(V.sub(P(s.to), P(s.v))), d1 = V.rot(d0, s.ang), d2 = V.rot(d0, -s.ang);
      st.lines[s.name] = { p: P(s.v), d: d2[1] > d1[1] + E ? d2 : d1, ray: true }; st.draw.push(['line', s.name]); return null;
    }
    case 'perp': case 'paral': case 'par': {
      const L = gl(st, s.to);
      if (!L) return `Přímku ${s.to} zatím nemáme.`;
      if ((e = volne(s.name))) return e;
      if (s.op === 'par') {
        let n = V.perp(L.d); if (n[1] < -E || (Math.abs(n[1]) < E && n[0] > 0)) n = V.mul(n, -1);
        st.lines[s.name] = { p: V.add(L.p, V.mul(n, s.dist)), d: L.d };
      } else {
        if ((e = need(s.thru))) return e;
        st.lines[s.name] = { p: P(s.thru), d: s.op === 'perp' ? V.perp(L.d) : L.d };
      }
      st.draw.push(['line', s.name]); return null;
    }
    case 'axis': {
      if ((e = need(s.a, s.b) || volne(s.name))) return e;
      st.lines[s.name] = { p: V.mid(P(s.a), P(s.b)), d: V.perp(V.unit(V.sub(P(s.b), P(s.a)))) }; st.draw.push(['line', s.name]); return null;
    }
    case 'mid':
      if ((e = need(s.a, s.b))) return e;
      if (P(s.name)) return `Bod ${s.name} už existuje.`;
      st.pts[s.name] = V.mid(P(s.a), P(s.b)); return null;
    case 'bis': {
      if ((e = need(s.v, s.a, s.b) || volne(s.name))) return e;
      const d = V.add(V.unit(V.sub(P(s.a), P(s.v))), V.unit(V.sub(P(s.b), P(s.v))));
      if (V.len(d) < E) return 'Tyto tři body leží v přímce, úhel nemá osu, kterou bychom potřebovali.';
      st.lines[s.name] = { p: P(s.v), d: V.unit(d), ray: true }; st.draw.push(['line', s.name]); return null;
    }
    case 'int': {
      if (P(s.name)) return `Bod ${s.name} už existuje.`;
      const o1 = obj(s.of[0]), o2 = obj(s.of[1]);
      if (!o1) return `Objekt ${s.of[0]} zatím nemáme.`;
      if (!o2) return `Objekt ${s.of[1]} zatím nemáme.`;
      if (s.of[0] === s.of[1]) return 'Průsečík potřebuje dva různé objekty.';
      const c = pruseciky(o1, o2);
      if (!c.length) return `${s.of[0]} a ${s.of[1]} se neprotínají.`;
      if ((s.pick || 0) >= c.length) return `${s.of[0]} a ${s.of[1]} mají jen jeden společný bod.`;
      st.pts[s.name] = c[s.pick || 0]; return null;
    }
    case 'poly':
      if ((e = need(...s.pts))) return e;
      st.draw.push(['poly', s.pts.join('')]); return null;
    case 'given': // zadaný útvar („je dán trojúhelník ABC“)
      for (const [n, p] of Object.entries(s.pts)) st.pts[n] = [...p];
      for (const [n, k] of Object.entries(s.circs || {})) { st.circs[n] = { c: st.pts[k.c], r: k.r }; st.draw.push(['circ', n]); }
      if (s.poly) st.draw.push(['gpoly', s.poly]);
      return null;
  }
  return 'Neznámý krok.';
}
// Kolik průsečíků mají dva objekty (pro nabídku „první / druhý průsečík“)
export function kPocetPruseciku(st, r1, r2) {
  const o1 = st.circs[r1] || gl(st, r1), o2 = st.circs[r2] || gl(st, r2);
  return o1 && o2 && r1 !== r2 ? pruseciky(o1, o2).length : 0;
}
export function kProved(kroky, st = kStav()) {
  for (const s of kroky) { const e = kExec(st, s); if (e) throw new Error(`Krok ${JSON.stringify(s)}: ${e}`); }
  return st;
}

// ---------- kontrola výsledku ----------
const uhel = (x, v, y) => { const a = V.unit(V.sub(x, v)), b = V.unit(V.sub(y, v)); return Math.acos(Math.max(-1, Math.min(1, V.dot(a, b)))) * 180 / Math.PI; };
const odPrimky = (p, a, b) => { const d = V.unit(V.sub(b, a)), w = V.sub(p, a); return Math.abs(w[0] * d[1] - w[1] * d[0]); };
const T = 1e-4;
// Vrací null (splněno), nebo hlášku, co ještě nesedí.
export function kCil(st, cil) {
  const P = n => st.pts[n];
  for (const c of cil) {
    const jm = c.slice(1).filter(x => typeof x === 'string' && x.length === 1 && x >= 'A' && x <= 'Z');
    const ch = jm.find(n => !P(n));
    if (ch && c[0] !== 'poly') return `Ještě chybí bod ${ch}.`;
    switch (c[0]) {
      case 'pt': break;
      case 'dist': if (Math.abs(V.dist(P(c[1]), P(c[2])) - c[3]) > T) return `Úsečka ${c[1]}${c[2]} neměří ${cz(c[3])} cm.`; break;
      case 'ang': if (Math.abs(uhel(P(c[1]), P(c[2]), P(c[3])) - c[4]) > 1e-3) return `Úhel ${c[1]}${c[2]}${c[3]} nemá ${cz(c[4])}°.`; break;
      case 'hgt': if (Math.abs(odPrimky(P(c[1]), P(c[2]), P(c[3])) - c[4]) > T) return `Bod ${c[1]} není od přímky ${c[2]}${c[3]} vzdálený ${cz(c[4])} cm.`; break;
      case 'med': if (Math.abs(V.dist(P(c[1]), V.mid(P(c[2]), P(c[3]))) - c[4]) > T) return `Těžnice z vrcholu ${c[1]} neměří ${cz(c[4])} cm.`; break;
      case 'parl': { const a = V.unit(V.sub(P(c[2]), P(c[1]))), b = V.unit(V.sub(P(c[4]), P(c[3]))); if (Math.abs(a[0] * b[1] - a[1] * b[0]) > T) return `Strany ${c[1]}${c[2]} a ${c[3]}${c[4]} nejsou rovnoběžné.`; break; }
      case 'mid': if (V.dist(P(c[1]), V.mid(P(c[2]), P(c[3]))) > T) return `Bod ${c[1]} není střed úsečky ${c[2]}${c[3]}.`; break;
      case 'foot': if (odPrimky(P(c[1]), P(c[3]), P(c[4])) > T || Math.abs(V.dot(V.sub(P(c[2]), P(c[1])), V.sub(P(c[4]), P(c[3])))) > T) return `Bod ${c[1]} není pata kolmice z bodu ${c[2]} na přímku ${c[3]}${c[4]}.`; break;
      case 'centroid': { const g = [1, 2].map(i => (P(c[2])[i - 1] + P(c[3])[i - 1] + P(c[4])[i - 1]) / 3); if (V.dist(P(c[1]), g) > T) return `Bod ${c[1]} není těžiště.`; break; }
      case 'circ3': if (!Object.values(st.circs).some(k => [c[1], c[2], c[3]].every(n => Math.abs(V.dist(P(n), k.c) - k.r) < T))) return `Chybí kružnice, která prochází body ${c[1]}, ${c[2]} a ${c[3]}.`; break;
      case 'incirc': {
        const [A, B, C] = [P(c[1]), P(c[2]), P(c[3])];
        if (!Object.values(st.circs).some(k => [[A, B], [B, C], [C, A]].every(([x, y]) => Math.abs(odPrimky(k.c, x, y) - k.r) < T) && k.r < V.dist(A, B))) return 'Chybí kružnice, která se dotýká všech tří stran.';
        break;
      }
      case 'segd': if (!st.draw.some(d => (d[0] === 'seg' || d[0] === 'linepp') && ((d[1] === c[1] && d[2] === c[2]) || (d[1] === c[2] && d[2] === c[1])))) return `Ještě spoj body ${c[1]} a ${c[2]}.`; break;
      case 'tangent': {
        const k = st.circs[c[2]], M = P(c[1]);
        const ok = Object.keys(st.pts).some(n => n !== c[1] && Math.abs(V.dist(P(n), k.c) - k.r) < T && Math.abs(V.dot(V.sub(P(n), k.c), V.sub(P(n), M))) < T
          && st.draw.some(d => (d[0] === 'seg' || d[0] === 'linepp') && [d[1], d[2]].includes(n) && [d[1], d[2]].includes(c[1])));
        if (!ok) return `Chybí tečna z bodu ${c[1]}: přímka bodem ${c[1]} a bodem dotyku.`;
        break;
      }
      case 'poly': {
        const chce = [...c[1]].sort().join('');
        const ch2 = [...c[1]].find(n => !P(n)); if (ch2) return `Ještě chybí bod ${ch2}.`;
        if (!st.draw.some(d => d[0] === 'poly' && [...d[1]].sort().join('') === chce)) return `Nakonec zapiš výsledný útvar ${c[1]}.`;
        break;
      }
    }
  }
  return null;
}

// ---------- zápis ve školní symbolice ----------
const rf = r => /^[A-W][XYZ]$/.test(r) ? '↦' + r : (/^[A-Z]{2}$/.test(r) ? '↔' + r : r);
const TVAR = n => n === 3 ? '△' : '';
export function kZapis(s, o = {}) {
  switch (s.op) {
    case 'seg': return s.len != null ? `${s.a}${s.b}; |${s.a}${s.b}| = ${cz(s.len)} cm` : `úsečka ${s.a}${s.b}`;
    case 'line': return `přímka ${s.a}${s.b}`;
    case 'circ': return `${s.name}; ${s.name}(${s.c}; ${typeof s.r === 'object' ? `|${s.r.pp.join('')}|` : cz(s.r) + ' cm'})`;
    case 'ray': return `↦${s.name}; |∢${s.to}${s.v}${s.name[1]}| = ${cz(s.ang)}°`;
    case 'perp': return `${s.name}; ${s.name} ⊥ ${rf(s.to)}, ${s.thru} ∈ ${s.name}`;
    case 'par': return `${s.name}; ${s.name} ∥ ${rf(s.to)}, |${s.name}, ${s.to}| = ${cz(s.dist)} cm`;
    case 'paral': return `${s.name}; ${s.name} ∥ ${rf(s.to)}, ${s.thru} ∈ ${s.name}`;
    case 'axis': return `${s.name}; ${s.name} je osa úsečky ${s.a}${s.b}`;
    case 'mid': return `${s.name}; ${s.name} je střed úsečky ${s.a}${s.b}`;
    case 'bis': return `${s.name}; ${s.name} je osa úhlu ${s.a}${s.v}${s.b}`;
    case 'int': return `${s.name}; ${s.name} ∈ ${rf(s.of[0])} ∩ ${rf(s.of[1])}`;
    case 'poly': return `${s.label || (TVAR(s.pts.length) || 'útvar ') + s.pts.join('')}`;
  }
  return '';
}
// Totéž slovy – pro vedený postup na nejnižší úrovni
export function kSlovy(s) {
  switch (s.op) {
    case 'seg': return s.len != null ? `Narýsujeme úsečku ${s.a}${s.b} dlouhou ${cz(s.len)} cm.` : `Spojíme body ${s.a} a ${s.b}.`;
    case 'line': return `Narýsujeme přímku body ${s.a} a ${s.b}.`;
    case 'circ': return typeof s.r === 'object'
      ? `Do kružítka vezmeme vzdálenost bodů ${s.r.pp[0]} a ${s.r.pp[1]} a narýsujeme kružnici ${s.name} se středem ${s.c}.`
      : `Do kružítka vezmeme ${cz(s.r)} cm a narýsujeme kružnici ${s.name} se středem ${s.c}.`;
    case 'ray': return `U vrcholu ${s.v} narýsujeme úhel ${cz(s.ang)}°: jedno rameno míří k bodu ${s.to}, druhé je polopřímka ${s.name}.`;
    case 'perp': return `Bodem ${s.thru} vedeme kolmici ${s.name} k přímce ${s.to}.`;
    case 'par': return `Narýsujeme rovnoběžku ${s.name} s přímkou ${s.to} ve vzdálenosti ${cz(s.dist)} cm.`;
    case 'paral': return `Bodem ${s.thru} vedeme rovnoběžku ${s.name} s přímkou ${s.to}.`;
    case 'axis': return `Sestrojíme osu ${s.name} úsečky ${s.a}${s.b}: je kolmá k úsečce a prochází jejím středem.`;
    case 'mid': return `Najdeme střed ${s.name} úsečky ${s.a}${s.b}.`;
    case 'bis': return `Sestrojíme osu ${s.name} úhlu ${s.a}${s.v}${s.b}: půlí ho na dva stejné úhly.`;
    case 'int': return `Bod ${s.name} leží tam, kde se protínají ${s.of[0]} a ${s.of[1]}.`;
    case 'poly': return `Body spojíme a máme ${s.label || 'útvar ' + s.pts.join('')}.`;
  }
  return '';
}

// ---------- otázka ke kroku (vedený postup, úroveň 1) ----------
function jine(spr, kandidati, n = 2) {
  const out = []; for (const k of kandidati) if (k !== spr && !out.includes(k)) out.push(k);
  return out.slice(0, n);
}
export function kOtazka(u, i) {
  const s = u.plan[i], L = (u.lens || []).map(x => cz(x) + ' cm'), A = (u.angs || []).map(x => cz(x) + '°');
  const dopln = (ok, kand, gen) => { const b = jine(ok, kand); let j = 1; while (b.length < 2) { const x = gen(j++); if (x !== ok && !b.includes(x)) b.push(x); } return { ok, bad: b }; };
  switch (s.op) {
    case 'seg': if (s.len == null) return null;
      return { text: `Začneme úsečkou ${s.a}${s.b}. Jak bude dlouhá?`, ...dopln(cz(s.len) + ' cm', L, j => cz(s.len + j) + ' cm') };
    case 'circ': if (typeof s.r === 'object') return null;
      return { text: `Kružnice ${s.name} bude mít střed v bodě ${s.c}. Jaký poloměr vezmeme do kružítka?`, ...dopln(cz(s.r) + ' cm', L, j => cz(s.r + j) + ' cm') };
    case 'ray': return { text: `U vrcholu ${s.v} rýsujeme úhel. Jak velký?`, ...dopln(cz(s.ang) + '°', A, j => cz(j === 1 ? 180 - s.ang : (s.ang > 45 ? s.ang - 20 : s.ang + 20)) + '°') };
    case 'par': return { text: `Jak daleko od přímky ${s.to} povede rovnoběžka ${s.name}?`, ...dopln(cz(s.dist) + ' cm', L, j => cz(s.dist + j) + ' cm') };
    case 'int': return { text: `Kde leží bod ${s.name}?`, ok: `V průsečíku ${s.of[0]} a ${s.of[1]}`, bad: [`Kdekoli na ${s.of[0]}`, 'Uprostřed první úsečky'] };
    case 'axis': return { text: `Co je osa úsečky ${s.a}${s.b}?`, ok: 'Kolmice, která prochází středem úsečky', bad: [`Kolmice, která prochází bodem ${s.a}`, 'Polopřímka, která půlí úhel'] };
    case 'mid': return { text: `Kde leží střed úsečky ${s.a}${s.b}?`, ok: `Přesně v polovině mezi ${s.a} a ${s.b}`, bad: [`V bodě ${s.a}`, 'Kdekoli na úsečce'] };
    case 'perp': return { text: `Kolmice k přímce ${s.to} svírá s touto přímkou úhel…`, ok: '90°', bad: ['45°', '180°'] };
    case 'bis': return { text: 'Co udělá osa úhlu?', ok: 'Rozdělí úhel na dva stejně velké úhly', bad: ['Rozdělí protější stranu na poloviny', 'Je kolmá k protější straně'] };
  }
  return null;
}
// Návnady pro úroveň 2: kroky, které vypadají správně, ale mají prohozený poloměr / úhel
export function kNavnady(u) {
  const out = [], circ = u.plan.filter(s => s.op === 'circ' && typeof s.r === 'number'), ray = u.plan.filter(s => s.op === 'ray');
  const lens = u.lens || [], angs = u.angs || [];
  for (const s of circ) { const r = lens.find(x => x !== s.r) ?? s.r + 1; out.push({ ...s, r }); }
  for (const s of ray) { const a = angs.find(x => x !== s.ang) ?? (s.ang > 90 ? s.ang - 30 : s.ang + 30); out.push({ ...s, ang: a }); }
  for (const s of u.plan.filter(x => x.op === 'par')) { const d = lens.find(x => x !== s.dist) ?? s.dist + 1; out.push({ ...s, dist: d }); }
  return out.slice(0, 3);
}

// ---------- kreslení stavu ----------
function clip(p, d, x0, y0, x1, y1, ray) {
  let t0 = ray ? 0 : -1e9, t1 = 1e9;
  for (const [pi, di, lo, hi] of [[p[0], d[0], x0, x1], [p[1], d[1], y0, y1]]) {
    if (Math.abs(di) < 1e-12) { if (pi < lo || pi > hi) return null; continue; }
    let a = (lo - pi) / di, b = (hi - pi) / di; if (a > b) [a, b] = [b, a];
    t0 = Math.max(t0, a); t1 = Math.min(t1, b);
  }
  return t0 < t1 ? [V.add(p, V.mul(d, t0)), V.add(p, V.mul(d, t1))] : null;
}
export function kSvg(st, o = {}) {
  const F = new Fig({ W: 340, H: o.H || 250, pad: 26 }), names = Object.keys(st.pts);
  if (!names.length) return `<svg viewBox="0 0 340 ${o.H || 250}" class="fg" xmlns="http://www.w3.org/2000/svg"><text x="170" y="${(o.H || 250) / 2}" text-anchor="middle" class="fg-t fg-th">Tady se bude rýsovat.</text></svg>`;
  let bb = [Infinity, Infinity, -Infinity, -Infinity];
  const e = (x, y) => { bb = [Math.min(bb[0], x), Math.min(bb[1], y), Math.max(bb[2], x), Math.max(bb[3], y)]; };
  names.forEach(n => e(...st.pts[n]));
  Object.values(st.circs).forEach(k => { const r = Math.min(k.r, 9); e(k.c[0] - r, k.c[1] - r); e(k.c[0] + r, k.c[1] + r); });
  const m = Math.max(1.2, (bb[2] - bb[0]) * 0.12); bb = [bb[0] - m, bb[1] - m, bb[2] + m, bb[3] + m];
  if (bb[3] - bb[1] < 4) { bb[3] += 2; bb[1] -= 1; }
  F.ext(bb[0], bb[1]).ext(bb[2], bb[3]);
  const posl = o.posledni ? st.draw.length - 1 : -1;
  st.draw.forEach((d, i) => {
    const c = i === posl ? 'a' : 'k';
    if (d[0] === 'circ') { const k = st.circs[d[1]]; F.circle(k.c, k.r, { c }); F.lab(V.add(k.c, V.rot([k.r, 0], 125)), d[1], { dx: -8, dy: -8, cls: i === posl ? 'a' : 'h' }); }
    else if (d[0] === 'line') {
      const L = st.lines[d[1]], s = clip(L.p, L.d, ...bb, L.ray);
      if (s) { F.seg(s[0], s[1], { c }); F.lab(s[1], d[1].length === 2 ? d[1][1] : d[1], { dx: -9, dy: 11, cls: i === posl ? 'a' : 'h' }); }
    } else if (d[0] === 'linepp') { const a = st.pts[d[1]], s = clip(a, V.unit(V.sub(st.pts[d[2]], a)), ...bb, false); if (s) F.seg(s[0], s[1], { c: i === posl ? 'a' : 's' }); }
  });
  st.draw.forEach(d => {
    if (d[0] === 'poly') F.poly([...d[1]].map(n => st.pts[n]), { c: 'a', fill: 'a' });
    if (d[0] === 'gpoly') F.poly([...d[1]].map(n => st.pts[n]), { c: 's', fill: 1 });
  });
  st.draw.forEach((d, i) => { if (d[0] === 'seg') F.seg(st.pts[d[1]], st.pts[d[2]], { c: i === posl ? 'a' : 's' }); });
  const c0 = [names.reduce((s, n) => s + st.pts[n][0], 0) / names.length, names.reduce((s, n) => s + st.pts[n][1], 0) / names.length];
  names.forEach(n => {
    const p = st.pts[n], u = V.dist(p, c0) < 1e-6 ? [0.7, 0.7] : V.unit(V.sub(p, c0));
    F.pt(p, '', 'ne').lab(p, n, { dx: u[0] * 13, dy: -u[1] * 13, cls: 'n' });
  });
  return F.svg();
}

// ---------- náčrtek ----------
// Obecný (ne v měřítku) obrázek útvaru; žák v něm vyznačí, co je zadáno.
const SUB = (z, i) => `${z}<tspan dy="3" font-size="9">${i}</tspan>`;
export const NACRTKY = {
  tri: { nazev: 'trojúhelník ABC', prvky: { a: 'strana a', b: 'strana b', c: 'strana c', al: 'úhel α', be: 'úhel β', ga: 'úhel γ', vc: 'výška na stranu c', tc: 'těžnice na stranu c' } },
  par: { nazev: 'rovnoběžník ABCD', prvky: { a: 'strana a', b: 'strana b', al: 'úhel α', be: 'úhel β', va: 'výška na stranu a', e: 'úhlopříčka e', f: 'úhlopříčka f' } },
  trap: { nazev: 'lichoběžník ABCD', prvky: { a: 'základna a', b: 'rameno b', c: 'základna c', d: 'rameno d', al: 'úhel α', be: 'úhel β', v: 'výška v', e: 'úhlopříčka e' } },
};
// Bez hodnot je to obecný útvar, ve kterém žák vyznačuje, co je dáno.
// S `hodnoty` ({ prvek: '7 cm' }) je to hotový náčrtek jako v sešitě: zadané prvky jsou zvýrazněné a mají u sebe hodnotu,
// pomocné čáry, které zadané nejsou, se nekreslí. Hotový náčrtek se VŽDY kreslí ze skutečných bodů řešení (`body`),
// aby delší strana byla i na obrázku delší a tupý úhel tupý – hodnota nesmí odporovat tomu, co je vidět.
export const ZNACKY = { a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', v: 'v', al: 'α', be: 'β', ga: 'γ', vc: ['v', 'c'], tc: ['t', 'c'], va: ['v', 'a'] };
const OBECNE = { tri: { A: [0, 0], B: [8.4, 0], C: [2.2, 5.4] }, par: { A: [0, 0], B: [7, 0], C: [9.4, 4.4], D: [2.4, 4.4] }, trap: { A: [0, 0], B: [9, 0], C: [6.6, 4.4], D: [2, 4.4] } };
export function nacrtekSvg(tpl, vybrane = [], hodnoty = null, body = null) {
  if (hodnoty && !body) throw new Error('Náčrtek s hodnotami musí dostat skutečné body řešení.');
  const F = new Fig({ W: 340, H: 230, pad: hodnoty ? 48 : 34 }), on = k => vybrane.includes(k);
  const ma = k => !!hodnoty && hodnoty[k] != null, pop = (k, txt) => (ma(k) ? `${txt} = ${hodnoty[k]}` : txt);
  const jen = k => !hodnoty || on(k); // pomocná čára se v hotovém náčrtku kreslí, jen když je zadaná
  const S = (k, a, b, txt, off, dash) => {
    if (dash && !jen(k)) return;
    F.seg(a, b, { el: k, on: on(k), dash, c: dash ? 'h' : 's' }).mid(a, b, pop(k, txt), off, { cls: on(k) ? 'a' : 'h', rot: ma(k) });
  };
  // zadaný úhel má hodnotu napsanou vně útvaru hned u vrcholu (kde = posun a zarovnání), uvnitř by se křížila s výškou
  const U = (k, v, p1, p2, txt, kde) => {
    if (hodnoty && !on(k)) return; // nezadané úhly v hotovém náčrtku jen překážejí
    F.ang(v, p1, p2, ma(k) ? '' : txt, { el: k, on: on(k), c: 'h', cls: on(k) ? 'a' : 'h', r: 24 });
    if (ma(k)) F.lab(v, pop(k, txt), { ...kde, cls: 'a' });
  };
  const VLEVO = { dx: 12, dy: 23, anchor: 'end' }, VPRAVO = { dx: -12, dy: 23, anchor: 'start' }, NAHORE = { dx: 15, dy: -3, anchor: 'start' };
  const B0 = body || OBECNE[tpl], A = B0.A, B = B0.B, C = B0.C, D = B0.D;
  const pata = X => { const d = V.unit(V.sub(B, A)); return V.add(A, V.mul(d, V.dot(V.sub(X, A), d))); };
  const vrcholy = tpl === 'tri' ? [A, B, C] : [A, B, C, D], c0 = [0, 1].map(i => vrcholy.reduce((s, p) => s + p[i], 0) / vrcholy.length);
  F.poly(vrcholy, { fill: 1, c: 'n' });
  // Popisek vnitřní čáry (výška, těžnice, úhlopříčka) jde na tu stranu čáry, kde je k ostatním čarám dál.
  const xs = vrcholy.map(p => p[0]), ys = vrcholy.map(p => p[1]);
  const mer = Math.min(244 / (Math.max(...xs) - Math.min(...xs) || 1), 134 / (Math.max(...ys) - Math.min(...ys) || 1)); // px na jednotku
  const odUsecky = (p, a, b) => { const d = V.sub(b, a), t = Math.max(0, Math.min(1, V.dot(V.sub(p, a), d) / (V.dot(d, d) || 1))); return V.dist(p, V.add(a, V.mul(d, t))); };
  const strany = vrcholy.map((p, i) => [p, vrcholy[(i + 1) % vrcholy.length]]), vnitrni = [];
  const kam = (a, b, off = 15) => {
    const u = V.unit(V.sub(b, a)), n = V.perp(u), m = V.mid(a, b), jine = [...strany, ...vnitrni.filter(([x, y]) => x !== a || y !== b)];
    const volno = z => Math.min(...[-22, 0, 22].flatMap(pos => jine.map(([x, y]) => odUsecky(V.add(m, V.add(V.mul(u, pos / mer), V.mul(n, z * off / mer))), x, y))));
    return volno(1) >= volno(-1) ? off : -off;
  };
  // výška z bodu X na AB: když pata padne mimo stranu, dokreslí se prodloužení strany
  const vyska = (k, X, txt, off) => {
    if (!jen(k)) return () => {};
    const P = pata(X), t = V.dot(V.sub(P, A), V.unit(V.sub(B, A))), dal = V.dist(P, A) > V.dist(P, B) ? A : B;
    vnitrni.push([X, P]);
    return () => {
      if (t < -1e-6) F.seg(A, P, { c: 'h', dash: 1 }); else if (t > V.dist(A, B) + 1e-6) F.seg(B, P, { c: 'h', dash: 1 });
      S(k, X, P, txt, hodnoty ? kam(X, P) : off, 1); F.right(P, dal, X);
    };
  };
  const cara = (k, a, b, txt, off) => { if (!jen(k)) return () => {}; vnitrni.push([a, b]); return () => S(k, a, b, txt, hodnoty ? kam(a, b) : off, 1); };
  if (tpl === 'tri') {
    [vyska('vc', C, SUB('v', 'c'), -13), cara('tc', C, V.mid(A, B), SUB('t', 'c'), 14)].forEach(f => f());
    S('c', A, B, 'c', -15); S('a', B, C, 'a', -15); S('b', C, A, 'b', -15);
    U('al', A, B, C, 'α', VLEVO); U('be', B, C, A, 'β', VPRAVO); U('ga', C, A, B, 'γ', NAHORE);
  } else if (tpl === 'par') {
    [cara('e', A, C, 'e', 12), cara('f', B, D, 'f', -12), vyska('va', D, SUB('v', 'a'), 15)].forEach(f => f());
    S('a', A, B, 'a', -15); S('b', B, C, 'b', -15); F.seg(C, D).seg(D, A);
    U('al', A, B, D, 'α', VLEVO); U('be', B, C, A, 'β', VPRAVO);
  } else {
    [cara('e', A, C, 'e', 12), vyska('v', D, 'v', 14)].forEach(f => f());
    S('a', A, B, 'a', -15); S('b', B, C, 'b', -15); S('c', C, D, 'c', -14); S('d', D, A, 'd', -15);
    U('al', A, B, D, 'α', VLEVO); U('be', B, C, A, 'β', VPRAVO);
  }
  vrcholy.forEach((p, i) => { const u = V.unit(V.sub(p, c0)); F.lab(p, 'ABCD'[i], { dx: u[0] * 14, dy: -u[1] * 14, cls: 'n' }); });
  return F.svg();
}
