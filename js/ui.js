// Společné drobnosti rozhraní: výběr prvků, okno, krátká zpráva, hvězdičky.
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

let otevrene = null;
// modal({ nadpis, html, tlacitka: [{ t, hl, fn, nezavirat }], siroke, poOtevreni })
export function modal(o) {
  zavriModal();
  const el = document.createElement('div');
  el.className = 'okno-pozadi';
  el.innerHTML = `<div class="okno${o.siroke ? ' okno-siroke' : ''}" role="dialog" aria-modal="true" aria-label="${o.nadpis || ''}">
    ${o.nadpis ? `<h2 class="okno-h">${o.nadpis}</h2>` : ''}<div class="okno-telo">${o.html || ''}</div>
    <div class="okno-akce">${(o.tlacitka || []).map((b, i) => `<button class="btn${b.hl ? ' hl' : ''}" data-i="${i}">${b.t}</button>`).join('')}</div></div>`;
  el.addEventListener('click', e => {
    const b = e.target.closest('.okno-akce button');
    if (b) { const t = o.tlacitka[+b.dataset.i]; if (!t.nezavirat) zavriModal(); if (t.fn) t.fn(el); }
    else if (e.target === el && o.zavritKlikem !== false) zavriModal();
  });
  document.body.appendChild(el); otevrene = el;
  if (o.poOtevreni) o.poOtevreni(el);
  const prvni = el.querySelector('.okno-akce .hl') || el.querySelector('.okno-akce button'); if (prvni) prvni.focus();
  return el;
}
export function zavriModal() { if (otevrene) { otevrene.remove(); otevrene = null; } }
export const jeModal = () => !!otevrene;

let tt = null;
export function toast(text) {
  let el = $('#toast'); if (!el) { el = document.createElement('div'); el.id = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.textContent = text; el.classList.add('je'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('je'), 2600);
}
export const hv = n => `<span class="hv" aria-label="${n} ze 3 hvězd">${'<i class="on">★</i>'.repeat(n)}${'<i>★</i>'.repeat(3 - n)}</span>`;
export const KRYSTAL = '<svg class="kr" viewBox="0 0 16 16" aria-hidden="true"><polygon points="8,1 14,6 8,15 2,6"/><polyline points="2,6 14,6"/><polyline points="5.5,6 8,1 10.5,6 8,15 5.5,6"/></svg>';
