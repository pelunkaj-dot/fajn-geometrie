// Co říkají Matýsek a Terezka. Návrh textů – kontroluje Jan.
// Matýsek: chytrý, vtipný, důrazný, smí popichovat. Terezka: chytrá a milá.
// Hráči tykají. Věty jsou psané tak, aby seděly klukům i holkám (bez tvarů „udělal/udělala“).
// Texty se neopakují, dokud se nevyčerpá celá skupina.

export const HLASKY = {
  'Matýsek': {
    ok: ['Přesně!', 'Sedí jak kružítko v pouzdře.', 'Jo! Takhle se to dělá.', 'Trefa.', 'No vidíš, že to jde.', 'Čistá práce.', 'Bez chyby. Skoro jako já.', 'To bylo rychlé.', 'Správně, jedeme dál.', 'Pecka!'],
    okPozdeji: ['No konečně. Ale platí!', 'Napodruhé taky dobré.', 'Vidíš, stačilo se zamyslet.', 'Tak přece. Dobře!'],
    chyba1: ['Vedle. Zkus to znovu.', 'Tohle ne. Ještě jednou a pomalu.', 'Hele, přepočítej si to.', 'Kdepak. Mrkni na to znovu.', 'Skoro. Jenže skoro se nepočítá.', 'Tudy ne. Zkus to jinak.'],
    chyba2: ['Zase vedle. Tady máš radu.', 'Dobře, poradím ti.', 'Nápověda není ostuda. Čti.', 'Stop. Přečti si nápovědu a pak to zkus.'],
    odhaleni: ['Tak se na to podíváme spolu.', 'Projdi si postup krok za krokem.', 'Nevadí. Příště to dáš.', 'Tohle si zapamatuj, bude se to hodit.'],
    hv3: ['Tři hvězdy! Mám z toho radost.', 'Bezchybně. Smekám.', 'Tohle bylo na jedničku s hvězdičkou.', 'Plný počet. Ale nezpychni!'],
    hv2: ['Dobrá práce. Třetí hvězda čeká.', 'Slušné! Ještě kousek a je to plný počet.', 'Dvě hvězdy. Příště bereme tři, jasné?'],
    hv1: ['Jedna hvězda. Vím, že máš na víc.', 'Základ je. Teď to chce trénink.', 'Dobrý začátek. Zkus to ještě jednou.'],
    hv0: ['Tohle nevyšlo. Mrkni na výklad a zkus to znovu.', 'Nic se neděje. Každý mistr začínal od nuly.', 'Dneska to nešlo. Zkus nižší úroveň, ať se rozjedeš.'],
    strazceUvod: ['Strážce čeká. Žádný strach, známe jeho slabiny.', 'Tohle je souboj. Soustřeď se, nápovědy tu nejsou.', 'Tři životy, žádné rady. Jdeme na něj!'],
    strazceVyhra: ['Strážce je poražen! Tohle téma je tvoje.', 'A je po něm. Paráda!', 'Viděl to někdo? To byl souboj!'],
    strazceProhra: ['Dostal nás. Potrénuj a vrať se.', 'Tentokrát vyhrál on. Odveta bude brzo.', 'Ještě není čas. Projdi si úrovně a zkus to znovu.'],
    obrana: ['Na město padají meteory! Sestřel je správnou odpovědí.', 'Poplach! Braň město, rychle a přesně.', 'Meteory na obzoru. Pal!'],
    mesto: ['Pěkná stavba. Co postavíme příště?', 'Město roste. Líbí se mi to.', 'Tohle by chtělo ještě věž. Nebo raketu!'],
    denni: ['Denní výzva splněna. Zítra zase!', 'Hotovo. A zítra to zopakujeme.'],
  },
  'Terezka': {
    ok: ['Správně!', 'Výborně!', 'Ano, přesně tak.', 'Krásně spočítáno.', 'To se ti povedlo.', 'Sedí to!', 'Skvělé, pokračujeme.', 'Máš to dobře.', 'Šikovně!', 'Paráda!'],
    okPozdeji: ['Teď je to správně!', 'Vidíš, napodruhé to vyšlo.', 'Dobře, že to nevzdáváš.', 'Ano! Takhle je to správně.'],
    chyba1: ['Tohle není ono. Zkus to ještě jednou.', 'Zatím ne. Projdi si to znovu.', 'Někde je chybička. Zkus ji najít.', 'Ještě to nesedí. V klidu to přepočítej.', 'Skoro! Podívej se na to znovu.'],
    chyba2: ['Pomůžu ti, přečti si nápovědu.', 'Nevadí. Tady je rada.', 'Zkusíme to spolu, čti nápovědu.'],
    odhaleni: ['Nevadí, ukážu ti postup.', 'Podívej se, jak se to počítá.', 'To se stane. Projdi si řešení.', 'Příště to půjde líp, uvidíš.'],
    hv3: ['Tři hvězdy! To je nádhera.', 'Všechno správně. Jsem na tebe pyšná.', 'Krásná práce, plný počet!'],
    hv2: ['Moc pěkné! Chybí jen kousek ke třetí hvězdě.', 'Dvě hvězdy, to je dobrý výsledek.', 'Jde ti to. Zkus to ještě jednou na tři.'],
    hv1: ['Jedna hvězda je začátek. Půjde to líp.', 'Dobře, že to zkoušíš. Ještě potrénujeme.', 'Už něco umíš. Zkus to znovu.'],
    hv0: ['Dneska to nevyšlo. Zkus si přečíst výklad.', 'Nevadí. Zkus nejdřív lehčí úroveň.', 'Každý začátek je těžký. Zkusíme to znovu?'],
    strazceUvod: ['Strážce vypadá přísně, ale ty to zvládneš.', 'Souboj začíná. Počítej v klidu a pozorně.', 'Máš tři životy. Nespěchej.'],
    strazceVyhra: ['Strážce je poražen! Gratuluju.', 'To byl krásný souboj. Vyhráváš!', 'Téma je tvoje. Výborně!'],
    strazceProhra: ['Tentokrát to nevyšlo. Zkus to po tréninku znovu.', 'Strážce byl silnější. Příště ho přemůžeš.', 'Nevadí. Projdi si úrovně a vrať se.'],
    obrana: ['Město potřebuje pomoc! Vyber správnou odpověď a meteor zmizí.', 'Padají meteory. Zachráníš město?', 'Pozor, meteory! Počítej rychle, ale pozorně.'],
    mesto: ['Ta stavba městu sluší.', 'Město je zase o kousek hezčí.', 'Krásné! Už se těším na další stavbu.'],
    denni: ['Denní výzva je hotová. Zítra tě čeká další.', 'Splněno! Zítra se zase uvidíme.'],
  },
  'Nikdo': {
    ok: ['Správně.'], okPozdeji: ['Správně.'], chyba1: ['Zkus to znovu.'], chyba2: ['Přečti si nápovědu.'], odhaleni: ['Projdi si postup řešení.'],
    hv3: ['Výborný výsledek.'], hv2: ['Dobrý výsledek.'], hv1: ['Úroveň je splněná.'], hv0: ['Tentokrát to nestačilo. Zkus výklad nebo nižší úroveň.'],
    strazceUvod: ['Souboj se strážcem: tři životy, bez nápověd.'], strazceVyhra: ['Strážce je poražen.'], strazceProhra: ['Strážce vyhrál. Zkus to po tréninku znovu.'],
    obrana: ['Sestřel meteory správnou odpovědí.'], mesto: ['Stavba je postavená.'], denni: ['Denní výzva je splněná.'],
  },
};
const pytle = {};
export function rekni(kdo, skupina) {
  const pole = (HLASKY[kdo] || HLASKY.Nikdo)[skupina] || [''];
  const k = kdo + '/' + skupina;
  if (!pytle[k] || !pytle[k].length) pytle[k] = [...pole].sort(() => Math.random() - 0.5);
  return pytle[k].pop();
}
