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

Ukázka (`index-demo.html`) pustí jen první téma každého ročníku na úrovni Základy.

Ochrana plné verze (`fdc-guard.js` z repozitáře `fdc-plugin`) zatím zapojená není, aby šla hra zkoušet přímým odkazem.
Zapojí se přidáním `<script src="/fdc-plugin/fdc-guard.js"></script>` jako prvního prvku `<head>` v `index.html`.

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
| `docs/UCIVO.md` | rozpis učiva a pravidla obtížností |

Písma Atkinson Hyperlegible a Baloo 2 jsou přiložená ve `fonts/` (licence SIL OFL), nic se nenačítá odjinud.
Postup hráče se ukládá jen v jeho prohlížeči.
