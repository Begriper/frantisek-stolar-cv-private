# Decisions

- One data source, static web routes /sk/, /cs/, /pl/, /de/, /en/.
- Superseded: primary public PDF download buttons. Current public flow uses native browser print.
- Superseded: separate general PDF design. Current general print/PDF uses the website and print CSS.
- Previous single-column/two-page specification now applies only to deferred targeted documents; the full website print retains its original visual identity.
- No DOCX in v1.
- No invented qualifications, metrics, employers, dates or language levels.
- No AI-supplied German level; no CNC experience claimed.
- Nástup v roku 2027; exact date not specified.
- Approval order: Slovak content and Deltrian dates → Slovak PDF layout → translations/variants → publication.
- Legacy source HTML receives profile/theme removal during the Slovak review stage; deploy dist only in a separately approved publication step.

## Graphite redesign — accepted 2026-09-21

- User selected graphite/grey styling: white A4 paper, grey section bands, 30pt name, 11pt body and 10pt metadata.
- Remove professional profiles, header slogan and all visible approval notices from CV outputs. Keep approval gates and noindex internally.
- Confirmed Deltrian employment: 16 October 2025–8 April 2026 (display 10/2025–04/2026).
- Availability in 2027 belongs in additional information, not an introductory profile.
- All routes use light mode regardless of OS or saved theme. No theme selector or theme preference handling.
- First review the revised Slovak PDF and web; complete other translations and targeted variants after Slovak approval. Publication remains separate.

## Original design restored — user correction, 2026-09-21

- Original blue headings, rounded cards, large portrait, round language links and right contact column are the visual reference. Do not redesign them again without an explicit request.
- Remove download/print buttons; use native browser Print / Ctrl+P and Save as PDF.
- Keep profile and internal approval messages removed; light mode only.
- General browser print preserves full web content and original visual style, with adjusted A4 spacing and page breaks. No jobs are silently omitted to force two pages.
- Full-content printing is an announced working assumption pending the optional user question; currently three pages, not a user-confirmed fixed limit.
- Existing factual corrections (including confirmed Deltrian in Slovak) remain. Other language content approval and publication remain separate.

## Compact general CV — approved implementation plan, 2026-09-22

- Target general browser print: at most two A4 pages, original blue design and readable existing type sizes.
- Keep every old short job; summarize its role, employer/workplace and dates. No broad thematic job categories.
- Group only Müller, showing four distinct periods and agency/direct employment note; do not invent agency names or contiguous service.
- Preserve all hobbies and add mountain hiking. Remove project descriptions, exhaustive IT skills, elementary school and generic self-praise from the general display.
- Retain three course providers and dates; self-study is 2025, not ongoing.
- Keep historical facts and full descriptions in shared data; use localized display overrides for shortening.
- Tailored PDFs are generated only when a concrete offer is supplied, remain private/local and do not change the website.
- Original tag and pre-edit local ZIP/history backups are required. Remote backup still blocked by access errors; never describe it as uploaded.
- Slovak review comes before translated compact versions; concrete diff approval before commit; publication remains separately authorized.


## 2026-09-22 — Approved grouped content in five languages (supersedes earlier grouping/translation limits)

- User approved grouping all warehouse employers under one role, and four metalworking workplaces under one role, while keeping per-employer activities/dates and every original period.
- Keep Deltrian, TeleMarCom and the four oldest short jobs separate; retain original visual design, skills and hobbies.
- Remove availability/2027 and copyright footer entirely from general public output.
- Prepare all five localized general drafts now for one final user review. Do not mark translations or publication approved automatically.
- General PDF continues to use native website print. No download/print buttons or targeted exports added.
- Preserve original facts, local recovery snapshots and Git history. Commit requires concrete diff approval; deployment requires separate user approval.
