// Série úloh: zobrazení úlohy, odpověď, postup při chybě, nápovědy, body.
// Postup při chybě: 1. chyba → znovu (nápověda na tlačítku), 2. chyba → nápověda sama, 3. chyba → řešení.
import { check, odpoved } from './ulohy.js';
import { parseNum, unitChoices, cz } from './util.js';
import { gridSvg } from './fig.js';
import { konUloha } from './konui.js';
import { zvuk } from './zvuky.js';
import { rekni } from './hlasky.js';
import { avatar } from './postavy.js';
import { $, $$, modal, jeModal, zvukBtn, napojZvuk } from './ui.js';

export const BODY = [10, 15, 25];
const NAZEV_KROKU = ['O co jde', 'Jak na to', 'Dosazení'];

// Strážce tématu: příšerka z geometrických tvarů (podle čísla tématu pokaždé jiná)
export function strazceSvg(seed) {
  const n = 3 + seed % 5, r = 34, c = [50, 52], b = [];
  for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + 2 * Math.PI * i / n + (n % 2 ? 0 : Math.PI / n); b.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]); }
  const rohy = seed % 2 ? '<polygon points="30,26 24,6 40,20" class="sz-r"/><polygon points="70,26 76,6 60,20" class="sz-r"/>' : '<polygon points="50,20 44,2 56,2" class="sz-r"/>';
  return `<svg viewBox="0 0 100 100" class="strazce" aria-hidden="true">${rohy}<polygon points="${b.map(p => p.map(x => x.toFixed(1)).join(',')).join(' ')}" class="sz-t"/>
    <circle cx="39" cy="46" r="7" class="sz-o"/><circle cx="61" cy="46" r="7" class="sz-o"/><circle cx="40" cy="47" r="3" class="sz-z"/><circle cx="60" cy="47" r="3" class="sz-z"/>
    <polyline points="38,66 44,61 50,66 56,61 62,66" class="sz-p"/></svg>`;
}

// cfg: { typ: 'uroven'|'strazce'|'denni', nazev, ulohy: [{u, lvl, tema}], kdo, zivoty, strazce: {jmeno, seed}, vyklad(), onKonec(res), onZpet(), zaznam(úloha) }
export function serie(root, cfg) {
  const N = cfg.ulohy.length, res = { body: [], xp: 0, odhaleno: 0, comboMax: 0, kon3: 0, vyhra: true, n: N, vyreseno: 0, napoprve: 0 };
  let i = 0, combo = 0, zivoty = cfg.zivoty || 0, t = null, konec = false, aktivita = false;
  const strazce = cfg.typ === 'strazce';

  root.innerHTML = `<div class="hra hra-${cfg.typ}">
    <header class="hra-lista">
      <button class="ik" id="h-zpet" aria-label="Ukončit sérii">✕</button>
      <div class="postup" role="progressbar" aria-valuemin="0" aria-valuemax="${N}"><i id="h-postup"></i></div>
      <span class="hra-poc" id="h-poc"></span>
      <span class="combo" id="h-combo" hidden></span>
      ${strazce ? '<span class="zivoty" id="h-ziv"></span>' : ''}
      ${zvukBtn()}
      ${cfg.vyklad ? '<button class="ik" id="h-vyklad" aria-label="Výklad k tématu">?</button>' : ''}
    </header>
    ${strazce ? `<div class="sz-panel"><div class="sz-obr" id="h-sz">${strazceSvg(cfg.strazce.seed)}</div><div class="sz-info"><b>${cfg.strazce.jmeno}</b><div class="sz-hp"><i id="h-hp"></i></div><small id="h-hpt"></small></div></div>` : ''}
    <main class="hra-telo" id="h-telo"></main></div>`;
  const telo = $('#h-telo', root);
  // Odchod ze série: dokud hráč nic neudělal, odejde hned; jinak se zeptáme (křížek, Esc i Zpět).
  function chceOdejit() {
    if (konec) return;
    if (!aktivita && i === 0) { uklid(); return cfg.onZpet(); }
    modal({ nadpis: 'Ukončit sérii?', html: '<p>Rozdělaná série se nezapočítá.</p>', tlacitka: [{ t: 'Pokračovat v sérii', hl: 1 }, { t: 'Ukončit', fn: () => { uklid(); cfg.onZpet(); } }] });
  }
  $('#h-zpet', root).onclick = chceOdejit; napojZvuk(root);
  if (cfg.vyklad) $('#h-vyklad', root).onclick = cfg.vyklad;

  function lista() {
    $('#h-postup', root).style.width = `${100 * i / N}%`;
    $('#h-poc', root).textContent = `${Math.min(i + 1, N)}/${N}`;
    const c = $('#h-combo', root); c.hidden = combo < 2; c.textContent = `${combo}× v řadě`;
    if (strazce) {
      $('#h-ziv', root).innerHTML = '<i class="on">♥</i>'.repeat(zivoty) + '<i>♥</i>'.repeat(cfg.zivoty - zivoty);
      $('#h-hp', root).style.width = `${100 * (N - res.vyreseno) / N}%`; $('#h-hpt', root).textContent = `zbývá ${N - res.vyreseno} z ${N}`;
    }
  }
  const bublina = (typ, text, hlaska) => {
    const el = $('#u-zv', telo); if (!el) return;
    el.className = 'ul-zv ' + typ;
    el.innerHTML = `${cfg.kdo !== 'Nikdo' && hlaska ? avatar(cfg.kdo, 'av-m') : ''}<div>${hlaska ? `<b>${hlaska}</b> ` : ''}${text || ''}</div>`;
  };

  function ukaz() {
    const { u, lvl } = cfg.ulohy[i];
    t = { u, lvl, pokus: 0, nap: 0, hotovo: false, strict: lvl === 3, max: u.kind === 'choice' ? Math.min(3, u.opts.length - 1) : 3, znacky: [], jedn: null, od: Date.now(), chyby: [] };
    lista();
    telo.innerHTML = `<article class="ul ul-${u.kind}">
      <div class="ul-zadani">${u.fig && u.kind !== 'kon' ? `<div class="ul-obr">${u.fig}</div>` : ''}<p class="ul-text">${u.text || ''}</p>${u.q ? `<p class="ul-q">${u.q}</p>` : ''}</div>
      <div class="ul-odp" id="u-odp"></div><div class="ul-nap" id="u-nap"></div><div class="ul-zv" id="u-zv" aria-live="polite"></div>
      <div class="ul-res" id="u-res"></div><div class="ul-akce" id="u-akce"></div></article>`;
    const odp = $('#u-odp', telo);
    if (u.kind === 'num') {
      const jedn = t.strict && u.units ? unitChoices(u.unit) : null;
      odp.innerHTML = `<div class="vstup"><input id="u-in" type="text" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Tvoje odpověď" placeholder="?">${jedn ? '' : `<span class="jedn">${u.unit}</span>`}</div>
        ${jedn ? `<div class="jednotky" role="group" aria-label="Jednotka">${jedn.map(j => `<button class="chip" data-j="${j}">${j}</button>`).join('')}</div>` : ''}
        ${u.dec != null ? `<p class="pozn">${t.strict ? 'Zaokrouhli přesně' : 'Zaokrouhli'} na ${u.dec === 0 ? 'celé číslo' : u.dec === 1 ? '1 desetinné místo' : u.dec + ' desetinná místa'}.</p>` : ''}`;
      $$('.jednotky .chip', odp).forEach(b => b.onclick = () => { t.jedn = b.dataset.j; $$('.jednotky .chip', odp).forEach(x => x.classList.toggle('on', x === b)); });
    } else if (u.kind === 'dm') {
      odp.innerHTML = `<div class="vstup"><input id="u-in" type="text" inputmode="numeric" autocomplete="off" aria-label="stupně" placeholder="?"><span class="jedn">°</span><input id="u-in2" type="text" inputmode="numeric" autocomplete="off" aria-label="minuty" placeholder="0"><span class="jedn">′</span></div>`;
    } else if (u.kind === 'choice') {
      odp.innerHTML = `<div class="volby${u.opts.length === 2 ? ' dve' : ''}">${u.opts.map((o, k) => `<button class="volba" data-i="${k}">${o}</button>`).join('')}</div>`;
      $$('.volba', odp).forEach(b => b.onclick = () => { if (t.hotovo) return; const r = check(u, { i: +b.dataset.i }); if (r.ok) { b.classList.add('dobre'); spravne(); } else { b.disabled = true; b.classList.add('spatne'); spatne(''); } });
    } else if (u.kind === 'grid') {
      const kresli = rs => {
        odp.innerHTML = `<div class="sit">${gridSvg(u, t.znacky, rs)}</div>${rs ? '' : `<p class="pozn">Označeno ${t.znacky.length} z ${u.ans.length}.</p>`}`;
        if (rs) return;
        $$('.fg-uzel', odp).forEach(c => c.onclick = () => {
          if (t.hotovo) return; const p = [+c.dataset.x, +c.dataset.y], k = t.znacky.findIndex(z => z[0] === p[0] && z[1] === p[1]);
          if (k >= 0) t.znacky.splice(k, 1); else { if (t.znacky.length >= u.ans.length) t.znacky.shift(); t.znacky.push(p); }
          zvuk.klik(); kresli();
        });
      };
      t.kresli = kresli; kresli();
    } else if (u.kind === 'kon') {
      konUloha(odp, u, {
        chyba: (text, kolikata) => { chybaKon(text, kolikata); }, info: text => bublina('info', text), ok: text => { zvuk.ok(combo); bublina('ok', text); },
        krok: () => { aktivita = true; zvuk.krok(); const z = $('#u-zv', telo); if (z.classList.contains('info')) { z.className = 'ul-zv'; z.innerHTML = ''; } }, konec: (chyb, odhaleno) => { t.pokus = chyb; if (odhaleno) odhal(true); else spravne(true); },
      });
    }
    akce();
    const inp = $('#u-in', telo); if (inp && !('ontouchstart' in window)) inp.focus();
    telo.scrollTop = 0; window.scrollTo(0, 0);
  }

  function akce() {
    const el = $('#u-akce', telo), u = t.u;
    el.classList.toggle('lepi', t.hotovo || u.kind !== 'kon');
    if (t.hotovo) {
      el.innerHTML = `<button class="btn hl" id="u-dal">${i + 1 < N ? 'Další úloha' : 'Dokončit'}</button>`;
      $('#u-dal', el).onclick = dalsi; $('#u-dal', el).focus({ preventScroll: true }); return;
    }
    const zb = strazce ? 0 : u.hints.length - t.nap;
    el.innerHTML = `${zb > 0 ? `<button class="btn" id="u-nap-b">Nápověda${t.strict ? ' (−5 bodů)' : ''}</button>` : ''}${['num', 'dm', 'grid'].includes(u.kind) ? '<button class="btn hl" id="u-ok">Zkontrolovat</button>' : ''}`;
    if (zb > 0) $('#u-nap-b', el).onclick = () => napoveda(false);
    const ok = $('#u-ok', el); if (ok) ok.onclick = odesli;
  }
  function napoveda(sama) {
    const u = t.u; if (t.nap >= u.hints.length) return;
    const k = t.nap++, nap = $('#u-nap', telo);
    nap.insertAdjacentHTML('beforeend', `<div class="napoveda"><span class="nap-n">${t.strict || u.kind === 'kon' || u.hints.length < 3 ? 'Nápověda' : NAZEV_KROKU[k] || 'Nápověda'}</span>${u.hints[k]}</div>`);
    aktivita = true;
    if (!sama) zvuk.napoveda();
    akce();
  }
  function odesli() {
    const u = t.u; if (t.hotovo) return;
    let inp;
    if (u.kind === 'num') {
      const v = parseNum($('#u-in', telo).value);
      if (Number.isNaN(v)) return bublina('info', 'Napiš jen číslo. Desetinná čárka je v pořádku, jednotku nepiš.');
      if (t.strict && u.units && !t.jedn) return bublina('info', 'Ještě vyber jednotku.');
      inp = { val: v, unit: t.strict && u.units ? t.jedn : u.unit };
    } else if (u.kind === 'dm') {
      const a = $('#u-in', telo).value.trim(), bb = $('#u-in2', telo).value.trim() || '0';
      if (!/^\d+$/.test(a) || !/^\d+$/.test(bb)) return bublina('info', 'Do prvního políčka napiš stupně, do druhého minuty. Jen celá čísla.');
      inp = { deg: +a, min: +bb };
    } else if (u.kind === 'grid') {
      if (t.znacky.length < u.ans.length) return bublina('info', `Označ všechny obrazy: ${u.ans.length === 1 ? 'jeden bod' : u.ans.length + ' body'}.`);
      inp = { pts: t.znacky };
    } else return;
    const r = check(u, inp, t.strict);
    if (r.ok) spravne(); else spatne(r.msg);
  }

  function ztratZivot() {
    if (!strazce) return false;
    zivoty = Math.max(0, zivoty - 1); lista(); const s = $('#h-sz', root); s.classList.remove('utok'); void s.offsetWidth; s.classList.add('utok');
    if (zivoty <= 0) { res.vyhra = false; konec = true; zamkni(); $$('.kon button, .kon select', telo).forEach(x => x.disabled = true); setTimeout(() => { uklid(); cfg.onKonec(res); }, 900); return true; }
    return false;
  }
  function spatne(msg) {
    if (konec) return;
    aktivita = true;
    t.pokus++; combo = 0; zvuk.chyba(); lista(); if (msg) t.chyby.push(msg);
    const inp = $('#u-in', telo); if (inp) { inp.classList.remove('trese'); void inp.offsetWidth; inp.classList.add('trese'); inp.select(); }
    if (ztratZivot()) return;
    if (t.pokus >= t.max) return odhal();
    const druha = t.pokus === 2 && !strazce && t.nap < t.u.hints.length;
    if (druha) napoveda(true);
    bublina('bad', msg, rekni(cfg.kdo, druha ? 'chyba2' : 'chyba1'));
    akce();
  }
  function chybaKon(text, kolikata) { // chyba uvnitř konstrukční úlohy (počítá si je sama)
    if (konec) return;
    aktivita = true; combo = 0; zvuk.chyba(); lista();
    if (ztratZivot()) return;
    const druha = kolikata === 2 && !strazce && t.nap < t.u.hints.length;
    if (druha) napoveda(true);
    bublina('bad', text, rekni(cfg.kdo, druha ? 'chyba2' : 'chyba1'));
  }
  function reseni() {
    const u = t.u, el = $('#u-res', telo);
    if (u.kind === 'grid') { t.kresli(u.ans); return; }
    if (u.kind === 'kon') return;
    const alt = u.kind === 'num' && u.alt.length ? `<p class="pozn">S tlačítkem π na kalkulačce vyjde ${cz(u.alt[0], u.dec ?? 3)} ${u.unit}. Uznávají se oba výsledky.</p>` : '';
    el.innerHTML = `<div class="reseni"><p class="res-odp">Správná odpověď: <b>${odpoved(u)}</b></p>${u.figSol ? `<div class="ul-obr">${u.figSol}</div>` : ''}${u.steps.length ? `<ol class="res-kroky">${u.steps.map(s => `<li>${s}</li>`).join('')}</ol>` : ''}${alt}</div>`;
  }
  function zapis(vysl) { if (cfg.zaznam) cfg.zaznam({ tema: cfg.ulohy[i].tema, lvl: t.lvl, vysl, ms: Date.now() - t.od, chyby: t.chyby, text: [t.u.text, t.u.q].filter(Boolean).join(' '), odp: odpoved(t.u) }); }
  function zamkni() { t.hotovo = true; aktivita = true; $$('#u-odp input, #u-odp .volba, #u-odp .chip', telo).forEach(x => x.disabled = true); }
  function spravne(zKon) {
    const prvni = t.pokus === 0; zamkni();
    if (prvni && t.nap === 0) combo++;
    let xp = Math.round(BODY[t.lvl - 1] * (prvni ? 1 : t.pokus === 1 ? 0.6 : 0.3) * (prvni ? 1 + Math.min(Math.max(combo - 1, 0), 10) * 0.1 : 1));
    if (t.strict) xp = Math.max(5, xp - 5 * t.nap);
    res.xp += xp; res.body.push(prvni ? 1 : 0.5); res.vyreseno++; if (prvni) res.napoprve++; res.comboMax = Math.max(res.comboMax, combo);
    if (zKon && prvni && t.u.mode === 3) res.kon3++;
    zvuk.ok(combo); reseni(); zapis(prvni && t.nap === 0 ? 0 : 1);
    bublina('ok', `+${xp} bodů${prvni && combo >= 2 ? ` · ${combo}× v řadě` : ''}`, rekni(cfg.kdo, prvni ? 'ok' : 'okPozdeji'));
    if (strazce) { const s = $('#h-sz', root); s.classList.remove('zasah'); void s.offsetWidth; s.classList.add('zasah'); }
    lista(); akce(); ukazZpravu();
  }
  function odhal(zKon) {
    zamkni(); combo = 0; res.body.push(0); res.odhaleno++; zvuk.odhaleni(); reseni(); zapis(2);
    bublina('bad', '', rekni(cfg.kdo, 'odhaleni'));
    lista(); akce(); ukazZpravu();
  }
  // po vyhodnocení posuň obrazovku ke zpětné vazbě (na telefonu bývá pod okrajem)
  function ukazZpravu() { const z = $('#u-zv', telo); if (z && z.scrollIntoView) z.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  function dalsi() {
    if (!t.hotovo || konec) return;
    i++;
    if (i >= N || (strazce && res.vyreseno + res.odhaleno >= N)) { konec = true; $('#h-postup', root).style.width = '100%'; uklid(); return cfg.onKonec(res); }
    ukaz();
  }
  function klavesa(e) {
    if (e.key !== 'Enter' || jeModal() || konec || !t) return;
    if (e.target && e.target.closest && e.target.closest('button, select')) return;
    e.preventDefault();
    if (t.hotovo) dalsi(); else odesli();
  }
  function uklid() { document.removeEventListener('keydown', klavesa); }
  document.addEventListener('keydown', klavesa);
  window.__fgUloha = () => t; // pro testy
  ukaz();
  return { uklid, zpet: chceOdejit };
}
