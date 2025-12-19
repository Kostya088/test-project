// плавний скрол та стан active на лінках та disabled
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.footer-nav-link');
  if (!links.length) return;

  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();

      if (link.classList.contains('is-disabled')) return;

      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;

      links.forEach(l => l.classList.remove('is-active'));
      link.classList.add('is-active');

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }

      history.pushState(null, '', targetId);
    });
  });
});
