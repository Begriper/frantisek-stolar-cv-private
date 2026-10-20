# Zálohy, verzie a návrat

## Súkromný archív — 20.10.2026

Používateľ výslovne požiadal commit a upload všetkých dostupných verzií do nového
súkromného repozitára `Begriper/frantisek-stolar-cv-private`. Toto nahrádza staršie
čakanie na povolenie archivačného commitu/pushu. Neschvaľuje nasadenie na verejný web.

Nový repozitár je vytvorený ako Private; na nahratie sa používa samostatný remote
`private`. Pôvodný `origin` smeruje na verejný `begriper.github.io` a nemení sa.
Pôvodná Git história zostáva zachovaná. `archive/README.md` a `archive/manifest.json`
mapujú dostupné zdrojové stavy, čiastočné zálohy, PDF a ich SHA-256.

Pre súkromný repozitár sú určené refs `main`, `cv/compact-general`,
`original-published`, `cv-original-72eab9e` a `cv-private-archive-2026-10-20`.
Nepoužívať `git push --all origin`, aby sa archív omylom nenahral na verejný web.

Nižšie sú ponechané historické záznamy z obdobia pred zriadením privátneho archívu.

## Stav k 22.09.2026

Pôvodný publikovaný commit: `72eab9efbb32d62ec0a738c94e604af0512b3d83`.
Lokálny anotovaný tag: `cv-original-72eab9e`; jeho cieľ bol overený.
Pracovná vetva: `cv/compact-general`. Úpravy zatiaľ nie sú commitnuté.

GitHub záloha NIE JE dokončená. Bežný Git push odmietol prihlásenie
(`Invalid username or token`). GitHub connector pri pokuse o záložnú vetvu
`backup/cv-original-72eab9e` odmietol zápis chybou 403
(`Resource not accessible by integration`); vetva nevznikla.
Pôvodná vetva main na GitHube zostala nezmenená.

Po obnovení prístupu nahrať existujúci tag bez jeho presúvania:

    git push origin refs/tags/cv-original-72eab9e

Potom overiť cieľ vzdialeného tagu. Záložnú vetvu netreba vytvárať,
ak sa podarí nahrať plánovaný tag.

## Overené lokálne zálohy

- `.review/backups/local-before-compact-2026-09-22.zip`: 35 zdrojových súborov pred skrátením vrátane dovtedy neverzovaných súborov. Obsah bol overený cez ZIP CRC a SHA-256 každého súboru.
- `.review/backups/local-before-compact-2026-09-22.manifest.json`: kontrolné súčty archívu a súborov.
- `.review/backups/original-history-2026-09-22.bundle`: úplná Git história a lokálne refs vrátane pôvodného tagu; overené cez `git bundle verify`.

ZIP chráni rozpracované zdrojové súbory. Git bundle chráni commitnutú históriu.
Pri obnove ZIP najskôr rozbaliť do nového priečinka a porovnať obsah;
neprepisovať aktuálnu rozpracovanú prácu bez jej zálohy.

## Nové schválené verzie

1. Skontrolovať slovenský obsah a tlačový výsledok.
2. Po schválení dokončiť ostatné jazyky a ich kontrolu.
3. Pred commitom predložiť konkrétny diff na schválenie podľa D:\Codex\AGENTS.md.
4. Uložiť schválené zmeny na pracovnej vetve a nahrať ich na GitHub.
5. Publikovanie, merge do publikovanej vetvy a označenie release tagom vykonať až na samostatný pokyn.

Nastavenia GitHub Pages zatiaľ nemeníme. Surové rozpracované súbory ani obsah
`exports/private/` sa nepublikujú. Pred publikovaním oddeliť vstupné šablóny
od generovaných HTML, aby nasadenie neprepísalo zdroje.

## Návrat k starej online verzii

Používateľ môže požiadať napríklad: „Vráť online pôvodnú verziu cv-original-72eab9e.“
Pred obnovou sa overí tag/commit, zálohuje rozpracovaná práca a na novej vetve
pripraví obnova publikovaných súborov vybranej verzie. Následne sa skontroluje
náhľad a diff a vytvorí nový obnovovací commit. Git históriu neprepisovať,
nepoužívať force push ani reset --hard. Po publikovaní overiť výsledný web.
Samotné vytvorenie alebo výber tagu živý web automaticky neprepína.

## Cielené PDF

Vytvárať až podľa konkrétnej ponuky. Výber obsahu nesmie meniť všeobecný web
ani historické fakty. Výstupy ukladať do `exports/private/`, ktorý je ignorovaný
Gitom a neleží v publikovanom priečinku dist. Žiadne nové cielené PDF teraz nevznikli.


## Bod obnovy pred zoskupením v piatich jazykoch

`.review/backups/before-grouped-five-languages-2026-09-22.zip` obsahuje 36 zdrojových súborov aktuálneho pracovného stavu pred touto úpravou. Overený manifest SHA-256 je vedľa archívu s príponou `.manifest.json`. Archív ani manifest sa nenahrávali na GitHub. Všetkých 19 pôvodných záznamov zamestnaní bolo po úprave porovnaných so zálohou a zostalo nezmenených.


## Bod obnovy pred vyvážením stĺpcov

`.review/backups/before-balanced-layout-2026-09-22.zip` obsahuje 36 zdrojových súborov pred presunom záľub, pridaním digitálnych zručností a zmenou pomeru stĺpcov. Manifest `.manifest.json` vedľa archívu bol overený pomocou SHA-256. Záloha je lokálna; nemení stav nahratia na GitHub.
