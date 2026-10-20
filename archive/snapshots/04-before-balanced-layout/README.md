# František Stolár — CV

The original blue, rounded-card website is the current presentation. Visitors print
with the browser's Print command / Ctrl+P, choosing a printer or Save as PDF.
There are no download/print buttons, profile section, theme controls or editorial banners.

## Current implementation

- The five original language HTML files supply the preserved markup and screen design.
- data/cv.json supplies localized employment descriptions, shared dates/employers and supplemental sections.
- scripts/render.mjs injects current content into the original markup.
- css/web-refinements.css preserves the original layout and styles grouped employer entries.
- css/print.css adapts that same page to A4 with blue headings, rounded cards, photo and two columns.
- Generated previews and exports are under dist/; verification artifacts are under .review/ (both ignored).
- The former graphite screen design is unused. The standalone document template remains available only for deferred targeted variants; it is not the general website/PDF renderer.

All five general CVs (SK/CS/PL/DE/EN) are content-aligned and verified at two A4 pages.
All 19 employment periods are retained. Warehousing has one shared card with six
employers (Müller retains four separate periods); metalworking has one card with
four workplaces. Deltrian and TeleMarCom remain separate. Courses and hobbies,
including mountain hiking, are retained. Projects, long IT lists, availability
statements and the copyright footer are absent from public output.
Shared display order and membership live in generalOrder/generalGroups in data/cv.json;
localized titles, per-employer descriptions and sections live in locales.*.generalWeb.
Historical job facts and detailed legacy sections remain intact. All five language
versions include confirmed Deltrian dates (10/2025–04/2026).
Translation drafts were explicitly requested; user review and publication approval
remain pending. The design stays blue, rounded and light-only.
No content changes have been committed, pushed or deployed. The original-version tag
exists locally; uploading it is blocked by GitHub authentication/write permissions.
See docs/VERSIONING.md for verified local backups and recovery steps.

## Development and checks

Node.js 22+ and Playwright 1.62.1 are required. Use the available bundled Playwright
through NODE_PATH, or install the pinned dependency with permission. Chromium or
Microsoft Edge must be available. CV_BROWSER can select an installed channel.

    npm test
    npm run build
    npm run preview

Open http://127.0.0.1:4173/sk/ and use Ctrl+P. CSS handles printing without JavaScript
and without requiring the visitor to scroll. A4/default scale is the verified setup.

    npm run check
    python scripts/verify_browser_print.py
    npm run pdf -- --lang sk
    npm run pdf -- --lang cs
    npm run pdf -- --lang pl
    npm run pdf -- --lang de
    npm run pdf -- --lang en
    python scripts/verify_pdf.py

The UI check exports all five actual pages using print media, before scrolling. It
also checks mobile/desktop, dark saved preferences, no-JS printing, and no-background
printing. Python verifies complete employment and supplemental text, non-splitting job
cards, contact on page one and equivalent content before/after scrolling. It renders
PDF pages for visual inspection. Python dependencies: pypdf, pypdfium2 and Pillow.

npm run pdf produces a developer preview of the Slovak page's native print output;
it does not add a download link to the website. Do not edit generated dist files.
Targeted exports and publication retain explicit approval gates; general translation drafts are authorized. Publication is a
separate final step and no deployment workflow is enabled.
