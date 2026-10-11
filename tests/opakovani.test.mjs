// Opakování s rozestupy: plánování podle chyb, posun rozestupů, zvládnutí, složení série.
import test from 'node:test';
import assert from 'node:assert/strict';
import { stav } from '../js/stav.js';
import { zapisOpak, naRade, prehledOpak, ulohyOpak, klic, ROZESTUPY, V_SERII } from '../js/opakovani.js';
import { ROCNIKY } from '../js/obsah.js';

const D0 = '2026-10-12', den = n => { const t = new Date(2026, 9, 12 + n); return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`; };
const znovu = () => { stav.opak = {}; stav.stat.opakZvl = 0; };

test('chyba naplánuje typ úlohy na zítřek, správně mimo plán nic nemění', () => {
  znovu();
  zapisOpak({ tema: '601', lvl: 1, gi: 2, vysl: 0 }, D0);
  assert.deepEqual(stav.opak, {}, 'správná odpověď bez plánu se neplánuje');
  zapisOpak({ tema: '601', lvl: 1, gi: 2, vysl: 2 }, D0);
  assert.equal(stav.opak[klic('601', 1, 2)].kdy, den(1));
  assert.deepEqual(naRade(D0), [], 'dnes ještě není na řadě');
  zapisOpak({ tema: '601', lvl: 1, gi: 2, vysl: 0 }, D0);
  assert.equal(stav.opak[klic('601', 1, 2)].krok, 0, 'správně před termínem rozestup neposune');
});

test('rozestupy 1 → 3 → 7 → 14 dní, pak zvládnuto; nová chyba vrací na začátek', () => {
  znovu();
  const k = klic('802', 2, 1); let d = 0;
  zapisOpak({ tema: '802', lvl: 2, gi: 1, vysl: 1 }, den(d));
  for (let i = 1; i < ROZESTUPY.length; i++) {
    d += ROZESTUPY[i - 1];
    assert.deepEqual(naRade(den(d)), [k]);
    zapisOpak({ tema: '802', lvl: 2, gi: 1, vysl: 0 }, den(d));
    assert.equal(stav.opak[k].kdy, den(d + ROZESTUPY[i]), `krok ${i}`);
  }
  zapisOpak({ tema: '802', lvl: 2, gi: 1, vysl: 2 }, den(d));
  assert.equal(stav.opak[k].krok, 0); assert.equal(stav.opak[k].chyb, 2); assert.equal(stav.opak[k].kdy, den(d + 1));
  for (const r of ROZESTUPY) { d += r; zapisOpak({ tema: '802', lvl: 2, gi: 1, vysl: 0 }, den(d)); }
  assert.equal(stav.opak[k], undefined, 'po posledním rozestupu je typ úlohy zvládnutý');
  assert.equal(prehledOpak(den(d)).zvladnuto, 1);
});

test('série opakování: nejvýš V_SERII úloh, nejvýš dvě konstrukce, neexistující typy se vyřadí', () => {
  znovu();
  for (const R of ROCNIKY) for (const t of R.temata) t.u.forEach((g, li) => g.forEach((_, gi) => { stav.opak[klic(t.id, li + 1, gi)] = { krok: 0, kdy: D0, chyb: 1 }; }));
  stav.opak[klic('601', 1, 99)] = { krok: 0, kdy: '2026-01-01', chyb: 5 };
  const s = ulohyOpak(D0);
  assert.equal(s.length, V_SERII);
  assert.ok(s.filter(x => x.u.kind === 'kon').length <= 2);
  assert.ok(!(klic('601', 1, 99) in stav.opak), 'typ úlohy, který v obsahu není, se z plánu vyřadí');
  for (const x of s) assert.ok(x.tema && x.lvl && x.gi != null && x.u.kind);
});
