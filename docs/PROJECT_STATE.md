# Project state — 2026-10-25

## Design B published

- User approved Slovak content, design B (dark sidebar) and publication of all five
  languages. Review flags in `data/cv.json` are set accordingly.
- All locales render through `scripts/site.mjs` + `css/cv.css`; the legacy HTML
  injection renderer was removed. Experience is split into production, warehouse,
  customer support and short-term sections; the one-day dairy job is hidden.
- Five PDFs verified: two A4 pages each, five clickable links (web, email, phone,
  LinkedIn, GitHub). Portrait is a 480 px crop (`img/portrait.jpg`) of `img/logo.jpg`.
- Release output (`npm run build -- --release`) deployed to Begriper/begriper.github.io.

# Earlier state — 2026-10-20

## Private archival upload — current task

The user explicitly requested committing and uploading all existing CV versions
to a new private repository, for continued work with ChatGPT or Claude. This is
authorization for the archive commit/push; it does not approve public deployment
or final wording/design. Earlier pending-commit notes below are historical.

Repository created: https://github.com/Begriper/frantisek-stolar-cv-private.
GitHub UI confirmed Private, owned by Begriper. No collaborators were added.
The public repository still points to 72eab9e. A separate `private` remote is used,
preserving the existing public `origin`. Upload succeeded: archival commit
`f904049` is on private `main` and `cv/compact-general`; `original-published`
points to 72eab9e. Both original and archive tags were pushed atomically. Remote
refs were checked, and public origin/main remains unchanged at 72eab9e.

Archive includes seven source states, the complete original multilingual website,
all 27 saved PDF files (including technical duplicate review exports), original
backup ZIPs/manifests and the historical Git bundle. Existing files were copied,
not regenerated. All 210 manifest checksums, ZIP CRCs and PDF readability were
verified; ten model tests pass. Full and partial snapshots are explicitly marked.
README.md, AGENTS.md and CLAUDE.md provide starting context for future AI tools.

The latest SK PDF is the Inter design. CS/PL/DE/EN saved PDFs remain from the
preceding design. Their final Inter generation is still pending SK appearance
approval. An archive upload must not be represented as final design approval.

## Current stage — Inter design, Slovak review

Resumed on 2026-10-20 after the interrupted session. The Inter refinement was
already saved; the final documentation update and opening previews had been blocked
by the automatic approval review usage limit.

- Shared styling uses locally hosted Inter 4.1 static weights, natural-case section
  headings at weight 600, lighter shadows, 24px screen card gaps and compact contact
  spacing. The approved font sizes, 68/32 columns, portrait and blue rounded design
  remain. No content or translation changes were made in this revision.
- The saved Slovak PDF has two A4 pages, embedded Inter, all 19 periods and complete
  copyable text. Browser print checks cover before/after scroll, no JavaScript and
  backgrounds disabled. Desktop, tablet and mobile were checked; both PDF pages
  were visually inspected in the preceding session.
- Inter's optional private-use Unicode aliases initially caused broken numeral and
  punctuation extraction in PDF. Prepared static fonts remove only these aliases;
  shapes, metrics and OpenType features remain unchanged. See fonts/inter/README.md
  and scripts/prepare_inter.py. FontTools was isolated under .review/font-tools;
  it is not a runtime or normal build dependency.
- Recovery snapshot: .review/backups/before-inter-20260922-211940.zip. Shared data
  was verified byte-identical to this snapshot.
- Review URL: http://127.0.0.1:4173/sk/?review=inter.
- Review PDF: dist/downloads/Frantisek_Stolar_CV_general_SK.pdf.
- Shared styles also affect the other language web previews, but final generation
  and visual verification of their Inter PDFs await Slovak appearance approval.
  Existing CS/PL/DE/EN PDFs are from the preceding design, not final Inter exports.
- No commit, push or publication. Next: user reviews Slovak web/PDF appearance;
  then complete and verify the other four exports. Concrete diff approval remains
  required before commit; publication requires separate authorization.

## Previous state — before Inter refinement

The reported inconsistent employer typography was fixed in all five
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
