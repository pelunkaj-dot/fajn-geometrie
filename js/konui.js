// Konstrukční úloha v prohlížeči: vedený postup (1), skládání z připravených kroků (2),
// samostatně náčrtek + zápis postupu + počet řešení (3). Rýsuje jádro v kon.js.
import { kExec, kCil, kKopie, kZapis, kSlovy, kOtazka, kNavnady, kSvg, kProved, kPocetPruseciku, NACRTKY, nacrtekSvg } from './kon.js';
import { shuffle, cz } from './util.js';
import { $, $$ } from './ui.js';

const OP = { seg: 'Úsečka', line: 'Přímka', circ: 'Kružnice', ray: 'Úhel', perp: 'Kolmice', par: 'Rovnoběžka ve vzdálenosti', paral: 'Rovnoběžka bodem', axis: 'Osa úsečky', mid: 'Střed úsečky', bis: 'Osa úhlu', int: 'Průsečík', poly: 'Výsledný útvar' };
const prvku = n => n === 1 ? '1 prvek' : n < 5 ? n + ' prvky' : n + ' prvků';

// api: chyba(text, kolikata) · info(text) · ok(text) · konec(pocetChyb, odhaleno) · krok()
export function konUloha(root, u, api) {
  let kroky = [], st = kProved(u.init), chyb = 0;
  const prepocitej = () => { st = kProved(u.init); kroky.forEach(s => kExec(st, s)); };
  root.innerHTML = `<div class="kon"><div class="kon-faze" id="k-faze"></div><div class="kon-obr" id="k-obr"></div><ol class="kon-zapis" id="k-zapis"></ol><div class="kon-panel" id="k-panel"></div></div>`;
  const obr = $('#k-obr', root), zap = $('#k-zapis', root), panel = $('#k-panel', root), fazeEl = $('#k-faze', root);
  const kresli = posl => { obr.innerHTML = kSvg(st, { posledni: posl }); };
  const zapis = slovy => {
    zap.innerHTML = kroky.map(s => `<li><span class="zap">${kZapis(s)}</span>${slovy ? `<small>${kSlovy(s)}</small>` : ''}</li>`).join('');
    zap.hidden = !kroky.length;
  };
  const faze = (kt, vse) => { fazeEl.innerHTML = vse.length > 1 ? vse.map((f, i) => `<span class="${f[0] === kt ? 'ted' : ''}">${i + 1}. ${f[1]}</span>`).join('') : ''; };
  const cil = () => kCil(st, u.goal) === null;

  // ---------- úroveň 1: vedený postup ----------
  function vedeny() {
    let i = 0; kresli(); zapis(true);
    const proved = () => { kExec(st, u.plan[i]); kroky.push(u.plan[i]); i++; api.krok(); kresli(true); zapis(true); dalsi(); };
    function dalsi() {
      if (i >= u.plan.length) { panel.innerHTML = '<p class="kon-hotovo">Hotovo. Nahoře je celý zápis postupu, jak by se psal do sešitu.</p>'; return api.konec(chyb, false); }
      const s = u.plan[i], q = kOtazka(u, i);
      if (!q) {
        panel.innerHTML = `<p class="kon-ot">Krok ${i + 1}: ${kSlovy(s)}</p><button class="btn hl" id="k-dal">Narýsovat</button>`;
        $('#k-dal', panel).onclick = proved; return;
      }
      let spatne = 0;
      panel.innerHTML = `<p class="kon-ot">Krok ${i + 1}: ${q.text}</p><div class="volby">${shuffle([q.ok, ...q.bad]).map(o => `<button class="volba">${o}</button>`).join('')}</div>`;
      $$('.volba', panel).forEach(b => b.onclick = () => {
        if (b.textContent === q.ok) return proved();
        b.disabled = true; b.classList.add('spatne'); chyb++; api.chyba('', ++spatne);
      });
    }
    dalsi();
  }

  // ---------- úroveň 2: skládání z připravených kroků ----------
  function skladani() {
    const pool = shuffle([...u.plan, ...kNavnady(u)]).map(s => ({ s, pouzit: false }));
    let pokusy = 0, poradi = [];
    kresli(); zapis();
    function vykresli() {
      panel.innerHTML = `<p class="kon-ot">Vybírej kroky v pořadí, v jakém se rýsují. Pozor, některé kroky jsou špatně a do postupu nepatří.</p>
        <div class="kon-pool">${pool.map((p, j) => `<button class="krok" data-j="${j}" ${p.pouzit ? 'disabled' : ''}><span class="zap">${kZapis(p.s)}</span></button>`).join('')}</div>
        <div class="kon-akce"><button class="btn" id="k-zpet" ${kroky.length ? '' : 'disabled'}>Vrátit krok</button><button class="btn hl" id="k-ok">Zkontrolovat</button></div>`;
      $$('.krok', panel).forEach(b => b.onclick = () => {
        const p = pool[+b.dataset.j], kopie = kKopie(st), e = kExec(kopie, p.s);
        if (e) return api.info(e);
        st = kopie; kroky.push(p.s); poradi.push(+b.dataset.j); p.pouzit = true; api.krok(); kresli(true); zapis();
        if (cil()) return uspech();
        vykresli();
      });
      $('#k-zpet', panel).onclick = () => { kroky.pop(); pool[poradi.pop()].pouzit = false; prepocitej(); kresli(); zapis(); vykresli(); };
      $('#k-ok', panel).onclick = () => { chyb++; pokusy++; if (pokusy >= 3) return odhal(); api.chyba(kCil(st, u.goal) || '', pokusy); };
    }
    vykresli();
  }
  function odhal(pak) {
    kroky = [...u.plan]; prepocitej(); kresli(); zapis(true);
    panel.innerHTML = '<p class="kon-hotovo">Tohle je jeden ze správných postupů. Projdi si ho krok za krokem.</p>';
    if (pak) pak(); else api.konec(chyb, true);
  }
  function uspech() {
    panel.innerHTML = '<p class="kon-hotovo">Konstrukce je správně.</p>';
    if (u.mode === 3 && u.nsol != null) return diskuse(false);
    api.konec(chyb, false);
  }

  // ---------- úroveň 3: náčrtek → zápis → počet řešení ----------
  const FAZE = [...(u.tpl ? [['n', 'Náčrtek']] : []), ['z', 'Zápis postupu'], ...(u.nsol != null ? [['d', 'Počet řešení']] : [])];
  function nacrtek() {
    let vyb = [], pokusy = 0; const T = NACRTKY[u.tpl];
    faze('n', FAZE); zap.hidden = true;
    const ukaz = () => {
      obr.innerHTML = nacrtekSvg(u.tpl, vyb);
      $$('.nk-el', obr).forEach(g => g.onclick = () => { const k = g.dataset.el; vyb = vyb.includes(k) ? vyb.filter(x => x !== k) : [...vyb, k]; api.krok(); ukaz(); });
      $('#k-vyb', panel).textContent = vyb.length ? 'Vyznačeno: ' + vyb.map(k => T.prvky[k]).join(', ') : 'Zatím není vyznačeno nic.';
    };
    panel.innerHTML = `<p class="kon-ot">Náčrtek: ${T.nazev} od ruky, ne v měřítku. Ťukni v něm na všechno, co znáš ze zadání.</p><p class="kon-vyb" id="k-vyb"></p><div class="kon-akce"><button class="btn hl" id="k-ok">Náčrtek je hotový</button></div>`;
    $('#k-ok', panel).onclick = () => {
      const ok = vyb.length === u.giv.length && u.giv.every(k => vyb.includes(k));
      if (ok) { api.ok('Náčrtek sedí. Teď zapiš postup.'); return zapisFaze(); }
      chyb++; pokusy++;
      if (pokusy >= 3) { vyb = [...u.giv]; ukaz(); api.chyba(`V zadání je dáno: ${u.giv.map(k => T.prvky[k]).join(', ')}.`, 3); panel.querySelector('#k-ok').textContent = 'Pokračovat k zápisu'; panel.querySelector('#k-ok').onclick = zapisFaze; return; }
      api.chyba(vyb.length !== u.giv.length ? `V zadání jsou dané ${prvku(u.giv.length)}, v náčrtku jich máš ${vyb.length}.` : 'Počet sedí, ale některý prvek je jiný než v zadání. Porovnej písmena.', pokusy);
    };
    ukaz();
  }

  function zapisFaze() {
    let pokusy = 0, op = null;
    faze('z', FAZE); kresli(); zapis();
    const body = () => Object.keys(st.pts), volna = () => u.names.filter(n => !st.pts[n]);
    const primky = () => {
      const out = Object.entries(st.lines).map(([n, L]) => [n, (L.ray && n.length === 2 ? '↦' : '') + n]), pary = [];
      const pridej = p => { if (!pary.includes(p) && !pary.includes(p[1] + p[0])) pary.push(p); };
      st.draw.forEach(d => { if (d[0] === 'seg' || d[0] === 'linepp') pridej(d[1] + d[2]); if (d[0] === 'poly' || d[0] === 'gpoly') [...d[1]].forEach((x, i, a) => pridej(x + a[(i + 1) % a.length])); });
      return [...out, ...pary.map(p => [p, '↔' + p])];
    };
    const objekty = () => [...Object.keys(st.circs).map(n => [n, 'kružnice ' + n]), ...primky()];
    const jmeno = kand => kand.find(n => !st.lines[n] && !st.circs[n]) || kand[0] + (Object.keys(st.lines).length + Object.keys(st.circs).length);
    const sel = (id, popis, moz) => `<label class="pole">${popis}<select id="f-${id}">${moz.map(m => Array.isArray(m) ? `<option value="${m[0]}">${m[1]}</option>` : `<option>${m}</option>`).join('')}</select></label>`;
    const val = id => $('#f-' + id, panel).value;
    const delky = () => u.lens.map(x => ['n:' + x, cz(x) + ' cm']);

    function formular() {
      const b = body(), pr = primky();
      const potrebaBod = '<p class="kon-pozn">K tomuhle kroku potřebuješ aspoň jeden sestrojený bod. Začni úsečkou.</p>';
      switch (op) {
        case 'seg': return b.length ? sel('a', 'z bodu', b) + sel('b', 'do bodu', [...b].reverse()) : `<p class="kon-pozn">První úsečka je AB.</p>` + sel('len', 'délka', delky());
        case 'line': return b.length < 2 ? potrebaBod : sel('a', 'bodem', b) + sel('b', 'a bodem', [...b].reverse());
        case 'circ': { if (!b.length) return potrebaBod; const pary = []; b.forEach((x, i) => b.slice(i + 1).forEach(y => pary.push(['p:' + x + y, `|${x}${y}|`]))); return sel('c', 'střed', b) + sel('r', 'poloměr', [...delky(), ...pary]); }
        case 'ray': return b.length < 2 ? potrebaBod : sel('v', 'vrchol', b) + sel('to', 'rameno míří k bodu', [...b].reverse()) + sel('ang', 'velikost', u.angs.map(x => [x, cz(x) + '°']));
        case 'perp': return !pr.length ? potrebaBod : sel('to', 'kolmá k', pr) + sel('thru', 'prochází bodem', [...b].reverse());
        case 'paral': return !pr.length ? potrebaBod : sel('to', 'rovnoběžná s', pr) + sel('thru', 'prochází bodem', [...b].reverse());
        case 'par': return !pr.length ? potrebaBod : sel('to', 'rovnoběžná s', pr) + sel('dist', 've vzdálenosti', delky());
        case 'axis': return b.length < 2 ? potrebaBod : sel('a', 'úsečka z bodu', b) + sel('b', 'do bodu', [...b].reverse());
        case 'mid': return b.length < 2 ? potrebaBod : !volna().length ? '<p class="kon-pozn">Všechny body ze zadání už jsou sestrojené.</p>' : sel('a', 'úsečka z bodu', b) + sel('b', 'do bodu', [...b].reverse()) + sel('name', 'střed pojmenuj', volna());
        case 'bis': return b.length < 3 ? '<p class="kon-pozn">Úhel potřebuje tři sestrojené body.</p>' : sel('v', 'vrchol úhlu', b) + sel('a', 'jedno rameno k bodu', b.filter((_, i) => i !== 0).concat(b[0])) + sel('b', 'druhé rameno k bodu', [...b].reverse());
        case 'int': { const ob = objekty(); return ob.length < 2 ? '<p class="kon-pozn">Průsečík potřebuje dva objekty (kružnice, přímky, úsečky).</p>' : !volna().length ? '<p class="kon-pozn">Všechny body ze zadání už jsou sestrojené.</p>'
          : sel('o1', 'kde se protíná', ob) + sel('o2', 'a', [...ob.slice(1), ob[0]]) + sel('name', 'bod pojmenuj', volna()) + `<span id="f-ktery">${sel('pick', 'který průsečík', [[0, 'horní (nebo levý)'], [1, 'dolní (nebo pravý)']])}</span>`; }
        case 'poly': return `<p class="kon-pozn">Zapíše výsledek: <span class="zap">${kZapis({ op: 'poly', pts: u.vysl, label: u.vyslPopis })}</span></p>`;
      }
      return '';
    }
    function krokZFormulare() {
      const m = id => $('#f-' + id, panel);
      if (op !== 'poly' && !panel.querySelector('.pole')) return null;
      switch (op) {
        case 'seg': return m('len') ? { op, a: 'A', b: 'B', len: +val('len').slice(2) } : { op, a: val('a'), b: val('b') };
        case 'line': return { op, a: val('a'), b: val('b') };
        case 'circ': { const r = val('r'); return { op, name: jmeno(['k', 'l', 'm', 'n']), c: val('c'), r: r[0] === 'n' ? +r.slice(2) : { pp: [r[2], r[3]] } }; }
        case 'ray': return { op, v: val('v'), to: val('to'), ang: +val('ang'), name: val('v') + ['X', 'Y', 'Z'].find(z => !st.lines[val('v') + z]) };
        case 'perp': case 'paral': return { op, name: jmeno(['p', 'q', 'r', 's']), to: val('to'), thru: val('thru') };
        case 'par': return { op, name: jmeno(['p', 'q', 'r', 's']), to: val('to'), dist: +val('dist').slice(2) };
        case 'axis': return { op, name: jmeno(['o', 'p', 'q', 'r']), a: val('a'), b: val('b') };
        case 'mid': return { op, name: val('name'), a: val('a'), b: val('b') };
        case 'bis': return { op, name: jmeno(['o', 'p', 'q', 'r']), v: val('v'), a: val('a'), b: val('b') };
        case 'int': return { op, name: val('name'), of: [val('o1'), val('o2')], pick: +val('pick') };
        case 'poly': return { op, pts: u.vysl, label: u.vyslPopis };
      }
      return null;
    }
    function vykresli() {
      panel.innerHTML = `<p class="kon-ot">Zapiš postup konstrukce. Vyber krok, doplň ho a přidej. Aplikace narýsuje přesně to, co zapíšeš.</p>
        <div class="kon-ops">${u.ops.map(o => `<button class="chip${o === op ? ' on' : ''}" data-op="${o}">${OP[o]}</button>`).join('')}</div>
        <div class="kon-form">${op ? formular() + '<button class="btn hl" id="k-pridat">Přidat krok</button>' : ''}</div>
        <div class="kon-akce"><button class="btn" id="k-zpet" ${kroky.length ? '' : 'disabled'}>Vrátit krok</button><button class="btn" id="k-ok">Zkontrolovat</button></div>`;
      $$('.chip', panel).forEach(b => b.onclick = () => { op = b.dataset.op; vykresli(); });
      const ktery = $('#f-ktery', panel);
      if (ktery) { const obn = () => { ktery.hidden = kPocetPruseciku(st, val('o1'), val('o2')) < 2; }; $('#f-o1', panel).onchange = obn; $('#f-o2', panel).onchange = obn; obn(); }
      const pridat = $('#k-pridat', panel);
      if (pridat) pridat.onclick = () => {
        const s = krokZFormulare(); if (!s) return;
        if ((s.a && s.a === s.b) || (s.op === 'ray' && s.v === s.to)) return api.info('Vyber dva různé body.');
        const kopie = kKopie(st), e = kExec(kopie, s);
        if (e) return api.info(e);
        st = kopie; kroky.push(s); api.krok(); kresli(true); zapis();
        if (cil()) return uspech();
        vykresli();
      };
      $('#k-zpet', panel).onclick = () => { kroky.pop(); prepocitej(); kresli(); zapis(); vykresli(); };
      $('#k-ok', panel).onclick = () => { chyb++; pokusy++; if (pokusy >= 3) return odhal(u.nsol != null ? () => diskuse(true) : null); api.chyba(kCil(st, u.goal) || '', pokusy); };
    }
    vykresli();
  }

  function diskuse(odhaleno) {
    faze('d', FAZE);
    const moz = ['žádné', 'jedno', 'dvě']; let spatne = 0;
    const el = document.createElement('div');
    el.innerHTML = `<p class="kon-ot">${u.nsolOtazka || 'Kolik řešení má úloha v jedné polorovině určené přímkou AB?'}</p><div class="volby">${moz.map((m, i) => `<button class="volba" data-i="${i}">${m}</button>`).join('')}</div>`;
    panel.appendChild(el);
    $$('.volba', el).forEach(b => b.onclick = () => {
      if (+b.dataset.i === u.nsol) { $$('.volba', el).forEach(x => x.disabled = true); b.classList.add('dobre'); el.insertAdjacentHTML('beforeend', `<p class="kon-hotovo">${u.nsolProc || ''}</p>`); return api.konec(chyb, odhaleno); }
      b.disabled = true; b.classList.add('spatne'); chyb++; api.chyba('', ++spatne);
    });
  }

  if (u.mode === 1) vedeny(); else if (u.mode === 2) skladani(); else if (u.tpl) nacrtek(); else zapisFaze();
}
