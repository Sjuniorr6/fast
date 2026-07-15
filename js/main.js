/* ============ SCROLL REVEAL ============ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      const counter = entry.target.querySelector('.counter');
      if (counter && !counter.dataset.started) {
        counter.dataset.started = 'true';
        animateCounter(counter);
      }
      const counters = entry.target.querySelectorAll('.counter');
      counters.forEach((c) => {
        if (!c.dataset.started) {
          c.dataset.started = 'true';
          animateCounter(c);
        }
      });
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.scroll-reveal').forEach((el) => revealObserver.observe(el));

/* ============ COUNTER ANIMATION ============ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(target * eased);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(tick);
}

document.addEventListener('DOMContentLoaded', () => {
  /* ============ MOBILE MENU ============ */
  document.querySelectorAll('.mobile-menu-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const menu = document.querySelector('.mobile-menu');
      if (menu) menu.classList.add('open');
    });
  });
  document.querySelectorAll('.close-mobile-menu').forEach((btn) => {
    btn.addEventListener('click', () => {
      const menu = btn.closest('.mobile-menu');
      if (menu) menu.classList.remove('open');
    });
  });
  document.querySelectorAll('.mobile-menu-content a').forEach((a) => {
    a.addEventListener('click', () => {
      const menu = a.closest('.mobile-menu');
      if (menu) menu.classList.remove('open');
    });
  });

  /* ============ CARD SPOTLIGHT (efeito mouse) ============ */
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });

  /* ============ NAV ACTIVE LINK ============ */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a.nav-link').forEach((a) => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  /* ============ CARROSSEL MODAL ============ */
  const modal = document.getElementById('carouselModal');
  if (modal) {
    const track = document.getElementById('carouselTrack');
    const thumbs = document.getElementById('carouselThumbs');
    const titleEl = document.getElementById('carouselTitle');
    const tagEl = document.getElementById('carouselTag');
    const descEl = document.getElementById('carouselDescription');
    const counter = document.getElementById('carouselCounter');
    const prevBtn = modal.querySelector('.carousel-prev');
    const nextBtn = modal.querySelector('.carousel-next');
    const closeBtn = modal.querySelector('.carousel-close');

    let currentIndex = 0;
    let images = [];

    function encodePath(name) {
      return 'img/' + name.split('/').map(encodeURIComponent).join('/');
    }

    function render(index) {
      currentIndex = (index + images.length) % images.length;
      track.querySelectorAll('.carousel-slide').forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
      });
      thumbs.querySelectorAll('.carousel-thumb').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === currentIndex);
        if (i === currentIndex) {
          thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
      counter.innerHTML = `<strong>${currentIndex + 1}</strong> / ${images.length}`;
    }

    function openModal(title, imgList, tag, description) {
      images = imgList;
      titleEl.textContent = title;
      if (tagEl) tagEl.textContent = tag || '';
      if (descEl) descEl.textContent = description || '';
      track.innerHTML = '';
      thumbs.innerHTML = '';
      images.forEach((name, i) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        const img = document.createElement('img');
        img.src = encodePath(name);
        img.alt = `${title} — imagem ${i + 1}`;
        img.loading = i === 0 ? 'eager' : 'lazy';
        slide.appendChild(img);
        track.appendChild(slide);

        const thumb = document.createElement('button');
        thumb.className = 'carousel-thumb';
        thumb.setAttribute('aria-label', `Ir para imagem ${i + 1}`);
        const tImg = document.createElement('img');
        tImg.src = encodePath(name);
        tImg.alt = '';
        tImg.loading = 'lazy';
        thumb.appendChild(tImg);
        thumb.addEventListener('click', () => render(i));
        thumbs.appendChild(thumb);
      });
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      render(0);
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.card-clickable').forEach((card) => {
      const raw = card.getAttribute('data-images') || '';
      const list = raw.split('|').map((s) => s.trim()).filter(Boolean);

      /* injeta preview com a primeira imagem */
      if (list.length && !card.querySelector('.card-preview')) {
        const preview = document.createElement('div');
        preview.className = 'card-preview';
        const img = document.createElement('img');
        img.src = encodePath(list[0]);
        img.alt = card.getAttribute('data-title') || '';
        img.loading = 'lazy';
        preview.appendChild(img);
        if (list.length > 1) {
          const badge = document.createElement('span');
          badge.className = 'card-preview-badge';
          badge.textContent = `+${list.length - 1}`;
          preview.appendChild(badge);
        }
        card.insertBefore(preview, card.firstChild);
      }

      card.addEventListener('click', () => {
        if (!list.length) return;
        const title = card.getAttribute('data-title') || '';
        const tag = (card.querySelector('.tag')?.textContent || '').trim();
        const description = (card.querySelector('p')?.textContent || '').trim();
        openModal(title, list, tag, description);
      });
    });

    prevBtn.addEventListener('click', () => render(currentIndex - 1));
    nextBtn.addEventListener('click', () => render(currentIndex + 1));
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') render(currentIndex - 1);
      if (e.key === 'ArrowRight') render(currentIndex + 1);
    });

    /* swipe touch */
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 40) render(currentIndex + (dx < 0 ? 1 : -1));
    });
  }
});

/* ============ SMOOTH SCROLL PARA ÂNCORAS ============ */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});
