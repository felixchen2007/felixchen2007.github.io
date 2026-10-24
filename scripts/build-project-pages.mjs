import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projects = vm.runInNewContext(fs.readFileSync(path.join(root, 'projects-data.js'), 'utf8') + '\nprojects;');
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const pad = value => String(value).padStart(2, '0');

for (const [index, project] of projects.entries()) {
  const number = pad(index + 1);
  const drawing = `PRJ–00${index + 1}`;
  const previous = projects[(index + projects.length - 1) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f4f0e5">
  <meta name="description" content="${escape(project.summary)}">
  <meta property="og:title" content="${escape(project.title)} — Felix Chen">
  <meta property="og:description" content="${escape(project.summary)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://felixchen2007.github.io/projects/${project.id}/">
  <meta property="og:image" content="https://felixchen2007.github.io/${project.image}">
  <title>${escape(project.title)} — Felix Chen</title>
  <link rel="canonical" href="https://felixchen2007.github.io/projects/${project.id}/">
  <link rel="icon" href="../../assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../../style.css?v=20261022-pages">
  <link rel="stylesheet" href="../../project-page.css?v=20261024-model">
  <link rel="stylesheet" href="../../site-pages.css?v=20261022-contact">
  ${project.model?'<script type="module" src="../../board-viewer.js?v=20261024-model"></script>':''}
</head>
<body class="project-page">
  <a class="skip-link" href="#project">Skip to project</a>
  <header class="site-header">
    <a class="identity" href="../../" aria-label="Felix Chen, home"><span class="monogram" aria-hidden="true">F<span>C</span></span><span class="wordmark"><strong>Felix Chen</strong><small>Electrical engineering</small></span></a>
    <nav aria-label="Main navigation"><a href="${project.home === false ? '../../' : '../../?project=' + project.id + '#projects'}">Home</a><a href="../" class="active" aria-current="location">All projects</a><a href="../../contact/">Contact <span aria-hidden="true">↗</span></a></nav>
  </header>
  <main id="project" class="project-document">
    <div class="document-breadcrumb"><a href="../">← All projects</a><span>${drawing} / ${escape(project.discipline)}</span></div>
    <article>
      <header class="case-heading">
        <p class="eyebrow">Project ${number} / ${escape(project.discipline)}</p>
        <h1>${escape(project.title)}</h1>
        <p class="case-summary">${escape(project.summary)}</p>
        <a class="primary-button documentation-link" href="${escape(project.github)}" target="_blank" rel="noreferrer">GitHub documentation <span aria-hidden="true">↗</span></a>
      </header>
      <figure class="case-figure${project.photo ? ' build-photo' : ''}">
        <div class="figure-register" aria-hidden="true"><span>FC / ${drawing}</span><span>${project.model?'3D board model':'Project reference'}</span></div>
        ${project.model?`<model-viewer src="../../${project.model}" poster="../../${project.image}" alt="Interactive 3D model of ${escape(project.title)}" camera-controls disable-pan touch-action="pan-y" camera-orbit="35deg 65deg 115%" auto-rotate-delay="1500" rotation-per-second="12deg" shadow-intensity="1" shadow-softness="1" exposure="1" interaction-prompt="none" loading="eager"><img class="viewer-poster" slot="poster" src="../../${project.image}" alt="${escape(project.alt)}"></model-viewer><img class="model-fallback" src="../../${project.image}" alt="${escape(project.alt)}" hidden><div class="model-controls" hidden><button class="text-button model-toggle" type="button">Pause rotation</button><button class="text-button model-reset" type="button">Reset view</button><span>Drag to rotate · Scroll to zoom</span></div>`:`<img src="../../${project.image}" alt="${escape(project.alt)}" fetchpriority="high" width="${project.id === 'rainwater' ? 2518 : project.id === 'arduino-claw' ? 614 : project.id === 'weather-monitor' ? 1520 : project.placeholder ? 900 : 1217}" height="${project.id === 'rainwater' ? 1063 : project.id === 'arduino-claw' ? 683 : project.id === 'weather-monitor' ? 939 : project.placeholder ? 560 : 754}">`}
        <figcaption><span>${number} — ${project.model?'Interactive PCB assembly':escape(project.caption)}</span><span>Felix Chen</span></figcaption>
      </figure>
      <dl class="project-brief" id="build-notes" aria-label="Project details"><div><dt>${project.placeholder?'Status':'Contribution'}</dt><dd>${escape(project.role)}</dd></div><div><dt>Tools</dt><dd>${escape(project.tools)}</dd></div></dl>
    </article>
    <nav class="project-neighbors" aria-label="More projects">
      <a href="../${previous.id}/"><span>← Previous project</span><strong>${escape(previous.shortTitle)}</strong></a>
      <a href="../${next.id}/"><span>Next project →</span><strong>${escape(next.shortTitle)}</strong></a>
    </nav>
  </main>
  <footer class="site-footer"><span>© 2026 Felix Chen</span><a href="../../contact/">Get in touch ↗</a></footer>
</body>
</html>
`;
  const folder = path.join(root, 'projects', project.id);
  fs.mkdirSync(folder, {recursive: true});
  fs.writeFileSync(path.join(folder, 'index.html'), html.replace(/[ \t]+$/gm, ''));
}
console.log(`Generated ${projects.length} standalone project pages.`);
await import('./build-collection.mjs');
