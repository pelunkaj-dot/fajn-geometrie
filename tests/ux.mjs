// Ovládání a navigace: z každého místa musí vést cesta pryč a nevratná akce se musí ptát.
//   node tests/ux.mjs [složka na snímky]
import { otevri, URL } from './hrac.mjs';
const SHOTS = process.argv[2] || null;
const { b, p, chyby, ok, shot, U, odpovez, vyklad } = await otevri({ shots: SHOTS, w: 360, h: 740 });
const stavNa = async s => { await p.evaluate(s => { Object.assign(window.__fg.stav, s); window.__fg.uloz(); }, s); await p.goto(URL + 'index.html'); await p.waitForTimeout(250); };
const je = sel => p.$(sel).then(x => !!x);
const vOkne = async sel => { const r = await p.locator(sel).first().boundingBox(); return r && r.y >= 0 && r.y + r.height <= 740 && r.x >= 0 && r.x + r.width <= 360; };

await p.goto(URL + 'index.html'); await p.waitForTimeout(400);
// uvítání: jediné okno bez křížku, Esc ani Zpět ho nezavřou
ok(!(await je('.okno-x')), 'uvítání nemá mít křížek'); await p.keyboard.press('Escape'); ok(await je('.okno-pozadi'), 'Esc nesmí zavřít uvítání');
await shot('ux-01-uvitani'); await p.click('.okno-akce .hl');
ok(!(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)), 'výprava na šířce 360 přetéká do strany'); await shot('ux-02-vyprava');

// výklad z výpravy: křížek na každé kartě, Esc
await p.click('.tema[data-id="601"] [data-vyklad]'); ok(await je('.okno-x'), 'výklad nemá křížek'); await shot('ux-03-vyklad');
ok(await vOkne('.okno-akce .hl'), 'tlačítko Další ve výkladu není vidět bez posouvání');
await p.click('.okno-akce .hl'); ok((await p.textContent('.okno-akce')).includes('Předchozí'), 'druhá karta výkladu má mít Předchozí');
await p.click('.okno-x'); ok(!(await je('.okno-pozadi')), 'křížek výklad nezavřel');
await p.click('.tema[data-id="601"] [data-vyklad]'); await p.keyboard.press('Escape'); ok(!(await je('.okno-pozadi')), 'Esc výklad nezavřel');

// výklad před první sérií: křížek vrací na výpravu, odkaz přeskočí na úlohy
await p.click('.tema[data-id="602"] [data-l="1"]'); ok(await je('#v-skok'), 'před první sérií chybí Přeskočit výklad'); await shot('ux-04-vyklad-pred-serii');
await p.click('.okno-x'); ok(!(await je('.hra')) && await je('.temata'), 'křížek ve výkladu má vrátit na výpravu, ne spustit sérii');
await p.click('.tema[data-id="602"] [data-l="1"]'); ok(await je('#v-skok'), 'nedočtený výklad se má nabídnout znovu'); await p.click('#v-skok'); ok(await je('.hra') && !(await je('.okno-pozadi')), 'Přeskočit výklad má spustit sérii');

// série: bez rozehrání odchod hned, po pokusu dotaz; Esc a Zpět
await p.click('#h-zpet'); ok(!(await je('.okno-pozadi')) && await je('.temata'), 'z nerozehrané série se má odejít bez dotazu');
ok(await p.evaluate(() => { const r = document.querySelector('.tema[data-id="602"]').getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; }), 'po návratu má být vidět téma, ze kterého hráč odešel');
await p.click('.tema[data-id="605"] [data-l="1"]'); await vyklad();
let t = await U(); await odpovez(t, false); await shot('ux-05-serie');
ok(!(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)), 'série na šířce 360 přetéká do strany');
await p.keyboard.press('Escape'); ok(await je('.okno-pozadi'), 'Esc v rozehrané sérii má nabídnout ukončení');
await p.keyboard.press('Escape'); ok(!(await je('.okno-pozadi')) && await je('.hra'), 'druhý Esc má dotaz zavřít a sérii nechat běžet');
await p.goBack(); ok(await je('.okno-pozadi') && await je('.hra'), 'Zpět v prohlížeči má v sérii nabídnout ukončení, ne opustit stránku');
await p.click('.okno-x'); ok(await je('.hra') && !(await je('.okno-pozadi')), 'křížek v dotazu má sérii nechat běžet');
// zvuk jde vypnout uprostřed série
const z0 = await p.evaluate(() => window.__fg.stav.zvuk); await p.click('.hra-lista [data-zvuk]'); ok(await p.evaluate(() => window.__fg.stav.zvuk) === !z0, 'vypínač zvuku v sérii nefunguje'); await p.click('.hra-lista [data-zvuk]');
// tlačítko po vyhodnocení je vidět bez posouvání
await odpovez(t, false); await odpovez(t, false); await p.waitForTimeout(500); ok(await vOkne('#u-dal'), 'Další úloha není po vyhodnocení vidět bez posouvání'); await shot('ux-06-reseni');
// propadnutá série: výsledek nabídne výklad a tlačítka jsou vidět
for (let k = 0; k < 12 && !(await je('.vysl')); k++) { t = await U(); if (!t.hotovo) for (let j = 0; j < 3; j++) await odpovez(t, false); await p.click('#u-dal'); }
ok((await p.textContent('.vysl-akce')).includes('Přečíst výklad'), 'po nezdaru má výsledek nabídnout výklad'); await shot('ux-07-nezdar');
await p.locator('.vysl-akce button', { hasText: 'Přečíst výklad' }).click(); ok(await je('.okno-pozadi'), 'výklad z výsledku se neotevřel'); await p.keyboard.press('Escape');
await p.goBack(); ok(await je('.temata'), 'Zpět na výsledku má vrátit na výpravu');

// první úspěšná série: víc odznaků najednou, tlačítka musí zůstat vidět
await p.click('.tema[data-id="606"] [data-l="1"]'); await vyklad();
for (let k = 0; k < 12 && !(await je('.vysl')); k++) { t = await U(); if (!t.hotovo) await odpovez(t); await p.click('#u-dal'); }
await p.waitForTimeout(300); ok((await p.$$('.odz-m')).length >= 3, 'čekal jsem aspoň tři nové odznaky'); ok(await vOkne('.vysl-akce .hl'), 'na výsledku s odznaky není hlavní tlačítko vidět bez posouvání'); await shot('ux-08-vysledek');
await p.locator('.vysl-akce button', { hasText: 'Zpět' }).click();

// záložky: Zpět vrací na výpravu, na výpravě jen upozorní
await p.click('.nav [data-z="mesto"]'); await p.goBack(); ok(await je('.temata'), 'Zpět ze záložky Město má vrátit na výpravu');
await p.goBack(); ok(await je('#toast.je') && await je('.temata'), 'Zpět na výpravě má jen upozornit');

// město: koupě se ptá
await stavNa({ krystaly: 300 }); await p.click('.nav [data-z="mesto"]'); await p.click('.obchod button[data-id="domek"]'); ok(await je('.okno-pozadi'), 'koupě stavby se má nejdřív zeptat'); await shot('ux-09-koupe');
await p.click('.okno-akce button:not(.hl)'); ok(await p.evaluate(() => window.__fg.stav.krystaly === 300 && !window.__fg.stav.mesto.includes('domek')), '„Zatím ne“ nesmí nic utratit');
await p.click('.obchod button[data-id="domek"]'); await p.click('.okno-akce .hl'); ok(await p.evaluate(() => window.__fg.stav.krystaly === 270 && window.__fg.stav.mesto.includes('domek')), 'potvrzená koupě se neprovedla');

// nastavení: křížek zavře a vypínač zvuku v liště odpovídá
await p.click('#b-nast'); await p.click('#n-zvuk'); await p.click('.okno-x'); ok(!(await je('.okno-pozadi')), 'křížek nastavení nezavřel');
ok((await p.getAttribute('.lista [data-zvuk]', 'aria-label')) === 'Zapnout zvuk', 'lišta po změně zvuku v nastavení neukazuje správný stav'); await p.click('.lista [data-zvuk]');

// obrana: křížek hru pozastaví a zeptá se
await p.click('.nav [data-z="obrana"]'); await p.click('#b-obr'); await p.waitForTimeout(600); await p.click('#o-zpet'); ok(await je('.okno-pozadi'), 'odchod z obrany se má zeptat');
const p1 = await p.evaluate(() => getComputedStyle(document.querySelector('#o-met')).getPropertyValue('--p')); await p.waitForTimeout(700);
const p2 = await p.evaluate(() => getComputedStyle(document.querySelector('#o-met')).getPropertyValue('--p')); ok(p1 === p2, `meteor má při dotazu stát (${p1} → ${p2})`); await shot('ux-10-obrana-pauza');
await p.keyboard.press('Escape'); await p.waitForTimeout(400); const p3 = await p.evaluate(() => getComputedStyle(document.querySelector('#o-met')).getPropertyValue('--p')); ok(p3 !== p2, 'po zavření dotazu má obrana pokračovat');
await p.goBack(); await p.locator('.okno-akce button', { hasText: 'Ukončit' }).click(); ok(await je('.obr-uvod'), 'ukončení obrany má vrátit na její úvod');

// souboj se strážcem na úzkém telefonu
await stavNa({ urovne: { '601-1': { hv: 3, her: 1 } } }); await p.click('.nav [data-z="vyprava"]'); await p.click('.tema[data-id="601"] [data-s]'); ok(await je('.okno-x'), 'výzva strážce nemá křížek'); await p.click('.okno-akce .hl');
ok(!(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)), 'souboj na šířce 360 přetéká do strany'); await shot('ux-11-strazce');

// konstrukce na úzkém telefonu: formulář kroku se vejde, prázdná kontrola nestojí pokus
await p.click('#h-zpet'); await p.click('.rocniky [data-r="7"]'); await p.click('.tema[data-id="705"] [data-l="3"]');
t = await U(); await p.click('#k-ok'); ok(await je('.ul-zv.info') && !(await je('.ul-zv.bad')), 'prázdný náčrtek má jen upozornit');
for (const k of t.u.giv) await p.dispatchEvent(`.nk-el[data-el="${k}"]`, 'click'); await p.click('#k-ok');
await p.click('#k-ok'); ok(await je('.ul-zv.info') && !(await je('.ul-zv.bad')), 'prázdný zápis postupu má jen upozornit');
// zadání zůstává na očích: řádek Dáno / Sestroj, náčrtek s hodnotami a přepínač Náčrtek / Rýsování
const hodnota = Object.values(t.u.dano)[0];
ok((await p.textContent('.kon-dano')).includes(hodnota) && (await p.textContent('.kon-dano')).includes('Sestroj'), 'řádek Dáno / Sestroj chybí nebo v něm nejsou hodnoty');
ok(await je('.kon-obr.hotovy-nacrtek') && (await p.textContent('#k-obr')).includes('= ' + hodnota), 'po potvrzení má zůstat náčrtek s vepsanými hodnotami'); await shot('ux-13-nacrtek-hodnoty');
await p.click('.kon-ops [data-op="seg"]'); await p.click('#k-pridat'); ok(!(await je('.kon-obr.hotovy-nacrtek')), 'po přidání kroku se má ukázat rýsování');
ok(await vOkne('#k-posl') && (await p.textContent('#k-posl')).includes('AB'), 'pod obrázkem má být napsáno, co se narýsovalo naposledy');
await p.click('#k-prep [data-p="nacrtek"]'); ok((await p.textContent('#k-obr')).includes('= ' + hodnota), 'přepínač zpět na náčrtek nefunguje');
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(150);
ok(await vOkne('.kon-dano') && await vOkne('#k-obr'), 'při posunutí dolů má zůstat vidět zadání i obrázek'); await shot('ux-14-zadani-pri-posunu');
await p.click('#k-prep [data-p="rys"]'); await p.click('.kon-ops [data-op="ray"]'); await p.waitForTimeout(100);
ok(!(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)), 'zápis postupu na šířce 360 přetéká do strany'); await shot('ux-12-zapis');

// úloha bez náčrtku (zadaný útvar je narýsovaný): žádný přepínač, na ploše je rovnou zadaný trojúhelník
await p.click('#h-zpet'); { const u = p.locator('.okno-akce button', { hasText: 'Ukončit' }); if (await u.count()) await u.click(); }
await p.click('.rocniky [data-r="6"]');
for (let k = 0; k < 12; k++) { await p.click('.tema[data-id="604"] [data-l="3"]'); t = await U(); if (!t.u.tpl) break; await p.click('#h-zpet'); }
ok(!t.u.tpl && !(await je('.hotovy-nacrtek')) && !(await je('#k-prep')), 'úloha se zadaným útvarem nemá mít náčrtek ani přepínač');
ok((await p.textContent('#k-obr')).includes('A') && (await p.textContent('.kon-dano')).includes('Sestroj'), 'u úlohy se zadaným útvarem chybí obrázek nebo řádek Dáno / Sestroj'); await shot('ux-15-zadany-utvar');

console.log(chyby.length ? 'CHYBY:\n' + chyby.join('\n') : 'Bez chyb.');
await b.close(); process.exit(chyby.length ? 1 : 0);
