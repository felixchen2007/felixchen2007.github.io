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
  <link rel="stylesheet" href="../../project-page.css?v=20261022-pages">
</head>
<body class="project-page">
  <a class="skip-link" href="#project">Skip to project</a>
  <header class="site-header">
    <a class="identity" href="../../" aria-label="Felix Chen, home"><span class="monogram" aria-hidden="true">F<span>C</span></span><span class="wordmark"><strong>Felix Chen</strong><small>Electrical engineering</small></span></a>
    <nav aria-label="Main navigation"><a class="active" href="../../?project=${project.id}#projects">Projects <span>04</span></a><a href="../../#about">About</a><a href="#contact">Contact <span aria-hidden="true">↗</span></a></nav>
  </header>
  <main id="project" class="project-document">
    <div class="document-breadcrumb"><a href="../../?project=${project.id}#projects">← All projects</a><span>${drawing} / ${escape(project.discipline)}</span></div>
    <article>
      <header class="case-heading">
        <p class="eyebrow">Project ${number} / ${escape(project.discipline)}</p>
        <h1>${escape(project.title)}</h1>
        <p class="case-summary">${escape(project.summary)}</p>
      </header>
      <figure class="case-figure${project.photo ? ' build-photo' : ''}">
        <div class="figure-register" aria-hidden="true"><span>FC / ${drawing}</span><span>Project reference</span></div>
        <img src="../../${project.image}" alt="${escape(project.alt)}" fetchpriority="high" width="${project.id === 'rainwater' ? 2518 : project.id === 'arduino-claw' ? 614 : project.id === 'weather-monitor' ? 1520 : 1217}" height="${project.id === 'rainwater' ? 1063 : project.id === 'arduino-claw' ? 683 : project.id === 'weather-monitor' ? 939 : 754}">
        <figcaption><span>${number} — ${escape(project.caption)}</span><span>Felix Chen</span></figcaption>
      </figure>
      <div class="case-layout" id="build-notes">
        <aside class="case-sidebar" aria-label="Project facts">
          <p class="eyebrow">At a glance</p>
          <dl class="case-facts"><div><dt>Contribution</dt><dd>${escape(project.role)}</dd></div><div><dt>Tools</dt><dd>${escape(project.tools)}</dd></div><div><dt>Discipline</dt><dd>${escape(project.discipline)}</dd></div></dl>
          <p class="eyebrow">Design focus</p>
          <ul class="case-focus">${project.notes.map(note => `<li>${escape(note)}</li>`).join('')}</ul>
        </aside>
        <div class="case-story">
          <p class="case-intro">${escape(project.intro)}</p>
          ${project.sections.map(([title, body], sectionIndex) => `<section class="story-section" aria-labelledby="section-${sectionIndex + 1}"><span class="story-number" aria-hidden="true">${pad(sectionIndex + 1)}</span><h2 id="section-${sectionIndex + 1}">${escape(title)}</h2><p>${escape(body)}</p></section>`).join('\n          ')}
        </div>
      </div>
    </article>
    <nav class="project-neighbors" aria-label="More projects">
      <a href="../${previous.id}/"><span>← Previous project</span><strong>${escape(previous.shortTitle)}</strong></a>
      <a href="../${next.id}/"><span>Next project →</span><strong>${escape(next.shortTitle)}</strong></a>
    </nav>
  </main>
  <footer class="content-section contact" id="contact"><div><p class="eyebrow">Have something in mind?</p><a class="contact-title" href="mailto:felixchenn22@gmail.com">Let's connect. <span aria-hidden="true">↗</span></a></div><div class="contact-links"><a href="mailto:felixchenn22@gmail.com">Email <span aria-hidden="true">↗</span></a><a href="https://www.linkedin.com/in/felixc2007" target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a><a href="https://github.com/felixchen2007" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a></div><div class="footer-line"><span>© 2026 Felix Chen</span><span>${drawing}</span><a href="../../?project=${project.id}#projects">Back to the drawings ↑</a></div></footer>
</body>
</html>
`;
  const folder = path.join(root, 'projects', project.id);
  fs.mkdirSync(folder, {recursive: true});
  fs.writeFileSync(path.join(folder, 'index.html'), html);
}
console.log(`Generated ${projects.length} standalone project pages.`);
