// FajnGeometrie – obrazovky a herní smyčka kolem sérií úloh.
import { ROCNIKY, NAZVY_UROVNI } from './obsah.js';
import { stav, nacti, uloz, smaz, hodnost, hvezdy, hvezdyTematu, dnes, vcera } from './stav.js';
import { serie, strazceSvg } from './hra.js';
import { obrana } from './obrana.js';
import { STAVBY, stavba, mestoSvg, stavbaSvg } from './mesto.js';
import { ODZNAKY, noveOdznaky } from './odznaky.js';
import { zvuk, odemkni, nastavZvuk } from './zvuky.js';
import { rekni } from './hlasky.js';
import { avatar, obrazek } from './postavy.js';
import { $, $$, modal, zavriModal, toast, hv, KRYSTAL } from './ui.js';
import { shuffle, pick, setRng, mulberry } from './util.js';

const DEMO = !!window.FG_DEMO;
const app = $('#app');
let zalozka = 'vyprava', bezici = null;
const POPIS_UROVNE = ['od úplného začátku, s výkladem a nápovědou', 'kratší zadání, jedna až dvě úvahy', 'složitá zadání, přesná odpověď'];
const rocnik = () => ROCNIKY.find(r => r.rocnik === stav.rocnik) || ROCNIKY[0];
const kdoMluvi = () => stav.postavy ? pick(['Matýsek', 'Terezka']) : 'Nikdo';
const vDemu = (tema, lvl) => !DEMO || (rocnik().temata[0].id === tema.id && lvl === 1);

const IK = {
  vyprava: '<polygon points="12,3 21,20 3,20"/>', obrana: '<circle cx="14" cy="14" r="6"/><path d="M3 3l6 6M3 9l3 3M9 3l3 3"/>', vyzva: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  mesto: '<path d="M3 21V11h5v10M8 21V5h7v16M15 21v-8h6v8M2 21h20"/>', odznaky: '<polygon points="12,2 20,7 20,17 12,22 4,17 4,7"/><path d="M9 12l2 2 4-4"/>',
  zvuk: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/>', ticho: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9l5 6M21 9l-5 6"/>', nast: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
};
const ik = n => `<svg class="ikona" viewBox="0 0 24 24" aria-hidden="true">${IK[n]}</svg>`;

function motiv() { document.documentElement.dataset.theme = stav.motiv; nastavZvuk(stav.zvuk); }

// ---------- rám: horní lišta, obsah, spodní navigace ----------
function ram(obsah) {
  const h = hodnost();
  app.innerHTML = `<div class="ram">
    <header class="lista">
      <div class="logo">Fajn<b>Geometrie</b>${DEMO ? '<span class="ukazka">ukázka</span>' : ''}</div>
      <button class="hod" id="b-hod" aria-label="Hodnost ${h.nazev}"><span class="hod-n">${h.nazev}</span><span class="hod-p"><i style="width:${Math.round(h.podil * 100)}%"></i></span></button>
      <span class="mena" title="Krystaly">${KRYSTAL}<b>${stav.krystaly}</b></span>
      <button class="ik" id="b-zvuk" aria-label="${stav.zvuk ? 'Vypnout zvuk' : 'Zapnout zvuk'}">${ik(stav.zvuk ? 'zvuk' : 'ticho')}</button>
      <button class="ik" id="b-nast" aria-label="Nastavení">${ik('nast')}</button>
    </header>
    <main class="obsah" id="obsah">${obsah}</main>
    <nav class="nav" aria-label="Hlavní nabídka">${[['vyprava', 'Výprava'], ['obrana', 'Obrana'], ['vyzva', 'Výzva'], ['mesto', 'Město'], ['odznaky', 'Odznaky']].map(([k, n]) => `<button data-z="${k}" class="${k === zalozka ? 'on' : ''}">${ik(k)}<span>${n}</span></button>`).join('')}</nav></div>`;
  $$('.nav button').forEach(b => b.onclick = () => { zvuk.klik(); zalozka = b.dataset.z; kresli(); });
  $('#b-zvuk').onclick = () => { stav.zvuk = !stav.zvuk; uloz(); motiv(); kresli(); };
  $('#b-nast').onclick = nastaveni;
  $('#b-hod').onclick = () => { zalozka = 'odznaky'; kresli(); };
  window.scrollTo(0, 0);
}
function kresli() { ({ vyprava, obrana: obranaUvod, vyzva, mesto, odznaky })[zalozka](); }

// ---------- výprava: ročníky, témata, úrovně ----------
function vyprava() {
  const R = rocnik(), h = hodnost();
  ram(`<section class="uvod" id="uvod-mesto">${mestoSvg(stav.mesto, { H: stav.mesto.length ? 150 : 64 })}
      <p class="uvod-t">${h.dalsi ? `Do hodnosti ${h.dalsi} zbývá <b>${h.zbyva}</b> bodů.` : 'Nejvyšší hodnost je tvoje.'}</p></section>
    <div class="rocniky" role="tablist" aria-label="Ročník">${ROCNIKY.map(r => `<button role="tab" aria-selected="${r.rocnik === R.rocnik}" class="${r.rocnik === R.rocnik ? 'on' : ''}" data-r="${r.rocnik}">${r.rocnik}. ročník</button>`).join('')}</div>
    <div class="temata">${R.temata.map(t => {
      const sh = hvezdyTematu(t.id), sOk = stav.strazci[t.id], sOdem = sh >= 3;
      return `<section class="tema" data-id="${t.id}">
        <div class="tema-h"><span class="tema-ik" aria-hidden="true">${t.ikona}</span><div class="tema-n"><h2>${t.nazev}</h2><p>${t.popis}</p></div><button class="btn mini" data-vyklad>Výklad</button></div>
        <div class="urovne">${[1, 2, 3].map(l => `<button class="uroven${vDemu(t, l) ? '' : ' zamek'}" data-l="${l}"><span class="ur-c">${l}</span><span class="ur-n">${NAZVY_UROVNI[l - 1]}</span>${vDemu(t, l) ? hv(hvezdy(t.id, l)) : '<span class="ur-z">v plné verzi</span>'}</button>`).join('')}
          <button class="uroven strazce-b${sOk ? ' porazen' : ''}${sOdem && !DEMO ? '' : ' zamek'}" data-s><span class="ur-c">${sOk ? '✓' : '!'}</span><span class="ur-n">${t.strazce}</span><span class="ur-z">${DEMO ? 'v plné verzi' : sOk ? 'strážce poražen' : sOdem ? 'souboj se strážcem' : `ještě ${3 - sh} ${3 - sh === 1 ? 'hvězda' : 'hvězdy'}`}</span></button></div>
      </section>`; }).join('')}</div>`);
  $('#uvod-mesto').onclick = () => { zalozka = 'mesto'; kresli(); };
  $$('.rocniky button').forEach(b => b.onclick = () => { stav.rocnik = +b.dataset.r; uloz(); kresli(); });
  $$('.tema').forEach(el => {
    const t = rocnik().temata.find(x => x.id === el.dataset.id);
    $('[data-vyklad]', el).onclick = () => ukazVyklad(t);
    $$('[data-l]', el).forEach(b => b.onclick = () => { const l = +b.dataset.l; if (!vDemu(t, l)) return plna(); odemkni(); pripravUroven(t, l); });
    $('[data-s]', el).onclick = () => { if (DEMO) return plna(); if (hvezdyTematu(t.id) < 3) return toast('Strážce se probudí, až v tématu získáš aspoň tři hvězdy.'); odemkni(); pripravStrazce(t); };
  });
}
function plna() { modal({ nadpis: 'Tohle je ukázka', html: '<p>V ukázce si vyzkoušíš první téma každého ročníku na úrovni Základy. Všechna témata, úrovně, strážce i město jsou v plné verzi na <b>fajndoucko.cz</b>.</p>', tlacitka: [{ t: 'Rozumím', hl: 1 }] }); }

function ukazVyklad(t, pak) {
  let k = 0; stav.vyklad[t.id] = true; uloz();
  const ukaz = () => {
    const c = t.vyklad[k], posl = k === t.vyklad.length - 1;
    modal({ siroke: 1, zavritKlikem: !pak, nadpis: c.h, html: `<div class="vyklad">${c.fig ? `<div class="ul-obr">${c.fig()}</div>` : ''}<div class="vyklad-t">${c.t}</div><p class="vyklad-p">${k + 1} / ${t.vyklad.length} · ${t.nazev}</p></div>`,
      tlacitka: [...(k ? [{ t: 'Zpět', fn: () => { k--; ukaz(); } }] : []), posl ? { t: pak ? 'Jdu na úlohy' : 'Zavřít', hl: 1, fn: () => pak && pak() } : { t: 'Dál', hl: 1, fn: () => { k++; ukaz(); } }] });
  };
  ukaz();
}

function sestav(gens, n, lvl, filtr) {
  const out = []; let pytel = [], pokusu = 0;
  while (out.length < n && pokusu++ < 400) {
    if (!pytel.length) pytel = shuffle(gens);
    const u = pytel.pop()();
    if (filtr && !filtr(u)) continue;
    out.push({ u, lvl });
  }
  return out;
}
function pripravUroven(t, lvl) {
  const start = () => {
    const n = t.kon ? [6, 6, 5][lvl - 1] : [10, 10, 8][lvl - 1], kdo = kdoMluvi();
    bezici = serie(app, { typ: 'uroven', ulohy: sestav(t.u[lvl - 1], n, lvl), kdo, vyklad: () => ukazVyklad(t), onZpet: kresli, onKonec: res => poUrovni(t, lvl, res, kdo) });
  };
  if (lvl === 1 && !stav.vyklad[t.id]) ukazVyklad(t, start); else start();
}

function pripis(res) { // společné: body, statistiky
  const pred = hodnost().i;
  stav.xp += res.xp; stav.stat.uloh += res.vyreseno; stav.stat.napoprve += res.napoprve; stav.stat.combo = Math.max(stav.stat.combo, res.comboMax); stav.stat.kon3 += res.kon3; stav.stat.serii++;
  if (res.vyreseno === res.n && res.napoprve === res.n) stav.stat.cistych++;
  return hodnost().i > pred ? hodnost().nazev : null;
}
function poUrovni(t, lvl, res, kdo) {
  const podil = res.body.reduce((a, b) => a + b, 0) / res.n;
  const h = podil >= 0.95 && !res.odhaleno ? 3 : podil >= 0.8 ? 2 : podil >= 0.6 ? 1 : 0;
  const klic = `${t.id}-${lvl}`, pred = hvezdy(t.id, lvl), kr = Math.max(0, h - pred) * 5 * lvl;
  stav.urovne[klic] = { hv: Math.max(pred, h), her: ((stav.urovne[klic] || {}).her || 0) + 1 };
  stav.krystaly += kr; const povyseni = pripis(res), nove = noveOdznaky(stav, ROCNIKY); uloz();
  zvuk[h ? 'hotovo' : 'neuspech'](h);
  const dalsiL = lvl < 3 && h >= 1 && vDemu(t, lvl + 1) ? lvl + 1 : null, muzeStrazce = !DEMO && !stav.strazci[t.id] && hvezdyTematu(t.id) >= 3;
  vysledek({ nadpis: ['Tentokrát to nestačilo', 'Úroveň splněna', 'Dobrá práce', 'Bezchybně'][h], hvezdy: h, radky: [`${res.napoprve} z ${res.n} napoprvé`, `úspěšnost ${Math.round(podil * 100)} %`], xp: res.xp, kr, kdo, hlaska: rekni(kdo, 'hv' + h), povyseni, nove,
    akce: [...(dalsiL ? [{ t: `Úroveň ${NAZVY_UROVNI[dalsiL - 1]}`, hl: 1, fn: () => pripravUroven(t, dalsiL) }] : muzeStrazce && lvl === 3 ? [{ t: `Vyzvat strážce`, hl: 1, fn: () => pripravStrazce(t) }] : []),
      { t: 'Hrát znovu', hl: !dalsiL && !(muzeStrazce && lvl === 3), fn: () => pripravUroven(t, lvl) }, { t: 'Zpět na výpravu', fn: kresli }] });
}

// ---------- souboj se strážcem ----------
function pripravStrazce(t) {
  const f = u => u.kind !== 'kon' || u.mode === 2, kdo = kdoMluvi();
  const ulohy = [...sestav(t.u[0], 3, 1, f), ...sestav(t.u[1], 3, 2, f), ...sestav(t.u[2], 2, 3, f)];
  modal({ nadpis: `Strážce ${t.strazce}`, html: `<div class="sz-uvod">${strazceSvg(+t.id)}<p>${rekni(kdo, 'strazceUvod')}</p><p class="pozn">Osm úloh od základů po jedničkáře. Každá chyba stojí jeden ze tří životů. Nápovědy v souboji nejsou.</p></div>`,
    tlacitka: [{ t: 'Zatím ne' }, { t: 'Do souboje', hl: 1, fn: () => { bezici = serie(app, { typ: 'strazce', ulohy, kdo, zivoty: 3, strazce: { jmeno: t.strazce, seed: +t.id }, onZpet: kresli, onKonec: res => poStrazci(t, res, kdo) }); } }] });
}
function poStrazci(t, res, kdo) {
  const poprve = res.vyhra && !stav.strazci[t.id], kr = poprve ? 30 : 0;
  if (res.vyhra) stav.strazci[t.id] = true;
  stav.krystaly += kr; const povyseni = pripis(res), nove = noveOdznaky(stav, ROCNIKY); uloz();
  zvuk[res.vyhra ? 'hotovo' : 'neuspech'](3);
  vysledek({ nadpis: res.vyhra ? `${t.strazce} je poražen` : `${t.strazce} vyhrál`, obr: `<div class="vysl-sz${res.vyhra ? ' porazen' : ''}">${strazceSvg(+t.id)}</div>`, radky: [`${res.vyreseno} z ${res.n} úloh vyřešeno`], xp: res.xp, kr, kdo, hlaska: rekni(kdo, res.vyhra ? 'strazceVyhra' : 'strazceProhra'), povyseni, nove,
    akce: [...(res.vyhra ? [] : [{ t: 'Odveta', hl: 1, fn: () => pripravStrazce(t) }]), { t: 'Zpět na výpravu', hl: res.vyhra, fn: kresli }] });
}

// ---------- výsledek série ----------
function vysledek(o) {
  app.innerHTML = `<div class="ram"><main class="obsah vysl">
    ${o.obr || ''}${o.hvezdy != null ? `<div class="vysl-hv">${hv(o.hvezdy)}</div>` : ''}
    <h1>${o.nadpis}</h1><p class="vysl-r">${o.radky.join(' · ')}</p>
    <div class="vysl-zisk"><span>+${o.xp} bodů</span>${o.kr ? `<span>${KRYSTAL}+${o.kr}</span>` : ''}</div>
    ${o.hlaska ? `<div class="bublina">${o.kdo !== 'Nikdo' ? `<span class="avatar av-v">${obrazek(o.kdo, o.hvezdy === 0 ? 'premysli' : 'radost')}</span>` : ''}<p>${o.kdo !== 'Nikdo' ? `<b>${o.kdo}:</b> ` : ''}${o.hlaska}</p></div>` : ''}
    ${o.povyseni ? `<p class="vysl-pov">Nová hodnost: <b>${o.povyseni}</b></p>` : ''}
    ${o.nove.length ? `<div class="vysl-odz"><p>Nový odznak</p>${o.nove.map(z => `<div class="odznak ma"><span class="odz-z">${z.z}</span><b>${z.n}</b><small>${z.p}</small></div>`).join('')}</div>` : ''}
    <div class="vysl-akce">${o.akce.map((a, i) => `<button class="btn${a.hl ? ' hl' : ''}" data-i="${i}">${a.t}</button>`).join('')}</div></main></div>`;
  if (o.nove.length) setTimeout(() => zvuk.odznak(), 700);
  $$('.vysl-akce button').forEach(b => b.onclick = () => o.akce[+b.dataset.i].fn());
  window.scrollTo(0, 0);
}

// ---------- obrana města ----------
function obranaUvod() {
  const R = rocnik(), rek = (stav.stat.obrana || {})[R.rocnik] || 0;
  ram(`<section class="karta obr-uvod"><h1>Obrana města</h1>
    <p>Na město padají meteory. Každý nese jednu rychlou úlohu z ${R.rocnik}. ročníku. Správná odpověď meteor sestřelí, špatná ho popožene. Tři vlny, pět štítů.</p>
    <div class="obr-nahled">${mestoSvg(stav.mesto.length ? stav.mesto.slice(-7) : ['domek', 'vez', 'skola', 'mrakodrap', 'hvezdarna'], { H: 150 })}</div>
    <p class="pozn">${stav.mesto.length ? 'Bráníš stavby, které máš ve svém městě.' : 'Zatím bráníš cvičné město. Vlastní stavby si postavíš v záložce Město.'} Rekord pro ${R.rocnik}. ročník: <b>${rek}</b> bodů.</p>
    <button class="btn hl velke" id="b-obr">${DEMO ? 'V plné verzi' : 'Bránit město'}</button></section>`);
  $('#b-obr').onclick = () => {
    if (DEMO) return plna(); odemkni();
    bezici = obrana(app, { rocnik: R, mesto: stav.mesto, onZpet: kresli, onKonec: r => {
      const o = stav.stat.obrana, rekord = r.skore > (o[R.rocnik] || 0), kr = Math.floor(r.skore / 40);
      if (rekord) o[R.rocnik] = r.skore; if (r.ubraneno) stav.stat.ubraneno = (stav.stat.ubraneno || 0) + 1;
      stav.krystaly += kr; stav.xp += r.skore >> 1; const nove = noveOdznaky(stav, ROCNIKY); uloz(); zvuk[r.ubraneno ? 'hotovo' : 'neuspech'](3);
      vysledek({ nadpis: r.ubraneno ? 'Město je ubráněno' : 'Štíty padly', radky: [`${r.skore} bodů`, `${r.zasahu} sestřelených meteorů`, rekord ? 'nový rekord' : `rekord ${o[R.rocnik] || 0}`], xp: r.skore >> 1, kr, kdo: 'Nikdo', nove, akce: [{ t: 'Bránit znovu', hl: 1, fn: () => { zalozka = 'obrana'; kresli(); $('#b-obr').click(); } }, { t: 'Zpět', fn: kresli }] });
    } });
  };
}

// ---------- denní výzva ----------
function vyzva() {
  const R = rocnik(), d = stav.stat.den, hotovo = d.datum === dnes(), serieDni = d.datum === dnes() || d.datum === vcera() ? d.serie : 0;
  ram(`<section class="karta"><h1>Denní výzva</h1>
    <p>Každý den pět úloh napříč tématy ${R.rocnik}. ročníku. Za splnění je 20 krystalů. Když výzvu plníš den po dni, roste ti řada.</p>
    <p class="den-rada"><b>${serieDni}</b> ${serieDni === 1 ? 'den' : serieDni >= 2 && serieDni <= 4 ? 'dny' : 'dní'} v řadě</p>
    ${hotovo ? '<p class="pozn">Dnešní výzva je splněná. Další bude zítra. Můžeš si ji zahrát znovu, už bez odměny.</p>' : ''}
    <button class="btn hl velke" id="b-den">${DEMO ? 'V plné verzi' : hotovo ? 'Zahrát znovu' : 'Začít výzvu'}</button></section>`);
  $('#b-den').onclick = () => {
    if (DEMO) return plna(); odemkni();
    const [y, m, dd] = dnes().split('-').map(Number), kdo = kdoMluvi();
    setRng(mulberry(y * 10000 + m * 100 + dd + R.rocnik * 7919));
    const gens = shuffle(R.temata).slice(0, 5).map(t => pick(t.u[1])), ulohy = gens.map(g => { let u; do { u = g(); } while (u.kind === 'kon' && u.mode === 3); return { u, lvl: 2 }; });
    setRng(null);
    bezici = serie(app, { typ: 'denni', ulohy, kdo, onZpet: kresli, onKonec: res => {
      const uz = stav.stat.den.datum === dnes(), kr = uz ? 0 : 20;
      if (!uz) { stav.stat.den = { datum: dnes(), serie: stav.stat.den.datum === vcera() ? stav.stat.den.serie + 1 : 1 }; }
      stav.krystaly += kr; const povyseni = pripis(res), nove = noveOdznaky(stav, ROCNIKY); uloz(); zvuk.hotovo(2);
      vysledek({ nadpis: 'Denní výzva splněna', radky: [`${res.napoprve} z ${res.n} napoprvé`, `${stav.stat.den.serie}. den v řadě`], xp: res.xp, kr, kdo, hlaska: rekni(kdo, 'denni'), povyseni, nove, akce: [{ t: 'Zpět', hl: 1, fn: kresli }] });
    } });
  };
}

// ---------- město ----------
function mesto(nova) {
  const kdo = kdoMluvi();
  ram(`<section class="karta mesto-k"><h1>Tvoje město</h1>
    <div class="mesto-pano">${mestoSvg(stav.mesto, { H: 170, nova })}</div>
    <p class="pozn">${nova ? rekni(kdo, 'mesto') : 'Stavby jsou složené z útvarů a těles, které tu počítáš. Krystaly získáváš za nové hvězdy, poražené strážce, denní výzvu a obranu města.'}</p>
    <p class="mesto-stav">${KRYSTAL}<b>${stav.krystaly}</b> krystalů · ${stav.mesto.length} z ${STAVBY.length} staveb</p></section>
    <div class="obchod">${STAVBY.map(s => { const ma = stav.mesto.includes(s.id), staci = stav.krystaly >= s.cena;
      return `<div class="stavba${ma ? ' ma' : ''}"><div class="stavba-o">${stavbaSvg(s.id)}</div><b>${s.nazev}</b><small>${s.tvary}</small>
        <button class="btn mini${ma || !staci ? '' : ' hl'}" data-id="${s.id}" ${ma || !staci || DEMO ? 'disabled' : ''}>${ma ? 'postaveno' : `${KRYSTAL}${s.cena}`}</button></div>`; }).join('')}</div>`);
  $$('.obchod button').forEach(b => b.onclick = () => {
    const s = stavba(b.dataset.id); if (stav.krystaly < s.cena || stav.mesto.includes(s.id)) return;
    stav.krystaly -= s.cena; stav.mesto.push(s.id); const nove = noveOdznaky(stav, ROCNIKY); uloz(); odemkni(); zvuk.stavba(); mesto(s.id);
    if (nove.length) toast(`Nový odznak: ${nove.map(x => x.n).join(', ')}`);
  });
}

// ---------- odznaky a přehled ----------
function odznaky() {
  const h = hodnost(), vse = Object.values(stav.urovne).reduce((a, u) => a + (u.hv || 0), 0), max = ROCNIKY.reduce((a, r) => a + r.temata.length * 9, 0);
  ram(`<section class="karta"><h1>${h.nazev}</h1>
    <div class="hod-velka"><i style="width:${Math.round(h.podil * 100)}%"></i></div>
    <p class="pozn">${stav.xp} bodů${h.dalsi ? ` · do hodnosti ${h.dalsi} zbývá ${h.zbyva}` : ''}</p>
    <div class="cisla"><div><b>${vse}</b><span>hvězd z ${max}</span></div><div><b>${stav.stat.uloh}</b><span>vyřešených úloh</span></div><div><b>${Object.keys(stav.strazci).length}</b><span>poražených strážců</span></div><div><b>${stav.stat.combo}</b><span>nejdelší řada</span></div></div></section>
    <section class="karta"><h2>Odznaky</h2><div class="odznaky">${ODZNAKY.map(o => `<div class="odznak${stav.odznaky[o.id] ? ' ma' : ''}"><span class="odz-z">${o.z}</span><b>${o.n}</b><small>${o.p}</small></div>`).join('')}</div></section>
    <section class="karta"><h2>Přehled témat</h2>${ROCNIKY.map(r => `<h3>${r.rocnik}. ročník</h3><table class="prehled"><tbody>${r.temata.map(t => `<tr><th>${t.nazev}</th>${[1, 2, 3].map(l => `<td>${hv(hvezdy(t.id, l))}</td>`).join('')}<td class="pr-s">${stav.strazci[t.id] ? '✓' : ''}</td></tr>`).join('')}</tbody></table>`).join('')}</section>`);
}

// ---------- nastavení ----------
function nastaveni() {
  const M = [['light', 'Světlý'], ['dark', 'Tmavý'], ['girl', 'Růžový']];
  modal({ nadpis: 'Nastavení', html: `<div class="nast">
      <p class="nast-n">Motiv</p><div class="prep" id="n-motiv">${M.map(([k, n]) => `<button class="chip${stav.motiv === k ? ' on' : ''}" data-m="${k}">${n}</button>`).join('')}</div>
      <label class="radek"><input type="checkbox" id="n-zvuk" ${stav.zvuk ? 'checked' : ''}> Zvuky</label>
      <label class="radek"><input type="checkbox" id="n-post" ${stav.postavy ? 'checked' : ''}> Matýsek a Terezka</label>
      <button class="btn mini" id="n-smaz">Vymazat celý postup</button></div>`,
    tlacitka: [{ t: 'Hotovo', hl: 1, fn: kresli }],
    poOtevreni: el => {
      $$('#n-motiv .chip', el).forEach(b => b.onclick = () => { stav.motiv = b.dataset.m; uloz(); motiv(); $$('#n-motiv .chip', el).forEach(x => x.classList.toggle('on', x === b)); });
      $('#n-zvuk', el).onchange = e => { stav.zvuk = e.target.checked; uloz(); motiv(); };
      $('#n-post', el).onchange = e => { stav.postavy = e.target.checked; uloz(); };
      $('#n-smaz', el).onclick = () => modal({ nadpis: 'Vymazat postup?', html: '<p>Smažou se hvězdy, body, krystaly, město i odznaky. Nejde to vrátit.</p>', tlacitka: [{ t: 'Nechat', hl: 1, fn: nastaveni }, { t: 'Vymazat', fn: () => { smaz(); motiv(); zalozka = 'vyprava'; kresli(); } }] });
    } });
}

function uvitani() {
  modal({ nadpis: 'Vítej ve FajnGeometrii', zavritKlikem: false, html: `<div class="vitej"><div class="vitej-p">${avatar('Matýsek', 'av-v')}${avatar('Terezka', 'av-v')}</div>
      <p>Geometrie pro 6. až 9. třídu. Každé téma má tři úrovně: <b>Základy</b> (${POPIS_UROVNE[0]}), <b>Procvičování</b> (${POPIS_UROVNE[1]}) a <b>Jedničkář</b> (${POPIS_UROVNE[2]}).</p>
      <p>Za úlohy sbíráš body, hvězdy a krystaly. Za krystaly stavíš město, které pak bráníš před meteory. Na konci tématu čeká strážce.</p>
      <p class="nast-n">Do které třídy chodíš?</p><div class="prep" id="v-roc">${ROCNIKY.map(r => `<button class="chip${r.rocnik === stav.rocnik ? ' on' : ''}" data-r="${r.rocnik}">${r.rocnik}.</button>`).join('')}</div></div>`,
    tlacitka: [{ t: 'Začít', hl: 1, fn: () => { stav.uvod = true; uloz(); odemkni(); kresli(); } }],
    poOtevreni: el => $$('#v-roc .chip', el).forEach(b => b.onclick = () => { stav.rocnik = +b.dataset.r; $$('#v-roc .chip', el).forEach(x => x.classList.toggle('on', x === b)); }) });
}

nacti(); motiv(); kresli();
if (!stav.uvod) uvitani();
document.addEventListener('pointerdown', odemkni, { once: true });
window.__fg = { get stav() { return stav; }, kresli, ROCNIKY, uloz }; // pro testy
