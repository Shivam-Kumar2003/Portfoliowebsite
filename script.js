/* ═══════════════════════════════════════════════════════
   SHIVAM KUMAR PORTFOLIO — script.js
   Features: sticky nav, dark mode, typewriter,
             scroll reveal, mobile menu, contact form
═══════════════════════════════════════════════════════ */

/* ─── 1. STICKY NAVBAR ─── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


/* ─── 2. DARK / LIGHT THEME TOGGLE ─── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

// Persist user preference
const savedTheme = localStorage.getItem('sk-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('sk-theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line';
}


/* ─── 3. MOBILE HAMBURGER MENU ─── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  // Prevent body scroll when menu open
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu when any link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ─── 4. TYPEWRITER EFFECT ─── */
const words     = ['Data Analyst', 'ML Engineer', 'BI Developer', 'Problem Solver'];
let   wordIndex = 0;
let   charIndex = 0;
let   isDeleting = false;
const typeEl    = document.getElementById('typewriter');

function type() {
  const current = words[wordIndex];

  if (isDeleting) {
    typeEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typeEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === current.length) {
    // Pause at end of word
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex  = (wordIndex + 1) % words.length;
    delay = 400;
  }

  setTimeout(type, delay);
}

// Start typewriter after a small delay
setTimeout(type, 600);


/* ─── 5. SCROLL REVEAL (IntersectionObserver) ─── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings within same parent
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const delay    = siblings.indexOf(entry.target) * 80;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));


/* ─── 6. ACTIVE NAV LINK HIGHLIGHTING (Scroll Spy) ─── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => spyObserver.observe(s));


/* ─── 7. CONTACT FORM — fake submit with validation ─── */
const sendBtn     = document.getElementById('sendBtn');
const formSuccess = document.getElementById('formSuccess');
const nameInput   = document.getElementById('fname');
const emailInput  = document.getElementById('femail');
const msgInput    = document.getElementById('fmessage');

sendBtn.addEventListener('click', () => {
  const name  = nameInput.value.trim();
  const email = emailInput.value.trim();
  const msg   = msgInput.value.trim();

  // Basic validation
  if (!name || !email || !msg) {
    shakeInputs([nameInput, emailInput, msgInput].filter(el => !el.value.trim()));
    return;
  }

  if (!isValidEmail(email)) {
    shakeInputs([emailInput]);
    return;
  }

  // Simulate sending (replace with real API call if needed)
  sendBtn.disabled = true;
  sendBtn.innerHTML = '<i class="ri-loader-4-line spin"></i> Sending…';

  setTimeout(() => {
    sendBtn.innerHTML = '<i class="ri-send-plane-2-line"></i> Send Message';
    sendBtn.disabled  = false;

    formSuccess.classList.add('show');

    nameInput.value  = '';
    emailInput.value = '';
    msgInput.value   = '';

    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1400);
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeInputs(inputs) {
  inputs.forEach(input => {
    input.style.borderColor = '#f87171';
    input.style.boxShadow   = '0 0 0 3px rgba(248,113,113,0.2)';
    input.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(0)' }
    ], { duration: 350, easing: 'ease-out' });

    setTimeout(() => {
      input.style.borderColor = '';
      input.style.boxShadow   = '';
    }, 1800);
  });
}


/* ─── 8. ADD ACTIVE LINK STYLE ─── */
const style = document.createElement('style');
style.textContent = `
  .nav-links a.active { color: var(--text) !important; }
  .nav-links a.active::after { width: 100% !important; }

  /* Spinner for send button */
  .spin { display: inline-block; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);


/* ─── 9. SMOOTH PARALLAX on hero blobs (subtle) ─── */
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  const b1 = document.querySelector('.blob-1');
  const b2 = document.querySelector('.blob-2');
  if (b1) b1.style.transform = `translate(${x * 0.6}px, ${y * 0.6}px)`;
  if (b2) b2.style.transform = `translate(${-x * 0.4}px, ${-y * 0.4}px)`;
}, { passive: true });
