# Project state

- Repository: https://github.com/Begriper/begriper.github.io.
- Local checkout: D:\Codex\projects\frantisek-stolar-cv.
- User rejected the graphite redesign and requested the original blue rounded-card site.
- All five preview routes now use their original HTML/CSS presentation with current shared employment data injected. No professional profile, visible editorial notes, theme toggle or PDF/print buttons.
- Screen refinement is deliberately narrow: prevent stretched sidebar sections, wrap long text and keep the skip link offscreen until focused.
- Browser-native printing uses css/print.css; same content, photo, blue headings and rounded cards in two A4 columns. General PDF export now uses this actual page instead of the rejected document template.
- Printing currently includes all website content (three pages in each tested language). This is the explicit working assumption while the optional full-content vs two-page question has no answer.
- Seven Node tests passed. All five routes checked at 1365x900 and 390x844, with OS dark mode and saved dark preference. No horizontal overflow or runtime errors.
- All five actual PDFs checked: A4, complete employment and supplemental text, unsplit job cards, contact on page one. Rendered pages visually inspected.
- SK print text identical before/after scroll, with backgrounds disabled, and on mobile with JavaScript disabled. Exported general PDF matches the browser print text.
- Evidence: .review/ui-check.json, .review/browser-print-check.json, .review/browser-print-*.pdf and rendered screenshots.
- Deltrian dates confirmed: 16.10.2025–08.04.2026. Slovak has this job; the other four editorial updates remain pending under the earlier approval order.
- Existing targeted document machinery is retained offline, with approval gates. It is not used for browser printing.
- No commit, push, PR or deployment. Next: user review of restored original design/print; resolve any print-length preference, then complete remaining editorial localization before publication.
