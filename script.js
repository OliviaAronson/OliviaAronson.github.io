const body = document.body;
const themeButton = document.querySelector('.theme-button');
const savedTheme = localStorage.getItem('oa-theme');
if (savedTheme === 'dark') body.classList.add('dark');
themeButton.addEventListener('click', () => {
  body.classList.toggle('dark');
  localStorage.setItem('oa-theme', body.classList.contains('dark') ? 'dark' : 'light');
});

document.querySelectorAll('.detail-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    const open = panel.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
    button.textContent = button.textContent.replace(open ? '+' : '−', open ? '−' : '+');
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('[data-nav]')];
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.dataset.nav === entry.target.id));
  });
}, { rootMargin: '-35% 0px -55%', threshold: 0 });
sections.forEach(section => navObserver.observe(section));

const poemDialog = document.getElementById('poem-dialog');
document.getElementById('open-poem').addEventListener('click', () => poemDialog.showModal());
document.querySelector('.dialog-close').addEventListener('click', () => poemDialog.close());
poemDialog.addEventListener('click', event => { if (event.target === poemDialog) poemDialog.close(); });

const toast = document.querySelector('.toast');
document.querySelector('.copy-email').addEventListener('click', async event => {
  await navigator.clipboard.writeText(event.currentTarget.dataset.email);
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1700);
});


// Interactive T-beam failure test
const beamCard = document.querySelector('.beam-card');
const beamTestButton = document.querySelector('.beam-test-button');
const beamResult = document.querySelector('.beam-test-result');
let beamTimer;
if (beamCard && beamTestButton && beamResult) {
  beamTestButton.addEventListener('click', () => {
    clearTimeout(beamTimer);
    if (beamCard.classList.contains('failed')) {
      beamCard.classList.remove('failed', 'testing');
      beamResult.textContent = '';
      beamTestButton.textContent = 'Test it to failure';
      return;
    }
    beamCard.classList.remove('failed');
    beamCard.classList.add('testing');
    beamTestButton.disabled = true;
    beamTestButton.textContent = 'Applying load...';
    beamResult.textContent = 'Loading the beam...';
    beamTimer = setTimeout(() => {
      beamCard.classList.remove('testing');
      beamCard.classList.add('failed');
      beamResult.textContent = 'Failure reached. The support change increased measured stiffness by 58%.';
      beamTestButton.disabled = false;
      beamTestButton.textContent = 'Reset test';
    }, 1050);
  });
}

// Five-hold climbing Easter egg
const holds = [...document.querySelectorAll('.climb-hold')];
const routeProgress = document.querySelector('.route-progress');
const topBanner = document.querySelector('.top-banner');
let nextHold = 1;
holds.forEach(hold => {
  hold.addEventListener('click', () => {
    const number = Number(hold.dataset.hold);
    if (number !== nextHold) return;
    hold.classList.remove('active-hold');
    hold.disabled = true;
    routeProgress.classList.add('show');
    routeProgress.textContent = 'Hidden route: ' + number + ' / ' + holds.length;
    nextHold += 1;
    const next = document.querySelector('.climb-hold[data-hold="' + nextHold + '"]');
    if (next) {
      next.classList.add('active-hold');
    } else {
      routeProgress.textContent = 'Hidden route: TOP ✓';
      topBanner.classList.add('show');
      setTimeout(() => topBanner.classList.remove('show'), 4200);
    }
  });
});


// Do Not Press Easter egg
const dangerButton = document.querySelector('.do-not-press');
if (dangerButton) {
  dangerButton.addEventListener('click', () => {
    if (body.classList.contains('integrity-warning')) return;
    body.classList.add('integrity-warning');
    dangerButton.textContent = 'YOU PRESSED IT';
    setTimeout(() => body.classList.add('integrity-safe'), 1450);
    setTimeout(() => {
      body.classList.remove('integrity-warning', 'integrity-safe');
      dangerButton.textContent = 'DO NOT PRESS';
    }, 3300);
  });
}
