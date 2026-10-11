// Přehled pro rodiče: záznam výsledků po úlohách a sériích, okno chráněné heslem.
// Heslo: solený SHA-256 v uloženém stavu (jen v tomto zařízení). Vymazat postup jde jen odtud.
import { ROCNIKY, najdiTema, NAZVY_UROVNI } from './obsah.js';
import { stav, uloz, smaz, hvezdy, dnes } from './stav.js';
import { $, $$, modal, zavriModal, hv } from './ui.js';

const DNU = 60, HIST = 20, CHYBNE = 12, MAX_MS = 3 * 60e3; // déle než 3 minuty nad jednou úlohou už je pauza
const st = () => {
  const s = stav.stat;
  s.dny = s.dny || {}; s.temata = s.temata || {}; s.pasti = s.pasti || {}; s.chybne = s.chybne || []; s.hist = s.hist || [];
  return s;
};
const bezHtml = t => String(t || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// ---------- záznam ----------
// vysl: 0 napoprvé (bez chyby a bez nápovědy), 1 s pomocí (po chybě nebo s nápovědou), 2 neúspěšně (ukázané řešení)
export function zapisUlohu({ tema, lvl, vysl, ms, chyby = [], text = '', odp = '' }) {
  const s = st(), d = dnes();
  const den = s.dny[d] = s.dny[d] || { f: 0, h: 0, x: 0, ms: 0 };
  den[['f', 'h', 'x'][vysl]]++; den.ms += Math.min(Math.max(ms || 0, 0), MAX_MS);
  for (const k of Object.keys(s.dny).sort().slice(0, -DNU)) delete s.dny[k];
  if (tema) {
    const t = s.temata[tema] = Array.isArray(s.temata[tema]) ? s.temata[tema] : [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    const r = t[lvl - 1]; r[0]++; if (vysl < 2) r[1]++; if (vysl === 0) r[2]++;
    for (const m of new Set(chyby.map(bezHtml).filter(Boolean))) { const k = `${tema}|${m}`; s.pasti[k] = (s.pasti[k] || 0) + 1; }
    if (vysl === 2) { s.chybne.unshift({ tema, lvl, text: bezHtml(text).slice(0, 160), odp, d }); s.chybne.length = Math.min(s.chybne.length, CHYBNE); }
  }
}
// typ: 'uroven' | 'strazce' | 'denni' | 'obrana'
export function zapisSerii({ typ, tema, lvl, hv: h, acc, n }) {
  const s = st(); s.hist.unshift({ d: Date.now(), typ, tema, lvl, hv: h, acc, n }); s.hist.length = Math.min(s.hist.length, HIST);
}

// ---------- heslo ----------
async function otisk(text) {
  try { if (crypto.subtle) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); } } catch (e) { /* níž záloha */ }
  let h = 2166136261; for (const c of text) h = Math.imul(h ^ c.codePointAt(0), 16777619) >>> 0; return 'f' + h.toString(16); // záloha bez crypto.subtle (stránka z file://)
}
function sul() { try { const a = new Uint32Array(4); crypto.getRandomValues(a); return [...a].map(n => n.toString(16)).join(''); } catch (e) { return Math.random().toString(16).slice(2) + Date.now().toString(16); } }

let odemceno = false, poZavreni = null;
export function rodice(pak) { poZavreni = pak || null; if (odemceno) prehled(); else brana(); }
function okno(nadpis, html, poOtevreni) { modal({ nadpis, siroke: 1, html: `<div class="rod">${html}</div>`, poZavreni, poOtevreni }); }

function brana(rezim) {
  const prvni = !stav.rodic || !stav.rodic.hash;
  if (rezim === 'zapomnel') {
    const a = 12 + Math.floor(Math.random() * 8), b = 13 + Math.floor(Math.random() * 7);
    return okno('Zapomenuté heslo', `<p>Pro ověření, že jste dospělý, vypočítejte: <b>${a} · ${b}</b> = ?</p>
      <input id="r-dosp" class="rod-in" inputmode="numeric" autocomplete="off" placeholder="výsledek"><p class="rod-err" id="r-err"></p>
      <div class="rod-akce"><button class="btn" id="r-zpet">Zpět</button><button class="btn hl" id="r-ok">Nastavit nové heslo</button></div>
      <p class="pozn">Nové heslo nesmaže výsledky ani postup ve hře.</p>`, el => {
      $('#r-zpet', el).onclick = () => brana();
      $('#r-ok', el).onclick = () => { if (+$('#r-dosp', el).value.trim() !== a * b) { $('#r-err', el).textContent = 'To není správně.'; return; } stav.rodic = { salt: '', hash: '' }; uloz(); brana(); };
      $('#r-dosp', el).focus();
    });
  }
  okno('Pro rodiče', prvni
    ? `<p>Přehled je chráněný heslem, aby do něj dítě nechodilo. Stačí jednoduché heslo alespoň o 4 znacích.</p>
      <label class="rod-l" for="r-h1">Nastavit rodičovské heslo</label><input id="r-h1" class="rod-in" type="password" autocomplete="new-password" placeholder="alespoň 4 znaky">
      <input id="r-h2" class="rod-in" type="password" autocomplete="new-password" placeholder="heslo znovu" aria-label="Heslo znovu"><p class="rod-err" id="r-err"></p>
      <div class="rod-akce"><button class="btn hl" id="r-ok">Nastavit a otevřít</button></div>
      <p class="pozn">Heslo i výsledky zůstávají jen v tomto zařízení.</p>`
    : `<label class="rod-l" for="r-h1">Rodičovské heslo</label><input id="r-h1" class="rod-in" type="password" autocomplete="current-password"><p class="rod-err" id="r-err"></p>
      <div class="rod-akce"><button class="btn hl" id="r-ok">Otevřít přehled</button></div>
      <button class="odkaz" id="r-zap">Zapomněl(a) jsem heslo</button>`, el => {
    const chyba = t => { $('#r-err', el).textContent = t; };
    const ok = async () => {
      const h1 = $('#r-h1', el).value;
      if (prvni) {
        if (h1.length < 4) return chyba('Heslo musí mít alespoň 4 znaky.');
        if (h1 !== $('#r-h2', el).value) return chyba('Hesla se neshodují.');
        const salt = sul(); stav.rodic = { salt, hash: await otisk(salt + '|' + h1) }; uloz();
      } else if (await otisk(stav.rodic.salt + '|' + h1) !== stav.rodic.hash) return chyba('Heslo nesouhlasí.');
      odemceno = true; prehled();
    };
    $('#r-ok', el).onclick = ok;
    $$('.rod-in', el).forEach(i => i.onkeydown = e => { if (e.key === 'Enter') ok(); });
    if (!prvni) $('#r-zap', el).onclick = () => brana('zapomnel');
    $('#r-h1', el).focus();
  });
}

// ---------- přehled ----------
const sklon = (n, a, b, c) => n === 1 ? a : n >= 2 && n <= 4 ? b : c;
const proc = (a, b) => b ? Math.round(100 * a / b) + ' %' : '–';
function zvladnuti(tot, first) {
  if (tot < 3) return { k: 'na', t: 'málo dat' };
  const r = first / tot;
  return r >= 0.85 ? { k: 'ok', t: 'zvládá' } : r >= 0.6 ? { k: 'mid', t: 'procvičuje' } : { k: 'low', t: 'potřebuje pomoc' };
}
function radek(popis, [tot, ok, first], pod) {
  const m = zvladnuti(tot, first), seg = (n, c) => n ? `<i class="${c}" style="flex:${n}"></i>` : '';
  return `<div class="rod-row"><span class="rod-pl">${popis}${pod ? `<small>${pod}</small>` : ''}</span>
    <span class="rod-bar">${seg(first, 's1')}${seg(ok - first, 's2')}${seg(tot - ok, 's3')}</span>
    <span class="rod-pn">${proc(first, tot)}<small>${tot}×</small></span><span class="rod-m ${m.k}">${m.t}</span></div>`;
}
function doporuceni(s) {
  const kand = [];
  for (const [id, urovne] of Object.entries(s.temata)) {
    const t = najdiTema(id); if (!t || !Array.isArray(urovne)) continue;
    urovne.forEach(([tot, , first], i) => { if (tot >= 3 && first / tot < 0.85) kand.push({ t, lvl: i + 1, r: first / tot }); });
  }
  kand.sort((a, b) => a.r - b.r);
  if (kand.length) {
    const k = kand[0], niz = k.r < 0.6 && k.lvl > 1;
    return `Doporučujeme zahrát <b>${k.t.nazev} – ${NAZVY_UROVNI[(niz ? k.lvl - 1 : k.lvl) - 1]}</b> (${niz ? `${NAZVY_UROVNI[k.lvl - 1]}: ` : ''}${Math.round(k.r * 100)} % napoprvé)${niz ? ' a pak se vrátit o úroveň výš' : ''}.${kand[1] ? ` Potom: ${kand.slice(1, 3).map(x => `${x.t.nazev} – ${NAZVY_UROVNI[x.lvl - 1]}`).join(', ')}.` : ''}`;
  }
  const R = ROCNIKY.find(r => r.rocnik === stav.rocnik) || ROCNIKY[0];
  if (!Object.keys(s.temata).length) return `Zatím je málo dat. Doporučujeme začít tématem <b>${R.temata[0].nazev} – Základy</b> (${R.rocnik}. ročník).`;
  for (const t of R.temata) for (const l of [1, 2, 3]) if (hvezdy(t.id, l) < 3) return `Procvičovaná témata jdou dobře. Další krok: <b>${t.nazev} – ${NAZVY_UROVNI[l - 1]}</b>.`;
  return `Všechna témata ${R.rocnik}. ročníku jsou na tři hvězdy. Zkuste strážce témat nebo vyšší ročník.`;
}

function prehled() {
  const s = st(), dny = Object.values(s.dny);
  const T = dny.reduce((a, d) => ({ f: a.f + d.f, h: a.h + d.h, x: a.x + d.x, ms: a.ms + d.ms }), { f: 0, h: 0, x: 0, ms: 0 }), tot = T.f + T.h + T.x, min = Math.round(T.ms / 60e3);
  const posl = []; for (let i = 13; i >= 0; i--) { const d = new Date(Date.now() - i * 864e5), k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; posl.push({ d, v: s.dny[k] || { f: 0, h: 0, x: 0, ms: 0 } }); }
  const maxN = Math.max(1, ...posl.map(x => x.v.f + x.v.h + x.v.x));
  const sloupce = posl.map(({ d, v }) => { const n = v.f + v.h + v.x, seg = (m, c) => m ? `<i class="${c}" style="height:${100 * m / maxN}%"></i>` : '';
    return `<div class="rod-den" title="${d.getDate()}. ${d.getMonth() + 1}.: ${n} úloh, ${v.f} napoprvé, ${v.h} s pomocí, ${v.x} neúspěšně, ${Math.round(v.ms / 60e3)} min"><span class="rod-dv">${n || ''}</span><div class="rod-sl">${seg(v.x, 's3')}${seg(v.h, 's2')}${seg(v.f, 's1')}</div><span class="rod-dd">${d.getDate()}.</span></div>`; }).join('');
  const temata = ROCNIKY.map(R => {
    const r = R.temata.filter(t => Array.isArray(s.temata[t.id]) && s.temata[t.id].some(x => x[0]));
    return r.length ? `<div class="rod-sk"><h4>${R.rocnik}. ročník</h4>${r.map(t => s.temata[t.id].map((x, i) => x[0] ? radek(t.nazev, x, `${NAZVY_UROVNI[i]} · ${hv(hvezdy(t.id, i + 1))}`) : '').join('')).join('')}</div>` : '';
  }).join('');
  const pasti = Object.entries(s.pasti).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, n]) => {
    const [id, ...m] = k.split('|'), t = najdiTema(id);
    return `<li><b>${t ? t.nazev : id}</b> <small>${n}×</small><br>${esc(m.join('|'))}</li>`; }).join('');
  const chybne = s.chybne.map(c => { const t = najdiTema(c.tema); return `<li><small>${t ? t.nazev : c.tema} · ${NAZVY_UROVNI[c.lvl - 1]}</small><br>${esc(c.text)}${c.odp ? ` <b>→ ${esc(c.odp)}</b>` : ''}</li>`; }).join('');
  const TYP = { uroven: 'série', strazce: 'strážce', denni: 'denní výzva', obrana: 'obrana města' };
  const hist = s.hist.slice(0, 10).map(h => { const d = new Date(h.d), t = h.tema && najdiTema(h.tema);
    return `<tr><td>${d.getDate()}. ${d.getMonth() + 1}.</td><td>${t ? t.nazev : TYP[h.typ]}${t && h.typ !== 'uroven' ? ` <small>(${TYP[h.typ]})</small>` : ''}</td><td>${h.lvl ? NAZVY_UROVNI[h.lvl - 1] : ''}</td><td>${h.hv != null ? hv(h.hv) : ''}</td><td>${h.acc != null ? h.acc + ' %' : ''}</td></tr>`; }).join('');

  okno('Přehled pro rodiče', `
    <div class="rod-dlazdice">
      <div><b>${tot}</b><span>${sklon(tot, 'úloha', 'úlohy', 'úloh')} celkem</span></div><div><b>${proc(T.f, tot)}</b><span>napoprvé</span></div>
      <div><b>${proc(T.h, tot)}</b><span>s pomocí</span></div><div><b>${proc(T.x, tot)}</b><span>neúspěšně</span></div>
      <div><b>${min}</b><span>${sklon(min, 'minuta', 'minuty', 'minut')} řešení</span></div><div><b>${stav.stat.serii || 0}</b><span>${sklon(stav.stat.serii || 0, 'dokončená série', 'dokončené série', 'dokončených sérií')}</span></div></div>
    <p class="rod-dop">${doporuceni(s)}</p>
    <p class="rod-leg"><span><i class="s1"></i>napoprvé</span><span><i class="s2"></i>s pomocí (po chybě nebo s nápovědou)</span><span><i class="s3"></i>neúspěšně (ukázali jsme řešení)</span></p>
    <h3>Aktivita za posledních 14 dní</h3><div class="rod-graf">${sloupce}</div>
    <h3>Zvládnutí témat</h3>${temata || '<p class="pozn">Zatím nejsou uložené žádné výsledky.</p>'}
    ${pasti ? `<h3>Typické chyby</h3><p class="pozn">Tyhle rady dítě dostalo po chybné odpovědi. Když se některá opakuje, stojí za to ji spolu probrat.</p><ul class="rod-sez">${pasti}</ul>` : ''}
    ${chybne ? `<h3>Úlohy, na které dítě nestačilo</h3><ul class="rod-sez">${chybne}</ul>` : ''}
    ${hist ? `<h3>Poslední výsledky</h3><table class="rod-tab"><tbody>${hist}</tbody></table>` : ''}
    <h3>Jak FajnGeometrie učí</h3>
    <p>Každé téma má tři úrovně. <b>Základy</b> začínají výkladem a mají obrázek a tři stupně nápovědy (o co jde, jak na to, dosazení). <b>Procvičování</b> přidává obrácené úlohy a převody. <b>Jedničkář</b> chce přesnou odpověď: dítě samo volí jednotku, zaokrouhluje přesně a nápověda stojí body. V konstrukčních úlohách dítě kreslí náčrtek, zapisuje postup a určuje počet řešení. Uzná se každý správný postup.</p>
    <p>Po první chybě dítě zkouší znovu, po druhé se samo ukáže nápověda, po třetí řešení s postupem. Na typickou chybu (třeba zapomenuté dělení dvěma u trojúhelníku) hra odpoví cílenou radou. Hvězdy za sérii: ★ od 60 %, ★★ od 80 %, ★★★ od 95 % bez ukázaného řešení.</p>
    <div class="rod-akce rod-tisk"><button class="btn mini" id="r-tisk">Tisk</button><button class="btn mini" id="r-heslo">Změnit heslo</button><button class="btn mini" id="r-smaz">Vymazat výsledky a postup</button></div>`, el => {
    $('#r-tisk', el).onclick = () => window.print();
    $('#r-heslo', el).onclick = () => { stav.rodic = { salt: '', hash: '' }; odemceno = false; uloz(); brana(); };
    $('#r-smaz', el).onclick = () => modal({ nadpis: 'Vymazat výsledky a postup?', html: '<p>Smažou se hvězdy, body, krystaly, město, odznaky i statistiky v tomto přehledu. Nejde to vrátit. Rodičovské heslo zůstane.</p>',
      tlacitka: [{ t: 'Nechat', hl: 1, fn: prehled }, { t: 'Vymazat', fn: () => { smaz(); prehled(); } }], poZavreni });
  });
}
