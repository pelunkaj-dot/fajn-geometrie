// 9. ročník: podobnost, goniometrické funkce, jehlan, kužel a koule, souhrnné opakování k přijímačkám.
import { ri, pick, chance, shuffle, cz, rd } from './util.js';
import { N, C, pia, PI_T } from './ulohy.js';
import { fRightTri, fSim, fPyr, fCone, fSphere, triSSS } from './fig.js';
import { cm, cm2, cm3, st, B, KRAT } from './pom.js';
import { MIX6 } from './r6.js';
import { MIX7 } from './r7.js';
import { MIX8 } from './r8.js';

const ZAOKR = 'Výsledek zaokrouhli na jedno desetinné místo.';
const ZAOKR3 = 'Zaokrouhli přesně na jedno desetinné místo.';

// ======================= 901 PODOBNOST =======================
const kTxt = k => cz(k);
function po_pomer() {
  const a = ri(2, 8), k = pick([2, 3, 4, 5, 1.5, 2.5]), a2 = a * k;
  if (!Number.isInteger(a2)) return po_pomer();
  return N({
    text: `Trojúhelníky ABC a A′B′C′ jsou podobné. Strana AB měří ${B(cm(a))}, odpovídající strana A′B′ měří ${B(cm(a2))}.`, q: 'Jaký je poměr podobnosti k (kolikrát je druhý trojúhelník větší)?', ans: k,
    traps: [[a2 - a, 'Poměr podobnosti se nepočítá odčítáním. Je to podíl odpovídajících stran.'], [rd(a / a2, 3), 'Ptáme se, kolikrát je druhý trojúhelník větší: dělí se větší strana menší.']],
    hints: ['Podobné útvary mají stejný tvar, jen jinou velikost. Jeden je zvětšeninou druhého.', 'Poměr podobnosti k říká, kolikrát jsou strany druhého útvaru delší: k = |A′B′| : |AB|.', `k = ${a2} : ${a}`], steps: ['k = |A′B′| : |AB|', `k = ${a2} : ${a} = ${kTxt(k)}`],
  });
}
function po_strana() {
  const [a, bb, c] = pick([[3, 4, 5], [4, 5, 6], [5, 6, 7], [4, 6, 7], [6, 7, 8]]), k = pick([2, 3, 1.5]), ix = ri(0, 2), s = [c, a, bb];
  return N({
    text: `Trojúhelník A′B′C′ je podobný trojúhelníku ABC s poměrem podobnosti ${B('k = ' + kTxt(k))}. Strana trojúhelníku ABC měří ${B(cm(s[ix]))}.`, q: 'Jak dlouhá je odpovídající strana trojúhelníku A′B′C′?',
    fig: fSim(triSSS(a, bb, c), s.map((x, i) => i === ix ? cm(x) : ''), k, s.map((x, i) => i === ix ? '?' : '')), ans: s[ix] * k, unit: 'cm',
    traps: [[s[ix] + k, 'Poměrem podobnosti se násobí, nepřičítá se.']],
    hints: ['Všechny strany podobného trojúhelníku jsou k-krát delší.', 'Nová strana = původní strana · k', `${s[ix]} · ${kTxt(k)}`], steps: [`${s[ix]} · ${kTxt(k)} = ${cm(s[ix] * k)}`],
  });
}
function po_meritko1() {
  const [m, jedn, nas, vysv] = pick([[100, 'm', 1, '1 cm na plánu je 100 cm = 1 m ve skutečnosti'], [1000, 'm', 10, '1 cm na plánu je 1000 cm = 10 m ve skutečnosti'], [50000, 'km', 0.5, '1 cm na mapě je 50 000 cm = 500 m = 0,5 km ve skutečnosti'], [100000, 'km', 1, '1 cm na mapě je 100 000 cm = 1 km ve skutečnosti']]), x = ri(2, 12);
  return N({
    text: `Mapa (plán) má měřítko ${B('1 : ' + cz(m))}. Vzdálenost dvou míst na ní měří ${B(cm(x))}.`, q: `Kolik je to ve skutečnosti (v ${jedn === 'm' ? 'metrech' : 'kilometrech'})?`, ans: rd(x * nas, 1), unit: jedn,
    traps: [[x * m, 'To jsou centimetry. Převeď je na ' + (jedn === 'm' ? 'metry' : 'kilometry') + '.']],
    hints: ['Měřítko 1 : ' + cz(m) + ' znamená, že všechno je ve skutečnosti ' + cz(m) + 'krát větší než na mapě.', vysv + '.', `${x} · ${cz(nas)}`], steps: [vysv, `${x} cm → ${x} · ${cz(nas)} = ${cz(x * nas)} ${jedn}`],
  });
}
function po_uhel() {
  const al = ri(25, 100), k = pick([2, 3]);
  return N({
    text: `Trojúhelník A′B′C′ je ${KRAT[k]} zvětšený trojúhelník ABC. Úhel α v trojúhelníku ABC má ${B(st(al))}.`, q: 'Jak velký je odpovídající úhel α′?', ans: al, unit: '°',
    traps: [[al * k, 'Při zvětšení se úhly nemění. Mění se jen délky stran.']],
    hints: ['Podobné útvary mají stejný tvar.', 'Stejný tvar znamená stejné úhly. Zvětšují se jen délky.', `α′ = α = ${st(al)}`], steps: ['Podobné trojúhelníky mají shodné úhly.', `α′ = ${st(al)}`],
  });
}
function po_poznej() {
  const a = ri(2, 5), bb = a + ri(1, 3), k = pick([2, 3]), ano = chance(0.5), a2 = a * k, b2 = ano ? bb * k : bb * k + pick([-1, 1, 2]);
  return C({
    text: `První obdélník má strany ${B(`${a} cm a ${bb} cm`)}, druhý ${B(`${a2} cm a ${b2} cm`)}.`, q: 'Jsou podobné?', ok: ano ? 'Ano' : 'Ne', opts: ['Ano', 'Ne'],
    hints: ['Podobné obdélníky musí být zvětšené ve všech směrech stejně.', 'Vyděl odpovídající strany. Když vyjde u obou dvojic stejné číslo, jsou podobné.', `${a2} : ${a} = ${k}. A kolik je ${b2} : ${bb}?`],
    steps: [`Kratší strany: ${a2} : ${a} = ${k}`, `Delší strany: ${b2} : ${bb} = ${cz(b2 / bb)}`, ano ? 'Poměry se rovnají, obdélníky jsou podobné.' : 'Poměry se nerovnají, obdélníky podobné nejsou.'],
  });
}
// --- úroveň 2 ---
function po_neznama() {
  const a = ri(2, 6), bb = a + ri(1, 4), k = pick([2, 3, 1.5, 2.5]);
  if (!Number.isInteger(a * k) || !Number.isInteger(bb * k)) return po_neznama();
  const c = Math.min(a + bb - 1, bb + 1);
  return N({
    text: `Trojúhelníky na obrázku jsou podobné. Odpovídající strany mají délky ${B(`${a} cm a ${a * k} cm`)}. Další strana menšího trojúhelníku měří ${B(cm(bb))}.`, q: 'Jak dlouhá je odpovídající strana většího trojúhelníku?',
    fig: fSim(triSSS(bb, c, a), [cm(a), cm(bb), ''], k, [cm(a * k), '?', '']), ans: bb * k, unit: 'cm',
    traps: [[bb + a * k - a, 'Strany se nezvětšují přičtením stejného čísla, ale vynásobením stejným číslem.']],
    hints: ['Nejdřív z dvojice známých stran urči poměr podobnosti.', `k = ${a * k} : ${a} = ${kTxt(k)}. Tímto číslem vynásob druhou stranu.`], steps: [`k = ${a * k} : ${a} = ${kTxt(k)}`, `x = ${bb} · ${kTxt(k)} = ${cm(bb * k)}`],
  });
}
function po_meritko2() {
  const [m, nas] = pick([[50000, 0.5], [100000, 1], [25000, 0.25], [200000, 2]]), cmx = ri(2, 12), km = rd(cmx * nas, 2);
  return N({
    text: `Dvě obce jsou od sebe vzdušnou čarou ${B(cz(km) + ' km')}. Mapa má měřítko ${B('1 : ' + cz(m))}.`, q: 'Kolik centimetrů od sebe jsou na mapě?', ans: cmx, unit: 'cm',
    hints: ['Zjisti, kolik kilometrů ve skutečnosti odpovídá 1 cm na mapě.', `1 cm na mapě je ${cz(m)} cm = ${cz(nas)} km. Skutečnou vzdálenost tímto číslem vyděl.`], steps: [`1 cm na mapě = ${cz(m)} cm = ${cz(nas)} km`, `${cz(km)} : ${cz(nas)} = ${cm(cmx)}`],
  });
}
function po_meritkoUrci() {
  const m = pick([100, 200, 500, 1000, 2000]), x = ri(2, 9), sk = x * m / 100;
  return N({
    text: `Na plánu měří zeď ${B(cm(x))}. Ve skutečnosti je dlouhá ${B(cz(sk) + ' m')}.`, q: 'Jaké je měřítko plánu? Doplň číslo: 1 : …', ans: m,
    traps: [[sk / x, 'Obě délky musí být ve stejných jednotkách. Převeď metry na centimetry.']],
    hints: ['Měřítko říká, kolikrát je skutečnost větší než plán. Obě délky musí být ve stejných jednotkách.', `${cz(sk)} m = ${cz(sk * 100)} cm`], steps: [`${cz(sk)} m = ${cz(sk * 100)} cm`, `${cz(sk * 100)} : ${x} = ${cz(m)}`, `Měřítko je 1 : ${cz(m)}.`],
  });
}
function po_stin() {
  const t = pick([1, 1.5, 2]), st1 = pick([1.5, 2, 3]), k = ri(3, 8);
  return N({
    text: `Svislá tyč vysoká ${B(cz(t) + ' m')} vrhá stín dlouhý ${B(cz(st1) + ' m')}. Strom vrhá ve stejnou chvíli stín dlouhý ${B(cz(st1 * k) + ' m')}.`, q: 'Jak vysoký je strom?', ans: rd(t * k, 1), unit: 'm',
    hints: ['Sluneční paprsky dopadají na tyč i na strom pod stejným úhlem. Tyč se stínem a strom se stínem tvoří podobné pravoúhlé trojúhelníky.', 'Kolikrát je stín stromu delší, tolikrát je strom vyšší než tyč.'], steps: [`k = ${cz(st1 * k)} : ${cz(st1)} = ${k}`, `Výška stromu: ${cz(t)} · ${k} = ${cz(t * k)} m`],
  });
}
function po_obvod() {
  const o = ri(12, 40), k = pick([2, 3, 1.5, 0.5]);
  return N({
    text: `Trojúhelník má obvod ${B(cm(o))}. Podobný trojúhelník má poměr podobnosti ${B('k = ' + kTxt(k))}.`, q: 'Jaký obvod má podobný trojúhelník?', ans: o * k, unit: 'cm',
    traps: [[o * k * k, 'Na druhou se poměr umocňuje u obsahu. Obvod je délka, násobí se jen k.']],
    hints: ['Každá strana se násobí číslem k.', 'Obvod je součet stran, takže se taky násobí číslem k.'], steps: [`o′ = k · o = ${kTxt(k)} · ${o} = ${cm(o * k)}`],
  });
}
function po_veta() {
  let a, bb; do { a = 5 * ri(6, 14); bb = 5 * ri(6, 14); } while (a === bb || a + bb > 150 || 180 - a - bb === a || 180 - a - bb === bb || a - (180 - a - bb) === 10);
  const c = 180 - a - bb, ano = chance(0.5), druhy = ano ? [bb, c] : [bb, c + 10];
  return C({
    text: `Trojúhelník ABC má úhly ${B(`${a}° a ${bb}°`)}. Trojúhelník KLM má úhly ${B(`${druhy[0]}° a ${druhy[1]}°`)}.`, q: 'Jsou trojúhelníky podobné?', ok: ano ? 'Ano' : 'Ne', opts: ['Ano', 'Ne'],
    hints: ['Trojúhelníky jsou podobné, když se shodují ve dvou úhlech (věta uu).', 'Dopočítej u obou trojúhelníků třetí úhel a porovnej všechny tři.'],
    steps: [`ABC: třetí úhel 180° − ${a}° − ${bb}° = ${c}°, úhly ${a}°, ${bb}°, ${c}°`, `KLM: třetí úhel ${180 - druhy[0] - druhy[1]}°, úhly ${druhy[0]}°, ${druhy[1]}°, ${180 - druhy[0] - druhy[1]}°`, ano ? 'Úhly jsou stejné, trojúhelníky jsou podobné (věta uu).' : 'Úhly se liší, trojúhelníky podobné nejsou.'],
  });
}
// --- úroveň 3 ---
function po_obsah() {
  const S = ri(6, 30), k = pick([2, 3, 4]);
  return N({
    text: `Trojúhelník má obsah ${cm2(S)}. Podobný trojúhelník má všechny strany ${KRAT[k]} delší.`, q: 'Jaký má obsah?', ans: S * k * k, unit: 'cm²', units: 1,
    traps: [[S * k, 'Obsah se nemění k-krát, ale k²-krát: zvětšuje se základna i výška.']],
    hints: ['Zvětší se základna i výška, obě k-krát. Co to udělá s jejich součinem?'], steps: [`Obsah se zvětší k² = ${k}² = ${k * k}krát.`, `S′ = ${S} · ${k * k} = ${cm2(S * k * k)}`],
  });
}
function po_planObsah() {
  const m = pick([200, 500, 1000]), a = ri(2, 8), bb = ri(2, 6), A = a * m / 100, Bv = bb * m / 100;
  return N({
    text: `Pozemek je na plánu v měřítku 1 : ${cz(m)} zakreslen jako obdélník se stranami ${a} cm a ${bb} cm.`, q: 'Jakou má pozemek ve skutečnosti výměru v m²?', ans: A * Bv, unit: 'm²', units: 1,
    traps: [[a * bb * m / 100, 'Měřítkem se násobí každá strana zvlášť, ne obsah.']],
    hints: ['Nejdřív převeď obě strany na skutečné délky v metrech, pak teprve násob.'], steps: [`${a} cm → ${a} · ${cz(m)} cm = ${cz(A)} m`, `${bb} cm → ${bb} · ${cz(m)} cm = ${cz(Bv)} m`, `S = ${cz(A)} · ${cz(Bv)} = ${cz(A * Bv)} m²`],
  });
}
function po_pricka() {
  const p = ri(2, 5), q = ri(1, 4), m = ri(1, 3), ab = m * (p + q);
  return N({
    text: `V trojúhelníku ABC leží bod D na straně AC a bod E na straně BC tak, že DE ∥ AB. Platí |CD| = ${cm(p)}, |DA| = ${cm(q)} a |AB| = ${cm(ab)}.`, q: 'Vypočítej délku úsečky DE.', ans: m * p, unit: 'cm', units: 1,
    traps: [[rd(ab * p / q, 2), 'Poměr podobnosti je |CD| : |CA|, ne |CD| : |DA|.']],
    hints: ['Trojúhelníky DEC a ABC jsou podobné (mají stejné úhly). Poměr podobnosti je |CD| : |CA|.'], steps: [`|CA| = ${p} + ${q} = ${cm(p + q)}`, `k = |CD| : |CA| = ${p} : ${p + q}`, `|DE| = ${ab} · ${p} : ${p + q} = ${cm(m * p)}`],
  });
}
function po_fotka() {
  const [a, bb] = pick([[9, 13], [10, 15], [13, 18]]), k = pick([2, 2.5, 3]);
  return N({
    text: `Fotografie má rozměry ${a} cm a ${bb} cm. Zvětší se tak, že kratší strana bude měřit ${cm(a * k)}.`, q: 'O kolik cm² bude zvětšená fotografie větší než původní?', ans: rd(a * bb * (k * k - 1), 2), unit: 'cm²', units: 1,
    hints: ['Urči poměr zvětšení a delší stranu zvětšené fotografie. Pak odečti obsahy.'], steps: [`k = ${cz(a * k)} : ${a} = ${kTxt(k)}`, `Delší strana: ${bb} · ${kTxt(k)} = ${cm(bb * k)}`, `Obsahy: ${cz(a * k)} · ${cz(bb * k)} = ${cm2(a * bb * k * k)} a ${a} · ${bb} = ${cm2(a * bb)}`, `Rozdíl: ${cm2(rd(a * bb * (k * k - 1), 2))}`],
  });
}
function po_vez() {
  const cl = pick([1.6, 1.8]), k = pick([10, 15, 20, 25]), s = pick([2, 2.4, 3]);
  return N({
    text: `Člověk vysoký ${cz(cl)} m vrhá stín dlouhý ${cz(s)} m. Věž vrhá ve stejnou chvíli stín dlouhý ${cz(rd(s * k, 1))} m.`, q: 'Jak vysoká je věž?', ans: rd(cl * k, 1), unit: 'm', units: 1,
    hints: ['Člověk se stínem a věž se stínem tvoří podobné pravoúhlé trojúhelníky.'], steps: [`k = ${cz(rd(s * k, 1))} : ${cz(s)} = ${k}`, `Výška věže: ${cz(cl)} · ${k} = ${cz(rd(cl * k, 1))} m`],
  });
}
function po_model() {
  const m = pick([18, 24, 43, 87]), d = pick([4.5, 4.2, 3.9, 5.4, 12]), mo = rd(d * 100 / m, 1);
  return N({
    text: `Model je vyroben v měřítku 1 : ${m}. Skutečné vozidlo je dlouhé ${cz(d)} m.`, q: 'Jak dlouhý je model v centimetrech? Zaokrouhli přesně na jedno desetinné místo.', ans: mo, dec: 1, unit: 'cm', units: 1,
    hints: ['Model je tolikrát menší, kolik říká měřítko. Převeď metry na centimetry a vyděl.'], steps: [`${cz(d)} m = ${cz(d * 100)} cm`, `${cz(d * 100)} : ${m} ≐ ${cm(mo)}`],
  });
}

// ======================= 902 GONIOMETRICKÉ FUNKCE =======================
const RAD = Math.PI / 180, FN = { sin: d => Math.sin(d * RAD), cos: d => Math.cos(d * RAD), tg: d => Math.tan(d * RAD) };
const bezp = (x, dec) => { const y = x * 10 ** dec, f = y - Math.floor(y); return Math.abs(f - 0.5) > 0.13; };
// výsledek + uznávaná varianta s hodnotou funkce zaokrouhlenou na 4 místa (tabulky)
function gv(presne, tabulkove, dec = 1) { const a = rd(presne, dec), b = rd(tabulkove, dec); return { ans: a, alt: a === b ? [] : [b], dec }; }
const PRAVO = 'V pravoúhlém trojúhelníku ABC s pravým úhlem u vrcholu C';
function g_pojem() {
  const [co, ok, proc] = pick([['protilehlá odvěsna k úhlu α', 'strana a', 'Strana a leží naproti úhlu α.'], ['přilehlá odvěsna k úhlu α', 'strana b', 'Strana b je ramenem úhlu α a není to přepona.'], ['přepona', 'strana c', 'Přepona leží naproti pravému úhlu.']]);
  return C({
    text: `Na obrázku je pravoúhlý trojúhelník ABC s vyznačeným úhlem α.`, q: `Která strana je ${co}?`, fig: fRightTri(4, 5.2, { la: 'a', lb: 'b', lc: 'c', alpha: 'α' }), ok, opts: ['strana a', 'strana b', 'strana c'],
    hints: ['Jména odvěsen závisí na tom, od kterého úhlu se díváme.', 'Protilehlá odvěsna leží naproti úhlu. Přilehlá odvěsna z úhlu vychází (a není to přepona).', 'Přepona je vždy naproti pravému úhlu.'], steps: [proc],
  });
}
function g_definice() {
  const [f, ok] = pick([['sin α', 'protilehlá odvěsna : přepona'], ['cos α', 'přilehlá odvěsna : přepona'], ['tg α', 'protilehlá odvěsna : přilehlá odvěsna']]);
  return C({
    text: `Goniometrická funkce ${B(f)} v pravoúhlém trojúhelníku.`, q: 'Který poměr stran to je?', ok, opts: ['protilehlá odvěsna : přepona', 'přilehlá odvěsna : přepona', 'protilehlá odvěsna : přilehlá odvěsna'],
    hints: ['Každá funkce je podíl dvou stran pravoúhlého trojúhelníku.', 'Sinus a kosinus mají ve jmenovateli přeponu. Tangens přeponu nepoužívá.', 'Sinus: protilehlá ku přeponě. Kosinus: přilehlá ku přeponě. Tangens: protilehlá ku přilehlé.'], steps: [`${f} = ${ok}`],
  });
}
function g_pomer() {
  const [a, b, c] = pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17], [6, 8, 10], [7, 24, 25]]), f = pick(['sin', 'cos', 'tg']), [cit, jm, v] = { sin: [a, c, 'a : c'], cos: [b, c, 'b : c'], tg: [a, b, 'a : b'] }[f];
  return N({
    text: `${PRAVO} je a = ${B(cm(a))}, b = ${B(cm(b))}, c = ${B(cm(c))}. Úhel α leží u vrcholu A.`, q: `Vypočítej ${f} α. Zaokrouhli na dvě desetinná místa.`, fig: fRightTri(a, b, { la: cm(a), lb: cm(b), lc: cm(c), alpha: 'α' }), ans: rd(cit / jm, 2), dec: 2,
    hints: ['Úhel α je u vrcholu A. Protilehlá odvěsna je a, přilehlá b, přepona c.', `${f} α = ${v}`, `${f} α = ${cit} : ${jm}`], steps: [`${f} α = ${v}`, `${f} α = ${cit} : ${jm} ≐ ${cz(rd(cit / jm, 2))}`],
  });
}
function g_kalkulacka() {
  let f, u, h; do { f = pick(['sin', 'cos', 'tg']); u = ri(10, 80); h = FN[f](u); } while (!bezp(h, 2));
  return N({
    text: `Najdi na kalkulačce (nebo v tabulkách) hodnotu ${B(`${f} ${u}°`)}.`, q: 'Kolik to je? Zaokrouhli na dvě desetinná místa.', ans: rd(h, 2), dec: 2,
    hints: ['Na kalkulačce musí být nastavené stupně (DEG), ne radiány.', `Zmáčkni tlačítko ${f === 'tg' ? 'tan' : f} a zadej ${u}.`, 'Výsledek zaokrouhli na setiny.'], steps: [`${f} ${u}° ≐ ${cz(rd(h, 2))}`],
  });
}
function gonStrana(f) { // f: sin → a z c; cos → b z c; tg → a z b
  for (;;) { const al = ri(20, 70), z = ri(5, 20), x = z * FN[f](al); if (bezp(x, 1) && x > 2) return [al, z, x, z * rd(FN[f](al), 4)]; }
}
function g_stranaSin() {
  const [al, c, x, tab] = gonStrana('sin');
  return N({
    text: `${PRAVO} je přepona c = ${B(cm(c))} a úhel α = ${B(st(al))}.`, q: `Jak dlouhá je odvěsna a (protilehlá k úhlu α)? ${ZAOKR}`, fig: fRightTri(c * FN.sin(al), c * FN.cos(al), { la: '?', lc: cm(c), alpha: st(al) }), ...gv(x, tab), unit: 'cm',
    traps: [[rd(c * FN.cos(al), 1), 'Tohle vyjde s kosinem. Protilehlá odvěsna patří k sinu.']],
    hints: ['Známe přeponu a úhel, hledáme protilehlou odvěsnu. Která funkce spojuje protilehlou odvěsnu a přeponu?', 'sin α = a : c, proto a = c · sin α', `a = ${c} · sin ${al}°`], steps: ['sin α = a : c', `a = c · sin α = ${c} · sin ${al}°`, `a ≐ ${cm(rd(x, 1))}`],
  });
}
// --- úroveň 2 ---
function g_stranaCos() {
  const [al, c, x, tab] = gonStrana('cos');
  return N({
    text: `${PRAVO} je přepona c = ${B(cm(c))} a úhel α = ${B(st(al))}.`, q: `Jak dlouhá je odvěsna b (přilehlá k úhlu α)? ${ZAOKR}`, fig: fRightTri(c * FN.sin(al), c * FN.cos(al), { lb: '?', lc: cm(c), alpha: st(al) }), ...gv(x, tab), unit: 'cm',
    traps: [[rd(c * FN.sin(al), 1), 'Tohle vyjde se sinem. Přilehlá odvěsna patří ke kosinu.']],
    hints: ['Přilehlou odvěsnu a přeponu spojuje kosinus.', 'cos α = b : c, proto b = c · cos α'], steps: [`b = c · cos α = ${c} · cos ${al}°`, `b ≐ ${cm(rd(x, 1))}`],
  });
}
function g_stranaTg() {
  const [al, bb, x, tab] = gonStrana('tg');
  return N({
    text: `${PRAVO} je odvěsna b = ${B(cm(bb))} a úhel α = ${B(st(al))}.`, q: `Jak dlouhá je odvěsna a (protilehlá k úhlu α)? ${ZAOKR}`, fig: fRightTri(x, bb, { la: '?', lb: cm(bb), alpha: st(al) }), ...gv(x, tab), unit: 'cm',
    hints: ['Známe přilehlou odvěsnu, hledáme protilehlou. Přepona v úloze není, použijeme tangens.', 'tg α = a : b, proto a = b · tg α'], steps: [`a = b · tg α = ${bb} · tg ${al}°`, `a ≐ ${cm(rd(x, 1))}`],
  });
}
function g_prepona() {
  let al, a, x; do { al = ri(20, 70); a = ri(4, 15); x = a / FN.sin(al); } while (!bezp(x, 1));
  return N({
    text: `${PRAVO} je odvěsna a = ${B(cm(a))} a úhel α = ${B(st(al))} (leží naproti straně a).`, q: `Jak dlouhá je přepona c? ${ZAOKR}`, fig: fRightTri(a, a / FN.tg(al), { la: cm(a), lc: '?', alpha: st(al) }), ...gv(x, a / rd(FN.sin(al), 4)), unit: 'cm',
    traps: [[rd(a * FN.sin(al), 1), 'Přepona je delší než odvěsna. Sinem se tady dělí, nenásobí.']],
    hints: ['Protilehlou odvěsnu a přeponu spojuje sinus.', 'sin α = a : c, proto c = a : sin α'], steps: ['sin α = a : c', `c = a : sin α = ${a} : sin ${al}°`, `c ≐ ${cm(rd(x, 1))}`],
  });
}
function gonUhel(f) { for (;;) { const p = ri(3, 12), q = ri(4, 15), pom = f === 'tg' ? p / q : (p < q ? p / q : 2); if (pom > 1.6 || pom < 0.2) continue; const u = (f === 'sin' ? Math.asin(pom) : f === 'cos' ? Math.acos(pom) : Math.atan(pom)) / RAD; if (bezp(u, 0) && u > 12 && u < 78) return [p, q, u]; } }
function g_uhelSin() {
  const [a, c, u] = gonUhel('sin');
  return N({
    text: `${PRAVO} je odvěsna a = ${B(cm(a))} a přepona c = ${B(cm(c))}.`, q: 'Jak velký je úhel α (naproti straně a)? Zaokrouhli na celé stupně.', ans: rd(u), dec: 0, unit: '°',
    traps: [[rd(90 - u), 'To je druhý ostrý úhel. Úhel α leží naproti straně a.']],
    hints: ['Protilehlou odvěsnu a přeponu spojuje sinus: sin α = a : c.', 'Úhel z hodnoty sinu vrátí na kalkulačce tlačítko sin⁻¹ (často SHIFT + sin).'], steps: [`sin α = ${a} : ${c} ≐ ${cz(a / c, 4)}`, `α ≐ ${st(rd(u))}`],
  });
}
function g_uhelTg() {
  const [a, bb, u] = gonUhel('tg');
  return N({
    text: `${PRAVO} jsou odvěsny a = ${B(cm(a))} a b = ${B(cm(bb))}.`, q: 'Jak velký je úhel α (naproti straně a)? Zaokrouhli na celé stupně.', fig: fRightTri(a, bb, { la: cm(a), lb: cm(bb), alpha: '?' }), ans: rd(u), dec: 0, unit: '°',
    traps: [[rd(90 - u), 'To je druhý ostrý úhel. Do tangens patří protilehlá ku přilehlé: a : b.']],
    hints: ['Známe obě odvěsny, použijeme tangens: tg α = a : b.', 'Úhel z hodnoty tangens vrátí tlačítko tan⁻¹ (často SHIFT + tan).'], steps: [`tg α = ${a} : ${bb} ≐ ${cz(a / bb, 4)}`, `α ≐ ${st(rd(u))}`],
  });
}
function g_kterou() {
  const [co, ok] = pick([['protilehlou odvěsnu a přeponu', 'sinus'], ['přilehlou odvěsnu a přeponu', 'kosinus'], ['obě odvěsny', 'tangens']]);
  return C({
    text: `V pravoúhlém trojúhelníku znáš ${B(co)} a hledáš úhel.`, q: 'Kterou funkci použiješ?', ok, opts: ['sinus', 'kosinus', 'tangens'],
    hints: ['Vyber funkci, ve které vystupují právě ty dvě strany, které znáš.', 'sin: protilehlá a přepona. cos: přilehlá a přepona. tg: protilehlá a přilehlá.'], steps: [`Znám ${co} → ${ok}.`],
  });
}
// --- úroveň 3 ---
function g_zebrik() {
  let d, al, x; do { d = pick([3, 3.5, 4, 5, 6, 7.5]); al = ri(55, 78); x = d * FN.sin(al); } while (!bezp(x, 1));
  return N({
    text: `Žebřík dlouhý ${cz(d)} m je opřený o svislou zeď a s vodorovnou zemí svírá úhel ${st(al)}.`, q: `Do jaké výšky na zdi dosahuje? ${ZAOKR3}`, ...gv(x, d * rd(FN.sin(al), 4)), unit: 'm', units: 1,
    hints: ['Žebřík je přepona, výška na zdi je odvěsna protilehlá k zadanému úhlu.'], steps: [`v = ${cz(d)} · sin ${al}°`, `v ≐ ${cz(rd(x, 1))} m`],
  });
}
function g_stoupani() {
  let p, u; do { p = ri(4, 30); u = Math.atan(p / 100) / RAD; } while (!bezp(u, 0));
  return N({
    text: `Dopravní značka upozorňuje na stoupání ${p} %. Znamená to, že na 100 m vodorovné vzdálenosti silnice vystoupá o ${p} m.`, q: 'Pod jakým úhlem silnice stoupá? Zaokrouhli přesně na celé stupně.', ans: rd(u), dec: 0, unit: '°',
    traps: [[rd(Math.asin(p / 100) / RAD) === rd(u) ? -1 : rd(Math.asin(p / 100) / RAD), '100 m je vodorovná vzdálenost, tedy přilehlá odvěsna, ne přepona. Patří sem tangens.']],
    hints: ['Vodorovná vzdálenost a převýšení jsou odvěsny pravoúhlého trojúhelníku. Které funkci stačí dvě odvěsny?'], steps: [`tg α = ${p} : 100 = ${cz(p / 100)}`, `α ≐ ${st(rd(u))}`],
  });
}
function g_vez() {
  let d, al, x; do { d = 5 * ri(4, 16); al = ri(25, 65); x = d * FN.tg(al) + 1.6; } while (!bezp(x, 1));
  return N({
    text: `Pozorovatel stojí ${d} m od paty věže a její vrchol vidí pod výškovým úhlem ${st(al)}. Oči má ve výšce 1,6 m nad zemí.`, q: `Jak vysoká je věž? ${ZAOKR3}`, ...gv(x, d * rd(FN.tg(al), 4) + 1.6), unit: 'm', units: 1,
    traps: [[rd(d * FN.tg(al), 1), 'K vypočítané výšce ještě přičti výšku očí pozorovatele.']],
    hints: ['Vzdálenost od věže je přilehlá odvěsna, hledaná část výšky protilehlá. Nezapomeň, že úhel se měří od očí, ne od země.'], steps: [`x = ${d} · tg ${al}° ≐ ${cz(d * FN.tg(al), 2)} m`, `Výška věže: ${cz(d * FN.tg(al), 2)} + 1,6 ≐ ${cz(rd(x, 1))} m`],
  });
}
function g_rovnoramenny() {
  let z, al, x; do { z = 2 * ri(3, 12); al = ri(35, 75); x = z / 2 * FN.tg(al); } while (!bezp(x, 1));
  return N({
    text: `Rovnoramenný trojúhelník má základnu ${cm(z)} a úhly při základně ${st(al)}.`, q: `Jak dlouhá je jeho výška na základnu? ${ZAOKR3}`, ...gv(x, z / 2 * rd(FN.tg(al), 4)), unit: 'cm', units: 1,
    traps: [[rd(z * FN.tg(al), 1), 'Výška půlí základnu. V pravoúhlém trojúhelníku je odvěsnou jen polovina základny.']],
    hints: ['Výška rozdělí trojúhelník na dva pravoúhlé. V každém je přilehlou odvěsnou polovina základny.'], steps: [`Polovina základny: ${cm(z / 2)}`, `v = ${z / 2} · tg ${al}°`, `v ≐ ${cm(rd(x, 1))}`],
  });
}
function g_uhlopricka() {
  let a, bb, u; do { a = ri(6, 20); bb = ri(3, a - 1); u = Math.atan(bb / a) / RAD; } while (!bezp(u, 0));
  return N({
    text: `Obdélník má strany ${cm(a)} a ${cm(bb)}.`, q: 'Jaký úhel svírá jeho úhlopříčka s delší stranou? Zaokrouhli přesně na celé stupně.', ans: rd(u), dec: 0, unit: '°',
    traps: [[rd(90 - u), 'To je úhel s kratší stranou.']],
    hints: ['Úhlopříčka a obě strany tvoří pravoúhlý trojúhelník. K hledanému úhlu je delší strana přilehlá a kratší protilehlá.'], steps: [`tg α = ${bb} : ${a} ≐ ${cz(bb / a, 4)}`, `α ≐ ${st(rd(u))}`],
  });
}
function g_lanovka() {
  let L, h, u; do { L = 50 * ri(8, 30); h = 10 * ri(15, 60); u = h < L ? Math.asin(h / L) / RAD : 0; } while (h >= L * 0.7 || u < 8 || !bezp(u, 0));
  return N({
    text: `Lanovka je dlouhá ${cz(L)} m a překonává převýšení ${h} m. Lano považuj za přímé.`, q: 'Pod jakým úhlem lanovka stoupá? Zaokrouhli přesně na celé stupně.', ans: rd(u), dec: 0, unit: '°',
    traps: [[rd(Math.atan(h / L) / RAD) === rd(u) ? -1 : rd(Math.atan(h / L) / RAD), 'Délka lanovky je přepona, ne přilehlá odvěsna. Patří sem sinus.']],
    hints: ['Délka lanovky je přepona, převýšení odvěsna protilehlá k hledanému úhlu.'], steps: [`sin α = ${h} : ${cz(L)} ≐ ${cz(h / L, 4)}`, `α ≐ ${st(rd(u))}`],
  });
}

// ======================= 903 JEHLAN, KUŽEL, KOULE =======================
function j_objemSp() {
  const v = 3 * ri(1, 5), S = ri(6, 40);
  return N({
    text: `Jehlan má podstavu o obsahu ${B(cm2(S))} a výšku ${B(cm(v))}.`, q: 'Vypočítej jeho objem.', ans: S * v / 3, unit: 'cm³',
    traps: [[S * v, 'To je objem hranolu se stejnou podstavou a výškou. Jehlan má třetinu.']],
    hints: ['Jehlan se zužuje do špičky, proto má menší objem než hranol se stejnou podstavou a výškou.', 'Má přesně třetinu: V = S<sub>p</sub> · v : 3', `V = ${S} · ${v} : 3`], steps: ['V = S<sub>p</sub> · v : 3', `V = ${S} · ${v} : 3 = ${cm3(S * v / 3)}`],
  });
}
function j_objemCtv() {
  const a = ri(3, 10), v = 3 * ri(1, 5);
  return N({
    text: `Pravidelný čtyřboký jehlan má podstavnou hranu ${B(cm(a))} a výšku ${B(cm(v))}.`, q: 'Vypočítej jeho objem.', fig: fPyr(a, v, { la: cm(a), lh: cm(v) }), ans: a * a * v / 3, unit: 'cm³',
    traps: [[a * a * v, 'Chybí dělení třemi.'], [a * v / 3, 'Podstava je čtverec, její obsah je a · a.']],
    hints: ['Podstavou pravidelného čtyřbokého jehlanu je čtverec.', 'V = S<sub>p</sub> · v : 3, kde S<sub>p</sub> = a²', `V = ${a}² · ${v} : 3`], steps: [`S<sub>p</sub> = ${a}² = ${cm2(a * a)}`, `V = ${a * a} · ${v} : 3 = ${cm3(a * a * v / 3)}`],
  });
}
function k_objem() {
  const r = ri(2, 6), v = 3 * ri(1, 5);
  return N({
    text: `Kužel má poloměr podstavy ${B(cm(r))} a výšku ${B(cm(v))}.`, q: `Vypočítej jeho objem. ${ZAOKR} ${PI_T}`, fig: fCone(r, v, { lr: cm(r), lh: cm(v) }), ...pia(p => p * r * r * v / 3), unit: 'cm³',
    traps: [[rd(3.14 * r * r * v, 1), 'To je objem válce. Kužel má třetinu.']],
    hints: ['Kužel je „kulatý jehlan“: podstava je kruh a těleso se zužuje do špičky.', 'Má třetinu objemu válce se stejnou podstavou a výškou: V = π · r² · v : 3', `V = 3,14 · ${r}² · ${v} : 3`], steps: ['V = π · r² · v : 3', `V = 3,14 · ${r * r} · ${v} : 3`, `V ≐ ${cm3(rd(3.14 * r * r * v / 3, 1))}`],
  });
}
function ko_povrch() {
  const r = ri(2, 10);
  return N({
    text: `Koule má poloměr ${B(cm(r))}.`, q: `Vypočítej její povrch. ${ZAOKR} ${PI_T}`, fig: fSphere(r, { lr: cm(r) }), ...pia(p => 4 * p * r * r), unit: 'cm²',
    traps: [[rd(3.14 * r * r, 1), 'To je obsah jednoho kruhu. Povrch koule je čtyřikrát větší.']],
    hints: ['Povrch koule je plocha její „slupky“.', 'Je přesně čtyřikrát větší než obsah kruhu se stejným poloměrem: S = 4 · π · r²', `S = 4 · 3,14 · ${r}²`], steps: ['S = 4 · π · r²', `S = 4 · 3,14 · ${r * r}`, `S ≐ ${cm2(rd(12.56 * r * r, 1))}`],
  });
}
function j_pojem() {
  const [q, ok, bad] = pick([
    ['Jaký tvar mají boční stěny jehlanu?', 'trojúhelník', ['obdélník', 'čtverec', 'lichoběžník']], ['Kolik vrcholů má čtyřboký jehlan?', '5', ['4', '6', '8']],
    ['Jaký tvar má podstava kužele?', 'kruh', ['trojúhelník', 'čtverec', 'výseč']], ['Kolik stěn má čtyřboký jehlan (i s podstavou)?', '5', ['4', '6', '8']],
    ['Jak se jmenuje úsečka, která spojuje vrchol kužele s bodem na okraji podstavy?', 'strana kužele', ['výška kužele', 'poloměr', 'tětiva']],
  ]);
  return C({ text: 'Jehlan a kužel.', q, ok, bad, hints: ['Jehlan má jednu podstavu (mnohoúhelník) a hlavní vrchol. Boční stěny se v něm sbíhají.', 'Čtyřboký jehlan má čtvercovou nebo obdélníkovou podstavu: 4 vrcholy dole a 1 nahoře.', 'Kužel má kruhovou podstavu. Výška vede kolmo ze špičky do středu podstavy, strana šikmo po plášti.'], steps: [`Správně: ${ok}.`] });
}
// --- úroveň 2 ---
function j_povrch() {
  const a = 2 * ri(2, 6), w = ri(a / 2 + 1, 12);
  return N({
    text: `Pravidelný čtyřboký jehlan má podstavnou hranu ${B(cm(a))} a stěnovou výšku ${B(cm(w))}.`, q: 'Vypočítej jeho povrch.', fig: fPyr(a, Math.sqrt(w * w - a * a / 4), { la: cm(a), lw: cm(w) }), ans: a * a + 2 * a * w, unit: 'cm²',
    traps: [[a * a + 4 * a * w, 'Boční stěny jsou trojúhelníky: obsah každé je a · w : 2.'], [2 * a * w, 'Přičti ještě podstavu.']],
    hints: ['Povrch = čtvercová podstava + čtyři stejné trojúhelníkové stěny.', 'Stěnová výška w je výška boční stěny. Jedna stěna má obsah a · w : 2.'], steps: [`S<sub>p</sub> = ${a}² = ${cm2(a * a)}`, `Plášť: 4 · ${a} · ${w} : 2 = ${cm2(2 * a * w)}`, `S = ${a * a} + ${2 * a * w} = ${cm2(a * a + 2 * a * w)}`],
  });
}
const KUZ = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [8, 6, 10], [12, 5, 13]];
function k_strana() {
  const [r, v, s] = pick(KUZ);
  return N({
    text: `Kužel má poloměr podstavy ${B(cm(r))} a výšku ${B(cm(v))}.`, q: 'Jak dlouhá je jeho strana s?', fig: fCone(r, v, { lr: cm(r), lh: cm(v), ls: '?' }), ans: s, unit: 'cm',
    traps: [[r + v, 'Délky se nesčítají. Použij Pythagorovu větu.']],
    hints: ['Poloměr, výška a strana kužele tvoří pravoúhlý trojúhelník. Strana je přepona.', 's² = r² + v²'], steps: [`s² = ${r}² + ${v}² = ${r * r} + ${v * v} = ${s * s}`, `s = √${s * s} = ${cm(s)}`],
  });
}
function k_plast() {
  const [r, , s] = pick(KUZ);
  return N({
    text: `Kužel má poloměr podstavy ${B(cm(r))} a stranu ${B(cm(s))}.`, q: `Jaký obsah má jeho plášť? ${ZAOKR} ${PI_T}`, ...pia(p => p * r * s), unit: 'cm²',
    traps: [[rd(3.14 * r * (r + s), 1), 'To je celý povrch i s podstavou. Ptáme se jen na plášť.']],
    hints: ['Plášť kužele rozvinutý do roviny je kruhová výseč.', 'S<sub>pl</sub> = π · r · s'], steps: ['S<sub>pl</sub> = π · r · s', `S<sub>pl</sub> = 3,14 · ${r} · ${s} ≐ ${cm2(rd(3.14 * r * s, 1))}`],
  });
}
function k_povrch() {
  const [r, , s] = pick(KUZ);
  return N({
    text: `Kužel má poloměr podstavy ${B(cm(r))} a stranu ${B(cm(s))}.`, q: `Vypočítej jeho povrch. ${ZAOKR} ${PI_T}`, ...pia(p => p * r * (r + s)), unit: 'cm²',
    traps: [[rd(3.14 * r * s, 1), 'To je jen plášť. Přičti podstavu.']],
    hints: ['Povrch = kruhová podstava + plášť.', 'S = π · r² + π · r · s'], steps: [`Podstava: 3,14 · ${r}² = ${cz(3.14 * r * r)} cm²`, `Plášť: 3,14 · ${r} · ${s} = ${cz(3.14 * r * s)} cm²`, `S ≐ ${cm2(rd(3.14 * r * (r + s), 1))}`],
  });
}
function ko_objem() {
  const r = ri(2, 9);
  return N({
    text: `Koule má poloměr ${B(cm(r))}.`, q: `Vypočítej její objem. ${ZAOKR} ${PI_T}`, fig: fSphere(r, { lr: cm(r) }), ...pia(p => 4 / 3 * p * r ** 3), unit: 'cm³',
    traps: [[rd(12.56 * r * r, 1), 'To je povrch. V objemu je poloměr na třetí.'], [rd(4 / 3 * 3.14 * r * r, 1), 'V objemu je poloměr na třetí, ne na druhou.']],
    hints: ['V = 4/3 · π · r³', 'Nejdřív spočítej r³ = r · r · r.'], steps: ['V = 4/3 · π · r³', `V = 4/3 · 3,14 · ${r ** 3}`, `V ≐ ${cm3(rd(4 / 3 * 3.14 * r ** 3, 1))}`],
  });
}
function j_vyskaZObjemu() {
  const S = ri(6, 30), v = ri(3, 12);
  return N({
    text: `Jehlan má objem ${B(cm3(S * v))} a podstavu o obsahu ${B(cm2(3 * S))}.`, q: 'Jak je vysoký?', ans: v, unit: 'cm',
    traps: [[rd(v / 3, 2), 'Ve vzorci je dělení třemi. Při výpočtu výšky se proto objem nejdřív násobí třemi.']],
    hints: ['V = S<sub>p</sub> · v : 3. Trojnásobek objemu je S<sub>p</sub> · v.', 'v = 3 · V : S<sub>p</sub>'], steps: ['v = 3 · V : S<sub>p</sub>', `v = 3 · ${S * v} : ${3 * S} = ${cm(v)}`],
  });
}
function ko_polokoule() {
  const r = ri(2, 9);
  return N({
    text: `Polokoule má poloměr ${B(cm(r))}.`, q: `Vypočítej její objem. ${ZAOKR} ${PI_T}`, ...pia(p => 2 / 3 * p * r ** 3), unit: 'cm³',
    traps: [[rd(4 / 3 * 3.14 * r ** 3, 1), 'To je objem celé koule. Polokoule má polovinu.']],
    hints: ['Polokoule je polovina koule.', 'V = (4/3 · π · r³) : 2 = 2/3 · π · r³'], steps: [`Celá koule: 4/3 · 3,14 · ${r ** 3} ≐ ${cz(4 / 3 * 3.14 * r ** 3)} cm³`, `Polokoule ≐ ${cm3(rd(2 / 3 * 3.14 * r ** 3, 1))}`],
  });
}
// --- úroveň 3 ---
function j_stenova() {
  const [h, v, w] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15]]), a = 2 * h, S = a * a + 2 * a * w;
  return N({
    text: `Pravidelný čtyřboký jehlan má podstavnou hranu ${cm(a)} a výšku ${cm(v)}.`, q: 'Vypočítej jeho povrch.', ans: S, unit: 'cm²', units: 1,
    traps: [[a * a + 2 * a * v, 'Boční stěny mají jinou výšku než celý jehlan. Stěnovou výšku je potřeba dopočítat.']],
    hints: ['Na povrch potřebuješ stěnovou výšku. Tvoří pravoúhlý trojúhelník s výškou jehlanu a polovinou podstavné hrany.'],
    steps: [`Polovina hrany: ${cm(h)}`, `w² = ${v}² + ${h}² = ${v * v + h * h}, w = ${cm(w)}`, `Plášť: 4 · ${a} · ${w} : 2 = ${cm2(2 * a * w)}`, `S = ${a}² + ${2 * a * w} = ${cm2(S)}`],
  });
}
function k_povrchZV() {
  const [r, v, s] = pick(KUZ);
  return N({
    text: `Kužel má poloměr podstavy ${cm(r)} a výšku ${cm(v)}. ${PI_T}`, q: `Vypočítej jeho povrch. ${ZAOKR3}`, ...pia(p => p * r * (r + s)), unit: 'cm²', units: 1,
    traps: [[rd(3.14 * r * (r + v), 1), 'Do vzorce pro plášť patří strana kužele, ne jeho výška.']],
    hints: ['Na plášť potřebuješ stranu kužele. Dopočítej ji Pythagorovou větou z poloměru a výšky.'], steps: [`s² = ${r}² + ${v}² = ${s * s}, s = ${cm(s)}`, `S = 3,14 · ${r} · (${r} + ${s})`, `S ≐ ${cm2(rd(3.14 * r * (r + s), 1))}`],
  });
}
function ko_kulicky() {
  const k = pick([2, 3, 4, 5]), d = pick([1, 2, 3]);
  return N({
    text: `Z kovové koule o průměru ${d * k} cm se odlijí malé kuličky o průměru ${d} cm. Žádný kov se neztratí.`, q: 'Kolik kuliček vznikne?', ans: k ** 3, unit: 'kuliček',
    traps: [[k, 'Objem nezávisí na průměru přímo, ale na jeho třetí mocnině.'], [k * k, 'U objemu se poměr umocňuje na třetí, ne na druhou.']],
    hints: ['Porovnej objemy. Ve vzorci V = 4/3 · π · r³ se všechno kromě r³ vykrátí.'], steps: [`Velká koule má ${k}krát větší poloměr.`, `Její objem je ${k}³ = ${k ** 3}krát větší.`, `Vznikne ${k ** 3} kuliček.`],
  });
}
function k_kornout() {
  const r = ri(2, 4), v = 3 * ri(3, 5);
  return N({
    text: `Zmrzlina má tvar kužele (kornout plný až po okraj) s poloměrem ${cm(r)} a výškou ${cm(v)}, na kterém sedí polokoule se stejným poloměrem. ${PI_T}`, q: `Kolik cm³ zmrzliny to je? ${ZAOKR3}`, ...pia(p => p * r * r * v / 3 + 2 / 3 * p * r ** 3), unit: 'cm³', units: 1,
    traps: [[rd(3.14 * r * r * v / 3 + 4 / 3 * 3.14 * r ** 3, 1), 'Nahoře je jen polokoule, ne celá koule.']],
    hints: ['Sečti objem kužele a objem polokoule (polovina koule).'], steps: [`Kužel: 3,14 · ${r}² · ${v} : 3 = ${cz(3.14 * r * r * v / 3)} cm³`, `Polokoule: 2/3 · 3,14 · ${r}³ ≐ ${cz(2 / 3 * 3.14 * r ** 3)} cm³`, `V ≐ ${cm3(rd(3.14 * r * r * v / 3 + 2 / 3 * 3.14 * r ** 3, 1))}`],
  });
}
function j_pyramida() {
  const a = pick([210, 220, 230, 240]), v = pick([126, 138, 147, 150]);
  return N({
    text: `Pyramida má tvar pravidelného čtyřbokého jehlanu s podstavnou hranou ${a} m a výškou ${v} m.`, q: 'Jaký má objem?', ans: a * a * v / 3, unit: 'm³', units: 1,
    traps: [[a * a * v, 'Chybí dělení třemi.']], hints: ['V = S<sub>p</sub> · v : 3, podstava je čtverec.'], steps: [`S<sub>p</sub> = ${a}² = ${cz(a * a)} m²`, `V = ${cz(a * a)} · ${v} : 3 = ${cz(a * a * v / 3)} m³`],
  });
}
function ko_mic() {
  const r = ri(5, 15), o = rd(6.28 * r, 2), a = rd(12.56 * r * r, 1);
  return N({
    text: `Míč má po obvodu (v nejširším místě) ${cm(o)}. ${PI_T}`, q: `Jaký má povrch? ${ZAOKR3}`, ans: a, alt: [rd(o * o / Math.PI, 1), rd(4 * Math.PI * r * r, 1)].filter(x => x !== a), dec: 1, unit: 'cm²', units: 1,
    hints: ['Obvod v nejširším místě je délka kružnice s poloměrem koule. Nejdřív z ní spočítej poloměr.'], steps: [`r = ${cz(o)} : 6,28 = ${cm(r)}`, `S = 4 · 3,14 · ${r}² ≐ ${cm2(a)}`],
  });
}

// ======================= 904 SOUHRN K PŘIJÍMAČKÁM =======================
function s_okno() {
  const a = 2 * ri(3, 8) * 10, b = 10 * ri(8, 18);
  return N({
    text: `Okno má tvar obdélníku širokého ${a} cm a vysokého ${b} cm, na kterém nahoře sedí půlkruh (jeho průměr je šířka okna). ${PI_T}`, q: `Jaký obsah má sklo v cm²? ${ZAOKR3}`, ...pia(p => a * b + p * a * a / 8), unit: 'cm²', units: 1,
    traps: [[rd(a * b + 3.14 * a * a / 4, 1), 'Nahoře je jen půlkruh, ne celý kruh.'], [rd(a * b + 3.14 * a * a / 2, 1), 'Poloměr půlkruhu je polovina šířky okna.']],
    hints: ['Rozděl okno na obdélník a půlkruh. Poloměr půlkruhu je polovina šířky.'], steps: [`Obdélník: ${a} · ${b} = ${cz(a * b)} cm²`, `Půlkruh: 3,14 · ${a / 2}² : 2 = ${cz(3.14 * a * a / 8)} cm²`, `S ≐ ${cm2(rd(a * b + 3.14 * a * a / 8, 1))}`],
  });
}
function s_mnohouhelnik() {
  const n = pick([5, 6, 8, 9, 10, 12]), jm = { 5: 'pětiúhelníku', 6: 'šestiúhelníku', 8: 'osmiúhelníku', 9: 'devítiúhelníku', 10: 'desetiúhelníku', 12: 'dvanáctiúhelníku' }[n], jeden = chance(0.5);
  return N({
    text: `Vnitřní úhly pravidelného ${jm}.`, q: jeden ? 'Jak velký je jeden vnitřní úhel?' : 'Kolik dávají všechny vnitřní úhly dohromady?', ans: jeden ? (n - 2) * 180 / n : (n - 2) * 180, unit: '°',
    hints: ['Z jednoho vrcholu veď všechny úhlopříčky. Mnohoúhelník se rozpadne na trojúhelníky, každý má součet úhlů 180°.'], steps: [`Počet trojúhelníků: ${n} − 2 = ${n - 2}`, `Součet úhlů: ${n - 2} · 180° = ${st((n - 2) * 180)}`, ...(jeden ? [`Jeden úhel: ${(n - 2) * 180}° : ${n} = ${st((n - 2) * 180 / n)}`] : [])],
  });
}
function s_bazen() {
  const a = ri(4, 12), b = ri(3, 6), h = pick([1, 1.5, 2]), q = pick([100, 125, 250, 500]), V = a * b * h, t = V * 1000 / q;
  return N({
    text: `Bazén tvaru kvádru má dno ${a} m × ${b} m a má se napustit do výšky ${cz(h)} m. Přitéká do něj ${q} litrů vody za minutu.`, q: 'Za kolik minut bude napuštěný?', ans: t, unit: 'minut',
    traps: [[rd(V / q, 3), 'Objem je v m³, přítok v litrech. 1 m³ = 1000 l.']],
    hints: ['Spočítej objem vody v m³, převeď na litry a vyděl přítokem za minutu.'], steps: [`V = ${a} · ${b} · ${cz(h)} = ${cz(V)} m³ = ${cz(V * 1000)} l`, `${cz(V * 1000)} : ${q} = ${cz(t)} minut`],
  });
}
function s_procenta() {
  const p = pick([10, 20, 30, 50, 100]), k = 1 + p / 100, tvar = pick(['čtverce', 'krychle']);
  const ans = tvar === 'čtverce' ? rd((k * k - 1) * 100, 1) : rd((k ** 3 - 1) * 100, 1);
  return N({
    text: tvar === 'čtverce' ? `Strana čtverce se zvětší o ${p} %.` : `Hrana krychle se zvětší o ${p} %.`, q: tvar === 'čtverce' ? 'O kolik procent se zvětší jeho obsah?' : 'O kolik procent se zvětší její objem?', ans, unit: '%',
    traps: [[p, 'Obsah ani objem se nezvětšují stejně jako délka.'], [tvar === 'čtverce' ? 2 * p : 3 * p, 'Procenta se nesčítají. Nová délka se musí umocnit.']],
    hints: [`Zvětšit o ${p} % znamená vynásobit číslem ${cz(k)}. Co se stane s ${tvar === 'čtverce' ? 'obsahem a · a' : 'objemem a · a · a'}?`],
    steps: [`Nová délka: ${cz(k)} · a`, tvar === 'čtverce' ? `Nový obsah: ${cz(k)}² · a² = ${cz(k * k)} · a²` : `Nový objem: ${cz(k)}³ · a³ = ${cz(k ** 3, 3)} · a³`, `Zvětšení o ${cz(ans, 1)} %`],
  });
}
function s_kouleVeValci() {
  const [r, R, h] = pick([[3, 5, 1.44], [3, 6, 1], [6, 10, 2.88], [3, 4, 2.25], [6, 12, 2], [9, 15, 4.32], [3, 10, 0.36]]);
  return N({
    text: `Ve válcové nádobě o poloměru ${cm(R)} je voda. Ponoříme do ní celou kovovou kouli o poloměru ${cm(r)}. Voda nepřeteče.`, q: 'O kolik centimetrů stoupne hladina?', ans: h, unit: 'cm', units: 1,
    hints: ['Hladina stoupne tak, že přibude válec vody o objemu koule. Číslo π se při výpočtu vykrátí.'], steps: [`Objem koule: 4/3 · π · ${r}³ = ${cz(4 / 3 * r ** 3)} · π`, `Obsah dna: π · ${R}² = ${R * R} · π`, `Stoupnutí: ${cz(4 / 3 * r ** 3)} : ${R * R} = ${cm(h)}`],
  });
}
function s_mapaPlocha() {
  const [m, kmNaCm] = pick([[25000, 0.25], [50000, 0.5], [10000, 0.1]]), a = 2 * ri(1, 4), b = 2 * ri(1, 5), ha = rd(a * kmNaCm * b * kmNaCm * 100, 2);
  return N({
    text: `Les má na mapě v měřítku 1 : ${cz(m)} tvar obdélníku se stranami ${a} cm a ${b} cm.`, q: 'Jakou má les výměru v hektarech?', ans: ha, unit: 'ha', units: 1,
    hints: ['Převeď obě strany na skutečné délky. 1 km² = 100 ha.'], steps: [`${a} cm → ${cz(a * kmNaCm)} km, ${b} cm → ${cz(b * kmNaCm)} km`, `S = ${cz(a * kmNaCm)} · ${cz(b * kmNaCm)} = ${cz(a * kmNaCm * b * kmNaCm, 4)} km²`, `${cz(a * kmNaCm * b * kmNaCm, 4)} km² = ${cz(ha)} ha`],
  });
}
function s_vyskaNaPreponu() {
  const [a, b, c] = pick([[15, 20, 25], [30, 40, 50], [9, 12, 15], [6, 8, 10], [12, 16, 20]]);
  return N({
    text: `Pravoúhlý trojúhelník má odvěsny ${cm(a)} a ${cm(b)}.`, q: 'Jak dlouhá je jeho výška na přeponu?', ans: a * b / c, unit: 'cm', units: 1,
    hints: ['Obsah trojúhelníku se dá spočítat dvěma způsoby: z odvěsen, nebo z přepony a výšky na ni. Oba výsledky se musí rovnat.'], steps: [`c² = ${a}² + ${b}² = ${c * c}, c = ${cm(c)}`, `S = ${a} · ${b} : 2 = ${cm2(a * b / 2)}`, `v = 2 · S : c = ${a * b} : ${c} = ${cm(a * b / c)}`],
  });
}
function s_pojmy() {
  const [q, ok, bad] = pick([['Který vzorec je pro obsah kruhu?', 'S = π · r²', ['S = 2 · π · r', 'S = π · d', 'S = 4 · π · r²']], ['Který vzorec je pro objem válce?', 'V = π · r² · v', ['V = π · r² · v : 3', 'V = 2 · π · r · v', 'V = 4/3 · π · r³']], ['Který vzorec je pro obsah lichoběžníku?', 'S = (a + c) · v : 2', ['S = a · c · v', 'S = (a + c) · v', 'S = a · v : 2']], ['Který vzorec je pro objem jehlanu?', 'V = Sp · v : 3', ['V = Sp · v', 'V = Sp · v : 2', 'V = 3 · Sp · v']]]);
  return C({ text: 'Vzorce.', q, ok, bad, hints: ['Obsah je plocha (jednotky na druhou), objem prostor (jednotky na třetí).', 'Tělesa se špičkou (jehlan, kužel) mají třetinu objemu hranolu nebo válce.', 'U obsahu trojúhelníku a lichoběžníku se dělí dvěma.'], steps: [`Správně: ${ok}`] });
}

// ======================= VÝKLAD =======================
export const R9 = { rocnik: 9, temata: [
  { id: '901', nazev: 'Podobnost', ikona: '∼', popis: 'Poměr podobnosti, podobné trojúhelníky, měřítko mapy', strazce: 'Zvětšoun',
    vyklad: [
      { h: 'Stejný tvar, jiná velikost', t: 'Dva útvary jsou <b>podobné</b>, když mají stejný tvar, ale můžou být různě velké. Jeden je zvětšenina nebo zmenšenina druhého, jako fotka a její zvětšená kopie. Značka podobnosti je <b>∼</b>.<br><br>Shodné útvary jsou zvláštní případ: jsou podobné a navíc stejně velké.', fig: () => fSim(triSSS(4, 5, 6), ['', '', ''], 1.8, ['', '', '']) },
      { h: 'Poměr podobnosti', t: 'Číslo <b>k</b> říká, kolikrát je druhý útvar větší. Všechny jeho strany jsou k-krát delší:<br><br><b>a′ = k · a</b><br><br>k &gt; 1 znamená zvětšení, k &lt; 1 zmenšení. Poměr zjistíš tak, že vydělíš dvě odpovídající strany: k = a′ : a.<br><br><b>Úhly se nemění.</b> Podobné útvary mají odpovídající úhly stejně velké.', fig: () => fSim(triSSS(4, 5, 6), ['6', '4', '5'], 2, ['12', '8', '10']) },
      { h: 'Kdy jsou trojúhelníky podobné', t: 'Stačí jedna z těchto podmínek:<br><b>uu</b> – shodují se ve dvou úhlech (třetí pak vyjde taky stejně),<br><b>sss</b> – všechny tři dvojice stran mají stejný poměr,<br><b>sus</b> – dvě dvojice stran mají stejný poměr a úhel mezi nimi je stejný.' },
      { h: 'Měřítko mapy', t: 'Mapa je zmenšenina krajiny. Měřítko <b>1 : 50 000</b> znamená, že 1 cm na mapě je 50 000 cm ve skutečnosti, tedy 500 m.<br><br>Z mapy do skutečnosti <b>násobíš</b>, ze skutečnosti na mapu <b>dělíš</b>. Vždy si nejdřív spočítej, kolik metrů nebo kilometrů odpovídá jednomu centimetru.' },
      { h: 'Obvod a obsah', t: 'Když se útvar zvětší k-krát, jeho <b>obvod</b> se zvětší taky k-krát. Jeho <b>obsah</b> se ale zvětší <b>k²-krát</b>, protože roste na délku i na šířku. Objem těles roste dokonce k³-krát.<br><br>Dvakrát větší pizza (průměrem) je tedy čtyřikrát víc pizzy.' },
    ],
    u: [[po_pomer, po_strana, po_meritko1, po_uhel, po_poznej], [po_neznama, po_meritko2, po_meritkoUrci, po_stin, po_obvod, po_veta], [po_obsah, po_planObsah, po_pricka, po_fotka, po_vez, po_model]],
    rychle: [po_pomer, po_uhel, po_poznej, po_meritko1] },
  { id: '902', nazev: 'Goniometrické funkce', ikona: '∡', popis: 'Sinus, kosinus a tangens v pravoúhlém trojúhelníku', strazce: 'Sinusák',
    vyklad: [
      { h: 'Strany podle úhlu', t: 'V pravoúhlém trojúhelníku si vyber jeden ostrý úhel, třeba α. Podle něj dostanou odvěsny jména:<br><br><b>Protilehlá odvěsna</b> leží naproti úhlu α.<br><b>Přilehlá odvěsna</b> z úhlu α vychází.<br><b>Přepona</b> leží naproti pravému úhlu.', fig: () => fRightTri(4, 5.2, { la: 'protilehlá', lb: 'přilehlá', lc: 'přepona', alpha: 'α' }) },
      { h: 'Tři poměry', t: 'Ve všech pravoúhlých trojúhelnících se stejným úhlem α jsou poměry stran stejné (jsou podobné). Proto mají ty poměry jména:<br><br><b>sin α = protilehlá : přepona</b><br><b>cos α = přilehlá : přepona</b><br><b>tg α = protilehlá : přilehlá</b><br><br>Hodnoty najdeš na kalkulačce (tlačítka sin, cos, tan). Kalkulačka musí být přepnutá na stupně (DEG).' },
      { h: 'Výpočet strany', t: 'Znáš úhel a jednu stranu, hledáš druhou. Vyber funkci, ve které jsou právě ty dvě strany.<br><br>Příklad: přepona c = 10 cm, α = 30°, hledáme protilehlou odvěsnu a.<br>sin α = a : c, takže a = c · sin α = 10 · 0,5 = 5 cm.', fig: () => fRightTri(5, 8.66, { la: 'a', lc: '10 cm', alpha: '30°' }) },
      { h: 'Výpočet úhlu', t: 'Znáš dvě strany, hledáš úhel. Spočítej jejich poměr a kalkulačka ti k němu úhel najde: tlačítka sin⁻¹, cos⁻¹, tan⁻¹ (obvykle SHIFT a pak sin, cos, tan).<br><br>Příklad: a = 3 cm, c = 6 cm. sin α = 3 : 6 = 0,5, takže α = 30°.' },
      { h: 'Jak vybrat funkci', t: 'Podívej se, které dvě strany v úloze vystupují:<br>• protilehlá a přepona → <b>sinus</b>,<br>• přilehlá a přepona → <b>kosinus</b>,<br>• obě odvěsny → <b>tangens</b>.<br><br>V úlohách z praxe si vždy načrtni pravoúhlý trojúhelník a označ, co znáš.' },
    ],
    u: [[g_pojem, g_definice, g_pomer, g_kalkulacka, g_stranaSin], [g_stranaCos, g_stranaTg, g_prepona, g_uhelSin, g_uhelTg, g_kterou], [g_zebrik, g_stoupani, g_vez, g_rovnoramenny, g_uhlopricka, g_lanovka]],
    rychle: [g_definice, g_kterou, po_uhel] },
  { id: '903', nazev: 'Jehlan, kužel, koule', ikona: '▲', popis: 'Objem a povrch těles se špičkou a koule', strazce: 'Špičák',
    vyklad: [
      { h: 'Jehlan', t: '<b>Jehlan</b> má jednu podstavu (mnohoúhelník) a hlavní vrchol. Boční stěny jsou trojúhelníky, které se ve vrcholu sbíhají. <b>Výška</b> vede kolmo z vrcholu na podstavu.<br><br>Pravidelný čtyřboký jehlan má za podstavu čtverec, vypadá jako pyramida.', fig: () => fPyr(6, 7, { la: 'a', lh: 'v' }) },
      { h: 'Objem je třetina', t: 'Jehlan má přesně třetinu objemu hranolu se stejnou podstavou a výškou:<br><br><b>V = S<sub>p</sub> · v : 3</b><br><br>Stejně to platí pro kužel a válec:<br><br><b>V = π · r² · v : 3</b>', fig: () => fCone(3, 6, { lr: 'r', lh: 'v', ls: 's' }) },
      { h: 'Povrch jehlanu', t: 'Povrch = podstava + plášť. Plášť pravidelného čtyřbokého jehlanu tvoří čtyři stejné trojúhelníky. Jejich výška se jmenuje <b>stěnová výška w</b> a není stejná jako výška jehlanu.<br><br><b>S = a² + 4 · (a · w : 2)</b><br><br>Když stěnovou výšku neznáš, dopočítáš ji Pythagorovou větou z výšky jehlanu a poloviny podstavné hrany.', fig: () => fPyr(6, 7, { la: 'a', lw: 'w' }) },
      { h: 'Povrch kužele', t: '<b>Strana kužele s</b> vede ze špičky šikmo po plášti k okraji podstavy. S poloměrem a výškou tvoří pravoúhlý trojúhelník: <b>s² = r² + v²</b>.<br><br>Plášť: <b>S<sub>pl</sub> = π · r · s</b><br>Povrch: <b>S = π · r² + π · r · s</b>' },
      { h: 'Koule', t: 'Koule je určená jen poloměrem r.<br><br>Povrch: <b>S = 4 · π · r²</b> (čtyři kruhy)<br>Objem: <b>V = 4/3 · π · r³</b><br><br>U objemu je poloměr na třetí. Dvakrát větší koule má tedy osmkrát větší objem.', fig: () => fSphere(4, { lr: 'r' }) },
    ],
    u: [[j_objemSp, j_objemCtv, k_objem, ko_povrch, j_pojem], [j_povrch, k_strana, k_plast, k_povrch, ko_objem, j_vyskaZObjemu, ko_polokoule], [j_stenova, k_povrchZV, ko_kulicky, k_kornout, j_pyramida, ko_mic]],
    rychle: [j_objemSp, j_pojem, s_pojmy] },
  { id: '904', nazev: 'Souhrn k přijímačkám', ikona: '✓', popis: 'Opakování napříč ročníky a složené úlohy', strazce: 'Zkoušák',
    vyklad: [
      { h: 'Jak na složené úlohy', t: 'Úlohy u přijímacích zkoušek většinou spojují několik témat. Postupuj vždy stejně:<br><b>1.</b> Přečti zadání dvakrát. Na co přesně se ptají?<br><b>2.</b> Udělej si náčrtek a zapiš, co znáš.<br><b>3.</b> Najdi v náčrtku známé útvary: pravoúhlý trojúhelník, kruh, obdélník.<br><b>4.</b> Počítej po krocích a zapisuj mezivýsledky.' },
      { h: 'Jednotky', t: 'Nejčastější chyba je v jednotkách. Před výpočtem převeď všechno na stejné.<br><br>Délky se převádějí po desítkách (1 m = 100 cm).<br>Obsahy po stovkách (1 m² = 10 000 cm², 1 ha = 10 000 m²).<br>Objemy po tisících (1 m³ = 1000 l, 1 l = 1 dm³).' },
      { h: 'Vzorce, které musíš znát', t: 'Trojúhelník S = a · v : 2 · rovnoběžník S = a · v · lichoběžník S = (a + c) · v : 2<br>Kruh S = π · r², o = 2 · π · r<br>Hranol a válec V = S<sub>p</sub> · v · jehlan a kužel V = S<sub>p</sub> · v : 3<br>Koule V = 4/3 · π · r³, S = 4 · π · r²<br>Pythagorova věta c² = a² + b²' },
      { h: 'Kontrola výsledku', t: 'Na konci se zeptej: dává výsledek smysl? Přepona musí být delší než odvěsna. Místnost nemá objem 5 cm³. Když zdvojnásobíš rozměry, obsah vyjde čtyřikrát a objem osmkrát větší. Odhad odhalí většinu chyb dřív než zkoušející.' },
    ],
    u: [[...MIX6.u1, ...MIX7.u1, ...MIX8.u1, po_strana, k_objem, s_pojmy], [...MIX6.u2, ...MIX7.u2, ...MIX8.u2, po_neznama, g_stranaSin, k_povrch], [s_okno, s_mnohouhelnik, s_bazen, s_procenta, s_kouleVeValci, s_mapaPlocha, s_vyskaNaPreponu]],
    rychle: [s_pojmy, ...MIX8.u1.slice(0, 2), ...MIX7.u1.slice(0, 2)] },
] };
