import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const projects=vm.runInNewContext(fs.readFileSync(path.join(root,'projects-data.js'),'utf8')+'\nprojects;');
const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const pad=value=>String(value).padStart(2,'0');
const home=projects.filter(project=>project.home!==false);
const tabs=home.map((project,index)=>`<button class="project-tab${index===0?' selected':''}" role="tab" id="project-tab-${index}" aria-selected="${index===0}" aria-controls="active-sheet" tabindex="${index===0?'0':'-1'}" data-project="${index}"><img src="${project.image}" alt=""><span><small>PRJ–${String(projects.indexOf(project)+1).padStart(3,'0')}</small><strong>${escape(project.shortTitle)}</strong><em>${project.placeholder?'In progress':escape(project.discipline)}</em></span><b>${pad(index+1)}</b></button>`).join('');
let index=fs.readFileSync(path.join(root,'index.html'),'utf8');
index=index.replace(/<div class="project-tabs"[\s\S]*?(?=\n      <p id="project-announcement")/,`<div class="project-tabs" role="tablist" aria-label="Select a featured project">${tabs}</div>`);
index=index.replace(/<div class="pagination">[\s\S]*?(?=<span class="browse-hint")/,`<div class="pagination"><div class="page-marks" aria-hidden="true">${home.map((_,i)=>`<i${i===0?' class="selected"':''}></i>`).join('')}</div><span id="page-count">01 <em>/ ${pad(home.length)}</em></span></div>`);
index=index.replace(/Sheet 01 of \d+/,`Sheet 01 of ${pad(home.length)}`);
fs.writeFileSync(path.join(root,'index.html'),index);
fs.writeFileSync(path.join(root,'projects/index.html'),`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f4f0e5">
  <meta name="description" content="All of Felix Chen's engineering projects, from PCB design and embedded systems to modeling and electromechanical builds.">
  <title>All projects — Felix Chen</title><link rel="canonical" href="https://felixchen2007.github.io/projects/">
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../style.css?v=20261022-pages"><link rel="stylesheet" href="../site-pages.css?v=20261022-contact"><link rel="stylesheet" href="../collection.css?v=20261024-home">
</head>
<body class="collection-page">
  <a class="skip-link" href="#all-projects">Skip to all projects</a>
  <header class="site-header"><a class="identity" href="../" aria-label="Felix Chen, home"><span class="monogram" aria-hidden="true">F<span>C</span></span><span class="wordmark"><strong>Felix Chen</strong><small>Electrical engineering</small></span></a><nav aria-label="Main navigation"><a href="../">Home</a><a class="active" aria-current="page" href="./">All projects</a><a href="../contact/">Contact <span aria-hidden="true">↗</span></a></nav></header>
  <main class="collection-document" id="all-projects">
    <div class="collection-register"><span>Project index / FC</span><span>${pad(projects.length)} projects</span></div>
    <header class="collection-title"><p class="eyebrow">The full collection</p><h1>All projects<span>.</span></h1><p>Boards, code, models, and the builds that bring them together.</p></header>
    <div class="project-index">${projects.map((project,i)=>`
      <article class="index-project"><a href="${project.id}/"><div class="index-art${project.photo?' index-photo':''}"><span class="index-drawing">PRJ–${String(i+1).padStart(3,'0')}</span>${project.placeholder?'<span class="index-status">In progress</span>':''}<img src="../${project.image}" alt="${escape(project.alt)}" loading="lazy"></div><div class="index-copy"><p class="eyebrow">${escape(project.discipline)}</p><h2>${escape(project.title)} <span aria-hidden="true">↗</span></h2><p>${escape(project.summary)}</p><span class="index-open">${project.placeholder?'View project status':'View project'} →</span></div></a></article>`).join('')}
    </div>
  </main>
  <footer class="site-footer"><span>© 2026 Felix Chen</span><a href="../contact/">Get in touch ↗</a></footer>
</body>
</html>
`);
console.log(`Generated All projects (${projects.length}) and Home thumbnails (${home.length}).`);
