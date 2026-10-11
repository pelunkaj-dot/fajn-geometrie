// Drobní pomocníci pro psaní úloh.
import { cz, ri } from './util.js';
import { triSSS } from './fig.js';

export const cm = x => `${cz(x)} cm`;
export const cm2 = x => `${cz(x)} cm²`;
export const cm3 = x => `${cz(x)} cm³`;
export const m_ = x => `${cz(x)} m`;
export const st = x => `${cz(x)}°`;
export const B = x => `<b>${x}</b>`;
export const SUB = (z, i) => `${z}<sub>${i}</sub>`;
// Vysvětlení útvarů na obrázku (úrovně Základy a Procvičování; Jedničkář pojmy zná)
export const TVAR_V = { kosoctverec: ' (rovnoběžník, který má všechny strany stejně dlouhé)', rovnobeznik: ' (rovnoběžník se šikmými úhly a různě dlouhými stranami)', lichobeznik: ' (ramena jsou stejně dlouhá)' };
export const KRAT = { 2: 'dvakrát', 3: 'třikrát', 4: 'čtyřikrát', 5: 'pětkrát', 6: 'šestkrát', 8: 'osmkrát', 10: 'desetkrát' };
// úhel ve stupních a minutách jako text
export const sm = (s, m) => m ? `${s}° ${m}′` : `${s}°`;
export const smT = t => sm(Math.floor(t / 60), t % 60);

// náhodný „rozumný“ trojúhelník: [a, b, c] s celými stranami, dost vysoký a ne rovnoramenný
export function trojStrany(o = {}) {
  for (;;) {
    const c = ri(o.cmin || 5, o.cmax || 8), a = ri(4, 7), bb = ri(4, 7);
    if (a === bb || a === c || bb === c) continue;
    if (a + bb < c + 2 || Math.abs(a - bb) > c - 2) continue;
    if (o.ostro && !(a * a + bb * bb > c * c && a * a + c * c > bb * bb && bb * bb + c * c > a * a)) continue;
    return [a, bb, c];
  }
}
// zadaný trojúhelník pro úlohy „je dán trojúhelník ABC“
export function danyTroj([a, bb, c]) {
  const [A, Bq, C] = triSSS(a, bb, c);
  return [{ op: 'given', pts: { A, B: Bq, C }, poly: 'ABC' }];
}
