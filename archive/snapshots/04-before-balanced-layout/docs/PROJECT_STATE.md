# Project state — 2026-09-22

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
