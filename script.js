'use strict';
const homeProjects = projects.filter(project => project.home !== false);
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const pad = (number) => String(number).padStart(2, '0');
let active = 0;
const stage = $('.drawing-stage');
const track = document.createElement('div');
track.className = 'carousel-track';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const sheetMotionDuration = 900;
stage.style.setProperty('--sheet-motion-duration', `${sheetMotionDuration}ms`);
let cards = [];
const firstProjectSlot = 3;
let position = firstProjectSlot;
let moving = false;
let queuedSelection = null;
let settleTimer;
let dragOffset = 0;

function makeTextElement(tag, text, className) {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  return element;
}

function buildCarousel() {
  const template = $('#active-sheet');
  // Bookend copies let the last sheet slide straight into the first sheet.
  const order = [homeProjects.length - 3, homeProjects.length - 2, homeProjects.length - 1, ...homeProjects.map((_, index) => index), 0, 1, 2];
  cards = order.map((projectIndex, slot) => {
    const project = homeProjects[projectIndex];
    const number = pad(projectIndex + 1);
    const drawing = `PRJ–${String(projects.indexOf(project) + 1).padStart(3, '0')}`;
    const item = makeTextElement('div', '', 'carousel-item');
    item.dataset.project = projectIndex;
    const sheet = template.cloneNode(true);
    sheet.id = `project-sheet-${slot}`;
    sheet.querySelectorAll('[id]').forEach(element => {
      element.dataset.field = element.id;
      element.id = `sheet-${slot}-${element.id}`;
    });
    sheet.setAttribute('aria-labelledby', `project-tab-${projectIndex}`);
    const field = name => sheet.querySelector(`[data-field="${name}"]`);
    field('project-number').replaceChildren(document.createTextNode(`Project ${number} `), makeTextElement('span', `/ ${project.discipline}`));
    field('project-title').innerHTML = project.heading;
    field('project-summary').textContent = project.summary;
    field('drawing-no').textContent = drawing;
    field('project-discipline').textContent = project.discipline;
    field('project-role').replaceChildren(makeTextElement('span', '', 'status-dot'), document.createTextNode(project.role));
    field('project-role').closest('div').querySelector('dt').textContent = project.placeholder ? 'Status' : 'Contribution';
    field('project-tools').textContent = project.tools;
    field('register-number').textContent = number;
    field('project-image').src = project.image;
    field('project-image').alt = project.alt;
    field('project-image').draggable = false;
    field('project-figure').classList.toggle('photo', !!project.photo || !!project.placeholder);
    field('figure-caption').textContent = `${number} — ${project.caption}`;
    field('detail-image').src = project.image;
    field('design-notes').replaceChildren(...project.notes.map(note => makeTextElement('li', note)));
    field('block-title').textContent = project.title;
    field('block-number').textContent = drawing;
    field('sheet-count').replaceChildren(document.createTextNode('Portfolio collection '), makeTextElement('span', `Sheet ${number} of ${pad(homeProjects.length)}`));
    field('open-project').href = `projects/${project.id}/`;
    sheet.querySelector('.text-button').href = `projects/${project.id}/#build-notes`;
    const preview = makeTextElement('button', '', 'peek-project');
    preview.type = 'button';
    preview.setAttribute('aria-label', `View ${project.title}`);
    preview.addEventListener('click', () => {
      if (!moving) selectProject(projectIndex, {direction: slot < position ? -1 : 1, focusTab: true});
    });
    item.append(sheet, preview);
    track.append(item);
    return {item, sheet, preview, projectIndex};
  });
  template.replaceWith(track);
}

function placeTrack(animate = true) {
  const cardWidth = cards[0].item.getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const left = (stage.clientWidth - cardWidth) / 2 - position * (cardWidth + gap) + dragOffset;
  stage.style.setProperty('--peek-width', `${Math.max((stage.clientWidth - cardWidth) / 2 - gap, 0)}px`);
  track.classList.toggle('no-transition', !animate || reducedMotion.matches);
  track.style.transform = `translate3d(${left}px,0,0)`;
}

function updateCardStates() {
  cards.forEach(({item, sheet, preview}, slot) => {
    const selected = slot === position;
    const neighbor = Math.abs(slot - position) === 1;
    item.classList.toggle('is-current', selected);
    item.classList.toggle('is-before', slot < position);
    item.classList.toggle('is-after', slot > position);
    sheet.inert = !selected;
    sheet.setAttribute('aria-hidden', String(!selected));
    preview.hidden = !neighbor;
    preview.tabIndex = neighbor ? 0 : -1;
  });
  $$('.project-tab').forEach((tab, index) => {
    tab.setAttribute('aria-controls', cards[index === active ? position : index + firstProjectSlot].sheet.id);
  });
}

function finishMovement() {
  clearTimeout(settleTimer);
  if (position < firstProjectSlot || position >= homeProjects.length + firstProjectSlot) {
    position = active + firstProjectSlot;
    stage.classList.add('is-resetting');
    updateCardStates();
    placeTrack(false);
    track.getBoundingClientRect();
    stage.classList.remove('is-resetting');
  }
  moving = false;
  track.classList.remove('is-animating');
  cards.forEach(({item}) => item.classList.remove('is-arriving', 'is-departing'));
  stage.setAttribute('aria-busy', 'false');
  if (queuedSelection) {
    const next = queuedSelection;
    queuedSelection = null;
    requestAnimationFrame(() => selectProject(next.index, next.options));
  }
}
track.addEventListener('transitionend', event => {
  if (event.target === track && event.propertyName === 'transform') finishMovement();
});

function selectProject(index, options = {}) {
  const next = ((index % homeProjects.length) + homeProjects.length) % homeProjects.length;
  if (moving) { queuedSelection = {index, options}; return; }
  const previous = active;
  const departing = cards[position];
  let distance = next - previous;
  if (distance > homeProjects.length / 2) distance -= homeProjects.length;
  if (distance < -homeProjects.length / 2) distance += homeProjects.length;
  if (Math.abs(distance) === homeProjects.length / 2 && options.direction) distance = Math.abs(distance) * options.direction;
  active = next;
  position = previous + firstProjectSlot + distance;
  const animate = options.animate !== false && previous !== active && !reducedMotion.matches;
  moving = animate;
  track.classList.toggle('is-animating', moving);
  stage.setAttribute('aria-busy', String(moving));
  stage.style.setProperty('--sheet-direction', distance < 0 ? '-1' : '1');
  stage.style.setProperty('--ink-entry-offset', distance < 0 ? '-32px' : '32px');
  updateCardStates();
  if (animate) {
    departing.item.classList.add('is-departing');
    cards[position].item.classList.add('is-arriving');
  }
  placeTrack(options.animate !== false);
  if (animate) settleTimer = setTimeout(finishMovement, sheetMotionDuration + 150);
  else finishMovement();
  const project = homeProjects[active];
  const number = pad(active + 1);
  $('#page-count').replaceChildren(document.createTextNode(number + ' '), makeTextElement('em', `/ ${pad(homeProjects.length)}`));
  $$('.page-marks i').forEach((mark, i) => mark.classList.toggle('selected', i === active));
  $$('.project-tab').forEach((tab, i) => {
    tab.classList.toggle('selected', i === active);
    tab.setAttribute('aria-selected', String(i === active));
    tab.tabIndex = i === active ? 0 : -1;
  });
  if (options.announce !== false) $('#project-announcement').textContent = `Project ${number} of ${pad(homeProjects.length)}: ${project.title}`;
  if (options.focusTab) $(`#project-tab-${active}`).focus({ preventScroll: true });
  if (options.history !== false) {
    const url = new URL(window.location.href);
    url.searchParams.set('project', project.id);
    history.replaceState(null, '', url);
  }
}

function stepProject(direction) {
  const base = queuedSelection ? queuedSelection.index : active;
  selectProject(base + direction, {direction});
}

$('.prev').addEventListener('click', () => stepProject(-1));
$('.next').addEventListener('click', () => stepProject(1));
$$('.project-tab').forEach(tab => tab.addEventListener('click', () => selectProject(Number(tab.dataset.project))));
document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.target.isContentEditable) return;
  const inCarousel = event.target.closest('.project-tabs, .drawing-stage');
  if (!inCarousel) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    selectProject(active + direction, {direction, focusTab: !!event.target.closest('.project-tabs')});
  } else if (event.target.closest('.project-tabs') && (event.key === 'Home' || event.key === 'End')) {
    event.preventDefault();
    selectProject(event.key === 'Home' ? 0 : homeProjects.length - 1, {focusTab: true});
  }
});
let gesture = null;
let suppressClickUntil = 0;
stage.addEventListener('pointerdown', event => {
  if (moving || !event.isPrimary || event.button !== 0 || event.target.closest('a,button:not(.peek-project)')) return;
  gesture = {x: event.clientX, y: event.clientY, id: event.pointerId, dragging: false};
});
stage.addEventListener('pointermove', event => {
  if (!gesture || event.pointerId !== gesture.id) return;
  const dx = event.clientX - gesture.x;
  const dy = event.clientY - gesture.y;
  if (!gesture.dragging && Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) { gesture = null; return; }
  if (!gesture.dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
    gesture.dragging = true;
    stage.setPointerCapture(event.pointerId);
    stage.classList.add('is-dragging');
  }
  if (!gesture.dragging) return;
  event.preventDefault();
  dragOffset = Math.max(-cards[0].item.clientWidth * .6, Math.min(cards[0].item.clientWidth * .6, dx));
  placeTrack(false);
});
function endGesture(event, cancelled = false) {
  if (!gesture || event.pointerId !== gesture.id) return;
  const dragged = gesture.dragging;
  const dx = dragOffset;
  gesture = null;
  dragOffset = 0;
  stage.classList.remove('is-dragging');
  if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
  if (!dragged) return;
  suppressClickUntil = Date.now() + 350;
  if (!cancelled && Math.abs(dx) > Math.min(80, cards[0].item.clientWidth * .18)) stepProject(dx < 0 ? 1 : -1);
  else placeTrack(true);
}
stage.addEventListener('pointerup', event => endGesture(event));
stage.addEventListener('pointercancel', event => endGesture(event, true));
stage.addEventListener('lostpointercapture', event => endGesture(event, true));
stage.addEventListener('dragstart', event => event.preventDefault());
stage.addEventListener('click', event => {
  if (Date.now() < suppressClickUntil) { event.preventDefault(); event.stopImmediatePropagation(); }
}, true);
buildCarousel();
const initialId = new URLSearchParams(location.search).get('project');
const initialIndex = homeProjects.findIndex(project => project.id === initialId);
const unfeaturedProject = projects.find(project => project.id === initialId && project.home === false);
if (unfeaturedProject) location.replace(`projects/${unfeaturedProject.id}/`);
selectProject(initialIndex >= 0 ? initialIndex : 0, { announce: false, history: false, animate: false });
new ResizeObserver(() => {
  dragOffset = 0;
  gesture = null;
  stage.classList.remove('is-dragging');
  finishMovement();
  placeTrack(false);
}).observe(stage);
// Keep bookmarked contact-section links working after the move to a page.
function redirectLegacyContact() {
  if (location.hash === '#contact') location.replace(new URL('contact/', location.href));
}
redirectLegacyContact();
window.addEventListener('hashchange', redirectLegacyContact);
