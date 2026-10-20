# František Stolár — CV

The original blue, rounded-card website is the current presentation. Visitors print
with the browser's Print command / Ctrl+P, choosing a printer or Save as PDF.
There are no download/print buttons, profile section, theme controls or editorial banners.

## Current implementation

- The five original language HTML files supply the preserved markup and screen design.
- data/cv.json supplies localized employment descriptions, shared dates/employers and supplemental sections.
- scripts/render.mjs injects current content into the original markup.
- css/web-refinements.css only fixes column stretching, wrapping and the skip link.
- css/print.css adapts that same page to A4 with blue headings, rounded cards, photo and two columns.
- Generated previews and exports are under dist/; verification artifacts are under .review/ (both ignored).
- The former graphite screen design is unused. The standalone document template remains available only for deferred targeted variants; it is not the general website/PDF renderer.

The current full-content browser print is three A4 pages in each tested language.
Full-content printing is the working default while the optional print-length question
is unanswered; the old two-page target does not silently remove website content.

Slovak includes the confirmed Deltrian employment (10/2025–04/2026).
CZ/PL/DE/EN retain their existing localized content; their editorial update, including
Deltrian, remains pending. Layout verification is not approval of these translations.
Nothing has been committed, pushed or deployed.

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
    npm run pdf
    python scripts/verify_pdf.py

The UI check exports all five actual pages using print media, before scrolling. It
also checks mobile/desktop, dark saved preferences, no-JS printing, and no-background
printing. Python verifies complete employment and supplemental text, non-splitting job
cards, contact on page one and equivalent content before/after scrolling. It renders
PDF pages for visual inspection. Python dependencies: pypdf, pypdfium2 and Pillow.

npm run pdf produces a developer preview of the Slovak page's native print output;
it does not add a download link to the website. Do not edit generated dist files.
Targeted exports/translations retain the explicit approval gates. Publication is a
separate final step and no deployment workflow is enabled.
