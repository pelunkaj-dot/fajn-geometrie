// Průchod všemi úrovněmi ve skutečném prohlížeči (Playwright). Spuštění:
//   python3 -m http.server 8765 --bind 127.0.0.1 &   a pak   node tests/prohlizec.mjs [ročník]
import { otevri, URL } from './hrac.mjs';
const JEN = process.argv[2] ? Number(process.argv[2]) : null;
const { b, p, chyby, ok, serie, domu, vyklad } = await otevri();
await p.goto(URL + 'index.html'); await p.waitForTimeout(400);
await p.click('.okno-akce .hl');
const R = await p.evaluate(() => window.__fg.ROCNIKY.map(r => ({ rocnik: r.rocnik, temata: r.temata.map(t => ({ id: t.id, nazev: t.nazev })) })));
for (const r of R) {
  if (JEN && r.rocnik !== JEN) continue;
  await p.click(`.rocniky [data-r="${r.rocnik}"]`);
  for (const t of r.temata) for (const l of [1, 2, 3]) {
    await p.click(`.tema[data-id="${t.id}"] [data-l="${l}"]`); await vyklad();
    const n = await serie(`${t.id}/${l}`);
    const hv = await p.$$eval('.vysl-hv .hv i.on', x => x.length).catch(() => -1);
    ok(hv === 3, `${t.id}/${l}: po bezchybné sérii ${n} úloh je ${hv} hvězd`);
    console.log(`  ${t.id} ${t.nazev} · úroveň ${l}: ${n} úloh, ${hv}★`);
    if (hv === 3) await domu(); else { await p.goto(URL + 'index.html'); await p.waitForTimeout(300); await p.click(`.rocniky [data-r="${r.rocnik}"]`); }
  }
}
console.log(chyby.length ? 'CHYBY:\n' + chyby.join('\n') : 'Bez chyb.');
await b.close(); process.exit(chyby.length ? 1 : 0);
