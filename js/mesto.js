// Město z geometrických tvarů. Stavby se kupují za krystaly; pořadí staveb si hráč určuje sám.
// Souřadnice: x zleva, v = výška nad zemí.
const R = (x, v, w, h, c) => `<rect x="${x}" y="${-(v + h)}" width="${w}" height="${h}" class="${c}"/>`;
const P = (b, c) => `<polygon points="${b.map(p => p[0] + ',' + -p[1]).join(' ')}" class="${c}"/>`;
const O = (x, v, r, c) => `<circle cx="${x}" cy="${-v}" r="${r}" class="${c}"/>`;
const E = (x, v, rx, ry, c) => `<ellipse cx="${x}" cy="${-v}" rx="${rx}" ry="${ry}" class="${c}"/>`;
const L = (x1, v1, x2, v2, c = 'ms-l') => `<line x1="${x1}" y1="${-v1}" x2="${x2}" y2="${-v2}" class="${c}"/>`;
const A = (x1, x2, v, r, c) => `<path d="M${x1} ${-v}A${r} ${r} 0 0 1 ${x2} ${-v}Z" class="${c}"/>`;
const okna = (x, v, sl, rad, dx = 10, dv = 13, w = 5, h = 7) => { let s = ''; for (let i = 0; i < sl; i++) for (let j = 0; j < rad; j++) s += R(x + i * dx, v + j * dv, w, h, 'ms-c'); return s; };

export const STAVBY = [
  { id: 'stan', v: 30, nazev: 'Stan', cena: 15, w: 40, tvary: 'trojúhelník', k: () => P([[2, 0], [38, 0], [20, 30]], 'ms-b') + P([[16, 0], [24, 0], [20, 14]], 'ms-d') },
  { id: 'domek', v: 50, nazev: 'Domek', cena: 30, w: 46, tvary: 'čtverec a trojúhelník', k: () => R(6, 0, 34, 30, 'ms-a') + P([[2, 30], [44, 30], [23, 50]], 'ms-b') + R(19, 0, 8, 15, 'ms-d') + R(10, 14, 6, 7, 'ms-c') + R(30, 14, 6, 7, 'ms-c') },
  { id: 'dilna', v: 36, nazev: 'Dílna', cena: 45, w: 60, tvary: 'obdélník a rovnoběžník', k: () => R(4, 0, 52, 24, 'ms-a') + P([[4, 24], [56, 24], [48, 36], [-4 + 8, 36]], 'ms-b') + R(10, 0, 16, 16, 'ms-d') + R(34, 8, 14, 8, 'ms-c') },
  { id: 'vez', v: 96, nazev: 'Věž', cena: 60, w: 34, tvary: 'kvádr a jehlan', k: () => R(8, 0, 18, 70, 'ms-a') + P([[4, 70], [30, 70], [17, 96]], 'ms-b') + okna(14, 12, 1, 4, 10, 14, 6, 8) },
  { id: 'mlyn', v: 90, nazev: 'Větrný mlýn', cena: 80, w: 70, tvary: 'lichoběžník a trojúhelníky', k: () => P([[22, 0], [48, 0], [42, 56], [28, 56]], 'ms-a') + P([[26, 56], [44, 56], [35, 70]], 'ms-b') + R(31, 0, 8, 14, 'ms-d')
      + [[0, 1], [1, 0], [0, -1], [-1, 0]].map(([dx, dv]) => P([[35, 58], [35 + dx * 30 - dv * 6, 58 + dv * 30 + dx * 6], [35 + dx * 30 + dv * 6, 58 + dv * 30 - dx * 6]], 'ms-c')).join('') + O(35, 58, 3, 'ms-d') },
  { id: 'skola', v: 72, nazev: 'Škola', cena: 100, w: 92, tvary: 'obdélníky, trojúhelník a kruh', k: () => R(4, 0, 84, 40, 'ms-a') + R(34, 40, 24, 16, 'ms-a') + P([[30, 56], [62, 56], [46, 72]], 'ms-b') + O(46, 48, 6, 'ms-c') + R(41, 0, 10, 18, 'ms-d') + okna(10, 8, 3, 2) + okna(58, 8, 3, 2) },
  { id: 'most', v: 46, nazev: 'Most', cena: 120, w: 110, tvary: 'půlkruhy', k: () => R(0, 0, 110, 34, 'ms-a') + A(10, 46, 0, 18, 'ms-n') + A(64, 100, 0, 18, 'ms-n') + R(0, 34, 110, 5, 'ms-b') + L(0, 44, 110, 44) },
  { id: 'hvezdarna', v: 60, nazev: 'Hvězdárna', cena: 140, w: 62, tvary: 'válec a polokoule', k: () => R(8, 0, 46, 30, 'ms-a') + A(8, 54, 30, 23, 'ms-b') + P([[31, 30], [37, 30], [44, 58], [38, 58]], 'ms-d') + R(26, 0, 10, 16, 'ms-d') },
  { id: 'pyramida', v: 66, nazev: 'Pyramida', cena: 160, w: 100, tvary: 'jehlan', k: () => P([[2, 0], [98, 0], [50, 66]], 'ms-b') + L(50, 66, 66, 0) + L(18, 22, 82, 22) + L(34, 44, 66, 44) },
  { id: 'vodojem', v: 88, nazev: 'Vodojem', cena: 180, w: 52, tvary: 'koule a válec', k: () => R(22, 0, 8, 50, 'ms-a') + L(12, 0, 22, 44) + L(40, 0, 30, 44) + O(26, 66, 22, 'ms-b') + E(26, 66, 22, 6, 'ms-n') },
  { id: 'silo', v: 98, nazev: 'Silo', cena: 200, w: 44, tvary: 'válec a kužel', k: () => R(6, 0, 32, 76, 'ms-a') + E(22, 76, 16, 5, 'ms-a') + P([[4, 78], [40, 78], [22, 98]], 'ms-b') + L(6, 26, 38, 26) + L(6, 52, 38, 52) },
  { id: 'stadion', v: 50, nazev: 'Stadion', cena: 230, w: 130, tvary: 'elipsa', k: () => E(65, 16, 62, 16, 'ms-a') + E(65, 20, 46, 9, 'ms-c') + R(3, 0, 124, 16, 'ms-a') + [14, 40, 90, 116].map(x => L(x, 16, x, 44) + O(x, 46, 3, 'ms-b')).join('') },
  { id: 'mrakodrap', v: 158, nazev: 'Mrakodrap', cena: 260, w: 48, tvary: 'vysoký kvádr', k: () => R(6, 0, 36, 132, 'ms-a') + R(14, 132, 20, 10, 'ms-b') + L(24, 142, 24, 158) + okna(11, 8, 3, 9) },
  { id: 'majak', v: 112, nazev: 'Maják', cena: 300, w: 46, tvary: 'komolý kužel a válec', k: () => P([[10, 0], [36, 0], [30, 84], [16, 84]], 'ms-a') + P([[12, 28], [34, 28], [32.5, 50], [13.5, 50]], 'ms-b') + R(13, 84, 20, 4, 'ms-d') + R(17, 88, 12, 12, 'ms-c') + P([[14, 100], [32, 100], [23, 112]], 'ms-b') },
  { id: 'vysilac', v: 156, nazev: 'Vysílač', cena: 350, w: 50, tvary: 'štíhlý jehlan a kruhy', k: () => P([[14, 0], [36, 0], [25, 150]], 'ms-a') + L(18, 30, 32, 30) + L(20, 60, 30, 60) + E(25, 96, 13, 4, 'ms-b') + E(25, 108, 9, 3, 'ms-b') + O(25, 152, 3, 'ms-c') },
  { id: 'zamek', v: 104, nazev: 'Zámek', cena: 400, w: 130, tvary: 'kvádry, válce a kužely', k: () => R(22, 0, 86, 48, 'ms-a') + R(4, 0, 22, 74, 'ms-a') + R(104, 0, 22, 74, 'ms-a') + P([[0, 74], [30, 74], [15, 104]], 'ms-b') + P([[100, 74], [130, 74], [115, 104]], 'ms-b')
      + P([[22, 48], [108, 48], [96, 66], [34, 66]], 'ms-b') + R(57, 0, 16, 26, 'ms-d') + A(57, 73, 26, 8, 'ms-d') + okna(30, 26, 2, 1, 12, 12, 7, 10) + okna(82, 26, 2, 1, 12, 12, 7, 10) + okna(11, 20, 1, 3, 10, 16, 7, 9) + okna(111, 20, 1, 3, 10, 16, 7, 9) },
  { id: 'raketa', v: 148, nazev: 'Raketa', cena: 500, w: 70, tvary: 'válec, kužel a trojúhelníky', k: () => R(4, 0, 62, 8, 'ms-d') + P([[14, 8], [26, 8], [26, 40]], 'ms-b') + P([[56, 8], [44, 8], [44, 40]], 'ms-b') + R(26, 8, 18, 108, 'ms-a') + P([[26, 116], [44, 116], [35, 148]], 'ms-b') + O(35, 92, 6, 'ms-c') + O(35, 70, 4, 'ms-c') + L(26, 54, 44, 54) },
];
export const stavba = id => STAVBY.find(s => s.id === id);

// Panorama města. ids = postavené stavby; o.max = nejmenší šířka výřezu
export function mestoSvg(ids, o = {}) {
  const H = o.H || 170, mez = 8; let x = 12, g = '';
  for (const id of ids) { const s = stavba(id); if (!s) continue; g += `<g transform="translate(${x} 0)" class="ms-st${o.nova === id ? ' ms-nova' : ''}">${s.k()}</g>`; x += s.w + mez; }
  const W = Math.max(o.W || 360, x + 4);
  const prazdno = ids.length ? '' : `<text x="${W / 2}" y="${-H / 2}" text-anchor="middle" class="ms-text">Tady vyroste tvoje město.</text>`;
  return `<svg viewBox="0 ${-H} ${W} ${H + 12}" class="mesto" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tvoje město">`
    + `<rect x="0" y="0" width="${W}" height="12" class="ms-zem"/>${prazdno}${g}<line x1="0" y1="0" x2="${W}" y2="0" class="ms-l"/></svg>`;
}
export function stavbaSvg(id) {
  const s = stavba(id), H = s.v + 6;
  return `<svg viewBox="-6 ${-H} ${s.w + 12} ${H + 6}" class="mesto mesto-1" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg" role="img">${s.k()}<line x1="-6" y1="0" x2="${s.w + 6}" y2="0" class="ms-l"/></svg>`;
}
