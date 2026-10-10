#!/usr/bin/env python3
"""Složí celou hru do jednoho samostatného HTML souboru (náhled, poslání e-mailem, vložení jinam).

Použití:  python3 tools/nahled.py [výstup.html] [--demo]

Styly a písma se vloží přímo do stránky, moduly z js/ se spojí do jednoho skriptu.
Zdrojem pravdy zůstávají soubory v js/ a css/ – náhled se vždy generuje znovu.
"""
import base64, re, sys
from pathlib import Path

KOREN = Path(__file__).resolve().parent.parent
IMPORT = re.compile(r"^import\s+\{([^}]*)\}\s+from\s+'\./([\w-]+\.js)';\s*$", re.M)

def zavislosti(jmeno, hotove, poradi):
    if jmeno in hotove:
        return
    hotove.add(jmeno)
    kod = (KOREN / 'js' / jmeno).read_text(encoding='utf-8')
    for m in IMPORT.finditer(kod):
        zavislosti(m.group(2), hotove, poradi)
    poradi.append(jmeno)

def modul(jmeno):
    kod = (KOREN / 'js' / jmeno).read_text(encoding='utf-8')
    kod = IMPORT.sub(lambda m: f"const {{{m.group(1)}}} = __m['{m.group(2)}'];", kod)
    assert not re.search(r'^import\s', kod, re.M), f'{jmeno}: nepodporovaný tvar importu'
    jmena = []
    def vyvoz(m):
        jmena.append(m.group(2)); return f'{m.group(1)} {m.group(2)}'
    kod = re.sub(r'^export\s+(const|let|function|class)\s+([\w$]+)', vyvoz, kod, flags=re.M)
    def vyvoz_seznam(m):
        jmena.extend(x.strip() for x in m.group(1).split(',') if x.strip()); return ''
    kod = re.sub(r'^export\s+\{([^}]*)\};?\s*$', vyvoz_seznam, kod, flags=re.M)
    assert not re.search(r'^export\s', kod, re.M), f'{jmeno}: nepodporovaný tvar exportu'
    return f"__m['{jmeno}'] = (() => {{\n{kod}\nreturn {{ {', '.join(dict.fromkeys(jmena))} }};\n}})();\n"

def styly():
    css = (KOREN / 'css' / 'style.css').read_text(encoding='utf-8')
    def pismo(m):
        data = base64.b64encode((KOREN / 'fonts' / m.group(1)).read_bytes()).decode()
        return f'url(data:font/woff2;base64,{data})'
    return re.sub(r'url\(\.\./fonts/([\w.-]+)\)', pismo, css)

def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    demo = '--demo' in sys.argv
    vystup = Path(args[0]) if args else KOREN / 'nahled.html'
    poradi = []
    zavislosti('app.js', set(), poradi)
    js = 'const __m = {};\n' + ''.join(modul(j) for j in poradi)
    html = (KOREN / 'index.html').read_text(encoding='utf-8')
    html = html.replace('<link rel="stylesheet" href="css/style.css">', f'<style>\n{styly()}\n</style>')
    html = html.replace('<script type="module" src="js/app.js"></script>', ('<script>window.FG_DEMO = true;</script>\n' if demo else '') + f'<script>\n{js}</script>')
    assert 'src="js/app.js"' not in html and 'href="css/style.css"' not in html
    vystup.write_text(html, encoding='utf-8')
    print(f'{vystup} ({vystup.stat().st_size // 1024} kB, {len(poradi)} modulů)')

if __name__ == '__main__':
    main()
