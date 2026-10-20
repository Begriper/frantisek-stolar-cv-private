# Typography and language review — 2026-09-22

The reported inconsistency was real: standalone employers inherited 14px italic
metadata on screen and 9.5pt italic metadata in print, while grouped employers
used 16px normal text on screen and 10pt normal text in print.

`css/typography.css` is loaded after layout and print styles. It supplies a shared
semantic type scale for all five languages without changing the approved 68/32 layout.

| Text role | Screen | Print | Weight/style |
| --- | --- | --- | --- |
| Name | 30–36px responsive | 26pt | 800, normal |
| Section headings | 20px | 12pt | 800, normal |
| Job/group titles | 18px | 10.5pt | 700, normal |
| Every employer | 16px | 10.5pt | 600, normal |
| Skill subheadings | 16px | 10pt | 700, normal |
| Main body | 16px | 10.5pt | normal |
| Sidebar body | 16px | 10pt | normal |
| Employment/education dates | 14px | 9.5pt | 400, normal |

## Evidence

- `scripts/typography-check.mjs`, invoked by the browser check, compares actual
  computed size, weight, style, family, leading and letter spacing within each role.
- All five locales pass on desktop, mobile and print: 16 employer names, eight
  job/group titles, eight section headings, 20 employment/education dates and four
  skill headings per view. Measurements are in `.review/typography-check.json`.
- Direct inspection of the final Slovak PDF confirms Deltrian, Müller,
  TeleMarCom, Zibura and Isometall all use the same embedded SegoeUI-Semibold font
  at exactly 10.5pt after the PDF transformation matrix is applied.
- Ten data tests, five-language UI/native-print checks, two-page A4/text checks,
  and 15 desktop/tablet/mobile layout checks pass. All five PDF layouts were
  visually inspected; standalone and grouped employers now match.

## Language refinements

- Czech warehouse heading: Pracovník kompletace objednávek / skladník.
- Polish laser marking: Nanoszenie logo na elementy za pomocą lasera.
- German support description: Kundenbetreuung per Telefon und E-Mail; Bearbeitung
  von Reklamationen zu Produkten von Singer, Sanitas und Optimex.
- German field of study: Fachrichtung: Computernetzwerktechnik.
- English metalwork heading: Metalworker / CO₂ Welder.
- English field of study: Computer Network Technician.

These edits improve wording; they do not add qualifications or alter employment facts.
This was an internal language review, not external native-speaker certification.

Backup: `.review/backups/before-typography-20260922-205802.zip` contains the five
pre-edit source files. No content commit, push or publication was performed.
