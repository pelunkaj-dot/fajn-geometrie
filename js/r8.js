// 8. ročník: Pythagorova věta, kruh a kružnice, tečna a Thaletova kružnice, válec, konstrukční úlohy.
import { ri, pick, chance, shuffle, cz, rd } from './util.js';
import { N, C, K, pia, PI_T } from './ulohy.js';
import { fRightTri, fRect, fTri, fCircle, fTangent, fCyl } from './fig.js';
import { nacrtekSvg, kSvg, kProved } from './kon.js';
import { cm, cm2, cm3, st, B, SUB } from './pom.js';

const TROJICE = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
function trojice(max = 3) { const [a, b, c] = pick(TROJICE.slice(0, 4)), k = ri(1, max); return chance(0.5) ? [a * k, b * k, c * k] : [b * k, a * k, c * k]; }
const odm = x => rd(Math.sqrt(x), 1);
const ZAOKR = 'Výsledek zaokrouhli na jedno desetinné místo.';

// ======================= 801 PYTHAGOROVA VĚTA =======================
function p_pojem() {
  const [a, b, c] = trojice(2), kt = pick(['prepona', 'odvesny']);
  return C({
    text: 'Pravoúhlý trojúhelník ABC má pravý úhel u vrcholu C.', q: kt === 'prepona' ? 'Která strana je přepona?' : 'Které strany jsou odvěsny?', fig: fRightTri(a, b, { la: 'a', lb: 'b', lc: 'c' }),
    ok: kt === 'prepona' ? 'strana c' : 'strany a, b', opts: kt === 'prepona' ? ['strana a', 'strana b', 'strana c'] : ['strany a, b', 'strany a, c', 'strany b, c'],
    hints: ['Najdi v obrázku pravý úhel. Je označený malým čtverečkem.', 'Dvě strany, které pravý úhel svírají, jsou odvěsny. Třetí strana leží naproti pravému úhlu a jmenuje se přepona.', 'Přepona je vždy nejdelší strana.'],
    steps: ['Odvěsny a, b svírají pravý úhel. Přepona c leží naproti němu.'],
  });
}
function p_ctverce() {
  const [a, b] = trojice(2);
  return N({
    text: `Čtverce sestrojené nad odvěsnami (dvěma kratšími stranami u pravého úhlu) pravoúhlého trojúhelníku mají obsahy ${B(cm2(a * a))} a ${B(cm2(b * b))}.`, q: 'Jaký obsah má čtverec nad přeponou (nejdelší stranou, naproti pravému úhlu)?', ans: a * a + b * b, unit: 'cm²',
    hints: ['Nad každou stranou pravoúhlého trojúhelníku si představ čtverec.', 'Pythagorova věta: čtverec nad přeponou má stejný obsah jako oba čtverce nad odvěsnami dohromady.', `${a * a} + ${b * b}`], steps: ['c² = a² + b²', `c² = ${a * a} + ${b * b} = ${cm2(a * a + b * b)}`],
  });
}
function p_mocniny() {
  if (chance(0.5)) { const x = ri(4, 15); return N({ text: `Druhá mocnina čísla ${B(x)}.`, q: `Kolik je ${x}²?`, ans: x * x, traps: [[2 * x, `${x}² znamená ${x} · ${x}, ne ${x} · 2.`]], hints: ['Druhá mocnina znamená vynásobit číslo samo sebou.', `${x}² = ${x} · ${x}`, 'Je to obsah čtverce se stranou ' + x + '.'], steps: [`${x}² = ${x} · ${x} = ${x * x}`] }); }
  const x = ri(4, 15);
  return N({ text: `Druhá odmocnina z čísla ${B(x * x)}.`, q: `Kolik je √${x * x}?`, ans: x, traps: [[x * x / 2, 'Odmocnina není polovina. Hledáme číslo, které vynásobené samo sebou dá ' + x * x + '.']], hints: ['Odmocnina je opak druhé mocniny.', `Hledáme číslo, které vynásobené samo sebou dá ${x * x}.`, 'Je to strana čtverce, který má obsah ' + x * x + '.'], steps: [`${x} · ${x} = ${x * x}, proto √${x * x} = ${x}`] });
}
function p_prepona() {
  const [a, b, c] = trojice();
  return N({
    text: `Pravoúhlý trojúhelník má odvěsny (dvě kratší strany u pravého úhlu) ${B(cm(a))} a ${B(cm(b))}.`, q: 'Jak dlouhá je přepona?', fig: fRightTri(a, b, { la: cm(a), lb: cm(b), lc: '?' }), ans: c, unit: 'cm',
    traps: [[a + b, 'Strany se nesčítají. Sčítají se jejich druhé mocniny.'], [a * a + b * b, 'To je c². Ještě odmocni.']],
    hints: ['Pro pravoúhlý trojúhelník platí Pythagorova věta.', 'c² = a² + b². Sečti druhé mocniny odvěsen a výsledek odmocni.', `c² = ${a}² + ${b}² = ${a * a} + ${b * b}`], steps: ['c² = a² + b²', `c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}`, `c = √${a * a + b * b} = ${cm(c)}`],
  });
}
function p_odvesna() {
  const [a, b, c] = trojice();
  return N({
    text: `Pravoúhlý trojúhelník má přeponu (nejdelší stranu, naproti pravému úhlu) ${B(cm(c))} a jednu odvěsnu (kratší stranu u pravého úhlu) ${B(cm(a))}.`, q: 'Jak dlouhá je druhá odvěsna?', fig: fRightTri(a, b, { la: cm(a), lb: '?', lc: cm(c) }), ans: b, unit: 'cm',
    traps: [[c - a, 'Strany se neodčítají. Odčítají se jejich druhé mocniny.'], [c * c - a * a, 'To je b². Ještě odmocni.'], [odm(c * c + a * a), 'Při výpočtu odvěsny se odčítá: b² = c² − a².']],
    hints: ['Z Pythagorovy věty c² = a² + b² vyjádříme odvěsnu.', 'b² = c² − a². Od druhé mocniny přepony odečti druhou mocninu odvěsny a odmocni.', `b² = ${c}² − ${a}² = ${c * c} − ${a * a}`], steps: ['b² = c² − a²', `b² = ${c}² − ${a}² = ${c * c} − ${a * a} = ${b * b}`, `b = √${b * b} = ${cm(b)}`],
  });
}
// --- úroveň 2 ---
function netrojice() { for (;;) { const a = ri(2, 12), b = ri(2, 12), s = a * a + b * b; if (a !== b && Math.sqrt(s) % 1 > 0.05 && Math.sqrt(s) % 1 < 0.95) return [a, b, s]; } }
function p_preponaDec() {
  const [a, b, s] = netrojice();
  return N({
    text: `Pravoúhlý trojúhelník má odvěsny (dvě kratší strany u pravého úhlu) ${B(cm(a))} a ${B(cm(b))}.`, q: 'Jak dlouhá je přepona? ' + ZAOKR, fig: fRightTri(a, b, { la: cm(a), lb: cm(b), lc: '?' }), ans: odm(s), dec: 1, unit: 'cm',
    traps: [[a + b, 'Strany se nesčítají. Sčítají se jejich druhé mocniny.'], [s, 'To je c². Ještě odmocni.']],
    hints: ['c² = a² + b²', 'Odmocninu spočítej na kalkulačce a zaokrouhli.'], steps: [`c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${s}`, `c = √${s} ≐ ${cm(odm(s))}`],
  });
}
function p_odvesnaDec() {
  let a, c, s; do { a = ri(3, 10); c = a + ri(2, 7); s = c * c - a * a; } while (Math.sqrt(s) % 1 < 0.05 || Math.sqrt(s) % 1 > 0.95);
  return N({
    text: `Pravoúhlý trojúhelník má přeponu (nejdelší stranu, naproti pravému úhlu) ${B(cm(c))} a jednu odvěsnu (kratší stranu u pravého úhlu) ${B(cm(a))}.`, q: 'Jak dlouhá je druhá odvěsna? ' + ZAOKR, ans: odm(s), dec: 1, unit: 'cm',
    traps: [[odm(c * c + a * a), 'Při výpočtu odvěsny se odčítá: b² = c² − a².'], [c - a, 'Odčítají se druhé mocniny, ne strany.']],
    hints: ['b² = c² − a²', 'Odmocninu spočítej na kalkulačce a zaokrouhli.'], steps: [`b² = ${c}² − ${a}² = ${c * c} − ${a * a} = ${s}`, `b = √${s} ≐ ${cm(odm(s))}`],
  });
}
function p_obracena() {
  const ano = chance(0.5); let [a, b, c] = trojice(2); if (!ano) c += pick([-1, 1]);
  const s = shuffle([a, b, c]), mx = Math.max(a, b, c), os = [a, b, c].filter(x => x !== mx).concat([a, b, c].filter(x => x === mx).slice(1));
  return C({
    text: `Trojúhelník má strany ${B(s.map(cm).join(', '))}.`, q: 'Je pravoúhlý?', ok: ano ? 'Ano' : 'Ne', opts: ['Ano', 'Ne'],
    hints: ['Kdyby byl pravoúhlý, musela by pro něj platit Pythagorova věta.', 'Vezmi nejdelší stranu jako přeponu a ověř, jestli c² = a² + b².'],
    steps: [`Nejdelší strana: ${mx}² = ${mx * mx}`, `Zbylé dvě: ${os[0]}² + ${os[1]}² = ${os[0] * os[0]} + ${os[1] * os[1]} = ${os[0] * os[0] + os[1] * os[1]}`, ano ? 'Rovná se → trojúhelník je pravoúhlý.' : 'Nerovná se → trojúhelník pravoúhlý není.'],
  });
}
function p_uhlopricka() {
  const [a, b, s] = chance(0.4) ? (() => { const t = trojice(2); return [t[0], t[1], t[2] * t[2]]; })() : netrojice(), cel = Number.isInteger(Math.sqrt(s));
  return N({
    text: `Obdélník má strany ${B(cm(a))} a ${B(cm(b))}.`, q: 'Jak dlouhá je jeho úhlopříčka (spojnice protějších vrcholů)?' + (cel ? '' : ' ' + ZAOKR), fig: fRect(a, b, { la: cm(a), lb: cm(b), diag: '?' }), ans: cel ? Math.sqrt(s) : odm(s), dec: cel ? null : 1, unit: 'cm',
    traps: [[a + b, 'Strany se nesčítají. Sčítají se jejich druhé mocniny.']],
    hints: ['Úhlopříčka rozdělí obdélník na dva pravoúhlé trojúhelníky. Je jejich přeponou.', 'u² = a² + b²'], steps: [`u² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${s}`, `u = √${s} ${cel ? '=' : '≐'} ${cm(cel ? Math.sqrt(s) : odm(s))}`],
  });
}
function p_ctverecUhl() {
  const a = ri(3, 12), s = 2 * a * a;
  return N({
    text: `Čtverec má stranu ${B(cm(a))}.`, q: 'Jak dlouhá je jeho úhlopříčka (spojnice protějších vrcholů)? ' + ZAOKR, fig: fRect(a, a, { la: cm(a), diag: '?' }), ans: odm(s), dec: 1, unit: 'cm',
    traps: [[2 * a, 'Úhlopříčka není dvojnásobek strany. Použij Pythagorovu větu.']],
    hints: ['Úhlopříčka čtverce je přepona pravoúhlého trojúhelníku, jehož obě odvěsny jsou strany čtverce.', 'u² = a² + a²'], steps: [`u² = ${a}² + ${a}² = ${s}`, `u = √${s} ≐ ${cm(odm(s))}`],
  });
}
const ROVNORAM = [[6, 5, 4], [10, 13, 12], [16, 10, 6], [12, 10, 8], [24, 13, 5], [30, 17, 8], [16, 17, 15], [18, 15, 12]];
function p_rovnoram() {
  const [z, r, v] = pick(ROVNORAM);
  return N({
    text: `Rovnoramenný trojúhelník má základnu (stranu, která není rameno) ${B(cm(z))} a ramena ${B(cm(r))}.`, q: 'Jak dlouhá je výška na základnu?', fig: fTri([[0, 0], [z, 0], [z / 2, v]], { sides: [cm(z), cm(r), ''], h: { from: 2, lab: '?' }, names: null }), ans: v, unit: 'cm',
    traps: [[odm(r * r - z * z > 0 ? r * r - z * z : 0), 'Výška půlí základnu. V pravoúhlém trojúhelníku je odvěsnou jen polovina základny.']],
    hints: ['Výška na základnu rozdělí rovnoramenný trojúhelník na dva shodné pravoúhlé trojúhelníky.', `V každém z nich je přeponou rameno (${r} cm) a jednou odvěsnou polovina základny (${z / 2} cm).`], steps: [`Polovina základny: ${z} : 2 = ${cm(z / 2)}`, `v² = ${r}² − ${z / 2}² = ${r * r} − ${z * z / 4} = ${v * v}`, `v = √${v * v} = ${cm(v)}`],
  });
}
// --- úroveň 3 ---
function p_zebrik() {
  const [d, x, h] = pick([[2.5, 0.7, 2.4], [6.5, 2.5, 6], [5, 1.4, 4.8], [5, 3, 4], [2.6, 1, 2.4], [3.9, 1.5, 3.6], [8.5, 1.3, 8.4], [4.1, 0.9, 4], [7.5, 2.1, 7.2]]);
  return N({
    text: `Žebřík dlouhý ${cz(d)} m je opřený o svislou zeď. Jeho pata stojí na vodorovné zemi ${cz(x)} m od zdi.`, q: 'Do jaké výšky žebřík na zdi dosahuje?', ans: h, unit: 'm', units: 1,
    traps: [[rd(d - x, 2), 'Délky se neodčítají přímo. Žebřík, zeď a zem tvoří pravoúhlý trojúhelník.']],
    hints: ['Žebřík je přepona pravoúhlého trojúhelníku. Zeď a zem jsou odvěsny.'], steps: [`v² = ${cz(d)}² − ${cz(x)}² = ${cz(d * d)} − ${cz(x * x)} = ${cz(h * h)}`, `v = √${cz(h * h)} = ${cz(h)} m`],
  });
}
function p_kosoctverec() {
  const [e, f, a] = pick([[6, 8, 5], [10, 24, 13], [16, 30, 17], [12, 16, 10], [18, 24, 15], [14, 48, 25]]);
  return N({
    text: `Kosočtverec má úhlopříčky ${cm(e)} a ${cm(f)}.`, q: 'Vypočítej jeho obvod.', ans: 4 * a, unit: 'cm', units: 1,
    hints: ['Úhlopříčky kosočtverce se půlí a jsou na sebe kolmé. Rozdělí ho na čtyři shodné pravoúhlé trojúhelníky.'], steps: [`Poloviny úhlopříček: ${e / 2} cm a ${f / 2} cm`, `a² = ${e / 2}² + ${f / 2}² = ${e * e / 4} + ${f * f / 4} = ${a * a}`, `a = ${cm(a)}`, `o = 4 · ${a} = ${cm(4 * a)}`],
  });
}
function p_lichobeznik() {
  const [x, b, v] = pick([[3, 5, 4], [5, 13, 12], [6, 10, 8], [8, 17, 15], [9, 15, 12]]), c = ri(4, 10), a = c + 2 * x, S = (a + c) * v / 2;
  return N({
    text: `Rovnoramenný lichoběžník má základny ${cm(a)} a ${cm(c)} a ramena ${cm(b)}.`, q: 'Vypočítej jeho obsah.', ans: S, unit: 'cm²', units: 1,
    hints: ['Spusť výšky z krajních bodů kratší základny. Na delší základně odříznou po stranách dva stejné úseky a vzniknou pravoúhlé trojúhelníky.'],
    steps: [`Úsek na základně: (${a} − ${c}) : 2 = ${cm(x)}`, `v² = ${b}² − ${x}² = ${b * b} − ${x * x} = ${v * v}, v = ${cm(v)}`, `S = (${a} + ${c}) · ${v} : 2 = ${cm2(S)}`],
  });
}
function p_telesova() {
  const [a, b, c, u] = pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 10, 11, 15], [8, 9, 12, 17], [2, 5, 14, 15]]), k = ri(1, 2), r = shuffle([a * k, b * k, c * k]);
  return N({
    text: `Kvádr má rozměry ${r[0]} cm, ${r[1]} cm a ${r[2]} cm.`, q: 'Jak dlouhá je jeho tělesová úhlopříčka (spojnice dvou protějších vrcholů skrz těleso)?', ans: u * k, unit: 'cm', units: 1,
    hints: ['Nejdřív spočítej úhlopříčku podstavy. Ta je s výškou kvádru odvěsnou dalšího pravoúhlého trojúhelníku, jehož přeponou je tělesová úhlopříčka.'],
    steps: [`Úhlopříčka podstavy: u₁² = ${r[0]}² + ${r[1]}² = ${r[0] * r[0] + r[1] * r[1]}`, `Tělesová úhlopříčka: u² = u₁² + ${r[2]}² = ${r[0] * r[0] + r[1] * r[1]} + ${r[2] * r[2]} = ${u * u * k * k}`, `u = √${u * u * k * k} = ${cm(u * k)}`],
  });
}
function p_stozar() {
  const [x, y, c] = trojice(2), a = Math.min(x, y), b = Math.max(x, y);
  return N({
    text: `Svislý stožár vysoký ${b} m je ukotvený lanem dlouhým ${c} m. Lano vede z vrcholu stožáru k zemi.`, q: 'Jak daleko od paty stožáru je lano ukotvené?', ans: a, unit: 'm', units: 1,
    hints: ['Stožár, zem a lano tvoří pravoúhlý trojúhelník. Lano je přepona.'], steps: [`x² = ${c}² − ${b}² = ${c * c} − ${b * b} = ${a * a}`, `x = √${a * a} = ${a} m`],
  });
}
function p_lod() {
  const [a, b, s] = netrojice();
  return N({
    text: `Loď vyplula z přístavu, plula ${a} km přímo na sever a potom ${b} km přímo na východ.`, q: 'Jak daleko je vzdušnou čarou od přístavu? Zaokrouhli přesně na jedno desetinné místo.', ans: odm(s), dec: 1, unit: 'km', units: 1,
    hints: ['Sever a východ svírají pravý úhel. Vzdálenost od přístavu je přepona.'], steps: [`d² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${s}`, `d = √${s} ≐ ${cz(odm(s))} km`],
  });
}

// ======================= 802 KRUH A KRUŽNICE =======================
function kr_pojmy() {
  const r = 4, kt = pick(['r', 'd', 't']);
  return C({
    text: 'Na obrázku je kružnice se středem S a modře vyznačená úsečka.', q: 'Jak se ta úsečka jmenuje?', fig: kt === 'r' ? fCircle(r, { lr: '' }) : kt === 'd' ? fCircle(r, { ld: '' }) : fCircle(r, { chord: { v: 2.2, jen: 1 } }),
    ok: { r: 'poloměr', d: 'průměr', t: 'tětiva' }[kt], opts: ['poloměr', 'průměr', 'tětiva'],
    hints: ['Všímej si, jestli úsečka prochází středem a kde končí.', 'Poloměr vede ze středu na kružnici. Průměr spojuje dva body kružnice a prochází středem. Tětiva spojuje dva body kružnice a středem procházet nemusí.', 'Průměr je dvakrát delší než poloměr a je to nejdelší tětiva.'],
    steps: [{ r: 'Úsečka vede ze středu na kružnici: poloměr.', d: 'Úsečka spojuje dva body kružnice a prochází středem: průměr.', t: 'Úsečka spojuje dva body kružnice a neprochází středem: tětiva.' }[kt]],
  });
}
function kr_prumer() {
  const r = ri(2, 15), naD = chance(0.5);
  return N({
    text: naD ? `Kružnice má poloměr ${B(cm(r))}.` : `Kružnice má průměr ${B(cm(2 * r))}.`, q: naD ? 'Jaký má průměr?' : 'Jaký má poloměr?', ans: naD ? 2 * r : r, unit: 'cm',
    traps: naD ? [[r / 2, 'Průměr je delší než poloměr, ne kratší.']] : [[4 * r, 'Poloměr je kratší než průměr, ne delší.']],
    hints: ['Poloměr r vede ze středu na kružnici. Průměr d vede od kraje ke kraji přes střed.', 'Průměr jsou dva poloměry za sebou: d = 2 · r.', naD ? `d = 2 · ${r}` : `r = ${2 * r} : 2`], steps: [naD ? `d = 2 · r = 2 · ${r} = ${cm(2 * r)}` : `r = d : 2 = ${2 * r} : 2 = ${cm(r)}`],
  });
}
function kr_delka() {
  const r = ri(2, 12);
  return N({
    text: `Kružnice má poloměr ${B(cm(r))}.`, q: `Jaká je délka kružnice (obvod kruhu)? ${ZAOKR} ${PI_T}`, fig: fCircle(r, { lr: cm(r) }), ...pia(p => 2 * p * r), unit: 'cm',
    traps: [[rd(3.14 * r * r, 1), 'To je obsah kruhu. Délka kružnice (obvod kruhu) je o = 2 · π · r.'], [rd(3.14 * r, 1), 'Chybí dvojka: o = 2 · π · r.']],
    hints: ['Délka kružnice (obvod kruhu) je délka celé čáry dokola, jako obvod.', 'Kružnice je vždy asi 3,14krát delší než její průměr: o = π · d = 2 · π · r.', `o = 2 · 3,14 · ${r}`], steps: ['o = 2 · π · r', `o = 2 · 3,14 · ${r}`, `o ≐ ${cm(rd(6.28 * r, 1))}`],
  });
}
function kr_obsah() {
  const r = ri(2, 10);
  return N({
    text: `Kruh má poloměr ${B(cm(r))}.`, q: `Jaký má obsah? ${ZAOKR} ${PI_T}`, fig: fCircle(r, { lr: cm(r) }), ...pia(p => p * r * r), unit: 'cm²',
    traps: [[rd(6.28 * r, 1), 'To je délka kružnice (obvod kruhu). Obsah kruhu je S = π · r².'], [rd(3.14 * 4 * r * r, 1), 'Do vzorce patří poloměr, ne průměr.'], [rd(9.8596 * r * r, 1), 'Na druhou se umocňuje jen poloměr, π ne.']],
    hints: ['Obsah kruhu je plocha uvnitř kružnice.', 'S = π · r². Nejdřív umocni poloměr, pak vynásob číslem π.', `S = 3,14 · ${r}² = 3,14 · ${r * r}`], steps: ['S = π · r²', `S = 3,14 · ${r}² = 3,14 · ${r * r}`, `S ≐ ${cm2(rd(3.14 * r * r, 1))}`],
  });
}
function kr_delkaZPrumeru() {
  const d = ri(4, 30);
  return N({
    text: `Kružnice má průměr ${B(cm(d))}.`, q: `Jaká je délka kružnice (obvod kruhu)? ${ZAOKR} ${PI_T}`, ...pia(p => p * d), unit: 'cm',
    traps: [[rd(6.28 * d, 1), 'Dvojka patří k poloměru. S průměrem je vzorec o = π · d.']],
    hints: ['Číslo π říká, kolikrát je kružnice delší než její průměr.', 'o = π · d', `o = 3,14 · ${d}`], steps: ['o = π · d', `o = 3,14 · ${d} ≐ ${cm(rd(3.14 * d, 1))}`],
  });
}
// --- úroveň 2 ---
function kr_obsahZPrumeru() {
  const r = ri(2, 10), d = 2 * r;
  return N({
    text: `Kruh má průměr ${B(cm(d))}.`, q: `Jaký má obsah? ${ZAOKR} ${PI_T}`, fig: fCircle(r, { ld: cm(d) }), ...pia(p => p * r * r), unit: 'cm²',
    traps: [[rd(3.14 * d * d, 1), 'Do vzorce S = π · r² patří poloměr. Nejdřív průměr vyděl dvěma.']],
    hints: ['Vzorec pro obsah pracuje s poloměrem: S = π · r².', `r = ${d} : 2 = ${r} cm`], steps: [`r = ${d} : 2 = ${cm(r)}`, `S = 3,14 · ${r}² = 3,14 · ${r * r} ≐ ${cm2(rd(3.14 * r * r, 1))}`],
  });
}
function kr_polomerZDelky() {
  const r = ri(2, 15), o = rd(6.28 * r, 2);
  return N({
    text: `Délka kružnice (obvod kruhu) je ${B(cm(o))}.`, q: `Jaký má poloměr? ${ZAOKR} ${PI_T}`, ans: r, dec: 1, unit: 'cm',
    traps: [[2 * r, 'To je průměr. Poloměr je jeho polovina.']],
    hints: ['Ze vzorce o = 2 · π · r vyjádři poloměr.', 'r = o : (2 · π)'], steps: ['r = o : (2 · π)', `r = ${cz(o)} : (2 · 3,14) = ${cz(o)} : 6,28 = ${cm(r)}`],
  });
}
function kr_cast() {
  const r = 2 * ri(1, 5), [jm, k] = pick([['Půlkruh', 2], ['Čtvrtkruh', 4]]);
  return N({
    text: `${jm} má poloměr ${B(cm(r))}.`, q: `Jaký má obsah? ${ZAOKR} ${PI_T}`, fig: fCircle(r, { sector: 360 / k, lr: cm(r) }), ...pia(p => p * r * r / k), unit: 'cm²',
    traps: [[rd(3.14 * r * r, 1), `To je obsah celého kruhu. ${jm} je jeho ${k === 2 ? 'polovina' : 'čtvrtina'}.`]],
    hints: [`${jm} je ${k === 2 ? 'polovina' : 'čtvrtina'} kruhu.`, `Spočítej obsah celého kruhu a vyděl ${k === 2 ? 'dvěma' : 'čtyřmi'}.`], steps: [`Celý kruh: 3,14 · ${r}² = ${cz(3.14 * r * r)} cm²`, `${jm}: ${cz(3.14 * r * r)} : ${k} ≐ ${cm2(rd(3.14 * r * r / k, 1))}`],
  });
}
function kr_kolo() {
  const d = pick([40, 50, 60, 65, 70]), n = pick([10, 50, 100]);
  return N({
    text: `Kolo má průměr ${B(d + ' cm')}.`, q: `Kolik metrů ujede při ${n} otáčkách? ${ZAOKR} ${PI_T}`, ...pia(p => p * d * n / 100), unit: 'm',
    traps: [[rd(3.14 * d * n, 1), 'To jsou centimetry. Převeď na metry.']],
    hints: ['Při jedné otáčce ujede kolo tolik, kolik měří jeho obvod.', `Jedna otáčka: o = π · d. Pak vynásob počtem otáček a převeď na metry.`], steps: [`Jedna otáčka: 3,14 · ${d} = ${cz(3.14 * d)} cm`, `${n} otáček: ${cz(3.14 * d)} · ${n} = ${cz(3.14 * d * n)} cm ≐ ${cz(rd(3.14 * d * n / 100, 1))} m`],
  });
}
function kr_mezikruzi() {
  const r = ri(2, 6), R = r + ri(1, 4);
  return N({
    text: `Mezikruží je ohraničené dvěma kružnicemi se společným středem. Větší má poloměr ${B(cm(R))}, menší ${B(cm(r))}.`, q: `Jaký obsah má mezikruží? ${ZAOKR} ${PI_T}`, ...pia(p => p * (R * R - r * r)), unit: 'cm²',
    traps: [[rd(3.14 * (R - r) * (R - r), 1), 'Poloměry se nesmí odečíst předem. Odečítají se obsahy dvou kruhů.']],
    hints: ['Mezikruží je velký kruh, ze kterého je vyříznutý malý.', 'S = π · R² − π · r²'], steps: [`Velký kruh: 3,14 · ${R}² = ${cz(3.14 * R * R)} cm²`, `Malý kruh: 3,14 · ${r}² = ${cz(3.14 * r * r)} cm²`, `S = ${cz(3.14 * R * R)} − ${cz(3.14 * r * r)} ≐ ${cm2(rd(3.14 * (R * R - r * r), 1))}`],
  });
}
function kr_vysec() {
  const r = pick([3, 6, 9, 12]), al = pick([30, 45, 60, 90, 120]);
  return N({
    text: `Kruhová výseč (dílek kruhu jako kousek pizzy) má poloměr ${B(cm(r))} a středový úhel (úhel u středu kruhu) ${B(st(al))}.`, q: `Jaký má obsah? ${ZAOKR} ${PI_T}`, fig: fCircle(r, { sector: al, lsec: st(al), lr: cm(r) }), ...pia(p => p * r * r * al / 360), unit: 'cm²',
    hints: ['Výseč je část kruhu, jako dílek dortu. Celý kruh má 360°.', `Výseč zabírá ${al}/360 kruhu.`], steps: [`Celý kruh: 3,14 · ${r}² = ${cz(3.14 * r * r)} cm²`, `Výseč: ${cz(3.14 * r * r)} · ${al} : 360 ≐ ${cm2(rd(3.14 * r * r * al / 360, 1))}`],
  });
}
// --- úroveň 3 ---
function kr_zahon() {
  const d = ri(3, 9), cena = pick([120, 180, 240]);
  return N({
    text: `Kruhový záhon má průměr ${d} m. Kolem něj se položí obrubník, jeden metr stojí ${cena} Kč. ${PI_T}`, q: 'Kolik korun bude obrubník stát? Zaokrouhli přesně na celé koruny.', ...pia(p => p * d * cena, 0), unit: 'Kč',
    traps: [[rd(3.14 * d * d / 4 * cena), 'Obrubník je čára kolem záhonu. Potřebuješ délku kružnice (obvod kruhu), ne obsah.']],
    hints: ['Délka obrubníku je délka kružnice (obvod kruhu). Zadaný je průměr.'], steps: [`o = 3,14 · ${d} = ${cz(3.14 * d)} m`, `Cena: ${cz(3.14 * d)} · ${cena} ≐ ${cz(rd(3.14 * d * cena))} Kč`],
  });
}
function kr_pizza() {
  let d1, d2, c1, c2, j1, j2; do { d1 = pick([24, 28, 30, 32]); d2 = d1 + pick([8, 10, 12, 15]); c1 = 10 * ri(12, 20); c2 = 10 * ri(20, 34); j1 = c1 / (d1 * d1); j2 = c2 / (d2 * d2); } while (c2 <= c1 || Math.abs(j1 - j2) / j1 < 0.06);
  const ok = j1 < j2 ? 'menší pizza' : 'větší pizza', S1 = rd(3.14 * d1 * d1 / 4), S2 = rd(3.14 * d2 * d2 / 4);
  return C({
    text: `Menší pizza má průměr ${d1} cm a stojí ${c1} Kč. Větší pizza má průměr ${d2} cm a stojí ${c2} Kč.`, q: 'Která je výhodnější, tedy u které zaplatíš méně za 1 cm²?', ok, opts: ['menší pizza', 'větší pizza', 'vyjdou stejně'],
    hints: ['Porovnej cenu s obsahem kruhu. Obsah roste s druhou mocninou poloměru, takže o něco větší průměr znamená o hodně víc pizzy.'],
    steps: [`Menší: S = 3,14 · ${cz(d1 / 2)}² ≐ ${S1} cm², 100 cm² vyjde na ${cz(c1 / S1 * 100, 1)} Kč`, `Větší: S = 3,14 · ${cz(d2 / 2)}² ≐ ${S2} cm², 100 cm² vyjde na ${cz(c2 / S2 * 100, 1)} Kč`, `Výhodnější je ${ok}.`],
  });
}
function kr_drat() {
  const L = pick([50, 80, 100, 120, 150, 200]);
  return N({
    text: `Z drátu dlouhého ${L} cm se stočí kružnice (celý drát se spotřebuje). ${PI_T}`, q: 'Jaký poloměr bude kružnice mít? Zaokrouhli přesně na jedno desetinné místo.', ans: rd(L / 6.28, 1), alt: rd(L / 6.28, 1) === rd(L / (2 * Math.PI), 1) ? [] : [rd(L / (2 * Math.PI), 1)], dec: 1, unit: 'cm', units: 1,
    traps: [[rd(L / 3.14, 1), 'To je průměr. Poloměr je poloviční.']],
    hints: ['Délka drátu je délka kružnice (obvod kruhu). Ze vzorce o = 2 · π · r vyjádři r.'], steps: ['r = o : (2 · π)', `r = ${L} : 6,28 ≐ ${cm(rd(L / 6.28, 1))}`],
  });
}
function kr_ctverecKruh() {
  const a = 2 * ri(2, 10);
  return N({
    text: `Do čtverce o straně ${cm(a)} je vepsán kruh (dotýká se všech čtyř stran). ${PI_T}`, q: 'Kolik cm² čtverce zůstane mimo kruh? Zaokrouhli přesně na jedno desetinné místo.', ...pia(p => a * a - p * a * a / 4), unit: 'cm²', units: 1,
    traps: [[rd(a * a - 3.14 * a * a, 1) > 0 ? rd(a * a - 3.14 * a * a, 1) : -1, 'Poloměr vepsaného kruhu je polovina strany čtverce.']],
    hints: ['Průměr vepsaného kruhu je stejný jako strana čtverce. Od obsahu čtverce odečti obsah kruhu.'], steps: [`Čtverec: ${a}² = ${a * a} cm²`, `Kruh: r = ${a / 2} cm, S = 3,14 · ${a / 2}² = ${cz(3.14 * a * a / 4)} cm²`, `Zbytek: ${a * a} − ${cz(3.14 * a * a / 4)} ≐ ${cm2(rd(a * a - 3.14 * a * a / 4, 1))}`],
  });
}
function kr_draha() {
  const rov = pick([80, 90, 100, 110]), d = pick([50, 60, 70]);
  return N({
    text: `Běžecký ovál tvoří dvě rovinky dlouhé ${rov} m a dva půlkruhové oblouky o průměru ${d} m. ${PI_T}`, q: 'Jak dlouhé je jedno kolo? Zaokrouhli přesně na jedno desetinné místo.', ...pia(p => 2 * rov + p * d), unit: 'm', units: 1,
    traps: [[rd(2 * rov + 3.14 * d / 2, 1), 'Oblouky jsou dva. Dva půlkruhy dají dohromady celou kružnici.']],
    hints: ['Dva půlkruhové oblouky dohromady tvoří jednu celou kružnici.'], steps: [`Oblouky: 3,14 · ${d} = ${cz(3.14 * d)} m`, `Kolo: 2 · ${rov} + ${cz(3.14 * d)} ≐ ${cz(rd(2 * rov + 3.14 * d, 1))} m`],
  });
}
function kr_obsahZDelky() {
  const r = ri(2, 10), o = rd(6.28 * r, 2), a = rd(3.14 * r * r, 1), a2 = rd(o * o / (4 * Math.PI), 1);
  return N({
    text: `Délka kružnice (obvod kruhu) je ${cm(o)}. ${PI_T}`, q: 'Jaký obsah má kruh, který ohraničuje? Zaokrouhli přesně na jedno desetinné místo.', ans: a, alt: [a2, rd(Math.PI * r * r, 1)].filter(x => x !== a), dec: 1, unit: 'cm²', units: 1,
    hints: ['Z délky kružnice (obvodu kruhu) nejdřív spočítej poloměr, pak teprve obsah.'], steps: [`r = ${cz(o)} : 6,28 = ${cm(r)}`, `S = 3,14 · ${r}² ≐ ${cm2(a)}`],
  });
}

// ======================= 803 KRUŽNICE, TEČNA, THALETOVA KRUŽNICE =======================
function pk_primka() {
  const r = ri(3, 9), typ = ri(0, 2), v = typ === 0 ? ri(1, r - 1) : typ === 1 ? r : r + ri(1, 4), ok = ['sečna', 'tečna', 'vnější přímka'][typ];
  return C({
    text: `Kružnice má poloměr ${B(cm(r))}. Přímka p je od jejího středu vzdálená ${B(cm(v))}.`, q: 'Jakou polohu má přímka vůči kružnici?', ok, opts: ['sečna', 'tečna', 'vnější přímka'],
    hints: ['Porovnej vzdálenost přímky od středu s poloměrem.', 'Blíž než poloměr: přímka kružnici protne ve dvou bodech (sečna). Přesně na poloměr: dotkne se v jednom bodě (tečna). Dál: mine ji (vnější přímka).', `${v} cm ${v < r ? 'je méně než' : v === r ? 'je přesně' : 'je víc než'} ${r} cm.`],
    steps: [`${cm(v)} ${v < r ? '<' : v === r ? '=' : '>'} ${cm(r)} → ${ok}`],
  });
}
function pk_spolecne() {
  const [co, n] = pick([['Tečna', 1], ['Sečna', 2], ['Vnější přímka', 0]]);
  return N({
    text: `${co} kružnice.`, q: 'Kolik má s kružnicí společných bodů?', ans: n,
    hints: ['Sečna kružnici „seká“, tečna se jí jen „tkne“ (dotkne), vnější přímka jde mimo.', 'Sečna má dva společné body, tečna jeden, vnější přímka žádný.', co === 'Tečna' ? 'Tečna se kružnice dotýká v jediném bodě, bodu dotyku.' : co === 'Sečna' ? 'Sečna vejde do kružnice a zase z ní vyjde.' : 'Vnější přímka kružnici mine.'],
    steps: [`${co}: ${n === 1 ? '1 společný bod' : n === 2 ? '2 společné body' : 'žádný společný bod'}.`],
  });
}
function pk_thales1() {
  const a = ri(20, 70);
  return N({
    text: `Úsečka AB je průměr kružnice. Bod C leží na kružnici. Úhel u vrcholu A v trojúhelníku ABC má ${B(st(a))}.`, q: 'Jak velký je úhel u vrcholu B?', fig: (() => { const r = 4, C2 = [r * Math.cos(2 * a * Math.PI / 180), r * Math.sin(2 * a * Math.PI / 180)]; return fTri([[-r, 0], [r, 0], C2], { angs: [st(a), '?', ''], right: 2 }); })(), ans: 90 - a, unit: '°',
    traps: [[180 - a, 'Úhel u vrcholu C je pravý. Nezapomeň ho odečíst.']],
    hints: ['Thaletova věta: když je AB průměr kružnice a C leží na kružnici, je úhel u vrcholu C vždy pravý.', 'Trojúhelník ABC je tedy pravoúhlý. Na úhly u A a B zbývá dohromady 90°.', `90° − ${st(a)}`], steps: ['Podle Thaletovy věty je úhel u vrcholu C pravý.', `Úhel u B: 90° − ${st(a)} = ${st(90 - a)}`],
  });
}
function pk_pojem() {
  const [q, ok, bad] = pick([
    ['Úsečka, která spojuje dva body kružnice, se jmenuje…', 'tětiva', ['tečna', 'poloměr', 'sečna']],
    ['Nejdelší tětiva kružnice je…', 'průměr', ['poloměr', 'tečna', 'oblouk']],
    ['Tečna svírá s poloměrem v bodě dotyku úhel…', '90°', ['45°', '60°', '180°']],
    ['Bod, ve kterém se tečna dotýká kružnice, se jmenuje…', 'bod dotyku', ['střed', 'průsečík tětiv', 'vrchol']],
  ]);
  return C({ text: q, q: 'Doplň.', ok, bad, hints: ['Tětiva je úsečka uvnitř kružnice, tečna je přímka, která se kružnice jen dotýká.', 'Tečna je vždy kolmá na poloměr, který vede do bodu dotyku.', 'Průměr je tětiva, která prochází středem.'], steps: [`${q.replace('…', '')} ${ok}.`] });
}
function pk_thalesFakt() {
  return C(pick([
    { text: 'Bod C leží na kružnici s průměrem AB (a není to bod A ani B).', q: 'Jaký je trojúhelník ABC?', ok: 'pravoúhlý, pravý úhel je u vrcholu C', bad: ['rovnostranný', 'tupoúhlý', 'pravoúhlý, pravý úhel je u vrcholu A'], steps: ['Thaletova věta: úhel nad průměrem je pravý.'], hints: ['Zkus si to nakreslit pro několik různých bodů C.', 'Platí Thaletova věta.', 'Každý úhel, jehož vrchol leží na kružnici a ramena procházejí konci průměru, je pravý.'] },
    { text: 'Hledáme všechny body, ze kterých je úsečka AB vidět pod pravým úhlem.', q: 'Kde leží?', ok: 'na kružnici s průměrem AB', bad: ['na ose úsečky AB', 'na kružnici se středem A a poloměrem |AB|', 'na přímce AB'], steps: ['Je to Thaletova kružnice: střed má ve středu úsečky AB a poloměr je polovina |AB|.'], hints: ['„Vidět pod pravým úhlem“ znamená, že úhel ACB je pravý.', 'Vzpomeň si na Thaletovu větu a obrať ji.', 'Všechny takové body tvoří kružnici nad průměrem AB (bez bodů A a B).'] },
  ]));
}
function pk_dveKruznice() {
  let r1, r2; do { r1 = ri(3, 8); r2 = ri(2, 6); } while (r1 <= r2);
  const typ = ri(0, 4), s = [r1 + r2 + ri(1, 4), r1 + r2, ri(r1 - r2 + 1, r1 + r2 - 1), r1 - r2, r1 - r2 > 1 ? ri(1, r1 - r2 - 1) : 0][typ];
  if (typ === 4 && s === 0) return pk_dveKruznice();
  const moz = ['leží vně sebe, nemají společný bod', 'dotýkají se zvenku (vnější dotyk)', 'protínají se ve dvou bodech', 'dotýkají se zevnitř (vnitřní dotyk)', 'menší leží uvnitř větší, nemají společný bod'];
  return C({
    text: `Dvě kružnice mají poloměry ${B(cm(r1))} a ${B(cm(r2))}. Jejich středy jsou od sebe ${B(cm(s))}.`, q: 'Jakou mají vzájemnou polohu?', ok: moz[typ], opts: moz,
    hints: ['Vzdálenost středů porovnej se součtem a s rozdílem poloměrů.', `Součet poloměrů je ${r1 + r2} cm, rozdíl ${r1 - r2} cm. Mezi těmito hodnotami se kružnice protínají, přesně na nich se dotýkají.`],
    steps: [`r₁ + r₂ = ${r1 + r2} cm, r₁ − r₂ = ${r1 - r2} cm, vzdálenost středů ${s} cm`, `${s} ${['>', '=', 'je mezi', '=', '<'][typ]} ${[r1 + r2, r1 + r2, `${r1 - r2} a ${r1 + r2}`, r1 - r2, r1 - r2][typ]} → ${moz[typ]}.`],
  });
}
function pk_tecnaDelka() {
  const [x, y, d] = trojice(2), r = Math.min(x, y), t = Math.max(x, y);
  return N({
    text: `Kružnice má střed S a poloměr ${B(cm(r))}. Bod M je od středu vzdálený ${B(cm(d))}. Z bodu M vede ke kružnici tečna (přímka, která se kružnice dotkne jen v jednom bodě), bod dotyku (místo, kde se tečna kružnice dotkne) je T.`, q: 'Jak dlouhá je úsečka MT?', fig: fTangent(r, d, { lr: cm(r), ld: cm(d), lt: '?' }), ans: t, unit: 'cm',
    traps: [[d - r, 'Odčítají se druhé mocniny. Trojúhelník STM je pravoúhlý.']],
    hints: ['Tečna je kolmá na poloměr v bodě dotyku, takže trojúhelník STM má u vrcholu T pravý úhel.', 'Přeponou je SM. |MT|² = |SM|² − r²'], steps: [`|MT|² = ${d}² − ${r}² = ${d * d} − ${r * r} = ${t * t}`, `|MT| = √${t * t} = ${cm(t)}`],
  });
}
const TETIVY = [[5, 3, 4], [5, 4, 3], [10, 6, 8], [10, 8, 6], [13, 5, 12], [13, 12, 5], [17, 8, 15], [15, 9, 12], [15, 12, 9], [25, 7, 24]];
function pk_tetiva() {
  const [r, v, h] = pick(TETIVY);
  return N({
    text: `Kružnice má poloměr ${B(cm(r))}. Tětiva (úsečka, která spojuje dva body kružnice) je od středu vzdálená ${B(cm(v))}.`, q: 'Jak dlouhá je tětiva?', fig: fCircle(r, { chord: { v, lv: cm(v), lr: cm(r), lt: '' } }), ans: 2 * h, unit: 'cm',
    traps: [[h, 'To je jen polovina tětivy.']],
    hints: ['Spoj střed s koncem tětivy (to je poloměr) a se středem tětivy. Vznikne pravoúhlý trojúhelník.', 'Odvěsny: vzdálenost tětivy od středu a polovina tětivy. Přepona: poloměr.'], steps: [`(t/2)² = ${r}² − ${v}² = ${r * r} − ${v * v} = ${h * h}`, `t/2 = ${cm(h)}`, `t = 2 · ${h} = ${cm(2 * h)}`],
  });
}
function pk_opsana() {
  const [a, b, c] = trojice(2);
  return N({
    text: `Pravoúhlý trojúhelník má odvěsny (dvě kratší strany u pravého úhlu) ${B(cm(a))} a ${B(cm(b))}.`, q: 'Jaký poloměr má kružnice, která je mu opsaná?', ans: c / 2, unit: 'cm',
    traps: [[c, 'To je průměr opsané kružnice (přepona). Poloměr je poloviční.']],
    hints: ['Podle Thaletovy věty leží vrchol pravého úhlu na kružnici, jejímž průměrem je přepona.', 'Spočítej přeponu a vyděl ji dvěma.'], steps: [`c² = ${a}² + ${b}² = ${c * c}, c = ${cm(c)}`, `r = c : 2 = ${cm(c / 2)}`],
  });
}
function kon_thales(mode) {
  let c, a; do { c = 2 * ri(3, 4); a = ri(3, c - 2); } while (a === c / 2);
  return K({
    mode, tpl: 'tri', dano: { c: cm(c), a: cm(a), ga: '90°' }, sestroj: '△ABC; S = střed přepony AB', text: mode < 3 ? `Sestroj pravoúhlý trojúhelník ABC s pravým úhlem u vrcholu C: přepona (nejdelší strana, naproti pravému úhlu) c = ${B(cm(c))}, odvěsna (kratší strana u pravého úhlu) a = ${B(cm(a))}. Střed přepony označ S.` : `Sestroj pravoúhlý trojúhelník ABC s pravým úhlem u vrcholu C: přepona c = ${B(cm(c))}, odvěsna a = ${B(cm(a))}. Střed přepony označ S.`,
    plan: [{ op: 'seg', a: 'A', b: 'B', len: c }, { op: 'mid', name: 'S', a: 'A', b: 'B' }, { op: 'circ', name: 'k', c: 'S', r: { pp: ['S', 'A'] } }, { op: 'circ', name: 'l', c: 'B', r: a }, { op: 'int', name: 'C', of: ['k', 'l'] }, { op: 'poly', pts: ['A', 'B', 'C'] }],
    goal: [['dist', 'A', 'B', c], ['dist', 'B', 'C', a], ['ang', 'A', 'C', 'B', 90], ['poly', 'ABC']],
    lens: [c, a], angs: [90], names: ['S', 'C'], ops: ['seg', 'mid', 'axis', 'circ', 'int', 'poly'], vysl: ['A', 'B', 'C'],
    nsol: 1, nsolProc: 'Thaletova kružnice a kružnice l se v jedné polorovině protnou v jediném bodě. Úloha má jedno řešení.',
    hints: ['Pravý úhel u vrcholu C znamená, že bod C leží na Thaletově kružnici nad přeponou AB.', 'Thaletova kružnice má střed ve středu úsečky AB a poloměr |SA|. Bod C je navíc vzdálený a od bodu B.'],
  });
}
function kon_tecna(mode) {
  const r = ri(2, 3), d = r + ri(3, 4);
  return K({
    mode, init: [{ op: 'given', pts: { S: [0, 0], M: [d, 0] }, circs: { k: { c: 'S', r } } }],
    dano: [`k(S; ${cm(r)})`, `|SM| = ${cm(d)}`], sestroj: 'tečnu z bodu M ke kružnici k; O = střed úsečky SM, T = bod dotyku',
    text: mode < 3 ? `Je dána kružnice k(S; ${cm(r)}) a bod M, |SM| = ${cm(d)}. Sestroj tečnu (přímku, která se kružnice dotkne jen v jednom bodě) z bodu M ke kružnici k. Střed úsečky SM označ O, bod dotyku (místo, kde se tečna kružnice dotkne) T.` : `Je dána kružnice k(S; ${cm(r)}) a bod M, |SM| = ${cm(d)}. Sestroj tečnu z bodu M ke kružnici k. Střed úsečky SM označ O, bod dotyku T.`,
    plan: [{ op: 'mid', name: 'O', a: 'S', b: 'M' }, { op: 'circ', name: 'l', c: 'O', r: { pp: ['O', 'S'] } }, { op: 'int', name: 'T', of: ['l', 'k'] }, { op: 'line', a: 'M', b: 'T' }],
    goal: [['tangent', 'M', 'k']], names: ['O', 'T'], ops: ['mid', 'axis', 'perp', 'circ', 'int', 'line'],
    nsol: mode === 3 ? 2 : null, nsolOtazka: 'Kolik tečen lze z bodu M ke kružnici k vést?', nsolMoz: ['žádnou', 'jednu', 'dvě'], nsolProc: 'Thaletova kružnice protne kružnici k ve dvou bodech dotyku, tečny jsou tedy dvě.',
    hints: ['Tečna je kolmá na poloměr v bodě dotyku. Úhel STM je tedy pravý.', 'Body, ze kterých je úsečka SM vidět pod pravým úhlem, leží na Thaletově kružnici nad SM. Bod dotyku T je její průsečík s kružnicí k.'],
  });
}
function pk_vzdalenostTetivy() {
  const [r, v, h] = pick(TETIVY);
  return N({
    text: `V kružnici o poloměru ${cm(r)} je tětiva dlouhá ${cm(2 * h)}.`, q: 'Jak daleko je tětiva od středu kružnice?', ans: v, unit: 'cm', units: 1,
    hints: ['Střed kružnice, střed tětivy a konec tětivy tvoří pravoúhlý trojúhelník. Přeponou je poloměr.'], steps: [`Polovina tětivy: ${cm(h)}`, `v² = ${r}² − ${h}² = ${r * r} − ${h * h} = ${v * v}`, `v = ${cm(v)}`],
  });
}
function pk_dveTecny() {
  const [x, y, d] = trojice(2), r = Math.min(x, y), t = Math.max(x, y);
  return N({
    text: `Z bodu M vedou ke kružnici se středem S a poloměrem ${cm(r)} dvě tečny. Body dotyku jsou T₁ a T₂. Platí |SM| = ${cm(d)}.`, q: 'Vypočítej obvod čtyřúhelníku ST₁MT₂.', ans: 2 * (r + t), unit: 'cm', units: 1,
    hints: ['Čtyřúhelník tvoří dva poloměry a dva stejně dlouhé úseky tečen. Úsek tečny spočítáš z pravoúhlého trojúhelníku ST₁M.'], steps: [`|MT₁|² = ${d}² − ${r}² = ${t * t}, |MT₁| = ${cm(t)}`, `o = 2 · ${r} + 2 · ${t} = ${cm(2 * (r + t))}`],
  });
}
function pk_stredna() {
  let r1, r2; do { r1 = ri(4, 12); r2 = ri(2, 8); } while (r1 <= r2);
  const vne = chance(0.5);
  return N({
    text: `Kružnice k₁ má poloměr ${cm(r1)}, kružnice k₂ má poloměr ${cm(r2)}. Kružnice mají ${vne ? 'vnější' : 'vnitřní'} dotyk.`, q: 'Jak daleko jsou od sebe jejich středy?', ans: vne ? r1 + r2 : r1 - r2, unit: 'cm', units: 1,
    traps: [[vne ? r1 - r2 : r1 + r2, vne ? 'Při vnějším dotyku leží kružnice vedle sebe, poloměry se sčítají.' : 'Při vnitřním dotyku leží menší kružnice uvnitř větší, poloměry se odčítají.']],
    hints: ['Bod dotyku leží na spojnici středů. Nakresli si náčrtek a vyznač oba poloměry do bodu dotyku.'], steps: [vne ? `Vnější dotyk: ${r1} + ${r2} = ${cm(r1 + r2)}` : `Vnitřní dotyk: ${r1} − ${r2} = ${cm(r1 - r2)}`],
  });
}

// ======================= 804 VÁLEC =======================
function v_objemSp() {
  const S = ri(10, 80), v = ri(3, 12);
  return N({
    text: `Válec má podstavu (kruhové dno, víko je stejné) o obsahu ${B(cm2(S))} a výšku ${B(cm(v))}.`, q: 'Vypočítej jeho objem.', ans: S * v, unit: 'cm³',
    hints: ['Válec si představ jako sloupeček mincí. Každá mince má tvar podstavy.', 'Objem = obsah podstavy · výška, stejně jako u hranolu.', `V = ${S} · ${v}`], steps: ['V = S<sub>p</sub> · v', `V = ${S} · ${v} = ${cm3(S * v)}`],
  });
}
function v_podstava() {
  const r = ri(2, 8);
  return N({
    text: `Válec má poloměr podstavy (kruhového dna) ${B(cm(r))}.`, q: `Jaký obsah má jeho podstava? ${ZAOKR} ${PI_T}`, fig: fCyl(r, r * 1.6, { lr: cm(r) }), ...pia(p => p * r * r), unit: 'cm²',
    traps: [[rd(6.28 * r, 1), 'To je délka kružnice (obvod kruhu). Podstava je kruh, její obsah je π · r².']],
    hints: ['Podstavou válce je kruh.', 'Obsah kruhu: S = π · r²', `S = 3,14 · ${r}²`], steps: ['S<sub>p</sub> = π · r²', `S<sub>p</sub> = 3,14 · ${r * r} ≐ ${cm2(rd(3.14 * r * r, 1))}`],
  });
}
function v_objem() {
  const r = ri(2, 6), v = ri(3, 12);
  return N({
    text: `Válec má poloměr podstavy (kruhového dna) ${B(cm(r))} a výšku ${B(cm(v))}.`, q: `Vypočítej jeho objem. ${ZAOKR} ${PI_T}`, fig: fCyl(r, v, { lr: cm(r), lh: cm(v) }), ...pia(p => p * r * r * v), unit: 'cm³',
    traps: [[rd(6.28 * r * v, 1), 'To je obsah pláště. Objem je π · r² · v.'], [rd(3.14 * r * v, 1), 'Poloměr se umocňuje na druhou: π · r² · v.']],
    hints: ['Objem válce = obsah podstavy · výška.', 'Podstava je kruh: V = π · r² · v', `V = 3,14 · ${r}² · ${v}`], steps: ['V = π · r² · v', `V = 3,14 · ${r * r} · ${v}`, `V ≐ ${cm3(rd(3.14 * r * r * v, 1))}`],
  });
}
function v_plast() {
  const r = ri(2, 6), v = ri(3, 12);
  return N({
    text: `Válec má poloměr podstavy (kruhového dna) ${B(cm(r))} a výšku ${B(cm(v))}.`, q: `Jaký obsah má jeho plášť (boční plocha, třeba etiketa na konzervě)? ${ZAOKR} ${PI_T}`, fig: fCyl(r, v, { lr: cm(r), lh: cm(v) }), ...pia(p => 2 * p * r * v), unit: 'cm²',
    traps: [[rd(3.14 * r * r * v, 1), 'To je objem. Plášť je 2 · π · r · v.']],
    hints: ['Plášť je „etiketa“ kolem válce. Když ji rozvineš, je to obdélník.', 'Jedna strana obdélníku je délka kružnice podstavy (obvod podstavy = 2 · π · r), druhá výška válce.', `S = 2 · 3,14 · ${r} · ${v}`], steps: ['S<sub>pl</sub> = 2 · π · r · v', `S<sub>pl</sub> = 2 · 3,14 · ${r} · ${v} ≐ ${cm2(rd(6.28 * r * v, 1))}`],
  });
}
function v_pojem() {
  const [q, ok, bad] = pick([['Jaký tvar má podstava válce?', 'kruh', ['čtverec', 'elipsa', 'obdélník']], ['Jaký tvar má plášť válce rozvinutý do roviny?', 'obdélník', ['kruh', 'trojúhelník', 'kruhová výseč']], ['Kolik podstav má válec?', 'dvě', ['jednu', 'žádnou', 'tři']]]);
  return C({ text: 'Válec.', q, ok, bad, hints: ['Představ si plechovku.', 'Dno a víčko jsou podstavy, etiketa kolem je plášť.', 'Etiketa sloupnutá z plechovky a narovnaná je obdélník.'], steps: [`Správně: ${ok}.`] });
}
// --- úroveň 2 ---
function v_povrch() {
  const r = ri(2, 6), v = ri(3, 12);
  return N({
    text: `Válec má poloměr podstavy (kruhového dna) ${B(cm(r))} a výšku ${B(cm(v))}.`, q: `Vypočítej jeho povrch. ${ZAOKR} ${PI_T}`, fig: fCyl(r, v, { lr: cm(r), lh: cm(v) }), ...pia(p => 2 * p * r * (r + v)), unit: 'cm²',
    traps: [[rd(3.14 * r * r + 6.28 * r * v, 1), 'Podstavy jsou dvě.'], [rd(6.28 * r * v, 1), 'To je jen plášť. Přičti obě podstavy.']],
    hints: ['Povrch = dvě podstavy + plášť.', 'S = 2 · π · r² + 2 · π · r · v'], steps: [`Podstavy: 2 · 3,14 · ${r}² = ${cz(6.28 * r * r)} cm²`, `Plášť: 2 · 3,14 · ${r} · ${v} = ${cz(6.28 * r * v)} cm²`, `S ≐ ${cm2(rd(6.28 * r * (r + v), 1))}`],
  });
}
function v_objemD() {
  const r = ri(2, 6), v = ri(3, 12);
  return N({
    text: `Válec má průměr podstavy (kruhového dna) ${B(cm(2 * r))} a výšku ${B(cm(v))}.`, q: `Vypočítej jeho objem. ${ZAOKR} ${PI_T}`, fig: fCyl(r, v, { ld: cm(2 * r), lh: cm(v) }), ...pia(p => p * r * r * v), unit: 'cm³',
    traps: [[rd(3.14 * 4 * r * r * v, 1), 'Do vzorce patří poloměr. Průměr nejdřív vyděl dvěma.']],
    hints: ['Vzorec V = π · r² · v pracuje s poloměrem.', `r = ${2 * r} : 2 = ${r} cm`], steps: [`r = ${2 * r} : 2 = ${cm(r)}`, `V = 3,14 · ${r * r} · ${v} ≐ ${cm3(rd(3.14 * r * r * v, 1))}`],
  });
}
function v_vyskaZObjemu() {
  const r = ri(2, 6), v = ri(3, 12), V = rd(3.14 * r * r * v, 2);
  return N({
    text: `Válec má objem ${B(cm3(V))} a poloměr podstavy (kruhového dna) ${B(cm(r))}.`, q: `Jak je vysoký? ${ZAOKR} ${PI_T}`, ans: v, dec: 1, unit: 'cm',
    hints: ['V = π · r² · v. Nejdřív spočítej obsah podstavy.', 'v = V : (π · r²)'], steps: [`S<sub>p</sub> = 3,14 · ${r}² = ${cz(3.14 * r * r)} cm²`, `v = ${cz(V)} : ${cz(3.14 * r * r)} = ${cm(v)}`],
  });
}
function v_litry() {
  const r = ri(2, 5), v = ri(4, 12);
  return N({
    text: `Sud tvaru válce má vnitřní poloměr dna ${B(r + ' dm')} a výšku ${B(v + ' dm')}.`, q: `Kolik litrů se do něj vejde? ${ZAOKR} ${PI_T}`, ...pia(p => p * r * r * v), unit: 'l',
    hints: ['Objem vyjde v dm³.', '1 dm³ = 1 l'], steps: [`V = 3,14 · ${r}² · ${v} = ${cz(3.14 * r * r * v)} dm³`, `V ≐ ${cz(rd(3.14 * r * r * v, 1))} l`],
  });
}
function v_hrnec() {
  const r = ri(6, 14), v = ri(8, 20);
  return N({
    text: `Hrnec tvaru válce bez pokličky má poloměr dna ${B(cm(r))} a výšku ${B(cm(v))}.`, q: `Kolik cm² plechu je na něj potřeba? ${ZAOKR} ${PI_T}`, ...pia(p => p * r * r + 2 * p * r * v), unit: 'cm²',
    traps: [[rd(6.28 * r * (r + v), 1), 'Hrnec nemá pokličku, podstava je jen jedna.']],
    hints: ['Hrnec bez pokličky má jen jednu podstavu (dno) a plášť.', 'S = π · r² + 2 · π · r · v'], steps: [`Dno: 3,14 · ${r}² = ${cz(3.14 * r * r)} cm²`, `Plášť: 2 · 3,14 · ${r} · ${v} = ${cz(6.28 * r * v)} cm²`, `S ≐ ${cm2(rd(3.14 * r * r + 6.28 * r * v, 1))}`],
  });
}
// --- úroveň 3 ---
function v_studna() {
  const d = pick([1, 1.2, 1.6, 2]), h = pick([2, 2.5, 3, 4]);
  return N({
    text: `Studna tvaru válce má vnitřní průměr ${cz(d)} m. Voda v ní sahá do výšky ${cz(h)} m. ${PI_T}`, q: 'Kolik hektolitrů vody je ve studni? Zaokrouhli přesně na jedno desetinné místo.', ...pia(p => p * d * d / 4 * h * 10), unit: 'hl', units: 1,
    traps: [[rd(3.14 * d * d * h * 10, 1), 'Zadaný je průměr. Do vzorce patří poloměr.'], [rd(3.14 * d * d / 4 * h, 1), 'To je objem v m³. 1 m³ = 10 hl.']],
    hints: ['Z průměru urči poloměr, objem spočítej v m³. 1 m³ = 1000 l = 10 hl.'], steps: [`r = ${cz(d / 2)} m`, `V = 3,14 · ${cz(d / 2)}² · ${cz(h)} = ${cz(3.14 * d * d / 4 * h, 3)} m³`, `V ≐ ${cz(rd(3.14 * d * d / 4 * h * 10, 1))} hl`],
  });
}
function v_trubka() {
  const r = ri(2, 5), R = r + 1, L = 10 * ri(5, 20);
  return N({
    text: `Trubka je dlouhá ${L} cm. Její vnější poloměr je ${cm(R)}, vnitřní ${cm(r)}. ${PI_T}`, q: 'Kolik cm³ materiálu je v trubce? Zaokrouhli přesně na jedno desetinné místo.', ...pia(p => p * (R * R - r * r) * L), unit: 'cm³', units: 1,
    traps: [[rd(3.14 * L, 1), 'Poloměry se nesmí odečíst předem. Odečítají se objemy dvou válců.']],
    hints: ['Trubka je velký válec, ze kterého je vyvrtaný menší válec.'], steps: [`Vnější válec: 3,14 · ${R}² · ${L} = ${cz(3.14 * R * R * L)} cm³`, `Dutina: 3,14 · ${r}² · ${L} = ${cz(3.14 * r * r * L)} cm³`, `V ≐ ${cm3(rd(3.14 * (R * R - r * r) * L, 1))}`],
  });
}
function v_etiketa() {
  const d = ri(6, 12), v = ri(8, 14);
  return N({
    text: `Konzerva tvaru válce má průměr ${cm(d)} a výšku ${cm(v)}. Etiketa pokrývá celý plášť. ${PI_T}`, q: 'Kolik cm² papíru je potřeba na etiketu? Zaokrouhli přesně na jedno desetinné místo.', ...pia(p => p * d * v), unit: 'cm²', units: 1,
    traps: [[rd(6.28 * d * v, 1), 'Zadaný je průměr: délka kružnice (obvod kruhu) je π · d, ne 2 · π · d.']],
    hints: ['Etiketa je plášť válce: obdélník, jehož jedna strana je délka kružnice podstavy (obvod podstavy).'], steps: [`Délka kružnice (obvod kruhu): 3,14 · ${d} = ${cz(3.14 * d)} cm`, `S = ${cz(3.14 * d)} · ${v} ≐ ${cm2(rd(3.14 * d * v, 1))}`],
  });
}
function v_valec() {
  const d = pick([1, 1.2, 1.5]), s = pick([1.5, 2, 2.2]), n = pick([20, 50, 100]);
  return N({
    text: `Silniční válec má průměr ${cz(d)} m a šířku ${cz(s)} m. ${PI_T}`, q: `Kolik m² silnice uválí při ${n} otáčkách? Zaokrouhli přesně na jedno desetinné místo.`, ...pia(p => p * d * s * n), unit: 'm²', units: 1,
    hints: ['Při jedné otáčce uválí válec plochu, která je stejně velká jako jeho plášť.'], steps: [`Plášť: 3,14 · ${cz(d)} · ${cz(s)} = ${cz(3.14 * d * s, 3)} m²`, `${n} otáček: ${cz(3.14 * d * s, 3)} · ${n} ≐ ${cz(rd(3.14 * d * s * n, 1))} m²`],
  });
}
function v_zmena() {
  const [co, ok, proc] = pick([['poloměr podstavy zvětší dvakrát a výška se nezmění', 'čtyřikrát', 'Poloměr je ve vzorci na druhou: 2² = 4.'], ['výška zvětší dvakrát a poloměr se nezmění', 'dvakrát', 'Výška je ve vzorci jen jednou.'], ['poloměr podstavy zvětší třikrát a výška se nezmění', 'devětkrát', 'Poloměr je ve vzorci na druhou: 3² = 9.'], ['poloměr i výška zvětší dvakrát', 'osmkrát', 'Poloměr na druhou dá 4, výška další 2: 4 · 2 = 8.']]);
  return C({
    text: `Válci se ${co}.`, q: 'Kolikrát se zvětší jeho objem?', ok, opts: ['dvakrát', 'čtyřikrát', 'osmkrát', 'devětkrát'],
    hints: ['Podívej se do vzorce V = π · r² · v, kolikrát se v něm vyskytuje to, co se mění.'], steps: ['V = π · r² · v', proc, `Objem se zvětší ${ok}.`],
  });
}

// ======================= 805 KONSTRUKČNÍ ÚLOHY =======================
const TROJ_OPS = ['seg', 'par', 'ray', 'mid', 'circ', 'int', 'poly'];
function kon_vc(mode) {
  let c, vc, b; do { c = ri(6, 8); vc = ri(3, 4); b = ri(vc + 1, 6); } while (b === c || vc === b);
  return K({
    mode, tpl: 'tri', dano: { c: cm(c), vc: cm(vc), b: cm(b) }, sestroj: '△ABC', text: `Sestroj trojúhelník ABC: c = ${B(cm(c))}, ${SUB('v', 'c')} = ${B(cm(vc))}${mode < 3 ? ' (výška: kolmice z vrcholu C na stranu AB)' : ''}, b = ${B(cm(b))}.`,
    plan: [{ op: 'seg', a: 'A', b: 'B', len: c }, { op: 'par', name: 'p', to: 'AB', dist: vc }, { op: 'circ', name: 'k', c: 'A', r: b }, { op: 'int', name: 'C', of: ['p', 'k'], pick: 1 }, { op: 'poly', pts: ['A', 'B', 'C'] }],
    goal: [['dist', 'A', 'B', c], ['hgt', 'C', 'A', 'B', vc], ['dist', 'A', 'C', b], ['poly', 'ABC']],
    lens: [c, vc, b], names: ['C'], ops: TROJ_OPS, vysl: ['A', 'B', 'C'],
    nsol: 2, nsolProc: 'Kružnice k(A; b) protne rovnoběžku p ve dvou bodech a oba leží ve stejné polorovině. Úloha má dvě řešení.',
    hints: ['Výška říká, jak daleko je bod C od přímky AB. Všechny takové body leží na rovnoběžce s AB.', 'Bod C je navíc vzdálený b od bodu A, leží tedy i na kružnici k(A; b). Hledej průsečík.'],
  });
}
function kon_tc(mode) {
  let c, tc, a; do { c = 2 * ri(3, 4); tc = ri(3, 5); a = ri(3, 6); } while (Math.abs(tc - a) >= c / 2 - 0.5 || tc + a <= c / 2 + 1 || tc === a || a === c || tc === c);
  return K({
    mode, tpl: 'tri', dano: { c: cm(c), tc: cm(tc), a: cm(a) }, sestroj: '△ABC; S = střed strany AB', text: `Sestroj trojúhelník ABC: c = ${B(cm(c))}, ${SUB('t', 'c')} = ${B(cm(tc))}${mode < 3 ? ' (těžnice: spojnice vrcholu C se středem strany AB)' : ''}, a = ${B(cm(a))}. Střed strany AB označ S.`,
    plan: [{ op: 'seg', a: 'A', b: 'B', len: c }, { op: 'mid', name: 'S', a: 'A', b: 'B' }, { op: 'circ', name: 'k', c: 'S', r: tc }, { op: 'circ', name: 'l', c: 'B', r: a }, { op: 'int', name: 'C', of: ['k', 'l'] }, { op: 'poly', pts: ['A', 'B', 'C'] }],
    goal: [['dist', 'A', 'B', c], ['med', 'C', 'A', 'B', tc], ['dist', 'B', 'C', a], ['poly', 'ABC']],
    lens: [c, tc, a], names: ['S', 'C'], ops: TROJ_OPS, vysl: ['A', 'B', 'C'],
    nsol: 1, nsolProc: 'Kružnice k(S; t) a l(B; a) se v jedné polorovině protnou v jediném bodě. Úloha má jedno řešení.',
    hints: ['Těžnice spojuje vrchol C se středem S strany AB. Bod C je tedy od bodu S vzdálený právě o délku těžnice.', 'Bod C leží na kružnici k(S; t) a zároveň na kružnici l(B; a).'],
  });
}
function kon_vcAl(mode) {
  const c = ri(6, 8), vc = ri(3, 4), al = pick([40, 50, 60, 70]);
  return K({
    mode, tpl: 'tri', dano: { c: cm(c), al: st(al), vc: cm(vc) }, sestroj: '△ABC', text: `Sestroj trojúhelník ABC: c = ${B(cm(c))}, α = ${B(st(al))}, ${SUB('v', 'c')} = ${B(cm(vc))}${mode < 3 ? ' (výška: kolmice z vrcholu C na stranu AB)' : ''}.`,
    plan: [{ op: 'seg', a: 'A', b: 'B', len: c }, { op: 'ray', name: 'AX', v: 'A', to: 'B', ang: al }, { op: 'par', name: 'p', to: 'AB', dist: vc }, { op: 'int', name: 'C', of: ['AX', 'p'] }, { op: 'poly', pts: ['A', 'B', 'C'] }],
    goal: [['dist', 'A', 'B', c], ['ang', 'B', 'A', 'C', al], ['hgt', 'C', 'A', 'B', vc], ['poly', 'ABC']],
    lens: [c, vc], angs: [al], names: ['C'], ops: TROJ_OPS, vysl: ['A', 'B', 'C'],
    nsol: 1, nsolProc: 'Polopřímka AX protne rovnoběžku p v jediném bodě. Úloha má jedno řešení.',
    hints: ['Bod C leží na rameni úhlu α.', 'Zároveň je od přímky AB vzdálený o výšku, leží tedy na rovnoběžce s AB.'],
  });
}
function kon_vcTc() {
  let c, vc, tc; do { c = 2 * ri(3, 4); vc = ri(3, 4); tc = vc + ri(1, 2); } while (tc === c || vc === c);
  return K({
    mode: 3, tpl: 'tri', dano: { c: cm(c), vc: cm(vc), tc: cm(tc) }, sestroj: '△ABC; S = střed strany AB', text: `Sestroj trojúhelník ABC: c = ${B(cm(c))}, ${SUB('v', 'c')} = ${B(cm(vc))}, ${SUB('t', 'c')} = ${B(cm(tc))}. Střed strany AB označ S.`,
    plan: [{ op: 'seg', a: 'A', b: 'B', len: c }, { op: 'par', name: 'p', to: 'AB', dist: vc }, { op: 'mid', name: 'S', a: 'A', b: 'B' }, { op: 'circ', name: 'k', c: 'S', r: tc }, { op: 'int', name: 'C', of: ['p', 'k'], pick: 1 }, { op: 'poly', pts: ['A', 'B', 'C'] }],
    goal: [['dist', 'A', 'B', c], ['hgt', 'C', 'A', 'B', vc], ['med', 'C', 'A', 'B', tc], ['poly', 'ABC']],
    lens: [c, vc, tc], names: ['S', 'C'], ops: TROJ_OPS, vysl: ['A', 'B', 'C'],
    nsol: 2, nsolProc: 'Kružnice k(S; t) protne rovnoběžku p ve dvou bodech, oba leží ve stejné polorovině. Vzniknou dva trojúhelníky (jsou navzájem souměrné), úloha má dvě řešení.',
    hints: ['Výška určuje rovnoběžku s AB, na které bod C leží.', 'Těžnice určuje kružnici se středem ve středu strany AB.'],
  });
}
function mn_mnozina() {
  const [q, ok] = pick([
    ['Kde leží všechny body, které jsou od bodu S vzdálené přesně 3 cm?', 'na kružnici se středem S a poloměrem 3 cm'],
    ['Kde leží všechny body, které jsou stejně daleko od bodu A jako od bodu B?', 'na ose úsečky AB'],
    ['Kde leží všechny body, které jsou od přímky p vzdálené přesně 2 cm?', 'na dvou rovnoběžkách s přímkou p'],
    ['Kde leží všechny body uvnitř úhlu, které jsou stejně daleko od obou jeho ramen?', 'na ose úhlu'],
    ['Kde leží všechny body, ze kterých je úsečka AB vidět pod pravým úhlem?', 'na kružnici s průměrem AB'],
  ]);
  return C({
    text: 'Množiny bodů.', q, ok, opts: shuffle(['na kružnici se středem S a poloměrem 3 cm', 'na ose úsečky AB', 'na dvou rovnoběžkách s přímkou p', 'na ose úhlu', 'na kružnici s průměrem AB']),
    hints: ['Zkus si pár takových bodů v duchu nakreslit a podívej se, jakou čáru tvoří.', 'Stejná vzdálenost od jednoho bodu dává kružnici. Stejná vzdálenost od dvou bodů dává osu úsečky. Stejná vzdálenost od přímky dává rovnoběžky.', 'Pravý úhel nad úsečkou znamená Thaletovu kružnici.'], steps: [`Správně: ${ok}.`],
  });
}
function mn_prunik() {
  const a = ri(4, 7), b = ri(3, 6);
  const [q, ok, bad] = pick([
    [`Bod C má být ${a} cm od bodu A a zároveň ${b} cm od bodu B.`, `v průsečíku kružnic k(A; ${a} cm) a l(B; ${b} cm)`, [`ve středu úsečky AB`, `na ose úsečky AB`, `kdekoli na kružnici k(A; ${a} cm)`]],
    [`Bod C má být ${a} cm od bodu A a zároveň ${b} cm od přímky AB.`, `v průsečíku kružnice k(A; ${a} cm) a rovnoběžky s AB ve vzdálenosti ${b} cm`, [`v průsečíku kružnic k(A; ${a} cm) a l(B; ${b} cm)`, `na kolmici k AB v bodě A`, `na ose úsečky AB`]],
    ['Bod S má být stejně daleko od všech tří vrcholů trojúhelníku ABC.', 'v průsečíku os stran trojúhelníku', ['v průsečíku os úhlů', 'v průsečíku těžnic', 'v průsečíku výšek']],
  ]);
  return C({
    text: q, q: 'Kde ho budeme hledat?', ok, bad,
    hints: ['Každá podmínka určuje jednu čáru, na které bod leží.', 'Bod musí splnit obě podmínky najednou, leží tedy na obou čarách.', 'Hledáme průsečík dvou množin bodů.'], steps: [`Bod leží ${ok}.`],
  });
}
function mn_pocet() {
  const r = ri(3, 6), typ = ri(0, 2), v = typ === 0 ? ri(1, r - 1) : typ === 1 ? r : r + ri(1, 3);
  return N({
    text: `Je dána přímka p a bod S, který je od ní vzdálený ${B(cm(v))}.`, q: `Kolik bodů přímky p je od bodu S vzdálených přesně ${r} cm?`, ans: [2, 1, 0][typ],
    hints: ['Body vzdálené ' + r + ' cm od S tvoří kružnici k(S; ' + r + ' cm).', 'Otázka tedy zní: kolik společných bodů má tato kružnice s přímkou p? Porovnej poloměr se vzdáleností přímky od středu.'],
    steps: [`Hledané body leží na kružnici k(S; ${r} cm) i na přímce p.`, `Vzdálenost přímky od středu: ${cm(v)} ${v < r ? '<' : v === r ? '=' : '>'} ${cm(r)}`, `Přímka je ${['sečna: 2 body', 'tečna: 1 bod', 'vnější přímka: žádný bod'][typ]}.`],
  });
}
function mn_obsahZKonstrukce() {
  const c = ri(5, 12), v = 2 * ri(2, 5);
  return N({
    text: `Trojúhelník ABC má stranu c = ${B(cm(c))} a výšku ${SUB('v', 'c')} = ${B(cm(v))} (kolmice z vrcholu C na stranu AB). Vrchol C se posouvá po rovnoběžce s AB.`, q: 'Jaký obsah má trojúhelník, ať je bod C na rovnoběžce kdekoli?', ans: c * v / 2, unit: 'cm²',
    hints: ['Všechny body rovnoběžky jsou od přímky AB stejně daleko. Výška se tedy nemění.', 'S = c · v : 2'], steps: ['Strana c i výška zůstávají stejné, obsah se nemění.', `S = ${c} · ${v} : 2 = ${cm2(c * v / 2)}`],
  });
}

// ======================= VÝKLAD =======================
const ukThales = () => kSvg(kProved([{ op: 'seg', a: 'A', b: 'B', len: 6 }, { op: 'mid', name: 'S', a: 'A', b: 'B' }, { op: 'circ', name: 'k', c: 'S', r: { pp: ['S', 'A'] } }, { op: 'circ', name: 'l', c: 'B', r: 3 }, { op: 'int', name: 'C', of: ['k', 'l'] }, { op: 'poly', pts: ['A', 'B', 'C'] }]), { H: 220 });
const ukVc = () => kSvg(kProved([{ op: 'seg', a: 'A', b: 'B', len: 7 }, { op: 'par', name: 'p', to: 'AB', dist: 3 }, { op: 'circ', name: 'k', c: 'A', r: 5 }, { op: 'int', name: 'C', of: ['p', 'k'], pick: 1 }, { op: 'poly', pts: ['A', 'B', 'C'] }]), { H: 220 });

export const R8 = { rocnik: 8, temata: [
  { id: '801', nazev: 'Pythagorova věta', ikona: '◣', popis: 'Přepona, odvěsny a jejich použití', strazce: 'Odmocňák',
    vyklad: [
      { h: 'Odvěsny a přepona', t: 'V pravoúhlém trojúhelníku mají strany jména. Dvě strany, které svírají pravý úhel, jsou <b>odvěsny</b>. Třetí strana leží naproti pravému úhlu, je nejdelší a jmenuje se <b>přepona</b>.<br><br>Na obrázku jsou odvěsnami strany a, b a přeponou strana c.', fig: () => fRightTri(4, 3, { la: 'a', lb: 'b', lc: 'c' }) },
      { h: 'Pythagorova věta', t: 'Nad každou stranou si představ čtverec. Čtverec nad přeponou má stejný obsah jako oba čtverce nad odvěsnami dohromady:<br><br><b>c² = a² + b²</b><br><br>Příklad: odvěsny 3 cm a 4 cm. c² = 9 + 16 = 25, takže c = √25 = 5 cm.', fig: () => fRightTri(4, 3, { la: '4', lb: '3', lc: '5' }) },
      { h: 'Výpočet odvěsny', t: 'Když znáš přeponu a jednu odvěsnu, větu obrátíš:<br><br><b>a² = c² − b²</b><br><br>Příklad: přepona 13 cm, odvěsna 5 cm. a² = 169 − 25 = 144, takže a = 12 cm.<br><br>Pamatuj: přepona se počítá <b>sčítáním</b>, odvěsna <b>odčítáním</b>.' },
      { h: 'Je trojúhelník pravoúhlý?', t: 'Věta platí i obráceně. Vezmi nejdelší stranu a zkontroluj, jestli se její druhá mocnina rovná součtu druhých mocnin zbylých dvou stran. Když ano, trojúhelník je pravoúhlý.<br><br>6, 8, 10: 100 = 36 + 64, pravoúhlý je.<br>5, 6, 8: 64 ≠ 25 + 36, pravoúhlý není.' },
      { h: 'Kde se věta hodí', t: 'Pravoúhlý trojúhelník se skrývá skoro všude:<br>• úhlopříčka obdélníku je přepona,<br>• výška rovnoramenného trojúhelníku ho dělí na dva pravoúhlé,<br>• žebřík opřený o zeď, lano ke stožáru, cesta „rovně a pak kolmo“.', fig: () => fRect(8, 6, { la: 'a', lb: 'b', diag: 'u' }) },
    ],
    u: [[p_pojem, p_ctverce, p_mocniny, p_prepona, p_odvesna], [p_preponaDec, p_odvesnaDec, p_obracena, p_uhlopricka, p_ctverecUhl, p_rovnoram], [p_zebrik, p_kosoctverec, p_lichobeznik, p_telesova, p_stozar, p_lod]],
    rychle: [p_ctverce, p_mocniny, p_prepona, p_odvesna, p_obracena] },
  { id: '802', nazev: 'Kruh a kružnice', ikona: '○', popis: 'Poloměr, průměr, číslo π, délka kružnice (obvod kruhu) a obsah kruhu', strazce: 'Pípolykač',
    vyklad: [
      { h: 'Kružnice a kruh', t: '<b>Kružnice</b> je jen čára: všechny body, které jsou od středu S stejně daleko. <b>Kruh</b> je celá plocha uvnitř i s touto čárou.<br><br><b>Poloměr r</b> vede ze středu na kružnici. <b>Průměr d</b> vede od kraje ke kraji přes střed, je to dva poloměry: <b>d = 2 · r</b>.', fig: () => fCircle(4, { lr: 'r' }) },
      { h: 'Číslo π', t: 'Změř u libovolného kola obvod a průměr. Obvod vyjde vždy asi 3,14krát delší. Tomuto číslu se říká <b>π</b> (pí, Ludolfovo číslo).<br><br><b>π ≐ 3,14</b><br><br>Má nekonečně mnoho desetinných míst, proto se výsledky zaokrouhlují. Tady počítej s 3,14, uzná se ti i výsledek s tlačítkem π na kalkulačce.' },
      { h: 'Délka kružnice (obvod kruhu)', t: 'Délka kružnice (obvod kruhu) je π krát průměr:<br><br><b>o = π · d = 2 · π · r</b><br><br>Příklad: r = 5 cm. o = 2 · 3,14 · 5 = 31,4 cm.' },
      { h: 'Obsah kruhu', t: '<b>S = π · r²</b><br><br>Nejdřív umocni poloměr, pak násob číslem π. Příklad: r = 5 cm. S = 3,14 · 25 = 78,5 cm².<br><br>Když znáš průměr, nejdřív z něj udělej poloměr. Do vzorce pro obsah patří vždy poloměr.', fig: () => fCircle(4, { ld: 'd' }) },
      { h: 'Části kruhu', t: '<b>Půlkruh</b> je polovina kruhu, <b>čtvrtkruh</b> čtvrtina. <b>Výseč</b> je „dílek dortu“ se středovým úhlem α a zabírá α/360 celého kruhu.<br><b>Mezikruží</b> je kruh s vyříznutým menším kruhem: S = π · R² − π · r².', fig: () => fCircle(4, { sector: 90, lsec: '90°' }) },
    ],
    u: [[kr_pojmy, kr_prumer, kr_delka, kr_obsah, kr_delkaZPrumeru], [kr_obsahZPrumeru, kr_polomerZDelky, kr_cast, kr_kolo, kr_mezikruzi, kr_vysec], [kr_zahon, kr_pizza, kr_drat, kr_ctverecKruh, kr_draha, kr_obsahZDelky]],
    rychle: [kr_prumer, p_mocniny, pk_spolecne] },
  { id: '803', nazev: 'Tečna a Thaletova kružnice', ikona: '⌒', popis: 'Poloha přímky a kružnice, dvou kružnic, tečna, Thaletova věta', strazce: 'Tečník', kon: 1,
    vyklad: [
      { h: 'Přímka a kružnice', t: 'Záleží na tom, jak daleko je přímka od středu kružnice (vzdálenost v) a jaký je poloměr r.<br><br><b>Sečna</b> (v &lt; r): protne kružnici ve dvou bodech.<br><b>Tečna</b> (v = r): dotkne se v jediném bodě, bodu dotyku.<br><b>Vnější přímka</b> (v &gt; r): kružnici mine.<br><br>Tečna je vždy <b>kolmá na poloměr</b> v bodě dotyku.', fig: () => fTangent(3, 6.5, { lr: 'r' }) },
      { h: 'Tětiva', t: '<b>Tětiva</b> je úsečka, která spojuje dva body kružnice. Nejdelší tětiva je průměr.<br><br>Spojnice středu kružnice se středem tětivy je na tětivu kolmá. Vzniká tak pravoúhlý trojúhelník s přeponou r, ve kterém se dá počítat Pythagorovou větou.', fig: () => fCircle(5, { chord: { v: 3, lv: 'v', lr: 'r', lt: 't/2' } }) },
      { h: 'Dvě kružnice', t: 'Vzdálenost středů porovnáváme se součtem a rozdílem poloměrů.<br><br>Větší než součet: leží vně sebe.<br>Rovná se součtu: vnější dotyk.<br>Mezi rozdílem a součtem: dva průsečíky.<br>Rovná se rozdílu: vnitřní dotyk.<br>Menší než rozdíl: jedna leží uvnitř druhé.' },
      { h: 'Thaletova věta', t: 'Narýsuj kružnici s průměrem AB a zvol na ní libovolný bod C. Úhel ACB je <b>vždy pravý</b>.<br><br>Platí to i obráceně: všechny body, ze kterých je úsečka AB vidět pod pravým úhlem, leží na kružnici s průměrem AB. Říká se jí <b>Thaletova kružnice</b>. Její střed je ve středu úsečky AB.', fig: ukThales },
      { h: 'Tečna z bodu', t: 'Jak sestrojit tečnu z bodu M ke kružnici k(S; r)? Bod dotyku T musí splnit, že úhel STM je pravý. Leží tedy na Thaletově kružnici nad úsečkou SM.<br>1. Střed O úsečky SM.<br>2. Kružnice l(O; |OS|).<br>3. Bod T je průsečík l a k.<br>4. Tečna je přímka MT. Průsečíky jsou dva, tečny taky.' },
    ],
    u: [[pk_primka, pk_spolecne, pk_thales1, pk_pojem, pk_thalesFakt, () => kon_thales(1)], [pk_dveKruznice, pk_tecnaDelka, pk_tetiva, pk_opsana, () => kon_thales(2), () => kon_tecna(2)], [() => kon_thales(3), () => kon_tecna(3), pk_vzdalenostTetivy, pk_dveTecny, pk_stredna]],
    rychle: [pk_primka, pk_spolecne, pk_pojem] },
  { id: '804', nazev: 'Válec', ikona: '⬭', popis: 'Povrch a objem válce', strazce: 'Válcoun',
    vyklad: [
      { h: 'Jak válec vypadá', t: 'Válec má dvě stejné kruhové <b>podstavy</b> a mezi nimi zaoblený <b>plášť</b>. Představ si plechovku: dno, víčko a etiketa kolem.<br><br><b>r</b> je poloměr podstavy, <b>v</b> výška válce.', fig: () => fCyl(3, 5, { lr: 'r', lh: 'v' }) },
      { h: 'Objem', t: 'Stejně jako u hranolu platí: objem = obsah podstavy · výška. Podstava je kruh, takže:<br><br><b>V = π · r² · v</b><br><br>Příklad: r = 2 cm, v = 10 cm. V = 3,14 · 4 · 10 = 125,6 cm³.' },
      { h: 'Plášť je obdélník', t: 'Sloupni z plechovky etiketu a narovnej ji. Je to obdélník. Jeho délka je obvod podstavy (2 · π · r), jeho šířka výška válce:<br><br><b>S<sub>pl</sub> = 2 · π · r · v</b>' },
      { h: 'Povrch', t: 'Povrch jsou dvě podstavy a plášť:<br><br><b>S = 2 · π · r² + 2 · π · r · v</b><br><br>U hrnce bez pokličky nebo u bazénu počítej jen jednu podstavu. Když je zadaný průměr, nejdřív ho vyděl dvěma.' },
    ],
    u: [[v_objemSp, v_podstava, v_objem, v_plast, v_pojem], [v_povrch, v_objemD, v_vyskaZObjemu, v_litry, v_hrnec], [v_studna, v_trubka, v_etiketa, v_valec, v_zmena]],
    rychle: [v_objemSp, v_pojem, pk_pojem] },
  { id: '805', nazev: 'Konstrukční úlohy', ikona: '✎', popis: 'Množiny bodů, trojúhelník z výšky a těžnice', strazce: 'Rýsoplaz', kon: 1,
    vyklad: [
      { h: 'Bod jako průsečík', t: 'Skoro každá konstrukční úloha stojí na jedné myšlence: hledaný bod musí splnit <b>dvě podmínky</b>. Každá podmínka určí čáru, na které bod leží. Bod pak najdeš tam, kde se obě čáry protnou.' },
      { h: 'Množiny bodů', t: '<b>Kružnice k(S; r)</b>: body ve vzdálenosti r od bodu S.<br><b>Osa úsečky AB</b>: body stejně daleko od A i B.<br><b>Rovnoběžka</b>: body ve vzdálenosti v od přímky (rovnoběžky jsou dvě, na každé straně jedna).<br><b>Osa úhlu</b>: body stejně daleko od obou ramen.<br><b>Thaletova kružnice</b>: body, ze kterých je úsečka vidět pod pravým úhlem.' },
      { h: 'Trojúhelník z výšky', t: 'Máme c, v<sub>c</sub> a b. Výška říká, že bod C je od přímky AB vzdálený v<sub>c</sub>. Leží tedy na rovnoběžce p s AB. Strana b říká, že leží i na kružnici k(A; b).<br><br>Kružnice protne rovnoběžku ve dvou bodech, úloha má dvě řešení.', fig: ukVc },
      { h: 'Trojúhelník z těžnice', t: 'Těžnice t<sub>c</sub> spojuje vrchol C se středem S strany AB. Bod C je tedy od bodu S vzdálený t<sub>c</sub> a leží na kružnici k(S; t<sub>c</sub>).', fig: () => nacrtekSvg('tri', ['c', 'tc', 'a']) },
      { h: 'Počet řešení', t: 'Na konci každé konstrukce se ptáme, kolik různých útvarů vyhovuje zadání. Záleží na tom, kolik průsečíků mají poslední dvě čáry: žádný, jeden, nebo dva. Řešení se obvykle počítají v jedné polorovině určené přímkou AB.' },
    ],
    u: [[mn_mnozina, () => kon_vc(1), () => kon_tc(1), mn_prunik, () => kon_vcAl(1)], [() => kon_vc(2), () => kon_tc(2), () => kon_vcAl(2), mn_pocet, mn_obsahZKonstrukce], [() => kon_vc(3), () => kon_tc(3), () => kon_vcAl(3), kon_vcTc]],
    rychle: [mn_prunik, pk_spolecne, pk_pojem] },
] };

// úlohy pro souhrnné opakování v 9. ročníku
export const MIX8 = { u1: [p_prepona, p_odvesna, kr_delka, kr_obsah, v_objem, p_mocniny], u2: [p_uhlopricka, p_rovnoram, kr_obsahZPrumeru, kr_mezikruzi, v_povrch, pk_tetiva] };
