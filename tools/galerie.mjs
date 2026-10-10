// Galerie obrázků ke kontrole vzhledu: node tools/galerie.mjs > galerie.html (soubor ulož do kořene repozitáře)
import { ROCNIKY } from '../js/obsah.js';
import { setRng, mulberry } from '../js/util.js';
setRng(mulberry(Number(process.env.SEED || 2)));
const jen = process.argv[2];
let h = '<!doctype html><html lang="cs" data-theme="' + (process.env.MOTIV || 'light') + '"><meta charset="utf-8"><link rel="stylesheet" href="css/style.css"><style>.g{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;padding:6px}.g>div{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:2px}.g small{display:block;font-size:10px;color:var(--muted);text-align:center}</style><body><div class="g">';
for (const r of ROCNIKY) { if (jen && String(r.rocnik) !== jen) continue;
  for (const t of r.temata) {
    t.vyklad.forEach((v, i) => { if (v.fig) h += `<div><div class="ul-obr">${v.fig()}</div><small>${t.id} výklad ${i + 1}</small></div>`; });
    t.u.forEach((gens, li) => gens.forEach(g => { const u = g(); if (u.fig && u.kind !== 'kon') h += `<div><div class="ul-obr">${u.fig}</div><small>${t.id}/${li + 1} ${g.name || ''}</small></div>`; }));
  } }
console.log(h + '</div></body></html>');
