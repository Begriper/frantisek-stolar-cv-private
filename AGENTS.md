# CV project guidance for AI tools

- Communicate with František in Slovak. Keep code identifiers in English.
- Start with README.md, archive/README.md, docs/PROJECT_STATE.md and data/cv.json.
- This is intended as a private CV archive. Keep it private and do not deploy the
  public website, add collaborators or grant integrations access without a new
  explicit user request. This archival upload does not approve a public redesign.
- Root files are the latest editable sources. archive/snapshots/01-original-published
  contains the full original multilingual website. Other snapshots are documented
  in archive/README.md; some are partial. Preserve archive files as historical records.
- Do not invent employers, employment periods, skills, achievements, qualifications
  or language proficiency. Shared historical facts are in data/cv.json.
- Current design (approved 2026-10-25, "design B"): dark navy sidebar with portrait,
  contacts, skills, education, courses, languages and hobbies; white main column with
  experience grouped into field sections. Light mode only, no scripts. Template is
  `scripts/site.mjs`, styles `css/cv.css` (screen + A4 print). Native browser print
  (Ctrl+P) is the PDF source and must stay two A4 pages with clickable links.
  No profile ("O mne"), Udemy projects, availability statement, footer or buttons.
  Location is "Lendak, <country>" linked to Google Maps. German level is "basic",
  never a CEFR code. Portrait crop must show the head and both elbows (as on Facebook).
- Latest saved SK PDF uses Inter. Other saved language PDFs predate final Inter
  verification. Do not silently claim every saved artifact is current or approved.
- Keep local dependencies, credentials, caches and browser profiles out of Git.
- Preserve Git history. Commit/push and public deployment are separate actions;
  do not infer future publication authorization from the archive's existence.
