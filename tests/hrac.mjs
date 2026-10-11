// Automatický hráč pro testy v prohlížeči: umí správně vyřešit každý druh úlohy přes skutečné rozhraní.
import { createRequire } from 'module';
const require = createRequire(process.env.PW || '/opt/npm-tools/node_modules/');
const { chromium } = require('playwright');
export const URL = process.env.URL || 'http://127.0.0.1:8765/';

export async function otevri(o = {}) {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
  const p = await b.newPage({ viewport: { width: o.w || 420, height: o.h || 860 } });
  await p.route('**/fdc-plugin/fdc-guard.js', r => r.fulfill({ contentType: 'text/javascript', body: '' })); // jako s platným přístupem z fajndoucko.cz
  const chyby = []; p.on('console', m => { if (m.type() === 'error') chyby.push(m.text()); }); p.on('pageerror', e => chyby.push('PAGEERROR ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 4).join('\n')));
  const ok = (c, m) => { if (!c) { chyby.push('SELHALO: ' + m); console.log('  ✗ ' + m); } };
  const shot = async (n, plna) => { if (o.shots) await p.screenshot({ path: `${o.shots}/${n}.png`, fullPage: !!plna }); };
  const U = () => p.evaluate(() => { const t = window.__fgUloha && window.__fgUloha(); return t ? { u: JSON.parse(JSON.stringify(t.u)), lvl: t.lvl, hotovo: t.hotovo, strict: t.strict } : null; });
async function konstrukce(u) {
  const zap = s => p.evaluate(async s => (await import('/js/kon.js')).kZapis(s), s);
  if (u.mode === 1) {
    for (let i = 0; i < u.plan.length; i++) {
      if (await p.$('#k-dal')) { await p.click('#k-dal'); continue; }
      const spr = await p.evaluate(async ({ u, i }) => (await import('/js/kon.js')).kOtazka(u, i).ok, { u, i });
      await p.locator('.kon-panel .volba').filter({ hasText: new RegExp('^' + spr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$') }).first().click();
    }
    return;
  }
  if (u.mode === 2) { for (const s of u.plan) { const z = await zap(s); await p.locator('.krok:not([disabled])').filter({ hasText: z }).first().click(); } return; }
  if (u.tpl) { for (const k of u.giv) await p.dispatchEvent(`.nk-el[data-el="${k}"]`, 'click'); await p.click('#k-ok'); } // úhlopříčky se kříží, proto ne klik doprostřed
  const jm = {}; // jméno v plánu → jméno, které dala aplikace
  const ref = r => jm[r] || r;
  const vyber = async (id, hodnoty) => { const moz = await p.$$eval(`#f-${id} option`, o => o.map(x => x.value)); const h = hodnoty.find(x => moz.includes(x)); if (h === undefined) throw new Error(`pole ${id}: ${hodnoty} není v ${moz}`); await p.selectOption(`#f-${id}`, h); };
  const par = r => [ref(r), r, r.split('').reverse().join('')];
  for (const s of u.plan) {
    await p.click(`.kon-ops [data-op="${s.op}"]`);
    if (s.op === 'seg') { if (s.len != null) await vyber('len', ['n:' + s.len]); else { await vyber('a', [s.a]); await vyber('b', [s.b]); } }
    else if (s.op === 'line' || s.op === 'axis') { await vyber('a', [s.a]); await vyber('b', [s.b]); }
    else if (s.op === 'circ') { await vyber('c', [s.c]); await vyber('r', typeof s.r === 'number' ? ['n:' + s.r] : ['p:' + s.r.pp.join(''), 'p:' + [...s.r.pp].reverse().join('')]); }
    else if (s.op === 'ray') { await vyber('v', [s.v]); await vyber('to', [s.to]); await vyber('ang', [String(s.ang)]); }
    else if (s.op === 'perp' || s.op === 'paral') { await vyber('to', par(s.to)); await vyber('thru', [s.thru]); }
    else if (s.op === 'par') { await vyber('to', par(s.to)); await vyber('dist', ['n:' + s.dist]); }
    else if (s.op === 'mid') { await vyber('a', [s.a]); await vyber('b', [s.b]); await vyber('name', [s.name]); }
    else if (s.op === 'bis') { await vyber('v', [s.v]); await vyber('a', [s.a]); await vyber('b', [s.b]); }
    else if (s.op === 'int') { await vyber('o1', par(s.of[0])); await p.dispatchEvent('#f-o1', 'change'); await vyber('o2', par(s.of[1])); await vyber('name', [s.name]); if (s.pick) await vyber('pick', ['1']); }
    const pred = await p.$$eval('#k-zapis li', l => l.length);
    await p.click('#k-pridat');
    const po = await p.$$eval('#k-zapis li .zap', l => l.map(x => x.textContent));
    if (po.length !== pred + 1) throw new Error(`krok ${JSON.stringify(s)} se nepřidal: ${await p.textContent('#u-zv')}`);
    if (s.name) jm[s.name] = po[po.length - 1].split(';')[0].replace('↦', '').trim();
  }
  if (u.nsol != null) await p.locator('.kon-panel .volba').nth(u.nsol).click();
}
  async function odpovez(t, spravne = true) {
  const u = t.u;
  if (u.kind === 'num') {
    if (t.strict && u.units) await p.click(`.jednotky .chip[data-j="${u.unit}"]`);
    await p.fill('#u-in', String(spravne ? u.ans : u.ans + 7).replace('.', ',')); await p.click('#u-ok');
  } else if (u.kind === 'dm') { const v = spravne ? u.ans : u.ans + 61; await p.fill('#u-in', String(Math.floor(v / 60))); await p.fill('#u-in2', String(v % 60)); await p.click('#u-ok'); }
  else if (u.kind === 'choice') { if (spravne) await p.click(`#u-odp .volba[data-i="${u.ans}"]`); else await p.locator(`#u-odp .volba:not([disabled]):not([data-i="${u.ans}"])`).first().click(); } // špatně: pokaždé jiná dosud nezkoušená možnost
  else if (u.kind === 'grid') { for (const q of (spravne ? u.ans : u.body)) await p.click(`.fg-uzel[data-x="${q[0]}"][data-y="${q[1]}"]`, { force: true }); await p.click('#u-ok'); }
  else if (u.kind === 'kon') await konstrukce(u);
}
  async function serie(popis, o = {}) {
  let n = 0;
  for (;;) {
    if (await p.$('.vysl')) break;
    const t = await U(); if (!t) break;
    if (!t.hotovo) { try { await odpovez(t); } catch (e) { chyby.push(`${popis} úloha ${n + 1} (${t.u.kind}): ${e.message.split('\n')[0]}\n   ${String(t.u.text).replace(/<[^>]+>/g, '').slice(0, 90)}`); break; } }
    const t2 = await U(); ok(t2 && t2.hotovo, `${popis}: úloha ${n + 1} (${t.u.kind}) není po správné odpovědi hotová: ${(await p.textContent('#u-zv').catch(() => '')) || ''}`);
    if (!t2 || !t2.hotovo) break;
    if (o.snimek && n === o.snimek[0]) await shot(o.snimek[1]);
    n++; await p.click('#u-dal');
  }
  return n;
}
  const domu = async () => { const z = p.locator('.vysl-akce button', { hasText: /Zpět/ }); if (await z.count()) await z.first().click(); };
  const vyklad = async () => { while (await p.$('.okno-pozadi')) { await p.click('.okno-akce .hl'); await p.waitForTimeout(30); } };

  return { b, p, chyby, ok, shot, U, konstrukce, odpovez, serie, domu, vyklad };
}
