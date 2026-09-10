document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------
     Ano dinâmico no rodapé
  ----------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------------------------------------
     Menu mobile
  ----------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && header && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('nav-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860 && header.classList.contains('nav-open')) {
        header.classList.remove('nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* -----------------------------------------------------------
     Scroll suave para links internos
  ----------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* -----------------------------------------------------------
     Animação de entrada: barra de XP do herói
  ----------------------------------------------------------- */
  const xpFill = document.getElementById('xp-fill');
  const xpCount = document.getElementById('xp-count');
  const XP_TARGET = 620;
  const XP_MAX = 850;

  function playXpAnimation() {
    if (!xpFill || !xpCount) return;
    const percent = Math.round((XP_TARGET / XP_MAX) * 100);
    requestAnimationFrame(() => {
      xpFill.style.width = percent + '%';
    });

    const duration = 1300;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      xpCount.textContent = Math.round(eased * XP_TARGET);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    const heroObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          playXpAnimation();
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    heroObserver.observe(heroVisual);
  }

  /* -----------------------------------------------------------
     Revelação suave ao rolar a página
  ----------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.section-head, .problem-item, .feature-card, .step, .compare-table, .solucao-visual'
  );

  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* -----------------------------------------------------------
     Pequeno atraso escalonado para cards dentro de uma mesma grade
  ----------------------------------------------------------- */
  function staggerGroup(selector) {
    document.querySelectorAll(selector).forEach((group, groupIndex) => {
      Array.from(group.children).forEach((child, i) => {
        child.style.transitionDelay = (i * 70) + 'ms';
      });
    });
  }
  staggerGroup('.feature-grid');
  staggerGroup('.problem-list');
  staggerGroup('.steps');

  /* -----------------------------------------------------------
     Formulário de captura de e-mail (lead form)
  ----------------------------------------------------------- */
  const leadForm = document.getElementById('lead-form');
  const leadField = leadForm ? leadForm.querySelector('.lead-field') : null;
  const leadInput = document.getElementById('lead-email');
  const leadError = document.getElementById('lead-error');
  const leadSuccess = document.getElementById('lead-success');

  function isValidEmail(value) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value.trim());
  }

  function showError(message) {
    if (!leadField || !leadError) return;
    leadField.classList.add('has-error');
    leadError.textContent = message;
  }

  function clearError() {
    if (!leadField || !leadError) return;
    leadField.classList.remove('has-error');
    leadError.textContent = '';
  }

  if (leadForm && leadInput) {
    leadInput.addEventListener('input', clearError);

    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = leadInput.value.trim();

      if (email === '') {
        showError('Digite seu e-mail para continuar.');
        leadInput.focus();
        return;
      }

      if (!isValidEmail(email)) {
        showError('Digite um e-mail válido (ex: nome@exemplo.com).');
        leadInput.focus();
        return;
      }

      clearError();

      console.log('Lead capturado:', email);

      leadForm.hidden = true;
      if (leadSuccess) leadSuccess.hidden = false;
    });
  }

});
