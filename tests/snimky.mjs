// Snímky hlavních obrazovek + zkouška chybových cest, strážce, výzvy, obrany, města a motivů.
//   node tests/snimky.mjs <složka>
import { otevri, URL } from './hrac.mjs';
const SHOTS = process.argv[2] || '/tmp';
const { b, p, chyby, ok, shot, U, odpovez, serie, domu, vyklad } = await otevri({ shots: SHOTS });
const stavNa = async s => { await p.evaluate(s => { const st = window.__fg.stav; Object.assign(st, s); window.__fg.uloz(); }, s); await p.goto(URL + 'index.html'); await p.waitForTimeout(250); };
const doDruhu = async (test) => { for (let k = 0; k < 12; k++) { const t = await U(); if (test(t.u)) return t; await odpovez(t); await p.click('#u-dal'); } throw new Error('druh úlohy nenalezen'); };
const start = async (id, l) => { await p.click(`.tema[data-id="${id}"] [data-l="${l}"]`); await vyklad(); };
const pryc = async () => { await p.click('#h-zpet'); await p.locator('.okno-akce button', { hasText: 'Ukončit' }).click(); };

await p.goto(URL + 'index.html'); await p.waitForTimeout(400); await shot('01-uvitani');
await p.click('.okno-akce .hl');
await stavNa({ uvod: true, krystaly: 480, xp: 520, mesto: ['domek', 'vez', 'mlyn', 'skola', 'hvezdarna'], urovne: { '601-1': { hv: 3, her: 2 }, '601-2': { hv: 2, her: 1 }, '602-1': { hv: 1, her: 1 } }, vyklad: { 601: true, 602: true, 603: true, 604: true, 605: true, 606: true } });
await shot('02-vyprava');

// výklad
await p.click('.tema[data-id="603"] [data-vyklad]'); await p.click('.okno-akce .hl'); await shot('03-vyklad'); await p.click('.okno-pozadi', { position: { x: 5, y: 5 } });

// číselná úloha: tři chyby → nápověda sama → řešení
await start('601', 1); let t = await doDruhu(u => u.kind === 'num' && u.fig); await shot('04-uloha');
await odpovez(t, false); ok(await p.$('.ul-zv.bad'), 'po 1. chybě chybí zpráva'); ok(!(await p.$('.napoveda')), 'po 1. chybě se nemá ukázat nápověda');
await odpovez(t, false); ok((await p.$$('.napoveda')).length === 1, 'po 2. chybě se má ukázat nápověda'); await shot('05-druha-chyba');
await odpovez(t, false); ok(await p.$('.reseni'), 'po 3. chybě chybí řešení'); ok((await U()).hotovo, 'po 3. chybě není úloha uzavřená'); await shot('06-reseni');
await p.click('#u-dal');
// past: typická chyba dostane cílenou zprávu
t = await doDruhu(u => u.kind === 'num' && u.traps.length);
await p.fill('#u-in', String(t.u.traps[0][0]).replace('.', ',')); await p.click('#u-ok');
ok((await p.textContent('#u-zv')).includes(t.u.traps[0][1].slice(0, 20)), 'cílená zpráva k typické chybě se neukázala');
// nesmyslný vstup nestojí pokus
await p.fill('#u-in', 'abc'); await p.click('#u-ok'); ok(await p.$('.ul-zv.info'), 'nečíselný vstup má dát jen upozornění');
// nápověda na vyžádání
await p.click('#u-nap-b'); ok((await p.$$('.napoveda')).length >= 1, 'tlačítko Nápověda nic neukázalo');
await pryc();

// úroveň 3: jednotka a přesnost
await start('605', 3); t = await doDruhu(u => u.units); await shot('07-jednickar');
await p.fill('#u-in', String(t.u.ans).replace('.', ',')); await p.click('#u-ok'); ok(await p.$('.ul-zv.info'), 'bez jednotky má přijít upozornění');
const spatnaJ = await p.$$eval('.jednotky .chip', (c, j) => c.map(x => x.dataset.j).find(x => x !== j), t.u.unit);
await p.click(`.jednotky .chip[data-j="${spatnaJ}"]`); await p.click('#u-ok'); ok((await p.textContent('#u-zv')).includes('jednotka'), 'špatná jednotka má být chyba');
await pryc();

// síť
await start('602', 2); t = await doDruhu(u => u.kind === 'grid'); await p.click(`.fg-uzel[data-x="${t.u.ans[0][0]}"][data-y="${t.u.ans[0][1]}"]`, { force: true }); await shot('08-sit');
await odpovez({ ...t, u: { ...t.u, ans: t.u.ans.slice(1) } }); await p.waitForTimeout(100); await shot('09-sit-hotovo'); await pryc();

// konstrukce 1, 2, 3
await start('604', 1); t = await doDruhu(u => u.kind === 'kon' && u.plan.length > 3);
for (let i = 0; i < 3; i++) { if (await p.$('#k-dal')) await p.click('#k-dal'); else { const spr = await p.evaluate(async ({ u, i }) => (await import('/js/kon.js')).kOtazka(u, i).ok, { u: t.u, i }); await p.locator('.kon-panel .volba').filter({ hasText: new RegExp('^' + spr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$') }).first().click(); } }
await shot('10-kon-vedena'); await pryc();
await start('604', 2); t = await doDruhu(u => u.kind === 'kon' && u.plan.length > 3); await shot('11-kon-skladani');
// špatné pořadí: krok, který ještě nejde provést, jen upozorní
const posl = await p.evaluate(async s => (await import('/js/kon.js')).kZapis(s), t.u.plan[t.u.plan.length - 1]);
await p.locator('.krok').filter({ hasText: posl }).first().click(); ok(await p.$('.ul-zv.info'), 'krok mimo pořadí má jen upozornit'); ok((await p.$$('#k-zapis li')).length === 0, 'krok mimo pořadí se neměl přidat');
await p.click('#k-ok'); ok(await p.$('.ul-zv.bad'), 'kontrola nedokončené konstrukce má být chyba'); await pryc();
await start('604', 3); t = await doDruhu(u => u.kind === 'kon' && u.tpl); await p.click('.nk-el[data-el="a"] .nk-hit', { force: true }); await shot('12-nacrtek');
await p.click('#k-ok'); ok((await p.textContent('#u-zv')).includes('prvky'), 'neúplný náčrtek má být chyba');
await p.click('.nk-el[data-el="a"] .nk-hit', { force: true }); await odpovez(t); ok((await U()).hotovo, 'konstrukce na úrovni 3 nedokončena'); await shot('13-kon-hotovo', true);
await pryc();

// celá série → výsledek
await start('606', 1); await serie('606/1'); await shot('14-vysledek'); await domu();

// strážce
await stavNa({ urovne: { '601-1': { hv: 3, her: 2 }, '601-2': { hv: 2, her: 1 }, '606-1': { hv: 3, her: 1 } } });
await p.click('.tema[data-id="601"] [data-s]'); await shot('15-strazce-uvod'); await p.click('.okno-akce .hl'); t = await U(); await odpovez(t); await shot('16-strazce');
await p.click('#u-dal'); t = await U(); await odpovez(t, false); ok((await p.$$('#h-ziv i.on')).length === 2, 'chyba v souboji má ubrat život');
const n = await serie('strážce'); ok(await p.$('.vysl'), 'souboj neskončil výsledkem'); await shot('17-strazce-vysl'); await domu();
ok(await p.$('.tema[data-id="601"] .strazce-b.porazen'), 'strážce není označený jako poražený');
// prohra se strážcem
await p.click('.tema[data-id="601"] [data-s]'); await p.click('.okno-akce .hl');
for (let k = 0; k < 14 && !(await p.$('.vysl')); k++) { t = await U(); if (!t) break; if (t.hotovo) { if (await p.$('#u-dal')) await p.click('#u-dal'); else await p.waitForTimeout(300); continue; } await odpovez(t, false).catch(() => {}); await p.waitForTimeout(80); }
await p.waitForSelector('.vysl', { timeout: 5000 }); ok((await p.textContent('.vysl h1')).includes('vyhrál'), 'po ztrátě životů má vyhrát strážce'); await domu();

// denní výzva
await p.click('.nav [data-z="vyzva"]'); await shot('18-vyzva'); await p.click('#b-den'); await serie('výzva'); ok((await p.textContent('.vysl h1')).includes('výzva'), 'výzva neskončila'); await domu();
ok((await p.textContent('.den-rada')).trim().startsWith('1'), 'řada dní má být 1');

// obrana města
await p.click('.nav [data-z="obrana"]'); await shot('19-obrana-uvod'); await p.click('#b-obr'); await p.waitForTimeout(2500); await shot('20-obrana');
for (let k = 0; k < 40 && !(await p.$('.vysl')); k++) {
  const spr = await p.evaluate(() => { const v = [...document.querySelectorAll('#o-volby .volba')]; return v.length ? 1 : 0; });
  if (!spr) { await p.waitForTimeout(200); continue; }
  // odpověď zjistíme z textu řešení není k dispozici → zkoušíme možnosti, dokud meteor nezmizí
  const tl = await p.$$('#o-volby .volba:not([disabled])'); if (tl.length) await tl[0].click().catch(() => {}); await p.waitForTimeout(250);
}
await p.waitForSelector('.vysl', { timeout: 120000 }); await shot('21-obrana-vysl'); await domu();

// město a odznaky
await stavNa({ krystaly: 900 }); await p.click('.nav [data-z="mesto"]'); await p.click('.obchod button[data-id="pyramida"]'); await p.waitForTimeout(700); await shot('22-mesto', true);
ok(await p.evaluate(() => window.__fg.stav.mesto.includes('pyramida') && window.__fg.stav.krystaly === 740), 'koupě stavby se nezapsala');
await p.click('.nav [data-z="odznaky"]'); await shot('23-odznaky', true);

// motivy
await p.click('#b-nast'); await p.click('#n-motiv [data-m="dark"]'); await shot('24-nastaveni'); await p.click('.okno-akce .hl'); await p.click('.nav [data-z="vyprava"]'); await shot('25-tmavy');
await start('603', 2); t = await doDruhu(u => u.kind === 'num' && u.fig); await shot('26-tmavy-uloha'); await pryc();
await p.click('#b-nast'); await p.click('#n-motiv [data-m="girl"]'); await p.click('.okno-akce .hl'); await shot('27-ruzovy');
await start('604', 2); t = await doDruhu(u => u.kind === 'kon'); await odpovez(t); await shot('28-ruzovy-kon'); await pryc();
await p.click('#b-nast'); await p.click('#n-motiv [data-m="light"]'); await p.click('.okno-akce .hl');
// široká obrazovka
await p.setViewportSize({ width: 1100, height: 800 }); await p.waitForTimeout(150); await shot('29-pocitac');
// ukázková verze
await p.setViewportSize({ width: 420, height: 860 }); await p.goto(URL + 'index-demo.html'); await p.waitForTimeout(300); if (await p.$('.okno-pozadi')) await p.click('.okno-akce .hl'); await shot('30-ukazka');
await p.click('.tema[data-id="602"] [data-l="1"]'); ok(await p.$('.okno-pozadi'), 'ukázka má zamčené téma jen vysvětlit'); await p.click('.okno-akce .hl');
await p.click('.tema[data-id="601"] [data-l="1"]'); await vyklad(); ok(await U(), 'ukázka: první téma na úrovni 1 má jít hrát');

console.log(chyby.length ? 'CHYBY:\n' + chyby.join('\n') : 'Bez chyb.');
await b.close(); process.exit(chyby.length ? 1 : 0);
