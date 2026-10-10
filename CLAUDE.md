# FajnGeometrie – zadání projektu

Komunikuj se mnou česky. Šetři tokeny: neopakuj celé soubory, měň jen to, co je potřeba. Po každé změně spusť testy a chyby oprav sám.

## O mně a platformě
Jan, učitel a doučovatel, vývojář platformy fajndoucko.cz (sekce FajnCvičebna).
- Moduly jsou statické stránky na GitHub Pages. Tři motivy vždy: světlý (výchozí), tmavý, „dívčí“ (růžový). Nikdy se neřídí systémovým tmavým režimem.
- Postup při chybě: 1. chyba → znovu (nápověda na tlačítku), 2. chyba → nápověda se ukáže sama, 3. chyba → řešení.
- Skládání souborů z částí Pythonem, nikdy `sed`.
- Postavičky Matýsek (vtipný, důrazný, smí popichovat) a Terezka (milá). Texty v `js/hlasky.js` jsou psané bez tvarů závislých na rodu hráče.
- Český jazykový obsah kontroluju sám.

## Cíl
Geometrie pro 2. stupeň ZŠ po ročnících (6–9), každé téma ve třech obtížnostech:
1. **Základy** – jako kdyby žák o tématu nikdy neslyšel. Výklad před první sérií, tři stupně nápovědy (o co jde → jak na to → dosazení), obrázek, cílená zpráva k typické chybě.
2. **Procvičování** – jednodušší zadání a jednodušší cesta, obrácené úlohy, jeden převod.
3. **Jedničkář** – složité zadání, jasná a přesná odpověď: bez obrázku (výpočty náčrtek nepotřebují), žák volí jednotku, zaokrouhlení musí být přesné, nápověda stojí body. V konstrukčních úlohách náčrtek + zápis postupu + počet řešení.

Nejsou to ukázky: hotový rozsáhlý modul, hra má děti bavit.

## Architektura
Vanilla JS, ES moduly, bez build kroku. Přehled souborů je v README.md.
- **Úloha** je obyčejný objekt z generátoru (`N` číslo, `C` výběr, `DM` stupně a minuty, `GR` síť, `K` konstrukce – viz `js/ulohy.js`). Pole: `text`, `q`, `fig`, `ans`, `unit`, `dec`, `alt`, `traps` (typické chyby se zprávou), `hints`, `steps`, `units` (na úrovni 3 volí jednotku žák).
- **Téma** (`js/rN.js`): `{ id, nazev, ikona, popis, strazce, vyklad: [{h, t, fig}], u: [[úroveň 1], [2], [3]], rychle: [...], kon }`. `rychle` jsou úlohy pro Obranu města (krátké, bez obrázku). `kon: 1` = konstrukční téma (kratší série).
- **π**: v zadání vždy „(π ≐ 3,14)“, `pia()` uzná výsledek s 3,14 i s tlačítkem π.
- **Čísla**: vždy přes `cz()` (desetinná čárka). Indexy v textu `<sub>`, v obrázku `tspan`.
- **Obrázky** jsou v měřítku a barvy berou z CSS proměnných (`fg-*`), takže fungují ve všech motivech.
- **Konstrukce** (`js/kon.js`): krok je objekt (`{op:'circ', name:'k', c:'A', r:5}`), jádro ho opravdu spočítá. Správnost se ověřuje na výsledku (`goal`), ne porovnáním se vzorem – uzná se každý správný postup. Úroveň 1 vede krok za krokem, 2 skládá z připravených kroků (s návnadami), 3 píše žák sám. Žák nesmí nic držet v hlavě: každá úloha `K` má `dano` (u úloh s náčrtkem objekt `{ prvek: hodnota }`, jinak pole zápisů) a `sestroj`; řádek „Dáno / Sestroj“ a obrázek jsou při řešení přichycené nahoře a přepínačem Náčrtek / Rýsování se jde kdykoli vrátit k náčrtku s vepsanými hodnotami. Hotový náčrtek se kreslí ze skutečných bodů řešení (`nacrtekSvg(tpl, giv, dano, body)`), nikdy z pevné šablony: delší strana musí být i na obrázku delší. Pevná šablona slouží jen ve fázi, kdy žák teprve vyznačuje, co je dáno, a hodnoty v ní nejsou. Rýsování musí ukázat každý zapsaný krok: výřez (`kRozsah`) zahrne i přímku, na které ještě neleží žádný bod, a průsečíky čar; pod obrázkem je řádek „Naposledy narýsováno“.
- **Hodnocení série**: napoprvé 1 bod, s chybou 0,5, s ukázaným řešením 0. Hvězdy ★ ≥ 60 %, ★★ ≥ 80 %, ★★★ ≥ 95 % bez ukázaného řešení.
- **Hra**: body → hodnosti, nové hvězdy/strážci/výzva/obrana → krystaly → stavby ve městě. Strážce tématu se odemkne po 3 hvězdách v tématu (8 úloh, 3 životy, bez nápověd).
- **Ovládání**: odevšad musí vést cesta pryč. Každé okno (`modal` v `js/ui.js`) má křížek a zavře ho i Esc, ťuknutí vedle a Zpět v prohlížeči; výjimka je jen uvítání (`pevne`). Zpět nikdy neopustí rozehranou hru: zavře okno → zeptá se na ukončení série → vrátí na výpravu (`zpet()` v `js/app.js`). Nevratná akce (koupě stavby, smazání postupu) se ptá. Kontrola prázdné odpovědi nestojí pokus. Vypínač zvuku je v liště na každé obrazovce.
- Stav hráče: `localStorage`, klíč `fajngeo_v1` (`js/stav.js`). Objekt `stav` se nikdy nepřiřazuje znovu, jen mění.

## Testy (spouštěj po každé změně)
- `node --test tests/*.test.mjs` – každý generátor 150×: texty, desetinné čárky, správná odpověď projde, špatná ne, pasti se neshodují s výsledkem, konstrukční plán vede k cíli, návnady ne.
- `node tests/prohlizec.mjs [ročník]` – automatický hráč projde všechny úrovně přes skutečné rozhraní (server na portu 8765).
- `node tests/ux.mjs [složka]` – ovládání na šířce 360: křížky, Esc, Zpět v prohlížeči, dotazy před odchodem a koupí, tlačítka vidět bez posouvání.
- `node tests/snimky.mjs <složka>` – chybové cesty, strážce, výzva, obrana, město, motivy, ukázka.
- `KROKY=1 node tools/vzorky.mjs 7 703` – výpis ukázek ke čtení.

## Stav (říjen 2026)
Hotovo: ročníky 6–9, 21 témat × 3 úrovně, herní režimy, ukázková verze, jednosouborový náhled (`tools/nahled.py`).
Nezapojeno: ochrana `fdc-guard.js` (viz README), přehled pro rodiče, opakování s rozestupy podle chyb.
