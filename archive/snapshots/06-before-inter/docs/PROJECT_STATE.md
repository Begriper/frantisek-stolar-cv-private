# Project state — 2026-09-22

Latest update: the reported inconsistent employer typography is fixed in all five
languages. Shared text roles are defined in css/typography.css (loaded last).
All employers are 16px/600/normal on screen and 10.5pt/600/normal in print;
dates are 14px/9.5pt, normal. Actual browser style checks and final PDF font
inspection confirm the correction. All five final PDFs remain two A4 pages.
Six small language refinements were made; see docs/TYPOGRAPHY_REVIEW.md.
The approved 68/32 layout remains intact; no commit or publication.


- Workspace: D:\Codex\projects\frantisek-stolar-cv; branch cv/compact-general.
- All five public language previews now use the approved grouped-content structure.
- Eight top-level employment cards: Deltrian, warehouses, TeleMarCom, metalwork, dairy, roofing, Onyx, TamiNet.
- Warehouse card has six employers and nine periods. Metalwork card has four employers/periods. All 19 raw job records compare equal to the pre-edit backup.
- Shared order/membership is in generalOrder/generalGroups; localized wording and sidebar sections in locales.*.generalWeb. Company names and dates come from shared facts, descriptive workplace labels are localized.
- Removed availability/2027 and copyright footer from general public output; availability is also removed from the deferred document renderer. No profile, theme controls, document buttons or review banners.
- Original blue rounded design, photograph, contacts, hobbies and light mode preserved. Projects and long IT lists stay excluded; courses and self-study in 2025 stay concise.
- Local snapshot before this revision: .review/backups/before-grouped-five-languages-2026-09-22.zip (36 source files, verified SHA-256 manifest). Earlier ZIP and full Git bundle remain available.
- Ten Node tests passed. All five languages passed desktop/mobile checks, with dark system/saved preferences still rendering light, no overflow or runtime errors.
- All five actual browser prints and exported general PDFs are two A4 pages. Text, accents, all periods, company descriptions, courses and contact placement verified. Employers and individual courses do not split across pages. Current groups fit intact, so no continuation label is necessary in this layout.
- For each language: text is equal before/after scrolling, with backgrounds disabled and from a mobile viewport with JavaScript disabled. Exports match native browser print.
- All five PDF layouts visually inspected; SK desktop/mobile screenshots inspected. Corrected a course description splitting across pages.
- Five final local review PDFs: dist/downloads/Frantisek_Stolar_CV_general_{SK,CS,PL,DE,EN}.pdf.
- User approval of final wording/translations and concrete diff remains pending. No commit, content push, PR or deployment.
- Original remote main remains 72eab9efbb32d62ec0a738c94e604af0512b3d83. Local tag cv-original-72eab9e points to it. Remote backup upload remains blocked by the previously observed Git login rejection / connector 403; no credentials inspected or changed.
- Next: user reviews all five versions; obtain concrete diff approval before commit, restore GitHub write access for backup upload, publish only on separate final instruction.


## Balanced layout update — 2026-09-22

- Implemented approved 68/32 desktop and print grid, 32px screen / 6mm print gap, aligned photo/name and column headings. Mobile remains one column.
- Hobbies moved into the actual sidebar HTML, after additional information. Main column now contains experience only.
- Added localized digital skills (Excel, Power Query, Power BI, SQL, Python), explicitly from courses and independent study of data analytics in 2025. No project list or expanded IT stack restored.
- Screen cards unified to 12px corners and 16px padding; print cards retain 3mm corners/padding. Dates are below employers. Main print text is 10.5pt; sidebar is 10pt. Natural heights; no forced bottom alignment or filler.
- New verified 36-file recovery snapshot: .review/backups/before-balanced-layout-2026-09-22.zip and SHA-256 manifest. Employment facts, descriptions, order, group membership and hobbies match that backup exactly.
- Ten data tests passed; five-language browser checks passed; additional 15-layout check (1365/768/390px) confirmed sidebar order, desktop proportions/gap, aligned header and stacked dates, with no overflow.
- All five exports regenerated: two A4 pages each, complete selectable text, unchanged 19 periods, jobs/courses kept together; native print matches exports and before/after scroll, mobile no-JS and no-background variants.
- All five PDF montages and SK desktop/mobile layouts visually inspected. Drafts remain local; no commit/push/publication. Existing remote-backup authentication blocker unchanged.
