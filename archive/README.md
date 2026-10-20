# Zachované verzie CV

Archív bol pripravený 20. 10. 2026 zo súborov, ktoré skutočne existovali.
Historické dokumenty sa spätne negenerovali ani obsahovo neupravovali.

| Priečinok v `snapshots/` | Význam | Úplnosť |
| --- | --- | --- |
| `01-original-published` | Pôvodný široký publikovaný web, commit `72eab9e`, SK/CS/PL/DE/EN | Celý pôvodný web |
| `02-before-compact` | Lokálne zdroje pred skrátením všeobecného CV | Úplná zdrojová záloha |
| `03-before-grouping` | Pred spojením skladových a zámočníckych zamestnaní | Úplná zdrojová záloha |
| `04-before-balanced-layout` | Pred vyvážením stĺpcov a presunom záľub | Úplná zdrojová záloha |
| `05-before-typography` | Pred zjednotením typografie | Len päť zachovaných súborov; nie samostatný web |
| `06-before-inter` | Pred písmom Inter a jemnejším vzhľadom | Čiastočná záloha CSS, skriptov, údajov a dokumentácie |
| `07-current-generated-web` | Presný uložený webový náhľad s Interom vo všetkých jazykoch | Hotové HTML a statické súbory; návrh na kontrolu |

Aktuálne editovateľné zdroje sú v koreni repozitára. V archívnych snímkach
zostali pôvodné názvy a umiestnenia súborov zo ZIP. Napríklad pri čiastočných
zálohách môže byť `cv.json` priamo na vrchu; v aktuálnom projekte patrí do `data/`.
Čiastočné zálohy nekopírovať naslepo cez aktuálny projekt.

## PDF

- `pdfs/downloads/`: všetkých päť uložených pomenovaných exportov.
  Slovenský je najnovší návrh s Interom. CS/PL/DE/EN sú zo staršieho dizajnu.
- `pdfs/saved-reviews/before-inter-sk.pdf`: slovenské PDF pred prechodom na Inter.
- `pdfs/saved-reviews/download-check.pdf`: starší samostatný slovenský dokument.
- Ostatné súbory v `pdfs/saved-reviews/` sú zachované výstupy kontroly tlače
  vrátane verzií pred/po scrollovaní, bez pozadia a bez JavaScriptu. Nejde vždy
  o iný obsah CV. Archív zámerne zachováva aj tieto existujúce kópie.

Najnovšie slovenské PDF bolo overené na dve A4 strany, kopírovateľný text,
diakritiku a úplnosť všetkých 19 pracovných období. Ostatné jazyky čakajú na
finálny Inter export po kontrole slovenského vzhľadu.

## Pôvodné archívy a história

`backups/` obsahuje nezmenené pôvodné ZIP súbory, ich dostupné kontrolné manifesty,
nový ZIP pôvodného publikovaného commitu a pôvodný Git bundle.
`original-history-2026-09-22.bundle` je historická záloha; nie je to bundle nového
archivačného commitu. Celá aktuálna história patrí do Git histórie repozitára.

`manifest.json` eviduje zdroje, úplnosť verzií a SHA-256 zachovaných súborov.
Priečinky nástrojov, dočasné profily prehliadača, stiahnuté knižnice a celé
pracovné `.review/` nie sú súčasťou archívu.
