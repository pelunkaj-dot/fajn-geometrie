// Odznaky. Podmínka dostane uložený stav a seznam ročníků.
import { hvezdy } from './stav.js';
import { STAVBY } from './mesto.js';

const vsechHvezd = s => Object.values(s.urovne).reduce((a, u) => a + (u.hv || 0), 0);
const nejObrana = s => Math.max(0, ...Object.values(s.stat.obrana || {}));
export const ODZNAKY = [
  { id: 'prvni', n: 'První krok', p: 'Dokonči první sérii úloh.', z: '1', t: s => s.stat.serii >= 1 },
  { id: 'tri', n: 'Tři hvězdy', p: 'Získej tři hvězdy na kterékoli úrovni.', z: '★', t: s => Object.values(s.urovne).some(u => u.hv === 3) },
  { id: 'jednickar', n: 'Jedničkář', p: 'Získej tři hvězdy na úrovni Jedničkář.', z: '1*', t: s => Object.entries(s.urovne).some(([k, u]) => k.endsWith('-3') && u.hv === 3) },
  { id: 'cisto', n: 'Čistý štít', p: 'Dokonči sérii bez jediné chyby.', z: '◇', t: s => s.stat.cistych >= 1 },
  { id: 'rys', n: 'Rýsovač', p: 'Vyřeš konstrukční úlohu na úrovni Jedničkář bez chyby.', z: '✎', t: s => s.stat.kon3 >= 1 },
  { id: 'konstrukter', n: 'Konstruktér', p: 'Vyřeš bez chyby deset konstrukčních úloh na úrovni Jedničkář.', z: '⊙', t: s => s.stat.kon3 >= 10 },
  { id: 'combo5', n: 'Pět v řadě', p: 'Pět úloh za sebou napoprvé.', z: '5', t: s => s.stat.combo >= 5 },
  { id: 'combo10', n: 'Deset v řadě', p: 'Deset úloh za sebou napoprvé.', z: '10', t: s => s.stat.combo >= 10 },
  { id: 'u100', n: 'Sto úloh', p: 'Vyřeš 100 úloh.', z: 'C', t: s => s.stat.uloh >= 100 },
  { id: 'u500', n: 'Pět set úloh', p: 'Vyřeš 500 úloh.', z: 'D', t: s => s.stat.uloh >= 500 },
  { id: 'u1000', n: 'Tisíc úloh', p: 'Vyřeš 1000 úloh.', z: 'M', t: s => s.stat.uloh >= 1000 },
  { id: 'strazce1', n: 'Přemožitel', p: 'Poraz prvního strážce.', z: '⚔', t: s => Object.keys(s.strazci).length >= 1 },
  { id: 'strazce6', n: 'Postrach strážců', p: 'Poraz šest strážců.', z: '⚔6', t: s => Object.keys(s.strazci).length >= 6 },
  { id: 'rocnik', n: 'Celý ročník', p: 'Získej aspoň jednu hvězdu na všech úrovních jednoho ročníku.', z: '▦', t: (s, R) => R.some(r => r.temata.every(t => [1, 2, 3].every(l => (s.urovne[`${t.id}-${l}`] || {}).hv >= 1))) },
  { id: 'hv30', n: 'Třicet hvězd', p: 'Nasbírej 30 hvězd.', z: '30', t: s => vsechHvezd(s) >= 30 },
  { id: 'hv90', n: 'Devadesát hvězd', p: 'Nasbírej 90 hvězd.', z: '90', t: s => vsechHvezd(s) >= 90 },
  { id: 'den3', n: 'Tři dny', p: 'Splň denní výzvu tři dny po sobě.', z: '3d', t: s => s.stat.den.serie >= 3 },
  { id: 'den7', n: 'Celý týden', p: 'Splň denní výzvu sedm dní po sobě.', z: '7d', t: s => s.stat.den.serie >= 7 },
  { id: 'obrana1', n: 'Obránce', p: 'Ubraň město ve všech třech vlnách.', z: '☄', t: s => (s.stat.ubraneno || 0) >= 1 },
  { id: 'obrana2', n: 'Lovec meteorů', p: 'Získej v Obraně města aspoň 400 bodů.', z: '400', t: s => nejObrana(s) >= 400 },
  { id: 'mesto1', n: 'Základní kámen', p: 'Postav první stavbu.', z: '⌂', t: s => s.mesto.length >= 1 },
  { id: 'mesto8', n: 'Městečko', p: 'Postav osm staveb.', z: '⌂8', t: s => s.mesto.length >= 8 },
  { id: 'mestoVse', n: 'Velkoměsto', p: 'Postav všechny stavby.', z: '♛', t: s => s.mesto.length >= STAVBY.length },
  { id: 'architekt', n: 'Architekt', p: 'Dosáhni hodnosti Architekt.', z: 'A', t: s => s.xp >= 6000 },
];
// Udělí nově splněné odznaky a vrátí je.
export function noveOdznaky(stav, rocniky) {
  const nove = [];
  for (const o of ODZNAKY) if (!stav.odznaky[o.id] && o.t(stav, rocniky)) { stav.odznaky[o.id] = new Date().toISOString().slice(0, 10); nove.push(o); }
  return nove;
}
export { hvezdy };
