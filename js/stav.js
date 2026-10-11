// Uložený postup hráče (jen v zařízení, localStorage).
const KLIC = 'fajngeo_v1';
const VYCHOZI = () => ({
  v: 1, motiv: 'light', zvuk: true, postavy: true, rocnik: 6,
  xp: 0, krystaly: 0,
  urovne: {},   // '601-1': { hv: 0–3, her: počet odehraných sérií }
  strazci: {},  // '601': true
  mesto: [],    // id postavených staveb v pořadí stavby
  odznaky: {},  // id: datum
  vyklad: {},   // '601': true = výklad už viděl
  stat: { uloh: 0, napoprve: 0, combo: 0, kon3: 0, serii: 0, cistych: 0, ubraneno: 0, obrana: {}, den: { datum: '', serie: 0 },
    temata: {}, dny: {}, pasti: {}, chybne: [], hist: [] }, // pro rodiče: '601': [[úloh, vyřešeno, napoprvé] × 3 úrovně], dny: { datum: {f, h, x, ms} }
  rodic: { salt: '', hash: '' }, // rodičovské heslo (solený SHA-256)
  demo: { serie: 0, obrana: 0, vyzva: 0 }, // co už ukázka spotřebovala
});
export const stav = VYCHOZI();
function nastav(novy) { for (const k of Object.keys(stav)) delete stav[k]; Object.assign(stav, novy); }

export function nacti() {
  try {
    const s = JSON.parse(localStorage.getItem(KLIC) || 'null');
    if (s && s.v === 1) { const d = VYCHOZI(); nastav({ ...d, ...s, stat: { ...d.stat, ...(s.stat || {}), den: { ...d.stat.den, ...((s.stat || {}).den || {}) } } }); }
  } catch (e) { /* prázdné nebo zablokované úložiště – hraje se bez ukládání */ }
  return stav;
}
export function uloz() { try { localStorage.setItem(KLIC, JSON.stringify(stav)); } catch (e) { /* nic */ } }
// Vymazání postupu (jen z přehledu pro rodiče): nastavení, rodičovské heslo a počítadlo ukázky zůstanou.
export function smaz() { const z = {}; for (const k of ['motiv', 'zvuk', 'postavy', 'rocnik', 'uvod', 'rodic', 'demo']) if (k in stav) z[k] = stav[k]; nastav({ ...VYCHOZI(), ...z }); uloz(); }

export const HODNOSTI = [[0, 'Nováček'], [150, 'Učeň'], [400, 'Měřič'], [800, 'Rýsovač'], [1400, 'Kreslič'], [2200, 'Zeměměřič'], [3200, 'Stavitel'], [4500, 'Konstruktér'], [6000, 'Architekt'], [8000, 'Mistr geometrie']];
export function hodnost(xp = stav.xp) {
  let i = 0; while (i + 1 < HODNOSTI.length && xp >= HODNOSTI[i + 1][0]) i++;
  const od = HODNOSTI[i][0], doo = i + 1 < HODNOSTI.length ? HODNOSTI[i + 1][0] : null;
  return { i, nazev: HODNOSTI[i][1], dalsi: doo ? HODNOSTI[i + 1][1] : null, podil: doo ? (xp - od) / (doo - od) : 1, zbyva: doo ? doo - xp : 0 };
}
export const hvezdy = (tema, lvl) => (stav.urovne[`${tema}-${lvl}`] || {}).hv || 0;
export const hvezdyTematu = tema => hvezdy(tema, 1) + hvezdy(tema, 2) + hvezdy(tema, 3);
export function dnes() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
export function vcera() { const d = new Date(Date.now() - 864e5); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
