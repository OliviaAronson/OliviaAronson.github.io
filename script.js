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
