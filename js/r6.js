// 6. ročník: úhly, osová souměrnost, trojúhelník, obvod a obsah, krychle a kvádr.
import { ri, pick, chance, shuffle, sample, rstep, cz, rd } from './util.js';
import { N, C, DM, GR, K, sit } from './ulohy.js';
import { fAngle, fAnglePair, fParallel, fClock, fTri, triAng, triSSS, fRect, fL, fCuboid, fShape, gridSvg } from './fig.js';
import { nacrtekSvg, kSvg, kProved } from './kon.js';
import { cm, cm2, cm3, st, B, SUB, KRAT, sm, smT, trojStrany, danyTroj, TVAR_V } from './pom.js';

// ======================= 601 ÚHLY =======================
const DRUH = d => d < 90 ? 'ostrý' : d === 90 ? 'pravý' : d < 180 ? 'tupý' : 'přímý';
function uh_druh() {
  const d = pick([ri(15, 85), 90, ri(95, 170), 180, ri(20, 80), ri(100, 165)]);
  return C({
    text: `Úhel α má velikost ${B(st(d))}.`, q: 'Jaký je to úhel?', fig: fAngle(d, 'α'),
    ok: DRUH(d), opts: ['ostrý', 'pravý', 'tupý', 'přímý'],
    hints: ['Porovnej úhel s pravým úhlem. Pravý úhel má 90° a vypadá jako roh sešitu.',
      'Ostrý úhel je menší než 90°. Pravý má přesně 90°. Tupý je větší než 90° a menší než 180°. Přímý má 180°.',
      `${st(d)} ${d < 90 ? 'je méně než 90°' : d === 90 ? 'je přesně 90°' : d < 180 ? 'je víc než 90° a míň než 180°' : 'je přesně 180°'}.`],
    steps: [`${st(d)} → úhel ${DRUH(d)}`],
  });
}
function uh_ved1() {
  let a = rstep(20, 160, 5); if (a === 90) a = 65;
  return N({
    text: `Úhly α a β jsou ${B('vedlejší')} (leží vedle sebe a mají společné rameno). Úhel α má ${B(st(a))}.`, q: 'Jak velký je úhel β?',
    fig: fAnglePair('ved', a, st(a), '?'), ans: 180 - a, unit: '°',
    traps: [[a, 'Stejně velké jsou vrcholové úhly. Vedlejší úhly dávají dohromady 180°.'], [360 - a, 'Vedlejší úhly tvoří dohromady přímý úhel, tedy 180°, ne 360°.'],
      ...(a < 90 ? [[90 - a, 'Do 90° se doplňují úhly v pravém úhlu. Vedlejší úhly dávají dohromady 180°.']] : [])],
    hints: ['Vedlejší úhly leží vedle sebe na jedné přímce. Dohromady tvoří přímý úhel.', 'Přímý úhel má 180°, takže β = 180° − α.', `β = 180° − ${st(a)}`],
    steps: ['α + β = 180°', `β = 180° − ${st(a)}`, `β = ${st(180 - a)}`],
  });
}
function uh_vrch1() {
  let a = rstep(20, 160, 5); if (a === 90) a = 115;
  return N({
    text: `Úhly α a β jsou ${B('vrcholové')} (leží naproti sobě u průsečíku dvou přímek). Úhel α má ${B(st(a))}.`, q: 'Jak velký je úhel β?',
    fig: fAnglePair('vrch', a, st(a), '?'), ans: a, unit: '°',
    traps: [[180 - a, 'To je vedlejší úhel. Vrcholové úhly leží proti sobě a jsou stejně velké.']],
    hints: ['Vrcholové úhly vzniknou, když se protnou dvě přímky. Leží proti sobě, mají společný jen vrchol.', 'Vrcholové úhly jsou vždy stejně velké.', `β = α = ${st(a)}`],
    steps: ['Vrcholové úhly jsou shodné.', `β = α = ${st(a)}`],
  });
}
function uh_dopl() {
  const a = ri(12, 78);
  return N({
    text: `Pravý úhel je polopřímkou rozdělený na dva úhly. Jeden z nich má ${B(st(a))}.`, q: 'Jak velký je druhý úhel?', ans: 90 - a, unit: '°',
    traps: [[180 - a, 'Pravý úhel má 90°, ne 180°.']],
    hints: ['Oba úhly dohromady dají celý pravý úhel.', 'Pravý úhel má 90°. Druhý úhel = 90° − první úhel.', `90° − ${st(a)}`],
    steps: [`90° − ${st(a)} = ${st(90 - a)}`],
  });
}
function uh_min1() {
  if (chance(0.5)) {
    const s = ri(2, 9);
    return N({
      text: `Úhel má velikost ${B(st(s))}.`, q: 'Kolik je to minut?', ans: 60 * s, unit: '′',
      traps: [[100 * s, 'Jeden stupeň má 60 minut, ne 100.'], [s, 'Stupně je potřeba vynásobit šedesáti.']],
      hints: ['Stupeň se dělí na menší dílky, kterým říkáme minuty (značka ′).', '1° = 60′', `${s} · 60′`],
      steps: ['1° = 60′', `${st(s)} = ${s} · 60′ = ${60 * s}′`],
    });
  }
  const s = ri(2, 9);
  return N({
    text: `Úhel má velikost ${B(60 * s + '′')} (minut).`, q: 'Kolik je to stupňů?', ans: s, unit: '°',
    traps: [[rd(60 * s / 100, 1), '60 minut je jeden stupeň – dělí se šedesáti, ne stem.']],
    hints: ['Minuty jsou menší dílky stupně.', '60′ = 1°, takže počet minut vydělíme šedesáti.', `${60 * s} : 60`],
    steps: ['60′ = 1°', `${60 * s}′ = ${60 * s} : 60 = ${st(s)}`],
  });
}
function uh_soucet1() {
  const a = ri(20, 75), bb = ri(15, 80), plus = chance(0.6) || a === bb;
  const [x, y] = a > bb ? [a, bb] : [bb, a];
  return N({
    text: `Úhel α má ${B(st(x))}, úhel β má ${B(st(y))}.`, q: plus ? 'Jak velký je jejich součet α + β?' : 'Jak velký je jejich rozdíl α − β?',
    ans: plus ? x + y : x - y, unit: '°',
    hints: ['Velikosti úhlů se sčítají a odčítají jako obyčejná čísla.', plus ? 'Sečti oba počty stupňů.' : 'Od většího úhlu odečti menší.', plus ? `${x} + ${y}` : `${x} − ${y}`],
    steps: [plus ? `${st(x)} + ${st(y)} = ${st(x + y)}` : `${st(x)} − ${st(y)} = ${st(x - y)}`],
  });
}
// --- úroveň 2 ---
function uh_soucDM() {
  const a1 = ri(20, 80), m1 = ri(20, 55), a2 = ri(15, 70), m2 = ri(61 - m1, 58), M = m1 + m2;
  return DM({
    text: `α = ${B(sm(a1, m1))}, β = ${B(sm(a2, m2))}`, q: 'Vypočítej α + β.', ans: (a1 + a2) * 60 + M,
    traps: [[(a1 + a2) * 60 + M - 60, 'Minuty daly přes 60′. Nezapomeň za ně přičíst 1° ke stupňům.']],
    hints: ['Sečti zvlášť stupně a zvlášť minuty.', 'Když vyjde 60 minut nebo víc, vyměň 60′ za 1°.'],
    steps: [`Minuty: ${m1}′ + ${m2}′ = ${M}′ = 1° ${M - 60}′`, `Stupně: ${a1}° + ${a2}° + 1° = ${a1 + a2 + 1}°`, `α + β = ${sm(a1 + a2 + 1, M - 60)}`],
  });
}
function uh_rozdDM() {
  const a1 = ri(60, 120), m1 = ri(5, 30), a2 = ri(15, 50), m2 = ri(m1 + 5, 55);
  return DM({
    text: `α = ${B(sm(a1, m1))}, β = ${B(sm(a2, m2))}`, q: 'Vypočítej α − β.', ans: a1 * 60 + m1 - a2 * 60 - m2,
    traps: [[(a1 - a2) * 60 + (m2 - m1), 'Minuty se neodčítají „větší minus menší“. Rozměň 1° na 60′.']],
    hints: [`Od ${m1}′ nejde odečíst ${m2}′. Půjč si jeden stupeň a rozměň ho na 60 minut.`, `${sm(a1, m1)} = ${a1 - 1}° ${m1 + 60}′`],
    steps: [`${sm(a1, m1)} = ${a1 - 1}° ${m1 + 60}′`, `Minuty: ${m1 + 60}′ − ${m2}′ = ${m1 + 60 - m2}′`, `Stupně: ${a1 - 1}° − ${a2}° = ${a1 - 1 - a2}°`, `α − β = ${sm(a1 - 1 - a2, m1 + 60 - m2)}`],
  });
}
function uh_osa() {
  const a = ri(31, 169);
  return DM({
    text: `Osa úhlu rozdělí úhel α = ${B(st(a))} na dva shodné úhly.`, q: 'Jak velký je každý z nich?', ans: a * 30,
    hints: ['Osa úhlu ho půlí. Stačí dělit dvěma.', 'Když je stupňů lichý počet, zbyde půl stupně. Půl stupně je 30′.'],
    steps: [`${st(a)} : 2 = ${smT(a * 30)}`],
  });
}
function uh_vedDM() {
  const a = ri(40, 150), m = ri(5, 55);
  return DM({
    text: `Úhly α a β jsou vedlejší (leží vedle sebe a mají společné rameno). α = ${B(sm(a, m))}`, q: 'Vypočítej úhel β.', ans: 180 * 60 - a * 60 - m,
    traps: [[(180 - a) * 60 + m, 'Minuty se taky odčítají. Zapiš si 180° jako 179° 60′.'], [(180 - a) * 60 - m + 60, 'Když si půjčíš 1° na minuty, zbude ti 179°, ne 180°.']],
    hints: ['Vedlejší úhly dávají dohromady 180°.', '180° si napiš jako 179° 60′, pak půjdou minuty odečíst.'],
    steps: ['β = 180° − α', `180° = 179° 60′`, `β = 179° 60′ − ${sm(a, m)} = ${smT(180 * 60 - a * 60 - m)}`],
  });
}
function uh_dvaVrch() {
  const a = ri(25, 85);
  return N({
    text: `Dvě přímky se protínají. Součet dvou vrcholových úhlů (leží naproti sobě u průsečíku přímek) je ${B(st(2 * a))}.`, q: 'Jak velký je úhel, který je k nim vedlejší (leží vedle každého z nich a má s ním společné rameno)?', ans: 180 - a, unit: '°',
    fig: fAnglePair('vrch', a, 'α', 'α', '?'),
    traps: [[180 - 2 * a, 'Od 180° se odečítá jeden úhel, ne součet obou.'], [a, 'To je jeden z vrcholových úhlů. Hledáme úhel vedlejší.']],
    hints: ['Vrcholové úhly jsou stejně velké. Jak velký je tedy jeden z nich?', 'Vedlejší úhel doplňuje jeden z nich do 180°.'],
    steps: [`Jeden vrcholový úhel: ${st(2 * a)} : 2 = ${st(a)}`, `Vedlejší úhel: 180° − ${st(a)} = ${st(180 - a)}`],
  });
}
function uh_rovnob() {
  const a = chance(0.5) ? ri(40, 75) : ri(105, 140), typ = pick(['souhl', 'stri']);
  return N({
    text: `Přímky a, b jsou rovnoběžné. Úhel α má ${B(st(a))}.`, q: 'Jak velký je úhel β?', fig: fParallel(a, typ, st(a), '?'), ans: a, unit: '°',
    traps: [[180 - a, 'To by byl vedlejší úhel. Souhlasné a střídavé úhly u rovnoběžek jsou stejně velké.']],
    hints: [typ === 'souhl' ? 'Úhly α a β jsou souhlasné: leží na stejné straně příčky a jsou stejně „natočené“.' : 'Úhly α a β jsou střídavé: leží mezi rovnoběžkami, každý na jiné straně příčky.',
      'Souhlasné i střídavé úhly u rovnoběžek jsou shodné.'],
    steps: [`Úhly jsou ${typ === 'souhl' ? 'souhlasné' : 'střídavé'}, takže jsou shodné.`, `β = α = ${st(a)}`],
  });
}
function uh_nasob() {
  const k = pick([2, 3, 4]), a = ri(15, 40), m = ri(Math.ceil(65 / k), 55), T = k * (60 * a + m);
  return DM({
    text: `α = ${B(sm(a, m))}`, q: `Vypočítej ${k} · α.`, ans: T,
    hints: ['Vynásob zvlášť stupně a zvlášť minuty.', 'Minuty, které přesáhnou 60, převeď na stupně.'],
    steps: [`Stupně: ${k} · ${a}° = ${k * a}°`, `Minuty: ${k} · ${m}′ = ${k * m}′ = ${Math.floor(k * m / 60)}° ${k * m % 60}′`, `${k} · α = ${smT(T)}`],
  });
}
// --- úroveň 3 ---
function uh_hodiny() {
  let h, m, x;
  do { h = ri(1, 11); m = pick([0, 10, 20, 30, 40, 50]); x = Math.abs(30 * h - 5.5 * m); } while (x === 0);
  const ans = Math.min(x, 360 - x), mm = String(m).padStart(2, '0');
  return N({
    text: `Na ručičkových hodinách je ${B(h + ':' + mm)}.`, q: 'Jak velký je menší z úhlů, které svírají hodinová a minutová ručička?', ans, unit: '°',
    traps: m ? [[Math.min(Math.abs(30 * h - 6 * m), 360 - Math.abs(30 * h - 6 * m)), 'Hodinová ručička nestojí přesně na celé hodině. Za každou minutu se posune o půl stupně.']] : [],
    hints: ['Minutová ručička ujde za minutu 6°. Hodinová ujde za hodinu 30°, tedy za minutu 0,5°. Úhly měř od dvanáctky.'],
    steps: [`Minutová ručička: ${m} · 6° = ${st(6 * m)}`, `Hodinová ručička: ${h} · 30°${m ? ` + ${m} · 0,5°` : ''} = ${st(30 * h + 0.5 * m)}`,
      `Rozdíl: ${st(x)}`, ...(x > 180 ? [`Menší úhel: 360° − ${st(x)} = ${st(360 - x)}`] : [])],
  });
}
function uh_rovnobDM() {
  const a = ri(40, 140), m = ri(5, 55), typ = pick(['souhlasný', 'střídavý']);
  return DM({
    text: `Rovnoběžky a, b protíná příčka p. Úhel α u přímky a má ${B(sm(a, m))}. Úhel β u přímky b je s ním ${typ}. Úhel γ je vedlejší k úhlu β.`,
    q: 'Vypočítej úhel γ.', ans: 10800 - 60 * a - m,
    hints: ['Souhlasné i střídavé úhly u rovnoběžek jsou shodné. Vedlejší úhly dávají dohromady 180°.'],
    steps: [`β = α = ${sm(a, m)} (${typ} úhel)`, `γ = 180° − β = 179° 60′ − ${sm(a, m)}`, `γ = ${smT(10800 - 60 * a - m)}`],
  });
}
function uh_vedRozdil() {
  const d = 2 * ri(5, 40), vetsi = chance(0.5), ans = vetsi ? (180 + d) / 2 : (180 - d) / 2;
  return N({
    text: `Dva vedlejší úhly se liší o ${B(st(d))}.`, q: `Jak velký je ${vetsi ? 'větší' : 'menší'} z nich?`, ans, unit: '°',
    hints: ['Oba úhly dávají dohromady 180°. Když rozdíl odebereš, zbydou dva stejné úhly.'],
    steps: [`180° − ${st(d)} = ${st(180 - d)}`, `Menší úhel: ${st(180 - d)} : 2 = ${st((180 - d) / 2)}`, ...(vetsi ? [`Větší úhel: ${st((180 - d) / 2)} + ${st(d)} = ${st(ans)}`] : [])],
  });
}
function uh_vedNasobek() {
  const k = pick([2, 3, 4, 5, 8]), mensi = 180 / (k + 1), vetsi = chance(0.6);
  return N({
    text: `Jeden ze dvou vedlejších úhlů je ${B(KRAT[k])} větší než druhý.`, q: `Jak velký je ${vetsi ? 'větší' : 'menší'} z nich?`, ans: vetsi ? k * mensi : mensi, unit: '°',
    hints: ['Menší úhel je jeden díl, větší má takových dílů víc. Kolik dílů dává dohromady 180°?'],
    steps: [`Menší úhel je 1 díl, větší ${k} ${k < 5 ? 'díly' : 'dílů'}. Dílů celkem: 1 + ${k} = ${k + 1}`, `1 díl: 180° : ${k + 1} = ${st(mensi)}`, ...(vetsi ? [`Větší úhel: ${k} · ${st(mensi)} = ${st(k * mensi)}`] : [])],
  });
}
function uh_polovina() {
  const a = ri(40, 140), m = 2 * ri(3, 27), be = 10800 - 60 * a - m;
  return DM({
    text: `α = ${B(sm(a, m))}. Úhel β je vedlejší k úhlu α. Úhel γ je polovina úhlu β.`, q: 'Vypočítej úhel γ.', ans: be / 2,
    hints: ['Nejdřív spočítej β = 180° − α. Při půlení lichého počtu stupňů zbyde 30′.'],
    steps: [`β = 179° 60′ − ${sm(a, m)} = ${smT(be)}`, `γ = ${smT(be)} : 2 = ${smT(be / 2)}`],
  });
}
function uh_triDily() {
  let be, k, d;
  do { be = ri(20, 42); k = pick([2, 3]); d = 180 - (k + 2) * be; } while (d < 5 || d > 60);
  return N({
    text: `Přímý úhel je rozdělený na tři úhly α, β, γ. Úhel α je ${KRAT[k]} větší než β. Úhel γ je o ${st(d)} větší než β.`, q: 'Vypočítej úhel α.', ans: k * be, unit: '°',
    hints: ['Všechny tři úhly dávají dohromady 180°. Zkus všechno vyjádřit pomocí úhlu β.'],
    steps: ['α + β + γ = 180°', `${k}β + β + (β + ${st(d)}) = 180°`, `${k + 2}β = ${st(180 - d)}`, `β = ${st(be)}`, `α = ${k} · ${st(be)} = ${st(k * be)}`],
  });
}

// ======================= 602 OSOVÁ SOUMĚRNOST =======================
const H_OSA = ['Představ si, že osa je zrcadlo. Obraz leží „za zrcadlem“.', 'Spočítej, kolik čtverečků je bod od osy (kolmo k ní). Obraz je stejně daleko na druhé straně.', 'Bod, který leží přímo na ose, zůstává na místě.'];
const os_sit = (o, text, hints = H_OSA) => () => GR({ ...sit(o), text, q: 'Ťukni do sítě na místa, kde leží obrazy bodů.', hints });
const os_bod1 = os_sit({ n: 1, osa: ['v', 'h'] }, 'Najdi obraz bodu A (kam se bod přenese, jako v zrcadle) v osové souměrnosti s osou o.');
const os_usecka1 = os_sit({ n: 2, osa: ['v', 'h'] }, 'Najdi obraz úsečky AB (kam se úsečka přenese, jako v zrcadle) v osové souměrnosti s osou o. Stačí označit obrazy krajních bodů.');
const OSY = [['ctverec', 'čtverec', 4, 'Dvě osy procházejí středy protějších stran, dvě jsou úhlopříčky.'], ['obdelnik', 'obdélník', 2, 'Osy procházejí středy protějších stran. Úhlopříčky osami nejsou.'],
  ['rovnostranny', 'rovnostranný trojúhelník', 3, 'Každá osa prochází jedním vrcholem a středem protější strany.'], ['rovnoramenny', 'rovnoramenný trojúhelník', 1, 'Osa prochází hlavním vrcholem a středem základny.'],
  ['obecny', 'různostranný trojúhelník', 0, 'Žádná přímka ho nerozdělí na dvě zrcadlově stejné části.'], ['kosoctverec', 'kosočtverec', 2, 'Osami jsou obě úhlopříčky.'],
  ['rovnobeznik', 'kosodélník', 0, 'Kosodélník osově souměrný není (je jen středově souměrný).'], ['kruh', 'kruh', 'nekonečně mnoho', 'Osou je každá přímka, která prochází středem.'],
  ['lichobeznik', 'rovnoramenný lichoběžník', 1, 'Osa prochází středy obou základen.'], ['petiuhelnik', 'pravidelný pětiúhelník', 5, 'Každá osa prochází vrcholem a středem protější strany.'], ['sestiuhelnik', 'pravidelný šestiúhelník', 6, 'Tři osy procházejí protějšími vrcholy, tři středy protějších stran.']];
function os_pocet() {
  const [id, jm, n, proc] = pick(OSY.slice(0, 8));
  return C({
    text: `Na obrázku je ${B(jm)}${TVAR_V[id] || ''}.`, q: 'Kolik má os souměrnosti?', fig: fShape(id), figSol: fShape(id, { osy: 1 }),
    ok: String(n), opts: ['0', '1', '2', '3', '4', 'nekonečně mnoho'],
    hints: ['Osa souměrnosti je přímka, podle které jde útvar přeložit tak, že se obě půlky přesně kryjí.', 'Zkoušej v duchu překládat: svisle, vodorovně, šikmo přes vrcholy.', proc],
    steps: [proc],
  });
}
function os_vzd() {
  const d = ri(2, 9), dvoj = chance(0.5);
  return N({
    text: `Bod A leží ${B(cm(d))} od osy souměrnosti o. Bod A′ je jeho obraz (kam se bod přenese, jako v zrcadle).`, q: dvoj ? 'Jak daleko jsou od sebe body A a A′?' : 'Jak daleko od osy leží bod A′?', ans: dvoj ? 2 * d : d, unit: 'cm',
    traps: dvoj ? [[d, 'To je vzdálenost jednoho bodu od osy. Mezi A a A′ je ta vzdálenost dvakrát.']] : [[2 * d, 'To je vzdálenost mezi body A a A′. Od osy je obraz stejně daleko jako vzor.']],
    hints: ['Vzor a obraz jsou od osy vždy stejně daleko, každý na jiné straně.', dvoj ? 'Vzdálenost |AA′| je dvakrát vzdálenost bodu od osy.' : 'Obraz je od osy stejně daleko jako vzor.', dvoj ? `2 · ${d}` : `${d} cm`],
    steps: [dvoj ? `|AA′| = 2 · ${cm(d)} = ${cm(2 * d)}` : `Obraz je od osy stejně daleko jako vzor: ${cm(d)}`],
  });
}
function os_pismeno() {
  const ok = pick(['A', 'M', 'T', 'U', 'V', 'W', 'Y', 'E', 'B', 'C', 'D', 'K', 'H', 'X']), bad = sample(['F', 'G', 'J', 'L', 'N', 'P', 'R', 'S', 'Z'], 3);
  return C({
    text: 'Tiskací písmena bez ozdob:', q: 'Které z nich je osově souměrné?', ok, bad,
    hints: ['Zkus písmeno v duchu přeložit svisle nebo vodorovně na dvě půlky.', 'Osově souměrné písmeno má obě půlky zrcadlově stejné.', 'Písmena N, S a Z vypadají souměrně, ale přeložit je na dvě kryjící se půlky nejde.'],
    steps: [`Písmeno ${ok} jde přeložit ${'AMTUVWY'.includes(ok) ? 'svisle' : 'EBCDK'.includes(ok) ? 'vodorovně' : 'svisle i vodorovně'} na dvě stejné půlky.`],
  });
}
function os_samodruzny() {
  return C({
    text: 'Bod B leží přímo na ose souměrnosti.', q: 'Kde leží jeho obraz B′ (kam se bod přenese, jako v zrcadle)?', ok: 'Ve stejném místě jako bod B', bad: ['Na druhé straně osy', 'Takový bod obraz nemá', 'O kousek dál na ose'],
    hints: ['Jak daleko je bod B od osy?', 'Bod na ose je od osy vzdálený 0. Jeho obraz je taky vzdálený 0.', 'Bodům, které se zobrazí samy na sebe, říkáme samodružné.'],
    steps: ['Bod na ose se zobrazí sám na sebe. Je to samodružný bod.'],
  });
}
const os_troj = os_sit({ n: 3, osa: ['v', 'h'] }, 'Najdi obraz trojúhelníku ABC (kam se trojúhelník přenese, jako v zrcadle) v osové souměrnosti s osou o. Označ obrazy všech tří vrcholů.');
const os_naose = os_sit({ n: 3, osa: ['v', 'h'], naOse: true }, 'Najdi obraz trojúhelníku ABC (kam se trojúhelník přenese, jako v zrcadle) v osové souměrnosti s osou o. Pozor, jeden vrchol leží na ose.');
function os_shodnost() {
  const v = ri(0, 2);
  if (v === 0) {
    const [a, bb, c] = trojStrany();
    return N({
      text: `Trojúhelník ABC má strany ${cm(a)}, ${cm(bb)} a ${cm(c)}. V osové souměrnosti se zobrazí na trojúhelník A′B′C′.`, q: 'Jaký obvod má trojúhelník A′B′C′?', ans: a + bb + c, unit: 'cm',
      hints: ['Osová souměrnost je shodné zobrazení: obraz má stejné délky stran i stejné úhly jako vzor.', 'Obvod obrazu je stejný jako obvod vzoru.'],
      steps: ['Obraz je shodný se vzorem.', `o = ${a} + ${bb} + ${c} = ${cm(a + bb + c)}`],
    });
  }
  if (v === 1) {
    const a = ri(25, 140);
    return N({
      text: `Úhel α má ${st(a)}. V osové souměrnosti se zobrazí na úhel α′.`, q: 'Jak velký je úhel α′?', ans: a, unit: '°',
      traps: [[180 - a, 'Osová souměrnost úhly nemění. Obraz je stejně velký jako vzor.']],
      hints: ['Osová souměrnost je shodné zobrazení: nemění délky ani velikosti úhlů.', 'Obraz úhlu je stejně velký jako vzor.'], steps: [`α′ = α = ${st(a)}`],
    });
  }
  const d = ri(12, 48) / 10;
  return N({
    text: `Bod A leží ${cm(d)} od osy o. Bod A′ je jeho obraz (kam se bod přenese, jako v zrcadle) v osové souměrnosti.`, q: 'Vypočítej vzdálenost |AA′|.', ans: 2 * d, unit: 'cm',
    traps: [[d, 'Mezi A a A′ je vzdálenost od osy dvakrát: tam a ještě jednou na druhou stranu.']],
    hints: ['Body A a A′ jsou od osy stejně daleko, každý na jiné straně.', '|AA′| = 2 · vzdálenost od osy'], steps: [`|AA′| = 2 · ${cm(d)} = ${cm(2 * d)}`],
  });
}
function os_pocet2() {
  const [id, jm, n, proc] = pick(OSY.filter(x => typeof x[2] === 'number'));
  return N({
    text: `Na obrázku je ${B(jm)}${TVAR_V[id] || ''}.`, q: 'Kolik má os souměrnosti?', fig: fShape(id), figSol: fShape(id, { osy: 1 }), ans: n,
    hints: ['Hledej přímky, podle kterých jde útvar přeložit tak, že se půlky kryjí.', 'U pravidelných útvarů zkoušej osy přes vrcholy a přes středy stran.'], steps: [proc],
  });
}
const os_diag = os_sit({ n: 3, osa: ['d1', 'd2'] }, 'Najdi obraz trojúhelníku ABC v osové souměrnosti se šikmou osou o.',
  ['Kolmice k šikmé ose vede po úhlopříčkách čtverečků.', 'Jdi od bodu po úhlopříčce k ose a pak stejný počet čtverečků dál.']);
const os_pres = os_sit({ n: 4, osa: ['v', 'h'], pres: true }, 'Najdi obraz čtyřúhelníku ABCD v osové souměrnosti s osou o. Osa útvar protíná.',
  ['Každý vrchol se zobrazí na opačnou stranu osy, než kde leží. Body vlevo jdou doprava a naopak.']);
const os_diag4 = os_sit({ n: 4, osa: ['d1', 'd2'] }, 'Najdi obraz čtyřúhelníku ABCD v osové souměrnosti se šikmou osou o.',
  ['Kolmice k šikmé ose vede po úhlopříčkách čtverečků.']);
function os_slovni() {
  const c = ri(4, 12), r = ri(Math.floor(c / 2) + 2, 15);
  return N({
    text: `Trojúhelník ABC je souměrný podle osy, která prochází vrcholem C. Strana AB měří ${cm(c)} a obvod trojúhelníku je ${cm(c + 2 * r)}.`, q: 'Vypočítej délku strany AC.', ans: r, unit: 'cm', units: 1,
    hints: ['Osa prochází vrcholem C, takže zobrazuje bod A na bod B. Co to říká o stranách AC a BC?'],
    steps: ['Osa zobrazí A na B, proto |AC| = |BC|.', `|AC| + |BC| = ${c + 2 * r} − ${c} = ${cm(2 * r)}`, `|AC| = ${2 * r} : 2 = ${cm(r)}`],
  });
}
function os_soucet() {
  const tri = sample(OSY.filter(x => typeof x[2] === 'number'), 3);
  return N({
    text: `Tři útvary: ${tri.map(x => x[1]).join(', ')}.`, q: 'Kolik os souměrnosti mají všechny tři dohromady?', ans: tri.reduce((s, x) => s + x[2], 0),
    hints: ['Urči počet os u každého útvaru zvlášť. Pozor na útvary, které nemají žádnou.'],
    steps: [...tri.map(x => `${x[1]}: ${x[2]}`), `Dohromady: ${tri.map(x => x[2]).join(' + ')} = ${tri.reduce((s, x) => s + x[2], 0)}`],
  });
}
function os_uhel() {
  const a = ri(15, 40);
  return N({
    text: `Osa souměrnosti rovnoramenného trojúhelníku svírá s ramenem úhel ${st(a)}.`, q: 'Jak velký je úhel při základně?', ans: 90 - a, unit: '°',
    hints: ['Osa půlí úhel při hlavním vrcholu a je kolmá k základně. Rozdělí trojúhelník na dva pravoúhlé.'],
    steps: [`V pravoúhlém trojúhelníku: 90° + ${st(a)} + úhel při základně = 180°`, `Úhel při základně = 90° − ${st(a)} = ${st(90 - a)}`],
  });
}

// ======================= 603 TROJÚHELNÍK – ÚHLY A STRANY =======================
function t_treti() {
  let al, be; do { al = ri(30, 80); be = ri(30, 80); } while (180 - al - be < 25);
  const ga = 180 - al - be;
  return N({
    text: `V trojúhelníku ABC je α = ${B(st(al))} a β = ${B(st(be))}.`, q: 'Jak velký je úhel γ?', fig: fTri(triAng(8, al, be), { angs: [st(al), st(be), '?'] }), ans: ga, unit: '°',
    traps: [[al + be, 'To je součet dvou známých úhlů. Ještě ho odečti od 180°.'], [360 - al - be, 'Součet úhlů v trojúhelníku je 180°, ne 360°.']],
    hints: ['Všechny tři vnitřní úhly trojúhelníku dávají dohromady vždy 180°.', 'γ = 180° − α − β', `γ = 180° − ${st(al)} − ${st(be)}`],
    steps: ['α + β + γ = 180°', `γ = 180° − ${st(al)} − ${st(be)}`, `γ = ${st(ga)}`],
  });
}
function t_druhU() {
  const typ = ri(0, 2); let a, bb;
  if (typ === 0) { do { a = ri(50, 85); bb = ri(50, 85); } while (180 - a - bb >= 90 || 180 - a - bb < 20); }
  else if (typ === 1) { a = 90; bb = ri(20, 70); }
  else { a = ri(95, 130); bb = ri(15, 180 - a - 15); }
  const u = shuffle([a, bb, 180 - a - bb]), ok = ['ostroúhlý', 'pravoúhlý', 'tupoúhlý'][typ];
  return C({
    text: `Trojúhelník má vnitřní úhly ${B(u.map(st).join(', '))}.`, q: 'Jaký je to trojúhelník?', ok, opts: ['ostroúhlý', 'pravoúhlý', 'tupoúhlý'],
    hints: ['Podívej se na největší úhel.', 'Všechny úhly ostré → ostroúhlý. Jeden pravý → pravoúhlý. Jeden tupý → tupoúhlý.', `Největší úhel je ${st(Math.max(...u))}.`],
    steps: [`Největší úhel má ${st(Math.max(...u))} → trojúhelník je ${ok}.`],
  });
}
function t_druhS() {
  const typ = ri(0, 2), a = ri(4, 9); let s;
  if (typ === 0) s = [a, a, a]; else if (typ === 1) s = shuffle([a, a, a + pick([-2, -1, 1, 2])]); else s = shuffle([a, a + 1, a + 2]);
  const ok = ['rovnostranný', 'rovnoramenný', 'různostranný'][typ];
  return C({
    text: `Trojúhelník má strany ${B(s.map(cm).join(', '))}.`, q: 'Jaký je to trojúhelník?', ok, opts: ['rovnostranný', 'rovnoramenný', 'různostranný'],
    hints: ['Porovnej délky stran. Kolik jich je stejných?', 'Tři stejné strany → rovnostranný. Dvě stejné → rovnoramenný. Každá jiná → různostranný (obecný).', `Stejně dlouhé jsou ${typ === 0 ? 'všechny tři strany' : typ === 1 ? 'právě dvě strany' : 'žádné dvě strany'}.`],
    steps: [`${typ === 0 ? 'Všechny tři strany jsou stejné' : typ === 1 ? 'Dvě strany jsou stejné' : 'Každá strana je jinak dlouhá'} → trojúhelník ${ok}.`],
  });
}
function t_nerovnost() {
  const lze = chance(0.5), x = ri(2, 7), y = ri(x, 9), z = lze ? ri(y, x + y - 1) : ri(x + y, x + y + 4), s = shuffle([x, y, z]);
  return C({
    text: `Tři úsečky mají délky ${B(s.map(cm).join(', '))}.`, q: 'Dá se z nich sestrojit trojúhelník?', ok: lze ? 'Ano' : 'Ne', opts: ['Ano', 'Ne'],
    hints: ['Polož v duchu dvě kratší úsečky na konce té nejdelší a sklápěj je k sobě. Dosáhnou na sebe?', 'Trojúhelník vznikne jen tehdy, když je součet dvou kratších stran větší než nejdelší strana.', `${x} + ${y} = ${x + y}. Nejdelší strana měří ${z}.`],
    steps: [`Dvě kratší strany: ${x} + ${y} = ${x + y}`, `Nejdelší strana: ${z}`, x + y > z ? `${x + y} > ${z} → trojúhelník sestrojit lze.` : `${x + y} ${x + y === z ? '=' : '<'} ${z} → trojúhelník sestrojit nelze.`],
  });
}
function t_obvod() {
  const [a, bb, c] = trojStrany();
  return N({
    text: `Trojúhelník má strany a = ${B(cm(a))}, b = ${B(cm(bb))}, c = ${B(cm(c))}.`, q: 'Vypočítej jeho obvod.', fig: fTri(triSSS(a, bb, c), { sides: [cm(c), cm(a), cm(bb)] }), ans: a + bb + c, unit: 'cm',
    hints: ['Obvod je délka čáry kolem celého útvaru.', 'Sečti délky všech tří stran: o = a + b + c.', `o = ${a} + ${bb} + ${c}`],
    steps: ['o = a + b + c', `o = ${a} + ${bb} + ${c} = ${cm(a + bb + c)}`],
  });
}
function t_fakta() {
  return C(pick([
    { text: 'Rovnostranný trojúhelník má všechny tři úhly stejně velké.', q: 'Jak velký je každý z nich?', ok: '60°', bad: ['45°', '90°', '30°'], steps: ['180° : 3 = 60°'], hints: ['Součet všech tří úhlů je 180°.', 'Tři stejné úhly, dohromady 180°. Vyděl třemi.', '180° : 3'] },
    { text: 'Vnitřní úhly trojúhelníku.', q: 'Kolik dávají dohromady?', ok: '180°', bad: ['90°', '360°', '270°'], steps: ['Součet vnitřních úhlů každého trojúhelníku je 180°.'], hints: ['Odtrhni v duchu všechny tři rohy papírového trojúhelníku a přilož je k sobě.', 'Rohy složí přímý úhel.', 'Přímý úhel má 180°.'] },
    { text: 'Trojúhelník a tupé úhly.', q: 'Kolik tupých úhlů může mít trojúhelník nejvýš?', ok: 'jeden', bad: ['dva', 'tři', 'žádný'], steps: ['Dva tupé úhly by dohromady daly víc než 180°. Tupý tedy může být nejvýš jeden.'], hints: ['Tupý úhel má víc než 90°.', 'Kolik by daly dohromady dva tupé úhly?', 'Víc než 180° – a to je víc, než má celý trojúhelník.'] },
    { text: 'Pravoúhlý trojúhelník má jeden úhel pravý.', q: 'Kolik dávají dohromady zbylé dva úhly?', ok: '90°', bad: ['180°', '45°', '60°'], steps: ['180° − 90° = 90°'], hints: ['Všechny tři úhly dají 180°.', 'Pravý úhel má 90°.', '180° − 90°'] },
  ]));
}
// --- úroveň 2 ---
function t_rovnoram() {
  if (chance(0.5)) {
    const z = ri(25, 80), v = 180 - 2 * z;
    return N({
      text: `Rovnoramenný trojúhelník má úhly při základně (straně, která není rameno) velké ${B(st(z))}.`, q: 'Jak velký je úhel při hlavním vrcholu (naproti základně)?', fig: fTri(triAng(7, z, z), { angs: [st(z), st(z), '?'] }), ans: v, unit: '°',
      traps: [[180 - z, 'Při základně jsou úhly dva a oba se odečítají.']],
      hints: ['V rovnoramenném trojúhelníku jsou oba úhly při základně stejné.', 'γ = 180° − 2 · úhel při základně'], steps: [`γ = 180° − 2 · ${st(z)}`, `γ = 180° − ${st(2 * z)} = ${st(v)}`],
    });
  }
  const v = 2 * ri(10, 65), z = (180 - v) / 2;
  return N({
    text: `Rovnoramenný trojúhelník má při hlavním vrcholu (naproti základně) úhel ${B(st(v))}.`, q: 'Jak velký je každý z úhlů při základně (straně, která není rameno)?', fig: fTri(triAng(7, z, z), { angs: ['?', '?', st(v)] }), ans: z, unit: '°',
    traps: [[180 - v, 'To jsou oba úhly při základně dohromady. Ještě je rozděl na dva stejné.']],
    hints: ['Na oba úhly při základně zbývá 180° minus úhel při vrcholu.', 'Oba úhly při základně jsou stejné, takže zbytek vyděl dvěma.'], steps: [`180° − ${st(v)} = ${st(180 - v)}`, `${st(180 - v)} : 2 = ${st(z)}`],
  });
}
function t_vnejsi() {
  let al, be; do { al = ri(30, 75); be = ri(30, 75); } while (al + be > 140);
  if (chance(0.6)) return N({
    text: `V trojúhelníku ABC je α = ${B(st(al))} a β = ${B(st(be))}.`, q: 'Jak velký je vnější úhel u vrcholu C (mezi stranou a prodloužením sousední strany)?', fig: fTri(triAng(8, al, be), { angs: [st(al), st(be), ''], ext: { at: 2, lab: '?' } }), ans: al + be, unit: '°',
    traps: [[180 - al - be, 'To je vnitřní úhel γ. Vnější úhel je k němu vedlejší.']],
    hints: ['Vnější úhel je vedlejší k vnitřnímu úhlu u stejného vrcholu.', 'Vnější úhel se rovná součtu dvou vnitřních úhlů u zbylých vrcholů.'],
    steps: [`γ = 180° − ${st(al)} − ${st(be)} = ${st(180 - al - be)}`, `Vnější úhel: 180° − ${st(180 - al - be)} = ${st(al + be)}`, `(Rychleji: α + β = ${st(al)} + ${st(be)} = ${st(al + be)}.)`],
  });
  return N({
    text: `V trojúhelníku ABC má vnější úhel u vrcholu C (mezi stranou a prodloužením sousední strany) velikost ${B(st(al + be))} a α = ${B(st(al))}.`, q: 'Jak velký je úhel β?', fig: fTri(triAng(8, al, be), { angs: [st(al), '?', ''], ext: { at: 2, lab: st(al + be) } }), ans: be, unit: '°',
    hints: ['Vnější úhel u vrcholu C se rovná součtu vnitřních úhlů α a β.', 'β = vnější úhel − α'], steps: [`α + β = ${st(al + be)}`, `β = ${st(al + be)} − ${st(al)} = ${st(be)}`],
  });
}
function t_pravo() {
  const a = ri(15, 75);
  return N({
    text: `Pravoúhlý trojúhelník má jeden ostrý úhel ${B(st(a))}.`, q: 'Jak velký je druhý ostrý úhel?', fig: fTri(triAng(8, a, 90 - a), { angs: [st(a), '?', ''], right: 2 }), ans: 90 - a, unit: '°',
    traps: [[180 - a, 'Nezapomeň odečíst i pravý úhel, který má 90°.']],
    hints: ['Pravý úhel zabere 90° ze 180°.', 'Na oba ostré úhly zbývá dohromady 90°.'], steps: [`180° − 90° − ${st(a)} = ${st(90 - a)}`],
  });
}
function t_tretiStrana() {
  const a = ri(3, 8), bb = a + ri(1, 6), max = chance(0.5);
  return N({
    text: `Dvě strany trojúhelníku měří ${B(cm(a))} a ${B(cm(bb))}. Třetí strana měří celý počet centimetrů.`, q: max ? 'Jak dlouhá může být nejvýš?' : 'Jak dlouhá musí být nejméně?', ans: max ? a + bb - 1 : bb - a + 1, unit: 'cm',
    traps: max ? [[a + bb, `Při ${cm(a + bb)} by obě strany ležely přesně na třetí a trojúhelník by nevznikl.`]] : [[bb - a, `Při ${cm(bb - a)} by kratší strany dohromady daly přesně tu nejdelší a trojúhelník by nevznikl.`]],
    hints: ['Součet dvou kratších stran musí být větší než nejdelší strana.', max ? 'Třetí strana musí být kratší než součet zbylých dvou.' : 'Třetí strana musí být delší než rozdíl zbylých dvou.'],
    steps: max ? [`c < ${a} + ${bb} = ${a + bb}`, `Největší celé číslo menší než ${a + bb} je ${a + bb - 1}.`] : [`c > ${bb} − ${a} = ${bb - a}`, `Nejmenší celé číslo větší než ${bb - a} je ${bb - a + 1}.`],
  });
}
function t_tretiDM() {
  const a1 = ri(35, 70), m1 = ri(10, 55), a2 = ri(35, 70), m2 = ri(10, 55), s = 60 * (a1 + a2) + m1 + m2;
  return DM({
    text: `V trojúhelníku je α = ${B(sm(a1, m1))} a β = ${B(sm(a2, m2))}.`, q: 'Vypočítej úhel γ.', ans: 10800 - s,
    hints: ['γ = 180° − (α + β). Nejdřív sečti α a β.', '180° si napiš jako 179° 60′.'],
    steps: [`α + β = ${smT(s)}`, `γ = 179° 60′ − ${smT(s)} = ${smT(10800 - s)}`],
  });
}
function t_rameno() {
  const z = ri(4, 12), r = ri(Math.floor(z / 2) + 2, 14);
  return N({
    text: `Rovnoramenný trojúhelník má obvod ${B(cm(z + 2 * r))} a základnu (stranu, která není rameno) ${B(cm(z))}.`, q: 'Jak dlouhé je jedno rameno?', ans: r, unit: 'cm',
    traps: [[2 * r, 'To jsou obě ramena dohromady. Ještě je rozděl na dvě.']],
    hints: ['Obvod = základna + dvě stejná ramena.', 'Od obvodu odečti základnu a zbytek vyděl dvěma.'], steps: [`${z + 2 * r} − ${z} = ${2 * r}`, `${2 * r} : 2 = ${cm(r)}`],
  });
}
// --- úroveň 3 ---
function t_pomer() {
  const p = pick([[1, 2, 3], [2, 3, 4], [1, 1, 2], [2, 3, 5], [1, 4, 7], [5, 6, 7], [4, 5, 6], [1, 2, 6], [3, 4, 5], [2, 2, 5], [1, 3, 5]]), s = p[0] + p[1] + p[2], d = 180 / s, nej = chance(0.5);
  return N({
    text: `Vnitřní úhly trojúhelníku jsou v poměru ${B(p.join(' : '))}.`, q: `Jak velký je ${nej ? 'největší' : 'nejmenší'} z nich?`, ans: d * (nej ? p[2] : p[0]), unit: '°',
    hints: ['Poměr říká, na kolik stejných dílů se rozdělí 180°. Kolik dílů je to celkem?'],
    steps: [`Dílů celkem: ${p.join(' + ')} = ${s}`, `1 díl: 180° : ${s} = ${st(d)}`, `${nej ? 'Největší' : 'Nejmenší'} úhel: ${nej ? p[2] : p[0]} · ${st(d)} = ${st(d * (nej ? p[2] : p[0]))}`],
  });
}
function t_alg() {
  let x, k, d; do { x = ri(20, 40); k = pick([2, 3]); d = 180 - (k + 2) * x; } while (d < 5 || d > 60);
  const chci = pick(['β', 'γ']);
  return N({
    text: `V trojúhelníku ABC je úhel β o ${st(d)} větší než α a úhel γ je ${KRAT[k]} větší než α.`, q: `Vypočítej úhel ${chci}.`, ans: chci === 'β' ? x + d : k * x, unit: '°',
    hints: ['Všechny úhly vyjádři pomocí α a sečti je. Součet je 180°.'],
    steps: [`α + (α + ${st(d)}) + ${k}α = 180°`, `${k + 2}α = ${st(180 - d)}`, `α = ${st(x)}`, chci === 'β' ? `β = ${st(x)} + ${st(d)} = ${st(x + d)}` : `γ = ${k} · ${st(x)} = ${st(k * x)}`],
  });
}
function t_vnejsiRR() {
  const e = ri(100, 160);
  return N({
    text: `Vnější úhel při základně rovnoramenného trojúhelníku má ${B(st(e))}.`, q: 'Jak velký je vnitřní úhel při hlavním vrcholu?', ans: 2 * e - 180, unit: '°',
    hints: ['Vnější a vnitřní úhel u téhož vrcholu jsou vedlejší. Úhly při základně jsou shodné.'],
    steps: [`Vnitřní úhel při základně: 180° − ${st(e)} = ${st(180 - e)}`, `Úhel při hlavním vrcholu: 180° − 2 · ${st(180 - e)} = ${st(2 * e - 180)}`],
  });
}
function t_pocetDelek() {
  const a = ri(3, 7), bb = a + ri(1, 5);
  return N({
    text: `Dvě strany trojúhelníku měří ${cm(a)} a ${cm(bb)}. Třetí strana měří celý počet centimetrů.`, q: 'Kolik různých délek může třetí strana mít?', ans: 2 * a - 1,
    hints: ['Třetí strana musí být delší než rozdíl a kratší než součet zbylých dvou stran.'],
    steps: [`${bb} − ${a} < c < ${bb} + ${a}, tedy ${bb - a} < c < ${a + bb}`, `Vyhovují délky ${bb - a + 1} až ${a + bb - 1} cm.`, `Počet: ${a + bb - 1} − ${bb - a + 1} + 1 = ${2 * a - 1}`],
  });
}
function t_osyUhlu() {
  let al, be; do { al = 2 * ri(15, 40); be = 2 * ri(15, 40); } while (al + be > 150);
  return N({
    text: `V trojúhelníku ABC je α = ${st(al)} a β = ${st(be)}. Osy úhlů α a β se protínají v bodě S.`, q: 'Vypočítej velikost úhlu ASB.', ans: 180 - al / 2 - be / 2, unit: '°',
    hints: ['Dívej se na trojúhelník ABS. Jeho úhly u vrcholů A a B jsou poloviny úhlů α a β.'],
    steps: [`V trojúhelníku ABS: úhel u A je ${st(al / 2)}, úhel u B je ${st(be / 2)}.`, `|∢ASB| = 180° − ${st(al / 2)} − ${st(be / 2)} = ${st(180 - al / 2 - be / 2)}`],
  });
}
function t_vyskaUhel() {
  let al, be; do { al = ri(40, 80); be = ri(40, 80); } while (al + be < 100);
  return N({
    text: `V trojúhelníku ABC je α = ${st(al)} a β = ${st(be)}. Bod P je pata výšky z vrcholu C na stranu AB.`, q: 'Vypočítej velikost úhlu ACP.', ans: 90 - al, unit: '°',
    traps: [[(180 - al - be) / 2, 'Výška úhel γ obecně nepůlí. Půlila by ho jen v rovnoramenném trojúhelníku.']],
    hints: ['Výška je kolmá na stranu AB, takže trojúhelník APC je pravoúhlý. Úhel β je tu navíc.'],
    steps: ['Trojúhelník APC má u vrcholu P pravý úhel.', `|∢ACP| = 180° − 90° − ${st(al)} = ${st(90 - al)}`],
  });
}

// ======================= 604 TROJÚHELNÍK – KONSTRUKCE =======================
function kon_sss(mode) {
  const [a, bb, c] = trojStrany();
  return K({
    mode, tpl: 'tri', dano: { c: cm(c), a: cm(a), b: cm(bb) }, sestroj: '△ABC', text: `Sestroj trojúhelník ABC: c = ${B(cm(c))}, a = ${B(cm(a))}, b = ${B(cm(bb))}.`,
    plan: [{ op: 'seg', a: 'A', b: 'B', len: c }, { op: 'circ', name: 'k', c: 'A', r: bb }, { op: 'circ', name: 'l', c: 'B', r: a }, { op: 'int', name: 'C', of: ['k', 'l'] }, { op: 'poly', pts: ['A', 'B', 'C'] }],
    goal: [['dist', 'A', 'B', c], ['dist', 'B', 'C', a], ['dist', 'A', 'C', bb], ['poly', 'ABC']],
    lens: [c, a, bb], names: ['C'], ops: ['seg', 'circ', 'int', 'poly'], vysl: ['A', 'B', 'C'],
    nsol: 1, nsolProc: 'Kružnice k a l se v jedné polorovině protnou v jediném bodě, proto má úloha jedno řešení.',
    hints: ['Začni stranou AB. Bod C je od bodu A vzdálený b a od bodu B vzdálený a.', 'Všechny body, které jsou od A vzdálené b, leží na kružnici k(A; b). Bod C leží na dvou takových kružnicích zároveň.'],
  });
}
function kon_vyska(mode) {
  const t = trojStrany({ ostro: 1 });
  return K({
    mode, init: danyTroj(t), dano: ['△ABC (je narýsovaný)'], sestroj: `výšku ${SUB('v', 'c')}; P = pata výšky`, text: mode < 3 ? `Je dán trojúhelník ABC. Sestroj jeho výšku ${SUB('v', 'c')} (kolmici z vrcholu C na stranu AB). Patu výšky (bod, kde výška dopadne na stranu) označ P.` : `Je dán trojúhelník ABC. Sestroj jeho výšku ${SUB('v', 'c')} z vrcholu C na stranu AB. Patu výšky označ P.`,
    plan: [{ op: 'perp', name: 'p', thru: 'C', to: 'AB' }, { op: 'int', name: 'P', of: ['p', 'AB'] }, { op: 'seg', a: 'C', b: 'P' }],
    goal: [['foot', 'P', 'C', 'A', 'B'], ['segd', 'C', 'P']], names: ['P'], ops: ['perp', 'axis', 'mid', 'int', 'seg'],
    hints: ['Výška je kolmice z vrcholu na protější stranu.', 'Veď bodem C kolmici k přímce AB. Tam, kde protne AB, je pata výšky P.'],
  });
}
function kon_teznice(mode) {
  const t = trojStrany();
  return K({
    mode, init: danyTroj(t), dano: ['△ABC (je narýsovaný)'], sestroj: `těžnici ${SUB('t', 'c')}; S = střed strany AB`, text: mode < 3 ? `Je dán trojúhelník ABC. Sestroj jeho těžnici ${SUB('t', 'c')} (spojnici vrcholu C se středem strany AB). Střed strany AB označ S.` : `Je dán trojúhelník ABC. Sestroj jeho těžnici ${SUB('t', 'c')} z vrcholu C. Střed strany AB označ S.`,
    plan: [{ op: 'mid', name: 'S', a: 'A', b: 'B' }, { op: 'seg', a: 'C', b: 'S' }],
    goal: [['mid', 'S', 'A', 'B'], ['segd', 'C', 'S']], names: ['S'], ops: ['perp', 'mid', 'axis', 'int', 'seg'],
    hints: ['Těžnice spojuje vrchol se středem protější strany.', 'Najdi střed S strany AB a spoj ho s vrcholem C.'],
  });
}
function kon_opsana(mode) {
  const t = trojStrany({ ostro: 1 });
  return K({
    mode, init: danyTroj(t), dano: ['△ABC (je narýsovaný)'], sestroj: 'kružnici opsanou; S = její střed', text: 'Je dán trojúhelník ABC. Sestroj kružnici, která je mu opsaná (prochází všemi třemi vrcholy). Její střed označ S.',
    plan: [{ op: 'axis', name: 'o', a: 'A', b: 'B' }, { op: 'axis', name: 'p', a: 'B', b: 'C' }, { op: 'int', name: 'S', of: ['o', 'p'] }, { op: 'circ', name: 'k', c: 'S', r: { pp: ['S', 'A'] } }],
    goal: [['circ3', 'A', 'B', 'C']], names: ['S'], ops: ['axis', 'bis', 'mid', 'int', 'circ'],
    hints: ['Střed opsané kružnice je stejně daleko od všech tří vrcholů.', 'Body stejně vzdálené od A i B leží na ose úsečky AB. Střed S je průsečík os dvou stran. Poloměr je |SA|.'],
  });
}
function kon_vepsana(mode) {
  const t = trojStrany({ ostro: 1 });
  return K({
    mode, init: danyTroj(t), dano: ['△ABC (je narýsovaný)'], sestroj: 'kružnici vepsanou; S = její střed, P = bod dotyku se stranou AB', text: 'Je dán trojúhelník ABC. Sestroj kružnici, která je mu vepsaná (dotýká se všech tří stran). Střed označ S, bod dotyku se stranou AB označ P.',
    plan: [{ op: 'bis', name: 'o', v: 'A', a: 'B', b: 'C' }, { op: 'bis', name: 'p', v: 'B', a: 'A', b: 'C' }, { op: 'int', name: 'S', of: ['o', 'p'] },
      { op: 'perp', name: 'q', thru: 'S', to: 'AB' }, { op: 'int', name: 'P', of: ['q', 'AB'] }, { op: 'circ', name: 'k', c: 'S', r: { pp: ['S', 'P'] } }],
    goal: [['incirc', 'A', 'B', 'C']], names: ['S', 'P'], ops: ['axis', 'bis', 'perp', 'int', 'circ'],
    hints: ['Střed vepsané kružnice je stejně daleko od všech tří stran, leží tedy na osách úhlů.', 'Poloměr není |SA|. Je to vzdálenost středu od strany: veď z S kolmici na AB.'],
  });
}
function kon_teziste(mode) {
  const t = trojStrany();
  return K({
    mode, init: danyTroj(t), dano: ['△ABC (je narýsovaný)'], sestroj: 'těžiště T; S = střed strany AB, R = střed strany BC', text: 'Je dán trojúhelník ABC. Sestroj jeho těžiště T. Střed strany AB označ S, střed strany BC označ R.',
    plan: [{ op: 'mid', name: 'S', a: 'A', b: 'B' }, { op: 'mid', name: 'R', a: 'B', b: 'C' }, { op: 'seg', a: 'C', b: 'S' }, { op: 'seg', a: 'A', b: 'R' }, { op: 'int', name: 'T', of: ['CS', 'AR'] }],
    goal: [['centroid', 'T', 'A', 'B', 'C']], names: ['S', 'R', 'T'], ops: ['mid', 'axis', 'perp', 'int', 'seg'],
    hints: ['Těžiště je průsečík těžnic. Stačí sestrojit dvě.', 'Těžnice spojuje vrchol se středem protější strany.'],
  });
}
function k_zapis() {
  const x = pick([
    ['k(A; 5 cm)', 'kružnice k se středem A a poloměrem 5 cm', ['kružnice k s průměrem 5 cm, která prochází bodem A', 'úsečka z bodu k do bodu A dlouhá 5 cm', 'bod k vzdálený 5 cm od bodu A']],
    ['C ∈ k ∩ l', 'bod C leží na kružnici k i na kružnici l', ['bod C leží mezi kružnicemi k a l', 'kružnice k a l mají střed v bodě C', 'bod C neleží na k ani na l']],
    ['|AB| = 6 cm', 'úsečka AB je dlouhá 6 cm', ['body A a B leží 6 cm od sebe na kružnici', 'přímka AB je dlouhá 6 cm', 'úhel AB má 6 stupňů']],
    ['p ⊥ AB', 'přímka p je kolmá k přímce AB', ['přímka p je rovnoběžná s přímkou AB', 'přímka p prochází body A a B', 'přímka p je osa úhlu']],
    ['p ∥ AB', 'přímka p je rovnoběžná s přímkou AB', ['přímka p je kolmá k přímce AB', 'přímka p protíná úsečku AB', 'přímka p je stejně dlouhá jako AB']],
    ['C ∈ p', 'bod C leží na přímce p', ['bod C neleží na přímce p', 'přímka p je kratší než C', 'bod C je střed přímky p']],
  ]);
  return C({
    text: `V zápisu konstrukce stojí: ${B(x[0])}`, q: 'Co to znamená?', ok: x[1], bad: x[2],
    hints: ['Značky: ∈ „leží na“, ∩ „průnik (společné body)“, ⊥ „je kolmá“, ∥ „je rovnoběžná“, |AB| „délka úsečky AB“.', 'k(S; r) je kružnice k se středem S a poloměrem r.', 'Přečti zápis nahlas značku po značce.'],
    steps: [`${x[0]}: ${x[1]}.`],
  });
}
function k_pojmy() {
  const x = pick([
    ['Úsečka, která spojuje vrchol trojúhelníku se středem protější strany.', 'těžnice', 'Těžnice vede do středu protější strany. Kolmá na ni být nemusí.'],
    ['Kolmice vedená z vrcholu trojúhelníku na protější stranu.', 'výška', 'Výška je vždy kolmá na stranu. Do jejího středu vést nemusí.'],
    ['Přímka, která prochází středem strany a je k ní kolmá.', 'osa strany', 'Osa strany prochází středem strany a je k ní kolmá. Vrcholem procházet nemusí.'],
    ['Polopřímka, která vychází z vrcholu a dělí vnitřní úhel na dva stejné.', 'osa úhlu', 'Osa úhlu půlí úhel.'],
  ]);
  return C({
    text: x[0], q: 'Jak se jí říká?', ok: x[1], opts: ['těžnice', 'výška', 'osa strany', 'osa úhlu'],
    hints: ['Všímej si dvou věcí: odkud čára vychází a jestli je kolmá, nebo jde do středu.', 'Výška: z vrcholu kolmo na stranu. Těžnice: z vrcholu do středu strany. Osa strany: středem strany kolmo. Osa úhlu: půlí úhel.', x[2]],
    steps: [x[2]],
  });
}
function k_stredy() {
  const x = pick([['Střed kružnice opsané trojúhelníku', 'os stran', 'Střed opsané kružnice je stejně daleko od všech vrcholů, leží proto na osách stran.'],
    ['Střed kružnice vepsané trojúhelníku', 'os úhlů', 'Střed vepsané kružnice je stejně daleko od všech stran, leží proto na osách úhlů.'], ['Těžiště trojúhelníku', 'těžnic', 'Těžiště je průsečík těžnic.']]);
  return C({
    text: `${x[0]} je průsečík…`, q: 'Doplň větu.', ok: x[1], opts: ['os stran', 'os úhlů', 'těžnic', 'výšek'],
    hints: ['Opsaná kružnice prochází vrcholy, vepsaná se dotýká stran.', 'Stejně daleko od dvou bodů jsou body na ose úsečky. Stejně daleko od dvou ramen úhlu jsou body na ose úhlu.', x[2]], steps: [x[2]],
  });
}
function k_teziste() {
  const t = 3 * ri(2, 8), odV = chance(0.5);
  return N({
    text: `Těžnice ${SUB('t', 'c')} trojúhelníku ABC (spojnice vrcholu C se středem strany AB) měří ${B(cm(t))}.`, q: odV ? 'Jak daleko je těžiště od vrcholu C?' : 'Jak daleko je těžiště od středu strany AB?', ans: odV ? 2 * t / 3 : t / 3, unit: 'cm',
    traps: [[t / 2, 'Těžiště těžnici nepůlí. Dělí ji na třetiny: dvě jsou blíž k vrcholu, jedna ke straně.'], [odV ? t / 3 : 2 * t / 3, 'Pozor, delší díl (dvě třetiny) leží u vrcholu, kratší (jedna třetina) u strany.']],
    hints: ['Těžiště dělí každou těžnici v poměru 2 : 1. Delší díl je u vrcholu.', `Třetina těžnice je ${cm(t / 3)}.`],
    steps: [`Třetina těžnice: ${t} : 3 = ${cm(t / 3)}`, odV ? `Od vrcholu: 2 · ${cm(t / 3)} = ${cm(2 * t / 3)}` : `Od středu strany: ${cm(t / 3)}`],
  });
}

// ======================= 605 OBVOD A OBSAH =======================
function o_ctvObv() {
  const a = ri(3, 15);
  return N({
    text: `Čtverec má stranu ${B(cm(a))}.`, q: 'Vypočítej jeho obvod.', fig: fRect(a, a, { la: cm(a) }), ans: 4 * a, unit: 'cm',
    traps: [[a * a, 'To je obsah. Obvod je délka čáry kolem dokola: 4 · a.'], [2 * a, 'Čtverec má čtyři strany, ne dvě.']],
    hints: ['Obvod je délka celé čáry kolem útvaru. Jako kdybys čtverec obešel dokola.', 'Čtverec má čtyři stejné strany: o = 4 · a.', `o = 4 · ${a}`], steps: ['o = 4 · a', `o = 4 · ${a} = ${cm(4 * a)}`],
  });
}
function o_ctvObs() {
  const a = ri(3, 12);
  return N({
    text: `Čtverec má stranu ${B(cm(a))}.`, q: 'Vypočítej jeho obsah.', fig: fRect(a, a, { la: cm(a) }), ans: a * a, unit: 'cm²',
    traps: [[4 * a, 'To je obvod. Obsah říká, kolik čtverečků o straně 1 cm se dovnitř vejde: a · a.'], [2 * a, 'a · a není totéž co 2 · a.']],
    hints: ['Obsah říká, kolik čtverečků 1 cm × 1 cm se do útvaru vejde.', `Do čtverce se vejde ${a} řad po ${a} čtverečcích: S = a · a.`, `S = ${a} · ${a}`], steps: ['S = a · a', `S = ${a} · ${a} = ${cm2(a * a)}`],
  });
}
function o_obdObv() {
  const bb = ri(2, 9), a = bb + ri(1, 8);
  return N({
    text: `Obdélník má strany ${B(cm(a))} a ${B(cm(bb))}.`, q: 'Vypočítej jeho obvod.', fig: fRect(a, bb, { la: cm(a), lb: cm(bb) }), ans: 2 * (a + bb), unit: 'cm',
    traps: [[a * bb, 'To je obsah. Obvod je délka čáry kolem dokola.'], [a + bb, 'To je jen jedna délka a jedna šířka. Obdélník má strany čtyři.']],
    hints: ['Obvod je délka čáry kolem celého obdélníku.', 'Obdélník má dvě délky a dvě šířky: o = 2 · (a + b).', `o = 2 · (${a} + ${bb})`], steps: ['o = 2 · (a + b)', `o = 2 · (${a} + ${bb}) = 2 · ${a + bb} = ${cm(2 * (a + bb))}`],
  });
}
function o_obdObs() {
  const bb = ri(2, 9), a = bb + ri(1, 8);
  return N({
    text: `Obdélník má strany ${B(cm(a))} a ${B(cm(bb))}.`, q: 'Vypočítej jeho obsah.', fig: fRect(a, bb, { la: cm(a), lb: cm(bb) }), ans: a * bb, unit: 'cm²',
    traps: [[2 * (a + bb), 'To je obvod. Obsah obdélníku je a · b.'], [a + bb, 'Strany se násobí, nesčítají.']],
    hints: ['Obsah říká, kolik čtverečků 1 cm × 1 cm obdélník pokryje.', `Vejde se ${bb} řad po ${a} čtverečcích: S = a · b.`, `S = ${a} · ${bb}`], steps: ['S = a · b', `S = ${a} · ${bb} = ${cm2(a * bb)}`],
  });
}
function o_prevodD() {
  const [od, na, k] = pick([['cm', 'mm', 10], ['m', 'cm', 100], ['km', 'm', 1000], ['dm', 'cm', 10], ['m', 'dm', 10], ['m', 'mm', 1000]]), dolu = chance(0.35), x = ri(2, 30);
  const [z, c, v, ans] = dolu ? [na, od, x * k, x] : [od, na, x, x * k];
  return N({
    text: `Převeď: ${B(cz(v) + ' ' + z)}`, q: `Kolik je to ${c}?`, ans, unit: c,
    hints: ['Menší jednotek je vždy víc, větších míň.', `1 ${od} = ${k} ${na}`, dolu ? `${cz(v)} : ${k}` : `${v} · ${k}`], steps: [`1 ${od} = ${k} ${na}`, dolu ? `${cz(v)} ${z} = ${cz(v)} : ${k} = ${cz(ans)} ${c}` : `${v} ${z} = ${v} · ${k} = ${cz(ans)} ${c}`],
  });
}
// --- úroveň 2 ---
function o_stranaZObv() {
  const a = ri(3, 18);
  return N({
    text: `Čtverec má obvod ${B(cm(4 * a))}.`, q: 'Jak dlouhá je jeho strana?', ans: a, unit: 'cm', traps: [[2 * a, 'Čtverec má čtyři strany, obvod se dělí čtyřmi.']],
    hints: ['Obvod čtverce jsou čtyři stejné strany.', 'a = o : 4'], steps: ['o = 4 · a, proto a = o : 4', `a = ${4 * a} : 4 = ${cm(a)}`],
  });
}
function o_stranaZObs() {
  const a = ri(4, 12), bb = ri(3, 9);
  return N({
    text: `Obdélník má obsah ${B(cm2(a * bb))} a jednu stranu ${B(cm(a))}.`, q: 'Jak dlouhá je druhá strana?', fig: fRect(a, bb, { la: cm(a), lb: '?' }), ans: bb, unit: 'cm',
    hints: ['S = a · b. Známe S a a.', 'b = S : a'], steps: ['S = a · b, proto b = S : a', `b = ${a * bb} : ${a} = ${cm(bb)}`],
  });
}
function o_stranaZObvObd() {
  const a = ri(5, 14), bb = ri(2, a - 1), o = 2 * (a + bb);
  return N({
    text: `Obdélník má obvod ${B(cm(o))} a jednu stranu ${B(cm(a))}.`, q: 'Jak dlouhá je druhá strana?', fig: fRect(a, bb, { la: cm(a), lb: '?' }), ans: bb, unit: 'cm',
    traps: [[o - a, 'Obvod tvoří dvě délky a dvě šířky. Nejdřív ho vyděl dvěma.'], [o - 2 * a, 'Zbyly ti obě šířky dohromady. Ještě je rozděl na dvě.']],
    hints: ['Polovina obvodu je jedna délka a jedna šířka dohromady.', 'b = o : 2 − a'], steps: [`a + b = ${o} : 2 = ${a + bb}`, `b = ${a + bb} − ${a} = ${cm(bb)}`],
  });
}
function o_prevodS() {
  const [od, na, k] = pick([['cm²', 'mm²', 100], ['dm²', 'cm²', 100], ['m²', 'dm²', 100], ['m²', 'cm²', 10000], ['a', 'm²', 100], ['ha', 'a', 100], ['ha', 'm²', 10000]]), dolu = chance(0.35), x = ri(2, 25);
  const [z, c, v, ans] = dolu ? [na, od, x * k, x] : [od, na, x, x * k];
  return N({
    text: `Převeď: ${B(cz(v) + ' ' + z)}`, q: `Kolik je to ${c}?`, ans, unit: c,
    traps: dolu ? [] : [[x * Math.sqrt(k), 'U obsahu se převádí „na druhou“: například 1 cm² je čtvereček 10 mm × 10 mm, tedy 100 mm².']],
    hints: ['Jednotky obsahu jsou čtverečky. Čtverec 1 dm × 1 dm má 10 · 10 = 100 cm².', `1 ${od} = ${cz(k)} ${na}`], steps: [`1 ${od} = ${cz(k)} ${na}`, dolu ? `${cz(v)} ${z} = ${cz(v)} : ${cz(k)} = ${cz(ans)} ${c}` : `${v} ${z} = ${v} · ${cz(k)} = ${cz(ans)} ${c}`],
  });
}
function lTvar() { const A = ri(6, 12), Bv = ri(5, 9), c = ri(2, A - 3), d = ri(2, Bv - 2); return [A, Bv, c, d]; }
function o_L_obsah() {
  const [A, Bv, c, d] = lTvar(), S = A * Bv - c * d;
  return N({
    text: 'Vypočítej obsah útvaru na obrázku. Všechny úhly jsou pravé, rozměry jsou v centimetrech.', fig: fL(A, Bv, c, d, { bottom: A, left: Bv, top: A - c, right: Bv - d, split: 1 }), ans: S, unit: 'cm²',
    traps: [[A * Bv, 'To je obsah celého velkého obdélníku. Chybí odečíst vyříznutý roh.']],
    hints: ['Rozděl útvar čárkovanou čarou na dva obdélníky a jejich obsahy sečti.', `Levý obdélník má rozměry ${A - c} × ${Bv}, pravý ${c} × ${Bv - d}.`],
    steps: [`Levý obdélník: ${A - c} · ${Bv} = ${(A - c) * Bv}`, `Pravý obdélník: ${c} · ${Bv - d} = ${c * (Bv - d)}`, `S = ${(A - c) * Bv} + ${c * (Bv - d)} = ${cm2(S)}`],
  });
}
function o_L_obvod() {
  const [A, Bv, c, d] = lTvar();
  return N({
    text: 'Vypočítej obvod útvaru na obrázku. Všechny úhly jsou pravé, rozměry jsou v centimetrech.', fig: fL(A, Bv, c, d, { bottom: A, left: Bv, top: A - c, right: Bv - d }), ans: 2 * (A + Bv), unit: 'cm',
    traps: [[A + Bv + (A - c) + (Bv - d), 'Chybí dvě strany u vyříznutého rohu. Dopočítej je z ostatních rozměrů.']],
    hints: ['Nejdřív dopočítej dvě chybějící strany u vyříznutého rohu.', `Vodorovná chybějící strana: ${A} − ${A - c} = ${c}. Svislá: ${Bv} − ${Bv - d} = ${d}.`],
    steps: [`Chybějící strany: ${A} − ${A - c} = ${c} a ${Bv} − ${Bv - d} = ${d}`, `o = ${A} + ${Bv - d} + ${c} + ${d} + ${A - c} + ${Bv} = ${cm(2 * (A + Bv))}`],
  });
}
function o_ctvZObs() {
  const a = ri(3, 12);
  return N({
    text: `Čtverec má obsah ${B(cm2(a * a))}.`, q: 'Jaký má obvod?', ans: 4 * a, unit: 'cm', traps: [[a, 'To je strana čtverce. Ptáme se na obvod.']],
    hints: ['Nejdřív najdi stranu: které číslo vynásobené samo sebou dá obsah?', 'Pak o = 4 · a.'], steps: [`a · a = ${a * a}, proto a = ${cm(a)}`, `o = 4 · ${a} = ${cm(4 * a)}`],
  });
}
// --- úroveň 3 ---
function o_dlazdice() {
  const t = pick([20, 25, 30, 40, 50]), nx = ri(8, 20), ny = ri(6, 15), L = nx * t / 100, W = ny * t / 100, n = nx * ny, bal = pick([8, 10, 12]);
  return N({
    text: `Podlaha obdélníkové místnosti má rozměry ${cz(L)} m a ${cz(W)} m. Pokládají se na ni čtvercové dlaždice o straně ${t} cm. Dlaždice se prodávají v balení po ${bal} kusech.`, q: 'Kolik balení je potřeba koupit?', ans: Math.ceil(n / bal), unit: 'balení',
    traps: [[n, 'To je počet dlaždic. Ptáme se na počet balení.'], ...(n % bal ? [[Math.floor(n / bal), 'To by pár dlaždic chybělo. Balení musí být o jedno víc.']] : [])],
    hints: ['Převeď rozměry na centimetry a zjisti, kolik dlaždic se vejde do délky a do šířky.'],
    steps: [`${cz(L)} m = ${nx * t} cm → ${nx * t} : ${t} = ${nx} dlaždic`, `${cz(W)} m = ${ny * t} cm → ${ny * t} : ${t} = ${ny} dlaždic`, `Celkem: ${nx} · ${ny} = ${n} dlaždic`, `${n} : ${bal} = ${cz(n / bal, 2)} → ${Math.ceil(n / bal)} balení`],
  });
}
function o_plot() {
  const bb = ri(12, 30), a = bb + ri(4, 18), g = pick([3, 4, 5]), p = pick([85, 120, 145, 160]), d = 2 * (a + bb) - g;
  return N({
    text: `Obdélníkový pozemek má rozměry ${a} m a ${bb} m. Oplotí se pletivem, jen na bránu širokou ${g} m se pletivo nedává. Metr pletiva stojí ${p} Kč.`, q: 'Kolik korun bude pletivo stát?', ans: d * p, unit: 'Kč',
    traps: [[2 * (a + bb) * p, 'Od obvodu je potřeba odečíst šířku brány.'], [d, 'To je délka pletiva v metrech. Ptáme se na cenu.']],
    hints: ['Délka plotu je obvod pozemku bez brány.'], steps: [`o = 2 · (${a} + ${bb}) = ${2 * (a + bb)} m`, `Pletivo: ${2 * (a + bb)} − ${g} = ${d} m`, `Cena: ${d} · ${p} = ${cz(d * p)} Kč`],
  });
}
function o_delkaSirka() {
  const s = ri(3, 12), d = ri(2, 6), o = 2 * (2 * s + d);
  return N({
    text: `Obdélník má obvod ${cm(o)}. Jeho délka je o ${cm(d)} větší než šířka.`, q: 'Vypočítej jeho obsah.', ans: s * (s + d), unit: 'cm²', units: 1,
    hints: ['Polovina obvodu je délka a šířka dohromady. Když délku zkrátíš o rozdíl, zbydou dvě stejné šířky.'],
    steps: [`a + b = ${o} : 2 = ${2 * s + d}`, `Šířka: (${2 * s + d} − ${d}) : 2 = ${cm(s)}`, `Délka: ${s} + ${d} = ${cm(s + d)}`, `S = ${s + d} · ${s} = ${cm2(s * (s + d))}`],
  });
}
function o_stena() {
  const a = pick([3, 3.5, 4, 4.5, 5]), v = pick([2.5, 2.6, 2.8]), S = rd(a * v - 1.8 - 1.6, 2);
  return N({
    text: `Stěna pokoje je ${cz(a)} m dlouhá a ${cz(v)} m vysoká. Je v ní okno 1,2 m × 1,5 m a dveře 0,8 m × 2 m. Stěna se bude malovat (okno a dveře ne).`, q: 'Jak velká plocha se bude malovat?', ans: S, unit: 'm²', units: 1,
    traps: [[rd(a * v, 2), 'Od plochy stěny odečti okno a dveře.']],
    hints: ['Spočítej obsah celé stěny a odečti od něj obsah okna a dveří.'], steps: [`Stěna: ${cz(a)} · ${cz(v)} = ${cz(a * v)} m²`, 'Okno: 1,2 · 1,5 = 1,8 m²', 'Dveře: 0,8 · 2 = 1,6 m²', `S = ${cz(a * v)} − 1,8 − 1,6 = ${cz(S)} m²`],
  });
}
function o_stejnyObvod() {
  const s = ri(5, 12), d = ri(1, s - 2), a = s + d, bb = s - d;
  return N({
    text: `Čtverec a obdélník mají stejný obvod. Obdélník má strany ${cm(a)} a ${cm(bb)}.`, q: 'Vypočítej obsah čtverce.', ans: s * s, unit: 'cm²', units: 1,
    traps: [[a * bb, 'To je obsah obdélníku. Čtverec se stejným obvodem má obsah jiný.']],
    hints: ['Nejdřív spočítej obvod obdélníku. Ze stejného obvodu pak urči stranu čtverce.'], steps: [`o = 2 · (${a} + ${bb}) = ${cm(4 * s)}`, `Strana čtverce: ${4 * s} : 4 = ${cm(s)}`, `S = ${s} · ${s} = ${cm2(s * s)}`],
  });
}
function o_hektary() {
  const a = ri(10, 40) * 10, bb = ri(10, 30) * 10;
  return N({
    text: `Obdélníkové pole má rozměry ${a} m a ${bb} m.`, q: 'Jakou má výměru v hektarech?', ans: a * bb / 10000, unit: 'ha', units: 1,
    traps: [[a * bb / 100, 'To jsou ary. 1 ha = 100 a = 10 000 m².']],
    hints: ['Spočítej obsah v m². Hektar je čtverec 100 m × 100 m, tedy 10 000 m².'], steps: [`S = ${a} · ${bb} = ${cz(a * bb)} m²`, `1 ha = 10 000 m²`, `${cz(a * bb)} : 10 000 = ${cz(a * bb / 10000)} ha`],
  });
}

// ======================= 606 KRYCHLE A KVÁDR =======================
function k_krObjem() {
  const a = ri(2, 6);
  return N({
    text: `Krychle má hranu ${B(cm(a))}.`, q: 'Vypočítej její objem (kolik se do ní vejde).', fig: fCuboid(a, a, a, { la: cm(a) }), ans: a ** 3, unit: 'cm³',
    traps: [[3 * a, 'a · a · a není totéž co 3 · a.'], [6 * a * a, 'To je povrch. Objem říká, kolik kostiček 1 cm³ se dovnitř vejde.'], [a * a, 'To je obsah jedné stěny. Ještě vynásob výškou.']],
    hints: ['Objem říká, kolik kostiček o hraně 1 cm se do tělesa vejde.', `V jedné vrstvě je ${a} · ${a} kostiček a vrstev je ${a}: V = a · a · a.`, `V = ${a} · ${a} · ${a}`], steps: ['V = a · a · a', `V = ${a} · ${a} · ${a} = ${cm3(a ** 3)}`],
  });
}
function k_krPovrch() {
  const a = ri(2, 9);
  return N({
    text: `Krychle má hranu ${B(cm(a))}.`, q: 'Vypočítej její povrch (obsah všech stěn dohromady).', fig: fCuboid(a, a, a, { la: cm(a) }), ans: 6 * a * a, unit: 'cm²',
    traps: [[a ** 3, 'To je objem. Povrch je obsah všech stěn dohromady.'], [a * a, 'To je jen jedna stěna. Krychle jich má šest.'], [4 * a * a, 'Krychle má šest stěn: čtyři kolem dokola, dno a víko.']],
    hints: ['Povrch je obsah všech stěn dohromady. Jako papír, do kterého krychli zabalíš.', 'Krychle má 6 stejných čtvercových stěn: S = 6 · a · a.', `S = 6 · ${a} · ${a}`], steps: ['S = 6 · a · a', `S = 6 · ${a * a} = ${cm2(6 * a * a)}`],
  });
}
function k_kvObjem() {
  const [a, bb, c] = [ri(3, 9), ri(2, 7), ri(2, 6)];
  return N({
    text: `Kvádr má rozměry ${B(`${a} cm, ${bb} cm a ${c} cm`)}.`, q: 'Vypočítej jeho objem (kolik se do něj vejde).', fig: fCuboid(a, bb, c, { la: cm(a), lb: cm(bb), lc: cm(c) }), ans: a * bb * c, unit: 'cm³',
    traps: [[a + bb + c, 'Rozměry se násobí, nesčítají.'], [2 * (a * bb + bb * c + a * c), 'To je povrch. Objem je a · b · c.']],
    hints: ['Objem říká, kolik kostiček o hraně 1 cm se do kvádru vejde.', `Ve spodní vrstvě je ${a} · ${bb} kostiček, vrstev je ${c}: V = a · b · c.`, `V = ${a} · ${bb} · ${c}`], steps: ['V = a · b · c', `V = ${a} · ${bb} · ${c} = ${cm3(a * bb * c)}`],
  });
}
function k_pocty() {
  const [co, n, proc] = pick([['hran', 12, '4 hrany dole, 4 nahoře a 4 svislé.'], ['vrcholů', 8, '4 vrcholy dole a 4 nahoře.'], ['stěn', 6, 'Dno, víko a 4 stěny kolem dokola.']]), t = pick(['Krychle', 'Kvádr']);
  return N({
    text: `${t} na obrázku.`, q: `Kolik má ${co}?`, fig: t === 'Krychle' ? fCuboid(4, 4, 4) : fCuboid(6, 4, 3), ans: n,
    hints: ['Stěny jsou plochy, hrany jsou úsečky, kde se stěny stýkají, vrcholy jsou rohy.', 'Počítej po částech: nejdřív dole, pak nahoře, pak to, co je mezi.', proc], steps: [proc + ` Celkem ${n}.`],
  });
}
function k_prevodV1() {
  const [od, na, k] = pick([['dm³', 'l', 1], ['l', 'dm³', 1], ['dm³', 'cm³', 1000], ['m³', 'dm³', 1000], ['l', 'ml', 1000], ['hl', 'l', 100], ['cm³', 'ml', 1]]), x = ri(2, 12);
  return N({
    text: `Převeď: ${B(x + ' ' + od)}`, q: `Kolik je to ${na}?`, ans: x * k, unit: na,
    traps: k === 1000 ? [[x * 100, 'U objemu se převádí po tisících: krychle 1 dm × 1 dm × 1 dm má 10 · 10 · 10 = 1000 cm³.'], [x * 10, 'U objemu se převádí po tisících, ne po desítkách.']] : [],
    hints: ['Litr je přesně jeden decimetr krychlový: 1 l = 1 dm³. Mililitr je centimetr krychlový: 1 ml = 1 cm³.', `1 ${od} = ${cz(k)} ${na}`, `${x} · ${cz(k)}`], steps: [`1 ${od} = ${cz(k)} ${na}`, `${x} ${od} = ${cz(x * k)} ${na}`],
  });
}
// --- úroveň 2 ---
function k_kvPovrch() {
  const [a, bb, c] = [ri(3, 9), ri(2, 7), ri(2, 6)], S = 2 * (a * bb + bb * c + a * c);
  return N({
    text: `Kvádr má rozměry ${B(`${a} cm, ${bb} cm a ${c} cm`)}.`, q: 'Vypočítej jeho povrch.', fig: fCuboid(a, bb, c, { la: cm(a), lb: cm(bb), lc: cm(c) }), ans: S, unit: 'cm²',
    traps: [[a * bb * c, 'To je objem. Povrch je obsah všech šesti stěn.'], [S / 2, 'Každá stěna je na kvádru dvakrát (má protější stěnu). Ještě vynásob dvěma.']],
    hints: ['Kvádr má tři dvojice stejných stěn: a · b, b · c a a · c.', 'S = 2 · (a · b + b · c + a · c)'], steps: ['S = 2 · (a · b + b · c + a · c)', `S = 2 · (${a * bb} + ${bb * c} + ${a * c})`, `S = 2 · ${S / 2} = ${cm2(S)}`],
  });
}
function k_hranaZPovrchu() {
  const a = ri(2, 10);
  return N({
    text: `Krychle má povrch ${B(cm2(6 * a * a))}.`, q: 'Jak dlouhá je její hrana?', ans: a, unit: 'cm', traps: [[a * a, 'To je obsah jedné stěny. Hrana je číslo, které vynásobené samo sebou dá tento obsah.']],
    hints: ['Povrch je šest stejných čtverců. Jaký obsah má jeden?', 'Hrana je strana toho čtverce.'], steps: [`Jedna stěna: ${6 * a * a} : 6 = ${cm2(a * a)}`, `a · a = ${a * a}, proto a = ${cm(a)}`],
  });
}
function k_vyskaZObjemu() {
  const [a, bb, c] = [ri(3, 9), ri(2, 7), ri(2, 8)];
  return N({
    text: `Kvádr má objem ${B(cm3(a * bb * c))}. Jeho podstava (stěna, na které kvádr stojí) má rozměry ${B(`${a} cm a ${bb} cm`)}.`, q: 'Jak je kvádr vysoký?', ans: c, unit: 'cm',
    hints: ['V = a · b · c. Součin a · b je obsah podstavy.', 'Výška = objem : obsah podstavy'], steps: [`Obsah podstavy: ${a} · ${bb} = ${cm2(a * bb)}`, `c = ${a * bb * c} : ${a * bb} = ${cm(c)}`],
  });
}
function k_prevodV2() {
  const v = ri(0, 4);
  const [x, od, na, ans, jak] = [
    () => { const n = ri(2, 15); return [n, 'm³', 'l', n * 1000, '1 m³ = 1000 dm³ = 1000 l']; },
    () => { const n = ri(5, 95) * 100; return [n, 'cm³', 'dm³', n / 1000, '1 dm³ = 1000 cm³']; },
    () => { const n = ri(12, 95) * 10; return [n, 'l', 'hl', n / 100, '1 hl = 100 l']; },
    () => { const n = ri(2, 48) * 50; return [n, 'ml', 'l', n / 1000, '1 l = 1000 ml']; },
    () => { const n = ri(5, 60) * 100; return [n, 'dm³', 'm³', n / 1000, '1 m³ = 1000 dm³']; },
  ][v]();
  return N({
    text: `Převeď: ${B(cz(x) + ' ' + od)}`, q: `Kolik je to ${na}?`, ans, unit: na,
    hints: ['Jednotky objemu (mm³, cm³, dm³, m³) se převádějí po tisících. 1 l = 1 dm³, 1 hl = 100 l.', jak], steps: [jak, `${cz(x)} ${od} = ${cz(ans, 3)} ${na}`],
  });
}
function k_akvarium() {
  const a = ri(4, 10) * 10, bb = ri(2, 5) * 10, c = ri(2, 5) * 10, V = a * bb * c;
  return N({
    text: `Akvárium tvaru kvádru má vnitřní rozměry ${B(`${a} cm, ${bb} cm a ${c} cm`)}.`, q: 'Kolik litrů vody se do něj vejde?', fig: fCuboid(a, bb, c, { la: cm(a), lb: cm(bb), lc: cm(c) }), ans: V / 1000, unit: 'l',
    traps: [[V, 'To je objem v cm³. 1 litr je 1 dm³, tedy 1000 cm³.'], [V / 100, '1 litr je 1000 cm³, ne 100.']],
    hints: ['Spočítej objem v cm³ a převeď na litry.', '1 l = 1 dm³ = 1000 cm³. (Nebo rozměry rovnou převeď na dm.)'], steps: [`V = ${a} · ${bb} · ${c} = ${cz(V)} cm³`, `${cz(V)} cm³ = ${cz(V / 1000)} dm³ = ${cz(V / 1000)} l`],
  });
}
function k_hrany() {
  if (chance(0.5)) {
    const a = ri(3, 12);
    return N({ text: `Krychle má hranu ${B(cm(a))}. Z drátu se má udělat její kostra (model ze samých hran).`, q: 'Kolik centimetrů drátu je potřeba?', ans: 12 * a, unit: 'cm',
      traps: [[6 * a, 'Šest je počet stěn. Hran má krychle dvanáct.'], [8 * a, 'Osm je počet vrcholů. Hran má krychle dvanáct.']], hints: ['Kostru tvoří všechny hrany. Kolik jich krychle má?', 'Krychle má 12 stejných hran.'], steps: [`12 · ${a} = ${cm(12 * a)}`] });
  }
  const [a, bb, c] = [ri(4, 12), ri(3, 9), ri(2, 8)];
  return N({ text: `Kvádr má rozměry ${B(`${a} cm, ${bb} cm a ${c} cm`)}. Z drátu se má udělat jeho kostra (model ze samých hran).`, q: 'Kolik centimetrů drátu je potřeba?', ans: 4 * (a + bb + c), unit: 'cm',
    traps: [[a + bb + c, 'Každý rozměr je na kvádru čtyřikrát.'], [2 * (a + bb + c), 'Každý rozměr je na kvádru čtyřikrát, ne dvakrát.']], hints: ['Kvádr má 12 hran: čtyři délky, čtyři šířky a čtyři výšky.', '4 · (a + b + c)'], steps: [`4 · (${a} + ${bb} + ${c}) = 4 · ${a + bb + c} = ${cm(4 * (a + bb + c))}`] });
}
// --- úroveň 3 ---
function k_bazen() {
  const a = ri(8, 25), bb = ri(4, 10), h = pick([1.2, 1.5, 1.6, 1.8]), V = rd(a * bb * h, 1);
  return N({
    text: `Bazén tvaru kvádru má dno ${a} m × ${bb} m. Voda v něm sahá do výšky ${cz(h)} m.`, q: 'Kolik hektolitrů vody je v bazénu?', ans: rd(V * 10), unit: 'hl', units: 1,
    traps: [[V, 'To je objem v m³. 1 m³ = 1000 l = 10 hl.'], [V * 1000, 'To jsou litry. 1 hl = 100 l.']],
    hints: ['Objem vody spočítej v m³. 1 m³ = 1000 l a 1 hl = 100 l.'], steps: [`V = ${a} · ${bb} · ${cz(h)} = ${cz(V)} m³`, `${cz(V)} m³ = ${cz(V * 1000)} l = ${cz(V * 10)} hl`],
  });
}
function k_bezVika() {
  const [a, bb, c] = [ri(10, 30), ri(8, 20), ri(5, 15)], S = a * bb + 2 * a * c + 2 * bb * c;
  return N({
    text: `Krabice bez víka má tvar kvádru. Dno má rozměry ${a} cm a ${bb} cm, krabice je vysoká ${c} cm.`, q: 'Kolik kartonu je na ni potřeba? (Přehyby a lepení nepočítej.)', ans: S, unit: 'cm²', units: 1,
    traps: [[S + a * bb, 'Krabice nemá víko. Dno se počítá jen jednou.']],
    hints: ['Krabice bez víka má jen pět stěn: dno a čtyři boční.'], steps: [`Dno: ${a} · ${bb} = ${a * bb}`, `Boční stěny: 2 · ${a} · ${c} + 2 · ${bb} · ${c} = ${2 * a * c + 2 * bb * c}`, `S = ${a * bb} + ${2 * a * c + 2 * bb * c} = ${cz(S)} cm²`],
  });
}
function k_krychlicky() {
  const e = pick([2, 3, 5]), [x, y, z] = [ri(3, 8), ri(2, 6), ri(2, 5)];
  return N({
    text: `Krabice tvaru kvádru má vnitřní rozměry ${x * e} cm, ${y * e} cm a ${z * e} cm. Skládají se do ní kostky o hraně ${e} cm.`, q: 'Kolik kostek se do krabice vejde?', ans: x * y * z, unit: 'kostek',
    traps: [[x * y * z * e * e, 'Objem krabice je potřeba dělit objemem kostky, ne její hranou.']],
    hints: ['Zjisti, kolik kostek se vejde vedle sebe do délky, do šířky a do výšky.'], steps: [`Do délky: ${x * e} : ${e} = ${x}`, `Do šířky: ${y * e} : ${e} = ${y}`, `Do výšky: ${z * e} : ${e} = ${z}`, `Celkem: ${x} · ${y} · ${z} = ${x * y * z} kostek`],
  });
}
function k_hladina() {
  const a = ri(4, 8) * 10, bb = ri(2, 4) * 10, h = ri(2, 6) * 5, V = a * bb * h / 1000;
  return N({
    text: `Do prázdného akvária se dnem ${a} cm × ${bb} cm nalijeme ${cz(V)} l vody.`, q: 'Jak vysoko bude voda sahat?', ans: h, unit: 'cm', units: 1,
    hints: ['Voda v akváriu má tvar kvádru. Jeho objem znáš, podstavu taky. 1 l = 1000 cm³.'], steps: [`${cz(V)} l = ${cz(V * 1000)} cm³`, `Obsah dna: ${a} · ${bb} = ${cz(a * bb)} cm²`, `Výška: ${cz(V * 1000)} : ${cz(a * bb)} = ${cm(h)}`],
  });
}
function k_stejnyObjem() {
  const [e, r] = pick([[4, [2, 4, 8]], [6, [4, 6, 9]], [6, [3, 8, 9]], [6, [2, 9, 12]], [6, [3, 6, 12]], [8, [4, 8, 16]], [10, [5, 10, 20]], [10, [4, 10, 25]], [12, [8, 12, 18]], [12, [9, 12, 16]]]);
  return N({
    text: `Kvádr má rozměry ${r[0]} cm, ${r[1]} cm a ${r[2]} cm. Krychle má stejný objem jako tento kvádr.`, q: 'Vypočítej povrch krychle.', ans: 6 * e * e, unit: 'cm²', units: 1,
    hints: ['Spočítej objem kvádru. Hrana krychle je číslo, které třikrát vynásobené samo sebou dá tento objem.'],
    steps: [`V = ${r[0]} · ${r[1]} · ${r[2]} = ${cz(e ** 3)} cm³`, `a · a · a = ${cz(e ** 3)}, proto a = ${cm(e)}`, `S = 6 · ${e} · ${e} = ${cm2(6 * e * e)}`],
  });
}
function k_natirani() {
  const a = ri(6, 12), bb = ri(3, 6), c = pick([1.5, 2]), S = rd(a * bb + 2 * c * (a + bb), 1);
  return N({
    text: `Prázdný bazén tvaru kvádru má dno ${a} m × ${bb} m a je hluboký ${cz(c)} m. Natírá se dno a všechny čtyři stěny.`, q: 'Jak velká plocha se bude natírat?', ans: S, unit: 'm²', units: 1,
    traps: [[rd(2 * (a * bb + c * (a + bb)), 1), 'Bazén nemá víko. Dno se počítá jen jednou.']],
    hints: ['Natírá se dno (jednou) a čtyři stěny. Protější stěny jsou stejné.'], steps: [`Dno: ${a} · ${bb} = ${a * bb} m²`, `Stěny: 2 · ${a} · ${cz(c)} + 2 · ${bb} · ${cz(c)} = ${cz(2 * c * (a + bb))} m²`, `S = ${a * bb} + ${cz(2 * c * (a + bb))} = ${cz(S)} m²`],
  });
}

// ======================= VÝKLAD =======================
const ukazkaSSS = () => kSvg(kProved([{ op: 'seg', a: 'A', b: 'B', len: 6 }, { op: 'circ', name: 'k', c: 'A', r: 5 }, { op: 'circ', name: 'l', c: 'B', r: 4 }, { op: 'int', name: 'C', of: ['k', 'l'] }, { op: 'poly', pts: ['A', 'B', 'C'] }]), { H: 220 });
const ukazkaSit = () => { const t = { cols: 9, rows: 6, osa: { typ: 'v', k: 4 }, body: [[1, 1], [3, 2], [2, 4]], jmena: ['A', 'B', 'C'], uzavrit: true }; return gridSvg(t, [], [[7, 1], [5, 2], [6, 4]]); };

export const R6 = { rocnik: 6, temata: [
  { id: '601', nazev: 'Úhly', ikona: '∠', popis: 'Druhy úhlů, vedlejší a vrcholové úhly, stupně a minuty', strazce: 'Úhloun',
    vyklad: [
      { h: 'Co je úhel', t: 'Vezmi dvě polopřímky, které začínají ve stejném bodě. Ten bod je <b>vrchol</b>, polopřímky jsou <b>ramena</b>. Kus roviny mezi rameny je <b>úhel</b>.<br><br>Velikost úhlu říká, jak moc jsou ramena rozevřená. Měří se ve <b>stupních</b> (značka °) úhloměrem. Celá otočka dokola má 360°.', fig: () => fAngle(50, 'α') },
      { h: 'Čtyři druhy úhlů', t: '<b>Pravý</b> úhel má přesně 90°. Vypadá jako roh sešitu a značí se malým čtverečkem.<br><b>Ostrý</b> úhel je menší než 90°.<br><b>Tupý</b> úhel je větší než 90° a menší než 180°.<br><b>Přímý</b> úhel má 180°: jeho ramena tvoří přímku.', fig: () => fAngle(125, 'tupý') },
      { h: 'Vedlejší úhly', t: 'Když na přímku postavíš polopřímku, vzniknou dva úhly vedle sebe. Říká se jim <b>vedlejší</b>. Dohromady tvoří přímý úhel, takže platí:<br><br><b>α + β = 180°</b><br><br>Když má jeden 130°, druhý musí mít 180° − 130° = 50°.', fig: () => fAnglePair('ved', 50, '50°', '130°') },
      { h: 'Vrcholové úhly', t: 'Když se protnou dvě přímky, vzniknou čtyři úhly. Dva, které leží <b>proti sobě</b>, jsou <b>vrcholové</b> a jsou vždy <b>stejně velké</b>.', fig: () => fAnglePair('vrch', 55, 'α', 'β') },
      { h: 'Stupně a minuty', t: 'Stupeň je někdy moc hrubý, proto se dělí na 60 menších dílků – <b>minut</b> (značka ′).<br><br><b>1° = 60′</b><br><br>Při sčítání počítej stupně a minuty zvlášť. Když minut vyjde 60 nebo víc, vyměň 60′ za 1°.<br>Příklad: 20° 45′ + 10° 30′ = 30° 75′ = 31° 15′.' },
      { h: 'Úhly u rovnoběžek', t: 'Když dvě rovnoběžky protne třetí přímka (příčka), vzniknou u každé rovnoběžky čtyři úhly. Úhly „na stejném místě“ u obou rovnoběžek jsou <b>souhlasné</b>. Úhly mezi rovnoběžkami na opačných stranách příčky jsou <b>střídavé</b>.<br><br>Souhlasné i střídavé úhly jsou <b>stejně velké</b>.', fig: () => fParallel(60, 'souhl', 'α', 'β') },
    ],
    u: [[uh_druh, uh_ved1, uh_vrch1, uh_dopl, uh_min1, uh_soucet1], [uh_soucDM, uh_rozdDM, uh_osa, uh_vedDM, uh_dvaVrch, uh_rovnob, uh_nasob], [uh_hodiny, uh_rovnobDM, uh_vedRozdil, uh_vedNasobek, uh_polovina, uh_triDily]],
    rychle: [uh_druh, uh_ved1, uh_vrch1, uh_dopl, uh_min1] },
  { id: '602', nazev: 'Osová souměrnost', ikona: '⇋', popis: 'Obraz v zrcadle, osy souměrnosti útvarů', strazce: 'Zrcadlák',
    vyklad: [
      { h: 'Jako v zrcadle', t: 'Polož na papír zrcátko. Co je před ním, vidíš i „za ním“. Přesně to dělá <b>osová souměrnost</b>. Čára, kde zrcátko stojí, je <b>osa souměrnosti</b> (značí se o).<br><br>Původnímu bodu říkáme <b>vzor</b> (A), jeho odrazu <b>obraz</b> (A′, čti „á s čárkou“).', fig: ukazkaSit },
      { h: 'Jak najít obraz bodu', t: '1. Jdi od bodu <b>kolmo</b> k ose a počítej čtverečky.<br>2. Pokračuj za osu <b>stejný počet</b> čtverečků.<br>3. Tam leží obraz.<br><br>Vzor i obraz jsou od osy vždy stejně daleko, každý na jiné straně. Bod, který leží přímo na ose, zůstane na místě – je <b>samodružný</b>.' },
      { h: 'Obraz je stejný, jen převrácený', t: 'Osová souměrnost nic nezvětšuje ani nezmenšuje. Obraz úsečky je stejně dlouhý, obraz úhlu stejně velký, obraz trojúhelníku má stejný obvod i obsah. Proto se jí říká <b>shodné zobrazení</b>.' },
      { h: 'Osově souměrné útvary', t: 'Některé útvary jdou přeložit tak, že se obě půlky přesně kryjí. Čára přehybu je jejich osa souměrnosti.<br><br>Čtverec má 4 osy, obdélník 2, rovnostranný trojúhelník 3, rovnoramenný trojúhelník 1, kruh nekonečně mnoho. Kosodélník nemá žádnou.', fig: () => fShape('ctverec', { osy: 1 }) },
    ],
    u: [[os_bod1, os_pocet, os_vzd, os_pismeno, os_samodruzny, os_usecka1], [os_troj, os_naose, os_shodnost, os_pocet2, os_troj], [os_diag, os_pres, os_diag4, os_slovni, os_soucet, os_uhel]],
    rychle: [os_vzd, os_pismeno] },
  { id: '603', nazev: 'Trojúhelník: úhly a strany', ikona: '△', popis: 'Součet úhlů, druhy trojúhelníků, trojúhelníková nerovnost', strazce: 'Trojhran',
    vyklad: [
      { h: 'Jak se trojúhelník popisuje', t: 'Trojúhelník má tři <b>vrcholy</b> (A, B, C), tři <b>strany</b> a tři <b>vnitřní úhly</b>.<br><br>Strana leží vždy <b>naproti</b> vrcholu se stejným písmenem: strana a naproti vrcholu A, strana b naproti B, strana c naproti C.<br>Úhel u vrcholu A je α (alfa), u B je β (beta), u C je γ (gama).', fig: () => fTri(triSSS(5, 6, 7), { sides: ['c', 'a', 'b'], angs: ['α', 'β', 'γ'] }) },
      { h: 'Součet úhlů je vždy 180°', t: 'Odtrhni z papírového trojúhelníku všechny tři rohy a přilož je k sobě. Složí přímý úhel. Platí to pro každý trojúhelník:<br><br><b>α + β + γ = 180°</b><br><br>Když znáš dva úhly, třetí dopočítáš: γ = 180° − α − β.', fig: () => fTri(triAng(8, 50, 60), { angs: ['50°', '60°', '70°'] }) },
      { h: 'Druhy trojúhelníků', t: 'Podle <b>stran</b>: rovnostranný (tři stejné strany), rovnoramenný (dvě stejné – ramena, třetí je základna), různostranný.<br><br>Podle <b>úhlů</b>: ostroúhlý (všechny úhly ostré), pravoúhlý (jeden pravý), tupoúhlý (jeden tupý).<br><br>V rovnoramenném trojúhelníku jsou úhly při základně stejné. V rovnostranném má každý úhel 60°.' },
      { h: 'Ne ze všeho jde trojúhelník', t: 'Zkus z úseček 3 cm, 4 cm a 9 cm složit trojúhelník. Nejde to: dvě kratší na sebe nedosáhnou.<br><br><b>Trojúhelníková nerovnost:</b> součet dvou kratších stran musí být <b>větší</b> než nejdelší strana.<br>3 + 4 = 7 a to není víc než 9, proto trojúhelník nevznikne.' },
      { h: 'Vnější úhel', t: 'Když jednu stranu prodloužíš za vrchol, vznikne <b>vnější úhel</b>. S vnitřním úhlem u téhož vrcholu je vedlejší (dohromady 180°).<br><br>Šikovné pravidlo: vnější úhel se rovná <b>součtu dvou vnitřních úhlů u zbylých vrcholů</b>.', fig: () => fTri(triAng(8, 50, 60), { angs: ['50°', '60°', ''], ext: { at: 2, lab: '110°' } }) },
    ],
    u: [[t_treti, t_druhU, t_druhS, t_nerovnost, t_obvod, t_fakta], [t_rovnoram, t_vnejsi, t_pravo, t_tretiStrana, t_tretiDM, t_rameno], [t_pomer, t_alg, t_vnejsiRR, t_pocetDelek, t_osyUhlu, t_vyskaUhel]],
    rychle: [t_treti, t_druhU, t_druhS, t_nerovnost, t_fakta] },
  { id: '604', nazev: 'Trojúhelník: konstrukce', ikona: '✎', popis: 'Konstrukce ze tří stran, výšky, těžnice, kružnice opsaná a vepsaná', strazce: 'Kružidlák', kon: 1,
    vyklad: [
      { h: 'Rýsujeme podle plánu', t: 'Konstrukční úloha má tři kroky:<br><b>1. Náčrtek</b> – od ruky nakreslíš, jak má útvar vypadat, a barevně vyznačíš, co znáš.<br><b>2. Zápis postupu</b> – krátkými značkami zapíšeš, co za čím narýsuješ.<br><b>3. Konstrukce</b> – podle zápisu rýsuješ pravítkem a kružítkem.<br><br>Tady rýsuje aplikace: narýsuje přesně to, co zapíšeš.', fig: () => nacrtekSvg('tri', ['a', 'b', 'c']) },
      { h: 'Značky v zápisu', t: '<b>AB; |AB| = 6 cm</b> … úsečka AB dlouhá 6 cm<br><b>k; k(A; 5 cm)</b> … kružnice k se středem A a poloměrem 5 cm<br><b>C ∈ k</b> … bod C leží na kružnici k<br><b>k ∩ l</b> … společné body k a l (průsečíky)<br><b>p ⊥ AB</b> … p je kolmá k AB<br><b>p ∥ AB</b> … p je rovnoběžná s AB<br><b>△ABC</b> … trojúhelník ABC' },
      { h: 'Trojúhelník ze tří stran', t: 'Máme c = 6 cm, b = 5 cm, a = 4 cm.<br>1. Narýsuj stranu AB dlouhou 6 cm.<br>2. Bod C má být od A přesně 5 cm. Všechny takové body leží na kružnici k(A; 5 cm).<br>3. Od B má být 4 cm: kružnice l(B; 4 cm).<br>4. Bod C je tam, kde se kružnice protnou.<br>5. Spoj body a máš △ABC.', fig: ukazkaSSS },
      { h: 'Výška a těžnice', t: '<b>Výška</b> je kolmice z vrcholu na protější stranu. Bodu, kam dopadne, se říká pata výšky.<br><b>Těžnice</b> spojuje vrchol se <b>středem</b> protější strany.<br><br>Trojúhelník má tři výšky a tři těžnice. Těžnice se protínají v <b>těžišti</b>; to dělí každou těžnici na dva díly v poměru 2 : 1 (delší díl je u vrcholu).', fig: () => fTri(triSSS(5, 6, 7), { h: { from: 2, lab: 'v' }, sides: ['c', '', ''] }) },
      { h: 'Kružnice opsaná a vepsaná', t: '<b>Opsaná</b> kružnice prochází všemi třemi vrcholy. Její střed je stejně daleko od všech vrcholů, proto leží v průsečíku <b>os stran</b>.<br><br><b>Vepsaná</b> kružnice se dotýká všech tří stran zevnitř. Její střed je stejně daleko od všech stran, proto leží v průsečíku <b>os úhlů</b>.' },
    ],
    u: [[() => kon_sss(1), k_zapis, k_pojmy, k_stredy, () => kon_vyska(1), () => kon_teznice(1)], [() => kon_sss(2), () => kon_teznice(2), () => kon_opsana(2), () => kon_vyska(2), k_teziste, k_stredy], [() => kon_sss(3), () => kon_opsana(3), () => kon_vepsana(3), () => kon_teziste(3)]],
    rychle: [k_pojmy, k_stredy, k_zapis] },
  { id: '605', nazev: 'Obvod a obsah', ikona: '▭', popis: 'Čtverec, obdélník, složené útvary, jednotky délky a obsahu', strazce: 'Plochožrout',
    vyklad: [
      { h: 'Obvod: cesta kolem', t: '<b>Obvod</b> je délka čáry kolem celého útvaru. Představ si, že útvar obejdeš dokola a měříš, jak dlouhá ta cesta je.<br><br>Čtverec má čtyři stejné strany: <b>o = 4 · a</b><br>Obdélník má dvě délky a dvě šířky: <b>o = 2 · (a + b)</b><br><br>Obvod se měří v jednotkách délky: mm, cm, dm, m, km.', fig: () => fRect(6, 4, { la: 'a', lb: 'b' }) },
      { h: 'Obsah: kolik čtverečků', t: '<b>Obsah</b> říká, jak velkou plochu útvar zabírá. Počítáme, kolik čtverečků o straně 1 cm se do něj vejde. Jeden takový čtvereček je <b>1 cm²</b> (centimetr čtvereční).<br><br>Do obdélníku 5 cm × 3 cm se vejdou 3 řady po 5 čtverečcích, tedy 15 cm².<br><br>Obdélník: <b>S = a · b</b><br>Čtverec: <b>S = a · a</b>', fig: () => fRect(5, 3, { la: '5 cm', lb: '3 cm' }) },
      { h: 'Obvod a obsah se nesmí plést', t: 'Obvod je <b>čára</b> (plot kolem zahrady), měří se v cm, m.<br>Obsah je <b>plocha</b> (trávník na zahradě), měří se v cm², m².<br><br>Čtverec se stranou 4 cm má obvod 16 cm a obsah 16 cm². Čísla vyšla stejně jen náhodou – jsou to úplně jiné věci.' },
      { h: 'Jednotky obsahu', t: 'Čtverec 1 cm × 1 cm má stranu 10 mm, takže se do něj vejde 10 · 10 = 100 čtverečků 1 mm².<br><br><b>1 cm² = 100 mm²</b>, <b>1 dm² = 100 cm²</b>, <b>1 m² = 100 dm²</b><br><br>U obsahu se tedy převádí po stovkách. Pro pozemky: <b>1 a = 100 m²</b> (ar), <b>1 ha = 100 a</b> (hektar).' },
      { h: 'Složené útvary', t: 'Útvar ve tvaru písmene L není obdélník, ale jde rozdělit na dva obdélníky. Spočítej obsah každého a sečti je.<br><br>Jiná cesta: spočítej velký obdélník a odečti vyříznutý roh.', fig: () => fL(8, 6, 3, 2, { bottom: 8, left: 6, top: 5, right: 4, split: 1 }) },
    ],
    u: [[o_ctvObv, o_ctvObs, o_obdObv, o_obdObs, o_prevodD], [o_stranaZObv, o_stranaZObs, o_stranaZObvObd, o_prevodS, o_L_obsah, o_L_obvod, o_ctvZObs], [o_dlazdice, o_plot, o_delkaSirka, o_stena, o_stejnyObvod, o_hektary]],
    rychle: [o_ctvObv, o_ctvObs, o_obdObv, o_obdObs, o_prevodD, o_stranaZObv] },
  { id: '606', nazev: 'Krychle a kvádr', ikona: '⬚', popis: 'Povrch, objem a jednotky objemu', strazce: 'Krychlomor',
    vyklad: [
      { h: 'Tělesa mají tři rozměry', t: 'Krychle a kvádr jsou <b>tělesa</b>: mají délku, šířku i výšku.<br><br><b>Stěny</b> jsou plochy (krychle i kvádr jich mají 6).<br><b>Hrany</b> jsou úsečky, kde se dvě stěny stýkají (je jich 12).<br><b>Vrcholy</b> jsou rohy (je jich 8).<br><br>Krychle má všechny hrany stejně dlouhé. Kvádr má tři rozměry: a, b, c.', fig: () => fCuboid(6, 4, 3, { la: 'a', lb: 'b', lc: 'c' }) },
      { h: 'Povrch: balicí papír', t: '<b>Povrch</b> je obsah všech stěn dohromady. Je to plocha papíru, do kterého těleso přesně zabalíš.<br><br>Krychle má 6 stejných čtverců: <b>S = 6 · a · a</b><br>Kvádr má tři dvojice stejných obdélníků: <b>S = 2 · (a · b + b · c + a · c)</b><br><br>Povrch je plocha, měří se v cm², m².' },
      { h: 'Objem: kolik se vejde', t: '<b>Objem</b> říká, kolik místa těleso zabírá. Počítáme, kolik kostiček o hraně 1 cm se do něj vejde. Jedna taková kostička je <b>1 cm³</b> (centimetr krychlový).<br><br>Kvádr 4 × 3 × 2: ve spodní vrstvě je 4 · 3 = 12 kostiček, vrstvy jsou 2, celkem 24 cm³.<br><br>Kvádr: <b>V = a · b · c</b><br>Krychle: <b>V = a · a · a</b>', fig: () => fCuboid(4, 3, 2, { la: '4', lb: '3', lc: '2' }) },
      { h: 'Jednotky objemu a litry', t: 'Krychle 1 dm × 1 dm × 1 dm má hranu 10 cm, vejde se do ní 10 · 10 · 10 = 1000 kostiček 1 cm³.<br><br><b>1 dm³ = 1000 cm³</b>, <b>1 m³ = 1000 dm³</b><br><br>U objemu se převádí po tisících.<br><br>Tekutiny měříme v litrech: <b>1 l = 1 dm³</b>, <b>1 ml = 1 cm³</b>, <b>1 hl = 100 l</b>.' },
    ],
    u: [[k_krObjem, k_krPovrch, k_kvObjem, k_pocty, k_prevodV1], [k_kvPovrch, k_hranaZPovrchu, k_vyskaZObjemu, k_prevodV2, k_akvarium, k_hrany], [k_bazen, k_bezVika, k_krychlicky, k_hladina, k_stejnyObjem, k_natirani]],
    rychle: [k_krObjem, k_krPovrch, k_kvObjem, k_pocty, k_prevodV1] },
] };

// úlohy pro souhrnné opakování v 9. ročníku
export const MIX6 = { u1: [t_treti, o_obdObv, o_obdObs, k_kvObjem, uh_ved1], u2: [t_rovnoram, t_vnejsi, o_L_obsah, k_kvPovrch, k_akvarium] };
