// Obrázky: kreslí se ve „světových“ souřadnicích (osa y nahoru), do SVG se přepočítají až na konci.
// Barvy jdou přes třídy fg-* (viz css), takže fungují ve všech třech motivech.
import { V } from './util.js';

const f1 = n => Math.round(n * 10) / 10;
const DIRS = { n: [0, -12], s: [0, 14], e: [12, 0], w: [-12, 0], ne: [9, -9], nw: [-9, -9], se: [9, 11], sw: [-9, 11] };
const SC = { s: 'fg-s', a: 'fg-a', h: 'fg-h', k: 'fg-k', g: 'fg-g', q: 'fg-q', n: 'fg-n' };
const TC = { t: 'fg-t', a: 'fg-t fg-ta', h: 'fg-t fg-th', q: 'fg-t fg-tq', n: 'fg-t fg-tn' };

export class Fig {
  constructor(o = {}) {
    this.W = o.W || 320; this.H = o.H || 210; this.pad = o.pad ?? 34;
    this.it = []; this.bb = [Infinity, Infinity, -Infinity, -Infinity];
  }
  ext(x, y) { const b = this.bb; if (x < b[0]) b[0] = x; if (y < b[1]) b[1] = y; if (x > b[2]) b[2] = x; if (y > b[3]) b[3] = y; return this; }
  _p(p) { this.ext(p[0], p[1]); }
  poly(pts, o = {}) { pts.forEach(p => this._p(p)); this.it.push(['poly', pts, o]); return this; }
  seg(a, b, o = {}) { this._p(a); this._p(b); this.it.push(['seg', a, b, o]); return this; }
  circle(c, r, o = {}) { this.ext(c[0] - r, c[1] - r); this.ext(c[0] + r, c[1] + r); this.it.push(['circ', c, r, o]); return this; }
  // elipsa: o.part = 'front' (dolní půlka), 'back' (horní půlka), jinak celá
  ell(c, rx, ry, o = {}) { this.ext(c[0] - rx, c[1] - ry); this.ext(c[0] + rx, c[1] + ry); this.it.push(['ell', c, rx, ry, o]); return this; }
  ellSplit(c, rx, ry, o = {}) { return this.ell(c, rx, ry, { ...o, part: 'back', c: 'h', dash: 1, fill: 0 }).ell(c, rx, ry, { ...o, part: 'front' }); }
  // kruhová výseč / oblouk ve světových jednotkách, proti směru hodin od a0 do a1 (stupně)
  sector(c, r, a0, a1, o = {}) { this.ext(c[0] - r, c[1] - r); this.ext(c[0] + r, c[1] + r); this.it.push(['sec', c, r, a0, a1, o]); return this; }
  ang(v, p1, p2, txt, o = {}) { this.it.push(['ang', v, p1, p2, txt, o]); return this; }
  right(v, p1, p2, o = {}) { this.it.push(['right', v, p1, p2, o]); return this; }
  pt(p, name, dir = 'ne', o = {}) { this._p(p); this.it.push(['pt', p, name, dir, o]); return this; }
  lab(p, txt, o = {}) { this._p(p); this.it.push(['lab', p, txt, o]); return this; }
  // popisek u středu úsečky; off > 0 = vlevo od směru a→b
  mid(a, b, txt, off = 13, o = {}) { this.it.push(['mid', a, b, txt, off, o]); return this; }
  grid(x0, y0, x1, y1) { this.ext(x0, y0); this.ext(x1, y1); this.it.unshift(['grid', x0, y0, x1, y1]); return this; }

  svg(extra = '') {
    const { W, H, pad } = this;
    let [x0, y0, x1, y1] = this.bb;
    if (!isFinite(x0)) { x0 = y0 = 0; x1 = y1 = 1; }
    const bw = x1 - x0, bh = y1 - y0, iw = W - 2 * pad, ih = H - 2 * pad;
    let s = Math.min(bw > 1e-9 ? iw / bw : Infinity, bh > 1e-9 ? ih / bh : Infinity);
    if (!isFinite(s)) s = 1;
    const ox = pad + (iw - bw * s) / 2, oy = pad + (ih - bh * s) / 2;
    const X = x => f1(ox + (x - x0) * s), Y = y => f1(H - oy - (y - y0) * s);
    const P = p => [ox + (p[0] - x0) * s, H - oy - (p[1] - y0) * s];
    const cls = (o, base = 's') => SC[o.c || base] + (o.dash ? ' fg-d' : '') + (o.fill ? (o.fill === 'a' ? ' fg-fa' : ' fg-f') : ' fg-nf');
    const tx = (x, y, txt, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" dy=".35em" text-anchor="${o.anchor || 'middle'}"${o.rot ? ` transform="rotate(${f1(o.rot)} ${f1(x)} ${f1(y)})"` : ''} class="${TC[o.cls || (txt === '?' ? 'q' : 't')]}">${txt}</text>`;
    const out = [], texts = [];
    for (const it of this.it) {
      const t = it[0];
      if (t === 'grid') {
        const [, gx0, gy0, gx1, gy1] = it; let g = '';
        for (let x = gx0; x <= gx1 + 1e-9; x++) g += `M${X(x)} ${Y(gy0)}V${Y(gy1)}`;
        for (let y = gy0; y <= gy1 + 1e-9; y++) g += `M${X(gx0)} ${Y(y)}H${X(gx1)}`;
        out.push(`<path d="${g}" class="fg-g"/>`);
      } else if (t === 'poly') {
        const [, pts, o] = it;
        out.push(`<${o.open ? 'polyline' : 'polygon'} points="${pts.map(p => X(p[0]) + ',' + Y(p[1])).join(' ')}" class="${cls(o)}"/>`);
      } else if (t === 'seg') {
        const [, a, b, o] = it;
        const ln = k => `<line x1="${X(a[0])}" y1="${Y(a[1])}" x2="${X(b[0])}" y2="${Y(b[1])}" class="${k}"/>`;
        out.push(o.el ? `<g class="nk-el${o.on ? ' nk-on' : ''}" data-el="${o.el}">${ln(cls(o))}${ln('nk-hit')}</g>` : ln(cls(o)));
      } else if (t === 'circ') {
        const [, c, r, o] = it;
        out.push(`<circle cx="${X(c[0])}" cy="${Y(c[1])}" r="${f1(r * s)}" class="${cls(o)}"/>`);
      } else if (t === 'ell') {
        const [, c, rx, ry, o] = it; const cx = X(c[0]), cy = Y(c[1]), RX = f1(rx * s), RY = f1(ry * s);
        if (o.part) out.push(`<path d="M${f1(cx - RX)} ${cy}A${RX} ${RY} 0 0 ${o.part === 'front' ? 0 : 1} ${f1(cx + RX)} ${cy}" class="${cls({ ...o, fill: 0 })}"/>`);
        else out.push(`<ellipse cx="${cx}" cy="${cy}" rx="${RX}" ry="${RY}" class="${cls(o)}"/>`);
      } else if (t === 'sec') {
        const [, c, r, a0, a1, o] = it; const R = f1(r * s);
        const p0 = P(V.add(c, V.rot([r, 0], a0))), p1 = P(V.add(c, V.rot([r, 0], a1)));
        const large = ((a1 - a0) % 360 + 360) % 360 > 180 ? 1 : 0;
        const d = o.arcOnly
          ? `M${f1(p0[0])} ${f1(p0[1])}A${R} ${R} 0 ${large} 0 ${f1(p1[0])} ${f1(p1[1])}`
          : `M${X(c[0])} ${Y(c[1])}L${f1(p0[0])} ${f1(p0[1])}A${R} ${R} 0 ${large} 0 ${f1(p1[0])} ${f1(p1[1])}Z`;
        out.push(`<path d="${d}" class="${cls(o)}"/>`);
      } else if (t === 'ang') {
        const [, v, p1, p2, txt, o] = it; const Vs = P(v);
        const a1 = V.ang(V.sub(p1, v)), a2 = V.ang(V.sub(p2, v));
        let d = ((a2 - a1) % 360 + 540) % 360 - 180; // nejkratší cesta, kladně = proti směru hodin
        if (o.ccw) d = ((a2 - a1) % 360 + 360) % 360;
        const r = o.r || (Math.abs(d) < 35 ? 30 : 20);
        const s1 = [Vs[0] + r * Math.cos(a1 * Math.PI / 180), Vs[1] - r * Math.sin(a1 * Math.PI / 180)];
        const e2 = (a1 + d) * Math.PI / 180;
        const s2 = [Vs[0] + r * Math.cos(e2), Vs[1] - r * Math.sin(e2)];
        const arc = `M${f1(s1[0])} ${f1(s1[1])}A${r} ${r} 0 ${Math.abs(d) > 180 ? 1 : 0} ${d > 0 ? 0 : 1} ${f1(s2[0])} ${f1(s2[1])}`;
        const ap = `<path d="${arc}" class="${SC[o.c || 'a']} fg-nf fg-arc"/>`;
        out.push(o.el ? `<g class="nk-el${o.on ? ' nk-on' : ''}" data-el="${o.el}">${ap}<path d="M${f1(Vs[0])} ${f1(Vs[1])}L${arc.slice(1)}Z" class="nk-hit nk-hita"/></g>` : ap);
        if (txt) {
          const am = (a1 + d / 2) * Math.PI / 180, lr = o.lr || r + 13;
          texts.push(tx(Vs[0] + lr * Math.cos(am), Vs[1] - lr * Math.sin(am), txt, { cls: o.cls || (txt === '?' ? 'q' : 'a') }));
        }
      } else if (t === 'right') {
        const [, v, p1, p2, o] = it; const Vs = P(v), k = o.r || 9;
        const u1 = V.unit(V.sub(P(p1), Vs)), u2 = V.unit(V.sub(P(p2), Vs));
        const a = V.add(Vs, V.mul(u1, k)), c = V.add(Vs, V.mul(u2, k)), b = V.add(a, V.mul(u2, k));
        out.push(`<polyline points="${f1(a[0])},${f1(a[1])} ${f1(b[0])},${f1(b[1])} ${f1(c[0])},${f1(c[1])}" class="fg-a fg-nf fg-arc"/>`);
      } else if (t === 'pt') {
        const [, p, name, dir, o] = it; const Ps = P(p), dd = DIRS[dir] || DIRS.ne;
        out.push(`<circle cx="${f1(Ps[0])}" cy="${f1(Ps[1])}" r="${o.r || 3}" class="${o.c === 'a' ? 'fg-pa' : 'fg-p'}"/>`);
        if (name) texts.push(tx(Ps[0] + dd[0], Ps[1] + dd[1], name, { cls: o.cls || 'n' }));
      } else if (t === 'lab') {
        const [, p, txt, o] = it; const Ps = P(p);
        texts.push(tx(Ps[0] + (o.dx || 0), Ps[1] + (o.dy || 0), txt, o));
      } else if (t === 'mid') {
        const [, a, b, txt, off, o] = it; const m = P(V.mid(a, b)), d = V.unit(V.sub(b, a));
        let rot = 0; // o.rot: popisek se natočí podél úsečky (čte se zleva nebo zdola)
        if (o.rot) { rot = Math.atan2(-d[1], d[0]) * 180 / Math.PI; if (rot > 90) rot -= 180; if (rot <= -90 && rot > -90.01) rot = -90; else if (rot < -90) rot += 180; if (rot === 90) rot = -90; }
        texts.push(tx(m[0] - d[1] * off, m[1] - d[0] * off, txt, { ...o, rot }));
      }
    }
    return `<svg viewBox="0 0 ${W} ${H}" class="fg" xmlns="http://www.w3.org/2000/svg" role="img">${out.join('')}${texts.join('')}${extra}</svg>`;
  }
}

// ---------- pomocné výpočty ----------
export function triSSS(a, b, c) { // a = |BC|, b = |AC|, c = |AB|
  const x = (b * b + c * c - a * a) / (2 * c), y = Math.sqrt(Math.max(0, b * b - x * x));
  return [[0, 0], [c, 0], [x, y]];
}
export function triAng(c, al, be) { // strana c a úhly u A, B
  const ga = 180 - al - be, bb = c * Math.sin(be * Math.PI / 180) / Math.sin(ga * Math.PI / 180);
  return [[0, 0], [c, 0], V.rot([bb, 0], al)];
}
const cen = pts => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
// popisek strany vně mnohoúhelníku
function sideLab(F, a, b, c0, txt, o = {}) {
  if (!txt) return;
  const d = V.unit(V.sub(b, a)), left = V.perp(d), m = V.mid(a, b);
  F.mid(a, b, txt, V.dot(left, V.sub(c0, m)) > 0 ? -14 : 14, o);
}
function vName(F, p, c0, name) {
  const u = V.unit(V.sub(p, c0)); F.lab(p, name, { dx: u[0] * 13, dy: -u[1] * 13, cls: 'n' });
}

// ---------- úhly ----------
export function fAngle(deg, lab = 'α') {
  const F = new Fig({ H: 170 }), P2 = V.rot([5, 0], deg);
  F.seg([0, 0], [5, 0]).seg([0, 0], P2).pt([0, 0], 'V', deg > 150 ? 's' : 'sw');
  if (deg === 90) F.right([0, 0], [5, 0], P2); else F.ang([0, 0], [5, 0], P2, lab, { ccw: 1 });
  if (deg < 60) F.ext(0, 2.5);
  return F.svg();
}
export function fAnglePair(typ, a, la, lb, lc) {
  const F = new Fig({ H: 170 }), D = V.rot([5, 0], a), O = [0, 0];
  if (typ === 'ved') {
    F.seg([-5, 0], [5, 0]).seg(O, D).pt(O, '', 's');
    F.ang(O, [5, 0], D, la).ang(O, D, [-5, 0], lb);
  } else {
    const D2 = V.mul(D, -1);
    F.seg([-5, 0], [5, 0]).seg(D2, D).pt(O, '', 's');
    F.ang(O, [5, 0], D, la).ang(O, [-5, 0], D2, lb);
    if (lc) F.ang(O, D, [-5, 0], lc, { c: 'h', cls: 'h' });
  }
  return F.svg();
}
export function fParallel(a, typ, la, lb) {
  const F = new Fig({ H: 190 }), d = V.rot([1, 0], a), P0 = [0, 0], P1 = V.mul(d, 3 / d[1]);
  F.seg([-4, 0], [6, 0]).seg([-4, 3], [6, 3]).seg(V.mul(d, -1.2 / d[1]), V.mul(d, 4.2 / d[1]));
  F.lab([6, 0], 'b', { dx: 9, cls: 'n' }).lab([6, 3], 'a', { dx: 9, cls: 'n' });
  if (typ === 'souhl') F.ang(P1, V.add(P1, [1, 0]), V.add(P1, d), la);
  else F.ang(P1, V.add(P1, [-1, 0]), V.sub(P1, d), la);
  F.ang(P0, V.add(P0, [1, 0]), V.add(P0, d), lb);
  return F.svg();
}
export function fClock(h, m) {
  const F = new Fig({ H: 190 }); F.circle([0, 0], 4);
  for (let i = 0; i < 12; i++) { const u = V.rot([0, 1], -30 * i); F.seg(V.mul(u, 3.6), V.mul(u, 4), { c: 'h' }); }
  [12, 3, 6, 9].forEach(n => F.lab(V.mul(V.rot([0, 1], -30 * n), 3), String(n), { cls: 'h' }));
  F.seg([0, 0], V.mul(V.rot([0, 1], -6 * m), 3.3), { c: 'a' });
  F.seg([0, 0], V.mul(V.rot([0, 1], -(30 * h + 0.5 * m)), 2.1), { c: 'a' });
  return F.pt([0, 0], '').svg();
}

// ---------- trojúhelníky ----------
// o.names, o.sides [AB, BC, CA], o.angs [u A, u B, u C], o.right (index), o.h {from, lab}, o.med {from, lab}, o.ext {at, lab}
export function fTri(pts, o = {}) {
  const F = new Fig({ H: o.H || 200 }), c0 = cen(pts), names = o.names === undefined ? ['A', 'B', 'C'] : o.names;
  F.poly(pts, { fill: 1 });
  (o.sides || []).forEach((t, i) => sideLab(F, pts[i], pts[(i + 1) % 3], c0, t));
  (o.angs || []).forEach((t, i) => { if (t) F.ang(pts[i], pts[(i + 1) % 3], pts[(i + 2) % 3], t); });
  if (o.right !== undefined) F.right(pts[o.right], pts[(o.right + 1) % 3], pts[(o.right + 2) % 3]);
  if (o.h) {
    const v = pts[o.h.from], a = pts[(o.h.from + 1) % 3], bb = pts[(o.h.from + 2) % 3];
    const d = V.unit(V.sub(bb, a)), t = V.dot(V.sub(v, a), d), ft = V.add(a, V.mul(d, t));
    if (t < 0) F.seg(ft, a, { c: 'h', dash: 1 }); else if (t > V.dist(a, bb)) F.seg(bb, ft, { c: 'h', dash: 1 });
    F.seg(v, ft, { c: 'a', dash: 1 }).right(ft, v, t > V.dist(a, bb) / 2 ? a : bb);
    if (o.h.lab) F.mid(v, ft, o.h.lab, V.dot(V.perp(V.unit(V.sub(ft, v))), V.sub(c0, V.mid(v, ft))) > 0 ? 15 : -15, { cls: 'a' });
    if (o.h.foot) F.pt(ft, o.h.foot, 's');
  }
  if (o.med) {
    const v = pts[o.med.from], m = V.mid(pts[(o.med.from + 1) % 3], pts[(o.med.from + 2) % 3]);
    F.seg(v, m, { c: 'a', dash: 1 }).pt(m, o.med.mid || '', 's');
    if (o.med.lab) F.mid(v, m, o.med.lab, 14, { cls: 'a' });
  }
  if (o.ext) {
    const i = o.ext.at, v = pts[i], prev = pts[(i + 2) % 3], nxt = pts[(i + 1) % 3];
    const e = V.add(v, V.mul(V.unit(V.sub(v, nxt)), V.dist(v, nxt) * 0.45));
    F.seg(v, e, { c: 'h', dash: 1 }).ang(v, e, prev, o.ext.lab);
  }
  if (names) pts.forEach((p, i) => vName(F, p, c0, names[i]));
  return F.svg();
}
// pravoúhlý trojúhelník s pravým úhlem u C: a = |BC| vodorovně, b = |AC| svisle
export function fRightTri(a, b, o = {}) {
  const C = [0, 0], B = [a, 0], A = [0, b], F = new Fig({ H: 200, pad: 44 });
  F.poly([C, B, A], { fill: 1 }).right(C, B, A);
  F.mid(C, B, o.la || '', -14).mid(A, C, o.lb || '', -16).mid(B, A, o.lc || '', -15);
  if (o.alpha) F.ang(A, C, B, o.alpha);
  if (o.beta) F.ang(B, A, C, o.beta);
  if (o.names !== false) F.lab(C, 'C', { dx: -11, dy: 11, cls: 'n' }).lab(B, 'B', { dx: 12, dy: 8, cls: 'n' }).lab(A, 'A', { dx: -8, dy: -12, cls: 'n' });
  return F.svg();
}
export function fSim(p1, l1, k, l2) {
  const F = new Fig({ H: 190 }), w = Math.max(...p1.map(p => p[0])) + 2.6;
  const p2 = p1.map(p => [w + p[0] * k, p[1] * k]), c1 = cen(p1), c2 = cen(p2);
  F.poly(p1, { fill: 1 }).poly(p2, { fill: 1 });
  l1.forEach((t, i) => sideLab(F, p1[i], p1[(i + 1) % 3], c1, t));
  l2.forEach((t, i) => sideLab(F, p2[i], p2[(i + 1) % 3], c2, t));
  return F.svg();
}

// ---------- čtyřúhelníky ----------
export function fRect(a, b, o = {}) {
  const F = new Fig({ H: 190, pad: 44 }), P = [[0, 0], [a, 0], [a, b], [0, b]];
  F.poly(P, { fill: 1 }).mid(P[0], P[1], o.la || '', -14).mid(P[1], P[2], o.lb || '', -20);
  if (o.diag !== undefined) { F.seg(P[0], P[2], { c: 'a', dash: 1 }); if (o.diag) F.mid(P[0], P[2], o.diag, 13, { cls: 'a' }); }
  if (o.marks) P.forEach((p, i) => F.right(p, P[(i + 1) % 4], P[(i + 3) % 4]));
  return F.svg();
}
// tvar L: velký obdélník A×B s vyříznutým rohem c×d vpravo nahoře
export function fL(A, B, c, d, l = {}) {
  const F = new Fig({ H: 200, pad: 40 }), P = [[0, 0], [A, 0], [A, B - d], [A - c, B - d], [A - c, B], [0, B]];
  F.poly(P, { fill: 1 });
  F.mid(P[0], P[1], l.bottom || '', -14).mid(P[1], P[2], l.right || '', -20).mid(P[2], P[3], l.cutw || '', -13)
    .mid(P[3], P[4], l.cuth || '', -20).mid(P[4], P[5], l.top || '', -13).mid(P[5], P[0], l.left || '', -20);
  if (l.split) F.seg(P[3], [A - c, 0], { c: 'h', dash: 1 });
  return F.svg();
}
export function fPar(a, bb, al, o = {}) {
  const A = [0, 0], B = [a, 0], D = V.rot([bb, 0], al), C = V.add(B, D), F = new Fig({ H: 190 });
  F.poly([A, B, C, D], { fill: 1 }).mid(A, B, o.la || '', -14).mid(B, C, o.lb || '', -18);
  if (o.lv !== undefined) { const ft = [D[0], 0]; F.seg(D, ft, { c: 'a', dash: 1 }).right(ft, B, D); if (o.lv) F.mid(D, ft, o.lv, 14, { cls: 'a' }); }
  if (o.lang) F.ang(A, B, D, o.lang);
  if (o.lang2) F.ang(B, C, A, o.lang2);
  if (o.diag) F.seg(A, C, { c: 'a', dash: 1 }).mid(A, C, o.diag, 13, { cls: 'a' });
  if (o.names) [['A', A, -10, 11], ['B', B, 10, 11], ['C', C, 10, -10], ['D', D, -10, -10]].forEach(([n, p, dx, dy]) => F.lab(p, n, { dx, dy, cls: 'n' }));
  return F.svg();
}
export function fRhomb(e, f, o = {}) {
  const F = new Fig({ H: 190 }), P = [[-e / 2, 0], [0, -f / 2], [e / 2, 0], [0, f / 2]];
  F.poly(P, { fill: 1 }).seg(P[0], P[2], { c: 'a', dash: 1 }).seg(P[1], P[3], { c: 'a', dash: 1 }).right([0, 0], P[2], P[3]);
  if (o.le) F.lab([e / 4, 0], o.le, { dy: 11, cls: 'a' });
  if (o.lf) F.lab([0, f / 4], o.lf, { dx: -18, cls: 'a' });
  if (o.la) F.mid(P[2], P[3], o.la, -15);
  return F.svg();
}
export function fTrap(a, c, v, off, o = {}) {
  const A = [0, 0], B = [a, 0], C = [off + c, v], D = [off, v], F = new Fig({ H: 190, pad: 40 });
  F.poly([A, B, C, D], { fill: 1 }).mid(A, B, o.la || '', -14).mid(D, C, o.lc || '', 13);
  if (o.lb) F.mid(B, C, o.lb, -18);
  if (o.ld) F.mid(D, A, o.ld, -18);
  if (o.lv !== undefined) { const ft = [off, 0]; F.seg(D, ft, { c: 'a', dash: 1 }).right(ft, B, D); if (o.lv) F.mid(D, ft, o.lv, 14, { cls: 'a' }); }
  if (o.names) [['A', A, -10, 11], ['B', B, 10, 11], ['C', C, 10, -10], ['D', D, -10, -10]].forEach(([n, p, dx, dy]) => F.lab(p, n, { dx, dy, cls: 'n' }));
  return F.svg();
}

// ---------- kruh ----------
export function fCircle(r, o = {}) {
  const F = new Fig({ H: 190 }), S = [0, 0];
  if (o.sector) F.sector(S, r, 0, o.sector, { fill: 'a', c: 'a' });
  F.circle(S, r, { fill: o.sector ? 0 : 1 }).pt(S, 'S', 'sw');
  if (o.lr !== undefined) { F.seg(S, [r, 0], { c: 'a' }); if (o.lr) F.mid(S, [r, 0], o.lr, o.sector ? -13 : 12, { cls: 'a' }); }
  if (o.ld !== undefined) { F.seg([-r, 0], [r, 0], { c: 'a' }); if (o.ld) F.lab([r / 2, 0], o.ld, { dy: -12, cls: 'a' }); }
  if (o.sector && o.lsec) F.ang(S, [r, 0], V.rot([r, 0], o.sector), o.lsec, { ccw: 1 });
  if (o.chord) { // tětiva ve vzdálenosti v od středu
    const hw = Math.sqrt(r * r - o.chord.v * o.chord.v), A = [-hw, o.chord.v], B = [hw, o.chord.v], M = [0, o.chord.v];
    F.seg(A, B, { c: 'a' });
    if (!o.chord.jen) F.seg(S, M, { c: 'h', dash: 1 }).seg(S, B, { c: 'h', dash: 1 }).right(M, B, S);
    if (o.chord.lt) F.mid(A, M, o.chord.lt, 12, { cls: 'a' });
    if (o.chord.lv) F.mid(S, M, o.chord.lv, 14, { cls: 'h' });
    if (o.chord.lr) F.mid(S, B, o.chord.lr, -14, { cls: 'h' });
  }
  return F.svg();
}
// tečna z bodu M ke kružnici k(S; r), |SM| = d
export function fTangent(r, d, o = {}) {
  const F = new Fig({ H: 190 }), S = [0, 0], M = [d, 0], x = r * r / d, T = [x, Math.sqrt(r * r - x * x)];
  F.circle(S, r, { fill: 1 }).pt(S, 'S', 'sw').pt(M, 'M', 'se').pt(T, 'T', 'n');
  F.seg(S, T, { c: 'a' }).seg(M, V.add(T, V.mul(V.sub(T, M), 0.3))).seg(S, M, { c: 'h', dash: 1 }).right(T, S, M);
  if (o.lr) F.mid(S, T, o.lr, 13, { cls: 'a' });
  if (o.ld) F.mid(S, M, o.ld, -13, { cls: 'h' });
  if (o.lt) F.mid(T, M, o.lt, 13);
  return F.svg();
}

// ---------- tělesa (volné rovnoběžné promítání) ----------
const K = 0.354;
export function fCuboid(a, bb, c, o = {}) {
  const k = [bb * K, bb * K], F = new Fig({ H: 200, pad: 44 });
  const f = [[0, 0], [a, 0], [a, c], [0, c]], g = f.map(p => V.add(p, k));
  F.seg(f[0], g[0], { c: 'h', dash: 1 }).seg(g[0], g[1], { c: 'h', dash: 1 }).seg(g[0], g[3], { c: 'h', dash: 1 });
  F.poly(f, { fill: 1 }).poly([f[3], f[2], g[2], g[3]], { fill: 1 }).poly([f[1], g[1], g[2], f[2]], { fill: 1 });
  F.mid(f[0], f[1], o.la || '', -14).mid(f[1], g[1], o.lb || '', -17).mid(g[1], g[2], o.lc || '', -20);
  if (o.diag) { F.seg(f[0], g[2], { c: 'a', dash: 1 }); F.mid(f[0], g[2], o.diag, 13, { cls: 'a' }); }
  return F.svg();
}
// trojboký hranol stojící na podstavě: podstava je pravoúhlý trojúhelník (odvěsny a, b), výška hranolu h
export function fPrism(a, bb, h, o = {}) {
  const F = new Fig({ H: 210, pad: 44 }), P0 = [0, 0], P1 = [a, 0], P2 = [bb * K, bb * K], up = p => [p[0], p[1] + h], T0 = up(P0), T1 = up(P1), T2 = up(P2);
  F.seg(P0, P2, { c: 'h', dash: 1 }).seg(P1, P2, { c: 'h', dash: 1 }).seg(P2, T2, { c: 'h', dash: 1 });
  F.poly([P0, P1, T1, T0], { fill: 1 }).poly([T0, T1, T2], { fill: 1 }).right(T0, T1, T2);
  F.mid(P0, P1, o.la || '', -14).mid(P1, T1, o.lh || '', -22);
  if (o.lb) F.mid(T0, T2, o.lb, 15);
  if (o.lc) F.mid(T1, T2, o.lc, -15);
  return F.svg();
}
export function fCyl(r, h, o = {}) {
  const F = new Fig({ H: 200 }), ry = r * 0.3;
  F.poly([[-r, 0], [r, 0], [r, h], [-r, h]], { fill: 1, c: 'n' });
  F.ellSplit([0, 0], r, ry).ell([0, h], r, ry, { fill: 1 }).seg([-r, 0], [-r, h]).seg([r, 0], [r, h]);
  if (o.lr !== undefined) { F.seg([0, h], [r, h], { c: 'a' }).pt([0, h], ''); if (o.lr) F.lab([r / 2, h], o.lr, { dy: -11, cls: 'a' }); }
  if (o.ld) { F.seg([-r, h], [r, h], { c: 'a' }); F.lab([0, h], o.ld, { dy: -11, cls: 'a' }); }
  if (o.lh) F.mid([r, 0], [r, h], o.lh, -22);
  return F.svg();
}
export function fCone(r, h, o = {}) {
  const F = new Fig({ H: 200 }), ry = r * 0.3, T = [0, h];
  F.poly([[-r, 0], [r, 0], T], { fill: 1, c: 'n' }).ellSplit([0, 0], r, ry).seg([-r, 0], T).seg([r, 0], T);
  F.seg([0, 0], T, { c: 'h', dash: 1 }).seg([0, 0], [r, 0], { c: 'a' }).pt([0, 0], '').right([0, 0], [r, 0], T);
  if (o.lr) F.lab([r / 2, 0], o.lr, { dy: 12, cls: 'a' });
  if (o.lh) F.mid([0, 0], T, o.lh, 14, { cls: 'h' });
  if (o.ls) F.mid([r, 0], T, o.ls, -16);
  return F.svg();
}
export function fPyr(a, h, o = {}) {
  const k = a * K, F = new Fig({ H: 200 }), P = [[0, 0], [a, 0], [a + k, k], [k, k]], S = [(a + k) / 2, k / 2], T = [S[0], S[1] + h];
  F.seg(P[0], P[3], { c: 'h', dash: 1 }).seg(P[3], P[2], { c: 'h', dash: 1 }).seg(P[3], T, { c: 'h', dash: 1 });
  F.poly([P[0], P[1], T], { fill: 1 }).poly([P[1], P[2], T], { fill: 1 });
  F.seg(S, T, { c: 'a', dash: 1 }).pt(S, '');
  if (o.la) F.mid(P[0], P[1], o.la, -14);
  if (o.lh) F.mid(S, T, o.lh, 14, { cls: 'a' });
  if (o.lw) { const M = V.mid(P[0], P[1]); F.seg(M, T, { c: 'h', dash: 1 }).mid(M, T, o.lw, 15, { cls: 'h' }); }
  return F.svg();
}
export function fSphere(r, o = {}) {
  const F = new Fig({ H: 190 });
  F.circle([0, 0], r, { fill: 1 }).ellSplit([0, 0], r, r * 0.3, { c: 'h' }).pt([0, 0], 'S', 'sw');
  if (o.lr !== undefined) { F.seg([0, 0], [r, 0], { c: 'a' }); if (o.lr) F.lab([r / 2, 0], o.lr, { dy: -11, cls: 'a' }); }
  return F.svg();
}

// ---------- útvary pro souměrnosti ----------
const NGON = (n, r = 3, rot = 90) => Array.from({ length: n }, (_, i) => V.rot([r, 0], rot + 360 * i / n));
const TVARY = {
  ctverec: { p: [[-3, -3], [3, -3], [3, 3], [-3, 3]], osy: [0, 45, 90, 135] },
  obdelnik: { p: [[-4, -2.4], [4, -2.4], [4, 2.4], [-4, 2.4]], osy: [0, 90] },
  rovnostranny: { p: NGON(3, 3.6), osy: [90, 30, 150] },
  rovnoramenny: { p: [[-2.4, -3], [2.4, -3], [0, 3.4]], osy: [90] },
  obecny: { p: [[-4, -2.6], [3.4, -2.6], [1.2, 2.9]], osy: [] },
  kosoctverec: { p: [[-4, 0], [0, -2.4], [4, 0], [0, 2.4]], osy: [0, 90] },
  rovnobeznik: { p: [[-4.2, -2.3], [2.2, -2.3], [4.2, 2.3], [-2.2, 2.3]], osy: [] },
  lichobeznik: { p: [[-4, -2.4], [4, -2.4], [2, 2.4], [-2, 2.4]], osy: [90] },
  petiuhelnik: { p: NGON(5, 3.3), osy: [90, 18, 162, 54, 126] },
  sestiuhelnik: { p: NGON(6, 3.3), osy: [0, 30, 60, 90, 120, 150] },
  kruh: { kruh: 3.2, osy: [0, 45, 90, 135] },
};
export function fShape(name, o = {}) {
  const T = TVARY[name], F = new Fig({ H: 180 }), c0 = T.o || [0, 0];
  if (T.kruh) F.circle([0, 0], T.kruh, { fill: 1 }).pt([0, 0], 'S', 'sw'); else F.poly(T.p, { fill: 1 });
  if (o.osy) T.osy.forEach(a => { const d = V.rot([4.6, 0], a); F.seg(V.sub(c0, d), V.add(c0, d), { c: 'a', dash: 1 }); });
  if (o.stred) F.pt([0, 0], 'S', 'ne', { c: 'a' });
  return F.svg();
}

// ---------- čtvercová síť pro souměrnosti ----------
// t = { cols, rows, osa: {typ:'v'|'h'|'d1'|'d2', k} | stred: [x,y], body: [[x,y]…], jmena, uzavrit }
// znacky = body, které žák označil; reseni = správné obrazy (vykreslí se, když je úloha vyřešená)
export function gridSvg(t, znacky = [], reseni = null) {
  const c = 30, pad = 22, W = t.cols * c + 2 * pad, H = t.rows * c + 2 * pad;
  const X = x => pad + x * c, Y = y => H - pad - y * c;
  let s = '', g = '';
  for (let x = 0; x <= t.cols; x++) g += `M${X(x)} ${Y(0)}V${Y(t.rows)}`;
  for (let y = 0; y <= t.rows; y++) g += `M${X(0)} ${Y(y)}H${X(t.cols)}`;
  s += `<path d="${g}" class="fg-g"/>`;
  if (t.osa) {
    const { typ, k } = t.osa; let a, b;
    if (typ === 'v') { a = [k, -0.4]; b = [k, t.rows + 0.4]; }
    else if (typ === 'h') { a = [-0.4, k]; b = [t.cols + 0.4, k]; }
    else { // d1: y = x + k, d2: y = -x + k – oříznout do sítě
      const pts = [];
      for (let x = 0; x <= t.cols; x++) { const y = typ === 'd1' ? x + k : -x + k; if (y >= 0 && y <= t.rows) pts.push([x, y]); }
      a = pts[0]; b = pts[pts.length - 1];
    }
    s += `<line x1="${X(a[0])}" y1="${Y(a[1])}" x2="${X(b[0])}" y2="${Y(b[1])}" class="fg-a fg-osa"/>`;
    s += `<text x="${X(b[0]) + (typ === 'h' ? -4 : 10)}" y="${Y(b[1]) + (typ === 'h' ? -9 : 12)}" class="fg-t fg-ta">o</text>`;
  }
  const poly = (pts, cls) => pts.length > 1
    ? `<${t.uzavrit === false || pts.length < 3 ? 'polyline' : 'polygon'} points="${pts.map(p => X(p[0]) + ',' + Y(p[1])).join(' ')}" class="${cls}"/>` : '';
  s += poly(t.body, 'fg-s fg-f');
  if (reseni) s += poly(reseni, 'fg-a fg-fa');
  for (let x = 0; x <= t.cols; x++) for (let y = 0; y <= t.rows; y++) s += `<circle cx="${X(x)}" cy="${Y(y)}" r="14" class="fg-uzel" data-x="${x}" data-y="${y}"/>`;
  if (t.stred) s += `<circle cx="${X(t.stred[0])}" cy="${Y(t.stred[1])}" r="4.5" class="fg-pa"/><text x="${X(t.stred[0]) + 11}" y="${Y(t.stred[1]) - 9}" class="fg-t fg-ta">S</text>`;
  t.body.forEach((p, i) => { s += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="4" class="fg-p"/><text x="${X(p[0]) - 10}" y="${Y(p[1]) - 9}" class="fg-t fg-tn">${t.jmena[i]}</text>`; });
  znacky.forEach(p => { s += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="6" class="fg-znacka"/>`; });
  if (reseni) reseni.forEach((p, i) => { s += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="4.5" class="fg-pa"/><text x="${X(p[0]) + 10}" y="${Y(p[1]) - 9}" class="fg-t fg-ta">${t.jmena[i]}′</text>`; });
  return `<svg viewBox="0 0 ${W} ${H}" class="fg fg-sit" xmlns="http://www.w3.org/2000/svg" role="img">${s}</svg>`;
}
