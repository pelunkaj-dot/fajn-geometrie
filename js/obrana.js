// Obrana města: na město padají meteory, každý nese rychlou úlohu se čtyřmi odpověďmi.
// Správná odpověď meteor sestřelí, špatná ho popožene. Tři vlny, město má pět štítů.
import { toChoice } from './ulohy.js';
import { pick } from './util.js';
import { mestoSvg } from './mesto.js';
import { zvuk } from './zvuky.js';
import { $, $$, modal, zvukBtn, napojZvuk } from './ui.js';

const VLNY = [{ n: 5, cas: 22 }, { n: 6, cas: 18 }, { n: 7, cas: 15 }];
const TVARY = ['50,4 96,38 78,94 22,94 4,38', '50,2 98,50 50,98 2,50', '50,4 93,28 93,74 50,96 7,74 7,28', '50,6 96,90 4,90'];

export function rychlaUloha(rocnik) {
  const gens = rocnik.temata.flatMap(t => t.rychle || []);
  for (let k = 0; k < 60; k++) { const c = toChoice(pick(gens)()); if (c && c.opts.every(o => String(o).length < 34)) return c; }
  return toChoice(gens[0]());
}

// cfg: { rocnik, mesto: [id…], onKonec({ skore, ubraneno, zasahu }), onZpet() }
export function obrana(root, cfg) {
  let vlna = 0, vVlne = 0, skore = 0, stity = 5, combo = 0, zasahu = 0, u = null, p = 0, cas = 0, posl = 0, bezi = false, raf = 0, konec = false, pauza = false;
  const zakladni = ['domek', 'vez', 'skola', 'mrakodrap', 'hvezdarna'];
  root.innerHTML = `<div class="hra obr">
    <header class="hra-lista"><button class="ik" id="o-zpet" aria-label="Ukončit">✕</button><span class="obr-hud">Vlna <b id="o-vlna">1</b>/3</span><span class="obr-hud">Body <b id="o-skore">0</b></span><span class="combo" id="o-combo" hidden></span><span class="zivoty" id="o-stity"></span>${zvukBtn()}</header>
    <div class="arena" id="o-arena"><div class="meteor" id="o-met"><svg viewBox="0 0 100 100"><polygon id="o-tvar" points=""/></svg></div><div class="arena-mesto">${mestoSvg(cfg.mesto.length ? cfg.mesto.slice(-7) : zakladni, { H: 150 })}</div><div class="arena-hlas" id="o-hlas"></div></div>
    <div class="obr-ul"><p class="ul-text" id="o-text"></p><p class="ul-q" id="o-q"></p><div class="volby ctyri" id="o-volby"></div></div></div>`;
  const met = $('#o-met', root), arena = $('#o-arena', root);
  // Odchod: hra se pozastaví a zeptá se (křížek, Esc i Zpět v prohlížeči).
  function chceOdejit() {
    if (konec) return;
    pauza = true;
    modal({ nadpis: 'Ukončit obranu?', html: '<p>Hra je pozastavená. Rozehraná obrana se nezapočítá.</p>', tlacitka: [{ t: 'Pokračovat', hl: 1 }, { t: 'Ukončit', fn: () => { stop(); cfg.onZpet(); } }],
      poZavreni: () => { pauza = document.hidden; posl = performance.now(); } });
  }
  $('#o-zpet', root).onclick = chceOdejit; napojZvuk(root);

  function hud() {
    $('#o-vlna', root).textContent = vlna + 1; $('#o-skore', root).textContent = skore;
    $('#o-stity', root).innerHTML = '<i class="on">◆</i>'.repeat(stity) + '<i>◆</i>'.repeat(5 - stity);
    const c = $('#o-combo', root); c.hidden = combo < 2; c.textContent = `${combo}× v řadě`;
  }
  function hlas(text) { const h = $('#o-hlas', root); h.textContent = text; h.classList.remove('je'); void h.offsetWidth; h.classList.add('je'); }
  function novy() {
    if (vVlne >= VLNY[vlna].n) {
      vlna++; vVlne = 0;
      if (vlna >= VLNY.length) return dohrano(true);
      hlas(`Vlna ${vlna + 1}`);
    }
    u = rychlaUloha(cfg.rocnik); p = 0; cas = VLNY[vlna].cas * 1000; vVlne++;
    $('#o-tvar', root).setAttribute('points', pick(TVARY)); met.className = 'meteor';
    met.style.left = `${12 + Math.random() * 62}%`;
    $('#o-text', root).innerHTML = u.text || ''; $('#o-q', root).innerHTML = u.q || '';
    $('#o-volby', root).innerHTML = u.opts.map((o, k) => `<button class="volba" data-i="${k}">${o}</button>`).join('');
    $$('#o-volby .volba', root).forEach(b => b.onclick = () => odpoved(b));
    hud(); bezi = true; posl = performance.now();
  }
  function odpoved(b) {
    if (!bezi) return;
    if (+b.dataset.i === u.ans) {
      bezi = false; combo++; zasahu++; const zisk = Math.round((10 + 10 * (1 - p)) * (1 + Math.min(combo - 1, 8) * 0.25));
      skore += zisk; zvuk.zasah(); met.classList.add('zasah'); b.classList.add('dobre'); hlas(`+${zisk}`); hud();
      setTimeout(() => { if (!konec) novy(); }, 650);
    } else { b.disabled = true; b.classList.add('spatne'); combo = 0; p = Math.min(1, p + 0.18); zvuk.chyba(); hud(); }
  }
  function dopad() {
    bezi = false; stity--; combo = 0; zvuk.dopad(); met.classList.add('dopad'); arena.classList.remove('otres'); void arena.offsetWidth; arena.classList.add('otres');
    const spr = $$('#o-volby .volba', root)[u.ans]; if (spr) spr.classList.add('dobre');
    $$('#o-volby .volba', root).forEach(x => x.disabled = true); hud();
    if (stity <= 0) return setTimeout(() => dohrano(false), 900);
    setTimeout(() => { if (!konec) novy(); }, 1500);
  }
  function smycka(ted) {
    if (konec) return;
    const dt = Math.min(ted - posl, 100); posl = ted;
    if (bezi && !pauza) { p += dt / cas; if (p >= 1) { p = 1; dopad(); } }
    met.style.setProperty('--p', p.toFixed(4));
    raf = requestAnimationFrame(smycka);
  }
  function stop() { konec = true; cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', vid); }
  function dohrano(ubraneno) { stop(); cfg.onKonec({ skore, ubraneno, zasahu }); }
  const vid = () => { pauza = document.hidden; posl = performance.now(); };
  document.addEventListener('visibilitychange', vid);
  hlas('Vlna 1'); novy(); raf = requestAnimationFrame(smycka);
  return { stop, zpet: chceOdejit };
}
