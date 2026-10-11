// Opakování s rozestupy podle chyb. Jednotkou je typ úlohy (generátor): téma, úroveň, pořadí v seznamu úloh.
// Úloha s chybou nebo ukázaným řešením se naplánuje na zítřek. Každé další vyřešení napoprvé v den, kdy je
// na řadě, posune příští opakování dál (1 → 3 → 7 → 14 dní); po posledním kroku je typ úlohy zvládnutý.
// Nová chyba vrací typ úlohy na začátek.
import { najdiTema } from './obsah.js';
import { stav, dnes } from './stav.js';

export const ROZESTUPY = [1, 3, 7, 14];
export const V_SERII = 8;
const MAX_KON = 2; // konstrukce jsou dlouhé, v jedné sérii nanejvýš dvě

export const klic = (tema, lvl, gi) => `${tema}|${lvl}|${gi}`;
const posun = (den, dni) => { const [y, m, d] = den.split('-').map(Number), t = new Date(y, m - 1, d + dni); return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`; };
const data = () => (stav.opak = stav.opak || {});

// Záznam jedné vyřešené úlohy. vysl: 0 napoprvé, 1 s pomocí, 2 neúspěšně (stejně jako v přehledu pro rodiče).
export function zapisOpak({ tema, lvl, gi, vysl }, den = dnes()) {
  if (!tema || gi == null) return;
  const o = data(), k = klic(tema, lvl, gi), z = o[k];
  if (vysl > 0) { o[k] = { krok: 0, kdy: posun(den, ROZESTUPY[0]), chyb: ((z && z.chyb) || 0) + 1 }; return; }
  if (!z || z.kdy > den) return; // správně mimo plán: rozestup se nezkracuje ani neposouvá
  const krok = z.krok + 1;
  if (krok >= ROZESTUPY.length) { delete o[k]; stav.stat.opakZvl = (stav.stat.opakZvl || 0) + 1; return; }
  o[k] = { ...z, krok, kdy: posun(den, ROZESTUPY[krok]) };
}

// Co je dnes na řadě: nejdřív nejstarší termíny, pak nejvíc chyb.
export function naRade(den = dnes()) {
  return Object.entries(data()).filter(([, z]) => z.kdy <= den).sort((a, b) => a[1].kdy.localeCompare(b[1].kdy) || b[1].chyb - a[1].chyb).map(([k]) => k);
}
export function prehledOpak(den = dnes()) {
  const vse = Object.values(data()), dalsi = vse.filter(z => z.kdy > den).map(z => z.kdy).sort()[0] || null;
  return { dnes: naRade(den).length, celkem: vse.length, dalsi, zvladnuto: stav.stat.opakZvl || 0 };
}

// Úlohy do série opakování. Typy úloh, které už v obsahu nejsou, se z plánu tiše vyřadí.
export function ulohyOpak(den = dnes()) {
  const out = []; let kon = 0;
  for (const k of naRade(den)) {
    if (out.length >= V_SERII) break;
    const [tema, l, g] = k.split('|'), t = najdiTema(tema), gen = t && t.u[+l - 1] && t.u[+l - 1][+g];
    if (!gen) { delete data()[k]; continue; }
    const u = gen();
    if (u.kind === 'kon' && ++kon > MAX_KON) continue;
    out.push({ u, lvl: +l, tema, gi: +g });
  }
  return out;
}
