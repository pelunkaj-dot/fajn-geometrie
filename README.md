# FajnGeometrie

Geometrie pro 2. stupeň ZŠ (6.–9. ročník) jako hra. Modul platformy fajndoucko.cz (FajnCvičebna).

- 21 témat ve čtyřech ročnících, každé ve třech obtížnostech: **Základy**, **Procvičování**, **Jedničkář**
- přes 300 typů úloh, všechny se generují s novými čísly
- konstrukční úlohy: náčrtek, zápis postupu ve školní symbolice a narýsování přesně toho, co žák zapsal
- hra: body a hodnosti, hvězdy, krystaly, stavba města, obrana města před meteory, strážci témat, denní výzva, odznaky
- tři motivy (světlý, tmavý, růžový), zvuky, Matýsek a Terezka (jdou vypnout)

## Spuštění

Hra je čisté HTML, CSS a JavaScript bez sestavování. Stačí ji vystavit jako statické stránky.

```
python3 -m http.server 8765
```

a otevřít `http://localhost:8765/`. Přímo ze souboru (`file://`) moduly v prohlížeči nefungují; k tomu slouží jednosouborový náhled:

```
python3 tools/nahled.py            # vytvoří nahled.html, který jde otevřít poklepáním
python3 tools/nahled.py x.html --demo
```

## GitHub Pages

Settings → Pages → Deploy from a branch → `main`, složka `/ (root)`. Hra pak běží na
`https://pelunkaj-dot.github.io/fajn-geometrie/`, ukázková verze na `…/index-demo.html`.

Ukázka (`index-demo.html`) omezuje množství, ne obsah: všechna témata a úrovně, ale jen 3 dokončené série,
jedna obrana města a jedna denní výzva (`DEMO_SERII` a `stav.demo` v `js/app.js`). Strážce se jen představí, město jde prohlédnout, ne stavět.
Počítadlo je v `localStorage`, takže ho jde obejít smazáním dat prohlížeče (stejně jako u ostatních modulů).

**Pro rodiče** (`js/rodice.js`): tlačítko pod seznamem témat a v Nastavení. Přehled je chráněný heslem
(solený SHA-256 v uloženém stavu, zapomenuté heslo s kontrolou dospělého nesmaže výsledky). Ukazuje napoprvé / s pomocí /
neúspěšně, čas řešení, aktivitu za 14 dní, zvládnutí po tématech a úrovních, typické chyby (rady z pastí úloh),
úlohy s ukázaným řešením, poslední výsledky, doporučení co hrát dál a popis didaktiky; jde vytisknout.
Vymazat postup jde jen odtud (heslo, nastavení a počítadlo ukázky zůstanou).

**Opakování** (`js/opakovani.js`): typ úlohy, ve kterém žák chyboval nebo mu bylo ukázáno řešení, se vrací po 1, 3, 7 a 14 dnech.
Vyřešení napoprvé v den, kdy je na řadě, ho posune dál, nová chyba ho vrátí na začátek. Když je něco na řadě, ukáže se na výpravě
karta Opakování (série nejvýš 8 úloh, krystal za každou úlohu napoprvé). V ukázce se série opakování počítá do limitu sérií.

Plná verze (`index.html`) je chráněná stejně jako ostatní moduly: první prvek `<head>` je
`<script src="/fdc-plugin/fdc-guard.js"></script>` (z repozitáře `fdc-plugin`). Bez příchodu z fajndoucko.cz
přesměruje na `index-demo.html`, která ochranu nemá. Náhled z `tools/nahled.py` ochranu vynechá
a testy v prohlížeči ji nahradí prázdným skriptem (hrají jako s platným přístupem).

## Testy

```
node --test tests/*.test.mjs       # obsah: každý generátor úloh se spustí 150× a zkontroluje
python3 -m http.server 8765 --bind 127.0.0.1 &
node tests/prohlizec.mjs           # automatický hráč projde v prohlížeči všech 63 úrovní
node tests/snimky.mjs /tmp/snimky  # chybové cesty, strážce, výzva, obrana, město, motivy + snímky
node tests/ux.mjs                 # ovládání a navigace na úzkém telefonu
```

Testy v prohlížeči potřebují Playwright (cesta k němu jde nastavit proměnnou `PW`).

Ke kontrole textů a výpočtů: `KROKY=1 node tools/vzorky.mjs 8 801` vypíše po jedné ukázce z každého typu úlohy.

## Struktura

| Soubor | Co v něm je |
|---|---|
| `js/r6.js` … `js/r9.js` | obsah ročníků: výklad, generátory úloh, strážci |
| `js/ulohy.js` | stavba úloh a vyhodnocení odpovědí |
| `js/fig.js` | obrázky (SVG, v měřítku, barvy podle motivu) |
| `js/kon.js`, `js/konui.js` | konstrukční stavebnice: jádro a rozhraní |
| `js/hra.js` | série úloh, postup při chybě, nápovědy, body |
| `js/obrana.js`, `js/mesto.js`, `js/odznaky.js` | herní režimy |
| `js/app.js` | obrazovky a navigace |
| `js/rodice.js` | záznam výsledků a přehled pro rodiče |
| `js/opakovani.js` | opakování s rozestupy podle chyb |
| `docs/UCIVO.md` | rozpis učiva a pravidla obtížností |

Pozadí je připravené na fotku jako v ostatních modulech: v `css/style.css` stačí nastavit `--scene-photo: url(...)` (průhlednost `--scene-opacity`).

Písma Atkinson Hyperlegible a Baloo 2 jsou přiložená ve `fonts/` (licence SIL OFL), nic se nenačítá odjinud.
Postup hráče se ukládá jen v jeho prohlížeči.
