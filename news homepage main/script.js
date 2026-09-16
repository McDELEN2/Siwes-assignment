const navToggle = document.getElementById('nav-toggle');
const navToggleIcon = document.getElementById('nav-toggle-icon');
const mobileNav = document.getElementById('mobile-nav');

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';

  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

function openMenu() {
  navToggle.setAttribute('aria-expanded', 'true');
  mobileNav.hidden = false;
  navToggleIcon.src = 'assets/images/icon-menu-close.svg';
}

function closeMenu() {
  navToggle.setAttribute('aria-expanded', 'false');
  mobileNav.hidden = true;
  navToggleIcon.src = 'assets/images/icon-menu.svg';
}

// Clicking on the dark overlay background (outside the white nav panel) also closes it
mobileNav.addEventListener('click', (e) => {
  if (e.target === mobileNav) {
    closeMenu();
  }
});
