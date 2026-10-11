// 7. ročník: shodnost trojúhelníků, středová souměrnost, rovnoběžníky, obsah trojúhelníku a lichoběžníku,
// konstrukce čtyřúhelníků, hranoly.
import { ri, pick, chance, shuffle, sample, cz, rd } from './util.js';
import { N, C, GR, K, sit } from './ulohy.js';
import { fTri, triAng, triSSS, fRightTri, fRect, fPar, fRhomb, fTrap, fPrism, fShape, gridSvg } from './fig.js';
import { nacrtekSvg, kSvg, kProved } from './kon.js';
import { cm, cm2, cm3, st, B, SUB, trojStrany, TVAR_V } from './pom.js';
const VA = 'v<tspan dy="3" font-size="9">a</tspan>';

// ======================= 701 SHODNOST TROJÚHELNÍKŮ =======================
const VETY = [['sss', 've všech třech stranách', 'tři strany'], ['sus', 've dvou stranách a v úhlu, který tyto strany svírají', 'dvě strany a úhel mezi nimi'], ['usu', 'v jedné straně a v obou úhlech, které k ní přiléhají', 'stranu a dva úhly u ní']];
function sh_veta() {
  const [v, co, kratce] = pick(VETY);
  return C({
    text: `Dva trojúhelníky se shodují ${B(co)}.`, q: 'Podle které věty jsou shodné?', ok: v, opts: ['sss', 'sus', 'usu'],
    hints: ['Věta má jméno podle toho, co se porovnává: s znamená stranu, u znamená úhel.', 'Pořadí písmen říká, jak prvky leží za sebou: v „sus“ je úhel mezi dvěma stranami, v „usu“ je strana mezi dvěma úhly.', `Porovnáváme ${kratce}.`],
    steps: [`Porovnáváme ${kratce} → věta ${v}.`],
  });
}
function sh_strana() {
  const [a, bb, c] = trojStrany(), k = ri(0, 2), [ot, ans, odp] = [['KL', c, 'AB'], ['LM', a, 'BC'], ['KM', bb, 'AC']][k];
  return N({
    text: `Trojúhelníky ABC a KLM jsou shodné: ${B('△ABC ≅ △KLM')} (A odpovídá K, B odpovídá L, C odpovídá M). Platí |AB| = ${cm(c)}, |BC| = ${cm(a)}, |AC| = ${cm(bb)}.`, q: `Jak dlouhá je strana ${ot}?`, ans, unit: 'cm',
    hints: ['Shodné trojúhelníky se dají položit na sebe tak, že se přesně kryjí.', 'Záleží na pořadí vrcholů v zápisu: A patří ke K, B k L, C k M.', `Strana ${ot} odpovídá straně ${odp}.`],
    steps: ['A ↔ K, B ↔ L, C ↔ M', `|${ot}| = |${odp}| = ${cm(ans)}`],
  });
}
function sh_uhel() {
  let al, be; do { al = ri(35, 80); be = ri(35, 80); } while (al === be || 180 - al - be < 25);
  const ga = 180 - al - be, k = ri(0, 2), [vr, ans, odp] = [['K', al, 'A'], ['L', be, 'B'], ['M', ga, 'C']][k];
  return N({
    text: `Platí ${B('△ABC ≅ △KLM')} (trojúhelníky jsou shodné: A odpovídá K, B odpovídá L, C odpovídá M). V trojúhelníku ABC je α = ${st(al)} a β = ${st(be)}.`, q: `Jak velký je úhel u vrcholu ${vr}?`, ans, unit: '°',
    traps: k === 2 ? [[al, 'Vrchol M odpovídá vrcholu C, ne A.'], [al + be, 'Ještě odečti od 180°.']] : [],
    hints: ['Shodné trojúhelníky mají stejné strany i stejné úhly.', 'Vrcholy si odpovídají podle pořadí v zápisu: A ↔ K, B ↔ L, C ↔ M.', k === 2 ? `Úhel u M je stejný jako γ = 180° − ${st(al)} − ${st(be)}.` : `Úhel u ${vr} je stejný jako úhel u ${odp}.`],
    steps: k === 2 ? [`γ = 180° − ${st(al)} − ${st(be)} = ${st(ga)}`, `Úhel u M = γ = ${st(ga)}`] : [`${vr} ↔ ${odp}, proto úhel u ${vr} = ${st(ans)}`],
  });
}
function sh_urceni() {
  const [co, ok, proc] = pick([
    ['tři strany (které splňují trojúhelníkovou nerovnost)', 'Ano', 'Tři strany určují trojúhelník jednoznačně (věta sss).'],
    ['dvě strany a úhel, který svírají', 'Ano', 'Dvě strany a úhel mezi nimi určují trojúhelník jednoznačně (věta sus).'],
    ['jednu stranu a oba úhly, které k ní přiléhají', 'Ano', 'Strana a dva úhly u ní určují trojúhelník jednoznačně (věta usu).'],
    ['všechny tři úhly', 'Ne', 'Tři úhly určí jen tvar. Trojúhelník může být libovolně velký.'],
    ['jen dvě strany', 'Ne', 'Dvě strany můžeme rozevřít do libovolného úhlu, trojúhelníků je nekonečně mnoho.'],
  ]);
  return C({
    text: `O trojúhelníku známe ${B(co)}.`, q: 'Stačí to k tomu, abychom ho narýsovali jediným možným způsobem?', ok, opts: ['Ano', 'Ne'],
    hints: ['Představ si, že to rýsují dva lidé. Musí jim vyjít shodné trojúhelníky?', 'Trojúhelník je určen třemi vhodnými údaji: sss, sus nebo usu.', proc], steps: [proc],
  });
}
function kon_sus(mode) {
  let c, bb; do { c = ri(5, 8); bb = ri(4, 7); } while (c === bb);
  const al = pick([40, 50, 60, 70, 110]);
  return K({
    mode, tpl: 'tri', dano: { c: cm(c), b: cm(bb), al: st(al) }, sestroj: '△ABC', text: `Sestroj trojúhelník ABC: c = ${B(cm(c))}, b = ${B(cm(bb))}, α = ${B(st(al))}.`,
    plan: [{ op: 'seg', a: 'A', b: 'B', len: c }, { op: 'ray', name: 'AX', v: 'A', to: 'B', ang: al }, { op: 'circ', name: 'k', c: 'A', r: bb }, { op: 'int', name: 'C', of: ['AX', 'k'] }, { op: 'poly', pts: ['A', 'B', 'C'] }],
    goal: [['dist', 'A', 'B', c], ['dist', 'A', 'C', bb], ['ang', 'B', 'A', 'C', al], ['poly', 'ABC']],
    lens: [c, bb], angs: [al], names: ['C'], ops: ['seg', 'ray', 'circ', 'int', 'poly'], vysl: ['A', 'B', 'C'],
    nsol: 1, nsolProc: 'Polopřímka AX protne kružnici k v jediném bodě, úloha má jedno řešení.',
    hints: ['Úhel α leží u vrcholu A mezi stranami c a b. Začni stranou AB a u bodu A narýsuj úhel α.', 'Bod C leží na rameni úhlu ve vzdálenosti b od bodu A. Tu vzdálenost naneseš kružnicí k(A; b).'],
  });
}
function kon_usu(mode) {
  let al, be; do { al = pick([30, 40, 45, 50, 60, 70]); be = pick([30, 40, 45, 50, 60, 70]); } while (al === be || al + be > 125);
  const c = ri(5, 8);
  return K({
    mode, tpl: 'tri', dano: { c: cm(c), al: st(al), be: st(be) }, sestroj: '△ABC', text: `Sestroj trojúhelník ABC: c = ${B(cm(c))}, α = ${B(st(al))}, β = ${B(st(be))}.`,
    plan: [{ op: 'seg', a: 'A', b: 'B', len: c }, { op: 'ray', name: 'AX', v: 'A', to: 'B', ang: al }, { op: 'ray', name: 'BY', v: 'B', to: 'A', ang: be }, { op: 'int', name: 'C', of: ['AX', 'BY'] }, { op: 'poly', pts: ['A', 'B', 'C'] }],
    goal: [['dist', 'A', 'B', c], ['ang', 'B', 'A', 'C', al], ['ang', 'A', 'B', 'C', be], ['poly', 'ABC']],
    lens: [c], angs: [al, be], names: ['C'], ops: ['seg', 'ray', 'circ', 'int', 'poly'], vysl: ['A', 'B', 'C'],
    nsol: 1, nsolProc: 'Dvě polopřímky se protnou v jediném bodě, úloha má jedno řešení.',
    hints: ['Oba úhly leží u strany c. Začni stranou AB.', 'U bodu A narýsuj úhel α, u bodu B úhel β. Bod C je tam, kde se ramena protnou.'],
  });
}
function kon_usuGama() {
  let al, ga; do { al = pick([40, 50, 60, 70]); ga = pick([50, 60, 70, 80]); } while (al === ga || al + ga > 140 || 180 - al - ga === al || 180 - al - ga === ga);
  const c = ri(5, 8), be = 180 - al - ga;
  return K({
    mode: 3, tpl: 'tri', dano: { c: cm(c), al: st(al), ga: st(ga) }, sestroj: '△ABC', text: `Sestroj trojúhelník ABC: c = ${B(cm(c))}, α = ${B(st(al))}, γ = ${B(st(ga))}.`,
    plan: [{ op: 'seg', a: 'A', b: 'B', len: c }, { op: 'ray', name: 'AX', v: 'A', to: 'B', ang: al }, { op: 'ray', name: 'BY', v: 'B', to: 'A', ang: be }, { op: 'int', name: 'C', of: ['AX', 'BY'] }, { op: 'poly', pts: ['A', 'B', 'C'] }],
    goal: [['dist', 'A', 'B', c], ['ang', 'B', 'A', 'C', al], ['ang', 'A', 'C', 'B', ga], ['poly', 'ABC']],
    lens: [c], angs: shuffle([al, ga, be]), names: ['C'], ops: ['seg', 'ray', 'circ', 'int', 'poly'], vysl: ['A', 'B', 'C'],
    nsol: 1, nsolProc: `Nejdřív dopočítáme β = 180° − ${st(al)} − ${st(ga)} = ${st(be)}. Pak je to konstrukce podle věty usu a ta má jedno řešení.`,
    hints: ['Úhel γ u vrcholu C zatím rýsovat nejde, protože bod C ještě nemáš. Který úhel se dá dopočítat?', `Součet úhlů v trojúhelníku je 180°, takže β = ${st(be)}. Dál rýsuj jako u věty usu.`],
  });
}
function kon_Ssu() {
  const dve = chance(0.5); let c, a, al;
  if (dve) { al = pick([30, 40, 45]); c = ri(7, 8); const mn = Math.floor(c * Math.sin(al * Math.PI / 180) + 1.2); a = ri(mn, c - 1); }
  else { al = pick([40, 50, 60, 70]); c = ri(5, 7); a = c + ri(1, 2); }
  return K({
    mode: 3, tpl: 'tri', dano: { c: cm(c), a: cm(a), al: st(al) }, sestroj: '△ABC', text: `Sestroj trojúhelník ABC: c = ${B(cm(c))}, a = ${B(cm(a))}, α = ${B(st(al))}.`,
    plan: [{ op: 'seg', a: 'A', b: 'B', len: c }, { op: 'ray', name: 'AX', v: 'A', to: 'B', ang: al }, { op: 'circ', name: 'k', c: 'B', r: a }, { op: 'int', name: 'C', of: ['AX', 'k'] }, { op: 'poly', pts: ['A', 'B', 'C'] }],
    goal: [['dist', 'A', 'B', c], ['dist', 'B', 'C', a], ['ang', 'B', 'A', 'C', al], ['poly', 'ABC']],
    lens: [c, a], angs: [al], names: ['C'], ops: ['seg', 'ray', 'circ', 'int', 'poly'], vysl: ['A', 'B', 'C'],
    nsol: dve ? 2 : 1, nsolProc: dve ? 'Strana a je kratší než c, proto kružnice k(B; a) protne polopřímku AX ve dvou bodech. Úloha má dvě řešení.' : 'Strana a je delší než c, proto kružnice k(B; a) protne polopřímku AX jen v jednom bodě. Úloha má jedno řešení.',
    hints: ['Úhel α tentokrát neleží mezi zadanými stranami. Začni stranou AB a úhlem α u bodu A.', 'Strana a je vzdálenost bodu C od bodu B. Kde leží všechny body vzdálené a od B?'],
  });
}
function sh_urciVetu() {
  const typ = ri(0, 3), a = ri(4, 7), bb = a + ri(1, 3), u = pick([40, 50, 60, 70]);
  const [t1, t2, ok, proc] = [
    [`a = ${cm(a)}, b = ${cm(bb)}, c = ${cm(bb + 1)}`, `k = ${cm(bb + 1)}, l = ${cm(a)}, m = ${cm(bb)}`, 'ano, podle věty sss', 'Oba trojúhelníky mají stejné tři strany, jen v jiném pořadí.'],
    [`a = ${cm(a)}, b = ${cm(bb)}, úhel mezi nimi ${st(u)}`, `k = ${cm(bb)}, l = ${cm(a)}, úhel mezi nimi ${st(u)}`, 'ano, podle věty sus', 'Shodují se ve dvou stranách a v úhlu, který svírají.'],
    [`c = ${cm(a)}, úhly u této strany ${st(u)} a ${st(u - 10)}`, `m = ${cm(a)}, úhly u této strany ${st(u - 10)} a ${st(u)}`, 'ano, podle věty usu', 'Shodují se ve straně a v obou úhlech, které k ní přiléhají.'],
    [`a = ${cm(a)}, b = ${cm(bb)}, úhel mezi nimi ${st(u)}`, `k = ${cm(a)}, l = ${cm(bb)}, úhel mezi nimi ${st(u + 10)}`, 'ne, shodné nejsou', 'Strany jsou stejné, ale úhel mezi nimi je jiný. Třetí strana proto vyjde jinak dlouhá.'],
  ][typ];
  return C({
    text: `První trojúhelník: ${B(t1)}.<br>Druhý trojúhelník: ${B(t2)}.`, q: 'Jsou shodné?', ok, opts: ['ano, podle věty sss', 'ano, podle věty sus', 'ano, podle věty usu', 'ne, shodné nejsou'],
    hints: ['Zjisti, které tři údaje o každém trojúhelníku znáš a jestli jsou stejné.', 'Na pořadí, v jakém jsou údaje vypsané, nezáleží. Záleží na tom, jestli úhel leží mezi stranami (sus) nebo strana mezi úhly (usu).'], steps: [proc],
  });
}
function sh_obvod() {
  const [a, bb, c] = trojStrany();
  return N({
    text: `Platí △ABC ≅ △KLM (trojúhelníky jsou shodné: A odpovídá K, B odpovídá L, C odpovídá M). Známe |AB| = ${cm(c)}, |LM| = ${cm(a)} a |KM| = ${cm(bb)}.`, q: 'Vypočítej obvod trojúhelníku ABC.', ans: a + bb + c, unit: 'cm',
    hints: ['Strany shodných trojúhelníků si odpovídají podle pořadí vrcholů: LM ↔ BC, KM ↔ AC.', 'Obvod je součet všech tří stran.'], steps: [`|BC| = |LM| = ${cm(a)}, |AC| = |KM| = ${cm(bb)}`, `o = ${c} + ${a} + ${bb} = ${cm(a + bb + c)}`],
  });
}
function sh_uhlopricka() {
  const a = ri(4, 12), bb = 2 * ri(2, 5);
  return N({
    text: `Úhlopříčka (spojnice dvou protějších vrcholů) rozdělí obdélník se stranami ${cm(a)} a ${cm(bb)} na dva trojúhelníky.`, q: 'Jaký obsah má jeden z nich?', fig: fRect(a, bb, { la: cm(a), lb: cm(bb), diag: '' }), ans: a * bb / 2, unit: 'cm²',
    traps: [[a * bb, 'To je obsah celého obdélníku. Trojúhelníky jsou dva a jsou shodné.']],
    hints: ['Oba trojúhelníky jsou shodné (podle věty sss), mají tedy stejný obsah.', 'Obsah jednoho je polovina obsahu obdélníku.'], steps: [`Obdélník: ${a} · ${bb} = ${cm2(a * bb)}`, `Jeden trojúhelník: ${a * bb} : 2 = ${cm2(a * bb / 2)}`],
  });
}
function sh_slovni() {
  const [a, bb, c] = trojStrany();
  return N({
    text: `V trojúhelníku ABC je |AB| = ${cm(c)}, |BC| = ${cm(a)} a jeho obvod je ${cm(a + bb + c)}. Platí △ABC ≅ △KLM.`, q: 'Vypočítej délku strany KM.', ans: bb, unit: 'cm', units: 1,
    hints: ['Strana KM odpovídá straně AC. Tu dopočítáš z obvodu.'], steps: [`|AC| = ${a + bb + c} − ${c} − ${a} = ${cm(bb)}`, `K ↔ A, M ↔ C, proto |KM| = |AC| = ${cm(bb)}`],
  });
}

// ======================= 702 STŘEDOVÁ SOUMĚRNOST =======================
const H_STRED = ['Středová souměrnost je otočení o půl kruhu (o 180°) kolem středu S.', 'Jdi od bodu ke středu S a spočítej čtverečky vodorovně a svisle. Za středem pokračuj stejným směrem o stejný počet.', 'Střed S leží přesně uprostřed mezi vzorem a obrazem.'];
const ss_sit = (o, text, hints = H_STRED) => () => GR({ ...sit({ ...o, stred: true }), text, q: 'Ťukni do sítě na místa, kde leží obrazy bodů.', hints });
const ss_bod = ss_sit({ n: 1 }, 'Najdi obraz bodu A (kam se bod přenese, když ho otočíš kolem středu S o půl otáčky) ve středové souměrnosti se středem S.');
const ss_usecka = ss_sit({ n: 2 }, 'Najdi obraz úsečky AB (kam se úsečka přenese, když ji otočíš kolem středu S o půl otáčky) ve středové souměrnosti se středem S. Označ obrazy obou krajních bodů.');
const ss_troj = ss_sit({ n: 3 }, 'Najdi obraz trojúhelníku ABC (kam se trojúhelník přenese, když ho otočíš kolem středu S o půl otáčky) ve středové souměrnosti se středem S.');
const ss_troj3 = ss_sit({ n: 3, pres: true }, 'Najdi obraz trojúhelníku ABC ve středové souměrnosti se středem S. Střed leží těsně u trojúhelníku.', ['Každý vrchol zobraz zvlášť: stejný počet čtverečků za střed, stejným směrem.']);
const ss_ctyr = ss_sit({ n: 4 }, 'Najdi obraz čtyřúhelníku ABCD ve středové souměrnosti se středem S.', ['Každý vrchol zobraz zvlášť: stejný počet čtverečků za střed, stejným směrem.']);
const STREDOVE = [['ctverec', 'čtverec', 1], ['obdelnik', 'obdélník', 1], ['kosoctverec', 'kosočtverec', 1], ['rovnobeznik', 'kosodélník', 1], ['kruh', 'kruh', 1], ['sestiuhelnik', 'pravidelný šestiúhelník', 1],
  ['rovnostranny', 'rovnostranný trojúhelník', 0], ['rovnoramenny', 'rovnoramenný trojúhelník', 0], ['lichobeznik', 'rovnoramenný lichoběžník', 0], ['petiuhelnik', 'pravidelný pětiúhelník', 0]];
function ss_utvar() {
  const [id, jm, ano] = pick(STREDOVE);
  return C({
    text: `Na obrázku je ${B(jm)}${TVAR_V[id] || ''}.`, q: 'Je středově souměrný?', fig: fShape(id), figSol: ano ? fShape(id, { stred: 1 }) : null, ok: ano ? 'Ano' : 'Ne', opts: ['Ano', 'Ne'],
    hints: ['Útvar je středově souměrný, když po otočení o půl kruhu kolem svého středu vypadá úplně stejně.', 'Otoč si v duchu obrázek vzhůru nohama. Splývá s původním?', ano ? 'Po otočení o 180° se kryje sám se sebou.' : 'Po otočení o 180° míří vrchol na opačnou stranu, útvar se sám se sebou nekryje.'],
    steps: [ano ? `${jm[0].toUpperCase() + jm.slice(1)} se po otočení o 180° kolem středu kryje sám se sebou.` : `${jm[0].toUpperCase() + jm.slice(1)} se po otočení o 180° sám se sebou nekryje.`],
  });
}
function ss_vzd() {
  const d = ri(2, 9), dvoj = chance(0.5);
  return N({
    text: `Bod A leží ${B(cm(d))} od středu souměrnosti S. Bod A′ je jeho obraz (kam se bod přenese, když ho otočíš kolem středu S o půl otáčky).`, q: dvoj ? 'Jak daleko jsou od sebe body A a A′?' : 'Jak daleko od středu S leží bod A′?', ans: dvoj ? 2 * d : d, unit: 'cm',
    traps: dvoj ? [[d, 'To je vzdálenost jednoho bodu od středu. Mezi A a A′ je dvakrát.']] : [[2 * d, 'To je vzdálenost |AA′|. Obraz je od středu stejně daleko jako vzor.']],
    hints: ['Vzor a obraz leží na jedné přímce se středem S, každý na jiné straně.', 'Oba jsou od středu stejně daleko: |SA| = |SA′|.', dvoj ? `|AA′| = 2 · ${d}` : `${d} cm`], steps: [dvoj ? `|AA′| = 2 · ${cm(d)} = ${cm(2 * d)}` : `|SA′| = |SA| = ${cm(d)}`],
  });
}
function ss_pismeno() {
  const ok = pick(['N', 'S', 'Z', 'H', 'I', 'O', 'X']), bad = sample(['A', 'B', 'C', 'D', 'E', 'M', 'T', 'U', 'V', 'W', 'Y', 'K'], 3);
  return C({
    text: 'Tiskací písmena bez ozdob:', q: 'Které z nich je středově souměrné?', ok, bad,
    hints: ['Otoč v duchu písmeno vzhůru nohama (o půl kruhu).', 'Středově souměrné písmeno vypadá po otočení stejně.', 'Písmena jako A nebo M jsou souměrná jen podle osy. Po otočení o 180° míří špičkou dolů.'],
    steps: [`Písmeno ${ok} vypadá po otočení o 180° stejně.`],
  });
}
function ss_stredUtvaru() {
  const [co, ok] = pick([['obdélníku', 'V průsečíku úhlopříček'], ['rovnoběžníku', 'V průsečíku úhlopříček'], ['kruhu', 'Ve středu kruhu'], ['úsečky', 'Ve středu úsečky']]);
  return C({
    text: `Střed souměrnosti ${B(co)}.`, q: 'Kde leží?', ok, bad: shuffle(['V jednom z vrcholů', 'Na delší straně', 'Žádný nemá', 'Na kratší straně']).slice(0, 2).concat(ok.includes('úhlopříček') ? ['Ve středu jedné strany'] : ['V krajním bodě']),
    hints: ['Střed souměrnosti je bod, kolem kterého se útvar po otočení o 180° kryje sám se sebou.', 'Musí být „uprostřed“ útvaru, stejně daleko od protějších bodů.'], steps: [`${ok}.`],
  });
}
function ss_shodnost() {
  if (chance(0.5)) {
    const d = ri(3, 12);
    return C({
      text: `Úsečka AB je dlouhá ${cm(d)}. Ve středové souměrnosti (střed neleží na přímce AB) se zobrazí na úsečku A′B′.`, q: 'Co o úsečce A′B′ platí?', ok: `Je dlouhá ${cm(d)} a je rovnoběžná s AB`, bad: [`Je dlouhá ${cm(d)} a je kolmá k AB`, `Je dlouhá ${cm(2 * d)} a je rovnoběžná s AB`, `Je dlouhá ${cm(d)} a leží na přímce AB`],
      hints: ['Středová souměrnost je shodné zobrazení, délky nemění.', 'Otočením o 180° se směr úsečky obrátí, ale přímka zůstane rovnoběžná.'], steps: ['Obraz úsečky je stejně dlouhá úsečka, která je s původní rovnoběžná.'],
    });
  }
  const x = ri(8, 28);
  return N({
    text: `Bod A′ je obraz bodu A (kam se bod přenese, když ho otočíš kolem středu S o půl otáčky) ve středové souměrnosti se středem S. Body jsou od sebe ${cm(x)}.`, q: 'Jak daleko je bod A od středu S?', ans: x / 2, unit: 'cm',
    traps: [[2 * x, 'Střed leží uprostřed mezi vzorem a obrazem, vzdálenost se půlí.']], hints: ['Střed S leží přesně uprostřed úsečky AA′.', '|AS| = |AA′| : 2'], steps: [`|AS| = ${x} : 2 = ${cm(x / 2)}`],
  });
}
function ss_rovnobeznik() {
  const e = 2 * ri(4, 8), f = 2 * ri(2, 6), a = ri(Math.abs(e - f) / 2 + 2, (e + f) / 2 - 1);
  return N({
    text: `Rovnoběžník ABCD má střed souměrnosti S. Platí |AC| = ${cm(e)}, |BD| = ${cm(f)} a |AB| = ${cm(a)}.`, q: 'Vypočítej obvod trojúhelníku ABS.', ans: e / 2 + f / 2 + a, unit: 'cm', units: 1,
    hints: ['Střed souměrnosti rovnoběžníku je průsečík úhlopříček. Úhlopříčky se v něm půlí.'],
    steps: [`|AS| = ${e} : 2 = ${cm(e / 2)}`, `|BS| = ${f} : 2 = ${cm(f / 2)}`, `o = ${e / 2} + ${f / 2} + ${a} = ${cm(e / 2 + f / 2 + a)}`],
  });
}
function ss_oboji() {
  const [jm, osy, st2] = pick([['Čtverec', 4, 1], ['Obdélník', 2, 1], ['Kosočtverec', 2, 1], ['Rovnostranný trojúhelník', 3, 0], ['Kosodélník', 0, 1], ['Pravidelný šestiúhelník', 6, 1], ['Rovnoramenný lichoběžník', 1, 0]]);
  return N({
    text: `${jm}: sečti počet jeho os souměrnosti a počet jeho středů souměrnosti.`, q: 'Jaké číslo vyjde?', ans: osy + st2,
    hints: ['Útvar může mít nejvýš jeden střed souměrnosti. Os může mít víc.'], steps: [`Osy souměrnosti: ${osy}`, `Střed souměrnosti: ${st2 ? '1' : '0 (není středově souměrný)'}`, `Součet: ${osy + st2}`],
  });
}

// ======================= 703 ROVNOBĚŽNÍKY =======================
function rovn() { const a = ri(6, 14), bb = ri(4, a - 1), al = pick([50, 60, 65, 70]); return [a, bb, al]; }
function r_obvod() {
  const [a, bb, al] = rovn();
  return N({
    text: `Rovnoběžník má strany ${B(cm(a))} a ${B(cm(bb))}.`, q: 'Vypočítej jeho obvod.', fig: fPar(a, bb, al, { la: cm(a), lb: cm(bb) }), ans: 2 * (a + bb), unit: 'cm',
    traps: [[a + bb, 'Rovnoběžník má čtyři strany: každá délka je tam dvakrát.'], [a * bb, 'Obvod je součet stran, ne součin.']],
    hints: ['Protější strany rovnoběžníku jsou stejně dlouhé.', 'Obvod: o = 2 · (a + b), stejně jako u obdélníku.', `o = 2 · (${a} + ${bb})`], steps: ['o = 2 · (a + b)', `o = 2 · (${a} + ${bb}) = ${cm(2 * (a + bb))}`],
  });
}
function r_obsah() {
  const a = ri(5, 14), v = ri(3, 9);
  return N({
    text: `Rovnoběžník má stranu a = ${B(cm(a))} a výšku na tuto stranu ${SUB('v', 'a')} = ${B(cm(v))} (vzdálenost strany a od protější strany).`, q: 'Vypočítej jeho obsah.', fig: fPar(a, v / Math.sin(1.1), 63, { la: cm(a), lv: cm(v) }), ans: a * v, unit: 'cm²',
    traps: [[a * v / 2, 'Dělení dvěma patří k trojúhelníku. U rovnoběžníku se nedělí.'], [2 * (a + v), 'To je výpočet obvodu, navíc se špatným údajem. Obsah je a · výška.']],
    hints: ['Odstřihni z rovnoběžníku na jedné straně trojúhelník a přilož ho na druhou. Vznikne obdélník.', 'Ten obdélník má strany a a výšku: S = a · v<sub>a</sub>.', `S = ${a} · ${v}`], steps: ['S = a · v<sub>a</sub>', `S = ${a} · ${v} = ${cm2(a * v)}`],
  });
}
function r_uhel() {
  const al = ri(35, 85), sous = chance(0.6);
  return N({
    text: `V rovnoběžníku ABCD má úhel α u vrcholu A velikost ${B(st(al))}.`, q: sous ? 'Jak velký je sousední úhel β u vrcholu B?' : 'Jak velký je protější úhel γ u vrcholu C?', fig: fPar(9, 6, al, { lang: st(al), lang2: sous ? '?' : '', names: 1 }), ans: sous ? 180 - al : al, unit: '°',
    traps: sous ? [[al, 'Stejně velké jsou protější úhly. Sousední úhly dávají dohromady 180°.']] : [[180 - al, 'To je sousední úhel. Protější úhly jsou stejně velké.']],
    hints: ['V rovnoběžníku jsou protější úhly stejně velké.', 'Dva sousední úhly dávají dohromady 180°.', sous ? `β = 180° − ${st(al)}` : `γ = α = ${st(al)}`], steps: [sous ? `β = 180° − ${st(al)} = ${st(180 - al)}` : `γ = α = ${st(al)}`],
  });
}
function r_druh() {
  const [co, ok] = pick([['má všechny strany stejně dlouhé a žádný jeho úhel není pravý', 'kosočtverec'], ['má všechny úhly pravé a sousední strany různě dlouhé', 'obdélník'], ['má všechny strany stejně dlouhé a všechny úhly pravé', 'čtverec'], ['má sousední strany různě dlouhé a žádný jeho úhel není pravý', 'kosodélník']]);
  return C({
    text: `Rovnoběžník, který ${B(co)}.`, q: 'Jak se jmenuje?', ok, opts: ['čtverec', 'obdélník', 'kosočtverec', 'kosodélník'],
    hints: ['Rovnoběžníky se dělí podle dvou věcí: jestli mají pravé úhly a jestli mají všechny strany stejné.', 'Pravé úhly: čtverec a obdélník. Všechny strany stejné: čtverec a kosočtverec.', '„Koso-“ znamená, že úhly nejsou pravé. „-čtverec“ má stejné strany, „-délník“ různé.'], steps: [`Je to ${ok}.`],
  });
}
function r_kosoObvod() {
  const a = ri(4, 15);
  return N({
    text: `Kosočtverec (rovnoběžník, který má všechny strany stejně dlouhé) má stranu ${B(cm(a))}.`, q: 'Vypočítej jeho obvod.', ans: 4 * a, unit: 'cm', traps: [[2 * a, 'Kosočtverec má čtyři strany.'], [a * a, 'Obvod je součet stran.']],
    hints: ['Kosočtverec má všechny čtyři strany stejně dlouhé.', 'o = 4 · a', `o = 4 · ${a}`], steps: ['o = 4 · a', `o = 4 · ${a} = ${cm(4 * a)}`],
  });
}
function r_vyskaZObsahu() {
  const a = ri(5, 14), v = ri(3, 9);
  return N({
    text: `Rovnoběžník má obsah ${B(cm2(a * v))} a stranu a = ${B(cm(a))}.`, q: 'Jak dlouhá je výška na stranu a (vzdálenost strany a od protější strany)?', fig: fPar(a, v / Math.sin(1.1), 63, { la: cm(a), lv: '?' }), ans: v, unit: 'cm',
    hints: ['S = a · v<sub>a</sub>. Známe S a a.', 'v<sub>a</sub> = S : a'], steps: ['S = a · v<sub>a</sub>, proto v<sub>a</sub> = S : a', `v<sub>a</sub> = ${a * v} : ${a} = ${cm(v)}`],
  });
}
function dveVysky() { let k, va, vb; do { k = ri(2, 3); va = ri(3, 6); vb = ri(3, 6); } while (va === vb); return [k * vb, k * va, va, vb]; }
function r_druhaVyska() {
  const [a, bb, va, vb] = dveVysky();
  return N({
    text: `Rovnoběžník má strany a = ${B(cm(a))}, b = ${B(cm(bb))} a výšku ${SUB('v', 'a')} = ${B(cm(va))} (vzdálenost strany a od protější strany).`, q: `Jak dlouhá je výška ${SUB('v', 'b')}?`, ans: vb, unit: 'cm',
    traps: [[va, 'Výšky na různé strany jsou stejné jen u kosočtverce.']],
    hints: ['Obsah vyjde stejně, ať počítáš s kteroukoli stranou: a · v<sub>a</sub> = b · v<sub>b</sub>.', 'Nejdřív spočítej obsah, pak ho vyděl stranou b.'], steps: [`S = a · v<sub>a</sub> = ${a} · ${va} = ${cm2(a * va)}`, `v<sub>b</sub> = S : b = ${a * va} : ${bb} = ${cm(vb)}`],
  });
}
function r_kosoObsah() {
  const e = 2 * ri(3, 8), f = ri(3, 10);
  return N({
    text: `Kosočtverec (rovnoběžník, který má všechny strany stejně dlouhé) má úhlopříčky (spojnice protějších vrcholů) e = ${B(cm(e))} a f = ${B(cm(f))}.`, q: 'Vypočítej jeho obsah.', fig: fRhomb(e, f, { le: cm(e), lf: cm(f) }), ans: e * f / 2, unit: 'cm²',
    traps: [[e * f, 'Součin úhlopříček je obsah obdélníku kolem kosočtverce. Kosočtverec je jeho polovina.']],
    hints: ['Úhlopříčky kosočtverce jsou na sebe kolmé. Kosočtverec zabírá přesně polovinu obdélníku se stranami e a f.', 'S = e · f : 2'], steps: ['S = e · f : 2', `S = ${e} · ${f} : 2 = ${cm2(e * f / 2)}`],
  });
}
function r_stranaZObvodu() {
  const [a, bb] = rovn();
  return N({
    text: `Rovnoběžník má obvod ${B(cm(2 * (a + bb)))} a jednu stranu ${B(cm(a))}.`, q: 'Jak dlouhá je druhá strana?', ans: bb, unit: 'cm', traps: [[2 * (a + bb) - a, 'Obvod jsou dvě delší a dvě kratší strany. Nejdřív ho vyděl dvěma.'], [2 * bb, 'To jsou obě kratší strany dohromady.']],
    hints: ['Polovina obvodu je součet dvou sousedních stran.', 'b = o : 2 − a'], steps: [`a + b = ${2 * (a + bb)} : 2 = ${a + bb}`, `b = ${a + bb} − ${a} = ${cm(bb)}`],
  });
}
function r_uhlopricky() {
  const e = 2 * ri(4, 12);
  return N({
    text: `Úhlopříčky rovnoběžníku ABCD (spojnice protějších vrcholů) se protínají v bodě S. Úhlopříčka AC měří ${B(cm(e))}.`, q: 'Jak dlouhá je úsečka AS?', fig: fPar(9, 6, 62, { diag: cm(e), names: 1 }), ans: e / 2, unit: 'cm',
    hints: ['Úhlopříčky rovnoběžníku se navzájem půlí.', '|AS| = |AC| : 2'], steps: [`|AS| = ${e} : 2 = ${cm(e / 2)}`],
  });
}
function r_jednotky() {
  const a = ri(11, 25) / 10, v = ri(4, 9);
  return N({
    text: `Rovnoběžník má stranu a = ${B(cz(a) + ' dm')} a výšku na tuto stranu ${B(cm(v))} (vzdálenost strany a od protější strany).`, q: 'Vypočítej jeho obsah v cm².', ans: rd(a * 10 * v), unit: 'cm²',
    traps: [[rd(a * v, 2), 'Strana je v decimetrech, výška v centimetrech. Nejdřív převeď na stejné jednotky.']],
    hints: ['Před výpočtem musí být oba rozměry ve stejných jednotkách.', `${cz(a)} dm = ${cz(a * 10)} cm`], steps: [`${cz(a)} dm = ${cz(a * 10)} cm`, `S = ${cz(a * 10)} · ${v} = ${cm2(rd(a * 10 * v))}`],
  });
}
// --- úroveň 3 ---
function r_pozemek() {
  const a = ri(30, 80), v = 5 * ri(4, 12);
  return N({
    text: `Pozemek má tvar rovnoběžníku. Jedna jeho strana měří ${a} m a vzdálenost k protější straně je ${v} m.`, q: 'Jakou má výměru v arech?', ans: a * v / 100, unit: 'a', units: 1,
    traps: [[a * v, 'To je výměra v m². 1 ar = 100 m².']], hints: ['Vzdálenost rovnoběžných stran je výška. 1 a = 100 m².'], steps: [`S = ${a} · ${v} = ${cz(a * v)} m²`, `${cz(a * v)} m² = ${cz(a * v / 100)} a`],
  });
}
function r_kosoZObvodu() {
  const a = ri(6, 15), v = ri(4, a - 1);
  return N({
    text: `Kosočtverec má obvod ${cm(4 * a)} a výšku ${cm(v)}.`, q: 'Vypočítej jeho obsah.', ans: a * v, unit: 'cm²', units: 1,
    hints: ['Z obvodu urči stranu. Kosočtverec je rovnoběžník, obsah je strana krát výška.'], steps: [`a = ${4 * a} : 4 = ${cm(a)}`, `S = a · v = ${a} · ${v} = ${cm2(a * v)}`],
  });
}
function r_dveVysky3() {
  const [a, bb, va, vb] = dveVysky();
  return N({
    text: `Rovnoběžník má strany ${cm(a)} a ${cm(bb)}. Výška na stranu dlouhou ${cm(a)} měří ${cm(va)}.`, q: 'Vypočítej výšku na druhou stranu.', ans: vb, unit: 'cm', units: 1,
    hints: ['Obsah rovnoběžníku vyjde stejně s kteroukoli stranou a její výškou.'], steps: [`S = ${a} · ${va} = ${cm2(a * va)}`, `Druhá výška: ${a * va} : ${bb} = ${cm(vb)}`],
  });
}
function r_uhlyPomer() {
  const [p, q] = pick([[1, 2], [1, 3], [2, 3], [1, 4], [1, 5], [2, 7], [4, 5], [3, 7], [7, 8], [5, 7]]), d = 180 / (p + q), vetsi = chance(0.5);
  return N({
    text: `Dva sousední úhly rovnoběžníku jsou v poměru ${B(p + ' : ' + q)}.`, q: `Jak velký je ${vetsi ? 'větší' : 'menší'} z nich?`, ans: d * (vetsi ? q : p), unit: '°',
    hints: ['Sousední úhly rovnoběžníku dávají dohromady 180°. Rozděl 180° na díly podle poměru.'], steps: [`Dílů: ${p} + ${q} = ${p + q}`, `1 díl: 180° : ${p + q} = ${st(d)}`, `${vetsi ? 'Větší' : 'Menší'} úhel: ${vetsi ? q : p} · ${st(d)} = ${st(d * (vetsi ? q : p))}`],
  });
}
function r_kosoUhlopricka() {
  const e = 2 * ri(4, 10), f = ri(4, 14);
  return N({
    text: `Kosočtverec má obsah ${cm2(e * f / 2)} a jednu úhlopříčku dlouhou ${cm(e)}.`, q: 'Jak dlouhá je druhá úhlopříčka?', ans: f, unit: 'cm', units: 1,
    traps: [[f / 2, 'Ve vzorci S = e · f : 2 je dělení dvěma. Při výpočtu úhlopříčky se obsah nejdřív násobí dvěma.']],
    hints: ['S = e · f : 2. Dosaď, co znáš, a vyjádři f.'], steps: ['S = e · f : 2, proto f = 2 · S : e', `f = 2 · ${cz(e * f / 2)} : ${e} = ${cm(f)}`],
  });
}
function r_parkety() {
  const a = pick([20, 25, 30, 40]), v = pick([5, 8, 10]), n = 100 * ri(1, 8), S = a * v * n / 10000;
  return N({
    text: `Parketa má tvar kosodélníku: strana ${a} cm, výška na tuto stranu ${v} cm. Podlaha má plochu ${cz(S)} m².`, q: 'Kolik parket je na ni potřeba? (Ořezy nepočítej.)', ans: n, unit: 'parket',
    traps: [[n / 100, '1 m² = 10 000 cm², ne 100 cm².']], hints: ['Obsah jedné parkety spočítej v cm² a plochu podlahy převeď taky na cm². 1 m² = 10 000 cm².'],
    steps: [`Parketa: ${a} · ${v} = ${a * v} cm²`, `Podlaha: ${cz(S)} m² = ${cz(S * 10000)} cm²`, `${cz(S * 10000)} : ${a * v} = ${n} parket`],
  });
}

// ======================= 704 OBSAH TROJÚHELNÍKU A LICHOBĚŽNÍKU =======================
function tl_troj() {
  const a = ri(4, 14), v = 2 * ri(2, 5);
  return N({
    text: `Trojúhelník má stranu a = ${B(cm(a))} a výšku na tuto stranu ${SUB('v', 'a')} = ${B(cm(v))} (vzdálenost vrcholu A od strany a).`, q: 'Vypočítej jeho obsah.', fig: fTri([[0, 0], [a, 0], [a * 0.38, v]], { sides: [cm(a), '', ''], h: { from: 2, lab: cm(v) }, names: null }), ans: a * v / 2, unit: 'cm²',
    traps: [[a * v, 'Součin a · v<sub>a</sub> je obsah celého rovnoběžníku. Trojúhelník je jeho polovina.'], [a + v, 'Strana a výška se násobí.']],
    hints: ['Dva stejné trojúhelníky složí rovnoběžník se stranou a a výškou v<sub>a</sub>.', 'Trojúhelník je tedy polovina rovnoběžníku: S = a · v<sub>a</sub> : 2.', `S = ${a} · ${v} : 2`], steps: ['S = a · v<sub>a</sub> : 2', `S = ${a} · ${v} : 2 = ${a * v} : 2 = ${cm2(a * v / 2)}`],
  });
}
function tl_pravo() {
  const a = ri(3, 12), bb = 2 * ri(2, 6);
  return N({
    text: `Pravoúhlý trojúhelník má odvěsny (dvě kratší strany u pravého úhlu) ${B(cm(a))} a ${B(cm(bb))}.`, q: 'Vypočítej jeho obsah.', fig: fRightTri(a, bb, { la: cm(a), lb: cm(bb), names: false }), ans: a * bb / 2, unit: 'cm²',
    traps: [[a * bb, 'To je obsah obdélníku. Pravoúhlý trojúhelník je jeho polovina.']],
    hints: ['Odvěsny jsou dvě strany, které svírají pravý úhel. Jedna z nich je zároveň výškou na tu druhou.', 'Pravoúhlý trojúhelník je polovina obdélníku: S = a · b : 2.', `S = ${a} · ${bb} : 2`], steps: ['S = a · b : 2', `S = ${a} · ${bb} : 2 = ${cm2(a * bb / 2)}`],
  });
}
function lich() { const c = ri(3, 8), a = c + 2 * ri(1, 4), v = 2 * ri(2, 4); return [a, c, v]; }
function tl_lich() {
  const [a, c, v] = lich(), S = (a + c) * v / 2;
  return N({
    text: `Lichoběžník má základny (dvě rovnoběžné strany) a = ${B(cm(a))}, c = ${B(cm(c))} a výšku v = ${B(cm(v))}.`, q: 'Vypočítej jeho obsah.', fig: fTrap(a, c, v, (a - c) / 3, { la: cm(a), lc: cm(c), lv: cm(v) }), ans: S, unit: 'cm²',
    traps: [[(a + c) * v, 'Ještě vyděl dvěma. Součin (a + c) · v je obsah rovnoběžníku ze dvou takových lichoběžníků.'], [a * c * v / 2, 'Základny se sčítají, nenásobí.'], [a * v, 'Počítá se s oběma základnami.']],
    hints: ['Dva stejné lichoběžníky (jeden otočený) složí rovnoběžník se stranou a + c a výškou v.', 'Lichoběžník je jeho polovina: S = (a + c) · v : 2.', `S = (${a} + ${c}) · ${v} : 2`], steps: ['S = (a + c) · v : 2', `S = (${a} + ${c}) · ${v} : 2 = ${a + c} · ${v} : 2 = ${cm2(S)}`],
  });
}
function tl_lichObvod() {
  // odvěsny z pythagorejských trojic, aby ramena vyšla celá a obrázek seděl
  const [v, moz] = pick([[4, [[0, 4], [3, 5]]], [8, [[0, 8], [6, 10]]], [12, [[0, 12], [5, 13], [9, 15]]]]);
  let l, r; do { l = pick(moz); r = pick(moz); } while (l[0] + r[0] === 0);
  const c = ri(3, 8), a = c + l[0] + r[0], d = l[1], bb = r[1];
  return N({
    text: `Lichoběžník má základny (dvě rovnoběžné strany) ${B(cm(a))} a ${B(cm(c))} a ramena ${B(cm(bb))} a ${B(cm(d))}.`, q: 'Vypočítej jeho obvod.', fig: fTrap(a, c, v, l[0], { la: cm(a), lc: cm(c), lb: cm(bb), ld: cm(d) }), ans: a + bb + c + d, unit: 'cm',
    hints: ['Obvod je délka čáry kolem celého útvaru.', 'Sečti všechny čtyři strany: o = a + b + c + d.', `o = ${a} + ${bb} + ${c} + ${d}`], steps: ['o = a + b + c + d', `o = ${a} + ${bb} + ${c} + ${d} = ${cm(a + bb + c + d)}`],
  });
}
function tl_pojem() {
  const [co, ok] = pick([['Dvě rovnoběžné strany lichoběžníku se jmenují…', 'základny'], ['Dvě strany lichoběžníku, které rovnoběžné nejsou, se jmenují…', 'ramena'], ['Vzdálenost obou základen lichoběžníku se jmenuje…', 'výška']]);
  return C({
    text: co, q: 'Doplň.', ok, opts: ['základny', 'ramena', 'výška', 'úhlopříčky'],
    hints: ['Lichoběžník je čtyřúhelník, který má právě jednu dvojici rovnoběžných stran.', 'Rovnoběžné strany jsou základny, zbylé dvě jsou ramena.', 'Výška je kolmá vzdálenost mezi základnami.'], steps: [`Správně: ${ok}.`],
  });
}
function tl_vyskaZObsahu() {
  const a = ri(4, 14), v = ri(3, 10), S = a * v / 2;
  return N({
    text: `Trojúhelník má obsah ${B(cm2(S))} a stranu a = ${B(cm(a))}.`, q: 'Jak dlouhá je výška na stranu a (vzdálenost vrcholu A od strany a)?', ans: v, unit: 'cm', traps: [[v / 2, 'Ve vzorci je dělení dvěma. Při výpočtu výšky se proto obsah nejdřív násobí dvěma.']],
    hints: ['S = a · v<sub>a</sub> : 2. Dvojnásobek obsahu je a · v<sub>a</sub>.', 'v<sub>a</sub> = 2 · S : a'], steps: ['v<sub>a</sub> = 2 · S : a', `v<sub>a</sub> = 2 · ${cz(S)} : ${a} = ${cz(2 * S)} : ${a} = ${cm(v)}`],
  });
}
function tl_stranaZObsahu() {
  const a = ri(4, 14), v = ri(3, 10), S = a * v / 2;
  return N({
    text: `Trojúhelník má obsah ${B(cm2(S))} a výšku ${SUB('v', 'a')} = ${B(cm(v))} (vzdálenost vrcholu A od strany a).`, q: 'Jak dlouhá je strana a?', ans: a, unit: 'cm', traps: [[a / 2, 'Obsah nejdřív vynásob dvěma, pak teprve děl výškou.']],
    hints: ['S = a · v<sub>a</sub> : 2. Dvojnásobek obsahu je a · v<sub>a</sub>.', 'a = 2 · S : v<sub>a</sub>'], steps: ['a = 2 · S : v<sub>a</sub>', `a = 2 · ${cz(S)} : ${v} = ${cm(a)}`],
  });
}
function tl_lichVyska() {
  const [a, c, v] = lich(), S = (a + c) * v / 2;
  return N({
    text: `Lichoběžník má obsah ${B(cm2(S))} a základny (dvě rovnoběžné strany) ${B(cm(a))} a ${B(cm(c))}.`, q: 'Jak vysoký je?', fig: fTrap(a, c, v, (a - c) / 3, { la: cm(a), lc: cm(c), lv: '?' }), ans: v, unit: 'cm',
    traps: [[v / 2, 'Obsah nejdřív vynásob dvěma, pak teprve děl součtem základen.']],
    hints: ['S = (a + c) · v : 2. Dvojnásobek obsahu je (a + c) · v.', 'v = 2 · S : (a + c)'], steps: ['v = 2 · S : (a + c)', `v = 2 · ${cz(S)} : (${a} + ${c}) = ${cz(2 * S)} : ${a + c} = ${cm(v)}`],
  });
}
function tl_lichZakladna() {
  const [a, c, v] = lich(), S = (a + c) * v / 2;
  return N({
    text: `Lichoběžník má obsah ${B(cm2(S))}, výšku ${B(cm(v))} a delší základnu (jednu ze dvou rovnoběžných stran) ${B(cm(a))}.`, q: 'Jak dlouhá je kratší základna?', ans: c, unit: 'cm',
    traps: [[a + c, 'To je součet obou základen. Ještě odečti tu, kterou znáš.']],
    hints: ['Z S = (a + c) · v : 2 nejdřív spočítej součet základen: a + c = 2 · S : v.', 'Pak odečti známou základnu.'], steps: [`a + c = 2 · ${cz(S)} : ${v} = ${a + c}`, `c = ${a + c} − ${a} = ${cm(c)}`],
  });
}
function tl_tupouhly() {
  const a = ri(4, 8), v = 2 * ri(2, 4);
  return N({
    text: `Tupoúhlý trojúhelník (má jeden úhel větší než pravý) má stranu a = ${B(cm(a))}. Výška na tuto stranu měří ${B(cm(v))} a padá mimo trojúhelník, na prodloužení strany.`, q: 'Vypočítej obsah trojúhelníku.',
    fig: fTri([[0, 0], [a, 0], [a + v * 0.7, v]], { sides: [cm(a), '', ''], h: { from: 2, lab: cm(v) }, names: null }), ans: a * v / 2, unit: 'cm²',
    traps: [[a * v, 'Nezapomeň dělit dvěma.']], hints: ['Vzorec S = a · v<sub>a</sub> : 2 platí pro každý trojúhelník. Nevadí, že výška leží venku.', 'Počítá se jen se stranou a, ne s jejím prodloužením.'], steps: ['S = a · v<sub>a</sub> : 2', `S = ${a} · ${v} : 2 = ${cm2(a * v / 2)}`],
  });
}
function tl_jednotky() {
  const a = ri(12, 30) / 10, v = 2 * ri(2, 6);
  return N({
    text: `Trojúhelník má stranu ${B(cz(a) + ' dm')} a výšku na tuto stranu ${B(cm(v))} (vzdálenost protějšího vrcholu od této strany).`, q: 'Vypočítej jeho obsah v cm².', ans: rd(a * 10 * v / 2), unit: 'cm²',
    traps: [[rd(a * v / 2, 2), 'Strana je v decimetrech, výška v centimetrech. Převeď na stejné jednotky.']],
    hints: ['Oba rozměry musí být ve stejných jednotkách.', `${cz(a)} dm = ${cz(a * 10)} cm`], steps: [`${cz(a)} dm = ${cz(a * 10)} cm`, `S = ${cz(a * 10)} · ${v} : 2 = ${cm2(rd(a * 10 * v / 2))}`],
  });
}
// --- úroveň 3 ---
function tl_stit() {
  const z = pick([6, 8, 9, 10, 8.4]), k = pick([4, 5, 6]), v = rd(0.7 * k, 1), S = rd(z * v / 2, 2), l = rd(S / 7, 2);
  return N({
    text: `Štít domu má tvar trojúhelníku se základnou ${cz(z)} m a výškou ${cz(v)} m. Jeden litr barvy vystačí na 7 m².`, q: 'Kolik litrů barvy je potřeba na jeden nátěr štítu?', ans: l, unit: 'l',
    traps: [[rd(z * v / 7, 2), 'U obsahu trojúhelníku nezapomeň dělit dvěma.'], [S, 'To je obsah štítu v m². Ptáme se na litry barvy.']],
    hints: ['Spočítej obsah trojúhelníku a vyděl ho plochou, na kterou vystačí jeden litr.'], steps: [`S = ${cz(z)} · ${cz(v)} : 2 = ${cz(S)} m²`, `${cz(S)} : 7 = ${cz(l)} l`],
  });
}
function tl_pozemek() {
  const a = ri(40, 90), c = a - 2 * ri(5, 15), v = 10 * ri(2, 6), cena = pick([450, 800, 1200]), S = (a + c) * v / 2;
  return N({
    text: `Stavební pozemek má tvar lichoběžníku. Rovnoběžné strany měří ${a} m a ${c} m, jejich vzdálenost je ${v} m. Metr čtvereční stojí ${cena} Kč.`, q: 'Kolik korun pozemek stojí?', ans: S * cena, unit: 'Kč',
    traps: [[(a + c) * v * cena, 'U obsahu lichoběžníku nezapomeň dělit dvěma.']], hints: ['Vzdálenost rovnoběžných stran je výška lichoběžníku.'], steps: [`S = (${a} + ${c}) · ${v} : 2 = ${cz(S)} m²`, `Cena: ${cz(S)} · ${cena} = ${cz(S * cena)} Kč`],
  });
}
function tl_rozdil() {
  const [a, c, v] = lich();
  return N({
    text: `Lichoběžník má základny ${cm(a)} a ${cm(c)} a výšku ${cm(v)}. Úhlopříčka ho rozdělí na dva trojúhelníky.`, q: 'O kolik cm² se liší jejich obsahy?', ans: (a - c) * v / 2, unit: 'cm²', units: 1,
    hints: ['Každý z trojúhelníků má za stranu jednu základnu. Výšku na ni mají oba stejnou, je to výška lichoběžníku.'], steps: [`Větší trojúhelník: ${a} · ${v} : 2 = ${cm2(a * v / 2)}`, `Menší trojúhelník: ${c} · ${v} : 2 = ${cm2(c * v / 2)}`, `Rozdíl: ${cz(a * v / 2)} − ${cz(c * v / 2)} = ${cm2((a - c) * v / 2)}`],
  });
}
function tl_stejnyObsah() {
  const s = ri(3, 8), k = ri(2, 4), v = 2 * ri(2, 5), a = s * k, S = a * v / 2;
  return N({
    text: `Trojúhelník má stranu ${cm(a)} a výšku na tuto stranu ${cm(v)}. Obdélník má stejný obsah a jednu stranu dlouhou ${cm(s)}.`, q: 'Jak dlouhá je druhá strana obdélníku?', ans: S / s, unit: 'cm', units: 1,
    traps: [[a * v / s, 'U obsahu trojúhelníku nezapomeň dělit dvěma.']], hints: ['Nejdřív spočítej obsah trojúhelníku. Obdélník má obsah a · b.'], steps: [`S = ${a} · ${v} : 2 = ${cm2(S)}`, `Druhá strana: ${cz(S)} : ${s} = ${cm(S / s)}`],
  });
}
function tl_ctverecNadOdvesnou() {
  const a = ri(4, 10), bb = 2 * ri(3, 8), S = a * bb / 2;
  return N({
    text: `Pravoúhlý trojúhelník má obsah ${cm2(S)} a jednu odvěsnu dlouhou ${cm(a)}. Nad druhou odvěsnou je sestrojen čtverec.`, q: 'Jaký obsah má tento čtverec?', ans: bb * bb, unit: 'cm²', units: 1,
    hints: ['Obsah pravoúhlého trojúhelníku je polovina součinu odvěsen. Z toho dopočítej druhou odvěsnu.'], steps: [`Druhá odvěsna: 2 · ${cz(S)} : ${a} = ${cm(bb)}`, `Čtverec: ${bb} · ${bb} = ${cm2(bb * bb)}`],
  });
}

// ======================= 705 KONSTRUKCE ČTYŘÚHELNÍKŮ =======================
const ROVN_OPS = ['seg', 'ray', 'circ', 'paral', 'int', 'poly'];
function kon_rovn(mode, koso) {
  let a = ri(5, 8), bb = koso ? a : ri(3, a - 1); const al = pick([50, 60, 70, 110]);
  return K({
    mode, tpl: 'par', dano: koso ? { a: cm(a), al: st(al) } : { a: cm(a), b: cm(bb), al: st(al) }, sestroj: koso ? 'kosočtverec ABCD' : 'rovnoběžník ABCD', text: koso ? `Sestroj kosočtverec ABCD${mode < 3 ? ' (rovnoběžník, který má všechny strany stejně dlouhé)' : ''}: a = ${B(cm(a))}, α = ${B(st(al))}.` : `Sestroj rovnoběžník ABCD: a = ${B(cm(a))}, b = ${B(cm(bb))}, α = ${B(st(al))}.`,
    plan: [{ op: 'seg', a: 'A', b: 'B', len: a }, { op: 'ray', name: 'AX', v: 'A', to: 'B', ang: al }, { op: 'circ', name: 'k', c: 'A', r: bb }, { op: 'int', name: 'D', of: ['AX', 'k'] },
      { op: 'paral', name: 'p', to: 'AB', thru: 'D' }, { op: 'paral', name: 'q', to: 'AX', thru: 'B' }, { op: 'int', name: 'C', of: ['p', 'q'] }, { op: 'poly', pts: ['A', 'B', 'C', 'D'], label: (koso ? 'kosočtverec' : 'rovnoběžník') + ' ABCD' }],
    goal: [['dist', 'A', 'B', a], ['dist', 'A', 'D', bb], ['ang', 'B', 'A', 'D', al], ['parl', 'A', 'B', 'D', 'C'], ['parl', 'A', 'D', 'B', 'C'], ['poly', 'ABCD']],
    lens: koso ? [a] : [a, bb], angs: [al], names: ['D', 'C'], ops: ROVN_OPS, vysl: ['A', 'B', 'C', 'D'], vyslPopis: (koso ? 'kosočtverec' : 'rovnoběžník') + ' ABCD',
    nsol: 1, nsolProc: 'Trojúhelník ABD je určen podle věty sus a bod C je průsečík dvou rovnoběžek. Úloha má jedno řešení.',
    hints: ['Strany a, b a úhel α určují trojúhelník ABD (věta sus). Začni jím.', 'Bod C doplníš rovnoběžkami: jedna vede bodem D rovnoběžně s AB, druhá bodem B rovnoběžně s AD.'],
  });
}
function kon_rovnE(mode) {
  let a, bb, e; do { a = ri(5, 7); bb = ri(3, 5); e = ri(6, 9); } while (a === bb || e >= a + bb - 1 || e <= a - bb + 2 || e === a || e === bb);
  return K({
    mode, tpl: 'par', dano: { a: cm(a), b: cm(bb), e: cm(e) }, sestroj: 'rovnoběžník ABCD', text: `Sestroj rovnoběžník ABCD: a = ${B(cm(a))}, b = ${B(cm(bb))}, úhlopříčka e = |AC| = ${B(cm(e))}${mode < 3 ? ' (úhlopříčka spojuje protější vrcholy A a C)' : ''}.`,
    plan: [{ op: 'seg', a: 'A', b: 'B', len: a }, { op: 'circ', name: 'k', c: 'A', r: e }, { op: 'circ', name: 'l', c: 'B', r: bb }, { op: 'int', name: 'C', of: ['k', 'l'] }, { op: 'seg', a: 'B', b: 'C' },
      { op: 'paral', name: 'p', to: 'AB', thru: 'C' }, { op: 'paral', name: 'q', to: 'BC', thru: 'A' }, { op: 'int', name: 'D', of: ['p', 'q'] }, { op: 'poly', pts: ['A', 'B', 'C', 'D'], label: 'rovnoběžník ABCD' }],
    goal: [['dist', 'A', 'B', a], ['dist', 'B', 'C', bb], ['dist', 'A', 'C', e], ['parl', 'A', 'B', 'D', 'C'], ['parl', 'A', 'D', 'B', 'C'], ['poly', 'ABCD']],
    lens: [a, bb, e], names: ['C', 'D'], ops: ROVN_OPS, vysl: ['A', 'B', 'C', 'D'], vyslPopis: 'rovnoběžník ABCD',
    nsol: 1, nsolProc: 'Trojúhelník ABC je určen třemi stranami (sss), bod D pak dvěma rovnoběžkami. Úloha má jedno řešení.',
    hints: ['Strany a, b a úhlopříčka e tvoří trojúhelník ABC. Ten sestrojíš ze tří stran.', 'Bod D doplníš rovnoběžkami: bodem C rovnoběžně s AB a bodem A rovnoběžně s BC.'],
  });
}
function kon_lich(mode) {
  let a, al, be, v; do { a = ri(7, 9); v = ri(3, 4); al = pick([50, 60, 70]); be = pick([45, 60, 75]); } while (al === be || a - v / Math.tan(al * Math.PI / 180) - v / Math.tan(be * Math.PI / 180) < 2);
  return K({
    mode, tpl: 'trap', dano: { a: cm(a), al: st(al), be: st(be), v: cm(v) }, sestroj: 'lichoběžník ABCD, AB ∥ CD', text: `Sestroj lichoběžník ABCD (AB ∥ CD): a = ${B(cm(a))}, α = ${B(st(al))}, β = ${B(st(be))}, výška v = ${B(cm(v))}.`,
    plan: [{ op: 'seg', a: 'A', b: 'B', len: a }, { op: 'par', name: 'p', to: 'AB', dist: v }, { op: 'ray', name: 'AX', v: 'A', to: 'B', ang: al }, { op: 'ray', name: 'BY', v: 'B', to: 'A', ang: be },
      { op: 'int', name: 'D', of: ['AX', 'p'] }, { op: 'int', name: 'C', of: ['BY', 'p'] }, { op: 'poly', pts: ['A', 'B', 'C', 'D'], label: 'lichoběžník ABCD' }],
    goal: [['dist', 'A', 'B', a], ['ang', 'B', 'A', 'D', al], ['ang', 'A', 'B', 'C', be], ['hgt', 'D', 'A', 'B', v], ['hgt', 'C', 'A', 'B', v], ['poly', 'ABCD']],
    lens: [a, v], angs: [al, be], names: ['D', 'C'], ops: ['seg', 'par', 'ray', 'circ', 'int', 'poly'], vysl: ['A', 'B', 'C', 'D'], vyslPopis: 'lichoběžník ABCD',
    nsol: 1, nsolProc: 'Každá z polopřímek protne rovnoběžku p v jediném bodě. Úloha má jedno řešení.',
    hints: ['Body C a D leží na přímce rovnoběžné s AB ve vzdálenosti v. Narýsuj ji hned po straně AB.', 'Bod D leží na rameni úhlu α, bod C na rameni úhlu β. Oba najdeš jako průsečíky s rovnoběžkou.'],
  });
}
function kon_lichC() {
  let a, al, v, c; do { a = ri(7, 9); v = ri(3, 4); al = pick([50, 60, 70]); c = ri(3, 5); } while (v / Math.tan(al * Math.PI / 180) + c > a - 0.5 || c === v);
  return K({
    mode: 3, tpl: 'trap', dano: { a: cm(a), c: cm(c), al: st(al), v: cm(v) }, sestroj: 'lichoběžník ABCD, AB ∥ CD', text: `Sestroj lichoběžník ABCD (AB ∥ CD): a = ${B(cm(a))}, c = ${B(cm(c))}, α = ${B(st(al))}, výška v = ${B(cm(v))}.`,
    plan: [{ op: 'seg', a: 'A', b: 'B', len: a }, { op: 'par', name: 'p', to: 'AB', dist: v }, { op: 'ray', name: 'AX', v: 'A', to: 'B', ang: al }, { op: 'int', name: 'D', of: ['AX', 'p'] },
      { op: 'circ', name: 'k', c: 'D', r: c }, { op: 'int', name: 'C', of: ['p', 'k'], pick: 1 }, { op: 'poly', pts: ['A', 'B', 'C', 'D'], label: 'lichoběžník ABCD' }],
    goal: [['dist', 'A', 'B', a], ['ang', 'B', 'A', 'D', al], ['hgt', 'D', 'A', 'B', v], ['dist', 'D', 'C', c], ['parl', 'A', 'B', 'D', 'C'], ['ang', 'A', 'D', 'C', 180 - al], ['poly', 'ABCD']],
    lens: [a, c, v], angs: [al], names: ['D', 'C'], ops: ['seg', 'par', 'ray', 'circ', 'int', 'poly'], vysl: ['A', 'B', 'C', 'D'], vyslPopis: 'lichoběžník ABCD',
    nsol: 1, nsolProc: 'Kružnice k(D; c) protne přímku p ve dvou bodech, ale jen ten vpravo od bodu D dává lichoběžník ABCD. Úloha má jedno řešení.',
    hints: ['Body C a D leží na rovnoběžce s AB ve vzdálenosti v. Bod D najdeš na rameni úhlu α.', 'Bod C je na rovnoběžce ve vzdálenosti c od bodu D. Z obou průsečíků vyber ten, který dává lichoběžník (napravo od D).'],
  });
}
function ct_vlastnost() {
  const [q, ok, bad] = pick([
    ['Protější strany rovnoběžníku jsou…', 'rovnoběžné a stejně dlouhé', ['rovnoběžné, ale různě dlouhé', 'kolmé a stejně dlouhé', 'různoběžné']],
    ['Úhlopříčky rovnoběžníku (spojnice protějších vrcholů)…', 'se navzájem půlí', ['jsou vždy stejně dlouhé', 'jsou vždy kolmé', 'půlí úhly u vrcholů']],
    ['Lichoběžník má…', 'právě jednu dvojici rovnoběžných stran', ['dvě dvojice rovnoběžných stran', 'všechny strany stejně dlouhé', 'všechny úhly pravé']],
    ['Úhlopříčky kosočtverce (spojnice protějších vrcholů)…', 'se půlí a jsou na sebe kolmé', ['jsou stejně dlouhé', 'se nepůlí', 'jsou rovnoběžné se stranami']],
  ]);
  return C({ text: q, q: 'Doplň větu.', ok, bad, hints: ['Vybav si obrázek útvaru a jeho rovnoběžné strany.', 'Rovnoběžník má dvě dvojice rovnoběžných stran, lichoběžník jen jednu.', 'Vlastnosti, které platí jen pro obdélník nebo čtverec, neplatí pro každý rovnoběžník.'], steps: [`${q.replace('…', '')} ${ok}.`] });
}
function ct_krokC() {
  return C({
    text: 'Rýsujeme rovnoběžník ABCD. Body A, B a D už máme.', q: 'Jak najdeme bod C?', ok: 'Jako průsečík rovnoběžky s AB vedené bodem D a rovnoběžky s AD vedené bodem B',
    bad: ['Jako průsečík kolmice k AB v bodě B a kolmice k AD v bodě D', 'Jako střed úsečky BD', 'Jako průsečík os úseček AB a AD'],
    hints: ['V rovnoběžníku je strana DC rovnoběžná s AB a strana BC rovnoběžná s AD.', 'Bod C leží na obou těchto stranách zároveň.', 'Proto ho najdeme jako průsečík dvou rovnoběžek.'], steps: ['DC ∥ AB a BC ∥ AD, proto je C průsečík těchto dvou rovnoběžek.'],
  });
}
function ct_protejsi() {
  let a, bb; do { a = ri(4, 12); bb = ri(3, 9); } while (a === bb);
  const cd = chance(0.5);
  return N({
    text: `V rovnoběžníku ABCD je |AB| = ${cm(a)} a |BC| = ${cm(bb)}.`, q: `Jak dlouhá je strana ${cd ? 'CD' : 'DA'}?`, ans: cd ? a : bb, unit: 'cm',
    traps: [[cd ? bb : a, 'To je sousední strana. Stejně dlouhé jsou protější strany.']],
    hints: ['Protější strany rovnoběžníku jsou stejně dlouhé.', 'Naproti straně AB leží strana CD, naproti straně BC leží strana DA.', cd ? '|CD| = |AB|' : '|DA| = |BC|'], steps: [cd ? `|CD| = |AB| = ${cm(a)}` : `|DA| = |BC| = ${cm(bb)}`],
  });
}

// ======================= 706 HRANOLY =======================
function h_objemSp() {
  const S = ri(6, 40), v = ri(3, 12);
  return N({
    text: `Hranol má podstavu (dolní stěnu, horní je stejná) o obsahu ${B(cm2(S))} a výšku ${B(cm(v))}.`, q: 'Vypočítej jeho objem.', ans: S * v, unit: 'cm³', traps: [[S + v, 'Obsah podstavy se výškou násobí.'], [2 * S + v, 'To není vzorec pro objem.']],
    hints: ['Hranol si představ jako stoh stejných destiček tvaru podstavy.', 'Objem = obsah podstavy · výška: V = S<sub>p</sub> · v.', `V = ${S} · ${v}`], steps: ['V = S<sub>p</sub> · v', `V = ${S} · ${v} = ${cm3(S * v)}`],
  });
}
function h_pocty() {
  const [n, jm, uh] = pick([[3, 'Trojboký', 'trojúhelník'], [4, 'Čtyřboký', 'čtyřúhelník'], [5, 'Pětiboký', 'pětiúhelník'], [6, 'Šestiboký', 'šestiúhelník']]), [co, ans, proc] = pick([['stěn', n + 2, `${n} bočních stěn a 2 podstavy`], ['vrcholů', 2 * n, `${n} vrcholů dole a ${n} nahoře`], ['hran', 3 * n, `${n} hran dolní podstavy, ${n} horní a ${n} bočních`]]);
  return N({
    text: `${jm} hranol má za podstavu ${uh}.`, q: `Kolik má ${co}?`, ans,
    hints: ['Hranol má dvě stejné podstavy a mezi nimi boční stěny.', 'Bočních stěn je tolik, kolik stran má podstava.', proc + '.'], steps: [`${proc[0].toUpperCase() + proc.slice(1)}: celkem ${ans}.`],
  });
}
function h_plast() {
  const o = ri(10, 30), v = ri(4, 12);
  return N({
    text: `Podstava hranolu (dolní stěna) má obvod ${B(cm(o))}. Hranol je vysoký ${B(cm(v))}.`, q: 'Vypočítej obsah jeho pláště (všech bočních stěn dohromady).', ans: o * v, unit: 'cm²',
    hints: ['Plášť jsou všechny boční stěny dohromady.', 'Když plášť rozvineš do roviny, vznikne obdélník. Jedna jeho strana je obvod podstavy, druhá výška hranolu.', `S<sub>pl</sub> = ${o} · ${v}`], steps: ['S<sub>pl</sub> = obvod podstavy · výška', `S<sub>pl</sub> = ${o} · ${v} = ${cm2(o * v)}`],
  });
}
function h_povrchZCasti() {
  const Sp = ri(6, 30), Spl = ri(40, 200);
  return N({
    text: `Hranol má podstavu (dolní stěnu, horní je stejná) o obsahu ${B(cm2(Sp))} a plášť (všechny boční stěny dohromady) o obsahu ${B(cm2(Spl))}.`, q: 'Vypočítej jeho povrch.', ans: 2 * Sp + Spl, unit: 'cm²', traps: [[Sp + Spl, 'Hranol má dvě podstavy, dolní a horní.']],
    hints: ['Povrch je obsah všech stěn dohromady.', 'Hranol má dvě stejné podstavy a plášť: S = 2 · S<sub>p</sub> + S<sub>pl</sub>.', `S = 2 · ${Sp} + ${Spl}`], steps: ['S = 2 · S<sub>p</sub> + S<sub>pl</sub>', `S = 2 · ${Sp} + ${Spl} = ${cm2(2 * Sp + Spl)}`],
  });
}
function h_pojem() {
  const [q, ok, bad] = pick([['Kolik podstav má každý hranol?', 'dvě', ['jednu', 'tři', 'žádnou']], ['Jaký tvar mají boční stěny kolmého hranolu?', 'obdélník', ['trojúhelník', 'kruh', 'lichoběžník']], ['Kvádr a krychle jsou hranoly. Jaký tvar má jejich podstava?', 'čtyřúhelník', ['trojúhelník', 'šestiúhelník', 'kruh']]]);
  return C({ text: 'Hranoly.', q, ok, bad, hints: ['Hranol má dole a nahoře dvě stejné podstavy.', 'Podstavy spojují boční stěny. U kolmého hranolu stojí boční hrany kolmo na podstavu.', 'Podle počtu stran podstavy mluvíme o trojbokém, čtyřbokém, pětibokém… hranolu.'], steps: [`Správně: ${ok}.`] });
}
function h_objemTroj() {
  const a = ri(3, 8), bb = 2 * ri(2, 5), v = ri(5, 12);
  return N({
    text: `Trojboký hranol má za podstavu pravoúhlý trojúhelník s odvěsnami (dvěma kratšími stranami u pravého úhlu) ${B(cm(a))} a ${B(cm(bb))}. Výška hranolu je ${B(cm(v))}.`, q: 'Vypočítej jeho objem.', fig: fPrism(a, bb, v, { la: cm(a), lb: cm(bb), lh: cm(v) }), ans: a * bb / 2 * v, unit: 'cm³',
    traps: [[a * bb * v, 'Podstava je trojúhelník, ne obdélník. Její obsah je a · b : 2.']],
    hints: ['V = S<sub>p</sub> · v. Nejdřív spočítej obsah podstavy.', 'Podstava je pravoúhlý trojúhelník: S<sub>p</sub> = a · b : 2.'], steps: [`S<sub>p</sub> = ${a} · ${bb} : 2 = ${cm2(a * bb / 2)}`, `V = ${a * bb / 2} · ${v} = ${cm3(a * bb / 2 * v)}`],
  });
}
function h_povrchTroj() {
  const k = ri(1, 2), [a, bb, c] = [3 * k, 4 * k, 5 * k], v = ri(5, 12), S = a * bb + (a + bb + c) * v;
  return N({
    text: `Trojboký hranol má za podstavu pravoúhlý trojúhelník se stranami ${B(`${a} cm, ${bb} cm a ${c} cm`)}. Výška hranolu je ${B(cm(v))}.`, q: 'Vypočítej jeho povrch.', fig: fPrism(a, bb, v, { la: cm(a), lb: cm(bb), lh: cm(v), lc: cm(c) }), ans: S, unit: 'cm²',
    traps: [[a * bb / 2 + (a + bb + c) * v, 'Podstavy jsou dvě.'], [2 * a * bb + (a + bb + c) * v, 'Obsah trojúhelníkové podstavy je a · b : 2.']],
    hints: ['S = 2 · S<sub>p</sub> + S<sub>pl</sub>. Podstava je pravoúhlý trojúhelník s odvěsnami ' + a + ' cm a ' + bb + ' cm.', 'Plášť = obvod podstavy · výška hranolu.'],
    steps: [`S<sub>p</sub> = ${a} · ${bb} : 2 = ${cm2(a * bb / 2)}`, `Obvod podstavy: ${a} + ${bb} + ${c} = ${cm(a + bb + c)}`, `S<sub>pl</sub> = ${a + bb + c} · ${v} = ${cm2((a + bb + c) * v)}`, `S = 2 · ${a * bb / 2} + ${(a + bb + c) * v} = ${cm2(S)}`],
  });
}
function h_vyskaZObjemu() {
  const S = ri(6, 30), v = ri(3, 12), chciV = chance(0.5);
  return N({
    text: chciV ? `Hranol má objem ${B(cm3(S * v))} a podstavu (dolní stěnu, horní je stejná) o obsahu ${B(cm2(S))}.` : `Hranol má objem ${B(cm3(S * v))} a výšku ${B(cm(v))}.`, q: chciV ? 'Jak je vysoký?' : 'Jaký obsah má jeho podstava (dolní stěna)?', ans: chciV ? v : S, unit: chciV ? 'cm' : 'cm²',
    hints: ['V = S<sub>p</sub> · v. Dva z těchto tří údajů znáš.', chciV ? 'v = V : S<sub>p</sub>' : 'S<sub>p</sub> = V : v'], steps: [chciV ? `v = ${S * v} : ${S} = ${cm(v)}` : `S<sub>p</sub> = ${S * v} : ${v} = ${cm2(S)}`],
  });
}
function h_objemLich() {
  const [a, c, vp] = lich(), h = ri(5, 12), Sp = (a + c) * vp / 2;
  return N({
    text: `Hranol má za podstavu lichoběžník se základnami (rovnoběžnými stranami) ${B(cm(a))} a ${B(cm(c))} a výškou ${B(cm(vp))}. Výška hranolu je ${B(cm(h))}.`, q: 'Vypočítej jeho objem.', ans: Sp * h, unit: 'cm³',
    traps: [[(a + c) * vp * h, 'U obsahu lichoběžníku nezapomeň dělit dvěma.']],
    hints: ['V = S<sub>p</sub> · v. Podstava je lichoběžník.', 'S<sub>p</sub> = (a + c) · v<sub>p</sub> : 2. Pozor, výška podstavy a výška hranolu jsou dvě různé věci.'], steps: [`S<sub>p</sub> = (${a} + ${c}) · ${vp} : 2 = ${cm2(Sp)}`, `V = ${Sp} · ${h} = ${cm3(Sp * h)}`],
  });
}
function h_litry() {
  const S = ri(4, 20), v = ri(2, 9);
  return N({
    text: `Nádoba tvaru hranolu má dno o obsahu ${B(S + ' dm²')} a je vysoká ${B(v + ' dm')}.`, q: 'Kolik litrů se do ní vejde?', ans: S * v, unit: 'l',
    hints: ['V = S<sub>p</sub> · v vyjde v dm³.', '1 dm³ = 1 l'], steps: [`V = ${S} · ${v} = ${S * v} dm³`, `${S * v} dm³ = ${S * v} l`],
  });
}
// --- úroveň 3 ---
function h_prikop() {
  const nah = pick([1.8, 2, 2.4]), dol = pick([0.8, 1, 1.2]), hl = pick([0.5, 1, 1.5]), d = 10 * ri(2, 8), S = rd((nah + dol) * hl / 2, 2);
  return N({
    text: `Příkop má průřez tvaru lichoběžníku: nahoře je široký ${cz(nah)} m, u dna ${cz(dol)} m a je hluboký ${cz(hl)} m. Příkop je dlouhý ${d} m.`, q: 'Kolik metrů krychlových zeminy se muselo vykopat?', ans: rd(S * d, 1), unit: 'm³', units: 1,
    traps: [[rd((nah + dol) * hl * d, 1), 'U obsahu lichoběžníku nezapomeň dělit dvěma.']],
    hints: ['Příkop je hranol položený na boční stěně. Jeho podstavou je průřez a „výškou“ délka příkopu.'], steps: [`Průřez: (${cz(nah)} + ${cz(dol)}) · ${cz(hl)} : 2 = ${cz(S)} m²`, `V = ${cz(S)} · ${d} = ${cz(rd(S * d, 1))} m³`],
  });
}
function h_stan() {
  const z = pick([1.4, 1.6, 2]), v = pick([1, 1.2, 1.5]), d = pick([2, 3]), V = rd(z * v / 2 * d, 2);
  return N({
    text: `Stan má tvar trojbokého hranolu. Jeho čelo je trojúhelník se základnou ${cz(z)} m a výškou ${cz(v)} m. Stan je dlouhý ${cz(d)} m.`, q: 'Kolik metrů krychlových vzduchu je uvnitř?', ans: V, unit: 'm³', units: 1,
    traps: [[rd(z * v * d, 2), 'Čelo je trojúhelník, jeho obsah je základna · výška : 2.']], hints: ['Podstavou hranolu je čelo stanu, výškou hranolu jeho délka.'], steps: [`Čelo: ${cz(z)} · ${cz(v)} : 2 = ${cz(z * v / 2)} m²`, `V = ${cz(z * v / 2)} · ${cz(d)} = ${cz(V)} m³`],
  });
}
function h_tram() {
  const s = pick([10, 15, 20]), L = pick([3, 4, 5]), ro = pick([500, 600, 800]), V = rd(s * s / 10000 * L, 4);
  return N({
    text: `Dřevěný trám má čtvercový průřez o straně ${s} cm a je dlouhý ${L} m. Jeden metr krychlový tohoto dřeva váží ${ro} kg.`, q: 'Kolik kilogramů trám váží?', ans: rd(V * ro, 2), unit: 'kg',
    traps: [[rd(s * s * L * ro, 2), 'Stranu průřezu je potřeba převést na metry.']], hints: ['Všechny rozměry převeď na metry, spočítej objem v m³ a vynásob hmotností jednoho m³.'],
    steps: [`${s} cm = ${cz(s / 100)} m`, `V = ${cz(s / 100)} · ${cz(s / 100)} · ${L} = ${cz(V, 4)} m³`, `m = ${cz(V, 4)} · ${ro} = ${cz(rd(V * ro, 2))} kg`],
  });
}
function h_sestiboky() {
  const [a, Sp] = pick([[4, 41.6], [6, 93.5], [5, 65]]), v = ri(8, 15), S = rd(2 * Sp + 6 * a * v, 1);
  return N({
    text: `Pravidelný šestiboký hranol má podstavnou hranu ${cm(a)}, podstavu o obsahu ${cm2(Sp)} a výšku ${cm(v)}.`, q: 'Vypočítej jeho povrch.', ans: S, unit: 'cm²', units: 1,
    traps: [[rd(Sp + 6 * a * v, 1), 'Podstavy jsou dvě.']], hints: ['S = 2 · S<sub>p</sub> + S<sub>pl</sub>. Plášť tvoří šest stejných obdélníků.'], steps: [`S<sub>pl</sub> = 6 · ${a} · ${v} = ${cm2(6 * a * v)}`, `S = 2 · ${cz(Sp)} + ${6 * a * v} = ${cm2(S)}`],
  });
}
function h_cokolada() {
  const [a, vp] = pick([[3, 2.6], [4, 3.5], [5, 4.3]]), d = pick([15, 20, 25]), S = rd(a * vp + 3 * a * d, 1);
  return N({
    text: `Krabička od čokolády má tvar trojbokého hranolu. Podstava je rovnostranný trojúhelník se stranou ${cm(a)} a výškou ${cm(vp)}. Krabička je dlouhá ${cm(d)}.`, q: 'Kolik cm² papíru je na ni potřeba? (Přehyby nepočítej.)', ans: S, unit: 'cm²', units: 1,
    traps: [[rd(a * vp / 2 + 3 * a * d, 1), 'Podstavy jsou dvě.']], hints: ['Je to povrch hranolu: dvě trojúhelníkové podstavy a plášť ze tří stejných obdélníků.'],
    steps: [`S<sub>p</sub> = ${a} · ${cz(vp)} : 2 = ${cm2(a * vp / 2)}`, `S<sub>pl</sub> = 3 · ${a} · ${d} = ${cm2(3 * a * d)}`, `S = 2 · ${cz(a * vp / 2)} + ${3 * a * d} = ${cm2(S)}`],
  });
}

// ======================= VÝKLAD =======================
const ukSus = () => kSvg(kProved([{ op: 'seg', a: 'A', b: 'B', len: 6 }, { op: 'ray', name: 'AX', v: 'A', to: 'B', ang: 50 }, { op: 'circ', name: 'k', c: 'A', r: 4 }, { op: 'int', name: 'C', of: ['AX', 'k'] }, { op: 'poly', pts: ['A', 'B', 'C'] }]), { H: 220 });
const ukStred = () => gridSvg({ cols: 9, rows: 6, stred: [4, 3], body: [[1, 1], [3, 1], [2, 3]], jmena: ['A', 'B', 'C'], uzavrit: true }, [], [[7, 5], [5, 5], [6, 3]]);
const ukRovn = () => kSvg(kProved([{ op: 'seg', a: 'A', b: 'B', len: 6 }, { op: 'ray', name: 'AX', v: 'A', to: 'B', ang: 60 }, { op: 'circ', name: 'k', c: 'A', r: 4 }, { op: 'int', name: 'D', of: ['AX', 'k'] }, { op: 'paral', name: 'p', to: 'AB', thru: 'D' }, { op: 'paral', name: 'q', to: 'AX', thru: 'B' }, { op: 'int', name: 'C', of: ['p', 'q'] }, { op: 'poly', pts: ['A', 'B', 'C', 'D'] }]), { H: 220 });

export const R7 = { rocnik: 7, temata: [
  { id: '701', nazev: 'Shodnost trojúhelníků', ikona: '≅', popis: 'Věty sss, sus, usu a konstrukce podle nich', strazce: 'Dvojník', kon: 1,
    vyklad: [
      { h: 'Co znamená shodné', t: 'Dva útvary jsou <b>shodné</b>, když je můžeš položit na sebe tak, že se přesně kryjí. Mají stejný tvar i stejnou velikost. Značka shodnosti je <b>≅</b>.<br><br>V zápisu △ABC ≅ △KLM záleží na pořadí: vrchol A patří ke K, B k L a C k M. Proto |AB| = |KL| a úhel u A je stejný jako úhel u K.', fig: () => fTri(triSSS(5, 6, 7), { sides: ['c', 'a', 'b'] }) },
      { h: 'Tři údaje stačí', t: 'Když chceš zjistit, jestli jsou dva trojúhelníky shodné, nemusíš měřit všechno. Stačí tři správně zvolené údaje:<br><br><b>sss</b> – tři strany<br><b>sus</b> – dvě strany a úhel <b>mezi nimi</b><br><b>usu</b> – strana a oba úhly <b>u ní</b><br><br>Písmeno s znamená stranu, u znamená úhel. Pořadí písmen říká, jak prvky leží za sebou.' },
      { h: 'Konstrukce podle sus', t: 'Máme c = 6 cm, b = 4 cm, α = 50°. Úhel α leží u vrcholu A mezi stranami c a b.<br>1. Strana AB = 6 cm.<br>2. U bodu A úhel 50° (polopřímka AX).<br>3. Kružnice k(A; 4 cm) odměří na polopřímce stranu b.<br>4. Bod C je průsečík polopřímky a kružnice.', fig: ukSus },
      { h: 'Konstrukce podle usu', t: 'Máme c = 6 cm, α = 50°, β = 60°. Oba úhly leží u strany c.<br>1. Strana AB = 6 cm.<br>2. U bodu A úhel 50°, u bodu B úhel 60°.<br>3. Bod C je tam, kde se ramena úhlů protnou.<br><br>Když znáš úhly α a γ, třetí si dopočítej: β = 180° − α − γ.', fig: () => fTri(triAng(6, 50, 60), { sides: ['6 cm', '', ''], angs: ['50°', '60°', ''] }) },
      { h: 'Pozor na tři úhly', t: 'Tři úhly trojúhelník neurčují. Určí jen jeho tvar, ale ne velikost: malý a velký trojúhelník se stejnými úhly shodné nejsou. Ani dvě strany samy nestačí, protože je můžeš rozevřít pod jakýmkoli úhlem.' },
    ],
    u: [[sh_veta, sh_strana, sh_uhel, sh_urceni, () => kon_sus(1), () => kon_usu(1)], [() => kon_sus(2), () => kon_usu(2), sh_urciVetu, sh_obvod, sh_uhlopricka], [() => kon_sus(3), () => kon_usu(3), kon_usuGama, kon_Ssu, sh_slovni]],
    rychle: [sh_veta, sh_strana, sh_uhel, sh_urceni] },
  { id: '702', nazev: 'Středová souměrnost', ikona: '⟲', popis: 'Otočení o půl kruhu kolem středu, středově souměrné útvary', strazce: 'Otočník',
    vyklad: [
      { h: 'Půl otočky kolem bodu', t: 'Zapíchni do papíru špendlík a otoč papír o půl kruhu (o 180°). Každý bod se přestěhuje na opačnou stranu špendlíku. To je <b>středová souměrnost</b>. Místo se špendlíkem je <b>střed souměrnosti S</b>.', fig: ukStred },
      { h: 'Jak najít obraz bodu', t: '1. Spoj bod A se středem S.<br>2. Pokračuj za střed stejným směrem.<br>3. Odměř stejnou vzdálenost: |SA′| = |SA|.<br><br>Na čtverečkovaném papíře stačí počítat: když je to z A do S dva doprava a jeden nahoru, jdi ze S zase dva doprava a jeden nahoru. Střed S se zobrazí sám na sebe.' },
      { h: 'Obraz je shodný a otočený', t: 'Středová souměrnost nic nezvětšuje. Obraz úsečky je stejně dlouhá úsečka a je s původní <b>rovnoběžná</b>. Obraz trojúhelníku je shodný trojúhelník, jen „vzhůru nohama“.' },
      { h: 'Středově souměrné útvary', t: 'Útvar je středově souměrný, když po otočení o 180° vypadá úplně stejně. Jeho střed souměrnosti leží „uprostřed“.<br><br>Středově souměrné jsou: úsečka, rovnoběžník, obdélník, čtverec, kosočtverec, kruh, pravidelný šestiúhelník.<br><br>Žádný trojúhelník středově souměrný není.', fig: () => fShape('rovnobeznik', { stred: 1 }) },
    ],
    u: [[ss_bod, ss_utvar, ss_vzd, ss_pismeno, ss_usecka], [ss_troj, ss_usecka, ss_shodnost, ss_stredUtvaru, ss_troj], [ss_ctyr, ss_troj3, ss_rovnobeznik, ss_oboji, ss_ctyr]],
    rychle: [ss_vzd, ss_pismeno, ss_utvar] },
  { id: '703', nazev: 'Rovnoběžníky', ikona: '▱', popis: 'Vlastnosti, obvod a obsah rovnoběžníku a kosočtverce', strazce: 'Kosodlak',
    vyklad: [
      { h: 'Co je rovnoběžník', t: '<b>Rovnoběžník</b> je čtyřúhelník, jehož protější strany jsou rovnoběžné.<br><br>Platí v něm:<br>• protější strany jsou stejně dlouhé,<br>• protější úhly jsou stejně velké,<br>• sousední úhly dávají dohromady 180°,<br>• úhlopříčky se navzájem půlí.', fig: () => fPar(9, 6, 62, { la: 'a', lb: 'b', lang: 'α', names: 1 }) },
      { h: 'Čtyři druhy', t: '<b>Obdélník</b>: pravé úhly, sousední strany různé.<br><b>Čtverec</b>: pravé úhly, všechny strany stejné.<br><b>Kosočtverec</b>: všechny strany stejné, úhly nejsou pravé.<br><b>Kosodélník</b>: sousední strany různé, úhly nejsou pravé.<br><br>Všechno to jsou rovnoběžníky.' },
      { h: 'Výška rovnoběžníku', t: '<b>Výška</b> je vzdálenost dvou rovnoběžných stran. Měří se kolmo. Rovnoběžník má dvě výšky: v<sub>a</sub> ke straně a a v<sub>b</sub> ke straně b.', fig: () => fPar(9, 6, 62, { la: 'a', lv: VA }) },
      { h: 'Obsah: přestřihni a přelož', t: 'Odstřihni z rovnoběžníku trojúhelník podél výšky a přilož ho na druhou stranu. Vznikne obdélník se stranami a a v<sub>a</sub>. Proto:<br><br><b>S = a · v<sub>a</sub></b><br><br>Obvod se počítá jako u obdélníku: <b>o = 2 · (a + b)</b>.' },
      { h: 'Kosočtverec a úhlopříčky', t: 'Úhlopříčky kosočtverce jsou na sebe kolmé. Kosočtverec zabírá přesně polovinu obdélníku, který má strany dlouhé jako jeho úhlopříčky e a f:<br><br><b>S = e · f : 2</b>', fig: () => fRhomb(8, 5, { le: 'e', lf: 'f' }) },
    ],
    u: [[r_obvod, r_obsah, r_uhel, r_druh, r_kosoObvod], [r_vyskaZObsahu, r_druhaVyska, r_kosoObsah, r_stranaZObvodu, r_uhlopricky, r_jednotky], [r_pozemek, r_kosoZObvodu, r_dveVysky3, r_uhlyPomer, r_kosoUhlopricka, r_parkety]],
    rychle: [r_obvod, r_obsah, r_uhel, r_druh, r_kosoObvod] },
  { id: '704', nazev: 'Obsah trojúhelníku a lichoběžníku', ikona: '⏢', popis: 'Trojúhelník jako půlka rovnoběžníku, lichoběžník', strazce: 'Lichožrout',
    vyklad: [
      { h: 'Trojúhelník je půlka rovnoběžníku', t: 'Vezmi dva stejné trojúhelníky a jeden otoč. Složí rovnoběžník se stranou a a výškou v<sub>a</sub>. Jeden trojúhelník je jeho polovina:<br><br><b>S = a · v<sub>a</sub> : 2</b><br><br>Výška v<sub>a</sub> je kolmice z protějšího vrcholu na stranu a.', fig: () => fTri([[0, 0], [8, 0], [3, 5]], { sides: ['a', '', ''], h: { from: 2, lab: VA }, names: null }) },
      { h: 'Pravoúhlý trojúhelník', t: 'V pravoúhlém trojúhelníku je jedna odvěsna výškou na druhou. Stačí tedy vynásobit odvěsny a vydělit dvěma:<br><br><b>S = a · b : 2</b>', fig: () => fRightTri(6, 4, { la: 'a', lb: 'b', names: false }) },
      { h: 'Výška může ležet i venku', t: 'U tupoúhlého trojúhelníku padne výška mimo trojúhelník, na prodloužení strany. Vzorec S = a · v<sub>a</sub> : 2 platí pořád. Počítá se jen se stranou a, s prodloužením ne.', fig: () => fTri([[0, 0], [5, 0], [8, 4]], { sides: ['a', '', ''], h: { from: 2, lab: VA }, names: null }) },
      { h: 'Lichoběžník', t: '<b>Lichoběžník</b> má jednu dvojici rovnoběžných stran. Říká se jim <b>základny</b> (a, c). Zbylé dvě strany jsou <b>ramena</b> (b, d). <b>Výška</b> v je vzdálenost základen.', fig: () => fTrap(9, 5, 4, 1.5, { la: 'a', lc: 'c', lv: 'v', lb: 'b', ld: 'd' }) },
      { h: 'Obsah lichoběžníku', t: 'Dva stejné lichoběžníky (jeden otočený) složí rovnoběžník se stranou a + c a výškou v. Jeden lichoběžník je jeho polovina:<br><br><b>S = (a + c) · v : 2</b><br><br>Obvod je součet všech čtyř stran.' },
    ],
    u: [[tl_troj, tl_pravo, tl_lich, tl_lichObvod, tl_pojem], [tl_vyskaZObsahu, tl_stranaZObsahu, tl_lichVyska, tl_lichZakladna, tl_tupouhly, tl_jednotky], [tl_stit, tl_pozemek, tl_rozdil, tl_stejnyObsah, tl_ctverecNadOdvesnou]],
    rychle: [tl_troj, tl_pravo, tl_lich, tl_pojem] },
  { id: '705', nazev: 'Konstrukce čtyřúhelníků', ikona: '✎', popis: 'Rovnoběžník, kosočtverec a lichoběžník pravítkem a kružítkem', strazce: 'Čtyřroh', kon: 1,
    vyklad: [
      { h: 'Čtyřúhelník začni trojúhelníkem', t: 'Čtyřúhelník se nerýsuje najednou. Najdi v něm trojúhelník, který umíš sestrojit (podle sss, sus nebo usu), a čtvrtý vrchol pak doplň.<br><br>Nejdřív si vždy načrtni obrázek a vyznač, co znáš.', fig: () => nacrtekSvg('par', ['a', 'b', 'al']) },
      { h: 'Rovnoběžník ze stran a úhlu', t: 'Máme a = 6 cm, b = 4 cm, α = 60°.<br>1. Strana AB.<br>2. U bodu A úhel α a na jeho rameni bod D ve vzdálenosti b (kružnicí).<br>3. Bodem D rovnoběžka s AB.<br>4. Bodem B rovnoběžka s AD.<br>5. Bod C je průsečík obou rovnoběžek.', fig: ukRovn },
      { h: 'Lichoběžník a jeho výška', t: 'V lichoběžníku ABCD je CD ∥ AB. Body C a D proto leží na přímce p, která je s AB rovnoběžná a je od ní vzdálená o výšku v.<br><br>Zápis: <b>p; p ∥ AB, |p, AB| = v</b><br><br>Body C a D pak najdeš na přímce p pomocí úhlů nebo kružnic.', fig: () => nacrtekSvg('trap', ['a', 'al', 'be', 'v']) },
    ],
    u: [[() => kon_rovn(1), ct_vlastnost, ct_krokC, () => kon_lich(1), ct_protejsi, () => kon_rovn(1, 1)], [() => kon_rovn(2), () => kon_lich(2), () => kon_rovnE(2), () => kon_rovn(2, 1), ct_vlastnost], [() => kon_rovn(3), () => kon_lich(3), () => kon_rovnE(3), kon_lichC, () => kon_rovn(3, 1)]],
    rychle: [ct_vlastnost, ct_protejsi, r_druh] },
  { id: '706', nazev: 'Hranoly', ikona: '⬡', popis: 'Povrch a objem kolmých hranolů', strazce: 'Hranoun',
    vyklad: [
      { h: 'Co je hranol', t: '<b>Hranol</b> má dvě stejné rovnoběžné <b>podstavy</b> (trojúhelníky, čtyřúhelníky, šestiúhelníky…) a mezi nimi <b>boční stěny</b>. U kolmého hranolu jsou boční stěny obdélníky.<br><br>Podle podstavy říkáme trojboký, čtyřboký, šestiboký hranol. Kvádr a krychle jsou čtyřboké hranoly.<br><br><b>Výška hranolu</b> je vzdálenost podstav.', fig: () => fPrism(5, 4, 8, { la: 'a', lb: 'b', lh: 'v' }) },
      { h: 'Objem: podstava krát výška', t: 'Hranol si představ jako stoh tenkých destiček, které mají všechny tvar podstavy. Čím vyšší stoh, tím větší objem:<br><br><b>V = S<sub>p</sub> · v</b><br><br>S<sub>p</sub> je obsah podstavy, v výška hranolu. Nejdřív tedy vždy spočítej obsah podstavy.' },
      { h: 'Povrch: dvě podstavy a plášť', t: 'Povrch hranolu tvoří dvě podstavy a <b>plášť</b> (všechny boční stěny).<br><br><b>S = 2 · S<sub>p</sub> + S<sub>pl</sub></b><br><br>Když plášť rozvineš do roviny, vznikne jeden velký obdélník. Jeho délka je obvod podstavy, jeho šířka výška hranolu:<br><br><b>S<sub>pl</sub> = obvod podstavy · v</b>' },
      { h: 'Pozor na dvě různé výšky', t: 'U trojbokého hranolu se pletou dvě výšky: <b>výška podstavy</b> (patří trojúhelníku a potřebuješ ji pro S<sub>p</sub>) a <b>výška hranolu</b> (vzdálenost podstav). V zadání si je vždy rozliš.' },
    ],
    u: [[h_objemSp, h_pocty, h_plast, h_povrchZCasti, h_pojem], [h_objemTroj, h_povrchTroj, h_vyskaZObjemu, h_objemLich, h_litry], [h_prikop, h_stan, h_tram, h_sestiboky, h_cokolada]],
    rychle: [h_objemSp, h_pocty, h_plast, h_povrchZCasti, h_pojem] },
] };

// úlohy pro souhrnné opakování v 9. ročníku
export const MIX7 = { u1: [tl_troj, r_obsah, tl_lich, h_objemSp, r_uhel], u2: [r_kosoObsah, tl_lichVyska, h_objemTroj, r_druhaVyska, h_povrchTroj] };
