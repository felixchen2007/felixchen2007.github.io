# Felix Chen — Engineering Portfolio

A static electrical engineering portfolio with drafting-paper project sheets, a sliding project carousel, project write-ups, and contact links.

## Website files

- `index.html`: portfolio page and project-sheet template
- `style.css`: typography, drafting-paper design, and responsive layout
- `carousel.css`: carousel layout and motion
- `script.js`: carousel navigation and motion
- `projects-data.js`: shared project content
- `projects/*/index.html`: standalone project pages, readable without JavaScript
- `project-page.css`: project-page layout
- `contact/index.html`: contact page with email, LinkedIn, and GitHub
- `site-pages.css`: contact-page layout and shared footer
- `assets/`: project images, self-hosted fonts, and favicon
- `projects.html` and `contact.html`: compatibility redirects for older links

Projects and About remain on the main page. Contact has its own URL at `/contact/`; old `#contact` links redirect there.

The site needs no build step. Serve the repository root with any static web server, or publish the root through GitHub Pages or Vercel.

After editing project content in `projects-data.js`, run `node scripts/build-project-pages.mjs` to regenerate the checked-in project pages. The carousel reads the same content file.

## Previous website

The website replaced on October 22, 2026 is preserved in the [`previous-website-2026-10-22` branch](https://github.com/felixchen2007/felixchen2007.github.io/tree/previous-website-2026-10-22), at commit `d6d6f8b00bf1d24b14da903e43466c9c3fbfdbf8`.

## Fonts

Space Grotesk and IBM Plex Mono are redistributed under the SIL Open Font License 1.1. Their license files are included in `assets/`.
