# Felix Chen — Engineering Portfolio

A static electrical engineering portfolio with drafting-paper project sheets, a sliding project carousel, project write-ups, and contact links.

## Website files

- `index.html`: portfolio page and project-sheet template
- `projects/index.html`: complete project collection
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

Home contains the featured drawing carousel: Weather Monitor, Buck-Boost Converter, and SUBC BMS. All projects (`/projects/`) includes these plus Rainwater Harvester and Arduino Claw. The SUBC BMS entry is marked as in progress and shows the previous SUBC team's 2025 board as a credited reference image. Set `home: false` in the project data to keep an entry only in All projects.

Contact has its own URL at `/contact/`; old `#contact` links redirect there. Older carousel links for unfeatured projects open their detail pages.

Project pages contain a short description, image, contribution/tools, and a GitHub documentation link. Longer write-ups live in each project's repository:

- [Weather Monitor PCB](https://github.com/felixchen2007/weather-monitor-pcb)
- [Buck-Boost Converter](https://github.com/felixchen2007/buck-boost-converter)
- [Rainwater Harvester](https://github.com/felixchen2007/rainwater-harvester)
- [Arduino Claw](https://github.com/felixchen2007/arduino-claw)
- [SUBC BMS](https://github.com/felixchen2007/subc-bms)

The Buck-Boost page has a rotating 3D assembly exported from the Altium design, with copper, pad, and silkscreen surface detail from the current PCB document. It supports drag and zoom, respects reduced-motion preferences, and retains an image fallback. Weather Monitor uses its existing image. Google model-viewer 4.4.0 is self-hosted under `assets/vendor/`, with its license included.

The site needs no build step. Serve the repository root with any static web server, or publish the root through GitHub Pages or Vercel.

After editing project content in `projects-data.js`, run `node scripts/build-project-pages.mjs` to regenerate the checked-in detail pages, project collection, and Home thumbnails. The carousel reads the same content file.

## Previous website

The website replaced on October 22, 2026 is preserved in the [`previous-website-2026-10-22` branch](https://github.com/felixchen2007/felixchen2007.github.io/tree/previous-website-2026-10-22), at commit `d6d6f8b00bf1d24b14da903e43466c9c3fbfdbf8`.

## Fonts

Space Grotesk and IBM Plex Mono are redistributed under the SIL Open Font License 1.1. Their license files are included in `assets/`.
