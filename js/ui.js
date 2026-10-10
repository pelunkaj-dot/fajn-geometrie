// Společné drobnosti rozhraní: výběr prvků, okno, krátká zpráva, hvězdičky, vypínač zvuku.
import { stav, uloz } from './stav.js';
import { nastavZvuk } from './zvuky.js';

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

let otevrene = null, volby = null;
// modal({ nadpis, html, tlacitka: [{ t, hl, fn, nezavirat }], siroke, poOtevreni, poZavreni, pevne })
// Každé okno jde zavřít křížkem, ťuknutím vedle, klávesou Esc i tlačítkem Zpět v prohlížeči.
// Výjimkou je jen okno s `pevne` (uvítání), které má jediné tlačítko.
// `poZavreni` se zavolá při každém zavření, jen ne když okno nahrazuje jiné okno.
export function modal(o) {
  zavriModal(true);
  const el = document.createElement('div');
  el.className = 'okno-pozadi';
  el.innerHTML = `<div class="okno${o.siroke ? ' okno-siroke' : ''}" role="dialog" aria-modal="true" aria-label="${o.nadpis || ''}">
    ${o.pevne ? '' : '<button class="okno-x" aria-label="Zavřít">✕</button>'}
    ${o.nadpis ? `<h2 class="okno-h">${o.nadpis}</h2>` : ''}<div class="okno-telo">${o.html || ''}</div>
    <div class="okno-akce">${(o.tlacitka || []).map((b, i) => `<button class="btn${b.hl ? ' hl' : ''}" data-i="${i}">${b.t}</button>`).join('')}</div></div>`;
  el.addEventListener('click', e => {
    const b = e.target.closest('.okno-akce button');
    if (b) { const t = o.tlacitka[+b.dataset.i]; if (!t.nezavirat) zavriModal(); if (t.fn) t.fn(el); }
    else if (!o.pevne && (e.target === el || e.target.closest('.okno-x'))) zavriModal();
  });
  document.body.appendChild(el); otevrene = el; volby = o;
  if (o.poOtevreni) o.poOtevreni(el);
  const prvni = el.querySelector('.okno-akce .hl') || el.querySelector('.okno-akce button'); if (prvni) prvni.focus();
  return el;
}
export function zavriModal(tise) {
  if (!otevrene) return;
  const o = volby; otevrene.remove(); otevrene = null; volby = null;
  if (!tise && o && o.poZavreni) o.poZavreni();
}
export const jeModal = () => !!otevrene;
export const modalPevny = () => !!(volby && volby.pevne);

let tt = null;
export function toast(text) {
  let el = $('#toast'); if (!el) { el = document.createElement('div'); el.id = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.textContent = text; el.classList.add('je'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('je'), 2600);
}
export const hv = n => `<span class="hv" aria-label="${n} ze 3 hvězd">${'<i class="on">★</i>'.repeat(n)}${'<i>★</i>'.repeat(3 - n)}</span>`;
export const KRYSTAL = '<svg class="kr" viewBox="0 0 16 16" aria-hidden="true"><polygon points="8,1 14,6 8,15 2,6"/><polyline points="2,6 14,6"/><polyline points="5.5,6 8,1 10.5,6 8,15 5.5,6"/></svg>';

// Vypínač zvuku: je v horní liště na každé obrazovce, i uprostřed série a obrany.
const REPRO = '<path d="M4 9v6h4l5 4V5L8 9z"/>';
const zvukIkona = () => `<svg class="ikona" viewBox="0 0 24 24" aria-hidden="true">${REPRO}${stav.zvuk ? '<path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/>' : '<path d="M16 9l5 6M21 9l-5 6"/>'}</svg>`;
const zvukPopis = () => (stav.zvuk ? 'Vypnout zvuk' : 'Zapnout zvuk');
export const zvukBtn = () => `<button class="ik" data-zvuk aria-label="${zvukPopis()}">${zvukIkona()}</button>`;
export function napojZvuk(root) {
  const b = root.querySelector('[data-zvuk]'); if (!b) return;
  b.onclick = () => { stav.zvuk = !stav.zvuk; uloz(); nastavZvuk(stav.zvuk); b.innerHTML = zvukIkona(); b.setAttribute('aria-label', zvukPopis()); };
}
