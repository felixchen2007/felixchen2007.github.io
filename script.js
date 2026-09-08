(() => {
  const button = document.querySelector('.menu-button');
  const links = document.querySelector('.nav-links');
  if (!button || !links) return;
  document.documentElement.classList.add('js');
  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    links.classList.toggle('open', open);
    button.querySelector('span').textContent = open ? '−' : '+';
  };
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  links.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });
  const mobile = window.matchMedia('(max-width: 640px)');
  mobile.addEventListener('change', () => setOpen(false));
})();
