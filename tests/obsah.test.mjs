// Projde každý generátor mnohokrát a hlídá, že úlohy dávají smysl.
import test from 'node:test';
import assert from 'node:assert/strict';
import { ROCNIKY } from '../js/obsah.js';
import { check, toChoice, konOver, odpoved } from '../js/ulohy.js';
import { unitChoices, rd } from '../js/util.js';
import { kOtazka, kNavnady, kStav, kExec, kCil, NACRTKY, nacrtekSvg, kSvg, kRozsah, kProved, kZapis, kSlovy } from '../js/kon.js';
import { gridSvg } from '../js/fig.js';

const N = Number(process.env.N || 150);
const holy = s => String(s).replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '');
function texty(t) { return [t.text, t.q, ...(t.hints || []), ...(t.steps || []), ...(t.opts || []), t.nsolProc].filter(x => x != null).map(holy); }

for (const r of ROCNIKY) for (const tema of r.temata) tema.u.forEach((gens, li) => {
  test(`${tema.id} ${tema.nazev} – úroveň ${li + 1}`, () => {
    assert.ok(gens.length >= 4, 'aspoň 4 typy úloh');
    gens.forEach((g, gi) => {
      for (let i = 0; i < N; i++) {
        const t = g(), kde = `${tema.id}/${li + 1}/${g.name || gi}`;
        assert.ok(['num', 'choice', 'dm', 'grid', 'kon'].includes(t.kind), kde);
        for (const s of texty(t)) {
          assert.ok(typeof s === 'string' && s.length, kde + ' prázdný text');
          assert.ok(!/undefined|NaN|null|\[object|Infinity/.test(s), `${kde}: ${s}`);
          assert.ok(!/\d\.\d/.test(s), `${kde} desetinná tečka: ${s}`);
          assert.ok(!/\d,\d{5,}/.test(s), `${kde} dlouhé desetinné číslo: ${s}`);
        }
        if (t.fig) assert.ok(t.fig.startsWith('<svg') && !/NaN|undefined/.test(t.fig), kde + ' obrázek');
        if (t.figSol) assert.ok(t.figSol.startsWith('<svg') && !/NaN/.test(t.figSol), kde);
        if (li === 2 && t.kind !== 'grid' && t.kind !== 'kon') assert.ok(!t.fig, kde + ' na úrovni 3 nemá být obrázek');
        if (t.kind !== 'kon') assert.ok(t.hints.length >= (li === 0 ? 3 : li === 1 ? 2 : 1), `${kde} málo nápověd (${t.hints.length})`);
        if (li === 2 && t.kind !== 'kon') assert.ok(t.hints.length <= 2, kde + ' na úrovni 3 nejvýš 2 nápovědy');
        if (['num', 'choice', 'dm'].includes(t.kind)) assert.ok(t.steps.length >= 1, kde + ' chybí postup');
        if (t.kind === 'num') {
          assert.ok(Number.isFinite(t.ans) && t.ans >= 0, `${kde} ans=${t.ans}`);
          if (t.dec == null) assert.ok(Math.abs(t.ans - rd(t.ans, 3)) < 1e-9, `${kde} nepřesná hodnota ${t.ans}`);
          else assert.ok(Math.abs(t.ans - rd(t.ans, t.dec)) < 1e-9, `${kde} ans není zaokrouhlené`);
          const h = t.dec == null ? 1e-6 : 0.5 * 10 ** -t.dec;
          for (const [v, msg] of t.traps) { assert.ok(msg && Number.isFinite(v), kde); assert.ok([t.ans, ...t.alt].every(a => Math.abs(a - v) > h), `${kde} past ${v} = správná odpověď ${t.ans}`); }
          for (const strict of [false, true]) assert.ok(check(t, { val: t.ans, unit: t.unit }, strict).ok, kde + ' správná odpověď neprošla');
          for (const a of t.alt) assert.ok(check(t, { val: a, unit: t.unit }, true).ok, kde);
          assert.ok(!check(t, { val: Math.max(t.ans, ...t.alt) + (t.dec == null ? 1 : 10 ** -t.dec * 3), unit: t.unit }, false).ok, kde + ' špatná odpověď prošla');
          if (t.units) { const uc = unitChoices(t.unit); assert.ok(uc && uc.includes(t.unit) && new Set(uc).size === 4, `${kde} jednotky ${t.unit}`); assert.ok(!check(t, { val: t.ans, unit: uc.find(x => x !== t.unit) }, true).ok); }
          assert.ok(odpoved(t).length);
        } else if (t.kind === 'choice') {
          assert.ok(t.ans >= 0 && t.opts.length >= 2 && new Set(t.opts).size === t.opts.length, `${kde} možnosti ${t.opts}`);
        } else if (t.kind === 'dm') {
          assert.ok(Number.isInteger(t.ans) && t.ans > 0, `${kde} ${t.ans}`);
          assert.ok(check(t, { deg: Math.floor(t.ans / 60), min: t.ans % 60 }).ok);
          for (const [v] of t.traps || []) assert.notEqual(v, t.ans, kde);
        } else if (t.kind === 'grid') {
          assert.equal(t.ans.length, t.body.length);
          for (const p of [...t.ans, ...t.body]) assert.ok(p[0] >= 0 && p[0] <= t.cols && p[1] >= 0 && p[1] <= t.rows, kde);
          assert.ok(check(t, { pts: t.ans }).ok && !check(t, { pts: t.body }).ok, kde);
          assert.ok(gridSvg(t, t.body, t.ans).startsWith('<svg'));
        } else if (t.kind === 'kon') {
          assert.equal(konOver(t), null, kde + ' vzorový postup nevede k cíli');
          const st0 = kProved(t.init); assert.ok(kCil(st0, t.goal) !== null, kde + ' cíl splněn už na začátku');
          assert.ok(kSvg(kProved([...t.init, ...t.plan])).startsWith('<svg'));
          t.plan.forEach((s, k) => {
            assert.ok(kZapis(s).length && kSlovy(s).length, kde);
            const q = kOtazka(t, k);
            if (q) assert.ok(q.bad.length >= 2 && !q.bad.includes(q.ok) && new Set(q.bad).size === q.bad.length, `${kde} otázka ${JSON.stringify(q)}`);
          });
          assert.ok(t.sestroj && t.sestroj.length > 3, kde + ' chybí „Sestroj“');
          const dano = Array.isArray(t.dano) ? t.dano : Object.values(t.dano);
          assert.ok(dano.length >= 1 && dano.every(d => typeof d === 'string' && d.length && !/\d\.\d|undefined|NaN/.test(d)), `${kde} „Dáno“: ${JSON.stringify(t.dano)}`);
          if (t.tpl) { assert.ok(!Array.isArray(t.dano), kde + ' úloha s náčrtkem má mít dano jako objekt'); const ns = nacrtekSvg(t.tpl, t.giv, t.dano, kProved([...t.init, ...t.plan]).pts); for (const v of dano) assert.ok(ns.includes('= ' + v), `${kde} v náčrtku chybí hodnota ${v}`); assert.ok(!/NaN/.test(ns), kde + ' náčrtek');
            assert.throws(() => nacrtekSvg(t.tpl, t.giv, t.dano), 'náčrtek s hodnotami bez skutečných bodů se nesmí vykreslit'); }
          if (t.tpl) { assert.ok(NACRTKY[t.tpl]); for (const k of t.giv) assert.ok(NACRTKY[t.tpl].prvky[k], `${kde} prvek ${k}`); assert.ok(nacrtekSvg(t.tpl, t.giv).includes('nk-on')); }
          if (t.mode === 3) { assert.ok(t.ops && t.ops.length, kde + ' chybí nabídka kroků'); for (const s of t.plan) assert.ok(t.ops.includes(s.op), `${kde} krok ${s.op} není v nabídce`); }
          // návnady (úroveň 2) musí vést ke špatnému výsledku
          for (const nv of kNavnady(t)) {
            const plan = t.plan.map(s => (s.op === nv.op && s.name === nv.name) ? nv : s), st = kStav(); let chyba = null;
            for (const s of [...t.init, ...plan]) { chyba = kExec(st, s); if (chyba) break; }
            assert.ok(chyba || kCil(st, t.goal) !== null, `${kde} návnada ${JSON.stringify(nv)} vede ke správnému výsledku`);
          }
        }
      }
    });
  });
  if (li === 0 && tema.kon) test(`${tema.id} náčrtek odpovídá hodnotám`, () => {
    const delka = (svg, hodnota) => { // délka zvýrazněné úsečky, u které je popisek s danou hodnotou, se pozná podle pořadí v SVG
      const cary = [...svg.matchAll(/<g class="nk-el nk-on" data-el="(\w+)"><line x1="([\d.-]+)" y1="([\d.-]+)" x2="([\d.-]+)" y2="([\d.-]+)"/g)];
      return Object.fromEntries(cary.map(m => [m[1], Math.hypot(m[4] - m[2], m[5] - m[3])]));
    };
    let porovnani = 0;
    for (const gens of tema.u) for (const g of gens) for (let i = 0; i < 40; i++) {
      const t = g(); if (t.kind !== 'kon' || !t.tpl) continue;
      const d = delka(nacrtekSvg(t.tpl, t.giv, t.dano, kProved([...t.init, ...t.plan]).pts)), cm = k => parseFloat(String(t.dano[k]).replace(',', '.'));
      const klice = Object.keys(d).filter(k => /cm$/.test(t.dano[k] || ''));
      for (const x of klice) for (const y of klice) if (cm(x) > cm(y)) { porovnani++; assert.ok(d[x] > d[y], `${tema.id}: ${x} = ${t.dano[x]} je v náčrtku kratší než ${y} = ${t.dano[y]}`); }
    }
    assert.ok(porovnani > 20, 'málo porovnání');
  });
  if (li === 0) test(`${tema.id} rychlé úlohy`, () => {
    assert.ok(tema.rychle && tema.rychle.length >= 2);
    let ok = 0, vse = 0;
    for (const g of tema.rychle) for (let i = 0; i < 60; i++) { vse++; const c = toChoice(g()); if (c && c.opts.length >= 2 && c.ans >= 0) ok++; }
    assert.ok(ok / vse > 0.95, `jen ${ok}/${vse}`);
  });
  if (li === 0) test(`${tema.id} výklad`, () => {
    assert.ok(tema.vyklad.length >= 3);
    for (const k of tema.vyklad) { assert.ok(k.h && k.t.length > 60); if (k.fig) assert.ok(k.fig().startsWith('<svg')); assert.ok(!/\d\.\d/.test(holy(k.t)), k.t); }
  });
});

// Co žák zapíše, musí být na rýsování vidět – i přímka, na které ještě neleží žádný bod.
test('rýsování ukáže každou narýsovanou čáru', () => {
  const videt = (st, kde) => {
    const bb = kRozsah(st), uvnitr = p => p[0] > bb[0] && p[0] < bb[2] && p[1] > bb[1] && p[1] < bb[3];
    for (const [n, L] of Object.entries(st.lines)) {
      const c = [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2], t = (c[0] - L.p[0]) * L.d[0] + (c[1] - L.p[1]) * L.d[1], tt = L.ray ? Math.max(t, 0.5) : t;
      assert.ok(uvnitr([L.p[0] + L.d[0] * tt, L.p[1] + L.d[1] * tt]), `${kde}: čára ${n} není na obrázku vidět`);
    }
  };
  for (const len of [3, 6, 9, 12]) for (const dist of [2, 4, 7, 9]) {
    const kr = [{ op: 'seg', a: 'A', b: 'B', len }, { op: 'par', name: 'p', to: 'AB', dist }], st = kProved(kr);
    videt(st, `AB ${len}, rovnoběžka ${dist}`);
    const pocet = s => (s.match(/<line/g) || []).length;
    assert.ok(pocet(kSvg(st)) > pocet(kSvg(kProved(kr.slice(0, 1)))), `rovnoběžka ve vzdálenosti ${dist} od AB ${len} se nenakreslila`);
    videt(kProved([...kr, { op: 'par', name: 'q', to: 'p', dist }, { op: 'ray', v: 'A', to: 'B', ang: 70, name: 'AX' }]), 'dvě rovnoběžky a úhel');
  }
  for (const r of ROCNIKY) for (const t of r.temata) for (const g of t.u.flat()) for (let i = 0; i < 25; i++) {
    const u = g(); if (u.kind !== 'kon') break;
    for (let k = 1; k <= u.plan.length; k++) videt(kProved([...u.init, ...u.plan.slice(0, k)]), `${t.id} po kroku ${k}`);
  }
});
