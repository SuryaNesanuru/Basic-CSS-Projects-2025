// Expanding Cards Gallery - Script
(function () {
  'use strict';

  // THEME TOGGLE
  const STORAGE_KEY = 'ecg-theme';
  const docEl = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  function getInitialTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {
      // ignore storage errors
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    docEl.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
  }

  applyTheme(getInitialTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = docEl.getAttribute('data-theme') || getInitialTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        // ignore storage errors
      }
    });
  }

  // CARDS INTERACTIVITY
  const cards = Array.from(document.querySelectorAll('.card'));

  // Initialize backgrounds and ARIA
  cards.forEach((card) => {
    const url = card.dataset.img;
    if (url) {
      // Set background image; it will cover with CSS
      card.style.backgroundImage = `url("${url}")`;
    }
    // Ensure ARIA state is initialized
    card.setAttribute('aria-pressed', 'false');
  });

  function setActive(target) {
    if (!target) return;
    cards.forEach((c) => {
      const isActive = c === target;
      c.classList.toggle('active', isActive);
      c.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function clearActive() {
    cards.forEach((c) => {
      c.classList.remove('active');
      c.setAttribute('aria-pressed', 'false');
    });
  }

  // Default to first card active
  if (cards.length > 0) {
    setActive(cards[0]);
  }

  // Click and keyboard handlers
  cards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.closest && target.closest('a')) {
        // allow link clicks inside card
        return;
      }
      setActive(card);
    });

    card.addEventListener('keydown', (e) => {
      const key = e.key;
      if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
        e.preventDefault(); // prevent page scroll on Space
        setActive(card);
      } else if (key === 'Escape' || key === 'Esc') {
        e.stopPropagation();
        clearActive();
      } else if (key === 'ArrowRight') {
        e.preventDefault();
        const next = cards[(index + 1) % cards.length];
        next.focus();
        setActive(next);
      } else if (key === 'ArrowLeft') {
        e.preventDefault();
        const prev = cards[(index - 1 + cards.length) % cards.length];
        prev.focus();
        setActive(prev);
      }
    });
  });

  // Optional: global Escape to clear active
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      clearActive();
    }
  });

  // Respect prefers-reduced-motion in JS-triggered scroll/animations (none used currently)
  // Placeholder for potential future enhancements
})();