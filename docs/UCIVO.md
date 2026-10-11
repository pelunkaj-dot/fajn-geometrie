# FajnGeometrie — rozpis učiva a obtížností

Rozpis učiva a pravidla obtížností. Všechny ročníky (6.–9.) jsou v jedné aplikaci, ročník se přepíná na úvodní obrazovce;
obsah každého ročníku je ve vlastním souboru `js/rN.js`. [K] = konstrukční téma, ostatní jsou výpočtová.

## Tři obtížnosti (zadání autora)

| | Ú1 Základy | Ú2 Procvičování | Ú3 Jedničkář |
|---|---|---|---|
| Pro koho | žák, který o tématu nikdy neslyšel | běžný žák | jedničkář |
| Zadání | jeden pojem, jeden krok, malá celá čísla | jednodušší zadání, jednodušší cesta (1–2 kroky, obrácená úloha, jeden převod) | složité zadání: slovní úloha, složený útvar, více kroků, převody, nadbytečný údaj |
| Odpověď | výběr / číslo, jednotka předvyplněná | číslo, jednotka předvyplněná | jasná a přesná: číslo + žák volí jednotku, přesné zaokrouhlení |
| Nápověda | nejrozsáhlejší: výklad pojmu → obrázek → vzorec → řešený vzor | stupňovaná: co hledám → vzorec → dosazení | jen na vyžádání a za cenu bodů, nikdy dosazení |
| Výpočty | obrázek vždy | obrázek vždy | bez obrázku (náčrtek není třeba) |
| Konstrukce | vedený postup krok za krokem s animací | seřadit připravené kroky, doplnit chybějící | náčrtek + rozbor + zápis postupu + počet řešení |

Reakce na chybu (standard platformy): 1. chyba → znovu + volitelná nápověda;
2. chyba → nápověda automaticky; 3. chyba → řešení. Na Ú1–Ú2 s rozpoznáním typické
chyby (zapomenuté ÷2, průměr místo poloměru, obvod × obsah, chybí odmocnina, špatná jednotka).

## Vyhodnocování (poučení ze starého modulu)

- π: v zadání vždy uvedeno „počítej s π = 3,14“; uznává se výsledek s 3,14 i s tlačítkem π.
- Tolerance odvozená od požadovaného zaokrouhlení, ne pevná ±0,12.
- Desetinná čárka všude (zadání, postup, obrázek), vstup přijme čárku i tečku a mezeru v tisících.
- Česká symbolika: tg (ne tan), podstava u těles, základna u rovinných útvarů.
- Obrázek v měřítku, hledaný prvek označen „?“, skrývání podle prvku, ne podle shody textu.
- Obrázky se střídají: natočení, tupoúhlý trojúhelník s výškou vně, nerovnoramenný lichoběžník.

## Konstrukční úlohy — mechanika

1. **Náčrtek:** neoznačený obecný útvar; žák v něm vyznačí dané prvky (klepnutí na
   stranu / úhel / výšku / těžnici → přiřazení hodnoty ze zadání). Kontrola: správné prvky.
2. **Zápis postupu:** skládání kroků ze stavebnice zápisů
   (`AB; |AB| = 6 cm` · `k; k(A; 5 cm)` · `p; p ⊥ AB, A ∈ p` · `C; C ∈ k ∩ l` · `△ABC`).
   Kontrola: úplnost a přípustné pořadí (krok nesmí použít objekt, který ještě nevznikl);
   uznává se každý správný postup, ne jeden vzorový.
3. **Provedení:** aplikace narýsuje přesně to, co žák zapsal → vidí, zda jeho postup útvar dává.
4. **Počet řešení** (diskuse) jako závěrečná přesná odpověď.

Ú1: kroky předvádí aplikace, žák jen odpovídá na dílčí otázky. Ú2: kroky jsou připravené,
žák je řadí a doplňuje. Ú3: vše sám.

## Učivo po ročnících (jak je v modulu)

[K] = téma s konstrukčními úlohami.

### 6. ročník
- 601 Úhly: druhy, vedlejší a vrcholové úhly, stupně a minuty, úhly u rovnoběžek, hodiny
- 602 Osová souměrnost: obrazy na čtvercové síti, osy souměrnosti útvarů
- 603 Trojúhelník – úhly a strany: součet úhlů, druhy, trojúhelníková nerovnost, vnější úhel
- 604 Trojúhelník – konstrukce [K]: sss, výška, těžnice, těžiště, kružnice opsaná a vepsaná
- 605 Obvod a obsah: čtverec, obdélník, složené útvary, jednotky délky a obsahu
- 606 Krychle a kvádr: povrch, objem, jednotky objemu, litry

### 7. ročník
- 701 Shodnost trojúhelníků [K]: věty sss, sus, usu, konstrukce sus, usu, Ssu
- 702 Středová souměrnost: obrazy na síti, středově souměrné útvary
- 703 Rovnoběžníky: vlastnosti, obvod, obsah, výšky, kosočtverec
- 704 Obsah trojúhelníku a lichoběžníku
- 705 Konstrukce čtyřúhelníků [K]: rovnoběžník, kosočtverec, lichoběžník
- 706 Hranoly: povrch a objem

### 8. ročník
- 801 Pythagorova věta: přepona, odvěsna, obrácená věta, úlohy z praxe, tělesová úhlopříčka
- 802 Kruh a kružnice: π, délka kružnice (obvod kruhu), obsah kruhu, části kruhu, mezikruží
- 803 Tečna a Thaletova kružnice [K]: polohy přímky a kružnice, dvou kružnic, tětiva, tečna z bodu
- 804 Válec: povrch a objem
- 805 Konstrukční úlohy [K]: množiny bodů, trojúhelník z výšky a těžnice

### 9. ročník
- 901 Podobnost: poměr podobnosti, podobné trojúhelníky, měřítko mapy, obsah a k²
- 902 Goniometrické funkce: sin, cos, tg, výpočet strany a úhlu, úlohy z praxe
- 903 Jehlan, kužel, koule: objem a povrch
- 904 Souhrn k přijímačkám: opakování napříč ročníky a složené úlohy

## Co chybí a může přibýt
- úhly v mnohoúhelnících a kruhové oblouky jako samostatné téma
- sítě těles (rozpoznávání), řezy
- dělení úsečky v poměru (konstrukce v 9. ročníku)
- opakování s rozestupy podle chyb konkrétního žáka, přehled pro rodiče
