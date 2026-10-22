'use strict';
const projects = [
  {
    id: 'weather-monitor', title: 'Weather Monitor PCB', heading: 'Weather<br>Monitor PCB', shortTitle: 'Weather Monitor', discipline: 'Embedded systems', role: 'Independent project', tools: 'Altium / ESP32 / Firmware',
    image: 'assets/weather-monitor-pcb.png', alt: "3D render of Felix Chen's ESP32 weather monitor PCB", caption: 'PCB assembly / isometric view',
    summary: 'From a breadboard to a custom PCB. An ESP32 weather monitor that brings temperature, humidity, and solar power data to a screen and the web.',
    intro: 'A complete embedded system, developed one iteration at a time.',
    notes: ['ESP32 microcontroller', 'Temperature & humidity sensing', 'Solar power monitoring', 'Display + web interface'],
    sections: [
      ['From breadboard to board', 'I developed the monitor through three iterations: a breadboard prototype, a PCB built around an ESP32 development board, and a fully integrated custom PCB designed in Altium Designer. Each iteration brought more of the system onto one board.'],
      ['Making the sensors talk', 'I wrote firmware to read temperature and humidity from a DHT11 and monitor power using an INA219. Debugging involved checking I²C addresses, communications, and pin assignments so the sensors and controller could work together.'],
      ['Turning measurements into information', 'A 240 × 240 ST7789 TFT display and a custom webpage present the measurements. The project connects hardware design, firmware, and a usable interface in a single system.']
    ]
  },
  {
    id: 'buck-boost-converter', title: 'Adjustable Buck-Boost Converter', heading: 'Buck-Boost<br>Converter', shortTitle: 'Buck-Boost Converter', discipline: 'Power electronics', role: 'Independent project', tools: 'Altium / TPS63000 / Simulink',
    image: 'assets/buck-boost-converter-pcb.png', alt: "3D render of Felix Chen's four-layer adjustable buck-boost converter PCB", caption: 'Four-layer PCB / isometric view',
    summary: 'An adjustable power supply built around the TPS63000. A four-layer PCB taken from schematic and layout through manufacturing and assembly.',
    intro: 'Power electronics, from the feedback network to the physical layout.',
    notes: ['TI TPS63000 converter', 'Adjustable voltage selection', 'Ground and power planes', 'Test points for board bring-up'],
    sections: [
      ['Designing the power stage', 'I independently designed, manufactured, and assembled a four-layer adjustable buck-boost converter using the TI TPS63000. The design includes feedback, enable, input and output filtering, and voltage selection.'],
      ['Layout is part of the circuit', 'I used ground and power planes, kept high-current paths short, and considered thermal behavior throughout the layout. I also imported and checked LCSC and EasyEDA library assets, ran design-rule checks, and added test points.'],
      ['Understanding the behavior', 'I built a simplified Simulink model to explore transient response and control concepts alongside the physical converter design.']
    ]
  },
  {
    id: 'rainwater', title: 'Rainwater Harvester', heading: 'Rainwater<br>Harvester', shortTitle: 'Rainwater Harvester', discipline: 'Systems modeling', role: 'Six-person team', tools: 'Excel / Simulation / Analysis', photo: true,
    image: 'assets/rainwater-1.jpg', alt: 'Rainwater harvesting project design and analysis', caption: 'System design / project documentation',
    summary: 'A rainwater collection and treatment system for a two-person, off-grid household in remote British Columbia. Designed around the whole system.',
    intro: 'Balancing water, energy, and the realities of an off-grid household.',
    notes: ['Rainfall and demand modeling', 'Tank storage and collection', 'Filtration and disinfection', 'Cost and reliability tradeoffs'],
    sections: [
      ['Modeling the household', 'Working in a six-person team, I contributed to an Excel simulation for rainwater harvesting and treatment for a two-person household in a remote British Columbia community. The model considered rainfall, water demand, storage, and energy.'],
      ['Connecting the subsystems', 'The design brought together collection, pumping, filtration, and disinfection. We used pump and system curves to understand how components would operate together.'],
      ['Making practical tradeoffs', 'We compared tank, piping, treatment, and power choices by cost, reliability, and maintenance needs. The objective was a system that made sense as a whole, within the constraints of off-grid living.']
    ]
  },
  {
    id: 'arduino-claw', title: 'Arduino Claw', heading: 'Arduino<br>Claw', shortTitle: 'Arduino Claw', discipline: 'Electromechanical design', role: 'Five-person team', tools: 'Arduino / Sensors / Control', photo: true,
    image: 'assets/arduino-claw-1.jpg', alt: 'The Arduino claw prototype with its mechanical structure and electronics', caption: 'Working prototype / build photograph',
    summary: 'Motors, sensors, code, and a little mechanical persistence. A team-built Arduino claw designed to handle three rounds of a studio competition.',
    intro: 'Bringing mechanical construction and embedded control together.',
    notes: ['Arduino-based control', 'Motor and sensor integration', 'Wiring and mechanical assembly', 'Three-round studio competition'],
    sections: [
      ['Building an integrated prototype', 'In a five-person team, I helped build and program an Arduino claw combining motors, sensors, and mechanical parts. My contributions included sensor-reading and control logic, assembly, and wiring.'],
      ['Testing under real constraints', 'We tested and debugged the integrated system for tasks involving object handling, timed foam-block collection, and cooperative lifting. The competition required the mechanism and control logic to work reliably together.'],
      ['Putting it to the test', 'The team achieved top studio scores across the three-round competition. The project was an exercise in iteration, hands-on integration, and coordinating a build as a team.']
    ]
  }
];
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const pad = (number) => String(number).padStart(2, '0');
let active = 0;
let dialogTrigger = null;
const dialog = $('#project-dialog');
const stage = $('.drawing-stage');
const track = document.createElement('div');
track.className = 'carousel-track';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let cards = [];
const firstProjectSlot = 2;
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

function renderNotes(project) {
  const container = $('#note-accordions');
  container.replaceChildren();
  project.sections.forEach(([title, body], index) => {
    const details = document.createElement('details');
    details.open = index === 0;
    const summary = document.createElement('summary');
    summary.append(makeTextElement('span', pad(index + 1)), document.createTextNode(title));
    details.append(summary, makeTextElement('p', body));
    container.append(details);
  });
}

function buildCarousel() {
  const template = $('#active-sheet');
  // Bookend copies let the last sheet slide straight into the first sheet.
  const order = [projects.length - 2, projects.length - 1, ...projects.map((_, index) => index), 0, 1];
  cards = order.map((projectIndex, slot) => {
    const project = projects[projectIndex];
    const number = pad(projectIndex + 1);
    const drawing = `PRJ–00${projectIndex + 1}`;
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
    field('project-tools').textContent = project.tools;
    field('register-number').textContent = number;
    field('project-image').src = project.image;
    field('project-image').alt = project.alt;
    field('project-image').draggable = false;
    field('project-figure').classList.toggle('photo', !!project.photo);
    field('figure-caption').textContent = `${number} — ${project.caption}`;
    field('detail-image').src = project.image;
    field('design-notes').replaceChildren(...project.notes.map(note => makeTextElement('li', note)));
    field('block-title').textContent = project.title;
    field('block-number').textContent = drawing;
    field('sheet-count').replaceChildren(document.createTextNode('Portfolio collection '), makeTextElement('span', `Sheet ${number} of 04`));
    field('open-project').addEventListener('click', openProject);
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
  if (position < firstProjectSlot || position >= projects.length + firstProjectSlot) {
    position = active + firstProjectSlot;
    stage.classList.add('is-resetting');
    updateCardStates();
    placeTrack(false);
    track.getBoundingClientRect();
    stage.classList.remove('is-resetting');
  }
  moving = false;
  track.classList.remove('is-animating');
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
  const next = ((index % projects.length) + projects.length) % projects.length;
  if (moving) { queuedSelection = {index, options}; return; }
  const previous = active;
  active = next;
  position = active + firstProjectSlot;
  if (options.direction === 1 && previous === projects.length - 1 && active === 0) position = projects.length + firstProjectSlot;
  if (options.direction === -1 && previous === 0 && active === projects.length - 1) position = firstProjectSlot - 1;
  const animate = options.animate !== false && previous !== active && !reducedMotion.matches;
  moving = animate;
  track.classList.toggle('is-animating', moving);
  stage.setAttribute('aria-busy', String(moving));
  updateCardStates();
  placeTrack(options.animate !== false);
  if (animate) settleTimer = setTimeout(finishMovement, 650);
  else finishMovement();
  const project = projects[active];
  const number = pad(active + 1);
  const drawing = `PRJ–00${active + 1}`;
  $('#page-count').replaceChildren(document.createTextNode(number + ' '), makeTextElement('em', '/ 04'));
  $$('.page-marks i').forEach((mark, i) => mark.classList.toggle('selected', i === active));
  $$('.project-tab').forEach((tab, i) => {
    tab.classList.toggle('selected', i === active);
    tab.setAttribute('aria-selected', String(i === active));
    tab.tabIndex = i === active ? 0 : -1;
  });
  $('#notes-id').textContent = drawing;
  $('#notes-intro').textContent = project.intro;
  renderNotes(project);
  if (options.announce !== false) $('#project-announcement').textContent = `Project ${number} of 04: ${project.title}`;
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

function populateDialog() {
  const project = projects[active];
  $('#dialog-number').textContent = `Project ${pad(active + 1)} / ${project.discipline}`;
  $('#dialog-title').textContent = project.title;
  $('#dialog-summary').textContent = project.summary;
  $('#dialog-image').src = project.image;
  $('#dialog-image').alt = project.alt;
  $('#dialog-caption').textContent = project.caption;
  const body = $('#dialog-body');
  body.replaceChildren();
  project.sections.forEach(([title, content]) => {
    const section = document.createElement('section');
    section.append(makeTextElement('h3', title), makeTextElement('p', content));
    body.append(section);
  });
  body.append(makeTextElement('p', `${project.role} · ${project.tools}`, 'dialog-tools'));
  $('.dialog-footer>span').textContent = project.role === 'Independent project' ? 'An independent project by Felix Chen.' : `A ${project.role.toLowerCase()} project. Contributions described above.`;
}

function openProject(event) {
  dialogTrigger = event?.currentTarget || document.activeElement;
  populateDialog();
  dialog.showModal();
  document.body.classList.add('modal-open');
  dialog.scrollTop = 0;
  $('.dialog-close').focus();
}

$('#more-details').addEventListener('click', openProject);
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  const returnTarget = dialogTrigger?.closest('[inert]') ? $(`#project-tab-${active}`) : dialogTrigger;
  returnTarget?.focus({ preventScroll: true });
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
$('.dialog-next').addEventListener('click', () => {
  selectProject(active + 1, {direction: 1, animate: false});
  populateDialog();
  dialog.scrollTop = 0;
  $('.dialog-close').focus();
});
$('.prev').addEventListener('click', () => stepProject(-1));
$('.next').addEventListener('click', () => stepProject(1));
$$('.project-tab').forEach(tab => tab.addEventListener('click', () => selectProject(Number(tab.dataset.project))));
document.addEventListener('keydown', event => {
  if (dialog.open || event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.target.isContentEditable) return;
  const inCarousel = event.target.closest('.project-tabs, .drawing-stage');
  if (!inCarousel) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    selectProject(active + direction, {direction, focusTab: !!event.target.closest('.project-tabs')});
  } else if (event.target.closest('.project-tabs') && (event.key === 'Home' || event.key === 'End')) {
    event.preventDefault();
    selectProject(event.key === 'Home' ? 0 : projects.length - 1, {focusTab: true});
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
const initialIndex = projects.findIndex(project => project.id === initialId);
selectProject(initialIndex >= 0 ? initialIndex : 0, { announce: false, history: false, animate: false });
new ResizeObserver(() => {
  dragOffset = 0;
  gesture = null;
  stage.classList.remove('is-dragging');
  finishMovement();
  placeTrack(false);
}).observe(stage);
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    $$('nav a').forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-15% 0px -50% 0px', threshold: 0 });
['projects', 'about', 'contact'].forEach(id => sectionObserver.observe(document.getElementById(id)));
